#!/usr/bin/env python3
"""analisar_reels.py: analisa o desempenho dos Reels/posts do Instagram a partir de um CSV.

Uso:
    python3 .claude/skills/social-media-analyzer/scripts/analisar_reels.py dados.csv
    python3 .claude/skills/social-media-analyzer/scripts/analisar_reels.py dados.csv --json

CSV (cabeçalho em português; só 'post' e 'alcance' são obrigatórias, as outras podem ficar vazias):
    post,data,formato,duracao_s,tempo_medio_s,visualizacoes,alcance,curtidas,comentarios,compartilhamentos,salvamentos,seguidores,visitas_perfil,cliques_link

Os números vêm do Instagram: abra o Reel → "Ver insights".
Só usa a biblioteca padrão do Python. Não acessa a internet.
"""
import csv
import json
import re
import sys
from statistics import median

CAMPOS_NUM = ["duracao_s", "tempo_medio_s", "visualizacoes", "alcance", "curtidas", "comentarios",
              "compartilhamentos", "salvamentos", "seguidores", "visitas_perfil", "cliques_link"]


def num(v):
    if v is None:
        return None
    v = str(v).strip().replace("%", "").replace(" ", "")
    if re.fullmatch(r"\d{1,3}(\.\d{3})+", v):   # 1.500 (milhar no padrão BR)
        v = v.replace(".", "")
    elif "," in v:                             # 1.500,5 ou 11,2
        v = v.replace(".", "").replace(",", ".")
    if v == "":
        return None
    try:
        return float(v)
    except ValueError:
        return None


def pct(a, b):
    return round(a / b * 100, 2) if a is not None and b else None


def calcular(p):
    al = p["alcance"]
    inter = sum(p[k] or 0 for k in ("curtidas", "comentarios", "compartilhamentos", "salvamentos"))
    return {
        "engajamento_%": pct(inter, al),
        "compartilhamento_%": pct(p["compartilhamentos"], al),
        "salvamento_%": pct(p["salvamentos"], al),
        "comentario_%": pct(p["comentarios"], al),
        "retencao_%": pct(p["tempo_medio_s"], p["duracao_s"]),
        "seguidores_por_mil": round(p["seguidores"] / al * 1000, 2) if p["seguidores"] is not None and al else None,
        "perfil_por_mil": round(p["visitas_perfil"] / al * 1000, 2) if p["visitas_perfil"] is not None and al else None,
    }


def carregar(caminho):
    with open(caminho, encoding="utf-8-sig", newline="") as f:
        amostra = f.read(2048); f.seek(0)
        dialeto = csv.Sniffer().sniff(amostra, delimiters=",;\t")
        linhas = list(csv.DictReader(f, dialect=dialeto))
    posts, avisos = [], []
    for i, l in enumerate(linhas, 2):
        l = {k.strip().lower(): v for k, v in l.items() if k}
        p = {"post": (l.get("post") or f"linha {i}").strip(), "data": l.get("data", ""), "formato": (l.get("formato") or "").strip().lower()}
        for c in CAMPOS_NUM:
            p[c] = num(l.get(c))
        if not p["alcance"] or p["alcance"] <= 0:
            avisos.append(f"{p['post']}: sem alcance, ignorado")
            continue
        p["metricas"] = calcular(p)
        posts.append(p)
    return posts, avisos


def analisar(posts):
    chaves = list(posts[0]["metricas"].keys())
    medianas = {}
    for k in chaves:
        vals = [p["metricas"][k] for p in posts if p["metricas"][k] is not None]
        medianas[k] = round(median(vals), 2) if vals else None
    for p in posts:
        # nota relativa: média das razões contra a mediana do próprio perfil (1.0 = típico)
        razoes = [p["metricas"][k] / medianas[k] for k in ("engajamento_%", "compartilhamento_%", "salvamento_%", "retencao_%", "seguidores_por_mil")
                  if p["metricas"][k] is not None and medianas[k]]
        p["indice"] = round(sum(razoes) / len(razoes), 2) if razoes else None
    ranking = sorted([p for p in posts if p["indice"] is not None], key=lambda p: p["indice"], reverse=True)
    formatos = {}
    for p in posts:
        f = p["formato"] or "não informado"
        formatos.setdefault(f, []).append(p["metricas"]["engajamento_%"] or 0)
    por_formato = {f: {"posts": len(v), "engajamento_mediano_%": round(median(v), 2)} for f, v in formatos.items()}
    return medianas, ranking, por_formato


def leitura(p, med):
    m, notas = p["metricas"], []
    def acima(k, fator=1.3):
        return m[k] is not None and med[k] and m[k] >= med[k] * fator
    def abaixo(k, fator=0.7):
        return m[k] is not None and med[k] and m[k] <= med[k] * fator
    if acima("compartilhamento_%"): notas.append("muito compartilhado (identificação forte: repetir o tema)")
    if acima("salvamento_%"): notas.append("muito salvo (conteúdo útil: virar série ou carrossel)")
    if acima("retencao_%"): notas.append("prendeu até o fim (estudar gancho e ritmo)")
    if abaixo("retencao_%"): notas.append("perdeu gente cedo (gancho fraco ou vídeo longo)")
    if acima("seguidores_por_mil"): notas.append("converteu em seguidores")
    if m["retencao_%"] is not None and m["retencao_%"] < 30: notas.append("retenção < 30%: encurtar e abrir com a dor")
    return notas


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__); sys.exit(1)
    posts, avisos = carregar(args[0])
    if not posts:
        print("Nenhum post válido no CSV.", *avisos, sep="\n"); sys.exit(1)
    med, ranking, por_formato = analisar(posts)

    if "--json" in sys.argv:
        print(json.dumps({"medianas_do_perfil": med, "por_formato": por_formato,
                          "ranking": [{"post": p["post"], "indice": p["indice"], **p["metricas"], "leitura": leitura(p, med)} for p in ranking],
                          "avisos": avisos}, ensure_ascii=False, indent=2))
        return

    fmt = lambda v: "-" if v is None else f"{v:g}"
    print(f"# Análise de {len(posts)} posts\n")
    print("## Medianas do seu perfil (referência principal)")
    for k, v in med.items():
        print(f"- {k}: {fmt(v)}")
    print("\n## Ranking (índice 1.0 = desempenho típico do seu perfil)\n")
    print("| # | Post | Índice | Engaj. % | Compart. % | Salv. % | Retenção % | Seg./mil |")
    print("|---|---|---|---|---|---|---|---|")
    for i, p in enumerate(ranking, 1):
        m = p["metricas"]
        print(f"| {i} | {p['post']} | {fmt(p['indice'])} | {fmt(m['engajamento_%'])} | {fmt(m['compartilhamento_%'])} | "
              f"{fmt(m['salvamento_%'])} | {fmt(m['retencao_%'])} | {fmt(m['seguidores_por_mil'])} |")
    print("\n## Leitura dos destaques")
    for p in ranking[:3] + ranking[-2:]:
        n = leitura(p, med)
        if n:
            print(f"- **{p['post']}**: " + "; ".join(n))
    if len(por_formato) > 1:
        print("\n## Por formato")
        for f, d in por_formato.items():
            print(f"- {f}: {d['posts']} post(s), engajamento mediano {d['engajamento_mediano_%']}%")
    if len(posts) < 8:
        print(f"\n⚠ Só {len(posts)} posts: conclusões frágeis. O ideal é 10 ou mais.")
    for a in avisos:
        print(f"⚠ {a}")


if __name__ == "__main__":
    main()
