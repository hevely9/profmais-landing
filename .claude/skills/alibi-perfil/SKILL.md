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
- Imagens só reais e licenciadas (Commons/FBI/Agência Brasil) com crédito; **conferir se a imagem baixada é mesmo o que o
  nome diz** (já veio carta no lugar de quadro). Wikimedia: miniaturas 1920/960 px sem `?utm`.
- Exportar: `-profile:v high -level:v 4.1 -pix_fmt yuv420p -movflags +faststart`, -14 LUFS, < 50 MB.
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

## 5. ENTREGA OBRIGATÓRIA — "PACOTE DE POSTAGEM" (sem o usuário pedir)
Em toda entrega de vídeo, mandar junto:
[1] **Título interno + nº do caso**
[2] **Texto da capa** (até 5 palavras, curiosidade)
[3] **Legenda — 3 opções**, marcar a recomendada. Cada uma com 4 linhas:
   - L1: gancho que repete a curiosidade sem spoiler (≤ 80 caracteres — é o que aparece antes do "mais");
   - L2: um detalhe intrigante; L3: pergunta que provoca comentário;
   - L4: "Tem caso novo no perfil. Segue o Álibi." (sem prometer dia/hora)
   Tom misterioso, direto, PT-BR natural, no máx. 2 emojis discretos (🔎 🕯️), sem clichê de IA.
[4] **Hashtags: 4 a 6** — 2 amplas (#truecrime #casosreais) + 2 de nicho (#truecrimebrasil #casosmisteriosos,
   alternando com #crimesreais #casoreal) + 1–2 do caso. **Proibido**: #fyp #foryou #foyou #viral #paravoce, erro de
   digitação ou sem relação (#serie, #quartafeira, #prisonbreak).
[5] **Comentário para fixar** (pergunta ou bastidor)
[6] **Turno sugerido** (manhã, tarde ou noite) — quem decide quando postar é o usuário
[7] **Checklist**: gancho no 1º segundo? 60–90 s? nada parado > 4 s? CTA no final? hashtags conferidas?

Antes de entregar, revisar a legenda como editor exigente: cortar palavras, conferir ortografia e garantir que a L1
sozinha já faça a pessoa querer ver o vídeo.
