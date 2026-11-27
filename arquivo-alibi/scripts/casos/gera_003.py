import json, itertools, os
OUT = __import__("os").path.join(__import__("os").path.dirname(__file__), "..", "..", "casos", "serra-do-corvo", "biblia.json")
DP = "POLÍCIA CIVIL — DELEGACIA DE SERRA DO CORVO"
IC = "INSTITUTO DE CRIMINALÍSTICA — POSTO DE SERRA DO CORVO"

def dep(id_, tit, declarante, data, qa, foto, objs):
    return {"id": id_, "titulo": tit, "tipo": "depoimento", "objetivos": objs, "origem": "pdf",
            "conteudo": {"orgao": DP, "declarante": declarante, "data": data, "qa": qa, **({"foto": foto} if foto else {})}}

provas = [
 {"id": "E-01", "titulo": "Boletim de Ocorrência", "tipo": "oficio", "objetivos": [1], "origem": "pdf", "conteudo": {
  "orgao": DP, "documento": "BOLETIM DE OCORRÊNCIA Nº 2025/0157",
  "campos": [["Registro", "16/08/2025, 06h25"], ["Natureza", "Morte a esclarecer"], ["Local", "Mirante da Pedra do Corvo — Estrada do Mirante, km 2, Serra do Corvo"], ["Vítima", "Lívia Campos, 24 anos, professora da Escola Municipal Pedra Branca"], ["Comunicante", "Antônio Reis (Seu Toninho), 61 anos, sacristão"]],
  "corpo": ["Às 06h10 de sábado, 16/08/2025, o comunicante, que caminha todas as manhãs até o mirante, encontrou o corpo da vítima no barranco abaixo do guarda-corpo, cerca de 9 metros abaixo do mirante.",
            "Na noite anterior, a vítima esteve na Festa de Nossa Senhora das Graças, na praça da matriz. Foi vista pela última vez por volta das 22h. A mãe registrou que ela não voltou para casa.",
            "A primeira hipótese levantada no local foi de queda acidental depois da festa."],
  "assinatura": "Escrivão Paulo Rangel"}},
 {"id": "E-02", "titulo": "Relatório preliminar da Delegada", "tipo": "oficio", "objetivos": [1, 2], "origem": "pdf", "conteudo": {
  "orgao": DP, "documento": "RELATÓRIO PRELIMINAR — INQUÉRITO Nº 0044/2025",
  "corpo": ["Lívia Campos era professora e, como voluntária, cuidava do caixa da comissão da festa, coordenada por Gilberto Assunção, dono do Mercadinho Assunção. Tinha passagem comprada para domingo: ia assumir uma vaga de professora num colégio da capital.",
            "Às 21h20, Lívia e o ex-namorado, Caíque Lopes, discutiram em voz alta na frente da barraca do pastel. Várias pessoas viram.",
            "O salão paroquial fica ao lado da igreja. Durante a festa, a porta da frente do salão ficou fechada; a porta lateral, na rua de trás, só abre com chave. Além das cópias da comissão, uma chave reserva fica pendurada no quadro da sacristia, por onde voluntários entraram e saíram a noite toda.",
            "Os fogos foram das 22h às 22h15, com a praça cheia. Ouvimos as seis pessoas abaixo, por terem estado com a vítima naquela noite ou por terem algum conflito com ela."],
  "tabela": {"titulo": "Onde cada um declarou estar entre 22h00 e 22h30", "cab": ["Pessoa", "Declaração"], "linhas": [
   ["Gilberto Assunção", "Na barraca do pastel, passando cartão na maquininha, com a esposa."],
   ["Vânia Assunção", "Na barraca do pastel, fritando; o marido estava no caixa, com ela."],
   ["Caíque Lopes", "No Bar do Tião, fazendo live no celular com os amigos."],
   ["Marisa Teles", "Na mesa da rifa, vendendo números."],
   ["Hugo Bastos", "No coreto, fotografando os fogos."],
   ["Antônio Reis (Toninho)", "Na torre da igreja, tocando o sino durante os fogos."]]},
  "assinatura": "Sônia Matos — Delegada de Polícia"}},
 {"id": "E-03", "titulo": "Croqui da praça da matriz", "tipo": "ilustracao", "objetivos": [1, 2], "origem": "pdf", "conteudo": {
  "svg": "praca", "legenda": "Croqui elaborado pela perícia. F1 = câmera da Farmácia Santa Luzia.",
  "notas": ["A câmera F1 fica na esquina da farmácia e grava a rua de trás do salão paroquial, onde fica a porta lateral. A sacristia, onde fica a chave reserva, é aberta para os voluntários durante a festa.", "O depósito fica nos fundos do salão, junto da porta lateral.", "O Mirante da Pedra do Corvo fica a 2 km da praça, pela Estrada do Mirante. Do estacionamento do mirante até o guarda-corpo há uma trilha de terra de 60 metros."]}},
 {"id": "E-04", "titulo": "Foto do local — Mirante da Pedra do Corvo", "tipo": "foto", "objetivos": [1], "origem": "pdf", "conteudo": {
  "img": "cena-mirante", "legenda": "Mirante, 07h30 de sábado. A vítima já havia sido retirada do barranco. Marcadores da perícia.",
  "notas": ["1 — Guarda-corpo de madeira, inteiro, sem marcas de batida.", "2 — Trilha de terra vermelha, encharcada pela chuva de sexta (das 15h às 18h30). Na trilha só há as pegadas de botina do Seu Toninho, de manhã.",
            "3 — Marcas de pneu de um veículo leve no acostamento da estrada, a 40 metros do guarda-corpo.", "4 — Bolsa da vítima, ao lado de onde o corpo estava."]}},
 {"id": "E-05", "titulo": "Laudo necroscópico (IML)", "tipo": "oficio", "objetivos": [1], "origem": "pdf", "conteudo": {
  "orgao": "INSTITUTO MÉDICO-LEGAL — REGIONAL DE SERRA DO CORVO", "documento": "LAUDO NECROSCÓPICO Nº 0219/2025",
  "campos": [["Examinada", "Lívia Campos, 24 anos"], ["Data do exame", "16/08/2025"], ["Hora provável da morte", "Entre 21h45 e 22h45 de sexta-feira, 15/08"]],
  "corpo": ["Causa da morte: traumatismo na parte de trás da cabeça, por batida contra uma quina reta e metálica. A marca é uma linha reta de cerca de 3 cm.",
            "As escoriações nos braços e nas pernas, típicas de quem rola por um barranco, não têm sinais de reação do corpo: foram produzidas depois da morte.",
            "Exame de álcool: negativo."],
  "assinatura": "Dr. Ronaldo Pires — Perito Médico-Legista"}},
 {"id": "E-06", "titulo": "Perícia nas roupas e nos tênis da vítima", "tipo": "oficio", "objetivos": [1], "origem": "pdf", "conteudo": {
  "orgao": IC, "documento": "LAUDO PERICIAL Nº 0088/2025 — VESTES DA VÍTIMA",
  "tabela": {"cab": ["Peça", "Resultado"], "linhas": [
   ["Tênis brancos (solas)", "Limpas. Nenhum vestígio do barro vermelho da trilha do mirante. Resíduo de cera de assoalho à base de carnaúba."],
   ["Calça e blusa", "Terra vermelha só nas costas e nas laterais, compatível com o barranco. Na frente, nenhuma."],
   ["Cabelo", "Terra vermelha e folhas secas do barranco."]]},
  "corpo": ["Quem percorresse a trilha do mirante na noite de sexta, depois da chuva, sairia com barro vermelho nas solas."],
  "assinatura": "Otávio Neri — Perito Criminal", "anexo": {"img": "tenis", "legenda": "Tênis da vítima na bancada da perícia: solas limpas."}}},
 {"id": "E-07", "titulo": "Histórico de localização do celular de Lívia", "tipo": "log", "objetivos": [1, 2], "origem": "pdf", "conteudo": {
  "sistema": "RELATÓRIO DA OPERADORA E DO APARELHO — LÍVIA CAMPOS", "local": "Sexta, 15/08/2025 · precisão indicada em metros",
  "colunas": ["Hora", "Local registrado", "Precisão"], "linhas": [
   ["21:30", "Praça da Matriz — barracas", "10 m"], ["21:46", "Praça da Matriz — barracas", "10 m"], ["21:58", "Rua de trás do salão paroquial", "12 m"], ["22:02", "Salão paroquial (interior)", "8 m"],
   ["22:08", "Aparelho desligado (bateria: 64%)", "—"]],
  "nota": "Não há nenhum registro do aparelho na Estrada do Mirante nem no mirante. O celular foi encontrado desligado dentro da bolsa da vítima, no mirante."}},
 dep("E-08", "Depoimento — Gilberto Assunção", "Gilberto Assunção, 47 anos, coordenador da comissão da festa e dono do Mercadinho Assunção", "16/08/2025, 09h30", [
  ["Onde o senhor estava entre 22h00 e 22h30?", "Na barraca do pastel, passando cartão na maquininha. A Vânia fritava e eu ficava no caixa. Não saí de lá até a festa acabar."],
  ["Viu a Lívia naquela noite?", "Vi de longe, discutindo com o Caíque, umas nove e vinte. Depois não vi mais."],
  ["O que a Lívia fazia na comissão?", "Cuidava do caixa da festa. Menina muito correta."],
  ["O que fez depois da festa?", "Às onze e vinte levei as coisas da barraca na van, direto pro mercadinho, e fui dormir."],
  ["Que roupa usava?", "Camisa xadrez e o boné do mercadinho, azul-marinho."]], "rosto-gilberto", [2, 3]),
 dep("E-09", "Depoimento — Vânia Assunção", "Vânia Assunção, 45 anos, esposa de Gilberto; voluntária na barraca do pastel", "16/08/2025, 10h00", [
  ["Onde a senhora estava entre 22h00 e 22h30?", "Na barraca, fritando pastel. O Gilberto ficou comigo o tempo todo, no caixa."],
  ["A senhora tem a chave do salão?", "Tenho uma cópia, como o pessoal da comissão. E tem a reserva, na sacristia."],
  ["Conhecia bem a Lívia?", "Conhecia. Ela andava muito em cima das contas da festa, mas é o jeito dela."]], "rosto-vania", [2]),
 dep("E-10", "Depoimento — Caíque Lopes", "Caíque Lopes, 26 anos, mecânico, ex-namorado da vítima", "16/08/2025, 10h40", [
  ["Por que o senhor discutiu com a Lívia?", "Porque ela ia embora pra capital no domingo e nem me contou. Fiquei sabendo pelos outros. Falei alto, admito."],
  ["Onde estava entre 22h00 e 22h30?", "No Bar do Tião, com os amigos. Fiz live no celular mostrando os fogos de lá. Fiquei até a festa acabar."],
  ["Que roupa usava?", "Camiseta do Galo e boné preto."],
  ["Para onde foi depois?", "Pra casa, a pé, lá pelas onze e meia."]], "rosto-caique", [2]),
 dep("E-11", "Depoimento — Marisa Teles", "Marisa Teles, 33 anos, prima da vítima; voluntária na mesa da rifa", "16/08/2025, 11h10", [
  ["Onde a senhora estava entre 22h00 e 22h30?", "Na mesa da rifa. Na hora dos fogos vende muito, todo mundo fica parado na praça."],
  ["A Lívia falou com a senhora naquela noite?", "Mandou mensagem dizendo que ia resolver um negócio da comissão antes dos fogos e depois me contava."],
  ["A senhora também tentou a vaga na capital?", "Tentei. Ela passou e eu não. Fiquei chateada, não vou mentir. Mas era minha prima."]], "rosto-marisa", [2, 3]),
 dep("E-12", "Depoimento — Hugo Bastos", "Hugo Bastos, 29 anos, fotógrafo de uma revista de turismo, de fora da cidade", "16/08/2025, 11h40", [
  ["Onde o senhor estava entre 22h00 e 22h30?", "No coreto, fotografando os fogos. Fiquei lá até umas dez e trinta e cinco."],
  ["Disseram que o senhor discutiu com a vítima.", "Não foi discussão. Às nove e meia eu fotografei a barraca do pastel e ela apareceu na foto. Ela pediu pra eu apagar e eu apaguei na frente dela."],
  ["Que roupa usava?", "Jaqueta verde e boné cinza."]], "rosto-hugo", [2]),
 dep("E-13", "Depoimento — Antônio Reis (Seu Toninho)", "Antônio Reis, 61 anos, sacristão da matriz", "16/08/2025, 07h20", [
  ["Como o senhor encontrou a vítima?", "Subo a trilha do mirante todo dia às seis. Vi a moça lá embaixo, no barranco, e desci correndo pra chamar a polícia."],
  ["Onde o senhor estava entre 22h00 e 22h30?", "Na torre, tocando o sino durante os fogos, como todo ano. Subi um pouco antes das dez e desci depois das dez e meia."],
  ["Ouviu alguma coisa no salão?", "Com os fogos e o sino, não dá pra ouvir nada. Eu fiquei lá em cima."]], "rosto-toninho", [2]),
 dep("E-14", "Depoimento — Célia Campos (mãe da vítima)", "Célia Campos, 52 anos, mãe da vítima", "16/08/2025, 08h10", [
  ["Quando a senhora viu sua filha pela última vez?", "Na missa, às sete. Ela foi pra festa e me mandou um áudio antes dos fogos."],
  ["Ela estava preocupada com alguma coisa?", "Com as contas da festa. Ficava até tarde com aquele caderno, dizendo que tinha coisa que não batia. Levava o caderno na bolsa pra todo lado."],
  ["Ela tinha inimigos?", "O Caíque não aceitava o fim do namoro. Mas ela não tinha medo dele."]], None, [1, 3]),
 {"id": "E-15", "titulo": "E-mail de Marisa ao colégio da capital (05/08)", "tipo": "email", "objetivos": [3], "origem": "pdf", "conteudo": {
  "de": "Marisa Teles <marisa.teles@correio.exemplo>", "para": "Secretaria — Colégio Horizonte <rh@colegiohorizonte.exemplo>", "data": "Terça, 05/08/2025, 23:48", "assunto": "Sobre a candidata Lívia Campos",
  "corpo": ["Prezados,", "Soube que vocês escolheram Lívia Campos para a vaga de professora. Sem querer me intrometer, acho que deveriam saber que ela não é tão confiável quanto parece.", "Sigo à disposição para a vaga, caso mudem de ideia.", "Marisa Teles"]}},
 {"id": "E-16", "titulo": "Mensagens entre Lívia e Marisa (15/08)", "tipo": "chat", "objetivos": [1, 2], "origem": "pdf", "conteudo": {
  "grupo": "Lívia ↔ Marisa (prima)", "data": "Sexta, 15/08/2025", "msgs": [
   ["21:21", "Lívia", "o Caíque tá fazendo escândalo de novo na frente da barraca 🙄"], ["21:22", "Marisa", "ignora. vem pra rifa"], ["21:46", "Lívia", "depois dos fogos te conto. vou ali resolver um negócio da comissão"],
   ["21:47", "Marisa", "que negócio?"], ["22:40", "Marisa", "cadê vc?"], ["23:15", "Marisa", "Lívia??"]]}},
 {"id": "E-17", "titulo": "Câmera da Farmácia Santa Luzia (F1)", "tipo": "log", "objetivos": [1, 2], "origem": "pdf", "conteudo": {
  "sistema": "FARMÁCIA SANTA LUZIA — CÂMERA F1 (RUA DE TRÁS DO SALÃO)", "local": "15/08/2025 · trecho de 21h30 a 22h45 entregue à polícia · imagem noturna, em preto e branco",
  "colunas": ["Hora", "Imagem"], "linhas": [
   ["21:30–21:57", "Rua vazia. A porta lateral do salão está fechada."], ["21:58", "Homem de boné escuro abre a porta lateral com chave e entra. O rosto não aparece."],
   ["22:01", "Lívia chega pela rua de trás e entra pela porta lateral."], ["22:00–22:15", "Clarões dos fogos iluminam a rua."],
   ["22:31", "O homem de boné escuro sai pela porta lateral, tranca a porta com chave, olha para os dois lados e segue pela rua de trás, em direção à praça."], ["22:31–22:45", "Ninguém mais entra ou sai. Lívia não sai pela porta lateral."]],
  "nota": "A imagem em preto e branco não permite saber a cor do boné."}},
 {"id": "E-18", "titulo": "Lista de objetos encontrados com a vítima", "tipo": "lista", "objetivos": [1, 3], "origem": "pdf", "conteudo": {
  "orgao": IC, "documento": "AUTO DE ARRECADAÇÃO — MIRANTE DA PEDRA DO CORVO",
  "itens": [["1", "Bolsa de couro marrom", "Ao lado do corpo"], ["2", "Celular, desligado, bateria em 64%", "Dentro da bolsa"], ["3", "Carteira com documentos e R$ 46,00", "Dentro da bolsa"], ["4", "Passagem de ônibus para a capital, domingo, 17/08, 6h", "Dentro da bolsa"], ["5", "Chaveiro com 3 chaves (casa, escola, porta lateral do salão)", "Dentro da bolsa"]],
  "nota": "O caderno de contas da festa, que segundo a mãe (E-14) a vítima levava sempre na bolsa, não foi encontrado."}},
 {"id": "E-19", "titulo": "Programação da festa", "tipo": "agenda", "objetivos": [2], "origem": "pdf", "conteudo": {
  "titulo": "Festa de Nossa Senhora das Graças — Sexta, 15/08/2025", "dias": [
   ["19h00", ["Missa na matriz"]], ["20h00", ["Procissão"]], ["20h30", ["Abertura das barracas: pastel, quentão, rifa"]], ["22h00", ["Queima de fogos (15 minutos) e toque do sino"]], ["23h00", ["Encerramento"]]]}},
 {"id": "E-20", "titulo": "Escala de voluntários da festa", "tipo": "log", "objetivos": [2], "origem": "pdf", "conteudo": {
  "sistema": "COMISSÃO DA FESTA — ESCALA DE VOLUNTÁRIOS", "local": "Sexta, 15/08/2025",
  "colunas": ["Posto", "Responsável", "Observação"], "linhas": [
   ["Barraca do pastel", "Vânia (fritura) e Gilberto (caixa)", "Maquininha da barraca, com login de cada operador"], ["Mesa da rifa", "Marisa", "Maquininha da rifa"], ["Caixa geral da festa", "Lívia", "Recolhe o dinheiro das barracas às 23h"],
   ["Torre / sino", "Seu Toninho", "Toque manual durante os fogos"], ["Coordenação", "Gilberto", "Organiza as barracas e os voluntários"]]}},
 {"id": "E-21", "titulo": "Áudio de Lívia para a mãe (21h49)", "tipo": "audio", "objetivos": [1], "origem": "pdf", "conteudo": {
  "audio": "audio-livia", "arquivo": "Mensagem de voz recebida no celular de Célia Campos", "inicio": "Sexta, 15/08/2025, 21h49 (duração: 14 segundos)",
  "descricao": "Áudio entregue à polícia pela mãe da vítima. Ouça com fone de ouvido.",
  "transcricao": ["[barulho de festa e música ao fundo]", "Lívia: Mãe, não me espera acordada, tá? Vou ali no salão resolver aquele negócio do caderno antes dos fogos. Depois passo na rifa com a Marisa. Fica tranquila. Beijo."]}},
 {"id": "E-22", "titulo": "Registro da live de Caíque", "tipo": "app", "objetivos": [2], "origem": "pdf", "conteudo": {
  "app": "TOCAÍ — relatório de transmissão ao vivo", "campos": [["Conta", "@caique.lopes"], ["Início", "15/08/2025, 21:55"], ["Fim", "22:36"], ["Local do aparelho", "Rua da Matriz, 41 — Bar do Tião (precisão 6 m)"],
   ["Imagem", "Caíque aparece na maior parte da transmissão, sentado à mesa do bar com amigos; os fogos aparecem ao fundo, das 22:00 às 22:15"], ["Interrupções", "Nenhuma"]]}},
 {"id": "E-23", "titulo": "Registro da torre da igreja", "tipo": "log", "objetivos": [2], "origem": "pdf", "conteudo": {
  "sistema": "MATRIZ DE N. S. DAS GRAÇAS — SINO ELETRÔNICO E PORTA DA TORRE", "local": "15/08/2025",
  "colunas": ["Hora", "Evento"], "linhas": [["21:57", "Porta da torre aberta (entrada)"], ["22:00:05", "Toque manual — painel da torre"], ["22:15:02", "Toque manual — painel da torre"], ["22:30:00", "Toque manual — painel da torre"], ["22:31", "Porta da torre aberta (saída)"]],
  "nota": "O toque manual só pode ser feito no painel que fica no alto da torre. A torre tem uma única porta, que dá para dentro da igreja."}},
 # ── liberadas no objetivo 1 ──
 {"id": "B-01", "titulo": "Maquininha da barraca do pastel", "tipo": "log", "objetivos": [2], "origem": "bonus1", "conteudo": {
  "sistema": "PAGUEFÁCIL — RELATÓRIO DE VENDAS POR OPERADOR", "local": "Barraca do pastel — Comissão da Festa · 15/08/2025",
  "nota_topo": "Cada venda é registrada com o login de quem está operando a maquininha naquele momento.",
  "colunas": ["Horário", "Operador", "Vendas"], "linhas": [["20:31–21:52", "GILBERTO", "63 vendas"], ["21:53–22:38", "VANIA", "41 vendas"], ["22:41–23:02", "GILBERTO", "18 vendas"]],
  "nota": "Entre 21:53 e 22:40 não há nenhuma venda com o login de Gilberto."}},
 {"id": "B-02", "titulo": "Fotos de Hugo Bastos (22h00 a 22h35)", "tipo": "foto", "objetivos": [2], "origem": "bonus1", "conteudo": {
  "img": "foto-barraca", "legenda": "Foto de Hugo Bastos, 22:12:40: a barraca do pastel vista do coreto, durante os fogos. Vânia atende sozinha; ao fundo, Marisa na mesa da rifa.",
  "notas": ["Os arquivos do cartão de memória guardam hora e local de cada foto (coordenadas do coreto).", "22:00 a 22:35 — 212 fotos tiradas do coreto: fogos, público, barracas.", "22:12:40 (foto acima) — na barraca do pastel só está Vânia, no caixa e na fritura. Gilberto não aparece em nenhuma foto entre 22:00 e 22:35.", "Marisa aparece na mesa da rifa em 9 fotos, entre 22:03 e 22:31."]}},
 {"id": "B-03", "titulo": "Mensagens de Lívia ao Padre (14/08)", "tipo": "chat", "objetivos": [3], "origem": "bonus1", "conteudo": {
  "grupo": "Lívia ↔ Padre Anselmo Duarte", "data": "Quinta, 14/08/2025", "msgs": [
   ["20:10", "Lívia", "Padre, depois da festa preciso mostrar ao senhor e à comissão umas contas da festa que não batem. Faz três anos que não batem."], ["20:15", "Padre Anselmo", "Pode ser sábado às 9h, na secretaria?"],
   ["20:16", "Lívia", "Pode. Vou levar o caderno. Já avisei o Gilberto que vou apresentar."], ["20:17", "Padre Anselmo", "Deus te abençoe, filha."]]}},
 {"id": "B-04", "titulo": "Maquininha da mesa da rifa", "tipo": "log", "objetivos": [2], "origem": "bonus1", "conteudo": {
  "sistema": "PAGUEFÁCIL — RELATÓRIO DE VENDAS POR OPERADOR", "local": "Mesa da rifa — Comissão da Festa · 15/08/2025",
  "colunas": ["Horário", "Operador", "Vendas"], "linhas": [["20:35–21:59", "MARISA", "37 vendas"], ["22:00–22:30", "MARISA", "29 vendas, uma a cada minuto, em média"], ["22:31–23:00", "MARISA", "12 vendas"]],
  "nota": "A maquininha da rifa fica presa à mesa por um cabo de segurança."}},
 # ── liberadas no objetivo 2 ──
 {"id": "B-05", "titulo": "Rastreador da van do Mercadinho Assunção", "tipo": "log", "objetivos": [3], "origem": "bonus2", "conteudo": {
  "sistema": "RASTREIA+ — RELATÓRIO DE TRAJETO", "local": "Van branca do Mercadinho Assunção · 15/08/2025",
  "colunas": ["Hora", "Evento", "Local"], "linhas": [
   ["19:40–23:20", "Parada", "Rua da Matriz, ao lado da praça"], ["23:21", "Em movimento", "Saída da Rua da Matriz"], ["23:24–23:29", "Parada (5 min)", "Rua de trás do salão paroquial, em frente à porta lateral"],
   ["23:31", "Em movimento", "Estrada do Mirante"], ["23:36–23:44", "Parada (8 min)", "Estacionamento do Mirante da Pedra do Corvo"], ["23:52", "Parada até 06:50", "Mercadinho Assunção"]],
  "nota": "A câmera F1 da farmácia (trecho de 23h a 00h, entregue depois) mostra um utilitário claro parado na rua de trás do salão de 23:24 a 23:29, com a porta traseira aberta. A placa não aparece."}},
 {"id": "B-06", "titulo": "Perícia no depósito do salão paroquial", "tipo": "oficio", "objetivos": [3], "origem": "bonus2", "conteudo": {
  "orgao": IC, "documento": "LAUDO PERICIAL Nº 0091/2025 — DEPÓSITO DO SALÃO PAROQUIAL",
  "tabela": {"cab": ["Local", "Resultado"], "linhas": [
   ["Mesa de ferro, quina traseira", "Vestígio de sangue da vítima, após limpeza com água sanitária. A quina reta é compatível com a marca descrita no laudo E-05."],
   ["Piso do depósito", "Encerado com cera de carnaúba, a mesma encontrada nas solas dos tênis da vítima (E-06)."], ["Prateleira de materiais da festa", "Caixa de rifas e sacos de troco reviradas."]]},
  "corpo": ["A vítima morreu no depósito do salão, e o local foi limpo depois."],
  "assinatura": "Otávio Neri — Perito Criminal", "anexo": {"img": "deposito", "legenda": "Depósito do salão: mesa de ferro (marcador 1) e prateleira da festa (marcador 2)."}}},
 {"id": "B-07", "titulo": "Busca no Mercadinho Assunção", "tipo": "lista", "objetivos": [3], "origem": "bonus2", "conteudo": {
  "orgao": DP, "documento": "AUTO DE BUSCA E APREENSÃO — MERCADINHO ASSUNÇÃO E VAN",
  "itens": [["1", "Caderno de contas da festa, com o nome de Lívia na capa", "Gaveta trancada do escritório do mercadinho"],
            ["2", "Lona azul com terra vermelha e fios de cabelo longos, castanhos", "Carroceria da van"], ["3", "Boné azul-marinho com o logotipo do mercadinho", "Banco do motorista da van"]],
  "nota": "No caderno, com a letra de Lívia: 'Rifa 2023: vendido R$ 38.400, depositado R$ 21.000. Leilão 2024: arrecadado R$ 26.000, depositado R$ 14.500. Falta R$ 28.900. Os depósitos foram feitos sempre pelo coordenador (G.A.).' Os fios de cabelo da lona são compatíveis com os da vítima."}},
 {"id": "B-08", "titulo": "Mensagem apagada recuperada — celular de Gilberto", "tipo": "chat", "objetivos": [3], "origem": "bonus2", "conteudo": {
  "grupo": "Gilberto → Lívia (apagada às 23h58, recuperada pela perícia)", "data": "Sexta, 15/08/2025", "msgs": [
   ["21:44", "Gilberto", "me encontra no depósito do salão às 22h, antes de você falar com o padre. a gente resolve isso entre nós"], ["21:45", "Lívia", "tá. mas sábado eu vou apresentar do mesmo jeito"]]}},
]

def combos(*grupos):
    out = []
    for c in itertools.product(*grupos):
        if len(set(c)) == len(c):
            s = sorted(c)
            if s not in out: out.append(s)
    return out

SUSP = [("gilberto", "Gilberto Assunção"), ("vania", "Vânia Assunção"), ("caique", "Caíque Lopes"), ("marisa", "Marisa Teles"), ("hugo", "Hugo Bastos"), ("toninho", "Antônio Reis (Toninho)")]
op_susp = [{"id": i, "texto": n} for i, n in SUSP]

objetivos = [
 {"n": 1, "titulo": "Não foi um acidente", "pergunta": "A primeira hipótese foi de queda acidental no mirante depois da festa. Prove o que realmente aconteceu com Lívia.",
  "campos": [{"id": "fato", "label": "O que aconteceu com Lívia?", "opcoes": [
   {"id": "a", "texto": "Caiu sozinha do mirante, depois da festa."}, {"id": "b", "texto": "Escorregou na trilha, a caminho do mirante."},
   {"id": "c", "texto": "Morreu em outro lugar e foi levada ao mirante depois."}, {"id": "d", "texto": "Foi atropelada na Estrada do Mirante."}]}],
  "n_provas": 3, "aceitas": [{"fato": "c", "combinacoes": combos(["E-05"], ["E-06", "E-07", "E-04"], ["E-06", "E-07", "E-04", "E-21"])}],
  "quase": [
   {"campos": {"fato": "a"}, "msg": "Releia o laudo E-05: as escoriações da queda aconteceram antes ou depois da morte?"},
   {"campos": {"fato": "b"}, "msg": "Se ela tivesse andado na trilha depois da chuva, como estariam os tênis dela (E-06)?"},
   {"campos": {"fato": "d"}, "msg": "O laudo E-05 diz o que causou a morte, e não fala em atropelamento."},
   {"campos": {"fato": "c"}, "msg": "Você entendeu o que aconteceu. Agora escolha 3 provas: a causa da morte e dois registros de que ela não esteve na trilha do mirante."}],
  "dicas": ["Comece pelo laudo do IML (E-05). Do que ela morreu, e quando aconteceram as escoriações da queda?",
            "Quem anda na trilha depois da chuva deixa marcas e leva barro. E o celular dela: por onde passou?",
            "E-05: a batida na cabeça matou, e as escoriações são de depois da morte. E-06: os tênis estão limpos. E-07: o celular foi para o salão paroquial e nunca esteve no mirante."],
  "bonus": ["B-01", "B-02", "B-03", "B-04"],
  "msg_acerto": "Lívia não caiu do mirante. Morreu de uma batida na cabeça em outro lugar, por volta das 22h, e o corpo foi levado até lá depois. Novas provas foram liberadas."},
 {"n": 2, "titulo": "Quem mentiu sobre onde estava?", "pergunta": "Entre 22h00 e 22h30, alguém estava com Lívia no salão paroquial. Quem mentiu sobre onde estava nesse horário? Prove a mentira.",
  "campos": [{"id": "suspeito", "label": "Quem mentiu?", "opcoes": op_susp}],
  "n_provas": 3, "aceitas": [{"suspeito": "gilberto", "combinacoes": combos(["E-08", "E-02"], ["B-01", "B-02"], ["B-01", "B-02", "E-17", "E-08", "E-02"])}],
  "quase": [
   {"campos": {"suspeito": "vania"}, "msg": "A maquininha (B-01) e a foto do Hugo (B-02) mostram Vânia na barraca o tempo todo. A pergunta é quem mentiu sobre onde ESTAVA."},
   {"campos": {"suspeito": "caique"}, "msg": "A live de Caíque (E-22) mostra ele no Bar do Tião das 21h55 às 22h36, sem interrupção."},
   {"campos": {"suspeito": "marisa"}, "msg": "A maquininha da rifa, presa à mesa (B-04), e as fotos do Hugo (B-02) mostram Marisa na mesa da rifa."},
   {"campos": {"suspeito": "hugo"}, "msg": "As fotos de Hugo guardam hora e local (B-02): ele estava no coreto."},
   {"campos": {"suspeito": "toninho"}, "msg": "O registro da torre (E-23) mostra Toninho lá em cima das 21h57 às 22h31: o sino só toca pelo painel do alto."},
   {"campos": {"suspeito": "gilberto"}, "msg": "Você achou o suspeito certo, mas falta um registro que prove que ele não estava onde disse. Junte o que ele declarou com um registro feito por um aparelho ou uma câmera."}],
  "dicas": ["Compare a tabela de declarações (E-02) com os registros liberados no Objetivo 1.",
            "Alguém disse que passava cartão na maquininha. Mas a maquininha guarda o nome de quem está operando.",
            "Gilberto disse que ficou no caixa da barraca (E-08). A maquininha (B-01) não registra nenhuma venda dele de 21h53 a 22h40, e a foto das 22h12 (B-02) mostra Vânia sozinha na barraca."],
  "bonus": ["B-05", "B-06", "B-07", "B-08"],
  "msg_acerto": "Gilberto mentiu. Entre 21h53 e 22h40 ele não estava na barraca do pastel. Novas provas foram liberadas."},
 {"n": 3, "titulo": "Acusação final", "pergunta": "Monte a acusação: quem matou Lívia Campos, como e por quê?",
  "campos": [{"id": "suspeito", "label": "Culpado", "opcoes": op_susp},
             {"id": "metodo", "label": "Como", "opcoes": [
              {"id": "m1", "texto": "Marcou um encontro no depósito do salão; na discussão, ela bateu a cabeça na mesa de ferro. Mais tarde, levou o corpo de van ao mirante para parecer uma queda."},
              {"id": "m2", "texto": "Empurrou Lívia do mirante durante a festa."}, {"id": "m3", "texto": "Atropelou Lívia com a van na Estrada do Mirante."},
              {"id": "m4", "texto": "Envenenou o quentão dela na barraca."}]},
             {"id": "motivo", "label": "Por quê", "opcoes": [
              {"id": "mo1", "texto": "Ciúme: não aceitava que ela fosse embora."}, {"id": "mo2", "texto": "Ela ia mostrar ao padre e à comissão que ele desviava o dinheiro da festa."},
              {"id": "mo3", "texto": "Inveja: ela ficou com a vaga na capital."}, {"id": "mo4", "texto": "Ela o fotografou num lugar onde não devia estar."}]}],
  "n_provas": 3, "aceitas": [{"suspeito": "gilberto", "metodo": "m1", "motivo": "mo2", "combinacoes": combos(["B-05", "B-07"], ["B-06", "B-08"], ["B-07", "B-03"])}],
  "quase": [
   {"campos": {"suspeito": "gilberto", "metodo": "m1", "motivo": "mo1"}, "msg": "Quem não aceitava a mudança era o Caíque. O que Lívia ia apresentar no sábado (B-03, B-07)?"},
   {"campos": {"suspeito": "gilberto", "metodo": "m1", "motivo": "mo3"}, "msg": "A vaga na capital era assunto da Marisa (E-15). O que Lívia ia apresentar no sábado (B-03)?"},
   {"campos": {"suspeito": "gilberto", "metodo": "m1", "motivo": "mo4"}, "msg": "Foi a Lívia quem pediu ao Hugo para apagar uma foto (E-12). O que ela ia apresentar no sábado (B-03)?"},
   {"campos": {"suspeito": "gilberto", "metodo": "m2", "motivo": "mo2"}, "msg": "Ela já estava morta quando chegou ao barranco (E-05), e o celular nunca esteve no mirante (E-07)."},
   {"campos": {"suspeito": "gilberto", "metodo": "m3", "motivo": "mo2"}, "msg": "O laudo E-05 fala de uma batida contra uma quina reta e metálica, não de atropelamento. Onde existe uma quina assim (B-06)?"},
   {"campos": {"suspeito": "gilberto", "metodo": "m4", "motivo": "mo2"}, "msg": "O laudo E-05 diz como ela morreu: uma batida na cabeça."},
   {"campos": {"suspeito": "gilberto", "metodo": "m1", "motivo": "mo2"}, "msg": "A acusação está certa. Agora sustente com 3 provas: o que liga Gilberto ao transporte do corpo ou ao caderno, onde e como ela morreu, e o motivo."},
   {"campos": {"suspeito": "vania"}, "msg": "Vânia mentiu para cobrir o marido, mas estava na barraca o tempo todo (B-01, B-02)."},
   {"campos": {"suspeito": "caique"}, "msg": "Caíque brigou com ela, mas a live (E-22) o mantém no Bar do Tião."},
   {"campos": {"suspeito": "marisa"}, "msg": "Marisa tinha inveja (E-15), mas estava presa à mesa da rifa (B-04, B-02)."},
   {"campos": {"suspeito": "hugo"}, "msg": "Hugo estava no coreto, e as fotos dele provam (B-02)."},
   {"campos": {"suspeito": "toninho"}, "msg": "Toninho estava na torre (E-23) e só encontrou o corpo de manhã."}],
  "dicas": ["Leia com calma tudo o que foi liberado no Objetivo 2. Quem tinha a chave do depósito, uma van e algo a esconder no caderno?",
            "Siga a van depois da festa (B-05) e veja o que a busca encontrou nela (B-07). E com quem Lívia ia se encontrar às 22h?",
            "B-05 e B-07: a van foi do salão ao mirante e levava a lona com os cabelos dela. B-06 e B-08: ela morreu no depósito, onde Gilberto marcou o encontro. B-03 e B-07: o caderno provava o desvio do dinheiro da festa."],
  "bonus": [], "msg_acerto": "Caso encerrado."},
]

suspeitos = [
 {"id": "gilberto", "nome": "Gilberto Assunção", "idade": 47, "relacao": "Coordenador da comissão da festa; dono do Mercadinho Assunção",
  "alibi": "Na barraca do pastel, no caixa, das 22h00 às 22h30.", "segredo": "Desviou R$ 28.900 da rifa e do leilão da festa em três anos; Lívia ia apresentar o caderno ao padre no sábado (B-03, B-07).",
  "parece_culpado": "É o culpado.", "inocenta": "—",
  "foto": {"rosto": "rosto-gilberto", "ficha": "ficha-gilberto", "dia": "rosto-gilberto", "cracha": {"empresa": "COMISSÃO DA FESTA", "cargo": "Coordenador"}}},
 {"id": "vania", "nome": "Vânia Assunção", "idade": 45, "relacao": "Esposa de Gilberto; voluntária na barraca do pastel",
  "alibi": "Na barraca do pastel, fritando, com o marido no caixa.", "segredo": "Mentiu para dar um álibi ao marido (E-09, B-01).",
  "parece_culpado": "Tem a chave do depósito e mentiu à polícia.", "inocenta": "A maquininha (B-01) registra vendas com o login dela de 21h53 a 22h38, e a foto das 22h12 (B-02) a mostra atendendo sozinha.",
  "foto": {"rosto": "rosto-vania", "ficha": "ficha-vania", "dia": "rosto-vania", "cracha": {"empresa": "COMISSÃO DA FESTA", "cargo": "Voluntária — barraca do pastel"}}},
 {"id": "caique", "nome": "Caíque Lopes", "idade": 26, "relacao": "Mecânico; ex-namorado da vítima",
  "alibi": "No Bar do Tião, fazendo live com os amigos.", "segredo": "Não aceitava o fim do namoro e brigou com Lívia em público às 21h20 (E-02).",
  "parece_culpado": "Brigou com ela uma hora antes e usava boné escuro, como o homem da câmera.", "inocenta": "A live (E-22) mostra Caíque no Bar do Tião das 21h55 às 22h36, sem interrupção.",
  "foto": {"rosto": "rosto-caique", "ficha": "ficha-caique"}},
 {"id": "marisa", "nome": "Marisa Teles", "idade": 33, "relacao": "Prima da vítima; voluntária na mesa da rifa",
  "alibi": "Na mesa da rifa.", "segredo": "Escreveu ao colégio da capital dizendo que Lívia 'não era confiável' (E-15).",
  "parece_culpado": "Disputava a mesma vaga e tentou sabotar a prima.", "inocenta": "A maquininha da rifa, presa à mesa, registra vendas dela de minuto em minuto (B-04), e ela aparece em 9 fotos de Hugo entre 22h03 e 22h31 (B-02).",
  "foto": {"rosto": "rosto-marisa", "ficha": "ficha-marisa", "dia": "rosto-marisa", "cracha": {"empresa": "COMISSÃO DA FESTA", "cargo": "Voluntária — rifa"}}},
 {"id": "hugo", "nome": "Hugo Bastos", "idade": 29, "relacao": "Fotógrafo de uma revista de turismo, de fora da cidade",
  "alibi": "No coreto, fotografando os fogos.", "segredo": "—",
  "parece_culpado": "Era o forasteiro, fotografou Lívia sem pedir e foi visto discutindo com ela.", "inocenta": "As 212 fotos tiradas do coreto entre 22h00 e 22h35 guardam hora e local (B-02).",
  "foto": {"rosto": "rosto-hugo", "ficha": "ficha-hugo", "dia": "rosto-hugo", "cracha": {"empresa": "REVISTA TERRAS ALTAS", "cargo": "Fotógrafo"}}},
 {"id": "toninho", "nome": "Antônio Reis (Toninho)", "idade": 61, "relacao": "Sacristão da matriz; encontrou o corpo",
  "alibi": "Na torre da igreja, tocando o sino.", "segredo": "—",
  "parece_culpado": "Encontrou o corpo e conhece a trilha do mirante melhor que ninguém.", "inocenta": "A porta e o painel da torre (E-23) o colocam lá em cima das 21h57 às 22h31.",
  "foto": {"rosto": "rosto-toninho", "ficha": "ficha-toninho"}},
]

tl = [["21h20", "Lívia e Caíque discutem em frente à barraca do pastel."], ["21h44", "Gilberto manda mensagem marcando um encontro no depósito do salão às 22h."],
      ["21h49", "Lívia manda um áudio à mãe: vai ao salão resolver 'o negócio do caderno'."], ["21h52", "Última venda de Gilberto na maquininha da barraca."],
      ["21h58", "Gilberto entra pela porta lateral do salão com a chave."], ["22h01", "Lívia entra pela porta lateral."],
      ["22h00–22h10", "No depósito, Lívia diz que vai apresentar o caderno de qualquer jeito. Gilberto a empurra; ela bate a cabeça na quina da mesa de ferro e morre."],
      ["22h08", "Gilberto desliga o celular de Lívia, pega o caderno e limpa a mesa."], ["22h31", "Gilberto sai pela porta lateral, tranca e volta à praça."],
      ["22h41", "Gilberto volta a operar a maquininha da barraca."], ["23h21–23h29", "Depois da festa, para a van atrás do salão e leva o corpo enrolado numa lona."],
      ["23h36–23h44", "No mirante, deixa o corpo e a bolsa no barranco, sem passar pela trilha."], ["23h52", "Guarda a van no mercadinho. Apaga a mensagem às 23h58."], ["06h10", "Seu Toninho encontra o corpo."]]

b = {
 "slug": "serra-do-corvo", "numero": "003", "titulo": "Ninguém Saiu de Serra do Corvo",
 "subtitulo": "Na noite da festa, a cidade inteira estava na praça. Menos uma pessoa.",
 "sinopse": "Na noite da festa da padroeira, Lívia, 24 anos, some no meio da praça cheia. De manhã, é encontrada no barranco do mirante. A cidade quer acreditar num acidente. Todo mundo tem algo a esconder.",
 "codigo": "CORVO-UCNY-E4J8", "acento": "#5E7A4A", "dificuldade": "Difícil", "duracao": "90–120 min", "jogadores": "1 a 4", "classificacao": "14+",
 "local": "Praça da Matriz e Mirante da Pedra do Corvo — Serra do Corvo", "data_crime": "Sexta-feira, 15 de agosto de 2025",
 "verdade": {"resumo": "Gilberto Assunção, coordenador da comissão da festa, desviava há três anos parte do dinheiro da rifa e do leilão. Lívia, tesoureira voluntária, anotou tudo num caderno e marcou com o padre de apresentar as contas no sábado. Gilberto a chamou ao depósito do salão às 22h, durante os fogos. Na discussão, ela bateu a cabeça na quina da mesa de ferro e morreu. Ele limpou a mesa, levou o caderno e voltou à barraca, onde a esposa mentiu para cobri-lo. Depois da festa, levou o corpo de van até o mirante para simular uma queda.",
             "culpado": "gilberto", "metodo": "Empurrão no depósito do salão, batida da cabeça na mesa de ferro; o corpo foi levado de van ao mirante para simular queda.", "motivo": "Impedir que Lívia mostrasse ao padre e à comissão o desvio do dinheiro da festa.", "linha_do_tempo": tl},
 "suspeitos": suspeitos, "provas": provas, "objetivos": objetivos,
 "solucao": {
  "relato": [
   "Gilberto Assunção coordenava a comissão da festa e fazia sozinho os depósitos do dinheiro. Em três anos, R$ 28.900 da rifa e do leilão não chegaram ao banco (B-07). Lívia, que cuidava do caixa, anotou tudo num caderno, marcou com o padre de apresentar as contas no sábado e avisou Gilberto (B-03).",
   "Às 21h44, Gilberto mandou mensagem marcando um encontro no depósito do salão às 22h (B-08). Fez a última venda na maquininha às 21h52 (B-01) e entrou pela porta lateral, com a chave, às 21h58 (E-17). Lívia avisou a mãe que ia ao salão 'resolver o negócio do caderno' (E-21) e entrou às 22h01 (E-17, E-07).",
   "No depósito, durante os fogos, ela disse que ia apresentar de qualquer jeito. Gilberto a empurrou e ela bateu a cabeça na quina da mesa de ferro (E-05, B-06). O celular dela foi desligado às 22h08 (E-07). Gilberto limpou a mesa com água sanitária, pegou o caderno e saiu às 22h31, trancando a porta (E-17). Voltou à barraca às 22h41 (B-01), e Vânia disse à polícia que ele nunca tinha saído de lá (E-09).",
   "Depois da festa, às 23h24, parou a van na porta lateral do salão e levou o corpo enrolado numa lona (B-05, B-07). Às 23h36 chegou ao mirante e jogou o corpo e a bolsa no barranco a partir do estacionamento, sem passar pela trilha enlameada (E-04, E-06). As escoriações foram produzidas depois da morte (E-05).",
   "Caíque, Marisa e Hugo tinham conflitos com Lívia, mas registros independentes os colocam em outros lugares das 22h às 22h30 (E-22, B-04, B-02). Toninho estava na torre (E-23) e só encontrou o corpo de manhã."],
  "confissao": "Ela disse que ia mostrar o caderno de qualquer jeito. Eu só queria o caderno. Empurrei, ela bateu na mesa e não levantou mais. Depois eu pensei no mirante: todo ano alguém cai lá. — Gilberto Assunção, em interrogatório à Delegada Sônia Matos, 19/08/2025.",
  "pistas": [["E-05", "A batida na cabeça matou; as escoriações da queda são de depois da morte."], ["E-06", "Tênis limpos: ela não andou na trilha enlameada."], ["E-07", "O celular foi para o salão paroquial e nunca esteve no mirante."],
             ["E-17", "Um homem de boné entra com chave pela porta lateral às 21h58 e sai sozinho às 22h31."], ["B-01", "Nenhuma venda de Gilberto na maquininha de 21h53 a 22h40."], ["B-02", "Às 22h12, Vânia está sozinha na barraca."],
             ["B-03", "Lívia ia apresentar as contas ao padre no sábado e tinha avisado Gilberto."], ["B-05", "A van foi da porta lateral do salão ao mirante depois da festa."],
             ["B-06", "Sangue da vítima na quina da mesa do depósito, limpa com água sanitária."], ["B-07", "O caderno, a lona com cabelos e o boné estavam com Gilberto."], ["B-08", "Gilberto marcou o encontro no depósito às 22h."]],
  "interrogatorio": {"data": "19/08/2025, 14h10", "declarante": "Gilberto Assunção, 47 anos", "audio": "dep-confissao", "foto": "rosto-gilberto", "qa": [
   ["Senhor Gilberto, o caderno da Lívia estava na gaveta do seu escritório, e a van foi do salão ao mirante. Quer mudar o seu depoimento?", "Quero."],
   ["O que aconteceu no depósito?", "Eu pedi pra ela não apresentar, disse que eu devolvia tudo. Ela falou que ia mostrar de qualquer jeito. Eu só queria o caderno. Empurrei. Ela bateu a cabeça na quina da mesa e não levantou mais."],
   ["E depois?", "Desliguei o celular dela, limpei a mesa e voltei pra barraca. Pedi pra Vânia dizer que eu não tinha saído de lá."],
   ["E o mirante?", "Pensei no mirante porque todo ano alguém cai lá. Levei ela na van depois da festa. Achei que ninguém ia desconfiar."]]}},
 "interrogatorio": {"ativo": False, "nota": "Preparado para a fase 2 do produto."},
 "vitima": {"nome": "Lívia Campos", "idade": 24, "relacao": "Professora; tesoureira voluntária da comissão da festa", "foto": {"rosto": "rosto-livia", "ficha": "ficha-livia"}},
 "briefing": {"de": "Delegada Sônia Matos", "cargo": "Delegacia de Polícia de Serra do Corvo", "audio": "briefing", "texto": [
  "Sábado, 16 de agosto. Lívia Campos, 24 anos, professora, foi encontrada às seis e dez da manhã no barranco abaixo do Mirante da Pedra do Corvo.",
  "Na noite anterior, a cidade inteira estava na praça para a festa da padroeira. Todo mundo quer que tenha sido um acidente. Numa cidade deste tamanho, todo mundo conhece todo mundo. E todo mundo tem alguma coisa para esconder.",
  "O dossiê é seu: depoimentos, laudos, câmeras, mensagens. Confira onde cada um disse que estava e procure o registro que confirma ou desmente.",
  "Boa sorte, investigador."]},
 "tempo_jogo": {"de": "21:15", "ate": "23:50", "cartas": [
  ["t01", "Lívia reclama do Caíque com a prima", "21:21", "E-16", 0], ["t02", "Lívia avisa a prima que vai 'resolver um negócio'", "21:46", "E-16", 0], ["t03", "Lívia manda áudio para a mãe", "21:49", "E-21", 0],
  ["t04", "Caíque começa a live", "21:55", "E-22", 0], ["t05", "Toninho entra na torre", "21:57", "E-23", 0], ["t06", "Homem de boné entra no salão com chave", "21:58", "E-17", 0],
  ["t07", "Começam os fogos e o sino", "22:00", "E-23", 0], ["t08", "Lívia entra pela porta lateral", "22:01", "E-17", 0], ["t09", "Celular de Lívia registrado no salão", "22:02", "E-07", 0],
  ["t10", "Celular de Lívia é desligado", "22:08", "E-07", 0], ["t11", "Homem de boné sai e tranca a porta", "22:31", "E-17", 0], ["t12", "Toninho sai da torre", "22:31", "E-23", 0],
  ["t13", "Última venda de Gilberto antes do intervalo", "21:52", "B-01", 1], ["t14", "Foto: Vânia sozinha na barraca", "22:12", "B-02", 1], ["t15", "Gilberto volta à maquininha", "22:41", "B-01", 1],
  ["t16", "Van para na porta lateral do salão", "23:24", "B-05", 2], ["t17", "Van chega ao mirante", "23:36", "B-05", 2]]},
 "impresso": {"titulo_pessoas": "As pessoas da festa", "texto_vitima": "Encontrada morta no barranco abaixo do Mirante da Pedra do Corvo às 6h10 de sábado, 16 de agosto de 2025, depois da festa da padroeira.", "texto_suspeitos": "Estiveram com ela ou tinham conflito com ela naquela noite:"},
 "vitrine": {"tipo": "HOMICÍDIO", "ano": "2025", "cidade": "SERRA DO CORVO", "capa": "cena-mirante", "novo": True},
}
b["proibidos"] = ["Gilberto Assunção", "R$ 28.900", "CORVO-UCNY-E4J8"]
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(b, open(OUT, "w"), ensure_ascii=False, indent=1)
print("ok", len(provas), "provas;", [len(o["aceitas"][0]["combinacoes"]) for o in objetivos], "combinações")
