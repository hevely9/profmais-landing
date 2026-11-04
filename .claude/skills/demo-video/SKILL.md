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
- ✅ Narração por voz sintética (edge-tts) **quando disponível**.
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
- `voz`: `pt-BR-FranciscaNeural` (feminina, acolhedora; padrão), `pt-BR-ThalitaMultilingualNeural` (feminina, jovem) ou `pt-BR-AntonioNeural` (masculina). Use `null` para vídeo sem voz.
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
Envie `saida/reel.mp4` e `saida/capa.jpg` à usuária, junto com a **legenda do post** (skill `social-content`)
e o texto passado pela skill `content-humanizer`.

## Narração e ambiente
- O edge-tts precisa de internet (servidor da Microsoft). **Na sessão na nuvem do Claude Code ele é bloqueado pela rede**: o script avisa e gera o vídeo sem voz.
- No computador da usuária: `pip install edge-tts` e rode o mesmo comando para ter narração.
- ⚠ **Posicionamento**: a Prof+ vende "feito por professores, não por robô". Voz sintética pode soar robótica e contradizer isso. Ordem de preferência: voz real da equipe → texto na tela + áudio do Instagram → voz sintética. Lembre a usuária disso quando ela pedir narração.
- Para usar voz gravada: grave um áudio por cena (`voz-01.m4a`...), converta para MP3 e use-o como `musica` com `volume_musica: 1.0`, ou peça para adaptar o script.

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
