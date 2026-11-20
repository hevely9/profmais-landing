# Limpa a transcrição: junta "-feira", "R $ 50" e corta repetições alucinadas no fim.
import json, sys, re
arq, corte = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
fix = dict(a.split("=", 1) for a in sys.argv[3:])
ws = [w for w in json.load(open(arq))["words"] if w["start"] < corte]
out = []
i = 0
while i < len(ws):
    w = dict(ws[i])
    if w["text"].startswith("-") and out:
        out[-1]["text"] += w["text"]; out[-1]["end"] = w["end"]; i += 1; continue
    if w["text"] == "R" and i + 2 < len(ws) and ws[i+1]["text"] == "$":
        w["text"] = "R$" + ws[i+2]["text"]; w["end"] = ws[i+2]["end"]; i += 3; out.append(w); continue
    base = re.sub(r"[.,?!]$", "", w["text"]); suf = w["text"][len(base):]
    if base in fix: w["text"] = fix[base] + suf
    out.append(w); i += 1
json.dump({"words": out}, open(arq, "w"), ensure_ascii=False, indent=0)
print(" ".join(w["text"] for w in out))
