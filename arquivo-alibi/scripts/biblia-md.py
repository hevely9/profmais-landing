# Gera casos/<slug>/biblia.md (versão legível da Bíblia — USO INTERNO, nunca publicar)
import json, sys, os
from itertools import combinations, product
def combs(a):
    sets = list(a.get("provas", [])) + list(a.get("combinacoes", []))
    if a.get("papeis"):
        for partes in product(*[list(combinations(p["de"], p.get("n", 1))) for p in a["papeis"]]):
            sets.append([x for parte in partes for x in parte])
    vistos, out = set(), []
    for c in sets:
        k = ",".join(sorted(c))
        if len(set(c)) == len(c) and k not in vistos: vistos.add(k); out.append(c)
    return out
slug = sys.argv[1] if len(sys.argv) > 1 else "mansao-valente"
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
b = json.load(open(f"{raiz}/casos/{slug}/biblia.json"))
nome = {s["id"]: s["nome"] for s in b["suspeitos"]}
tit = {p["id"]: p["titulo"] for p in b["provas"]}
L = [f"# BÍBLIA — Caso Nº {b['numero']}: {b['titulo']}", "",
     "> USO INTERNO. Contém a solução. Nunca publicar nem incluir no PDF/site.", "",
     f"*{b['subtitulo']}*", "", f"- Código: `{b['codigo']}` (8 caracteres aleatórios, sem 0/O/1/I/L) · Local: {b['local']} · Data: {b['data_crime']}",
     f"- {b['jogadores']} jogadores · {b['duracao']} · dificuldade {b['dificuldade']} · {b['classificacao']}", "",
     "## Sinopse", b["sinopse"], "", "## A verdade", b["verdade"]["resumo"], "",
     f"- **Culpado:** {nome.get(b['verdade']['culpado'], b['verdade']['culpado'])}",
     f"- **Método:** {b['verdade']['metodo']}", f"- **Motivo:** {b['verdade']['motivo']}", "", "### Linha do tempo"]
for t in b["verdade"]["linha_do_tempo"]:
    L.append('- ' + (t if isinstance(t, str) else ' — '.join(map(str, t.values() if isinstance(t, dict) else t))))
L += ["", "## Suspeitos"]
for s in b["suspeitos"]:
    L += [f"### {s['nome']}, {s['idade']} — {s['relacao']}", f"- Álibi declarado: {s['alibi']}",
          f"- Segredo: {s['segredo']}", f"- Por que parece culpado(a): {s.get('parece_culpada') or s.get('parece_culpado')}", f"- O que inocenta: {s['inocenta']}", ""]
L += ["## Provas", "", "| ID | Origem | Tipo | Título | Objetivos |", "|---|---|---|---|---|"]
for p in b["provas"]:
    L.append(f"| {p['id']} | {p['origem']} | {p['tipo']} | {p['titulo']} | {', '.join(map(str, p.get('objetivos', [])))} |")
L.append("")
for o in b["objetivos"]:
    L += [f"## Objetivo {o['n']} — {o['titulo']}", o["pergunta"], "", f"Provas exigidas: {o['n_provas']}", "", "**Respostas aceitas:**"]
    for a in o["aceitas"]:
        campos = {k: v for k, v in a.items() if k not in ("provas", "combinacoes", "papeis")}
        for c in combs(a):
            L.append(f"- {json.dumps(campos, ensure_ascii=False)} + {', '.join(c)}")
    L += ["", "**Quase lá:**"] + [f"- {json.dumps(q['campos'], ensure_ascii=False)} → {q['msg']}" for q in o["quase"]]
    L += ["", "**Dicas:**"] + [f"{i+1}. {d}" for i, d in enumerate(o["dicas"])]
    L += ["", f"**Libera:** {', '.join(f'{x} ({tit[x]})' for x in o['bonus']) or '—'}", "", f"**Mensagem de acerto:** {o['msg_acerto']}", ""]
L += ["## Solução", b["solucao"]["relato"], "", "### Confissão", b["solucao"]["confissao"], "", "### Pistas-chave"]
L += [f"- {p if isinstance(p, str) else json.dumps(p, ensure_ascii=False)}" for p in b["solucao"]["pistas"]]
L += ["", "## Teste de lógica (checado)",
      "- Cada objetivo tem uma única resposta de campo correta; todos os conjuntos de provas aceitos apontam para ela.",
      "- Todo inocente tem prova que o inocenta (ver “O que inocenta”), e o culpado é o único cujo álibi é contradito por registro objetivo.",
      "- O objetivo 3 só fecha com prova bônus (B-07) liberada no objetivo 2: ninguém resolve só com o PDF.",
      "- Nomes, empresa e cidade (Monte Albor) verificados como fictícios.", "",
      f"## Interrogatório (desligado)\nAtivo no site: {b['interrogatorio'].get('ativo') if isinstance(b['interrogatorio'], dict) else b['interrogatorio']}"]
open(f"{raiz}/casos/{slug}/biblia.md", "w").write("\n".join(map(str, L)) + "\n")
print(f"✓ casos/{slug}/biblia.md")
