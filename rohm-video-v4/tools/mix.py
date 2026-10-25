# Final audio mix with real samples: voice (compressed, presence) + SFX from the user's library and ElevenLabs + music bed,
# speech-first ducking, master to -14 LUFS / -1.5 dBTP, muxed onto renders/video.mp4.
#   py -3.12 tools/mix.py [--music path.wav] [--music-gap 16]
import argparse, importlib.util, json, os, subprocess, wave
import numpy as np
from scipy import signal

SR = 48000
ROOT = os.path.join(os.path.dirname(__file__), '..'); os.chdir(ROOT)
LIB = 'C:/Users/MSI/Downloads/خلفات موسيقيه ومؤثرات/مؤثرات'
EL = 'assets/sfx_el'
ENGINE = 'C:/Users/MSI/AppData/Local/Packages/Claude_pzs8sxrjxfjjc/LocalCache/Roaming/Claude/rpm/f2deddd8/82689797/plugin_01WQmCvfZgaf4Xa4pV16NuUz/video-ad-editor/motion'
ap = argparse.ArgumentParser(); ap.add_argument('--music'); ap.add_argument('--music-gap', type=float, default=16.0)
ap.add_argument('--out', default='renders/final.mp4'); A = ap.parse_args()

def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
def db(x): return 10 ** (x / 20)
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12)

# type → candidate files (cycled so repeats vary). anchor: 'start' | 'peak' | 'end'
L = lambda *n: [f'{LIB}/{x}' for x in n]
E = lambda *n: [f'{EL}/{x}' for x in n]
BANK = {
    'impact': (E('impact_long.mp3') + L('Impact 1.wav', 'Impact 2.wav', 'Impact 3.wav'), 'start'),
    'boom': (L('Boom 1.wav', 'Boom 2.wav') + E('impact_long.mp3'), 'start'),
    'sub-drop': (E('subdrop_long.mp3'), 'start'),
    'whoosh': (L(*[f'Cinematic Whoosh {i}.wav' for i in range(1, 7)]), 'peak'),
    'swoosh-pass': (L(*[f'White Whoosh {i}.wav' for i in range(1, 15)]), 'peak'),
    'reverse-whoosh': (L('Cinematic Whoosh 2.wav', 'Cinematic Whoosh 5.wav'), 'end'),     # reversed below
    'riser': (E('riser_long.mp3') + L('Riser 2 -1.mp3', 'Riser 2 -3.mp3'), 'end'),
    'shimmer': (E('shimmer_1.mp3', 'shimmer_2.mp3'), 'start'),
    'tick': (E('tick_1.mp3'), 'start'),
    'pop': (E('pop_1.mp3'), 'start'),
    'slide': (E('slide_1.mp3'), 'start'),
    'typing': (E('beeps_1.mp3'), 'start'),
    'curtain': (E('curtain_long.mp3'), 'start'),
    'applause': (E('applause_long.mp3'), 'start'),
    'stamp': (E('stamp_1.mp3'), 'start'),
    'glitch': (L('Transition 1.mp3'), 'start'), 'scratch': (L('Transition 2.mp3'), 'start'),
}
cache = {}
def sample(kind, k):
    files, anc = BANK[kind]; f = files[k % len(files)]
    if f not in cache:
        x = load(f)
        if kind == 'reverse-whoosh': x = x[::-1].copy()
        nz = np.where(np.abs(x).max(1) > 1e-3)[0]
        if len(nz): x = x[nz[0]:nz[-1] + 1]                                   # trim silence
        x = x / (np.abs(x).max() + 1e-9) * db(-1)                              # peak-normalise every sample
        env = np.sqrt(signal.convolve(np.square(x).mean(1), np.ones(960) / 960, 'same'))
        a = 0 if anc == 'start' else (len(x) if anc == 'end' else int(np.argmax(env)))
        cache[f] = (x, a)
    return cache[f]

spec = importlib.util.spec_from_file_location('engine_audio', f'{ENGINE}/audio.py'); ea = importlib.util.module_from_spec(spec); spec.loader.exec_module(ea)
tl = json.load(open('timeline.json', encoding='utf-8')); N = int(tl['duration'] * SR) + SR

# ── voice: high-pass, presence lift, gentle compression (ffmpeg) ──
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'vo/vo_full.wav', '-af',
                'highpass=f=80,equalizer=f=3200:t=q:w=1.2:g=2.5,equalizer=f=250:t=q:w=1:g=-1.5,acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=3dB',
                '-ar', str(SR), '-ac', '2', 'renders/audio/vo_proc.wav'], check=True)
vo = load('renders/audio/vo_proc.wav')[:N]; vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
speech = np.zeros(N)
for line in tl['vo']:
    for w in line['words']: speech[int(w['s'] * SR):int(w['e'] * SR)] = 1
k = signal.windows.hann(int(0.25 * SR)); speech = np.clip(signal.convolve(speech, k / k.sum() * 3, 'same'), 0, 1)   # smooth envelope
vo_ref = rms_db(vo[speech > 0.5])

# ── sfx bus ──
sfx = np.zeros((N, 2)); use = {}
for c in json.load(open('sfx.json', encoding='utf-8')):
    kind = c['type']
    if kind not in BANK: print('  skip', kind); continue
    n = use.get(kind, 0); use[kind] = n + 1
    x, a = sample(kind, n)
    t = ea.resolve_at(c['at'], tl); i = int(round(t * SR)) - a
    g = db(float(c.get('gain', 0)) - 4)
    j0, j1 = max(0, i), min(N, i + len(x))
    if j1 > j0: sfx[j0:j1] += x[j0 - i:j1 - i] * g
sfx_level = vo_ref - 9 - rms_db(sfx[np.abs(sfx).max(1) > 1e-4])       # loud hits sit ~9 dB under the voice on average
sfx *= db(sfx_level) * (1 - 0.45 * speech)[:, None]                    # and dip ~5 dB while someone is speaking

# ── music bed ──
bed = np.zeros((N, 2))
if A.music:
    m = load(A.music)
    if len(m) < N: m = np.concatenate([m] * (N // len(m) + 1))
    bed = m[:N].copy()
    fade = int(2.0 * SR); bed[N - SR - fade:N - SR] *= np.linspace(1, 0, fade)[:, None]; bed[N - SR:] = 0
    hp = signal.butter(4, 200, 'hp', fs=SR, output='sos')
    gap_now = rms_db(signal.sosfilt(hp, vo[speech > 0.5], axis=0)) - rms_db(signal.sosfilt(hp, bed[speech > 0.5], axis=0))
    bed *= db(gap_now - A.music_gap)                                    # bed sits music-gap dB under speech (>200 Hz)
    bed *= (db(-4) + (1 - db(-4)) * (1 - speech))[:, None]               # extra 4 dB duck during speech, back up between lines

mix = vo + sfx + bed
ea.write_wav('renders/audio/mix_samples.wav', mix)
# ── master: two-pass loudnorm to -14 LUFS / -1.5 dBTP, then mux ──
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'renders/audio/mix_samples.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
js = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'renders/video.mp4', '-i', 'renders/audio/mix_samples.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-af', ln + ',aresample=48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', A.out], check=True)
hp = signal.butter(4, 200, 'hp', fs=SR, output='sos'); sp = speech > 0.5
v2, b2, s2 = (rms_db(signal.sosfilt(hp, z[sp], axis=0)) for z in (vo, bed, sfx))
print(f'voice vs music (>200 Hz, during speech): {v2 - b2:.1f} dB · voice vs sfx: {v2 - s2:.1f} dB · {use}')
print('done:', A.out)
