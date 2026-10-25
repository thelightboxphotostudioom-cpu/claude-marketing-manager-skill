# Writes sfx.json: impacts on numbers, whooshes on cuts, risers/booms on reveals, ticks under counters
import json, os
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
S = []
def a(type, at, gain=0.0, **kw): S.append({'type': type, 'at': at, 'gain': gain, **kw})

# a soft pass on every scene change (sections get a whoosh instead)
sections = {'s07', 's10', 's14', 's16', 's18', 's21', 's25'}
for i in range(2, 28):
    sid = f's{i:02d}'
    if sid in sections: a('whoosh', f'scene:{sid}', -4)
    elif sid not in ('s23',): a('swoosh-pass', f'scene:{sid}', -9)
for sid in sections: a('shimmer', f'scene:{sid}+0.15', -10)

def ticks(start_word, n, step, gain=-14):
    base, off = (start_word.rsplit('-', 1)[0], -float(start_word.rsplit('-', 1)[1])) if start_word.count('-') else (start_word, 0.0)
    for k in range(n):
        o = off + k * step
        a('tick', f'{base}{"+" if o >= 0 else "-"}{abs(o):.2f}', gain)

# HOOK
a('sub-drop', 0.02, -2); a('impact', 0.03, 0); a('shimmer', 0.3, -8)
a('shimmer', 'word:l02:1', -7)
a('reverse-whoosh', 'scene:s03', -5); a('whoosh', 'word:l03:2', -8)
a('pop', 'word:l04:3', -3); a('slide', 'word:l04:3+0.12', -6)
a('impact', 'word:l05:2', -2); a('slide', 'word:l05:4', -6)
a('riser', 'word:l06:1', -8, dur=1.2); a('boom', 'word:l06:1', -1); a('impact', 'word:l06:1', -3); a('shimmer', 'word:l06:3', -8)
# 1 DREAM
a('shimmer', 'word:l07:3', -9)
ticks('word:l08:0', 8, 0.09); a('impact', 'word:l08:0+0.75', -4); a('shimmer', 'word:l08:4', -9); a('pop', 'word:l08:7', -6)
a('shimmer', 'scene:s09+0.4', -10); a('pop', 'word:l09:7', -8); a('shimmer', 'word:l09:9', -8)
# 2 ARCHITECTURE
a('pop', 'word:l10:2', -6); ticks('word:l10:4', 6, 0.09); a('impact', 'word:l10:4+0.5', -4)
a('pop', 'word:l11:0', -6); a('impact', 'word:l11:2+0.5', -5); ticks('word:l11:6', 10, 0.1); a('impact', 'word:l11:6+1.05', -4); a('pop', 'word:l11:11', -6)
a('pop', 'word:l12:2', -7); a('shimmer', 'word:l12:3', -9)
a('slide', 'scene:s13', -6); a('pop', 'word:l13:0', -7); a('pop', 'word:l13:1', -7); a('shimmer', 'word:l13:2', -9); a('pop', 'word:l13:5', -7); a('slide', 'word:l13:6', -7)
# 3 INTERIOR
a('swoosh-pass', 'word:l14:2-0.1', -6); a('pop', 'word:l14:4', -7); a('shimmer', 'word:l14:9', -6)
a('pop', 'word:l15:0', -7); a('shimmer', 'word:l15:2', -6); a('pop', 'word:l15:4', -7)
# 4 TRANSFORMING HALL
a('reverse-whoosh', 'word:l16:2+0.15', -7); a('pop', 'word:l16:2+0.15', -2); a('boom', 'word:l16:3', -5)
a('slide', 'word:l16:9-0.6', -4); a('impact', 'word:l16:7', -3); a('pop', 'word:l16:11', -8)
a('slide', 'word:l17:2-0.1', -5); a('slide', 'word:l17:5-0.1', -5); a('slide', 'word:l17:9-0.1', -5)
ticks('word:l18:4', 9, 0.1); a('impact', 'word:l18:4+0.9', -4); a('swoosh-pass', 'word:l18:7+0.1', -6); a('impact', 'word:l18:8', -4)
# 5 ROYAL ORGAN
a('impact', 'word:l19:2-0.1', -4); ticks('word:l19:4', 22, 0.105, -16); a('impact', 'word:l19:9', -3)
ticks('word:l20:0', 10, 0.1, -16); a('slide', 'word:l20:3-0.2', -6); a('impact', 'word:l20:5', -3); a('slide', 'word:l20:7', -5)
a('riser', 'word:l21:4', -9, dur=1.4); a('boom', 'word:l21:4', -3); a('shimmer', 'word:l21:5', -5)
# 6 SEAT SCREENS
a('impact', 'word:l22:1', -2); a('pop', 'word:l22:6', -6); a('typing', 'word:l22:12', -12, dur=1.4); a('pop', 'word:l22:9', -8)
# 7 OPENING NIGHT
a('slide', 'scene:s22', -4); a('pop', 'word:l23:1', -8); a('pop', 'word:l23:4', -8); a('pop', 'word:l23:5', -8)
a('riser', 'word:l24:0', -4, dur=2.2); a('boom', 'word:l24:0', 0); a('impact', 'word:l24:0', -2); a('whoosh', 'word:l24:0+0.3', -6)
a('shimmer', 'word:l24:3', -4); a('pop', 'word:l24:4', -6); a('pop', 'word:l24:6', -6)
ticks('word:l25:1', 9, 0.1); a('impact', 'word:l25:3-0.1', -3); a('pop', 'word:l25:6', -8)
# 8 STARS · TODAY · CTA
a('whoosh', 'word:l26:5-0.05', -6); a('impact', 'word:l26:5', -5)
a('whoosh', 'word:l26:7-0.05', -6); a('impact', 'word:l26:7', -5)
a('whoosh', 'word:l26:9-0.05', -6); a('impact', 'word:l26:9', -5)
a('shimmer', 'word:l27:2', -6); ticks('word:l27:3-0.1', 6, 0.1); a('impact', 'word:l27:3+0.5', -3)
a('pop', 'word:l27:5', -6); a('pop', 'word:l27:9', -6)
a('pop', 'word:l28:0', -3); a('pop', 'word:l28:4', -5)
a('shimmer', 'line-end:l28+0.1', -5); a('boom', 'line-end:l28+0.05', -6)

json.dump(S, open('sfx.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(S), 'sfx')
