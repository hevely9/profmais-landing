# Melhora GIF de figurinha (com transparência/fundo removido) e gera webm com alfa. uso: nome altura_final [chave_cor sim tol]
import sys, os, glob, subprocess
nome, H = sys.argv[1], int(sys.argv[2]); chave = sys.argv[3:]
args = list(sys.argv); sys.argv = [sys.argv[0]]
exec(open("/tmp/claude-0/-home-user-profmais-landing/32071048-fb66-53d5-8354-71762639bca7/scratchpad/upscale.py").read().split('if __name__')[0])
from PIL import Image, ImageFilter
import numpy as np
PROJ = "/home/user/profmais-landing/_reels/roblox-teste"; D = f"/tmp/claude-0/-home-user-profmais-landing/32071048-fb66-53d5-8354-71762639bca7/scratchpad/gif-{nome}"
os.makedirs(D + "/out", exist_ok=True)
vf = "fps=30" + (f",colorkey=0x{chave[0]}:{chave[1]}:{chave[2]}" if chave else "") + ",format=rgba"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{PROJ}/bruto/{nome}.gif", "-vf", vf, f"{D}/f%04d.png"], check=True)
for f in sorted(glob.glob(f"{D}/f*.png")):
    im = Image.open(f).convert("RGBA"); a = im.getchannel("A")
    o = up(im.convert("RGB"))
    ref = np.asarray(im.convert("RGB").resize(o.size, Image.LANCZOS), dtype=np.float32)
    x = np.asarray(o, dtype=np.float32); xb = np.asarray(o.filter(ImageFilter.GaussianBlur(4)), dtype=np.float32)
    rgb = Image.fromarray(np.clip(ref + 1.1 * (x - xb), 0, 255).round().astype(np.uint8))
    al = a.resize(o.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    rgb.putalpha(al); W = round(rgb.width * H / rgb.height)
    rgb.resize((W, H), Image.LANCZOS).save(f"{D}/out/{os.path.basename(f)}")
# repete o loop até ~8 s
subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-framerate", "30", "-i", f"{D}/out/f%04d.png", "-t", "8", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "3M", "-auto-alt-ref", "0", f"{PROJ}/public/v/s-{nome}.webm"], check=True)
print("ok", nome)
