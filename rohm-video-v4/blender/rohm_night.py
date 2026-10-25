# Procedural Royal Opera House Muscat (stylised) — night aerial dive, Cycles + OptiX.
# blender --background --python rohm_night.py -- <out_dir> [frames] [samples] [res_pct]
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else os.path.join(os.path.dirname(__file__), 'out')
FRAMES = int(argv[1]) if len(argv) > 1 else 200
SAMPLES = int(argv[2]) if len(argv) > 2 else 160
PCT = int(argv[3]) if len(argv) > 3 else 100
STILL = len(argv) > 4 and argv[4] == 'still'

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene

# ── materials ─────────────────────────────────────────────
def mat(name, color, rough=0.6, metal=0.0, emit=None, estr=0.0, spec=0.5, bump=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = estr
    if bump:
        tex = nt.nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = bump
        tex.inputs['Detail'].default_value = 8
        bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.12
        nt.links.new(tex.outputs['Fac'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], b.inputs['Normal'])
        mix = nt.nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'MULTIPLY'; mix.inputs['Fac'].default_value = 0.18
        mix.inputs['Color1'].default_value = (*color, 1)
        nt.links.new(tex.outputs['Color'], mix.inputs['Color2']); nt.links.new(mix.outputs['Color'], b.inputs['Base Color'])
    return m

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

STONE = mat('stone', srgb('#E9D3C0'), 0.55, bump=40)          # desert-rose limestone
STONE2 = mat('stone_dark', srgb('#CDB29C'), 0.6, bump=40)
GOLD = mat('gold', srgb('#E0B565'), 0.22, 1.0)
WARM = mat('warm_glow', srgb('#FFB866'), 0.5, emit=srgb('#FFB060'), estr=9.0)
WARM2 = mat('warm_glow_soft', srgb('#FF9F4A'), 0.5, emit=srgb('#FFA552'), estr=6.0)
MARBLE = mat('marble', srgb('#6E665F'), 0.2, spec=0.6)
WATER = mat('water', srgb('#0A0F18'), 0.02, spec=0.9)
SAND = mat('sand', srgb('#3A3027'), 0.9, bump=6)
PALM = mat('palm', srgb('#0B0D0A'), 0.8)
LAWN = mat('lawn', srgb('#0E1A0C'), 0.95)

def box(name, size, loc, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = name
    o.scale = size; bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m)
    if bevel:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2
    return o

def pointed_arch_cutter(w, h, depth, loc, rot_z=0.0):
    """Pointed (Omani) arch: rectangle + two intersecting circles."""
    r = w * 0.85
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, (h - w * 0.6) / 2)); a = bpy.context.object
    a.scale = (w, depth, h - w * 0.6); bpy.ops.object.transform_apply(scale=True)
    parts = [a]
    for sx in (-1, 1):
        bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=r, depth=depth, location=(sx * (r - w / 2), 0, h - w * 0.6), rotation=(math.pi / 2, 0, 0))
        parts.append(bpy.context.object)
    # intersect circles for the pointed top
    c1, c2 = parts[1], parts[2]
    bo = c1.modifiers.new('i', 'BOOLEAN'); bo.operation = 'INTERSECT'; bo.object = c2; bo.solver = 'EXACT'
    bpy.context.view_layer.objects.active = c1; bpy.ops.object.modifier_apply(modifier='i')
    bpy.data.objects.remove(c2)
    # keep only the top half of the lens
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, h - w * 0.6 + w)); k = bpy.context.object; k.scale = (w * 2, depth * 2, w * 2); bpy.ops.object.transform_apply(scale=True)
    bo = c1.modifiers.new('k', 'BOOLEAN'); bo.operation = 'INTERSECT'; bo.object = k; bo.solver = 'EXACT'
    bpy.context.view_layer.objects.active = c1; bpy.ops.object.modifier_apply(modifier='k'); bpy.data.objects.remove(k)
    bpy.ops.object.select_all(action='DESELECT'); a.select_set(True); c1.select_set(True); bpy.context.view_layer.objects.active = a
    bpy.ops.object.join()
    a.location = loc; a.rotation_euler = (0, 0, rot_z)
    return a

def arcade_wall(name, length, height, thick, n, arch_w, arch_h, loc, rot_z, m, glow=True):
    """A wall with n pointed arches cut through, warm glow behind."""
    wall = box(name, (length, thick, height), (0, 0, height / 2), m)
    cutters = []
    step = length / n
    for i in range(n):
        x = -length / 2 + step * (i + 0.5)
        cutters.append(pointed_arch_cutter(arch_w, arch_h, thick * 3, (x, 0, 0)))
    bpy.ops.object.select_all(action='DESELECT')
    for c in cutters: c.select_set(True)
    bpy.context.view_layer.objects.active = cutters[0]; bpy.ops.object.join(); cut = cutters[0]
    bo = wall.modifiers.new('arches', 'BOOLEAN'); bo.operation = 'DIFFERENCE'; bo.object = cut; bo.solver = 'EXACT'
    bpy.context.view_layer.objects.active = wall; bpy.ops.object.modifier_apply(modifier='arches')
    bpy.data.objects.remove(cut)
    objs = [wall]
    if glow:   # lit gallery behind the arches
        g = box(name + '_glow', (length - 1, 0.1, arch_h * 0.95), (0, thick * 1.1, arch_h * 0.47), WARM2); objs.append(g)
    for o in objs:
        o.location = Vector(loc) + Vector(o.location).copy()
    for o in objs:
        o.rotation_euler = (0, 0, rot_z)
    # rotate children positions around loc
    for o in objs:
        rel = Vector(o.location) - Vector(loc)
        rel.rotate(__import__('mathutils').Euler((0, 0, rot_z)))
        o.location = Vector(loc) + rel
    return objs

def crenellations(name, length, y, z, rot_z, center, tooth=1.6, gap=1.6, h=1.8, m=None):
    n = int(length / (tooth + gap))
    t = box(name, (tooth, 1.0, h), (0, 0, 0), m or STONE)
    arr = t.modifiers.new('arr', 'ARRAY'); arr.count = n; arr.relative_offset_displace = ((tooth + gap) / tooth, 0, 0)
    off = -(n * (tooth + gap) - gap) / 2 + tooth / 2
    rel = Vector((off, y, z + h / 2)); rel.rotate(__import__('mathutils').Euler((0, 0, rot_z)))
    t.location = Vector(center) + rel; t.rotation_euler = (0, 0, rot_z)
    return t

def glow_window(w, h, loc, rot_z, m=WARM):
    cut = pointed_arch_cutter(w, h, 0.15, (0, 0, 0))
    cut.data.materials.clear(); cut.data.materials.append(m)
    cut.location = loc; cut.rotation_euler = (0, 0, rot_z)
    return cut

E = __import__('mathutils').Euler

# ── ground ─────────────────────────────────────────────────
box('ground', (1400, 1400, 1), (0, 0, -0.5), SAND)
box('plaza', (200, 120, 0.3), (0, -70, 0.15), MARBLE)
box('pool', (70, 26, 0.32), (0, -95, 0.16), WATER)
box('pool_rim', (74, 30, 0.25), (0, -95, 0.12), STONE2)
for sx in (-1, 1):
    box(f'lawn{sx}', (60, 50, 0.3), (sx * 135, -70, 0.15), LAWN)
box('road', (600, 18, 0.2), (0, -160, 0.1), mat('asphalt', srgb('#141414'), 0.7))

# ── main massing (front faces -Y) ─────────────────────────
box('podium', (170, 70, 12), (0, 5, 6), STONE, bevel=0.2)
box('hall', (80, 58, 30), (0, 12, 15), STONE, bevel=0.3)
box('flytower', (54, 34, 44), (0, 30, 22), STONE, bevel=0.3)
box('upper_front', (64, 10, 8), (0, -14, 34), STONE2, bevel=0.2)
for sx in (-1, 1):
    box(f'wing{sx}', (46, 52, 20), (sx * 64, 8, 10), STONE, bevel=0.2)
    box(f'tower{sx}', (14, 14, 40), (sx * 44, -22, 20), STONE, bevel=0.2)
    box(f'tower_cap{sx}', (16, 16, 1.2), (sx * 44, -22, 40.6), GOLD)
    for k, (dx, dy, rz) in enumerate([(0, -7.5, 0), (0, 7.5, math.pi), (7.5, 0, math.pi / 2), (-7.5, 0, -math.pi / 2)]):
        crenellations(f'tw_cr{sx}{k}', 14, 0, 41.2, rz, (sx * 44 + dx, -22 + dy, 0), tooth=1.2, gap=1.3, h=2.2)
        for z in (26, 33):
            glow_window(3, 6, (sx * 44 + dx * 1.01, -22 + dy * 1.01, z), rz, WARM)
# central crenellated tower above the entrance
box('ctower', (22, 16, 50), (0, -10, 25), STONE, bevel=0.2)
box('ctower_band', (23, 17, 1.2), (0, -10, 44), GOLD)
for k, (dx, dy, rz) in enumerate([(0, -8.5, 0), (0, 8.5, math.pi), (11.5, 0, math.pi / 2), (-11.5, 0, -math.pi / 2)]):
    L = 22 if dy else 16
    crenellations(f'ct_cr{k}', L, 0, 50, rz, (dx, -10 + dy, 0), tooth=1.4, gap=1.4, h=2.6)
for x in (-6, 0, 6):
    glow_window(3.6, 9, (x, -18.6, 36), 0, WARM)

# gilded cornices + parapet crenellations
for (L, cx, cy, z, rz) in [(170, 0, -30.2, 12, 0), (80, 0, -17.2, 30, 0), (46, -64, -18.2, 20, 0), (46, 64, -18.2, 20, 0), (54, 0, 12.8, 44, 0)]:
    c = box('cornice', (L, 1.2, 0.9), (cx, cy, z + 0.2), GOLD)
    crenellations('par', L, 0, z + 0.65, rz, (cx, cy + 0.4, 0), tooth=1.5, gap=1.5, h=1.6)

# ground floor arcades (pointed arches, warm light behind)
arcade_wall('arcade_c', 76, 11.5, 1.2, 9, 5.2, 9.0, (0, -32, 0), 0, STONE)
for sx in (-1, 1):
    arcade_wall(f'arcade_{sx}', 40, 11.5, 1.2, 6, 4.4, 8.4, (sx * 64, -32, 0), 0, STONE)
    arcade_wall(f'arcade_side{sx}', 40, 11.5, 1.2, 6, 4.4, 8.4, (sx * 87.5, 5, 0), sx * math.pi / 2, STONE)
# upper arcade (loggia) on the hall
arcade_wall('loggia', 64, 9, 1.0, 8, 4.6, 7.5, (0, -18.5, 12), 0, STONE2)
# glowing arched windows on the wings, hall and fly tower
for sx in (-1, 1):
    for i in range(5):
        glow_window(3.2, 6.5, (sx * (48 + i * 8), -18.4, 13.5), 0, WARM2)
    for i in range(3):
        glow_window(2.6, 6, (sx * (16 + i * 7), -17.3, 23), 0, WARM2)
    for i in range(4):
        glow_window(2.2, 5, (sx * (27.1), 0 + i * 9, 20), sx * math.pi / 2, WARM2)
for i in range(7):
    glow_window(2.4, 7, (-18 + i * 6, 12.8, 33), 0, WARM2)

# ── city context: lawns, roads with streetlights, distant lights ──
import random
R = random.Random(7)
box('lawn_big', (420, 260, 0.2), (0, 0, 0.05), LAWN)
LAMP = mat('lamp', srgb('#FFD9A0'), 0.5, emit=srgb('#FFC680'), estr=40)
CITY = mat('city', srgb('#FFD9A0'), 0.5, emit=srgb('#FFB870'), estr=25)
for y in (-160, 150):
    for x in range(-290, 291, 22):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(x, y + 10, 7)); bpy.context.object.data.materials.append(LAMP)
for side in (-1, 1):
    box(f'road_side{side}', (16, 500, 0.2), (side * 230, 0, 0.1), mat('asphalt2', srgb('#141414'), 0.7))
    for y in range(-240, 241, 22):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(side * 240, y, 7)); bpy.context.object.data.materials.append(LAMP)
for i in range(420):                      # distant city & villas
    a = R.uniform(0, math.tau); d = R.uniform(320, 900)
    x, y = math.cos(a) * d, math.sin(a) * d
    if y < -260 and abs(x) < 500: continue       # the sea side stays dark
    h = R.uniform(4, 18)
    box('bld', (R.uniform(8, 20), R.uniform(8, 20), h), (x, y, h / 2), STONE2)
    if R.random() < 0.7:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=R.uniform(.4, .9), location=(x + R.uniform(-4, 4), y + R.uniform(-4, 4), h + 1)); bpy.context.object.data.materials.append(CITY)
SEA = mat('sea', srgb('#05080F'), 0.04, spec=0.9)
box('sea', (2400, 1200, 0.4), (0, -900, -0.1), SEA)

# ── palms ─────────────────────────────────────────────────
def palm(loc, h, seed):
    import random; r = random.Random(seed)
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.35, depth=h, location=(loc[0], loc[1], h / 2)); tr = bpy.context.object
    tr.rotation_euler = (r.uniform(-.06, .06), r.uniform(-.06, .06), 0); tr.data.materials.append(PALM)
    for k in range(11):
        a = k / 11 * math.tau + r.uniform(-.2, .2)
        bpy.ops.mesh.primitive_plane_add(size=1, location=(loc[0] + math.cos(a) * 2.4, loc[1] + math.sin(a) * 2.4, h - 0.6))
        f = bpy.context.object; f.scale = (5.2, 0.9, 1); f.rotation_euler = (0, 0.55 + r.uniform(-.2, .25), a); f.data.materials.append(PALM)
for i, x in enumerate(range(-96, 97, 16)):
    if abs(x) < 24: continue
    palm((x, -122, 0), 11 + (i % 3), i)
    palm((x + 8, -48, 0), 9 + (i % 2) * 2, i + 50)

# ── lighting ──────────────────────────────────────────────
w = bpy.data.worlds.new('night'); scn.world = w; w.use_nodes = True
nt = w.node_tree; bg = nt.nodes['Background']
grad = nt.nodes.new('ShaderNodeTexGradient'); grad.gradient_type = 'LINEAR'
coord = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
mp.inputs['Rotation'].default_value = (0, -math.pi / 2, 0)
ramp = nt.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.5; ramp.color_ramp.elements[0].color = (*srgb('#1A2338'), 1)
ramp.color_ramp.elements[1].position = 0.75; ramp.color_ramp.elements[1].color = (*srgb('#05070D'), 1)
nt.links.new(coord.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], grad.inputs['Vector'])
nt.links.new(grad.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = 0.6

bpy.ops.object.light_add(type='SUN', location=(0, 0, 100)); moon = bpy.context.object
moon.data.energy = 0.35; moon.data.color = srgb('#9DB4E0'); moon.data.angle = math.radians(1.5)
moon.rotation_euler = (math.radians(55), 0, math.radians(-140))

def spot(loc, target, energy, color='#FFC27A', size=60):
    bpy.ops.object.light_add(type='SPOT', location=loc); s = bpy.context.object
    s.data.energy = energy; s.data.color = srgb(color); s.data.spot_size = math.radians(size); s.data.spot_blend = 0.6; s.data.shadow_soft_size = 1.5
    d = Vector(target) - Vector(loc); s.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
# facade uplights (warm wash)
for x in range(-80, 81, 20):
    spot((x, -45, 0.5), (x, -30, 30), 9000)
for sx in (-1, 1):
    spot((sx * 44, -34, 0.5), (sx * 44, -22, 45), 14000, size=35)
    spot((sx * 105, 5, 0.5), (sx * 88, 5, 15), 8000)
spot((0, -30, 0.5), (0, -10, 55), 22000, size=30)
spot((0, 0, 0.5), (0, 30, 50), 15000)   # fly tower glow from behind arcade

# ── camera: aerial dive + orbit right → left ──────────────
bpy.ops.object.camera_add(); cam = bpy.context.object; scn.camera = cam
cam.data.lens = 22; cam.data.sensor_width = 36; cam.data.clip_end = 3000
tgt = bpy.data.objects.new('target', None); scn.collection.objects.link(tgt)
tc = cam.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'

def ease(k): return 1 - (1 - k) ** 3
scn.frame_start = 1; scn.frame_end = FRAMES
for f in range(1, FRAMES + 1, 2):
    k = (f - 1) / max(1, FRAMES - 1); e = ease(k)
    az = math.radians(-55 + 85 * e)          # camera swings from the right side to the left side
    dist = 380 - 215 * e
    hgt = 240 - 205 * e
    cam.location = (math.sin(az) * dist, -math.cos(az) * dist, hgt)
    cam.keyframe_insert('location', frame=f)
    tgt.location = (0, -6 - 10 * e, 4 + 14 * e)
    tgt.keyframe_insert('location', frame=f)

# ── render settings ───────────────────────────────────────
scn.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
for d in prefs.devices: d.use = d.type == 'OPTIX'
scn.cycles.device = 'GPU'
scn.cycles.samples = SAMPLES; scn.cycles.use_denoising = True; scn.cycles.denoiser = 'OPTIX'
scn.cycles.max_bounces = 6; scn.cycles.use_adaptive_sampling = True; scn.cycles.adaptive_threshold = 0.02
scn.render.use_motion_blur = True; scn.render.motion_blur_shutter = 0.5
scn.render.resolution_x = 1080; scn.render.resolution_y = 1920; scn.render.resolution_percentage = PCT
scn.render.fps = 60
scn.view_settings.view_transform = 'AgX'; scn.view_settings.look = 'AgX - Medium High Contrast'; scn.view_settings.exposure = 0.3
scn.render.image_settings.file_format = 'JPEG'; scn.render.image_settings.quality = 93
os.makedirs(OUT, exist_ok=True)
scn.render.filepath = os.path.join(OUT, 'bl_')
if STILL and len(argv) > 6 and argv[6] == 'front':
    cam.animation_data_clear(); tgt.animation_data_clear()
    cam.location = (25, -95, 7); tgt.location = (0, -30, 8)
if STILL:
    for f in [int(x) for x in argv[5].split(',')]:
        scn.frame_set(f); scn.render.filepath = os.path.join(OUT, f'still_{f:04d}'); bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
