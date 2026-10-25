# ROHM v4 — rebuild

Engine: majed-video plugin v6.1.0 `video-ad-editor/motion` (Chrome + canvas/three.js). `tools/render.js` is a local copy of its
`render.js` with ANGLE D3D11 for the Windows GPU. The plugin itself is unchanged.

1. Photos: `py -3.12 tools/fetch_photos.py assets/photos` (Wikimedia Commons, see `assets/photos/credits.json`)
2. Blender hero (Cycles/OptiX): `blender --background --python blender/rohm_night.py -- <abs>/blender/hero 200 128 100`
3. `py -3.12 tools/prep_assets.py` · `py -3.12 tools/build_vo.py` (voice ×1.15 → line wavs + word timings)
4. `py -3.12 tools/make_project.py` · `py -3.12 tools/make_sfx.py` · `py -3.12 <engine>/motion/timeline.py .`
5. `node tools/render.js . all --workers 4` → `renders/video.mp4`
6. `py -3.12 <engine>/motion/audio.py . --lufs -14` → `renders/final.mp4` (check the bed with `tools/levels.py`)

Scenes: `scenes/s01–s27.js` (one per script line or two), shared helpers in `lib.js` (photos, kinetic type, chips, counters,
Omani-star transition, burned-in captions). Facts on screen: `facts.md` only.
