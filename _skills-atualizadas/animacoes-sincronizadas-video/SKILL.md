---
name: "animacoes-sincronizadas-video"
description: "Adiciona animações, zooms, títulos, B-roll e efeitos sonoros que entram na palavra exata da fala, na ordem certa, e faz a checagem final antes de postar. Use ao pedirem animações, zoom, punch-in, B-roll, efeitos ou revisão de vídeo pronto."
---

# Animações sincronizadas à fala + checagem final

Adaptado de `punch-in`, `headline`, `broll-cutaways`, `sound-effects`, `music-bed` e `qc-check` de AskEditor/ai-video-editing-skills (MIT). Composição com a skill `remotion-motion-graphics`; efeitos sonoros com `openverse-sfx`.

## Ordem obrigatória do pipeline
1. Corte (`corte-limpo-video`) — muda os tempos, por isso vem primeiro. Depois transições nas emendas.
2. Cor/fundo (grade, coisas atrás da pessoa).
3. Tudo que desenha por cima (legendas, títulos, cards, listas) numa ÚNICA composição Remotion, para que cada camada desvie das outras e do rosto. Nunca queime uma camada e aplique outra por cima de um arquivo já queimado.
4. Música e efeitos sonoros por último (só mexem no áudio).
Retranscreva sempre o vídeo da etapa 1 e use esses tempos em tudo depois.

## Regras de sincronia
- Todo elemento entra no PRIMEIRO frame da palavra que o nomeia (o Whisper marca as palavras um pouco atrasadas: puxe ~40–60 ms para trás).
- Nada sai ou volta no meio de uma palavra: sai na pausa seguinte ou no fim da oração.
- Nunca adivinhe um tempo pelo que a pessoa descreveu; ache a palavra na transcrição.

## Punch-in (zoom na palavra)
- Escolha automática: a palavra mais forte de cada frase, no mínimo ~2,5 s entre zooms (≈1 a cada poucos segundos).
- Estilos: `punch` (rápido, chega no 1º frame da palavra, segura até o fim da frase, volta na pausa), `push` (lento, chega na palavra), `drift` (lateral), `pull` (começa perto e abre).
- Quantidade 1,15–1,3× (máx 1,5), mirando o rosto, não o centro. Deixe 10% do quadro acima da cabeça e a faixa abaixo do queixo livre para legenda. Sem espaço? Zoom menor ou pule a palavra e avise.
- Legendas ficam FORA do zoom (camada acima), sem crescer com ele.
- Som: hit suave no punch, riser no push, whoosh no pull, nada no drift — sempre abaixo da voz.

## Título / texto grande
Frase de efeito em tipografia grande, entrando quando é dita, nunca sobre o rosto, dentro da zona segura (x 120–960 em 1080; fora dos 20% inferiores e 10% superiores). Uma por ideia, não em toda frase.

## B-roll na palavra
- Associação: mapa explícito ("lago=IMG_5922.MOV") → nome do arquivo → `tags.txt` ("IMG_5925.MOV: cidade, rua"). Clipe sem nome/tag correspondente fica de fora e você diz por quê (não jogue imagem aleatória numa palavra).
- Cada inserção dura 1–3 s, começa na palavra e volta à pessoa numa pausa. Abra e feche o vídeo na pessoa; pelo menos 1 s de pessoa entre dois B-rolls; B-roll ≤ 50% do vídeo.
- Modos: tela cheia, split (B-roll em cima, pessoa embaixo) ou pessoa no canto. Áudio do B-roll mudo ou bem abaixo da voz.
- Faça uma folha de contato (1 frame de cada clipe + palavra onde caiu) e olhe antes de renderizar.

## Efeitos sonoros e música
- SFX (whoosh, pop, click, hit, riser, ding) no primeiro frame do momento: corte, card que aparece, número dito. Não em tudo — só onde há mudança visual.
- Música da própria pessoa por baixo da voz com ducking: `ffmpeg -i video.mp4 -i musica.mp3 -filter_complex "[1:a]volume=0.35[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];[0:a][md]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy out.mp4`, com fade-out da música terminando junto com o vídeo.

## Antes de renderizar: stills
Renderize 3–5 frames nos momentos-chave e confira: nada no rosto, nada cortado, texto certo, camadas sem se sobrepor. Corrija e só então renderize tudo.

## Checagem final (antes de dizer que está pronto)
```
ffprobe -v error -show_entries stream=width,height,r_frame_rate,codec_name -of compact VIDEO
ffmpeg -i VIDEO -af loudnorm=I=-14:TP=-1:print_format=summary -f null -      # alvo -14 LUFS, pico ≤ -1 dBTP
ffmpeg -i VIDEO -af astats=metadata=1 -f null -                               # clipping (pico em 0 dB)
ffmpeg -i VIDEO -af silencedetect=noise=-50dB:d=1 -f null -                   # silêncio morto
ffmpeg -i VIDEO -vf blackdetect=d=0.1:pix_th=0.1 -an -f null -               # frames pretos
ffmpeg -i VIDEO -vf freezedetect=n=-60dB:d=0.5 -an -f null -                 # imagem congelada
```
Critérios: 9:16 e ≥ 720 de largura para Reels/TikTok/Shorts; loudness dentro de 3 LU do alvo (3–6 LU = aviso, mais = falha; corrija com loudnorm em 2 passadas); preto no meio = falha (fade no início/fim = ok); congelado com voz rolando = falha (frame final segurado = ok). Monte uma folha com os frames críticos, zona segura tracejada e caixa do rosto, e olhe. Resultado: PASS ou FAIL + o que corrigir primeiro.

## Entrega
Diga onde está o arquivo, o que foi aplicado e em que palavras, e o que a checagem achou em uma linha.
## PERFIL ÁLIBI — checagem extra antes de entregar
Além da checagem final acima, um vídeo do ÁLIBI só passa se:
- o **1º frame já tem movimento e voz** (nada de título parado sobre foto parada; nada de "Caso nº X" na abertura);
- há **mudança visual a cada 3–5 s** e **nenhuma imagem parada > 4 s** (`freezedetect` + folha de contato a cada 2 s);
- existe um **laço aberto** no meio e a **tela final puxa o próximo caso** ("Próximo caso no perfil · Segue o Álibi", sem dia/hora);
- efeitos discretos (ganho 0,45; nenhum pico acima da voz) e a legenda nunca some.
Entrega sempre acompanhada do PACOTE DE POSTAGEM (skill `alibi-perfil` §5).
