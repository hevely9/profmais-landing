# Arquivo Álibi — jogos de investigação (casos fictícios)

Cada caso = **dossiê PDF** + **Central de Investigação** (site estático). Os dois saem da mesma fonte: `casos/<slug>/biblia.json`.

> A Bíblia (`biblia.json` / `biblia.md`) contém a solução. **Nunca** publique a pasta `casos/`. Só `dist/site` vai para a hospedagem.

## Estrutura
```
casos/<slug>/biblia.json   fonte única do caso (provas, objetivos, respostas, dicas, solução)
casos/<slug>/biblia.md     versão legível (gerada) — uso interno
casos/<slug>/midia/        fotos (.webp ≤ 200 KB) e áudios (.mp3) do caso — saem CRIPTOGRAFADOS no site
site/                      Central: index.html, app.js, render.js (renderiza provas), cripto.js, estilos, fontes
marca/                     tokens de cor/fonte e guia da identidade
scripts/build.mjs          gera dist/site com o conteúdo CRIPTOGRAFADO
scripts/pdf.mjs            gera dist/pdf/<slug>-dossie.pdf (com QR para a URL final)
scripts/biblia-md.py       gera biblia.md
config.json                URL final, links de compra (Kiwify/Hotmart), casos "em breve"
```

## Adicionar um caso novo
1. Copie `casos/mansao-valente/biblia.json` para `casos/<novo-slug>/biblia.json` e reescreva tudo:
   - nomes, empresas e cidades **fictícios** (pesquise antes para garantir que não existem);
   - 25–40 provas `origem: "pdf"` (E-01…) e bônus `origem: "bonus"` (B-01…), cada uma num `tipo` que o `render.js` conhece:
     `oficio, depoimento, chat, email, recibo, log, jornal, extrato, carta, agenda, app, lista, ilustracao`;
   - 3 objetivos com `aceitas` (resposta + conjuntos de provas), `quase` (mensagens de "está perto"), 3 `dicas` e `bonus` liberados;
   - um `codigo` novo no formato `PALAVRA-XXXX-XXXX` (8 caracteres aleatórios do alfabeto `23456789ABCDEFGHJKMNPQRSTUVWXYZ`, sem 0/O/1/I/L) e um `acento` de cor;
   - respostas aceitas: `combinacoes` (lista de trios) e/ou `papeis` (`[{de:[...], n:1}, ...]` = escolha n provas de cada grupo). O build gera todas as combinações válidas: errar por escolher uma prova igualmente válida não pode acontecer;
   - fotos: `suspeitos[].foto` (`rosto`, `ficha`, `dia`), provas `tipo: "foto"` com `img`, ou `anexo: {img, legenda}` em qualquer documento. Nunca foto de pessoa real: personagens gerados por IA, sempre a partir da mesma folha de referência (frente + perfil) para manter o mesmo rosto;
   - áudios: `audio` nos depoimentos e provas `tipo: "audio"` (detalhes que só existem no áudio). Vozes diferentes por personagem;
   - `briefing` (texto + áudio da delegada), `solucao.interrogatorio` (termo final + áudio) e `tempo_jogo.cartas` (fatos da linha do tempo, sem spoiler; o 5º campo diz qual objetivo libera a carta, 0 = desde o início).
2. Em `scripts/build.mjs`, adicione ao vetor de checagem de vazamento o nome do culpado, o código e termos-chave da solução.
3. Gere:
   ```bash
   node scripts/build.mjs
   NODE_PATH=$(npm root -g) node scripts/impressos.mjs <novo-slug>   # folhas coloridas do modo papel + dossiê (o build já chama)
   python3 scripts/biblia-md.py <novo-slug>
   ```
4. Rode o teste ponta a ponta (celular 390px e computador): `NODE_PATH=$(npm root -g) node scripts/teste.mjs <novo-slug>`. Ajuste as respostas alternativas usadas no teste (constante `RESP`) para o caso novo.
5. Em `config.json`, ponha o link de compra em `links.<slug>` e tire o caso de `emBreve`.
6. Publique **só** `dist/site` (Cloudflare Pages ou GitHub Pages).

## Proteção
- Código do caso → PBKDF2 (120 mil iterações) → AES-GCM decifra os dados do caso (provas, fotos e áudios). Não existe hash rápido do código: cada tentativa custa uma derivação PBKDF2, e com 8 caracteres (31⁸ ≈ 850 bilhões de códigos) adivinhar é inviável.
- Fotos e áudios ficam em `data/<slug>/*.bin` com nomes aleatórios, criptografados; os da solução/provas bônus só abrem com a chave do objetivo.
- Cada objetivo tem uma chave de conteúdo aleatória, embrulhada uma vez por resposta aceita (resposta canônica + código). Sem acertar, as provas bônus e a solução não podem ser lidas.
- Respostas são conferidas por SHA-256 com sal. O build falha se algum termo sensível aparecer em texto puro.
- Interrogatório: preparado (`interrogatorio` na Bíblia), desligado no site (`INTERROGATORIO_ATIVO = false` em `site/app.js`).

## Regras fixas
Tudo fictício · aviso "Caso fictício. Qualquer semelhança com fatos ou pessoas reais é coincidência." no PDF e no site · 14+ · sem violência gráfica · rostos só ilustrados · PDF com "Uso pessoal — proibida a redistribuição".
