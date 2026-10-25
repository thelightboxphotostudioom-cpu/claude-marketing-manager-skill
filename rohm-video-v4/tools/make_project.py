# Writes project.json (scenes ↔ VO lines, music sections, images incl. the Blender hero frames)
import json, os
os.chdir(os.path.join(os.path.dirname(__file__), '..'))

SCENES = [  # id, lines
    ('s01', ['l01']), ('s02', ['l02']), ('s03', ['l03']), ('s04', ['l04']), ('s05', ['l05']), ('s06', ['l06']),
    ('s07', ['l07']), ('s08', ['l08']), ('s09', ['l09']),
    ('s10', ['l10']), ('s11', ['l11']), ('s12', ['l12']), ('s13', ['l13']),
    ('s14', ['l14']), ('s15', ['l15']),
    ('s16', ['l16']), ('s17', ['l17', 'l18']),
    ('s18', ['l19']), ('s19', ['l20']), ('s20', ['l21']),
    ('s21', ['l22']),
    ('s22', ['l23']), ('s23', ['l24']), ('s24', ['l25']),
    ('s25', ['l26']), ('s26', ['l27']), ('s27', ['l28']),
]
images = {f[:-4]: f'assets/img/{f}' for f in sorted(os.listdir('assets/img')) if f.endswith('.jpg')}
for f in sorted(os.listdir('assets/bl')):
    images['bl' + str(int(f[3:7]))] = f'assets/bl/{f}'

proj = {
    'name': 'دار الأوبرا السلطانية — v4',
    'fps': 60, 'width': 1080, 'height': 1920,
    'bpm': 116, 'beatsPerBar': 4, 'beatOffset': 0.31,
    'palette': {'bg': '#0D0A07', 'ink': '#F3E9D8', 'acc': '#C9A35C', 'clay': '#7E1822', 'hi': '#E8CF95', 'mut': '#9C8E78', 'onAcc': '#0D0A07'},
    'fonts': {'display': 'Cairo', 'body': 'Cairo', 'num': 'Inter'},
    'post': {'grain': 0.03, 'vignette': 0.3},
    'images': images,
    'timing': {'snap': 'none', 'keepOriginal': True, 'leadIn': 0.0, 'gap': 0.0, 'startPad': 0.0, 'tail': 2.4},
    'music': {'key': 'D', 'scale': 'minor', 'progression': [0, 5, 3, 6], 'level': 4, 'duck': -5, 'top': {'hat': 19, 'pluck': 7}},
    'sections': [
        {'name': 'build', 'at': 0}, {'name': 'drop', 'at': 'scene:s06'}, {'name': 'break', 'at': 'scene:s07'},
        {'name': 'build', 'at': 'scene:s10'}, {'name': 'drop', 'at': 'scene:s16'}, {'name': 'break', 'at': 'scene:s18'},
        {'name': 'build', 'at': 'scene:s21'}, {'name': 'stop', 'at': 93.45}, {'name': 'drop', 'at': 'scene:s23'},
        {'name': 'outro', 'at': 'scene:s27'},
    ],
    'scenes': [{'id': i, 'file': f'scenes/{i}.js', 'lines': l} for i, l in SCENES],
}
json.dump(proj, open('project.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(images), 'images,', len(SCENES), 'scenes')

