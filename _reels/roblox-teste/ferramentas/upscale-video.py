# Melhora os trechos usados do pin3 (frame a frame) e monta r3hd.mp4 com os mesmos tempos.
import sys, os, subprocess, glob
sys.argv = [sys.argv[0]]
exec(open("/tmp/claude-0/-home-user-profmais-landing/32071048-fb66-53d5-8354-71762639bca7/scratchpad/upscale.py").read().split('if __name__')[0])
from PIL import Image, ImageFilter
import numpy as np
PROJ = "/home/user/profmais-landing/_reels/roblox-teste"
D = "/tmp/claude-0/-home-user-profmais-landing/32071048-fb66-53d5-8354-71762639bca7/scratchpad/r3frames"
os.makedirs(D, exist_ok=True); os.makedirs(D + "/out", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-t", "19.4", "-i", f"{PROJ}/bruto/pin3.mp4", "-vf", "fps=30", f"{D}/f%04d.png"], check=True)
faixas = [(0.8, 3.2), (3.8, 6.2), (11.8, 19.4)]
fs = sorted(glob.glob(f"{D}/f*.png"))
for i, f in enumerate(fs):
    dst = f"{D}/out/{os.path.basename(f)}"
    if os.path.exists(dst): continue
    t = i / 30; im = Image.open(f).convert("RGB")
    if any(a <= t <= b for a, b in faixas):
        o = up(im)
        ref = np.asarray(im.resize(o.size, Image.LANCZOS), dtype=np.float32)
        x = np.asarray(o, dtype=np.float32); xb = np.asarray(o.filter(ImageFilter.GaussianBlur(4)), dtype=np.float32)
        o = Image.fromarray(np.clip(ref + 1.1 * (x - xb), 0, 255).round().astype(np.uint8)).resize((1080, 1920), Image.LANCZOS)
    else:
        o = im.resize((1080, 1920), Image.LANCZOS)
    o.save(dst)
    if i % 30 == 0: print("frame", i, "de", len(fs), flush=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "30", "-i", f"{D}/out/f%04d.png", "-vf", "eq=saturation=0.95:contrast=1.04", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", f"{PROJ}/public/v/r3.mp4"], check=True)
print("FIM r3hd")
