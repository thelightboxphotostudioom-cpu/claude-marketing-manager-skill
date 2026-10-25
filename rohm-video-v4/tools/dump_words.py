import json, sys
sys.stdout.reconfigure(encoding='utf-8')
W = [w for w in json.load(open('assets/vo/words.json', encoding='utf-8'))['words'] if w['type'] == 'word'][2:]
print(len(W))
print(' '.join(f"{i}:{w['text']}@{w['start'] / 1.15:.2f}" for i, w in enumerate(W)))
