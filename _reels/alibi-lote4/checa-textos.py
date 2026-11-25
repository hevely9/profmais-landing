# Uso: python3 checa-textos.py src/v/arquivo.tsx
# Acusa textos do mesmo Plano no mesmo "top" (um em cima do outro = legenda embaralhada).
import re, sys
erro = 0
for f in sys.argv[1:]:
    s = open(f).read()
    for m in re.finditer(r'<Plano r=\{\[([\d.\-]+), ([\d.]+)\]\}[^>]*>(.*?)</Plano>', s, re.S):
        tops = re.findall(r'top=\{(\d+)\}', m.group(3))
        rep = sorted({t for t in tops if tops.count(t) > 1})
        if rep:
            erro = 1
            print(f"{f}: Plano {m.group(1)}–{m.group(2)} tem textos no mesmo top {rep}")
print("OK: nenhum texto sobreposto" if not erro else "CORRIJA antes de renderizar")
sys.exit(erro)
