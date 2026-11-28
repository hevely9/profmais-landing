---
name: "legendas-video-ptbr"
description: "Cria legendas palavra a palavra em português que nunca cobrem o rosto, com quebra natural de frases, palavra-chave destacada e zona segura de Reels/TikTok/Shorts. Use ao pedirem legenda, legendar, subtitle ou texto na tela."
---

# Legendas animadas PT-BR

Adaptado das regras de `captions` de AskEditor/ai-video-editing-skills (MIT), reescritas para o português. Renderização com a skill `remotion-motion-graphics` (preferida) ou, sem Remotion, com arquivo .ass queimado pelo ffmpeg.

## 1. Palavras com tempo
Use o `*.palavras.json` gerado pela skill `corte-limpo-video` — mas transcreva DE NOVO o vídeo já cortado (os tempos mudam após o corte). faster-whisper, modelo `small` multilíngue, `language="pt"`, `word_timestamps=True`.
- Leia a lista inteira e corrija nomes, marcas e termos técnicos antes de legendar.
- Nunca chute um segundo pelo que a pessoa descreveu ("quando eu falo X"): ache a palavra na lista e use o tempo dela.
- Palavras com probabilidade < 0,4 em trecho sem voz são invenção do transcritor: não mostre.
- Muletas (ahn, hã, hum) são ouvidas mas nunca aparecem na legenda.

## 2. Agrupar em frases (regras PT-BR)
Corte o texto, nesta ordem de preferência:
1. Depois de vírgula, ponto ou pausa real na voz (> 0,25 s).
2. Antes de palavra que abre oração: e, mas, porque, que, quando, se, então, pois, enquanto.
3. Antes de palavra que abre sintagma: para, com, sem, de, em, no, na, o, a, um, uma.
- Uma linha nunca termina em palavra que se apoia na próxima: o, a, os, as, um, uma, de, do, da, em, no, na, e, que, pra, para, com, meu, minha, seu, é.
- Nunca separe o que se fala junto: "agora mesmo", "por exemplo", "tipo assim", nome e sobrenome, número e unidade ("30 dias", "R$ 50").
- 2–4 palavras por bloco (one-word: 1). Linhas com tamanho parecido. Bloco fica na tela até ~0,3 s após a última palavra e nunca pisca (< 0,5 s).

## 3. Palavra-chave
A mais específica do bloco: número, nome próprio, sigla, substantivo longo que não é gramática. Se nada for específico, não destaque nada (melhor que destacar palavra vaga). Destaque = cor de acento + até 1,6× o tamanho; as outras ficam com pelo menos 60% da altura dela.

## 4. Estilos
- `empilhado` (padrão): 2–3 linhas, palavra-chave maior e colorida.
- `uma-palavra`: uma palavra grande por vez, chaves coloridas.
- `caixa-serifada`: serifa em caixa escura arredondada, palavra falada acende.
- `bloco`: palavra-chave enorme, as vizinhas ajustadas à mesma largura.
Palavra aparece no instante em que é dita (pop de 3–4 frames: escala 0,8→1 com spring).

## 5. Posição (nunca no rosto)
- Detecte o rosto (MediaPipe face detection) a cada ~0,2 s e guarde a caixa.
- Zona segura em 1080×1920: x entre 120 e 960; acima dos 20% inferiores (legenda/botões do app); abaixo dos 10% superiores.
- Posição padrão: altura do peito, abaixo do queixo. Se o rosto estiver baixo, vá para cima da cabeça.
- Teste a posição contra a caixa do rosto em TODOS os frames em que o bloco fica na tela. Escolha uma posição estável para o vídeo; só mova um bloco quando for obrigatório.
- Rosto ocupando quase o quadro inteiro: achate o bloco (1 linha), depois reduza a fonte; avise a pessoa.

## 6. Conferir antes de renderizar o vídeo todo
Renderize 3–5 stills (Remotion `npx remotion still` em frames escolhidos: primeira frase, logo após um corte, última frase) e olhe: palavras certas, nada no rosto, nada cortado na borda. Conte os frames com legenda tocando a caixa do rosto e fora da zona segura — os dois devem ser 0. Só então renderize.

## Fallback sem Remotion
Gere `.ass` com `PlayResX=1080, PlayResY=1920`, um evento por bloco, `\\pos(x,y)` calculado pela regra 5 e `{\\c&H00D4FF&}` na palavra-chave; queime com `ffmpeg -i in.mp4 -vf "ass=legenda.ass:fontsdir=./fonts" -c:a copy out.mp4`.

Pedidos comuns → opção: "uma palavra por vez" → uma-palavra; "destaque verde" → acento #3ddc84; "legenda em cima" → topo (ainda evitando o rosto); "menos palavras" → máx. 2.
## PERFIL ÁLIBI
- Legenda **sempre ativa** do primeiro ao último segundo de fala (some só durante a pergunta final grande, para não repetir).
- Inter 800, 56 px, branco-osso #ECE7DC; palavra-chave em vermelho #E0353F; palavra ainda não dita a 35%.
- Máx. 3 palavras por bloco, quebra em pontuação; faixa y 1320–1480 em 1080×1920, x 70–910 (margem direita 170 px
  por causa dos botões do TikTok). Texto de cena sempre acima de y 1240.
- Corrigir na transcrição nomes próprios e valores ("R$ 50", "segunda-feira") antes de renderizar.
