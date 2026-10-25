import io, json, os, re, sys, time, requests
from PIL import Image, ImageDraw, ImageFont

API = 'https://commons.wikimedia.org/w/api.php'
S = requests.Session()
S.headers['User-Agent'] = 'ROHM-video/1.0 (thelightboxphotostudio.om@gmail.com)'
OK = re.compile(r'^(cc0|public domain|cc by(-sa)? [\d.]+( igo)?)$', re.I)
OUT = sys.argv[1]

PICKS = {
    'ext_night': ['Royal Opera House.jpg'],
    'ext_day': ['03 Maskat Operna hiša (6).jpg', '03 Maskat Operna hiša (1).jpg'],
    'arcade': ['Royal Opera House Muscat - Outside View II.jpg', 'Royal Opera House Muscat - Outside View I.jpg',
               'Oman 2014 (16223581895).jpg'],
    'foyer': ['Royal Opera House Muscat - Interior View I.jpg',
              'Royal Opera House Muscat - Interior View - Ceiling, Archs, Balconies, etc.jpg',
              'Ceiling (17329037929).jpg'],
    'hall': ['Royal Opera House Muscat, Muscat, Sultanate of Oman.jpg',
             'Boxes at the Royal Opera House Muscat, Muscat, Sultanate of Oman.jpg',
             'Stage - Orchestra Warming Up (17642059945).jpg'],
    'organ': ['Pipe-Organ by Khalid AlBusaidi.jpg', 'Royal Opera, Masqat. Die Orgel.JPG',
              "A close shot of ROHM's pipe organ by Khalid AlBusaidi.jpg"],
    'fort': ['Pevnost an-Nachal.jpg', 'Bahla Fort - Oman.jpg', 'Bahla fort and mountais.jpg'],
    'garden': ['Opera house Muscat.jpg'],
}

def strip(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h or '')).strip()

def info(title):
    r = S.get(API, params=dict(action='query', titles='File:' + title, prop='imageinfo',
                               iiprop='url|size|extmetadata', iiurlwidth=2400, format='json'), timeout=60).json()
    return next(iter(r['query']['pages'].values()))['imageinfo'][0]

os.makedirs(OUT, exist_ok=True)
credits = []
for slot, titles in PICKS.items():
    for n, title in enumerate(titles, 1):
        ii = info(title)
        md = ii['extmetadata']
        lic = strip(md.get('LicenseShortName', {}).get('value'))
        if not OK.match(lic) or md.get('NonFree', {}).get('value'):
            print('SKIP license', lic, title)
            continue
        url = ii.get('thumburl') if ii['width'] > 2400 else ii['url']
        im = Image.open(io.BytesIO(S.get(url, timeout=120).content)).convert('RGB')
        fn = f'{slot}_{n}.jpg'
        im.save(os.path.join(OUT, fn), quality=92)
        credits.append(dict(file=fn, slot=slot, title=title, author=strip(md.get('Artist', {}).get('value')),
                            license=lic, license_url=md.get('LicenseUrl', {}).get('value', ''),
                            source_page_url=ii['descriptionurl'], width=im.width, height=im.height))
        print(fn, im.size, lic, '|', credits[-1]['author'][:40])
        time.sleep(0.5)

json.dump(credits, open(os.path.join(OUT, 'credits.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

cols, cw, ch = 4, 480, 400
sheet = Image.new('RGB', (cols * cw, ((len(credits) + cols - 1) // cols) * ch), (13, 10, 7))
d = ImageDraw.Draw(sheet)
font = ImageFont.truetype('arialbd.ttf', 20)
small = ImageFont.truetype('arial.ttf', 14)
for i, c in enumerate(credits):
    im = Image.open(os.path.join(OUT, c['file']))
    im.thumbnail((cw - 20, ch - 70))
    x, y = (i % cols) * cw, (i // cols) * ch
    sheet.paste(im, (x + (cw - im.width) // 2, y + 10))
    d.text((x + 10, y + ch - 56), c['file'], fill=(232, 207, 149), font=font)
    d.text((x + 10, y + ch - 30), f"{c['width']}x{c['height']} · {c['license']}", fill=(243, 233, 216), font=small)
sheet.save(os.path.join(OUT, 'contact.jpg'), quality=88)
print('done', len(credits))
