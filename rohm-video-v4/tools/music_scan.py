# Rough character scan of candidate music beds: tempo, percussive share, brightness, dynamics
import os, subprocess, sys
import numpy as np
from scipy import signal, ndimage
LIB = sys.argv[1]
SR = 22050
names = [f for f in sorted(os.listdir(LIB)) if f.endswith('.wav') and not f.startswith('File ')]
for f in names:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(LIB, f), '-ac', '1', '-ar', str(SR), '-t', '120', '-f', 'f32le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32)
    if len(x) < SR * 20: continue
    fr, tt, Z = signal.stft(x, SR, nperseg=2048, noverlap=1536); S = np.abs(Z)
    H = ndimage.median_filter(S, size=(1, 17)); P = ndimage.median_filter(S, size=(17, 1))
    perc = float((P ** 2).sum() / ((P ** 2).sum() + (H ** 2).sum()))
    cent = float((fr[:, None] * S).sum() / S.sum())
    env = np.maximum(0, np.diff(np.log1p(S).sum(0))); env -= env.mean()
    ac = np.correlate(env, env, 'full')[len(env) - 1:]; hop = 512 / SR
    lags = np.arange(len(ac)) * hop; m = (lags > 60 / 180) & (lags < 60 / 60)
    bpm = 60 / lags[m][np.argmax(ac[m])]
    rms = np.sqrt(ndimage.uniform_filter1d(x ** 2, SR)); dyn = 20 * np.log10(np.percentile(rms, 95) / (np.percentile(rms, 20) + 1e-9))
    print(f'{f[:58]:58s} {len(x)/SR:5.0f}s  bpm {bpm:5.1f}  perc {perc:.2f}  bright {cent:5.0f}Hz  dyn {dyn:4.1f}dB')
