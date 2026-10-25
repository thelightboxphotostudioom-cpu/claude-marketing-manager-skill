# Bed vs voice level check: RMS of the bed and of the VO during speech, full band and above 200 Hz (phone speaker)
import os, wave, json
import numpy as np
from scipy import signal
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
def rd(p):
    with wave.open(p) as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate(); b = w.readframes(n)
    if sw == 3:
        a = np.frombuffer(b, np.uint8).reshape(-1, 3); x = (a[:, 0].astype(np.int32) | (a[:, 1].astype(np.int32) << 8) | (a[:, 2].astype(np.int32) << 16)); x = np.where(x >= 1 << 23, x - (1 << 24), x) / 8388608.0
    else: x = np.frombuffer(b, '<i2') / 32768.0
    x = x.reshape(-1, ch).mean(1); return x, sr
mix, sr = rd('renders/audio/mix.wav'); nob, _ = rd('renders/audio/mix-nobed.wav'); vo, _ = rd('vo/vo_full.wav'); vo = vo * 10 ** (-3 / 20)
n = min(len(mix), len(nob), len(vo)); vo = vo[:n]; bed = mix[:n] - nob[:n]      # bed = mix with bed − mix without
tl = json.load(open('timeline.json', encoding='utf-8')); m = np.zeros(n, bool)
for L in tl['vo']:
    for w in L['words']: m[int(w['s'] * sr):int(w['e'] * sr)] = True
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
hp = signal.butter(4, 200, 'hp', fs=sr, output='sos')
print(f'full band: VO {db(vo[m]):.1f} dB · bed under speech {db(bed[m]):.1f} dB · gap {db(vo[m]) - db(bed[m]):.1f} dB')
b2, v2 = signal.sosfilt(hp, bed), signal.sosfilt(hp, vo)
print(f'>200 Hz : VO {db(v2[m]):.1f} dB · bed under speech {db(b2[m]):.1f} dB · gap {db(v2[m]) - db(b2[m]):.1f} dB')
