// ARQUIVO ÁLIBI — vitrine (página inicial pública). Só usa o que é público: casos.json (título, chamada, números,
// capa sem spoiler). Nada aqui revela pistas: as notas do mural são inventadas e não pertencem a nenhum caso.
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const NOTAS_MURAL = [
  { c: "nota n1", t: "PORTÃO SOCIAL · 23:07<br>ABERTURA · SEM REGISTRO DE SAÍDA" },
  { c: "nota n2", t: "LIGAÇÃO RECEBIDA<br>00:12 · 4 min 51 s<br>NÚMERO NÃO IDENTIFICADO" },
  { c: "polaroid p1", t: "SUSPEITO 03 — ?" },
  { c: "polaroid p2", t: "QUADRO 7 — CORREDOR" },
];

export function htmlVitrine(v, salvos, msgErro) {
  const disponiveis = v.casos.filter((c) => c.disponivel);
  const n = disponiveis.length;
  const cards = v.casos.map((c) => cardCaso(c)).join("");
  return `
<div class="vt">
  <div class="vt-topbar">${n} ${n === 1 ? "caso pronto" : "casos prontos"} para jogar · Sem aplicativo · No celular ou no papel · 1 a 4 jogadores</div>

  <section class="vt-hero">
    <div class="vt-hero-in">
      <article class="vt-folha">
        <span class="fita-cola"></span>
        <small class="vt-eyebrow">JOGO DE INVESTIGAÇÃO · CASOS FICTÍCIOS</small>
        <h1>Abra o arquivo.<br>Encontre a mentira.<br>Feche o caso.</h1>
        <p class="vt-lead">Cada caso é uma pasta com depoimentos, laudos, mensagens, áudios e registros. Ninguém marca o que importa: você cruza tudo e prova quem foi.</p>
        <div class="vt-acoes">
          <a class="btn btn-p btn-grande" href="#/" data-rola="casos">Ver os casos</a>
          <a class="btn vt-btn-linha btn-grande" href="#/" data-rola="entrar">Já comprei: abrir meu caso</a>
        </div>
        <p class="vt-mini">No celular ou impresso em casa · seu progresso fica salvo no aparelho</p>
      </article>
      <div class="vt-mural" aria-hidden="true">
        <svg class="vt-fio" viewBox="0 0 400 360" preserveAspectRatio="none"><path d="M70 40 L300 70 L120 220 L320 250" fill="none" stroke="#A3141C" stroke-width="2.5"/></svg>
        ${NOTAS_MURAL.map((x) => `<div class="${x.c}"><i class="alfinete"></i>${x.c.startsWith("polaroid") ? `<div class="silhueta"></div>` : ""}<span>${x.t}</span></div>`).join("")}
        <div class="vt-carimbo">CASO ABERTO</div>
      </div>
    </div>
  </section>

  ${salvos.length ? `<section class="vt-sec vt-continuar"><div class="vt-in">${salvos.map((c) => `<a class="btn btn-s btn-grande" href="#/caso/${esc(c.slug)}">${c.feitos >= 3 ? "Rever" : "Continuar"} o Caso Nº ${esc(c.numero)}</a>`).join("")}</div></section>` : ""}

  <section class="vt-sec" id="casos">
    <div class="vt-in">
      <h2 class="vt-h2">Escolha o seu caso</h2>
      <p class="vt-sub">Casos completos, todos fictícios, todos resolvidos só com o que está na pasta. Cada um foi conferido para que só uma resposta sobreviva a todas as provas.</p>
      <div class="vt-grade">${cards}</div>
      ${v.combo && !/^LINK_/.test(v.combo) ? `<div class="vt-combo"><b>Quer os ${n} casos?</b><span>Leve o combo e jogue um por semana.</span><a class="btn btn-p" href="${esc(v.combo)}" target="_blank" rel="noopener">Ver o combo</a></div>` : ""}
    </div>
  </section>

  <section class="vt-sec vt-escuro" id="como">
    <div class="vt-in">
      <h2 class="vt-h2 claro">Como funciona</h2>
      <p class="vt-sub claro">Você recebe o que a polícia tinha na primeira noite. Mais nada, nada destacado.</p>
      <div class="vt-passos">
        <div class="vt-passo"><span class="num">1</span><h3>Abra a pasta</h3><p>Depoimentos, laudos, fotos, mensagens, registros de alarme e de ligações, áudios. Documento importante tem a mesma cara de documento comum.</p></div>
        <div class="vt-passo"><span class="num">2</span><h3>Cruze os registros</h3><p>Depoimento é o que a pessoa diz. Registro é o que aconteceu. Anote cada horário e cada lugar e veja quem não bate.</p></div>
        <div class="vt-passo"><span class="num">3</span><h3>Prove e acuse</h3><p>Cada objetivo pede a resposta e 3 provas. Acertou, a pasta ganha provas novas. No fim, a solução completa mostra o documento que provava cada ponto.</p></div>
      </div>
      <div class="vt-regra"><i class="alfinete"></i><b>A regra das duas provas</b><p>Todo caso do Arquivo Álibi é escrito assim: o culpado é desmentido por pelo menos dois documentos independentes, e cada inocente é inocentado por um registro, não por falta de prova. Se a sua teoria depende de um documento só, ou de “ele tem cara de culpado”, confira de novo.</p></div>
    </div>
  </section>

  <section class="vt-sec" id="modos">
    <div class="vt-in">
      <h2 class="vt-h2">Do seu jeito</h2>
      <p class="vt-sub">A mesma investigação, três formas de jogar. Você escolhe ao abrir o caso e pode trocar depois.</p>
      <div class="vt-modos">
        <div class="vt-modo"><small>NA TELA</small><h3>Tudo no celular</h3><p>Pasta, áudios, anotações e linha do tempo no mesmo lugar. Pare quando quiser: o progresso fica salvo.</p></div>
        <div class="vt-modo"><small>NO PAPEL</small><h3>Imprima e espalhe na mesa</h3><p>Baixe o essencial para imprimir. O celular só serve para conferir as respostas e liberar as provas novas.</p></div>
        <div class="vt-modo"><small>EM GRUPO</small><h3>Com amigos ou em família</h3><p>Na mesma mesa ou por chamada de vídeo: cada um fica com uma parte das provas e vocês montam a linha do tempo juntos.</p></div>
      </div>
    </div>
  </section>

  <section class="vt-sec vt-papel" id="seguranca">
    <div class="vt-in">
      <h2 class="vt-h2">Sem spoiler, de verdade</h2>
      <ul class="vt-lista">
        <li><b>A solução não está escrita no site.</b> Ela fica cifrada e só abre quando você acerta a acusação.</li>
        <li><b>As provas novas também ficam trancadas.</b> Cada objetivo libera as próximas, na ordem certa da história.</li>
        <li><b>Seu caso abre com o seu código.</b> Ele chega na compra e libera a pasta inteira, inclusive fotos e áudios.</li>
        <li><b>Dicas só se você pedir.</b> São 3 por objetivo, da mais leve à mais direta. Quem não quer ajuda joga sem nenhuma.</li>
      </ul>
    </div>
  </section>

  <section class="vt-sec" id="perguntas">
    <div class="vt-in vt-estreito">
      <h2 class="vt-h2">Perguntas</h2>
      ${FAQ.map(([q, r]) => `<details class="vt-faq"><summary>${q}</summary><p>${r}</p></details>`).join("")}
    </div>
  </section>

  <section class="vt-sec vt-entrar" id="entrar">
    <div class="vt-in vt-estreito">
      <div class="entrada">
        <small class="eyebrow">CENTRAL DE INVESTIGAÇÃO</small>
        <h2 class="vt-h2 claro">Já comprou? Abra o seu caso</h2>
        <p>O jeito mais fácil: toque no botão <b>“Começar a jogar”</b> na sua área de membros da Kiwify. Ou digite o código aqui:</p>
        <form id="f-cod" class="form-cod"><label class="rotulo" for="cod">Código do caso</label>
          <input class="campo-codigo" id="cod" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="CASO-XXXX-XXXX" maxlength="24">
          <button class="btn btn-p btn-grande">Abrir meu caso</button>
          <p class="erro" id="err" role="alert">${esc(msgErro || "")}</p></form>
      </div>
    </div>
  </section>
</div>`;
}

function cardCaso(c) {
  const comprar = c.compra && !/^LINK_/.test(c.compra);
  const stats = [c.provas && `${c.provas} PROVAS`, c.suspeitos && `${c.suspeitos} SUSPEITOS`, c.dificuldade && c.dificuldade.toUpperCase(), c.duracao && c.duracao.toUpperCase()].filter(Boolean);
  return `<article class="vt-card${c.disponivel ? "" : " embreve"}" style="--acento:${esc(c.acento || "#C9A227")}">
    <div class="vt-aba">CASO ${esc(c.numero)}${c.tipo ? ` · ${esc(c.tipo)}` : ""}${c.ano ? ` · ${esc(c.ano)}` : ""}</div>
    <span class="fita-cola"></span>
    <div class="vt-capa">${c.capa ? `<img src="${esc(c.capa)}" alt="" loading="lazy">` : ""}<span class="vt-local">${esc(c.cidade || "")}</span></div>
    <div class="vt-selo">${c.disponivel ? (c.novo ? "NOVO" : "DISPONÍVEL") : "EM BREVE"}</div>
    <h3>${esc(c.titulo)}</h3>
    <p class="vt-chamada">${esc(c.chamada || c.sinopse)}</p>
    <div class="vt-stats">${stats.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
    ${c.disponivel ? `<div class="vt-card-acoes">
      ${comprar ? `<a class="btn btn-p" href="${esc(c.compra)}" target="_blank" rel="noopener">Quero este caso</a>` : `<span class="vt-breve">Venda abre em breve</span>`}
      <a class="btn btn-g" href="#/" data-rola="entrar">Já comprei</a></div>` : `<div class="vt-card-acoes"><span class="vt-breve">Em produção</span></div>`}
  </article>`;
}

const FAQ = [
  ["Preciso baixar algum aplicativo?", "Não. Tudo abre no navegador do celular, do tablet ou do computador. Se preferir, você imprime as folhas e usa o celular só para conferir as respostas."],
  ["Quanto tempo dura um caso?", "De uma a duas horas para quem lê com calma. Dá para parar e voltar depois: o progresso fica salvo no aparelho."],
  ["Quantas pessoas podem jogar?", "De 1 a 4 é o ideal. Em grupo, dividam as provas entre vocês e conversem antes de acusar."],
  ["E se eu errar?", "Você pode tentar de novo. O jogo diz quando você está perto, sem entregar a resposta. Se travar, peça uma dica."],
  ["Tem dicas?", "Tem, mas só se você pedir: 3 por objetivo, da mais leve à mais direta. O resultado final mostra quantas você usou."],
  ["Os casos são reais?", "Não. Pessoas, empresas, cidades e documentos são inventados. O formato imita uma investigação de verdade para os papéis parecerem reais."],
  ["Como recebo o meu caso?", "Depois da compra na Kiwify, entre na sua área de membros e toque em “Começar a jogar”. O caso abre direto, sem digitar nada. O código também vem junto, caso você precise abrir em outro aparelho."],
  ["Posso pedir reembolso?", "Compras pela Kiwify têm garantia de 7 dias. Se algo não abrir, fale com a gente antes: resolvemos."],
  ["Posso passar o meu código para outra pessoa?", "O caso é para uso pessoal e de quem joga com você. Compartilhar o código ou as folhas na internet estraga o jogo para todo mundo."],
  ["Qual é a classificação?", "14 anos. Os casos falam de crimes, mas não têm imagens violentas."],
];
