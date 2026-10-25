# Tiles renders/preview/t*.png into sheet images (with time labels) for QC
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'renders', 'preview'))
files = sorted(glob.glob('t*.png'))
cols, w, h, per = int(sys.argv[1]) if len(sys.argv) > 1 else 6, 300, 533, 12
font = ImageFont.truetype('arialbd.ttf', 22)
for p in range(0, len(files), per):
    chunk = files[p:p + per]; rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (w + 6), rows * (h + 6)), 'black'); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS); x, y = (i % cols) * (w + 6), (i // cols) * (h + 6)
        sheet.paste(im, (x, y)); d.rectangle([x, y, x + 96, y + 28], fill='black'); d.text((x + 6, y + 2), f[1:-4].lstrip('0') + 's', fill='white', font=font)
    sheet.save(f'sheet_{p // per + 1}.jpg', quality=85); print(f'sheet_{p // per + 1}.jpg', len(chunk))
