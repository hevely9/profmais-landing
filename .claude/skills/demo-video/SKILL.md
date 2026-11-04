---
name: demo-video
description: "Gera o vídeo de verdade: transforma cenas HTML em um Reel MP4 vertical 9:16 (1080x1920) pronto para postar no Instagram, com a identidade da Prof+, texto animado na tela, capa e narração opcional em pt-BR. Use sempre que pedirem para criar, gerar, montar, renderizar ou editar um Reel, vídeo para Instagram, story em vídeo, vídeo curto, TikTok/Shorts ou vídeo de divulgação da Prof+. Para estratégia ou só roteiro, use video-content-strategist antes."
---

# Gerador de Reels da Prof+

Você é um produtor de vídeo curto, não um montador de slides. Cada quadro tem uma função, e cada segundo precisa fazer a pessoa assistir ao próximo.

**Antes de tudo:** leia `.claude/product-marketing-context.md` (marca, público, cores, tom, provas permitidas).

## O que este pipeline faz (e o que não faz)
- ✅ Vídeo **motion design**: texto animado, listas, cartões com material real, logo, mascote, chamada para ação.
- ✅ Saída no padrão do Instagram: **1080×1920, 9:16, 30 fps, H.264 + AAC, faststart**, mais `capa.jpg`.
- ✅ **Narração com voz sintética** em pt-BR (formato padrão da Prof+): automática via edge-tts quando houver conexão, ou pelo roteiro `narracao.txt` para colar no "Texto para fala" do Instagram ou do CapCut.
- ❌ Não filma pessoas nem gera vídeo realista com IA. Para isso, a professora grava no celular e
  este pipeline faz as cartelas de abertura e fechamento.

## Fluxo de trabalho

### 1. Roteiro primeiro
Se ainda não existe roteiro, use a skill `video-content-strategist` para criá-lo (gancho → problema → valor → CTA).
Não comece pelo visual.

### 2. Crie a pasta do Reel a partir do modelo
```bash
cp -r .claude/skills/demo-video/templates/starter _reels/<nome-curto-do-reel>
```
Estrutura:
```
_reels/<nome>/
  reel.json      ← ordem das cenas, duração, narração, música, capa
  reel.css       ← identidade visual (não precisa mexer)
  cenas/*.html   ← uma cena por arquivo, 1080x1920
  saida/         ← reel.mp4, capa.jpg, previa-*.png (gerado; fora do git)
```
`_reels/` começa com `_` para o GitHub Pages **não** publicar essa pasta no site.

### 3. Escreva as cenas
Edite/duplique `cenas/*.html`. Regras:
- **Uma ideia por cena.** Se precisar de "e", são duas cenas.
- **Tudo importante dentro de `.palco`** (zona segura). A interface do Instagram cobre o topo (250px), a base (420px: nome, legenda e música) e a direita (150px: botões).
- **Gancho visível no 1º quadro**: na cena 1 use a classe `imediato` (nada de fade-in começando do vazio). O primeiro quadro também vira a miniatura no feed.
- **Legenda é o próprio texto na tela**: cerca de 85% assiste sem som. A narração repete ou complementa, nunca é a única fonte da mensagem.
- **Texto grande**: gancho 96–110px, título 76–88px, texto ≥ 44px. No máximo ~12 palavras por tela.
- **Material real > arte genérica**: use `../../../assets/exemplo-*.jpg` dentro de `.cartao`.
- Animação **somente CSS**: classes `imediato`, `entra`, `sobe`, `zoom`, `pop`, `pulsa`, `risca`, `lento`, com `style="--d: 0.6s"` para o atraso. Escalone os elementos com intervalos de 0.3–0.6s.
- Não use `ease`/`linear` em entradas: o `reel.css` já aplica `cubic-bezier(0.16, 1, 0.3, 1)`.
- Classes de fundo: `fundo-verde` (+`padrao` para textura), `fundo-areia`, `fundo-laranja`.

Veja `references/design-reels.md` para ritmo, durações e receitas de cena.

### 4. Configure `reel.json`
```json
{
  "fps": 30,
  "voz": "pt-BR-FranciscaNeural",
  "velocidade_voz": "+8%",
  "musica": null,
  "volume_musica": 0.15,
  "capa": { "cena": 0, "tempo": 1.5 },
  "cenas": [
    { "arquivo": "cenas/01-gancho.html", "duracao": 2.8, "narracao": "Domingo de novo planejando aula?" }
  ]
}
```
- `duracao` em segundos. Com narração, a cena é esticada automaticamente se a fala for mais longa.
- `voz`: `pt-BR-FranciscaNeural` (feminina, acolhedora; padrão), `pt-BR-ThalitaMultilingualNeural` (feminina, jovem) ou `pt-BR-AntonioNeural` (masculina).
- `musica`: caminho para um MP3 **livre de direitos** (relativo à pasta do Reel). Na maioria dos casos é melhor deixar `null` e escolher um áudio em alta no próprio Instagram, o que ajuda o alcance.

### 5. Confira antes de renderizar (rápido)
```bash
node .claude/skills/demo-video/scripts/build_reel.cjs _reels/<nome> --previa
```
Gera `saida/previa-NN.png` (um quadro por cena). **Abra as imagens e confira**: texto cortado, contraste, zona segura, imagem quebrada.
Para ver as guias da zona segura no navegador, abra a cena com `?guias` no fim da URL.

### 6. Renderize
```bash
node .claude/skills/demo-video/scripts/build_reel.cjs _reels/<nome>
```
Leva cerca de 2s de processamento por segundo de vídeo. Depois **extraia alguns quadros** do MP4 e confira
(`ffmpeg -i saida/reel.mp4 -vf "fps=1,scale=270:480,tile=8x1" -frames:v 1 folha.png`).

### 7. Entregue
Envie `saida/reel.mp4`, `saida/capa.jpg` e `saida/narracao.txt` à usuária, junto com a **legenda do post** (skill `social-content`)
e o texto passado pela skill `content-humanizer`.

## Narração (voz sintética, padrão da Prof+)
Todo Reel leva narração. Escreva `narracao` em **todas** as cenas do `reel.json`.

O script tenta duas coisas e entrega as duas:
1. **Voz automática no MP4 (edge-tts)**: funciona no computador da usuária (`pip install edge-tts`).
   Na sessão na nuvem do Claude Code a rede bloqueia o servidor de voz: o script avisa e gera o MP4 sem voz.
2. **`saida/narracao.txt`** (sempre gerado): a fala de cada cena com o segundo em que ela começa. Serve para:
   - **Instagram** → editor do Reel → **Texto** → digite a fala → **Texto para fala** → escolha a voz;
   - **CapCut** → Texto → **Conversão de texto em fala** (tem as vozes virais).
   Quando o MP4 sair sem voz, diga isso à usuária e entregue o `narracao.txt` junto.

Boas práticas da narração:
- A 1ª frase **é** o gancho, dita em até 2s.
- Uma frase por cena, até ~12 palavras; a fala e o texto na tela dizem a mesma coisa (quem assiste sem som não perde nada).
- Escreva para o ouvido: números por extenso, sem parênteses, sem emoji, pontuação marcando as pausas.
- `velocidade_voz` entre `+8%` e `+15%` dá o ritmo de Reel viral.
- Teste a pronúncia de "Prof+" (a voz pode ler "prof mais" ou "prof"): na narração escreva **"Prof Mais"**.

## Estruturas prontas
| Formato | Duração | Sequência |
|---|---|---|
| Dor → Solução (padrão) | 18–25s | Gancho 2–3s → Dor 4–5s → Solução 5s → Prova 3–4s → CTA 3–4s |
| Teaser | 10–15s | Gancho 2s → Material real 6s → Logo + CTA 3s |
| Lista de dicas | 25–40s | Gancho 3s → Dica 1/2/3 (5–7s cada) → CTA com "salva" 4s |
| Antes × Depois | 15–20s | Antes (caos) 5s → Depois (material pronto) 6s → Como 5s → CTA 3s |
| Folheando o material | 12–20s | Gancho 2s → 3–4 páginas reais com `lento` 3s cada → CTA |

## Checklist de qualidade
- [ ] Gancho legível no 1º quadro e entendível em 2s, sem som
- [ ] Nada importante fora do `.palco`
- [ ] Uma ideia por cena; nenhuma tela com mais de ~12 palavras
- [ ] Pelo menos uma cena com **material real** ou prova verdadeira
- [ ] CTA único e claro no fim (WhatsApp / link na bio / salvar / comentar)
- [ ] Números conferidos com o arquivo de contexto (nada inventado)
- [ ] Narração em todas as cenas; 1ª frase = gancho
- [ ] Duração total 15–45s
- [ ] `previa` conferida e quadros do MP4 conferidos

## Anti-padrões
| Erro | Correção |
|---|---|
| Ritmo de slide: toda cena com a mesma duração | Varie: gancho 2–3s, prova 4–6s, CTA 3–4s |
| Parágrafo na tela | Corte para ≤ 12 palavras; o resto vai para a legenda do post |
| Abrir com logo ou "Olá, pessoal" | Abra com a dor ou a promessa; o logo vai no fim |
| Texto embaixo, atrás da legenda do Instagram | Respeite a zona segura |
| Arte bonita sem prova | Mostre um material real |
| Vídeo horizontal reaproveitado | Sempre 9:16 nativo |
