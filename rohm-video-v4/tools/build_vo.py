# Speeds take A up 15% (pitch kept), splits it into script lines using the Scribe word timings
# → vo/vo_fast.wav, vo/<id>.wav, vo/words.json (engine format, orig_start for timing.keepOriginal)
import json, os, subprocess, wave
import numpy as np

SR, SPEED = 48000, 1.15
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
os.makedirs('vo', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'assets/vo/take_a.mp3', '-af', f'atempo={SPEED}', '-ar', str(SR), '-ac', '1', 'vo/vo_fast.wav'], check=True)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'vo/vo_fast.wav', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)

W = [w for w in json.load(open('assets/vo/words.json', encoding='utf-8'))['words'] if w['type'] == 'word'][2:]   # drop "[confident, energetic]"
for w in W:
    w['start'] /= SPEED; w['end'] /= SPEED

# line id → [first word, last word] (indices into W, inclusive), following SCRIPT-v4.md sentences
LINES = {
    'l01': (0, 2), 'l02': (3, 8), 'l03': (9, 15), 'l04': (16, 20), 'l05': (21, 27), 'l06': (28, 36),
    'l07': (37, 41), 'l08': (42, 51), 'l09': (52, 62),
    'l10': (63, 69), 'l11': (70, 82), 'l12': (83, 88), 'l13': (89, 95),
    'l14': (96, 106), 'l15': (107, 112),
    'l16': (113, 125), 'l17': (126, 137), 'l18': (138, 148),
    'l19': (149, 158), 'l20': (159, 168), 'l21': (169, 177),
    'l22': (178, 194),
    'l23': (195, 202), 'l24': (203, 211), 'l25': (212, 219),
    'l26': (220, 230), 'l27': (231, 242), 'l28': (243, 249),
}
ids = list(LINES)
assert LINES[ids[0]][0] == 0 and LINES[ids[-1]][1] == len(W) - 1
for a, b in zip(ids, ids[1:]):
    assert LINES[a][1] + 1 == LINES[b][0], (a, b)

lines = []
for k, lid in enumerate(ids):
    i0, i1 = LINES[lid]; ws = W[i0:i1 + 1]
    # cut at the midpoint of the silence to the neighbouring lines, so no speech sample is lost
    s0 = 0.0 if k == 0 else (W[i0 - 1]['end'] + ws[0]['start']) / 2
    e0 = len(x) / SR if k == len(ids) - 1 else (ws[-1]['end'] + W[i1 + 1]['start']) / 2
    seg = x[int(round(s0 * SR)):int(round(e0 * SR))]
    with wave.open(f'vo/{lid}.wav', 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((np.clip(seg, -1, 1) * 32767).astype('<i2').tobytes())
    s0 = int(round(s0 * SR)) / SR
    lines.append({'id': lid, 'text': ' '.join(w['text'] for w in ws), 'file': f'vo/{lid}.wav', 'dur': round(len(seg) / SR, 4),
                  'words': [{'w': w['text'], 's': round(w['start'] - s0, 4), 'e': round(w['end'] - s0, 4)} for w in ws],
                  'source': 'elevenlabs+scribe', 'orig_start': round(s0, 4), 'orig_end': round(s0 + len(seg) / SR, 4), 'gap_after': 0})
json.dump({'voice': 'ElevenLabs take A ×1.15', 'source': 'own', 'lines': lines}, open('vo/words.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{len(x) / SR:.2f}s total')
for l in lines:
    print(l['id'], l['orig_start'], l['orig_end'], l['text'][:40])
