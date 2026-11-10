# Portal Clodoaldo Rodrigues · Transparência Legislativa

Portal público para consulta e download dos projetos de lei do deputado estadual
Clodoaldo Rodrigues (ALEAC). Site estático: HTML, CSS e JavaScript puros, sem build,
sem framework e sem dependência externa em tempo de execução. Publicado pelo GitHub
Pages em `/clodoaldo/`.

## Páginas

| Arquivo          | Conteúdo |
|------------------|----------|
| `index.html`     | Início: apresentação, números da atuação, projetos recentes, temas, resumo do deputado |
| `projetos.html`  | Biblioteca: busca por número, ano ou assunto; lista agrupada por ano, do mais recente ao mais antigo |
| `projeto.html`   | Detalhe de um projeto (`?id=`): ementa, ficha de tramitação, PDF, compartilhar no WhatsApp, relacionados |
| `deputado.html`  | Biografia, linha do tempo política, atuação parlamentar e fontes |
| `admin.html`     | Painel administrativo (acesso por token do GitHub) |

Navegação: menu no topo em telas grandes; barra fixa inferior no celular (Início,
Projetos, Deputado, WhatsApp). Cada projeto tem um link próprio, pensado para ser
compartilhado no WhatsApp.

## Dados

Todo o conteúdo variável vem de `data/`:

- `projetos.json`: lista de proposições. Campos: `id`, `tipo`, `numero`, `ano`, `ementa`,
  `descricao`, `situacao`, `resultado`, `dataApresentacao`, `dataVotacao`,
  `dataUltimaTramitacao`, `localizacaoAtual`, `palavrasChave`, `pdf`, `linkOficial`, `fonte`.
- `deputado.json`: biografia, linha do tempo, fontes. `foto` vazio usa o retrato padrão.
- `config.json`: links da ALEAC, Instagram e grupo do WhatsApp.

Campos vazios somem da tela. Nada é inventado: ementa, datas e situação vêm da ALEAC;
os PDFs ficam em `documentos/<ano>/`.

A situação oficial aparece na ficha do projeto. Nos cards, o rótulo é simplificado:
"Autógrafo enviado" vira "Aprovado" e "Aprovado pela Inconstitucionalidade" vira
"Rejeitado na CCJR".

## Desempenho e conexões lentas

- Fontes (Inter e Bricolage Grotesque) hospedadas em `assets/fonts/`, só os pesos usados.
- Retrato em WebP com `srcset` (480, 800 e 1000 px) e JPEG de reserva.
- Página inicial: cerca de 20 KB de HTML, CSS e JS comprimidos.
- `sw.js`: service worker que guarda páginas, dados e documentos já abertos. Sem
  conexão, o portal continua navegável e mostra um aviso.
- `manifest.webmanifest`: permite "Adicionar à tela inicial".

## Estatísticas de acesso

Cloudflare Web Analytics (sem cookies), carregado nas quatro páginas públicas. O painel
fica em dash.cloudflare.com → Web Analytics → profmais.online. O serviço não registra
parâmetros de URL nem eventos personalizados, então as visitas a `projeto.html` aparecem
somadas, sem separar por projeto. O painel administrativo não é medido.

## Segurança

- `Content-Security-Policy` em todas as páginas: scripts só do próprio site e do medidor da Cloudflare; fontes só do próprio site;
  o painel libera apenas `api.github.com`.
- Todo texto vindo dos JSON passa por escape antes de entrar no HTML; todo link passa
  por validação (`http(s)` ou caminho relativo; `javascript:` e `data:` são descartados).
- O painel não tem servidor nem banco: grava no repositório via API do GitHub com um
  token pessoal de escopo mínimo (apenas este repositório, permissão Contents). O
  token fica no navegador, na sessão por padrão; "manter conectado" grava no
  `localStorage` e deve ser usado só em computador pessoal.
- `admin.html` tem `noindex` e não é guardado pelo service worker.
- Links externos abrem com `rel="noopener"`.

## Painel administrativo

Login com um *fine-grained personal access token* do GitHub (Settings → Developer
settings → Fine-grained tokens) com acesso apenas a `hevely9/profmais-landing` e
permissão **Contents: Read and write**.

Funções: cadastrar, editar e remover projetos com upload de PDF; importar PDFs em lote
(leitura automática de tipo, número, ano e ementa, com revisão antes de publicar);
editar biografia e linha do tempo; trocar a foto; atualizar links. Cada alteração vira
um commit, com histórico e reversão.

## Integração com a ALEAC

Os dados de tramitação foram informados pelo gabinete a partir do SAPL da ALEAC
(`sapl.al.ac.leg.br/parlamentar/259`). Ainda não há sincronização automática: o
ambiente de desenvolvimento não tinha acesso de rede à ALEAC. O SAPL é um sistema
Interlegis com API pública (`/api/`), então o próximo passo natural é um script
agendado (GitHub Actions) que consulte a API e abra as novidades para revisão no painel.

## Desenvolvimento local

```bash
cd clodoaldo && python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Arquivo aberto direto (`file://`) não funciona, porque
os dados são carregados via `fetch`.

## Créditos

- pdf.js 3.11.174 (Apache-2.0), em `assets/vendor/pdfjs/`, usado só no painel.
- Fontes Inter (OFL) e Bricolage Grotesque (OFL), em `assets/fonts/`.
