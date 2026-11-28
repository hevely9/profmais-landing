#!/usr/bin/env python3
"""gerar.py: monta o Reel "O número que quase não existiu" (Ep.01, versão 2) como UM mundo contínuo.

Fonte única da verdade: o ROTEIRO abaixo. Os tempos de cada palavra são estimados num ritmo
de narração natural (~3 palavras/s) e todas as animações, a câmera e a legenda karaokê são
sincronizadas a partir deles. Gera:
  cena.html / cena-sem-legenda.html, reel.json / reel-sem-legenda.json, roteiro-narracao.txt

Uso: python3 _reels/zero-ep01-v2/gerar.py
"""
import json, re, os, random

AQUI = os.path.dirname(os.path.abspath(__file__))
COL = 1080                     # largura de cada estação do mundo
CX = 501                       # centro útil da tela (zona segura: 72..930)
EST = {'roma': 0, 'india': 1, 'arabes': 2, 'florenca': 3, 'hoje': 4}

# ── ROTEIRO ───────────────────────────────────────────────────────────────
# *palavra* = destaque laranja na legenda · {mostra|fala} = legenda mostra X, narração fala Y
ROTEIRO = [
    ("Seu salário só vale algo por causa de um número que *quase* *não* *existiu.*", 'poder'),
    ("Tira os *zeros,* e {R$ 1.000|mil reais} viram *{R$ 1.|um.}*", 'poder'),
    ("Sozinho, o zero não vale nada. Mas é ele que *guarda* *o* *lugar* dos outros números.", 'poder'),
    ("Só que, por *milhares* *de* *anos,* o mundo contou sem ele.", 'mundo'),
    ("Os romanos escreviam {2026|dois mil e vinte e seis} *assim.*", 'mundo'),
    ("Agora tenta *dividir* isso por {7.|sete.}", 'mundo'),
    ("Em {628,|seiscentos e vinte e oito,} na Índia, Brahmagupta fez o impensável: tratou o *nada* *como* *número.*", 'nada'),
    ("Os árabes levaram a ideia pra Europa e chamaram de *sifr.* Daí vem *cifra.* E *zero.*", 'nada'),
    ("Mas, em {1299,|mil duzentos e noventa e nove,} os banqueiros de Florença foram *proibidos* de usar esses números.", 'proibido'),
    ("O motivo? Com um risquinho, o zero *vira* *seis.* Fraude fácil.", 'proibido'),
    ("Hoje, tudo o que aparece nesta tela é feito de *{0|zero}* *e* *{1.|um.}*", 'hoje'),
    ("Mas até Brahmagupta *errou* *uma:* disse que {0 ÷ 0|zero dividido por zero} dava zero.", 'hoje'),
    ("E aí? Quanto dá? *Comenta* *aqui.*", 'hoje'),
]
CAPITULOS = {'poder': '1 · O PODER', 'mundo': '2 · O MUNDO SEM ZERO', 'nada': '3 · O NADA VIRA NÚMERO',
             'proibido': '4 · PROIBIDO', 'hoje': '5 · HOJE'}

# ── tempos (ritmo de narração ~15 caracteres falados por segundo) ─────────
CPS, P_VIRG, P_PONTO, P_FRASE = 18.0, .16, .32, .10

def tokens(frase):
    out = []
    for m in re.finditer(r'\*?\{[^}]+\}\*?[.,:?!]*|\S+', frase):
        t = m.group(0); dest = t.startswith('*')
        t = t.strip('*')
        if t.startswith('{'):
            mostra, fala = t[1:t.index('}')].split('|'); resto = t[t.index('}') + 1:].strip('*')
            mostra, fala = mostra + resto, fala + resto
        else:
            t = t.replace('*', ''); mostra = fala = t
        out.append({'mostra': mostra, 'fala': fala, 'dest': dest})
    return out

t = 0.0; FRASES = []
for i, (txt, cap) in enumerate(ROTEIRO):
    toks = tokens(txt); ini = t
    for tk in toks:
        dur = sum((len(re.sub(r'[^\wÀ-ú]', '', w)) + 1) / CPS for w in tk['fala'].split())
        tk['t0'] = t; t += dur; tk['t1'] = t
        if re.search(r'[.?!]$', tk['fala']): t += P_PONTO
        elif re.search(r'[,:]$', tk['fala']): t += P_VIRG
    FRASES.append({'i': i, 'cap': cap, 'toks': toks, 't0': ini, 't1': t, 'texto': txt})
    t += P_FRASE
TOTAL = round(t + 2.2, 2)          # fôlego final para o CTA

def F(i): return FRASES[i]['t0']
def W(i, palavra, n=0):            # início da n-ésima palavra que contém `palavra` na frase i
    achou = [tk for tk in FRASES[i]['toks'] if palavra.lower() in tk['mostra'].lower()]
    return achou[n]['t0']

# ── helpers de animação (CSS puro; o gerador controla o relógio) ──────────
def anim(*partes): return 'animation:' + ','.join(partes) + ';'
def ent(t, nome='aparece', d=.5): return f'{nome} {d}s var(--ease) {t:.2f}s both'
def sai(t, nome='some', d=.35): return f'{nome} {d}s ease-in {t:.2f}s forwards'
def vis(t_in, t_out=None, a='aparece', d=.5):
    p = [ent(t_in, a, d)]
    if t_out is not None: p.append(sai(t_out))
    return anim(*p)

# ── câmera: viaja pela linha do tempo ─────────────────────────────────────
def X(est): return EST[est] * COL
CAM = [(0, X('hoje')), (F(3) + .25, X('hoje')), (F(3) + 2.0, X('roma')),
       (F(6) - .05, X('roma')), (F(6) + .8, X('india')),
       (F(7) - .05, X('india')), (F(7) + .8, X('arabes')),
       (F(8) - .05, X('arabes')), (F(8) + .8, X('florenca')),
       (F(10) - .05, X('florenca')), (F(10) + 1.2, X('hoje')), (TOTAL, X('hoje'))]
VIAGENS = [(F(3) + .25, F(3) + 2.0), (F(6) - .05, F(6) + .8), (F(7) - .05, F(7) + .8),
           (F(8) - .05, F(8) + .8), (F(10) - .05, F(10) + 1.2)]

def keyframes_camera(nome, fator=1.0, blur=False):
    linhas = []
    for k, (tt, x) in enumerate(CAM):
        pct = tt / TOTAL * 100
        viajando = k + 1 < len(CAM) and CAM[k + 1][1] != x
        tf = 'cubic-bezier(.75,0,.25,1)' if viajando else 'linear'
        linhas.append(f'{pct:.3f}% {{ transform: translateX({-x * fator:.0f}px); animation-timing-function:{tf}; }}')
    css = f'@keyframes {nome} {{ ' + ' '.join(linhas) + ' }'
    if blur:
        bl = []
        for a, b in VIAGENS:
            for tt, v in [(a, 0), ((a + b) / 2, 7), (b, 0)]:
                bl.append(f'{tt / TOTAL * 100:.3f}% {{ filter: blur({v}px); }}')
        css += f' @keyframes {nome}Blur {{ 0% {{ filter: blur(0); }} ' + ' '.join(bl) + ' 100% { filter: blur(0); } }'
    return css

# ── contador de ano (HUD) ─────────────────────────────────────────────────
ANOS = [(0, '2026')]
def contagem(a, b, valores):
    passo = (b - a) / len(valores)
    for k, v in enumerate(valores): ANOS.append((a + k * passo, v))
contagem(F(3) + .25, F(3) + 1.9, ['1900', '1500', '1299', '900', '628', '300', '≈100'])
contagem(F(6) - .05, F(6) + .7, ['300', '450', '628'])
contagem(F(7) - .05, F(7) + .7, ['700', '≈825'])
contagem(F(8) - .05, F(8) + .7, ['1000', '1150', '1299'])
contagem(F(10) - .05, F(10) + 1.1, ['1500', '1800', '1950', '2026'])

def hud_ano():
    out = []
    for k, (tt, v) in enumerate(ANOS):
        fim = ANOS[k + 1][0] if k + 1 < len(ANOS) else None
        st = anim(f'pisca .01s linear {tt:.2f}s both' if k else 'nada 0s', *( [f'apaga .01s linear {fim:.2f}s forwards'] if fim else []))
        out.append(f'<span class="ano-v" style="{st}">{v}</span>')
    return ''.join(out)

def hud_capitulo():
    out, atual, ini = [], None, 0
    blocos = []
    for f in FRASES:
        if f['cap'] != atual:
            if atual: blocos.append((atual, ini, f['t0']))
            atual, ini = f['cap'], f['t0']
    blocos.append((atual, ini, None))
    for k, (cap, a, b) in enumerate(blocos):
        partes = [ent(a, 'aparece', .4)] if k else ['nada 0s']
        if b is not None: partes.append(sai(b, 'some', .2))
        out.append(f'<div class="cap" style="{anim(*partes)}"><i></i>{CAPITULOS[cap]}</div>')
    return ''.join(out)

# ── legenda karaokê ───────────────────────────────────────────────────────
def karaoke():
    seq = [tk for f in FRASES for tk in f['toks']]
    blocos, atual = [], []
    for tk in seq:
        atual.append(tk)
        txt = ' '.join(x['mostra'] for x in atual)
        if re.search(r'[.?!:]$', tk['mostra']) or len(txt) >= 18 or (re.search(r',$', tk['mostra']) and len(txt) >= 9):
            blocos.append(atual); atual = []
    if atual: blocos.append(atual)
    html = []
    for k, b in enumerate(blocos):
        a = 0 if k == 0 else b[0]['t0'] - .06
        fim = blocos[k + 1][0]['t0'] - .06 if k + 1 < len(blocos) else None
        partes = ['nada 0s'] if k == 0 else [f'entraLeg .16s var(--ease) {a:.2f}s both']
        if fim: partes.append(f'apaga .01s linear {fim:.2f}s forwards')
        pal = []
        for tk in b:
            cls = 'p d' if tk['dest'] else 'p'
            pal.append(f'<span class="{cls}" style="animation:acende{"D" if tk["dest"] else ""} .14s linear {max(tk["t0"], 0):.2f}s both">{tk["mostra"]}</span>')
        html.append(f'<div class="leg" style="{anim(*partes)}">{" ".join(pal)}</div>')
    return ''.join(html)

# ── arte em traço (SVG) ───────────────────────────────────────────────────
S = 'fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'
def svg(vb, corpo, cls='arte'): return f'<svg class="{cls}" viewBox="{vb}" {S}>{corpo}</svg>'
TEMPLO_ROMANO = svg('0 0 600 330', '<path d="M40 112 L300 22 L560 112 Z"/><rect x="40" y="112" width="520" height="30"/>'
    + ''.join(f'<rect x="{62 + i * 110}" y="150" width="36" height="140"/><path d="M{54 + i * 110} 150 h52"/>' for i in range(5))
    + '<rect x="20" y="290" width="560" height="20"/><path d="M0 322 H600"/>')
SHIKHARA = svg('0 0 600 330', '<path d="M220 320 L238 120 Q300 6 362 120 L380 320 Z"/>'
    + ''.join(f'<path d="M{226 + k * 2} {150 + k * 40} H{374 - k * 2}"/>' for k in range(4))
    + '<circle cx="300" cy="30" r="10"/><path d="M90 320 L102 200 Q150 132 198 200 L210 320 Z M390 320 L402 200 Q450 132 498 200 L510 320 Z M40 322 H560"/>')
ARABE = svg('0 0 600 330', '<path d="M118 34 A50 50 0 1 0 118 134 A40 40 0 1 1 118 34 Z"/>'
    + '<path d="M180 320 L180 200 Q300 40 420 200 L420 320 Z M300 70 V36"/><path d="M296 40 a10 10 0 1 0 10 -8"/>'
    + '<rect x="472" y="70" width="50" height="250"/><path d="M462 70 L497 14 L532 70 M466 130 H528 M40 322 H570"/>'
    + '<path d="M250 320 V262 Q300 222 350 262 V320"/>')
DUOMO = svg('0 0 600 330', '<rect x="40" y="40" width="80" height="280"/><path d="M40 40 L80 6 L120 40"/>'
    + ''.join(f'<path d="M66 {90 + k * 70} v-22 q14 -18 28 0 v22"/>' for k in range(3))
    + '<rect x="190" y="196" width="240" height="124"/><path d="M196 196 Q310 6 424 196 M260 196 Q300 70 310 46 M360 196 Q320 70 310 46"/>'
    + '<rect x="296" y="18" width="28" height="30"/><path d="M296 18 L310 0 L324 18"/><path d="M466 320 V236 H586 V320 M458 236 L526 196 L594 236 M20 322 H600"/>')

def digitos_6():  # "1 0 0" desenhado, o primeiro 0 ganha o risquinho e vira 6
    return svg('0 0 360 210', '<path d="M40 54 L78 24 V190 M40 190 H116" stroke-width="12"/>'
        + '<ellipse cx="292" cy="108" rx="40" ry="80" stroke-width="12"/>'
        + f'<g style="{anim(f"laranja .25s linear {W(9, "risquinho") + .5:.2f}s both")}"><ellipse cx="190" cy="108" rx="40" ry="80" stroke-width="12"/>'
        + f'<path d="M151 112 Q132 -52 250 -46" stroke-width="13" style="stroke-dasharray:320;stroke-dashoffset:320;{anim(f"desenha .5s var(--ease) {W(9, "risquinho") + .1:.2f}s both")}"/></g>', 'num6')

# ── estações ──────────────────────────────────────────────────────────────
def estacao(nome, conteudo, chip, ano, t_chegada):
    x = X(nome)
    return f'''<section class="est" style="left:{x}px">
      {f'<div class="chip" style="{vis(t_chegada)}">{chip}</div>' if chip else ''}
      {conteudo}
      <div class="ponto"></div><div class="ano-lin">{ano}</div>
    </section>'''

def est_hoje():
    zeros = ''.join(f'<span class="z" style="{anim(f"voaDir .45s var(--ease) {W(1, "zeros") + .15 + k * .08:.2f}s forwards")}">{c}</span>' for k, c in enumerate('.000'))
    caixas = ''.join(f'<div class="cx {"zero" if k else ""}" style="{vis(F(2) + .1 + k * .12, F(3) + .2, "pop", .4)}"><b style="{anim(f"laranja .3s linear {W(2, "guarda"):.2f}s both") if k else ""}">{d}</b><small>{l}</small></div>'
                     for k, (d, l) in enumerate(zip('1000', ['MIL', 'CEN', 'DEZ', 'UNI'])))
    r = random.Random(7)
    colunas = ''.join(f'<div class="bin" style="left:{18 + k * 48}px;--v:{3.4 + r.random() * 2.5:.2f}s;--o:-{r.random() * 4:.2f}s">'
                      + '<br>'.join(r.choice('01') for _ in range(40)) + '</div>' for k in range(12))
    tela = f'''
      <div class="pix" style="{anim(sai(F(2) + .05, 'some', .3))}">
        <div class="pix-topo"><span class="ok">✓</span> Pix recebido</div>
        <div class="valor" style="{anim(f'treme .5s ease-in-out {W(1, "R$ 1.", 1) + .05:.2f}s both')}">R$ 1<span class="zs">{zeros}</span></div>
        <svg class="circulo" viewBox="0 0 300 160" style="{anim(sai(W(1, "zeros") + .1, 'some', .2))}"><ellipse cx="150" cy="80" rx="140" ry="66" fill="none" stroke="var(--acento)" stroke-width="6" style="stroke-dasharray:700;stroke-dashoffset:700;animation:desenha .7s var(--ease) .15s both"/></svg>
      </div>
      <div class="caixas">{caixas}</div>
      <div class="chave" style="{vis(W(2, 'guarda'), F(3) + .2, 'aparece', .35)}"><span></span>GUARDA-LUGAR</div>
      <div class="binarios" style="{vis(F(10) + .9, F(11) + .1, 'aparece', .6)}">{colunas}</div>
      <div class="conta" style="{vis(F(11) + .2, F(12) - .05, 'pop', .45)}">0 ÷ 0 <span class="riscavel">= 0<i style="{anim(f'riscaX .4s var(--ease) {W(11, "zero.") + .35:.2f}s both')}"></i></span></div>
      <div class="conta final" style="{vis(F(12), None, 'pop', .45)}">0 ÷ 0 = <b class="pulsa">?</b></div>
      <div class="comenta" style="{vis(W(12, 'Comenta'), None, 'aparece', .4)}">COMENTA ↓<small>EP.02 · O ZERO DOS MAIAS</small></div>'''
    cel = f'<div class="celular"><div class="notch"></div><div class="tela">{tela}</div></div>'
    return estacao('hoje', cel, '', '2026', None)

def est_roma():
    c = f'''<div class="arte-box" style="{vis(F(3) + 1.6, None, 'aparece', .6)}">{TEMPLO_ROMANO}</div>
      <div class="romano" style="{vis(W(4, '2026') - .1, None, 'aparece', .45)}">MMXXVI</div>
      <div class="igual" style="{vis(W(4, 'assim'), F(5) - .05, 'aparece', .35)}">= 2026</div>
      <div class="divide" style="{vis(W(5, 'dividir'), None, 'pop', .45)}">÷ VII = <b class="pulsa">?</b></div>'''
    return estacao('roma', c, 'ROMA ANTIGA', '≈ ANO 100', F(3) + 1.5)

def est_india():
    c = f'''<div class="arte-box" style="{vis(F(6) + .5, None, 'aparece', .6)}">{SHIKHARA}</div>
      <div class="lousa" style="{vis(W(6, 'Brahmagupta'), None, 'pop', .45)}">
        <div class="escreve" style="{anim(f'escreve 1.1s steps(9) {W(6, "impensável"):.2f}s both')}">5 − 5 = <b style="{anim(f'brilha .6s ease-out {W(6, "nada"):.2f}s both')}">0</b></div>
        <small>BRAHMASPHUTASIDDHANTA · 628</small></div>'''
    return estacao('india', c, 'ÍNDIA · BRAHMAGUPTA', '628', F(6) + .4)

def est_arabes():
    c = f'''<div class="arte-box" style="{vis(F(7) + .5, None, 'aparece', .6)}">{ARABE}</div>
      <div class="cadeia">
        <span class="ar" style="{vis(W(7, 'sifr'), None, 'pop', .4)}">صفر</span><i style="{vis(W(7, 'sifr') + .3)}">→</i><span style="{vis(W(7, 'sifr') + .3, None, 'pop', .4)}">sifr</span>
        <br><i style="{vis(W(7, 'cifra') - .1)}">→</i><span style="{vis(W(7, 'cifra'), None, 'pop', .4)}">cifra</span><i style="{vis(W(7, 'zero') - .1)}">→</i><span class="d" style="{vis(W(7, 'zero'), None, 'pop', .4)}">zero</span>
      </div>'''
    return estacao('arabes', c, 'MUNDO ÁRABE', '≈ 825', F(7) + .4)

def est_florenca():
    c = f'''<div class="arte-box" style="{vis(F(8) + .5, None, 'aparece', .6)}">{DUOMO}</div>
      <div class="livro" style="{vis(W(8, 'banqueiros'), None, 'pop', .45)}">
        <div class="livro-cab">LIBRO DEI CONTI · FIORINI</div>{digitos_6()}
        <div class="carimbo" style="{anim(f'carimba .4s var(--ease) {W(8, "proibidos"):.2f}s both', sai(F(9) + .05, 'some', .25))}">PROIBIDO</div>
        <div class="carimbo c2" style="{anim(f'carimba .4s var(--ease) {W(9, "Fraude") + .35:.2f}s both')}">PROIBIDO</div>
        <div class="fraude" style="{vis(W(9, 'Fraude'), None, 'pop', .35)}">100 → 160</div>
      </div>'''
    return estacao('florenca', c, 'FLORENÇA · BANQUEIROS', '1299', F(8) + .4)

def poeira():
    r = random.Random(3)
    return ''.join(f'<i style="left:{r.random() * 1080:.0f}px;top:{r.random() * 1920:.0f}px;--v:{2 + r.random() * 3:.1f}s;--o:-{r.random() * 3:.1f}s;width:{2 + r.random() * 3:.0f}px;height:{2 + r.random() * 3:.0f}px"></i>' for _ in range(46))

# ── página ────────────────────────────────────────────────────────────────
def pagina(com_legenda=True):
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
:root {{ --bg:#0A1310; --linha:#F3EEE2; --dim:rgba(243,238,226,.32); --acento:#E36B1F; --areia:#EFDCA9; --ease:cubic-bezier(.16,1,.3,1); }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
html,body {{ width:1080px; height:1920px; overflow:hidden; background:var(--bg); color:var(--linha); font-family:Inter,sans-serif; -webkit-font-smoothing:antialiased; }}
.fundo {{ position:absolute; inset:0; background:radial-gradient(90% 60% at 46% 40%, #14241E 0%, var(--bg) 70%); }}
.grade {{ position:absolute; top:0; left:0; width:3400px; height:1920px; opacity:.5;
  background-image:linear-gradient(rgba(243,238,226,.045) 2px, transparent 2px), linear-gradient(90deg, rgba(243,238,226,.045) 2px, transparent 2px);
  background-size:90px 90px; animation:camGrade {TOTAL}s linear 0s both; }}
.poeira i {{ position:absolute; border-radius:50%; background:var(--areia); opacity:.0; animation:cintila var(--v) ease-in-out var(--o) infinite; }}
.zoom {{ position:absolute; inset:0; transform-origin:501px 760px; animation:respira 9s ease-in-out 0s infinite; }}
.mundo {{ position:absolute; top:0; left:0; width:{COL * 5}px; height:1920px; animation:cam {TOTAL}s linear 0s both, camBlur {TOTAL}s linear 0s both; }}
.linha-tempo {{ position:absolute; left:-200px; right:-200px; top:1196px; height:4px; background:linear-gradient(90deg, transparent, var(--dim) 6%, var(--dim) 94%, transparent); }}
.est {{ position:absolute; top:0; width:{COL}px; height:1920px; }}
.est > * {{ position:absolute; }}
.chip {{ top:430px; left:{CX}px; transform:translateX(-50%); font:700 26px 'DejaVu Sans Mono',monospace; letter-spacing:.18em; color:var(--areia); white-space:nowrap; padding:10px 22px; border:2px solid rgba(239,220,169,.35); border-radius:999px; }}
.ponto {{ top:1184px; left:{CX - 14}px; width:28px; height:28px; border-radius:50%; background:var(--bg); border:5px solid var(--linha); }}
.ano-lin {{ top:1226px; left:{CX}px; transform:translateX(-50%); font:700 26px 'DejaVu Sans Mono',monospace; color:var(--dim); letter-spacing:.12em; white-space:nowrap; }}
.arte-box {{ top:510px; left:{CX - 300}px; width:600px; color:var(--linha); opacity:.9; }}
.arte-box svg {{ width:600px; height:330px; }}
.romano {{ top:860px; left:0; width:{CX * 2}px; text-align:center; font:700 160px Georgia,serif; letter-spacing:.04em; }}
.igual {{ top:1042px; left:0; width:{CX * 2}px; text-align:center; font:800 56px Inter; color:var(--areia); }}
.divide {{ top:1030px; left:0; width:{CX * 2}px; text-align:center; font:700 86px Georgia,serif; white-space:nowrap; }}
.divide b, .final b {{ color:var(--acento); display:inline-block; }}
.lousa {{ top:870px; left:{CX - 330}px; width:660px; padding:34px 30px 24px; border:5px solid var(--linha); border-radius:20px; text-align:center; background:rgba(10,19,16,.85); }}
.escreve {{ font:800 120px Inter; white-space:nowrap; overflow:hidden; display:inline-block; }}
.escreve b {{ color:var(--linha); }}
.lousa small, .livro-cab {{ display:block; font:700 20px 'DejaVu Sans Mono',monospace; letter-spacing:.14em; color:var(--areia); margin-top:10px; }}
.cadeia {{ top:880px; left:0; width:{CX * 2}px; text-align:center; font:800 92px Inter; line-height:1.5; }}
.cadeia i {{ font-style:normal; color:var(--dim); margin:0 18px; display:inline-block; }}
.cadeia span {{ display:inline-block; }}
.cadeia .ar {{ font:400 120px FreeSerif,serif; vertical-align:-10px; }}
.cadeia .d {{ color:var(--acento); }}
.livro {{ top:860px; left:{CX - 320}px; width:640px; padding:26px 34px 20px; border:5px solid var(--linha); border-radius:18px; background:rgba(10,19,16,.85); }}
.livro .livro-cab {{ margin:0 0 6px; }}
.num6 {{ width:300px; height:176px; display:block; margin:44px auto 0; color:var(--linha); overflow:visible; }}
.carimbo.c2 {{ top:auto; bottom:-70px; left:-46px; font-size:64px; }}
.carimbo {{ position:absolute; top:70px; left:120px; font:900 92px Inter; color:var(--acento); border:10px solid var(--acento); border-radius:16px; padding:0 22px; transform:rotate(-11deg); background:rgba(10,19,16,.6); }}
.fraude {{ position:absolute; right:-30px; bottom:-34px; font:800 40px 'DejaVu Sans Mono',monospace; color:var(--bg); background:var(--acento); padding:8px 18px; border-radius:10px; }}
.celular {{ top:360px; left:{CX - 300}px; width:600px; height:800px; border:6px solid var(--linha); border-radius:76px; background:rgba(10,19,16,.9); }}
.notch {{ position:absolute; top:22px; left:230px; width:140px; height:30px; border-radius:20px; border:4px solid var(--dim); }}
.tela {{ position:absolute; inset:70px 30px 40px; overflow:hidden; }}
.tela > * {{ position:absolute; left:0; right:0; }}
.pix {{ top:110px; }}
.pix-topo {{ display:flex; align-items:center; justify-content:center; gap:16px; font:600 36px Inter; color:var(--areia); }}
.ok {{ width:48px; height:48px; border-radius:50%; border:4px solid var(--areia); display:grid; place-items:center; font-size:28px; }}
.valor {{ margin-top:40px; text-align:center; font:800 128px Inter; letter-spacing:-.03em; white-space:nowrap; }}
.zs {{ color:var(--acento); display:inline-block; }}
.z {{ display:inline-block; }}
.circulo {{ position:absolute; top:116px; left:198px; width:330px; height:176px; }}
.um-pulsa {{ position:absolute; inset:0; }}
.caixas {{ top:150px; display:flex; justify-content:center; gap:16px; }}
.cx {{ width:116px; height:190px; border:5px solid var(--linha); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }}
.cx b {{ font:800 104px Inter; line-height:1; }}
.cx small {{ font:700 20px 'DejaVu Sans Mono',monospace; color:var(--areia); letter-spacing:.1em; }}
.cx.zero {{ border-color:var(--acento); border-style:dashed; }}
.chave {{ top:380px; left:146px !important; right:14px !important; text-align:center; font:800 30px 'DejaVu Sans Mono',monospace; letter-spacing:.12em; color:var(--acento); }}
.chave span {{ display:block; height:22px; margin:0 0 12px 0; border:5px solid var(--acento); border-top:none; border-radius:0 0 14px 14px; }}
.binarios {{ inset:0; }}
.bin {{ position:absolute; top:-900px; font:700 34px 'DejaVu Sans Mono',monospace; color:var(--dim); line-height:1.3; animation:chuva var(--v) linear var(--o) infinite; }}
.bin:nth-child(3n) {{ color:var(--acento); opacity:.7; }}
.conta {{ top:250px; text-align:center; font:800 110px Inter; white-space:nowrap; background:rgba(10,19,16,.92); padding:30px 0; }}
.riscavel {{ position:relative; display:inline-block; }}
.riscavel i {{ position:absolute; left:-6%; right:-6%; top:50%; height:12px; background:var(--acento); border-radius:8px; transform-origin:left; transform:rotate(-10deg) scaleX(0); }}
.comenta {{ top:470px; text-align:center; font:900 56px Inter; color:var(--acento); letter-spacing:.04em; }}
.comenta small {{ display:block; margin-top:14px; font:700 24px 'DejaVu Sans Mono',monospace; color:var(--areia); letter-spacing:.14em; }}
/* HUD */
.hud {{ position:absolute; top:262px; left:72px; right:150px; height:150px; }}
.serie {{ font:700 22px 'DejaVu Sans Mono',monospace; letter-spacing:.16em; color:var(--areia); }}
.serie b {{ color:var(--acento); }}
.cap {{ position:absolute; top:40px; left:0; font:700 27px 'DejaVu Sans Mono',monospace; letter-spacing:.1em; padding:8px 18px 8px 14px; border-radius:999px; background:rgba(243,238,226,.08); border:2px solid rgba(243,238,226,.18); display:flex; gap:10px; align-items:center; white-space:nowrap; }}
.cap i {{ width:14px; height:14px; border-radius:50%; background:var(--acento); display:inline-block; }}
.fontes {{ position:absolute; top:94px; left:0; font:700 15px 'DejaVu Sans Mono',monospace; color:rgba(243,238,226,.4); letter-spacing:.08em; }}
.ano {{ position:absolute; top:0; right:0; text-align:right; }}
.ano small {{ display:block; font:700 18px 'DejaVu Sans Mono',monospace; color:var(--dim); letter-spacing:.2em; }}
.ano-box {{ position:relative; height:52px; width:200px; }}
.ano-v {{ position:absolute; right:0; top:0; font:700 46px 'DejaVu Sans Mono',monospace; color:var(--linha); }}
.arroba {{ position:absolute; top:84px; right:0; display:flex; align-items:center; gap:10px; font:800 22px Inter; color:rgba(243,238,226,.75); }}
.arroba svg {{ width:30px; height:30px; }}
/* legenda karaokê */
.legenda {{ position:absolute; left:72px; right:150px; top:1300px; height:90px; display:{'block' if com_legenda else 'none'}; }}
.leg {{ position:absolute; inset:0; text-align:center; font:800 66px Inter; letter-spacing:-.01em; white-space:nowrap; }}
.p {{ opacity:.28; }}
@keyframes acende {{ to {{ opacity:1; }} }}
@keyframes acendeD {{ to {{ opacity:1; color:var(--acento); }} }}
@keyframes entraLeg {{ from {{ opacity:0; transform:translateY(16px); }} to {{ opacity:1; transform:none; }} }}
@keyframes apaga {{ to {{ opacity:0; visibility:hidden; }} }}
@keyframes pisca {{ from {{ opacity:0; }} to {{ opacity:1; }} }}
@keyframes nada {{ to {{ }} }}
@keyframes aparece {{ from {{ opacity:0; transform:translateY(34px) scale(.97); }} to {{ opacity:1; transform:none; }} }}
@keyframes some {{ to {{ opacity:0; transform:scale(.96); }} }}
@keyframes pop {{ 0% {{ opacity:0; transform:scale(.6); }} 70% {{ opacity:1; transform:scale(1.05); }} 100% {{ opacity:1; transform:none; }} }}
@keyframes voaDir {{ to {{ opacity:0; transform:translate(160px,-40px) rotate(18deg); }} }}
@keyframes treme {{ 0%,100% {{ transform:none; }} 25% {{ transform:translateX(-10px); }} 50% {{ transform:translateX(10px); }} 75% {{ transform:translateX(-6px); }} }}
@keyframes laranja {{ to {{ color:var(--acento); }} }}
@keyframes desenha {{ to {{ stroke-dashoffset:0; }} }}
@keyframes escreve {{ from {{ clip-path:inset(0 100% 0 0); }} to {{ clip-path:inset(0 0 0 0); }} }}
@keyframes brilha {{ 0% {{ color:var(--linha); text-shadow:none; }} 40% {{ color:var(--acento); text-shadow:0 0 50px var(--acento); }} 100% {{ color:var(--acento); text-shadow:0 0 22px rgba(227,107,31,.6); }} }}
@keyframes carimba {{ 0% {{ opacity:0; transform:rotate(-11deg) scale(2.2); }} 100% {{ opacity:1; transform:rotate(-11deg) scale(1); }} }}
@keyframes riscaX {{ to {{ transform:rotate(-10deg) scaleX(1); }} }}
@keyframes chuva {{ from {{ transform:translateY(0); }} to {{ transform:translateY(900px); }} }}
@keyframes cintila {{ 0%,100% {{ opacity:0; }} 50% {{ opacity:.55; }} }}
@keyframes respira {{ 0%,100% {{ transform:scale(1); }} 50% {{ transform:scale(1.025); }} }}
.pulsa {{ animation:pulsa 1s ease-in-out 0s infinite; }}
@keyframes pulsa {{ 0%,100% {{ transform:scale(1); }} 50% {{ transform:scale(1.18); }} }}
{keyframes_camera('cam', 1.0, blur=True)}
{keyframes_camera('camGrade', .25)}
</style></head><body>
<div class="fundo"></div>
<div class="grade"></div>
<div class="poeira">{poeira()}</div>
<div class="zoom"><div class="mundo">
  <div class="linha-tempo"></div>
  {est_roma()}{est_india()}{est_arabes()}{est_florenca()}{est_hoje()}
</div></div>
<div class="hud">
  <div class="serie">A HISTÓRIA DOS <b>NÚMEROS</b> · EP.01</div>
  {hud_capitulo()}
  <div class="fontes">FONTES: BRAHMASPHUTASIDDHANTA (628) · ARTE DEL CAMBIO (1299)</div>
  <div class="ano"><small>ANO</small><div class="ano-box">{hud_ano()}</div></div>
  <div class="arroba"><svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2.6"><rect x="2" y="2" width="26" height="26" rx="8"/><circle cx="15" cy="15" r="6"/><circle cx="22.5" cy="7.5" r="1.4" fill="currentColor"/></svg>@profmais</div>
</div>
<div class="legenda">{karaoke()}</div>
<script>if (location.search.includes('guias')) document.body.style.outline='0';</script>
</body></html>'''

def main():
    os.makedirs(os.path.join(AQUI, 'saida'), exist_ok=True)
    for nome, leg in [('cena.html', True), ('cena-sem-legenda.html', False)]:
        open(os.path.join(AQUI, nome), 'w', encoding='utf-8').write(pagina(leg))
    base = {"titulo": "O número que quase não existiu · Ep.01 (v2)", "fps": 30, "voz": None, "motor_voz": "edge", "musica": None,
            "capa": {"cena": 0, "tempo": 0.6}}
    for nome, html, mp4, capa in [('reel.json', 'cena.html', 'reel.mp4', 'capa.jpg'),
                                  ('reel-sem-legenda.json', 'cena-sem-legenda.html', 'reel-sem-legenda.mp4', 'capa-sem-legenda.jpg')]:
        cfg = dict(base, saida=mp4, saida_capa=capa, cenas=[{"arquivo": html, "duracao": TOTAL}])
        json.dump(cfg, open(os.path.join(AQUI, nome), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    fmt = lambda s: f'{int(s // 60)}:{s % 60:04.1f}'
    linhas = [f'ROTEIRO DA NARRAÇÃO · "O número que quase não existiu" (Ep.01 v2)',
              f'Duração do vídeo: {fmt(TOTAL)} · ritmo-alvo: ~3 palavras por segundo (ritmo de narrador de Reel)',
              'Grave/gere a narração seguindo os tempos abaixo. Se sair mais lenta ou mais rápida,',
              'use reel-sem-legenda.mp4 e gere a legenda automática no CapCut.', '']
    for f in FRASES:
        fala = ' '.join(tk['fala'] for tk in f['toks'])
        linhas.append(f'[{fmt(f["t0"])} → {fmt(f["t1"])}]  {fala}')
    open(os.path.join(AQUI, 'roteiro-narracao.txt'), 'w', encoding='utf-8').write('\n'.join(linhas) + '\n')
    print(f'TOTAL {TOTAL}s · {len(FRASES)} frases')
    for f in FRASES: print(f'{f["t0"]:6.2f}  {ROTEIRO[f["i"]][0][:70]}')

if __name__ == '__main__':
    main()
