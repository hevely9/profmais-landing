# Upscale x4 com Real-ESRGAN animevideov3 (ONNX, tiles 256 com sobreposição). uso: upscale.py entrada saida [larg_final]
import sys, numpy as np, onnxruntime as ort
from PIL import Image
M = "/tmp/claude-0/-home-user-profmais-landing/32071048-fb66-53d5-8354-71762639bca7/scratchpad/modelos/anime256.onnx"
so = ort.SessionOptions(); so.intra_op_num_threads = 4
sess = ort.InferenceSession(M, so, providers=["CPUExecutionProvider"])
T, P = 256, 16  # tile e margem
def up(img):
    a = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    h, w, _ = a.shape
    out = np.zeros((h * 4, w * 4, 3), dtype=np.float32)
    passo = T - 2 * P
    for y0 in range(0, h, passo):
        for x0 in range(0, w, passo):
            ys, xs = max(0, min(y0 - P, h - T)), max(0, min(x0 - P, w - T))
            tile = np.zeros((T, T, 3), dtype=np.float32)
            crop = a[ys:ys + T, xs:xs + T]; tile[:crop.shape[0], :crop.shape[1]] = crop
            r = sess.run(None, {"input": tile.transpose(2, 0, 1)[None]})[0][0].transpose(1, 2, 0)
            # região útil deste tile (sem as margens), em coordenadas de saída
            uy0, ux0 = y0, x0; uy1, ux1 = min(h, y0 + passo), min(w, x0 + passo)
            out[uy0*4:uy1*4, ux0*4:ux1*4] = r[(uy0-ys)*4:(uy1-ys)*4, (ux0-xs)*4:(ux1-xs)*4]
    return Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8))
if __name__ == "__main__":
    im = Image.open(sys.argv[1]); alpha = im.getchannel("A") if im.mode in ("RGBA", "LA") else None
    o = up(im)
    # o modelo muda os tons: mantém cor/tom da versão lanczos e soma só o detalhe fino do upscale
    from PIL import ImageFilter
    ref = np.asarray(im.convert("RGB").resize(o.size, Image.LANCZOS), dtype=np.float32)
    x = np.asarray(o, dtype=np.float32)
    xb = np.asarray(o.filter(ImageFilter.GaussianBlur(4)), dtype=np.float32)
    o = Image.fromarray(np.clip(ref + 1.1 * (x - xb), 0, 255).round().astype(np.uint8))
    if len(sys.argv) > 3:
        W = int(sys.argv[3]); o = o.resize((W, round(o.height * W / o.width)), Image.LANCZOS)
    o.save(sys.argv[2], quality=93)
    print("ok", im.size, "->", o.size)
