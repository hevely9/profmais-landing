# Prof+ — Landing Page

Landing page da **Prof+**, serviço de materiais pedagógicos personalizados para professores.

🔗 **No ar:** https://hevely9.github.io/profmais-landing/

## Estrutura

```
index.html      página completa (HTML + CSS + JS, arquivo único)
assets/         logo, ícones, ilustrações e imagem de Open Graph da marca
```

Sem build, sem dependências. Basta abrir o `index.html` ou publicar a pasta.

## Mobile first

Mais de 80% do tráfego chega pelo WhatsApp, no celular. A versão mobile é a
principal: **29,9 → 16,4 telas** (−45%).

O que mudou: exemplares e depoimentos viraram carrossel horizontal com snap;
cards de materiais e de dor viraram linhas compactas; os planos passaram a ter
nome e preço na mesma linha (590px → 290–390px por card); a tabela comparativa
esconde a coluna do meio; o botão flutuante some no celular para não disputar o
polegar com a barra fixa. O desktop não foi alterado.

## Ordem das seções

1. Hero (com a prova social flutuante)
2. Faixa de diferenciação
3. Problema (dor)
4. **Preços**
5. Garantia
6. Exemplares
7. Como funciona
8. Depoimentos
9. Faixa de destaque (CTA)
10. FAQ
11. Chamada final e contato

**Removidas por não contribuírem para a conversão:** Barra de prova social (virou o
bloco flutuante do hero), Materiais (os 5 cards), Comparativo, Solução, Diferenciais,
Casos de Uso, Logos placeholder e Estatísticas. FAQ enxuta de 17 para 7 perguntas,
ordenada por objeção.

## Exemplares

As 4 polaroids usam **páginas de materiais reais** da Prof+ (Física, História, Química
e Matemática). Cada uma tem dois arquivos:

- `exemplo-*.jpg` — miniatura 816×1088 (3:4), densidade 3× na tela
- `exemplo-*-full.jpg` — página inteira em alta, aberta ao tocar no exemplar

Tocar em um exemplar abre o visualizador com a página completa, para o professor
conseguir ler o material antes de comprar.

## Prova social no hero

A antiga barra verde de números virou uma composição flutuante em volta da personagem
da marca: quatro cartões com os mesmos dados (+200 professores, +1.500 materiais, 98%
de satisfação, 24h de entrega média) e a nota de origem dos dados.

A personagem vem do manual de identidade, mas **a arte original está cortada do lado
direito** — a orelha e parte do cabelo somem na borda. A versão em `assets/mascote.png`
foi reconstruída espelhando a metade esquerda sobre o eixo de simetria detectado.
Se aparecer o arquivo original completo, é só substituir.

Cada cartão flutua com **duração própria** (6s, 6.8s, 7.5s, 8s) — é o que impede o
conjunto de subir e descer em bloco e faz o movimento parecer natural. Tudo desligado
sob `prefers-reduced-motion`.

## Conversão

Não há formulário. Todos os CTAs abrem o WhatsApp **(68) 98421-6557** com mensagem
pré-preenchida conforme a seção de origem.

## ⚠️ Pendências antes de divulgar

- **Preços placeholder:** apenas o plano **Completo (R$ 597)** está definido. Os valores
  do **Essencial (R$ 297)** e do **Institucional (R$ 1.297)** são provisórios — procure
  por `<!-- PLACEHOLDER -->` no `index.html`.
- **Prints de WhatsApp e seção "quem faz":** ainda pendentes. São hoje o ponto mais
  fraco de credibilidade da página.
- **Depoimentos:** os avatares usam iniciais. Fotos reais (com autorização) convertem mais.
- **Garantia de 7 dias:** a devolução de 100% em 7 dias está publicada na seção de
  garantia. **Confirme que ela é realmente praticada antes de divulgar a página** —
  procure por `guarantee__point--strong` no `index.html`.
- **Pendentes da auditoria de CRO:** definir os preços reais, publicar prints de
  WhatsApp e uma amostra em PDF de verdade, e criar a seção "quem faz os seus
  materiais" com foto e nome. Sem isso, a credibilidade continua sendo o ponto
  mais fraco da página.

## Identidade visual

Cores, espaçamentos, sombras e componentes seguem o Design System da Prof+ (tokens CSS
no topo do `index.html`). Duas exceções decididas em conjunto com o cliente:

- Tipografia unificada em **Inter** (o manual especifica Montserrat + Lato).
- Formulário de orçamento removido em favor de contato exclusivo por WhatsApp.

---

© 2026 Prof+ · Todos os direitos reservados.
