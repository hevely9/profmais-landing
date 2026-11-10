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
