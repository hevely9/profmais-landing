# Design de Reels: referência rápida

## Medidas
- Tela: 1080×1920 (9:16). Instagram exibe no feed recortado em 4:5 (1080×1350, centro) e na grade do perfil em 3:4.
  → O gancho e a capa precisam funcionar **no centro** da tela.
- Zona segura usada no `reel.css`: topo 250px, base 420px, esquerda 72px, direita 150px.

## Ritmo
| Duração da cena | Máx. palavras na tela | Máx. palavras faladas |
|---|---|---|
| 2–3s | 6–8 | 8–10 |
| 4–5s | 10–12 | 14–18 |
| 6–8s | 12 | 20–28 |

- Elementos entram escalonados a cada 0.3–0.6s. Deixe 1–1.5s de "respiro" depois do último elemento.
- Corte a cada 2–5s. Reel parado por mais de 6s perde a pessoa.
- Termine com um quadro que faça sentido em loop (o Reel recomeça sozinho).

## Hierarquia por cena
1. **Uma** frase principal (gancho/título).
2. No máximo um apoio (texto ou lista de até 3 itens).
3. Um elemento visual (cartão com material, mascote, logo ou número grande).

## Paleta por intenção
| Intenção | Fundo | Destaque |
|---|---|---|
| Gancho / solução | `fundo-verde padrao` | laranja |
| Dor / dado / lista | `fundo-areia` | grifo `marca-texto` |
| CTA final | `fundo-laranja` | verde |

## Receitas de cena (copie e adapte)

**Número grande**
```html
<body class="fundo-areia"><div class="palco">
  <p class="gancho pop" style="--d:.1s; color: var(--laranja); font-size: 220px">98%</p>
  <p class="titulo sobe" style="--d:.5s; color: var(--verde)">das professoras aprovaram o material</p>
</div></body>
```

**Riscar o jeito antigo**
```html
<p class="titulo"><span class="risca" style="--d:.8s">Baixar atividade pronta</span></p>
<p class="titulo sobe destaque" style="--d:1.4s">Material feito pra sua turma</p>
```

**Folheando o material (zoom lento)**
```html
<figure class="cartao zoom" style="--d:.1s; width: 760px; align-self:center">
  <img class="lento" src="../../../assets/exemplo-historia-full.jpg" alt="">
</figure>
```

**Mascote**
```html
<img class="mascote sobe" style="--d:.6s; width: 420px" src="../../../assets/mascote.png" alt="">
```
(A imagem tem 420px: não amplie além disso para não perder nitidez.)

## Capa
- Defina `"capa": { "cena": 0, "tempo": 1.5 }` no `reel.json` (cena e segundo do quadro).
- Na grade do perfil a capa aparece em 3:4: o texto da capa precisa estar no centro.
