# Skills de Instagram e Reels da Prof+

Adaptadas de [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) (licença MIT,
veja `LICENSE-claude-skills.txt`), traduzidas e reescritas para a Prof+: português, formato Reels 9:16,
identidade visual e público de professores.

Todas leem primeiro **`.claude/product-marketing-context.md`**. Atualize a marca lá, não nas skills.

| Skill | Para quê | Exemplo de pedido |
|---|---|---|
| `video-content-strategist` | estratégia, ideias e roteiro de Reels | "Me dá 5 ideias de Reel pra semana de provas" |
| `demo-video` | gera o **MP4 vertical** pronto para postar | "Cria o Reel desse roteiro" |
| `social-content` | legenda, carrossel, Stories, bio, hashtags | "Escreve a legenda desse Reel" |
| `content-humanizer` | tira o "jeito de IA" do texto | "Isso tá parecendo ChatGPT, deixa mais natural" |
| `social-media-manager` | calendário e crescimento do perfil | "Monta o calendário de novembro" |
| `social-media-analyzer` | quais posts funcionaram e por quê | "Olha os insights desses Reels" (CSV ou prints) |

Não precisa chamar pelo nome: basta pedir. Para forçar uma skill, escreva `/nome-da-skill`.

## Fluxo completo de um Reel
1. `video-content-strategist` → roteiro e gancho
2. `content-humanizer` → texto natural
3. `demo-video` → `_reels/<nome>/saida/reel.mp4` + `capa.jpg`
4. `social-content` → legenda e hashtags

## Gerar o vídeo manualmente
```bash
cp -r .claude/skills/demo-video/templates/starter _reels/meu-reel        # cria a partir do modelo
node .claude/skills/demo-video/scripts/build_reel.cjs _reels/meu-reel --previa   # confere as cenas
node .claude/skills/demo-video/scripts/build_reel.cjs _reels/meu-reel            # gera o MP4
```
Requisitos: Node, Playwright e ffmpeg. Narração opcional com `pip install edge-tts` (precisa de internet;
na sessão na nuvem do Claude Code essa conexão é bloqueada e o vídeo sai sem voz).
