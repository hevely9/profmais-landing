#!/usr/bin/env python3
"""Etapa 1 · análise do áudio da narração.

Uso: python3 -I scripts/analisar_audio.py public/audio/narracao.<ext>

- Duração via ffprobe; pausas via ffmpeg silencedetect (−35 dB, 0,25 s).
- Trechos de fala = intervalos entre silêncios.
- Se houver 8 trechos: grava src/timings.json (fonte de tempo do vídeo inteiro).
- Se não houver: NÃO adivinha. Mostra os trechos com a duração esperada de cada frase
  (proporcional às sílabas) para apontar onde duas frases se juntaram ou uma se partiu.
"""
import json, re, subprocess, sys, os

FRASES = [
    ("Seu aluno esquece mais da metade da aula em 24 horas.", "METADE"),
    ("Isso tem nome: curva do esquecimento.", "ESQUECIMENTO"),
    ("Foi descoberta por Hermann Ebbinghaus, em 1885.", "1885"),
    ("Sem revisão, a memória despenca nos primeiros dias.", "DESPENCA"),
    ("Mas cada revisão no tempo certo faz a curva cair mais devagar.", "REVISÃO"),
    ("Por isso revisar na aula seguinte vale mais que uma revisão gigante antes da prova.", "AULA SEGUINTE"),
    ("No Prof+, a sua sequência didática já vem com as revisões planejadas.", "PROF+"),
    ("Chama no WhatsApp pelo link da bio.", "WHATSAPP"),
]
# como cada frase é FALADA (números por extenso) para estimar sílabas
FALADO = [
    "seu aluno esquece mais da metade da aula em vinte e quatro horas",
    "isso tem nome curva do esquecimento",
    "foi descoberta por hermann ebbinghaus em mil oitocentos e oitenta e cinco",
    "sem revisão a memória despenca nos primeiros dias",
    "mas cada revisão no tempo certo faz a curva cair mais devagar",
    "por isso revisar na aula seguinte vale mais que uma revisão gigante antes da prova",
    "no prof mais a sua sequência didática já vem com as revisões planejadas",
    "chama no whatsapp pelo link da bio",
]
NOISE, MIN_SIL, FPS = "-35dB", 0.25, 30

def silabas(txt):
    return sum(max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w))) for w in txt.split())

def main(path):
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               capture_output=True, text=True, check=True).stdout)
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={NOISE}:d={MIN_SIL}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    sil = list(zip(ini, fim + [dur] * (len(ini) - len(fim))))
    # fala = complemento dos silêncios
    trechos, t = [], 0.0
    for a, b in sil:
        if a - t > 0.08: trechos.append((t, a))
        t = b
    if dur - t > 0.08: trechos.append((t, dur))

    print(f"Duração total: {dur:.2f} s · silêncios ≥ {MIN_SIL}s: {len(sil)} · trechos de fala: {len(trechos)}\n")
    fmt = lambda s: f"{s:6.2f}s (q{round(s * FPS):4d})"
    if len(trechos) == len(FRASES):
        print("| nº | início | fim | duração | palavra-chave |\n|---|---|---|---|---|")
        out = []
        for i, ((a, b), (txt, kw)) in enumerate(zip(trechos, FRASES), 1):
            print(f"| {i} | {fmt(a)} | {fmt(b)} | {b - a:.2f}s | {kw} |")
            out.append({"n": i, "inicio": round(a, 3), "fim": round(b, 3), "texto": txt, "falado": FALADO[i - 1], "chave": kw})
        os.makedirs("src", exist_ok=True)
        json.dump({"duracao": round(dur, 3), "fps": FPS, "frases": out}, open("src/timings.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print("\n✓ src/timings.json gravado")
        return 0
    # diagnóstico, sem adivinhar
    total_fala = sum(b - a for a, b in trechos)
    sil_tot = sum(silabas(f) for f in FALADO)
    esperado = [total_fala * silabas(f) / sil_tot for f in FALADO]
    print("✗ O número de trechos NÃO bate com as 8 frases. Trechos detectados:")
    for i, (a, b) in enumerate(trechos, 1): print(f"  trecho {i}: {fmt(a)} → {fmt(b)}  ({b - a:.2f}s)")
    print("\nDuração esperada de cada frase (proporcional às sílabas):")
    acc = 0
    for i, e in enumerate(esperado, 1): acc += e; print(f"  frase {i}: ~{e:.2f}s (acumulado ~{acc:.2f}s de fala)")
    print("\nCompare: um trecho com a soma de duas frases = pausa curta demais entre elas;"
          " duas partes de uma frase = pausa no meio da frase.")
    if len(trechos) > len(FRASES):
        # PROPOSTA (precisa de confirmação): agrupa trechos consecutivos em 8 frases.
        # custo = erro de duração relativo + bônus para cortar nas pausas mais longas.
        n, k = len(trechos), len(FRASES)
        gaps = [trechos[i + 1][0] - trechos[i][1] for i in range(n - 1)]
        INF = float("inf")
        best = [[INF] * (n + 1) for _ in range(k + 1)]; arg = [[0] * (n + 1) for _ in range(k + 1)]
        best[0][0] = 0
        for fi in range(1, k + 1):
            for j in range(fi, n + 1):
                for i0 in range(fi - 1, j):
                    if best[fi - 1][i0] == INF: continue
                    d = trechos[j - 1][1] - trechos[i0][0]
                    c = ((d - esperado[fi - 1]) / esperado[fi - 1]) ** 2 - (gaps[j - 1] if j < n else 1.0) * 0.6
                    if best[fi - 1][i0] + c < best[fi][j]: best[fi][j] = best[fi - 1][i0] + c; arg[fi][j] = i0
        grupos, j = [], n
        for fi in range(k, 0, -1): i0 = arg[fi][j]; grupos.append((i0, j)); j = i0
        grupos.reverse()
        print("\nPROPOSTA de agrupamento (confirme antes de eu usar):")
        print("| nº | trechos | início | fim | duração | palavra-chave |\n|---|---|---|---|---|---|")
        prop = []
        for i, ((a0, b0), (txt, kw)) in enumerate(zip(grupos, FRASES), 1):
            a, b = trechos[a0][0], trechos[b0 - 1][1]
            ids = ",".join(str(x + 1) for x in range(a0, b0))
            print(f"| {i} | {ids} | {fmt(a)} | {fmt(b)} | {b - a:.2f}s | {kw} |")
            prop.append({"n": i, "inicio": round(a, 3), "fim": round(b, 3), "texto": txt, "falado": FALADO[i - 1], "chave": kw,
                         "pausas_internas": [[round(trechos[x][1], 3), round(trechos[x + 1][0], 3)] for x in range(a0, b0 - 1)]})
        os.makedirs("src", exist_ok=True)
        json.dump({"duracao": round(dur, 3), "fps": FPS, "frases": prop, "proposta": True},
                  open("src/timings-proposta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print("\n→ src/timings-proposta.json (só vira timings.json depois da sua confirmação)")
    return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
