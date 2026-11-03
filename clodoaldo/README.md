# Portal Clodoaldo Rodrigues · Transparência Legislativa

Portal público para consulta e download dos projetos de lei e proposições do
deputado estadual Clodoaldo Rodrigues (ALEAC).

Site estático (HTML + CSS + JS), sem build e sem servidor próprio. Roda no
GitHub Pages junto com o restante deste repositório, em `/clodoaldo/`.

## Páginas

| Arquivo          | Conteúdo                                                                  |
|------------------|---------------------------------------------------------------------------|
| `index.html`     | Herói com foto, chamada principal, projetos recentes, resumo do deputado   |
| `projetos.html`  | Biblioteca: busca, filtros (ano, tipo, situação), ordenação, "carregar mais" |
| `deputado.html`  | "Conheça o Deputado": biografia, trajetórias, atuação, história pública    |
| `admin.html`     | Painel administrativo (protegido por token do GitHub)                     |

## Dados: nada é inventado

Todo o conteúdo variável vem de três arquivos:

- `data/projetos.json`: lista de proposições (começa **vazia**).
- `data/deputado.json`: biografia (campos **vazios**, prontos para o texto oficial).
- `data/config.json`: links da ALEAC e redes sociais.

Quando um campo está vazio, o site mostra "em preparação" em vez de texto fictício.

Formato de um projeto:

```json
{
  "id": "projeto-de-lei-125-2025",
  "tipo": "Projeto de Lei",
  "numero": "125",
  "ano": "2025",
  "dataApresentacao": "2025-03-14",
  "ementa": "Texto oficial da ementa",
  "descricao": "Explicação em linguagem simples (opcional)",
  "situacao": "Em tramitação",
  "palavrasChave": ["saúde"],
  "pdf": "documentos/2025/projeto-de-lei-125-2025.pdf",
  "linkOficial": "https://… (página da proposição na ALEAC)",
  "fonte": "Importação de PDF: arquivo-original.pdf",
  "atualizadoEm": "2026-11-03"
}
```

## Painel administrativo

`admin.html` grava direto no repositório pela API do GitHub. Cada alteração gera
um commit, então existe histórico completo e tudo pode ser desfeito.

**Acesso:** crie um *fine-grained personal access token* em
GitHub → Settings → Developer settings → Fine-grained tokens, com acesso
**somente** a `hevely9/profmais-landing` e permissão **Contents: Read and write**.
Quem não tiver um token com escrita no repositório não consegue alterar nada.

O que dá para fazer no painel:

- Cadastrar, editar e remover projetos, com envio do PDF.
- **Importar PDFs em lote**: arraste vários PDFs (ex.: a pasta baixada do Google
  Drive). O painel lê o texto da 1ª página e sugere tipo, número, ano e ementa,
  sinaliza se o nome "Clodoaldo" aparece no texto, aponta PDFs escaneados (sem
  texto) e detecta duplicados. Nada é publicado sem revisão.
- Editar a biografia e a linha do tempo, e trocar a fotografia (redimensionada no navegador).
- Atualizar os links oficiais (ALEAC, Instagram, Facebook).

Depois de salvar, o GitHub Pages leva cerca de 1 minuto para atualizar.

## Integração com a ALEAC: estado atual

O ambiente em que o portal foi construído não tinha acesso de rede ao site da
ALEAC nem ao Google Drive, então **ainda não existe sincronização automática**,
e o portal não finge ter uma.

Próximo passo: com o link oficial em mãos, verificar como a ALEAC publica as
proposições (API pública, sistema SAPL/Interlegis, página HTML ou só PDFs). Se
houver API ou página estruturada, um script agendado (GitHub Actions) pode
consultar a fonte e abrir as novidades para revisão. Até lá, o caminho é a
importação em lote pelo painel.

O link `aleacUrl` em `data/config.json` está como `https://www.aleac.leg.br/` e
precisa ser **confirmado** no painel.

## Desenvolvimento local

```bash
cd clodoaldo && python3 -m http.server 8000
```

Acesse `http://localhost:8000`. Abrir o arquivo direto (`file://`) não funciona,
porque os dados são carregados via `fetch`.

## Créditos

- pdf.js 3.11.174 (Apache-2.0), hospedado em `assets/vendor/pdfjs/`.
- Fontes: Montserrat e Inter (Google Fonts).
