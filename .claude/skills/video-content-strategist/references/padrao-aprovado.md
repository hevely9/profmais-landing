# Padrão aprovado pelo usuário (feedback de 10/11/2026)

Vídeo de referência: `_reels/simbolos-rotulo` ("Símbolos dos cosméticos", perfil **@explicafarmacia**).
Feedback literal: "o resto tá perfeito, não mexi em nada, ficou maravilhosamente perfeito". Use este vídeo como o modelo a seguir.

## Formato que funcionou
- **Áudio real da pessoa** (vídeo já gravado) → extrair, **limpar o ruído** e animar por cima. Ela quer a voz dela, limpa.
  - Limpeza: `arnndn` (RNNoise, modelo `bd.rnnn` de GregorR/rnnoise-models) + highpass 70 Hz + compressão leve; baixou ~13 dB o ruído.
    O `afftdn` sozinho quase não ajuda.
  - Transcrição com tempo por palavra: faster-whisper `large-v3-turbo` (local) quando o Scribe do ElevenLabs não estiver disponível.
- **Animação 100% em código (Remotion), sem gastar crédito**, ilustrando cada coisa no exato momento em que é dita.
- **Universo visual único:** papel claro pontilhado, embalagem em branco/cinza com rótulo em fonte mono, tinta preta,
  **marca-texto rosa**, **anotações à mão** (Caveat) com sublinhado rosa, **lupa** que amplia o rótulo de verdade.
- Uma embalagem só, com **câmera que passeia pelo rótulo**; cada tópico ganha um **cartão branco** com ícone grande animado,
  título (Inter 800) e nota à mão, ligado por uma seta desenhada ao ícone pequeno no rótulo.
- Microanimações com sentido: tampa que abre, contador de meses, coelho que se desenha, X no frasco, ampulheta que escoa,
  moedas caindo. Nada genérico.
- **Legenda karaokê** em pílula branca, com marca-texto rosa na palavra falada.
- Efeitos sonoros discretos (lápis, pop, whoosh) e trilha bem baixa por baixo da voz.

## Final do vídeo (obrigatório nos vídeos da @explicafarmacia)
- Depois da última fala, **tela da marca no MESMO fundo do vídeo** (nunca fundo preto solto):
  logo da Explica Farmácia (círculo rosa `#E0929B`, texto creme `#F8EBE1`, fonte Titan One — redesenhado em vetor,
  componente `LogoExplica` em `_reels/simbolos-rotulo/src/Reel.tsx`), "@explicafarmacia" no degradê do Instagram,
  nota à mão "gostou? segue a gente!" e botão **SEGUIR → SEGUINDO ✓** com um toque animado.
- Logo sempre em vetor/alta resolução — **não usar recorte de print** (fica borrado).

## Processo que o usuário aprova
- Mostrar o plano/roteiro antes de gastar crédito; testar uma cena antes de gerar tudo.
- Conferir quadros (folha de contato) e áudio antes de entregar; corrigir sobreposições de texto.

## Vídeo para cliente aprovado como PERFEITO — 13/11/2026
Feedback do usuário: "ficou maravilhoso" e, na versão final, "ficou perfeito". **A versão final (`out/v4`, 26,6 s) é o modelo a seguir.**
Referência: `_reels/basa-acredita-maria-alice` (assessora de crédito Maria Alice, BASA Acredita).
- **Cores da marca do cliente** medidas do material dele (aqui: verde-escuro `#012E1B`, verde `#0F5A33`, lima `#7DBA3E`, cinza `#EEF0EB`).
- **Personagem da cliente** desenhada em vetor, parecida com ela (cabelo, camiseta da marca, acessório marcante),
  que pisca, acena, fala (boca sincronizada à narração) e aponta para o contato.
- Estrutura que funcionou (~25 s): **dor** (empreendedora preocupada) → **solução** (logo + cartões) → **benefícios**
  (agilidade, menos burocracia, carimbo "crédito liberado", negócio cresce) → **"Como funciona?" em 3 passos curtos**
  com as duas personagens conversando → **chamada para o WhatsApp** com nome, número e frase da marca.
- Português correto no imperativo com "você": **"Fale com…", "Chame no WhatsApp"** (não "Fala/Chama").
- Não prometer aprovação nem citar taxas/valores que não estejam no material do cliente.
- Entregar também uma versão leve 720×1280 para **Status do WhatsApp**.
- **Final aprovado:** a narração termina no nome/cargo ("Fale com a Maria Alice, sua assessora financeira.") e a
  chamada "CHAME NO WHATSAPP" + número aparece **só na tela, sem narração**, com pop e notificação baixa depois da fala.
- **Nunca pôr efeito sonoro alto em cima da voz** (a notificação sobre "Chame no WhatsApp" fez o limitador "travar" o áudio).
  Medir o volume do trecho final antes de entregar.

## Canal NEXO (YouTube) — preferências do usuário (18/11/2026)
- **Não repetir o mesmo formato em todo vídeo.** Uma ideia aprovada é referência de qualidade, não molde: cada vídeo novo deve ter formato/visual diferente.
- **Voz:** Welliton (`VtMklhKDP2Y2mBvBbLwL`) no modelo **eleven_v4**, com tags de tom ([calm, warm]…) e **sem acelerar nem cortar pausas** —
  multilingual_v2 + atempo soou "robotizado" e foi reprovado. A voz clonada do usuário também foi reprovada.
- **Não gerar imagens com IA** sem pedido explícito ("pare de gerar imagem, já chega").
- Gancho precisa de **respiro** (~1–1,5 s) antes do resto do vídeo. Sem barra de progresso no topo.
- Tela final NEXO: mascote + símbolo azul + botão INSCREVA-SE vermelho do YouTube com mouse clicando → INSCRITO.
- Formato pedido: **tela dividida** (famoso em cima, vídeo satisfatório embaixo) com narração própria.

## Canal ÁLIBI (TikTok, true crime) — decisões de 18/11/2026
- Conceito aprovado: cada caso contado pelo **álibi** — "o que ele disse" × "o que as provas mostraram".
  Abertura fixa "Onde você estava naquela noite?", fechamento "…e esse era o álibi.", cartela "ÁLIBI · CASO Nº 00X · local · data" com som de cassete/REC.
- Paleta: grafite #0A0A0B, chumbo #1C1C1F, branco-osso #ECE7DC, vermelho-lacre #A3141C (uma vez por cena). Sem amarelo de fita policial.
- Fontes: títulos serifados pesados (Playfair Display Black), dossiê em máquina de escrever (Special Elite), legenda limpa.
- Voz escolhida: **James – Deep Narrator** (`WrT2M515LQuE5m5EYh0W`), dirigir com calma (tensão por pausas, não volume).
- Imagens: só fontes públicas/licenciadas (registros policiais oficiais, FBI Vault, tribunais, Commons); nada de sangue/corpos; nada de rostos reais gerados por IA.
- Perfil: silhueta de sobretudo e chapéu sob poste (ElevenLabs gpt-image-2.5), recorte quadrado em `_reels/alibi-marca/entrega/`.
- **Efeitos sonoros discretos (pedido 18/11):** ganho global `SFX_GANHO = 0.45` nos projetos ÁLIBI; nenhum efeito pode passar do pico típico da voz
  (medir picos dos trechos de efeito vs. p99.5 da voz antes de entregar). Para trocar só o áudio: `remotion render ... out/audio.wav --codec wav` e juntar com `-c:v copy`.
- Vídeos ÁLIBI: começo, meio e fim com capítulos; entregar o caso completo (não só suspense); nunca sobrepor texto de cena à legenda (zona da legenda y 1320–1480);
  gerar a voz com 1 versão só (generations_count 1) para economizar.
- **Feedback 18/11 (Caso 002):** "o vídeo dos carros na neve ficou muito perfeito, melhorou muito o vídeo" — clipe Mixkit 3317
  (carro em estrada de floresta com neve, P&B). Usar mais **cenas reais em movimento de lugares/estradas/clima** (carros, estrada à noite,
  neve, neblina) entre os documentos — dão "cara de documentário" e respiro. Entregar sempre também uma **versão leve (~45 MB)** em anexo,
  porque o app não deixou baixar o arquivo de 108 MB.
- **Caso 003 (BTK) = PADRÃO APROVADO** ("perfeito cara, quero que siga assim todos os vídeos"): `_reels/alibi-003`. Gancho que promete o detalhe
  pouco conhecido, 6 capítulos, ficha/documentos + fotos reais licenciadas + cenas em movimento (estrada, carros, chuva, neve), carimbos, marcadores,
  reconstituições sinalizadas, tela final com pergunta. Orçamento: **até 2.500 créditos por vídeo** (estimate_only antes; 1 versão), **1 a 3 minutos**.
- Casos com crianças/atentados em escola: sem foto nem destaque ao nome do autor, sem motivações/manifesto; foco em vítimas, quem ajudou e o que mudou.
- **Formato novo (Caso 005): "ACHE A MENTIRA"** — interativo inspirado nos vídeos de detetive do TikTok dos EUA: versão do suspeito (ficha) →
  3 pistas numeradas → "PAUSE AGORA" + contagem regressiva em silêncio (5 s) → revelação com dados → veredito → CTA "comenta ACHEI".
  Projeto: `_reels/alibi-005` (caso Dabate/Fitbit).
- **Feedback 18/11 (aberturas):** NÃO abrir vídeo com o clipe do carro embaçado (Mixkit 42039, vista de dentro do carro à noite) nem com imagens
  desfocadas/escuras demais: "dá impressão de qualidade ruim e as pessoas pulam". Os primeiros 2 s precisam de imagem **nítida e impactante**
  (foto real do caso, documento, texto forte em fundo limpo). **Não repetir os mesmos clipes entre vídeos** (42039, 4331, 3317, 46898 já usados):
  buscar imagens novas a cada caso — ter criatividade e variar.
- **Entrega compatível com celular (19/11):** o render do Remotion sai em `yuvj420p` nível 5.0 e o app do usuário não abriu.
  Sempre exportar a versão final com `-profile:v high -level:v 4.1 -pix_fmt yuv420p -color_range tv -movflags +faststart` (~1,6 Mbps, < 50 MB).
- **Diagnóstico das métricas (19/11) → FORMATO CURTO "LOTE 1"** (`_reels/alibi-lote1`, kit reutilizável em `src/kit.tsx`):
  as pessoas saíam aos 8–10 s (cartelas de marca e pausas no começo, narração lenta, abertura escura) e os vídeos longos/violentos
  não entravam no Para Você. Regras novas:
  - **60–75 s**; **gancho falado na 1ª frase** + **texto do gancho na tela já no quadro 0** sobre imagem real e nítida (LEAD 0,1 s).
  - **Sem cartela/capítulo no começo**; marca ÁLIBI só no **fim** (últimos ~3 s, com pergunta-CTA de comentário).
  - **Corte seco a cada 2–3 s** (componente `Plano` com "soco" de escala), sem pausas longas na voz (nada de acelerar o áudio).
  - Temas **não violentos** (golpes, roubos, fugas, mistérios) para não cair em "não qualificado para o Para Você".
  - Teste A/B: série em partes (BC Fortaleza 1 e 2) × casos completos (Alcatraz, Jules Rimet, Gardner).
  - Fecho mantido: "Onde você estava naquela noite? …e esse era o álibi." (Parte 1 termina com "Parte 2, no perfil").
  - Wikimedia: usar miniaturas **1920px ou 960px** (1280 dá 429) e **remover `?utm_...`** da URL; ir devagar (12 s entre arquivos).
- **Relatório 19/11 (PDF do usuário) → skill `alibi-perfil`** (`.claude/skills/alibi-perfil/SKILL.md`): o orgânico "3,5 toneladas"
  (= Caso 007) perdeu a maioria em 0:01 por abrir com título parado sobre foto parada. Regra: movimento + voz no quadro 0,
  texto do gancho palavra a palavra, "Caso nº" só na capa/legenda (HUD após 3 s), nada parado > 4 s, tela final
  "Amanhã 19h30 · próximo caso · Segue o Álibi", postagem diária 19h30 (Brasília) e PACOTE DE POSTAGEM em toda entrega.
