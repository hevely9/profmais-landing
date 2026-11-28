---
name: social-media-analyzer
description: "Analisa o desempenho do Instagram da Prof+: quais Reels e posts funcionaram, por quê e o que repetir. Calcula engajamento, compartilhamento, salvamento, retenção e seguidores ganhos a partir dos Insights, compara com a média do próprio perfil e recomenda o próximo passo. Use sempre que perguntarem se os posts estão funcionando, por que o alcance caiu, qual vídeo foi melhor, ou mandarem prints/números dos Insights."
---

# Analista de Instagram da Prof+

Você transforma números dos Insights em **decisões**: o que repetir, o que cortar e o que testar.

**Antes de tudo:** leia `.claude/product-marketing-context.md` (pilares de conteúdo e objetivos).

## Como conseguir os dados
Peça à usuária, para cada post (ideal: os últimos 10–20):
- No Reel → **Ver insights**: visualizações, contas alcançadas, curtidas, comentários, compartilhamentos,
  salvamentos, seguidores, **tempo médio de visualização** e duração do vídeo.
- Ela pode mandar **prints** (leia os números das imagens), uma planilha ou digitar.

Organize em CSV (modelo: `assets/exemplo.csv`) e rode:
```bash
python3 .claude/skills/social-media-analyzer/scripts/analisar_reels.py dados.csv
```
O script aceita números no padrão brasileiro (1.500 / 11,2), separador `,` ou `;`, e campos vazios.

## Métricas que importam (em ordem, para Reels)
| Métrica | Fórmula | O que revela |
|---|---|---|
| **Retenção** | tempo médio ÷ duração | se o gancho e o ritmo prendem. Abaixo de 30%: problema de gancho |
| **Compartilhamento** | compartilhamentos ÷ alcance | identificação: "isso sou eu", mandado para colegas. Maior motor de alcance novo |
| **Salvamento** | salvamentos ÷ alcance | utilidade: dica que ela quer usar depois |
| **Seguidores por mil** | seguidores ÷ alcance × 1000 | se o conteúdo convence a seguir |
| Engajamento | (curtidas+coment.+compart.+salv.) ÷ alcance | visão geral; curtida é o sinal mais fraco |
| Visitas ao perfil / cliques | | intenção de compra (WhatsApp) |

**Seguidores e curtidas sozinhos são métricas de vaidade.** Para a Prof+ o que paga as contas é
conversa no WhatsApp: pergunte quantos contatos chegaram na semana do post.

## Referência: compare com o próprio perfil
Benchmarks gerais de mercado variam muito por nicho, tamanho de conta e ano. **A referência principal é a
mediana do próprio perfil** (o script calcula). Índice > 1.3 = destaque; < 0.7 = abaixo do normal.
Só cite benchmark externo como faixa aproximada e marque 🔴.

## Diagnóstico rápido
| Sintoma | Causa provável | Ação |
|---|---|---|
| Alcance alto, retenção baixa | gancho promete e o vídeo não entrega, ou é longo | encurtar para 15–25s e cumprir o gancho em até 5s |
| Retenção alta, poucos compartilhamentos | bom, mas pouco "isso sou eu" | gancho de identificação com situação concreta |
| Muitos salvamentos | conteúdo útil | transformar em série e em carrossel |
| Post de oferta afunda | excesso de venda | oferta no máx. 1 em 5; vender dentro de conteúdo útil |
| Alcance caindo em tudo | frequência irregular, formato repetido | 3 Reels/semana fixos, alternar séries |

## Entrega
1. **Conclusão primeiro**: "O que funcionou foi X porque Y. Faça mais Z."
2. Tabela/ranking (saída do script).
3. 3 ações concretas para as próximas 2 semanas (tema, formato e gancho sugeridos).
4. Confiança: 🟢 dado claro · 🟡 tendência (poucos posts) · 🔴 hipótese.
5. Com menos de 8 posts, avise que as conclusões são frágeis.

## Skills relacionadas
- `video-content-strategist`: transformar os vencedores em novos roteiros
- `social-media-manager`: ajustar o calendário
