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

1. Hero
2. Faixa de diferenciação
3. Prova social
4. Problema (dor)
5. Materiais (o que você recebe)
6. **Preços**
7. Garantia
8. Exemplares
9. Como funciona
10. Depoimentos
11. Comparativo + público-alvo
12. Faixa de destaque (CTA)
13. FAQ
14. Chamada final e contato

**Removidas por não contribuírem para a conversão:** Solução e Diferenciais
(redundantes com a faixa de diferenciação e com o comparativo), Casos de Uso,
Logos placeholder e Estatísticas. FAQ enxuta de 17 para 7 perguntas, ordenada
por objeção.

## Conversão

Não há formulário. Todos os CTAs abrem o WhatsApp **(68) 98421-6557** com mensagem
pré-preenchida conforme a seção de origem.

## ⚠️ Pendências antes de divulgar

- **Preços placeholder:** apenas o plano **Completo (R$ 597)** está definido. Os valores
  do **Essencial (R$ 297)** e do **Institucional (R$ 1.297)** são provisórios — procure
  por `<!-- PLACEHOLDER -->` no `index.html`.
- **Exemplares simulados:** as 4 polaroids da galeria são exemplos fictícios. Substituir
  por imagens de materiais reais entregues.
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
