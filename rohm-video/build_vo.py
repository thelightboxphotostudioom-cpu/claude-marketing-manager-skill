# يقسّم صوت ElevenLabs على أسطر script.json بتوقيت الكلمات من Scribe → vo/<id>.wav + vo/words.json
import json, subprocess, wave, numpy as np
SR = 48000
raw = subprocess.run(['ffmpeg','-v','error','-i','vo/take_a.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
W = [w for w in json.load(open('vo/scribe_words.json'))['words'] if w['type']=='word']
S = json.load(open('script.json'))
i = 0; lines = []
for L in S:
    n = len(L['text'].split()); ws = W[i:i+n]; i += n
    s0 = max(0, ws[0]['start'] - 0.06); e0 = ws[-1]['end'] + 0.12
    seg = x[int(s0*SR):int(e0*SR)]
    with wave.open(f"vo/{L['id']}.wav",'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(seg,-1,1)*32767).astype('<i2').tobytes())
    lines.append({'id':L['id'],'text':L['text'],'file':f"vo/{L['id']}.wav",'dur':round(len(seg)/SR,4),
      'words':[{'w':w['text'],'s':round(w['start']-s0,4),'e':round(w['end']-s0,4)} for w in ws],
      'source':'elevenlabs+scribe','orig_start':round(s0,4),'orig_end':round(e0,4)})
assert i == len(W), (i, len(W))
json.dump({'voice':'ElevenLabs: Mohamed-Premium Arabic MSA','source':'own','lines':lines},open('vo/words.json','w'),ensure_ascii=False,indent=1)
for l in lines: print(l['id'], l['orig_start'], l['orig_end'])
