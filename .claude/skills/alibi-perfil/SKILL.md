---
name: alibi-perfil
description: Regras do perfil ÁLIBI (@alibi.criminal, TikTok, true crime PT-BR) — gancho em 1 segundo, roteiro de 60-90 s, temas seguros, edição em Remotion com o kit do lote 1, rotina de postagem (cerca de 3 por dia, sem prometer dia/hora) e o PACOTE DE POSTAGEM obrigatório em toda entrega. Use sempre que o pedido for um vídeo, roteiro, capa, legenda ou análise do ÁLIBI.
---

# PERFIL ÁLIBI — regras de roteiro, edição e postagem

Fonte: relatório de 19/11/2026 enviado pelo usuário + decisões aprovadas em
`.claude/skills/video-content-strategist/references/padrao-aprovado.md` (seção ÁLIBI).
Projeto-modelo do formato curto: `_reels/alibi-lote1` (kit em `src/kit.tsx`).

## 1. Contexto e dados reais (19/11/2026)
- "31 anos sem ser pego" (impulsionado, 4min52s): 1.580 views, 97 seguidores (~6%), tempo médio 10,9 s,
  1,02% até o fim, 94,8% do tráfego do Para Você.
- "3,5 toneladas de dinheiro" (orgânico, 1min04s): 57 views, tempo médio 7,7 s, **a maioria saiu em 0:01**, 1 seguidor.
- Público: 57% homens / 40% mulheres; 25–54 anos = 79% (18–24 só 9%); Brasil 97,7%.
- Conclusão: o conteúdo **converte quem passa do começo**, mas perde o desconhecido no **primeiro segundo**.
  Abertura parada (tela de título + foto) e vídeos longos derrubam a retenção e o TikTok corta a distribuição.
- Pela API os posts aparecem com recomendação "hesitante": violência explícita e tragédias com crianças aumentam o risco.

## 2. Regras de roteiro (obrigatórias)
a) **Gancho em 1 segundo**: começa no meio da ação, com **voz e movimento no 1º frame**. Proibido abrir com tela de
   título parada, logo, vinheta ou "Caso nº X" sozinho.
a2) **O que vem DEPOIS do gancho (análise do usuário, 21/11 — vídeo do Banco Central com 200 mil views)**: o gancho segura o
   1º segundo, mas quem segura a pessoa é a frase seguinte — ela precisa confirmar que "esse vídeo pode ser bom": um motivo
   forte (prova de relevância: "virou série na Netflix e estreou em 1º lugar", número absurdo, contradição) e logo o laço
   ("pra entender, a gente precisa voltar…"). Motivo fraco depois do gancho = a pessoa sai. Fórmula que bateu 200 mil:
   número + absurdo no gancho, números contando na tela, mapa/diagrama animado, detalhe humano estranho, frase curta = imagem
   nova, laço aberto no fim. Conferir que nenhuma foto fica fora do enquadramento (rosto cortado) antes de renderizar.
b) **1ª frase** = o absurdo/contradição do caso em **até 12 palavras** ("Ele roubou 160 milhões. E foi preso por causa de
   um carro."). Primeiro o mistério, depois o contexto.
c) **Duração 60–90 s** (máx. 2 min) enquanto a conta for nova.
d) **Quebra visual a cada 3–5 s** (zoom, corte, b-roll, texto, mapa, documento). **Nenhuma imagem parada > 4 s.**
e) **Laço aberto no meio**: "mas o detalhe que entregou ele foi outro…".
f) **Final** = revelação → assinatura curta da marca "Onde você estava naquela noite? …e esse era o álibi." (decisão do
   usuário, mantida) → **CTA que puxa o próximo caso**: "Próximo caso no perfil. Segue o Álibi." (sem prometer dia nem hora)
   O CTA vai na voz (roteiros novos) e também na tela final.
   **Bordão adaptável (decisão do usuário, 20/11):** quando o caso permitir, adaptar a assinatura à realidade do vídeo de um
   jeito interessante, sem só trocar "noite" por "dia"/"tarde". Mantém o "Onde você estava…" e o "álibi". Ex. (caso 016,
   futebol): "Onde você estava aos 32 do segundo tempo? …cada torcida tem o seu álibi."
k) **Gancho com corte de reação de famoso (21/11, ideia do usuário)**: abrir com 3–5 s de reação forte de streamer
   conhecido (ex.: LOUD Coringa) que tenha relação direta com o caso; a narração entra logo depois, sem apresentar quem é.
   Cobrir marca d'água de app (Cut.Pro etc.) com a etiqueta "LOUD CORINGA REAGINDO"; legendar a fala se o corte não tiver.
   Testar reações diferentes e comparar retenção. Kit: `_reels/alibi-lote4/src/serie.tsx` (Corte, FalaCorte, Misterio, Compara).
   Séries em partes: cada parte fecha com gancho e "segue o Álibi pra ver a parte X" (sem prometer quando sai).
j) **Vídeos de polêmica/torcida (ex.: futebol, caso 016)**: objetivo = comentário. Dar a CADA lado a sua "versão" com o
   mesmo peso (um bloco por torcida, com as cores do clube), nunca acusar, e fechar com "o tribunal é você" + pergunta
   binária + "defende o seu time nos comentários". Comentário fixado e respostas prontas que fazem o "advogado do diabo"
   para os dois lados (sem atacar ninguém). Nesses temas o usuário aceita mais duração (até 2:30) e mais créditos.
g) **Temas**: golpes, roubos, fugas, investigações, casos resolvidos por um detalhe, mistérios.
   **Evitar**: violência gráfica, massacres, vítimas crianças, corpos/sangue. Respeito às vítimas; nunca glamourizar o criminoso.
h) **Conteúdo original**: narração e montagem próprias, imagens transformadas (zoom, recorte, texto). Nada de trechos longos
   de séries/telejornais.
i) **Legenda sempre ativa**, palavra-chave destacada, fora do rosto e da interface do TikTok.

Narração: voz aprovada do ÁLIBI = **James – Deep Narrator** (`WrT2M515LQuE5m5EYh0W`, `eleven_v4`, 1 versão por geração,
sem acelerar o áudio, frases curtas). Orçamento até 2.500 créditos por vídeo.

## 3. Edição (Remotion, kit `_reels/alibi-lote1/src/kit.tsx`)
- **Quadro 0 com movimento**: fundo em vídeo (clipe em movimento) ou foto entrando com "soco" rápido (escala 1,25→1 em
  ~0,4 s) + **texto do gancho entrando palavra a palavra junto com a voz**. Nunca título em bloco estático sobre foto parada.
- "ÁLIBI · CASO Nº X" (HUD) só aparece **depois do gancho (≥ 3 s)**; número também na capa e na legenda.
- Corte a cada 3–5 s (componente `Plano`); Ken Burns em toda foto; nada parado > 4 s.
- Legenda: Inter 800, 56 px, máx. 3 palavras, chave em #E0353F, faixa y 1320–1480, margem direita 170 px (botões do app).
- Tela final (últimos ~3 s): ÁLIBI + "PRÓXIMO CASO" + "SEGUE O ÁLIBI" (nunca prometer dia/hora).
- **Pessoas reais: sempre que possível, mostrar a FOTO REAL da pessoa** (pedido do usuário, 20/11 — "gera curiosidade, as pessoas pensam: eu já vi esse cara"). Ordem: foto com licença livre (Commons/FBI/Agência Brasil); se não houver, reprodução de reportagem/entrevista (ex.: miniatura do YouTube em `i.ytimg.com/vi/<id>/maxresdefault.jpg`), recortada sem letreiros, melhorada com o upscaler e com crédito "Reprodução · <veículo>". Nunca rosto gerado por IA; nada de vítimas menores.
- **Imagens e vídeos reais do caso sempre que puder (usuário, 22/11)**: a casa/local do crime, reconstituição, perícia,
  delegacia, prisão, tribunal, entrevistas da época (miniaturas de reportagens com crédito "Reprodução · veículo").
  Limite: nada de corpos, sangue ou violência gráfica.
- **Identidade visual do Álibi (dossiê, 22/11)** — usar em todo caso: `_reels/alibi-lote4/src/dossie.tsx`
  (Mural do investigador com fios vermelhos, Planta da casa animada, VERSÃO × FATO, Manchetes reais, Hora da noite,
  Fechamento do dossiê com carimbo). Conferir enquadramento: rosto inteiro, foto no formato certo (moldura com a mesma
  proporção da imagem), sem letreiro/logo de TV.
- **Tom**: em casos com vítimas conhecidas, contar pelo lado delas (quem eram) — melancólico, respeitoso.
- Imagens só reais e licenciadas (Commons/FBI/Agência Brasil) com crédito; **conferir se a imagem baixada é mesmo o que o
  nome diz** (já veio carta no lugar de quadro). Wikimedia: miniaturas 1920/960 px sem `?utm`.
- Exportar em ALTA qualidade (o TikTok recomprime; não economizar bitrate): `-crf 16 -maxrate 14M -profile:v high -pix_fmt yuv420p -movflags +faststart`, áudio AAC 192k, -14 LUFS. Nada de limitar a 50 MB (decisão de 22/11: vídeos de 13 MB perderam nitidez). TikTok: dá pra baixar trechos daqui com yt-dlp (testado); YouTube não (bloqueio de bot).
- Capa 1080×1920: até 5 palavras grandes, 1 palavra em faixa vermelha, nº do caso no topo, texto no miolo 3:4 (y 240–1680).

## 4. Rotina de postagem (decisão do usuário, 19/11)
- **Cerca de 3 vídeos por dia** (manhã, tarde e noite), mas a frequência varia: às vezes no mesmo dia, às vezes
  com 1–2 dias de intervalo. **Quem decide quando postar é o usuário.**
- **Nunca prometer dia nem hora do próximo vídeo** (nem na voz, nem na tela final, nem na legenda). Usar
  "Próximo caso no perfil · Segue o Álibi".
- Série numerada "Caso nº 008, 009…" — **só na legenda e na capa**, nunca como abertura do vídeo.
- Ao postar: ficar 15–20 min respondendo comentários.
- **Não alterar vídeos já entregues nem gerar vídeos novos sem o usuário pedir.**
- **Numeração sob demanda (21/11):** a ordem pode mudar (ex.: Portuguesa × Flamengo entrou como 013). A cada postagem o
  usuário pede o PRÓXIMO vídeo: atualizar o nº só desse vídeo (selo no vídeo + capa + legenda), re-renderizar (0 crédito)
  e mandar só ele, com capa no tamanho certo (texto na área segura x 90–990, y 380–1540; também a versão 3:4) e a legenda.

- **Promessa = entrega (22/11, lição do Suzane reprovado):** gancho e capa só prometem o que o vídeo mostra. "O que a
  Netflix não mostrou" + fatos que todo mundo já sabe = vídeo reprovado. Preferir casos/ângulos com uma virada concreta
  (prova, horário, frase ambígua) e perguntas que dividem ("matou ou foi armação?"), mostrando os dois lados com fatos.

- **Revisão antes de entregar (22/11, pedido do usuário — obrigatória):**
  1. Tempo de tela: todo texto/carimbo/faixa fica ≥ 1,5 s visível antes do corte; se não, estender a cena (a seguinte
     começa um pouco depois) ou fazer o elemento entrar antes. Nada some "antes da hora".
  2. Clipes de fundo: from + dur ≤ duração real do arquivo (senão o fundo congela/some no fim da cena).
  3. Cenas contínuas, sem buraco nem sobreposição entre Planos.
  4. Enquadramento: extrair 1 quadro por segundo do MP4 final e olhar todos: rosto inteiro, nada cortado pela borda,
     texto dentro da área segura, sem logo/marca d'água, documento sem texto cortado pela metade, carimbo sem cobrir rosto.
  5. **LEGENDAS E TEXTOS SEM SOBREPOSIÇÃO (25/11, usuário — em TODO vídeo, sem ele precisar lembrar):** dois textos no
     mesmo lugar ao mesmo tempo viram letras embaralhadas (aconteceu no Nº 027: "Geórgia · 1982" + "baseado no livro…"
     no mesmo top). Antes de renderizar: `python3 _reels/alibi-lote4/checa-textos.py src/v/<video>.tsx` (tem de dar OK).
     Na revisão do MP4, ler cada legenda e cada texto: palavra legível, sem letra em cima de letra, sem texto embaixo
     de outro, legenda de baixo sem colidir com rótulo da cena.
  6. **ÁUDIO (25/11, usuário):** nada de silêncio longo no começo. A voz entra em até ~2,5 s, e uma abertura sem
     narração pareceu "áudio atrasado". Efeito sonoro (tiro, impacto) cai no quadro exato da ação, conferido quadro a
     quadro no clipe. Transcrever o MP4 final e comparar o tempo das palavras com a legenda (sincronia).
  7. **Só entregar quando estiver 100% (25/11, usuário):** fazer toda a revisão (itens 1–6) no MP4 final ANTES de mandar.
     Nunca mandar uma versão "pra ver" e corrigir depois.

- **SEM PEDIR COMENTÁRIO (22/11, decisão do usuário — vale até ele mudar):** o público ainda é pequeno e pedir resposta
  deixa o vídeo "no vácuo". Nada de "me fala", "comenta", "responde SIM ou NÃO", "o tribunal é você", caixa de CTA com
  pergunta na tela final (usar `cta: ["", ""]`), pergunta no Fechamento, nem pergunta na legenda/comentário fixado.
  Só o caso, bem contado. Mantém: bordão do álibi + "Próximo caso no perfil. Segue o Álibi." A regra j (polêmica) fica
  suspensa na parte de pedir torcida; mostrar os dois lados com fatos continua valendo.

- **CARROSSEL (Modo Foto do TikTok), 22/11:** mini-história em **4 fotos** 1080×1920, PNG, qualidade máxima
  (componente `alibi-lote4/src/carrossel.tsx`, composições `Car-*`). Sempre **imagens reais do caso** + **título** em cada
  foto; 1ª foto = gancho que faz arrastar; cada foto vira a história; a 4ª **para antes da virada** e chama:
  "Quer saber…? Comenta PALAVRA que a história completa vai pro perfil." (exceção à regra "sem pedir comentário",
  decidida pelo usuário só pro carrossel; pedir UMA palavra). Imagem horizontal = modo `faixa` (inteira e nítida,
  fundo desfocado), nunca esticar imagem pequena. Marca d'água coberta por etiqueta de crédito.
  **Antes de sugerir caso, conferir a lista do que já foi feito** (alibi-001..006, lote1–4): Hinterkaifeck, BTK,
  D.B. Cooper, BC Fortaleza, Alcatraz, Jules Rimet, Gardner (011), Marcelo VIPs, Portuguesa×Flamengo, Telexfree,
  Lobo de Wall Street, Poderoso Chefão, Chantay, Natalee, Suzane (não postado), Karen Read, Criciúma.

- **SEM BORDÃO (25/11, usuário):** não usar mais "Onde você estava naquela noite? … e esse era o álibi" em nenhum vídeo
  (fica estranho e desrespeitoso com a vítima). O vídeo termina no desfecho do caso + "Próximo caso no perfil. Segue o Álibi."

## 5. ENTREGA OBRIGATÓRIA — "PACOTE DE POSTAGEM" (sem o usuário pedir)
Em toda entrega de vídeo, mandar junto:
[1] **Título interno + nº do caso**
[2] **Texto da capa** (até 5 palavras, curiosidade)
[3] **Legenda — 3 opções**, marcar a recomendada. Cada uma com 4 linhas:
   - L1: gancho que repete a curiosidade sem spoiler (≤ 80 caracteres — é o que aparece antes do "mais");
   - L2: um detalhe intrigante; L3: outro fato forte do caso (NÃO pergunta pedindo resposta — ver regra "sem pedir comentário");
   - L4: "Tem caso novo no perfil. Segue o Álibi." (sem prometer dia/hora)
   Tom misterioso, direto, PT-BR natural, no máx. 2 emojis discretos (🔎 🕯️), sem clichê de IA.
[4] **Hashtags: 4 a 6** — 2 amplas (#truecrime #casosreais) + 2 de nicho (#truecrimebrasil #casosmisteriosos,
   alternando com #crimesreais #casoreal) + 1–2 do caso. **Proibido**: #fyp #foryou #foyou #viral #paravoce, erro de
   digitação ou sem relação (#serie, #quartafeira, #prisonbreak).
[5] **Comentário para fixar** (opcional: um bastidor/fato extra; nunca pergunta pedindo resposta)
[6] **Turno sugerido** (manhã, tarde ou noite) — quem decide quando postar é o usuário
[7] **Checklist**: gancho no 1º segundo? 60–90 s? nada parado > 4 s? CTA no final? hashtags conferidas?

Antes de entregar, revisar a legenda como editor exigente: cortar palavras, conferir ortografia e garantir que a L1
sozinha já faça a pessoa querer ver o vídeo.
