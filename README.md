# Prof+ — Landing Page

Landing page da **Prof+**, serviço de materiais pedagógicos personalizados para professores.

🔗 **No ar:** https://hevely9.github.io/profmais-landing/

## Estrutura

```
index.html      página completa (HTML + CSS + JS, arquivo único)
assets/         logo, ícones, ilustrações e imagem de Open Graph da marca
```

Sem build, sem dependências. Basta abrir o `index.html` ou publicar a pasta.

## Ordem das seções

A página está ordenada para conversão — o visitante chega ao preço por volta da 3ª tela:

1. Hero
2. Faixa de diferenciação
3. Prova social
4. Materiais (o que você recebe)
5. **Preços**
6. Garantia
7. Exemplares
8. Como funciona
9. Depoimentos
10. Comparativo + público-alvo
11. Diferenciais
12. Problema
13. Solução
14. Faixa de destaque (CTA)
15. FAQ
16. Chamada final e contato

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

## Identidade visual

Cores, espaçamentos, sombras e componentes seguem o Design System da Prof+ (tokens CSS
no topo do `index.html`). Duas exceções decididas em conjunto com o cliente:

- Tipografia unificada em **Inter** (o manual especifica Montserrat + Lato).
- Formulário de orçamento removido em favor de contato exclusivo por WhatsApp.

---

© 2026 Prof+ · Todos os direitos reservados.
