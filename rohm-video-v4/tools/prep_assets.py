# Downscale photos for the engine (≤2400 px tall for landscape, ≤2160 wide for portrait) and copy the Blender frames.
import os, shutil
from PIL import Image

os.chdir(os.path.join(os.path.dirname(__file__), '..'))
os.makedirs('assets/img', exist_ok=True)
for f in sorted(os.listdir('assets/photos')):
    if not f.endswith('.jpg') or f == 'contact.jpg':
        continue
    im = Image.open(f'assets/photos/{f}').convert('RGB')
    s = min(1, 2400 / im.height) if im.width >= im.height else min(1, 2160 / im.width)
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.save(f'assets/img/{f}', quality=90)
    print(f, im.size)
os.makedirs('assets/bl', exist_ok=True)
for f in sorted(os.listdir('blender/hero')):
    if f.endswith('.jpg'):
        shutil.copyfile(f'blender/hero/{f}', f'assets/bl/{f}')
print('blender frames', len(os.listdir('assets/bl')))
