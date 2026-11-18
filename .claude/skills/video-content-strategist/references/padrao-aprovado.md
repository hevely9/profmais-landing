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
