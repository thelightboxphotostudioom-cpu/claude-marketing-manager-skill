# English VO: one ElevenLabs take per script line (with character timestamps), each fitted into the same slot as the
# Arabic line so every visual beat still lands → vo_en/vo_full_en.wav + vo_en/words_en.json
# Needs XI_KEY in the environment (never stored in the project).
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

SR = 48000
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
VOICE = 'JBFqnCBsd6RMkjVDRZzb'                      # George — warm British storyteller
EN = {
    'l01': 'In 2001,',
    'l02': 'the late Sultan Qaboos ordered',
    'l03': 'a building unlike anything in the Gulf.',
    'l04': 'A hall that transforms at one touch,',
    'l05': 'and a fifty-ton organ that moves on rails.',
    'l06': 'This is the Royal Opera House Muscat. Here is its story.',
    'l07': 'Sultan Qaboos was a lover of music.',
    'l08': 'In 1985 he founded the Royal Oman Symphony Orchestra, every musician Omani.',
    'l09': 'He wanted a worthy home for that dream: for the people of Oman, and for humanity.',
    'l10': 'The design won an international competition in 2003,',
    'l11': 'and construction began in 2007, on eighty thousand square meters at Shatti Al Qurum.',
    'l12': 'Its facade is Omani desert-rose stone,',
    'l13': 'its arcades and towers echo the forts of Nakhal and Bahla.',
    'l14': 'Step inside: a hand-carved teak ceiling, gilded with gold leaf,',
    'l15': 'Italian marble, and Austrian crystal chandeliers.',
    'l16': 'And here is the secret: at the push of a button, a 500-ton acoustic wall rolls on rails.',
    'l17': 'The proscenium rises, the orchestra pit lifts, and the front two rows sink into the floor,',
    'l18': 'turning an eleven-hundred-seat opera house into a classical concert hall.',
    'l19': "The organ was built by Germany's Klais: four thousand, five hundred and forty-two pipes,",
    'l20': 'seventy stops, around fifty tons, and it moves on rails.',
    'l21': 'It has special voices called the Royal Solo, in honor of Sultan Qaboos.',
    'l22': 'It was the first opera house in the world with an interactive screen on every seat, translating the opera into your language.',
    'l23': 'On October twelfth, 2011,',
    'l24': 'the curtain rose on Turandot, directed by Zeffirelli and conducted by Placido Domingo,',
    'l25': 'with some three hundred and fifty Italian artists flown in for the night.',
    'l26': 'Since then, Andrea Bocelli, Yo-Yo Ma and Renee Fleming have graced its stage.',
    'l27': 'And today, for its fifteenth anniversary: twenty-eight shows over forty-three nights.',
    'l28': 'Save this video, and tell us: have you seen a show there?',
}
tl = json.load(open('timeline.json', encoding='utf-8'))
slots = {L['id']: [L['start'], L['end']] for L in tl['vo']}
ids = [L['id'] for L in sorted(tl['vo'], key=lambda L: L['start'])]
os.makedirs('vo_en', exist_ok=True)
H = {'xi-api-key': os.environ['XI_KEY'], 'Content-Type': 'application/json'}

def pcm(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)

N = int(tl['duration'] * SR) + SR; full = np.zeros(N, np.float32); words = []; prev_text = ''
for k, lid in enumerate(ids):
    text = EN[lid]; mp3, aj = f'vo_en/{lid}.mp3', f'vo_en/{lid}.json'
    if not (os.path.exists(mp3) and os.path.exists(aj) and json.load(open(aj)).get('text') == text):
        body = {'text': text, 'model_id': 'eleven_multilingual_v2', 'output_format': 'mp3_44100_192',
                'voice_settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True, 'speed': 1.05},
                'previous_text': prev_text, 'next_text': EN[ids[k + 1]] if k + 1 < len(ids) else ''}
        r = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps', headers=H, json=body, timeout=180)
        if not r.ok: sys.exit(f'{lid}: {r.status_code} {r.text[:300]}')
        d = r.json(); open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
        json.dump({'text': text, 'alignment': d['alignment']}, open(aj, 'w'))
    prev_text = text
    al = json.load(open(aj))['alignment']; x = pcm(mp3)
    # trim leading/trailing silence, remember the offset for the word times
    nz = np.where(np.abs(x) > 0.004)[0]; a0, a1 = (nz[0], nz[-1] + int(0.08 * SR)) if len(nz) else (0, len(x))
    x = x[a0:a1]; off = a0 / SR
    s0, e0 = slots[lid]; nxt = slots[ids[k + 1]][0] if k + 1 < len(ids) else tl['duration'] - 0.4
    room = nxt - s0 - 0.06
    tempo = max(1.0, len(x) / SR / room)
    if tempo > 1.0:                                                     # fit the slot (pitch kept)
        if tempo > 1.3: print(f'  ⚠ {lid} needs x{tempo:.2f} — shorten the line')
        y = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', f'atempo={tempo:.4f}', '-f', 'f32le', '-'],
                           input=x.tobytes(), capture_output=True, check=True).stdout
        x = np.frombuffer(y, np.float32)
    start = s0 + 0.04
    i = int(start * SR); full[i:i + len(x)] += x[:N - i]
    # characters → words
    ch, cs, ce = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    cur, ws, we = '', None, None
    for c, a, b in list(zip(ch, cs, ce)) + [(' ', 0, 0)]:
        if c.isspace():
            if cur: words.append({'w': cur, 's': round(start + (ws - off) / tempo, 3), 'e': round(start + (we - off) / tempo, 3), 'line': lid}); cur = ''
        else:
            if not cur: ws = a
            cur += c; we = b
    print(f'{lid} {len(x) / SR:5.2f}s in slot {room:5.2f}s  x{tempo:.2f}  {text[:50]}')
with wave.open('vo_en/vo_full_en.wav', 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(full, -1, 1) * 32767).astype('<i2').tobytes())
json.dump(words, open('vo_en/words_en.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(words), 'words')
