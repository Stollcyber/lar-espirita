/* Evangelização: aulas contínuas para uma turma de crianças de 5 a 10 anos, no tablet.
   Módulo separado, para poder virar um app próprio: só conversa com o app pelo objeto "api" (ver o fim de lar-espirita.html).
   Para clonar: aulas/ (aulas.js, mundo.js, aulas.css), dados/evangelizacao.json, arte/aulas/ e, nas ferramentas, montar-evangelizacao.mjs e aulas-arte.cjs.

   De onde vem o desenho da aula (ver CONTINUAR.md):
   - FEB/CFN, Orientação à Ação Evangelizadora Espírita da Infância (2016): espaços interativos, lúdicos e afetivos, jogos
     cooperativos, "instigando perguntas, mais do que oferecendo respostas" (p. 48), recursos criativos e tecnológicos (p. 48),
     arte (p. 49), planejar e "avaliar a ação e se autoavaliar" (p. 59).
   - FEB, Currículo (2006): Jardim 5-6, 1º Ciclo 7-8, 2º Ciclo 9-10; módulos; partir da vida da criança; perguntas e respostas
     como Kardec; expressão do conhecimento.
   - Prece inicial e final, história, comentários, atividade: roteiros de aula do Grupo Seara do Mestre (prática das casas;
     não há nada sobre isso em Jacobson Trovão ou Jorge Elarrat, e a FEB não fixa a ordem nem os minutos).
   As crianças jogam sempre juntas: não há placar individual nem quem perde. Os nomes ficam só no aparelho.
   Missão surpresa (2 vezes por mês): proposta nossa a partir do Evangelho, cap. XIII; não vem da FEB nem dos autores acima. */
window.IniciarAulas = function (api) {
  'use strict';
  var app = api.app, G = api.G, anima = api.anima, esc = api.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DADOS = null, CHAVE = 'lar-aulas';
  var S = api.lerLocal(CHAVE, null) || { turmas: [], atual: null };
  function gravar() { api.gravarLocal(CHAVE, S); }
  function turma() { return S.turmas.filter(function (t) { return t.id === S.atual; })[0] || S.turmas[0] || null; }
  function som(n) { try { if (api.Som && api.Som[n]) api.Som[n](); } catch (e) {} }
  function normal(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function embaralhar(l) { l = l.slice(); for (var i = l.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = l[i]; l[i] = l[j]; l[j] = x; } return l; }
  function cortar(t, n) { if (t.length <= n) return t; var c = t.slice(0, n); return c.slice(0, c.lastIndexOf(' ')) + '…'; }
  function dataCurta(ms) { return new Date(ms).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }); }

  var ICO = {
    voltar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    fechar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
    ouvir: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
    guia: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r=".7" fill="currentColor"/></svg>',
    pergunta: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.6 9a3.5 3.5 0 1 1 5.2 3c-1.1.7-1.8 1.4-1.8 2.8"/><circle cx="12" cy="18.6" r=".7" fill="currentColor"/></svg>',
    apagar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
    feito: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7"/></svg>'
  };

  // A missão: envelope fechado (com selo redondo) e um desenho por tipo, para quem ainda não lê.
  var ENVELOPE = '<svg viewBox="0 0 120 84" aria-hidden="true"><rect x="3" y="3" width="114" height="78" rx="12" fill="#FFF6E3" stroke="#E8C68E" stroke-width="3"/><path d="M6 10 L60 50 L114 10" fill="none" stroke="#E8C68E" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="49" r="11" fill="#E8A246"/></svg>';
  var DESENHO_TIPO = {
    palavra: '<path d="M4 6h16v11H10l-5 4v-4H4z"/><circle cx="8.5" cy="11.5" r=".7" fill="currentColor"/><circle cx="12" cy="11.5" r=".7" fill="currentColor"/><circle cx="15.5" cy="11.5" r=".7" fill="currentColor"/>',
    atencao: '<path d="M2 12c3-5 6.4-7 10-7s7 2 10 7c-3 5-6.4 7-10 7s-7-2-10-7z"/><circle cx="12" cy="12" r="3"/>',
    ajuda: '<path d="M12 20S4 15 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z"/>',
    paciencia: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2"/>'
  };
  function svgTipo(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (DESENHO_TIPO[k] || DESENHO_TIPO.ajuda) + '</svg>'; }

  /* ---------- Tela e navegação entre as vistas ---------- */
  var tela = document.createElement('section');
  tela.className = 'tela t-aulas'; tela.dataset.tela = 'aulas'; tela.setAttribute('aria-label', 'Evangelização'); tela.hidden = true;
  tela.innerHTML = '<div class="au-vista"></div>';
  app.appendChild(tela);
  // O jardim fica atrás de todas as telas (mundo.js).
  var mundo = window.MundoAulas(tela, { G: G, anima: anima, esc: esc, som: som, data: dataCurta, eNoite: function () { return app.classList.contains('noite'); } });
  var svgPlanta = mundo.svgPlanta, svgBrotinho = mundo.svgBrotinho, abriuJardim = false, ultimoPasso = null;
  var vista = $('.au-vista', tela), vistaAtual = null, aoSairDaVista = [];
  var CAMERAS = { inicio: 'jardim', plantio: 'jardim', sala: 'sala' };
  function limpar() { aoSairDaVista.forEach(function (f) { try { f(); } catch (e) {} }); aoSairDaVista = []; pararFala(); }
  function mostrar(html, nome) {
    limpar();
    var antes = vistaAtual; vistaAtual = nome; vista.dataset.vista = nome;
    mundo.camera(CAMERAS[nome] || 'alto');
    if (nome !== 'sala' && nome !== 'plantio') mundo.ceuDoHorario();
    if (nome !== 'sala') ultimoPasso = null;
    vista.innerHTML = html; vista.scrollTop = 0;
    if (!anima || nome === 'sala') return;
    // A folha sobe sobre o jardim; entre uma folha e outra, só troca.
    var folha = !CAMERAS[nome], vinhaDeFolha = antes && !CAMERAS[antes];
    if (folha && !vinhaDeFolha) G.from($('.au-coluna', vista), { y: 60, opacity: 0, duration: .6, ease: 'power3.out', clearProps: 'transform,opacity' });
    else G.fromTo(vista, { opacity: 0 }, { opacity: 1, duration: .3, clearProps: 'opacity' });
  }
  function ao(sel, fn, raiz) { $$(sel, raiz || vista).forEach(function (b) { b.addEventListener('click', fn); }); }
  function topo(titulo, voltar, extra) { return '<div class="au-topo"><button class="au-redondo" data-voltar aria-label="Voltar">' + ICO.voltar + '</button><h2>' + esc(titulo) + '</h2>' + (extra || '') + '</div>'; }
  function carregar() {
    if (DADOS) return Promise.resolve(DADOS);
    return fetch('dados/evangelizacao.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) { DADOS = d; return d; });
  }
  api.aoEntrar.aulas = function () {
    document.body.classList.add('aulas-largo');
    carregar().then(function () { if (!vistaAtual) { if (turma()) verInicio(); else verTurma(true); } }).catch(function () {
      vista.innerHTML = '<div class="au-rolar"><p class="au-titulo" style="margin-top:20vh">Não consegui abrir as aulas.</p><p class="au-sub">Veja a conexão e tente de novo.</p><div class="au-rodape"><button class="au-acao" data-ir="inicio">Voltar</button></div></div>';
    });
  };
  api.aoSair.aulas = function () { document.body.classList.remove('aulas-largo'); pararFala(); };

  /* ---------- Falar em voz alta: para quem ainda não lê ---------- */
  var voz = null, falando = null;
  function escolherVoz() { var vs = speechSynthesis.getVoices(); voz = vs.filter(function (v) { return /^pt[-_]BR/i.test(v.lang); })[0] || vs.filter(function (v) { return /^pt/i.test(v.lang); })[0] || null; }
  if ('speechSynthesis' in window) { try { escolherVoz(); speechSynthesis.addEventListener('voiceschanged', escolherVoz); } catch (e) {} }
  function pararFala() { if ('speechSynthesis' in window) try { speechSynthesis.cancel(); } catch (e) {} if (falando) { falando.setAttribute('aria-pressed', 'false'); falando = null; } }
  function falar(txt, botao, baixinho) {
    if (!('speechSynthesis' in window)) { api.aviso('Este aparelho não lê em voz alta. Leia para a turma.'); return; }
    var mesmo = botao && falando === botao; pararFala(); if (mesmo) return;
    var u = new SpeechSynthesisUtterance(txt); u.lang = 'pt-BR'; u.rate = .92; if (baixinho) u.volume = .5; if (voz) u.voice = voz;
    if (botao) { falando = botao; botao.setAttribute('aria-pressed', 'true'); u.onend = u.onerror = function () { if (falando === botao) { botao.setAttribute('aria-pressed', 'false'); falando = null; } }; }
    speechSynthesis.speak(u);
  }
  function botaoOuvir() { return '<button class="au-ouvir" data-ouvir aria-label="Ouvir em voz alta" aria-pressed="false">' + ICO.ouvir + '</button>'; }

  /* ---------- Da palavra escrita ao tema ---------- */
  var PARADAS = {}; 'a o e de da do das dos em no na nos nas um uma uns umas que se por para com como sobre aula aulas tema assunto hoje quero falar ao aos as os ou sua seu mais'.split(' ').forEach(function (w) { PARADAS[w] = 1; });
  function termos(t) { return normal(t).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2 && !PARADAS[w]; }); }
  function pontuar(q, t) {
    var n = normal(q).trim(), ts = termos(q), s = 0, tit = normal(t.titulo);
    if (tit === n) s += 20; else if (n.length > 3 && tit.indexOf(n) >= 0) s += 10;
    t.palavras.forEach(function (p) {
      p = normal(p);
      if (n === p) s += 12;
      else if (p.indexOf(' ') >= 0 ? n.indexOf(p) >= 0 : ts.indexOf(p) >= 0) s += 6 + p.length / 10;
      else if (p.indexOf(' ') < 0) ts.forEach(function (w) { if (w.length >= 4 && p.length >= 4 && p.slice(0, 5) === w.slice(0, 5)) s += 2.5; });
    });
    return s;
  }
  function parecidos(q) {
    return DADOS.temas.map(function (t) { return { t: t, s: pontuar(q, t) }; }).filter(function (x) { return x.s >= 2.5; }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.t; });
  }
  function delicado(q) {
    var n = ' ' + normal(q) + ' ';
    var d = DADOS.delicados.filter(function (x) { return x.palavras.some(function (p) { return n.indexOf(normal(p)) >= 0; }); })[0];
    return d ? d.aviso : null;
  }
  function temaPorId(id) { return DADOS.temas.filter(function (t) { return t.id === id; })[0]; }
  function faixaDe(t) { return DADOS.faixas.filter(function (f) { return f.id === t.faixa; })[0] || DADOS.faixas[3]; }

  // Assunto sem tema pronto: a aula sai igual, com as atividades que não dependem de texto e trechos achados nas obras.
  function temaAberto(q) {
    return {
      aberta: true, id: null, titulo: q.charAt(0).toUpperCase() + q.slice(1), palavras: [],
      objetivo: 'Conversar sobre “' + q + '” à luz de Jesus e de Kardec, a partir da vida das crianças. Leia os trechos abaixo e ajuste esta aula com as suas palavras.',
      abrir: 'O que vocês já ouviram falar sobre ' + q + '? O que vocês acham que é?',
      historia: null,
      pensar: { jardim: ['Onde a gente vê isso no nosso dia a dia?', 'O que Jesus faria?'], ciclos: ['Onde a gente vê isso no nosso dia a dia?', 'O que Jesus faria numa situação assim?', 'O que dá para fazer nesta semana sobre isso?'] },
      base: [], caminhos: [], semear: null, pares: [], quiz: [],
      encenar: 'Em dupla, mostrem uma cena do dia a dia sobre ' + q + '.',
      desenho: 'Vamos desenhar juntos o que ' + q + ' faz a gente pensar.',
      vivencia: 'Nesta semana, repare em ' + q + ' no seu dia a dia e traga uma coisa para contar no próximo encontro.',
      familia: 'Hoje conversamos sobre ' + q + '. Em casa, perguntem à criança o que ela entendeu e o que ela quer saber mais.',
      seperguntarem: [], material: 'O que você escolher.', dica: 'Escreva ou conte uma história curta, ou escolha uma das prontas. Trate só do que você estudou: se não souber responder, diga que vai pesquisar e traga no próximo encontro.'
    };
  }

  /* ---------- Atividades e roteiro ---------- */
  var JOGOS = {
    semear: { nome: 'Jardim de sementes', d: 'Cada criança leva uma semente ao lugar certo, e a turma vê o canteiro crescer.', sem: 'Sem tablet: escreva as frases em papéis e as crianças colam em dois cartazes.' },
    caminhos: { nome: 'Caminhos', d: 'Uma situação do dia a dia: cada criança escolhe o que fazer e a turma conversa.', sem: 'Sem tablet: leia a situação e peça que as crianças vão para um canto da sala, conforme a escolha.' },
    memoria: { nome: 'Pares da turma', d: 'Jogo da memória em que a turma joga junta, uma criança de cada vez.', sem: 'Sem tablet: faça as cartas em papel e joguem no chão, em roda.' },
    ordem: { nome: 'Recontar a história', d: 'A turma coloca as partes da história na ordem, cada criança uma parte.', sem: 'Sem tablet: escreva as partes em tiras e peça que as crianças se organizem em fila, na ordem.' },
    quiz: { nome: 'A turma responde', d: 'Perguntas sobre a história. Quem tem dúvida pede ajuda à turma.', sem: 'Sem tablet: faça as perguntas em voz alta e deixe que respondam juntas.' },
    mural: { nome: 'Mural da turma', d: 'Desenho coletivo no tablet: cada criança desenha um pouco, e o mural fica guardado.', sem: 'Sem tablet: use uma folha grande de papel e lápis de cor.' },
    encenar: { nome: 'Encenar', d: 'O tablet forma as duplas, e cada dupla encena para a turma.', sem: 'Sem tablet: forme as duplas por sorteio.' }
  };
  var MOMENTOS = {
    chegada: { nome: 'Chegada', d: 'Cada criança toca no seu nome, e a turma se reúne.', min: 5, nota: 'Receba cada criança pelo nome. Deixe que ela toque na própria bolha. Sentir-se bem-vinda faz parte da aula.' },
    missao: { nome: 'Missão surpresa', d: 'Cada criança recebe, em particular, um gesto bom para fazer durante o encontro.', min: 3, nota: 'Cada criança recebe a sua em particular; leia baixinho para quem ainda não lê. Diga a regra em voz alta: é surpresa só para os colegas, adultos de confiança podem saber, e segredo que dá medo a gente sempre conta. Nenhuma missão pede toque. Quem não quiser uma, pode trocar. Se alguém chegar depois, volte à Chegada e inclua a criança: ela recebe uma missão simples.' },
    prece1: { nome: 'Prece de abertura', d: 'Acalmar o coração e orar com palavras simples.', min: 2, nota: 'Uma prece curta, com palavras simples: agradecer e pedir ajuda para aprender. Pode ser você ou uma criança que queira. Ninguém é obrigado.' },
    lembrar: { nome: 'Da última vez', d: 'Lembrar o encontro anterior e a tarefa da semana.', min: 4, nota: 'Sem cobrança: quem não conseguiu pode tentar de novo. Cada criança que conseguiu acende um vaga-lume no jardim da turma.' },
    abrir: { nome: 'Da vida para a lição', d: 'Uma conversa que parte do dia a dia das crianças.', min: 5, nota: 'Comece pela vida delas: é o caminho que o Currículo da FEB propõe, inspirado em Jesus. Escute mais do que fale, e deixe a roda escolher quem responde.' },
    historia: { nome: 'História', d: 'A história do dia, contada por você ou lida pelo tablet.', min: 10, nota: 'Prefira contar com as suas palavras, olhando para as crianças. Use a voz e as pausas. A tela ajuda, mas quem conta é você.' },
    pensar: { nome: 'Pensar juntos', d: 'Perguntas para conversar, como Kardec fazia.', min: 7, nota: 'A FEB pede encontros “instigando perguntas, mais do que oferecendo respostas”. Não há resposta errada numa conversa. Se não souber algo, guarde a pergunta na caixinha e traga no próximo encontro.' },
    jogo: { nome: 'Brincar e aprender', d: '', min: 12, nota: 'A turma joga junta e todos ganham: a FEB recomenda jogos cooperativos. Enquanto uma criança está com o tablet, as outras ajudam. Elogie a ajuda, e não o acerto.' },
    expressao: { nome: 'Mão na massa', d: '', min: 10, nota: 'Aqui a criança mostra o que entendeu. Vale o processo, e não um resultado bonito.' },
    vivencia: { nome: 'Para a semana', d: 'A tarefa da semana e o recado para as famílias.', min: 3, nota: 'Envie o recado para as famílias: a evangelização continua em casa. O recado não leva nome de nenhuma criança.' },
    bem: { nome: 'O bem que vimos', d: 'Cada um conta o bem que viu, e nunca o que fez.', min: 3, nota: 'Aqui cada um conta o bem que viu: é fazer o bem sem ostentação (O Evangelho segundo o Espiritismo, cap. XIII). Não pergunte quem cumpriu a missão, nem mostre quem não cumpriu. O silêncio é um instante para cada um olhar para dentro (O Livro dos Espíritos, questão 919). A surpresa termina hoje: quem quiser pode contar.' },
    prece2: { nome: 'Prece final', d: 'Agradecer e plantar a semente de hoje no jardim.', min: 2, nota: 'Agradeça pelo encontro. Depois a turma planta a semente de hoje no jardim: é o que elas vão reencontrar na próxima semana.' }
  };
  function ultimaAula(t) { return t.aulas[t.aulas.length - 1] || null; }
  function jogosPossiveis(tema, faixa) {
    var l = [];
    if (tema.semear) l.push('semear');
    if (tema.caminhos.length) l.push('caminhos');
    if (tema.pares.length) l.push('memoria');
    if (tema.quiz.length) l.push('quiz');
    if (tema.historia && faixa !== 'jardim') l.push('ordem');
    // Assunto sem tema pronto: encenar e desenhar servem para qualquer assunto.
    if (!l.length) l.push('encenar');
    return l;
  }
  // Variar: a FEB e os roteiros de aula pedem para não repetir sempre a mesma técnica com as mesmas crianças.
  function menosUsado(lista, t, campo) {
    var usos = {}; t.aulas.forEach(function (a, i) { if (a[campo]) usos[a[campo]] = i + 1; });
    return lista.slice().sort(function (a, b) { return (usos[a] || 0) - (usos[b] || 0); })[0] || null;
  }
  function roteiro(a, t) {
    var l = ['chegada']; if (a.missao) l.push('missao'); l.push('prece1'); if (ultimaAula(t)) l.push('lembrar');
    l.push('abrir', 'historia', 'pensar'); if (a.jogo) l.push('jogo'); l.push('expressao', 'vivencia'); if (a.missao) l.push('bem'); l.push('prece2');
    var soma = l.reduce(function (s, k) { return s + MOMENTOS[k].min; }, 0);
    return l.map(function (k) { return { k: k, min: Math.max(1, Math.round(MOMENTOS[k].min * a.dur / soma)) }; });
  }
  function novaAula(pedido, tema, parecidosL) {
    var t = turma(), f = t.faixa;
    var jogos = jogosPossiveis(tema, f);
    return { pedido: pedido || '', temaId: tema.id, aberto: tema.aberta ? tema : null, dur: t.dur || 60, jogo: menosUsado(jogos, t, 'jogo'), expressao: menosUsado(['mural', 'encenar'], t, 'expressao'), parecidos: (parecidosL || []).map(function (x) { return x.id; }), aviso: pedido ? delicado(pedido) : null, presentes: [], minhaHistoria: '', historiaDe: null, missao: qualMissaoHoje(t), missaoProf: sortearMissaoProf(), dadas: {}, amigos: null, gestos: 0 };
  }
  function temaDaAula(a) { return a.aberto || temaPorId(a.temaId); }
  function historiaDaAula(a, t) {
    var h = temaDaAula(a).historia, faixa = faixaDe(t).historia;
    if (a.minhaHistoria) return a.minhaHistoria.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (a.historiaDe) h = temaPorId(a.historiaDe).historia;
    return h ? h[faixa] : null;
  }
  function perguntasDaAula(a, t) {
    var p = temaDaAula(a).pensar;
    if (t.faixa === 'jardim') return p.jardim;
    if (t.faixa === 'mista') return p.jardim.slice(0, 1).concat(p.ciclos);
    return p.ciclos;
  }

  /* ---------- Início: o jardim da turma ---------- */
  function saudacao() { var h = new Date().getHours(); return app.classList.contains('noite') ? 'Boa noite!' : h < 12 ? 'Bom dia!' : h < 18 ? 'Boa tarde!' : 'Olá!'; }
  function verInicio(novaPlanta) {
    var t = turma(); if (!t) return verTurma(true);
    var feitos = {}; t.aulas.forEach(function (a) { if (a.tema) feitos[a.tema] = 1; });
    var prox = DADOS.temas.filter(function (x) { return !feitos[x.id]; })[0];
    var abertas = t.perguntas.filter(function (p) { return !p.feita; }).length, n = t.aulas.length;
    var sug = ['Perdão', 'Brigas em casa', 'Mentira', 'Saudade da vovó'];
    function chips() { return sug.map(function (x) { return '<button class="au-pilula" data-sug="' + esc(x) + '">' + esc(x) + '</button>'; }).join(''); }
    var tabua = t.andamento
      ? '<button class="au-tabua a" data-retomar><small>Encontro em andamento</small><b>' + esc(temaDaAula(t.andamento.aula).titulo) + '</b></button>'
      : prox ? '<button class="au-tabua a" data-tema="' + prox.id + '"><small>Próximo tema</small><b>' + esc(prox.titulo) + '</b></button>' : '';
    mundo.plantas(t, novaPlanta);
    mostrar('<div class="au-casa">' +
      '<div class="au-topo"><button class="au-redondo" data-sair aria-label="Voltar ao início do app">' + ICO.voltar + '</button><span class="au-marca">Evangelização</span><button class="au-pilula" data-ver="turma">' + esc(t.nome) + ', ' + esc(faixaDe(t).nome) + '</button></div>' +
      '<div class="au-casa-ceu"><h1 class="au-titulo">' + saudacao() + ' Sobre o que será o encontro?</h1>' +
      '<form class="au-busca" id="au-form"><input id="au-assunto" type="text" enterkeyhint="go" autocomplete="off" placeholder="Escreva o assunto: perdão, inveja, um bebê…" aria-label="Assunto do encontro"><button class="au-acao" type="submit">Montar a aula</button></form>' +
      '<div class="au-sugestoes" id="au-sug">' + chips() + '</div></div>' +
      '<div class="au-casa-chao">' +
      '<div class="au-objetos">' +
      '<div class="au-brotinho-caixa"><p class="au-fala" id="au-fala" role="status" hidden></p><button class="au-brotinho" id="au-brt" aria-label="Falar com o Brotinho">' + svgBrotinho() + '</button></div>' +
      '<button class="au-obj" data-ver="mural"><svg viewBox="0 0 120 150" aria-hidden="true" id="au-cavalete"><g stroke="#A8784A" stroke-width="7" stroke-linecap="round"><path d="M44 70 L24 146"/><path d="M76 70 L96 146"/><path d="M60 8 V132"/></g><rect x="24" y="96" width="72" height="7" rx="3.5" fill="#8F643C"/><rect x="20" y="14" width="80" height="82" rx="4" fill="#FFFDF6" stroke="#D8C7A6" stroke-width="2.5"/><g id="au-rabisco"><circle cx="42" cy="36" r="10" fill="#F7C948"/><path d="M26 80 C 40 64, 52 66, 62 74 C 72 62, 86 62, 96 76 V 92 H 24 Z" fill="#A9CE6A"/><path d="M70 74 V 52" stroke="#5F9A40" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="46" r="4.6" fill="#F2A0B4"/><circle cx="77" cy="50" r="4.6" fill="#F2A0B4"/><circle cx="74.6" cy="58" r="4.6" fill="#F2A0B4"/><circle cx="65.4" cy="58" r="4.6" fill="#F2A0B4"/><circle cx="63" cy="50" r="4.6" fill="#F2A0B4"/><circle cx="70" cy="52" r="4" fill="#F9D65F"/></g></svg><span>Mural</span></button>' +
      '<button class="au-obj' + (abertas ? ' tem' : '') + '" data-ver="caixinha" aria-label="Caixinha de perguntas' + (abertas ? ', ' + abertas + (abertas === 1 ? ' pergunta esperando' : ' perguntas esperando') : '') + '"><svg viewBox="0 0 120 150" aria-hidden="true"><rect x="53" y="76" width="14" height="72" rx="4" fill="#A8784A"/><path d="M16 82 V50 C16 30 34 20 60 20 C86 20 104 30 104 50 V82 Z" fill="#4F8FC0"/><path d="M16 50 C16 30 34 20 60 20 C76 20 88 24 96 31 C 78 26 34 28 16 58 Z" fill="#7DB2DC" opacity=".6"/><rect x="26" y="50" width="50" height="9" rx="4.5" fill="#2E5F88"/>' + (abertas ? '<path d="M34 54 h34 v-22 h-34 z" fill="#FFF6E3" stroke="#E8C68E" stroke-width="1.5"/><path d="M34 32 L51 44 L68 32" fill="none" stroke="#E8C68E" stroke-width="1.5"/><rect x="26" y="54" width="50" height="5" rx="2.5" fill="#2E5F88"/>' : '') + '<g class="au-bandeira"><rect x="96" y="28" width="5" height="44" rx="2" fill="#8C6239"/><path d="M99 28 h19 v13 h-19 z" fill="#F4B63F"/></g></svg>' + (abertas ? '<em class="au-num">' + abertas + '</em>' : '') + '<span>Caixinha</span></button>' +
      '<button class="au-obj" data-ver="diario"><svg viewBox="0 0 130 118" aria-hidden="true"><path d="M20 72 V102 C20 112 110 112 110 102 V72" fill="#9A6D44"/><path d="M34 80 V106 M58 84 V110 M84 84 V108" stroke="#7E5736" stroke-width="3" stroke-linecap="round"/><ellipse cx="65" cy="72" rx="45" ry="14" fill="#E4C08C"/><ellipse cx="65" cy="72" rx="30" ry="8.6" fill="none" stroke="#C49A62" stroke-width="2"/><path d="M65 64 C52 54 34 50 18 54 L24 24 C40 20 56 24 65 32 Z" fill="#FFFBF0" stroke="#D8C7A6" stroke-width="2"/><path d="M65 64 C78 54 96 50 112 54 L106 24 C90 20 74 24 65 32 Z" fill="#FFF6E3" stroke="#D8C7A6" stroke-width="2"/><path d="M65 32 V64" stroke="#C69A68" stroke-width="2.4"/><g stroke="#C9B58F" stroke-width="2.4" stroke-linecap="round"><path d="M31 33 C40 31 49 33 56 37"/><path d="M29 43 C38 41 48 43 56 47"/><path d="M99 33 C90 31 81 33 74 37"/><path d="M101 43 C92 41 82 43 74 47"/></g></svg><span>Diário</span></button>' +
      '</div>' +
      '<div class="au-placa"><i class="au-poste"></i>' + tabua + '<button class="au-tabua b" data-ver="programa"><b>Programa do ano</b></button></div>' +
      '</div></div>', 'inicio');
    ao('[data-sair]', function () { api.irA('inicio'); });
    ao('[data-ver]', function (e) { abrirVista(e.currentTarget.dataset.ver); });
    ao('[data-tema]', function (e) { var x = temaPorId(e.currentTarget.dataset.tema); verPlano(novaAula('', x, [])); });
    ao('[data-retomar]', function () { verSala(); });
    var campo = $('#au-assunto'), caixa = $('#au-sug'), brt = $('#au-brt'), fala = $('#au-fala'), tmFala = 0, tmPulo = 0;
    function ligarSug() { ao('[data-sug]', function (e) { e.preventDefault(); montarPeloTexto(e.currentTarget.dataset.sug); }, caixa); ao('[data-id]', function (e) { e.preventDefault(); verPlano(novaAula(campo.value.trim(), temaPorId(e.currentTarget.dataset.id), parecidos(campo.value))); }, caixa); }
    ligarSug();
    // Enquanto escreve, aparecem os temas que combinam, e o Brotinho comemora quando acha algum.
    campo.addEventListener('input', function () {
      var q = campo.value.trim();
      if (q.length < 3) { caixa.innerHTML = chips(); ligarSug(); return; }
      var ps = parecidos(q).slice(0, 4);
      caixa.innerHTML = ps.length ? ps.map(function (x) { return '<button class="au-pilula b" data-id="' + x.id + '">' + esc(x.titulo) + '</button>'; }).join('') : '<span class="au-sub">Sem tema pronto: monto a aula procurando “' + esc(q) + '” nas obras.</span>';
      ligarSug();
      if (ps.length) { clearTimeout(tmPulo); tmPulo = setTimeout(function () { mundo.pular(brt); }, 250); }
    });
    $('#au-form').addEventListener('submit', function (e) { e.preventDefault(); var q = campo.value.trim(); if (!q) { campo.focus(); return; } montarPeloTexto(q); });
    // O que o Brotinho diz: sempre sobre o jardim, nunca sobre doutrina.
    function dizer(txt) { fala.textContent = txt; fala.hidden = false; clearTimeout(tmFala); tmFala = setTimeout(function () { fala.hidden = true; }, 4800); }
    var falas = ['Que bom ter você aqui!', n ? 'Toque numa planta para lembrar do encontro.' : 'Nosso jardim começa no primeiro encontro.', n ? 'O jardim da turma tem ' + n + (n === 1 ? ' planta.' : ' plantas.') : 'Escreva um assunto ali em cima.'], iFala = 0;
    brt.addEventListener('click', function () { mundo.pular(brt); som('suave'); dizer(falas[iFala++ % falas.length]); });
    aoSairDaVista.push(function () { clearTimeout(tmFala); clearTimeout(tmPulo); });
    // O último desenho da turma aparece no cavalete.
    lerMural().then(function (l) {
      l = l.filter(function (d) { return d.turma === t.id; }); var ult = l[l.length - 1], cv = $('#au-cavalete'); if (!ult || !cv) return;
      var r = $('#au-rabisco', cv); if (r) r.remove();
      var im = document.createElementNS('http://www.w3.org/2000/svg', 'image'); im.setAttribute('href', ult.img); im.setAttribute('x', '22'); im.setAttribute('y', '16'); im.setAttribute('width', '76'); im.setAttribute('height', '78'); im.setAttribute('preserveAspectRatio', 'xMidYMid slice'); cv.appendChild(im);
    }).catch(function () {});
    // A abertura acontece uma vez: o jardim sobe, as plantas brotam, os objetos chegam.
    if (novaPlanta) { mundo.pular(brt); dizer('Que planta bonita! Até o próximo encontro.'); }
    else if (!abriuJardim) { dizer(falas[1]); }
    if (!abriuJardim && anima) {
      mundo.entrada();
      G.from('.au-casa-ceu > *', { y: 16, opacity: 0, duration: .7, ease: 'power3.out', stagger: .08, delay: .3, clearProps: 'transform,opacity' });
      G.from('.au-brotinho, .au-obj, .au-placa', { y: 34, opacity: 0, duration: .7, ease: 'back.out(1.6)', stagger: .07, delay: .55, clearProps: 'transform,opacity' });
    }
    abriuJardim = true;
  }
  function montarPeloTexto(q) {
    var ps = parecidos(q);
    if (ps.length) { som('revelacao'); verPlano(novaAula(q, ps[0], ps.slice(1, 4))); return; }
    var aula = novaAula(q, temaAberto(q), []);
    verPlano(aula);
  }
  function abrirVista(n) { ({ turma: verTurma, programa: verPrograma, caixinha: verCaixinha, mural: verMural, diario: verDiario })[n](); }

  /* ---------- A turma ---------- */
  function verTurma(primeira) {
    primeira = primeira === true;
    var t = primeira ? null : turma();
    var nomes = t ? t.criancas.slice() : [], faixa = t ? t.faixa : 'mista';
    mostrar('' +
      (primeira ? '<div class="au-topo"><button class="au-redondo" data-sair aria-label="Voltar">' + ICO.voltar + '</button><h2>Evangelização</h2></div>' : topo('A turma')) +
      '<div class="au-rolar"><div class="au-coluna">' +
      (primeira ? '<h1 class="au-titulo">Vamos conhecer a sua turma</h1><p class="au-sub" style="margin-top:8px">É rápido, e fica guardado para os próximos encontros. Depois é só escrever o assunto, e a aula fica pronta.</p>' : '') +
      '<label class="au-campo">Nome da turma<input id="au-t-nome" type="text" maxlength="40" value="' + esc(t ? t.nome : 'Minha turma') + '"></label>' +
      '<div class="au-campo">Idade das crianças (ciclos do Currículo da FEB)<div class="au-escolhas" id="au-t-faixa">' + DADOS.faixas.map(function (f) { return '<button class="au-pilula" data-f="' + f.id + '" aria-pressed="' + (f.id === faixa) + '"><span>' + esc(f.nome) + '<small>' + esc(f.idade) + '</small></span></button>'; }).join('') + '</div></div>' +
      '<label class="au-campo">Nomes das crianças<input id="au-t-add" type="text" maxlength="60" enterkeyhint="done" placeholder="Escreva o nome e toque em Incluir"></label>' +
      '<div class="au-rodape" style="margin-top:8px"><button class="au-pilula b" id="au-t-incluir">Incluir</button></div>' +
      '<div class="au-nomes" id="au-t-nomes"></div>' +
      '<p class="au-aviso-suave">Use só o primeiro nome. Os nomes ficam neste aparelho e não vão para a internet. Pode deixar para depois: a aula funciona sem nomes.</p>' +
      '<div class="au-rodape"><button class="au-acao" id="au-t-ok">' + (primeira ? 'Pronto, vamos lá' : 'Guardar') + '</button></div>' +
      (!primeira ? '<h3 class="au-sec">Amigo do bem</h3><p class="au-sub">Duplas que não devem sair juntas no sorteio.</p><div class="au-escolhas" style="align-items:center"><select class="au-sel" id="au-ev-a" aria-label="Primeira criança"></select><select class="au-sel" id="au-ev-b" aria-label="Segunda criança"></select><button class="au-pilula b" id="au-ev-add">Incluir</button></div><div class="au-nomes" id="au-ev-lista"></div>' : '') +
      (!primeira ? '<h3 class="au-sec">Outras turmas</h3><ul class="au-lista">' + S.turmas.map(function (x) { return '<li><span class="txt">' + esc(x.nome) + '<small>' + esc(faixaDe(x).nome) + ' · ' + x.aulas.length + ' encontros</small></span>' + (x.id === t.id ? '<span class="au-sub">Esta</span>' : '<button class="au-pilula" data-trocar="' + x.id + '">Abrir</button>') + '</li>'; }).join('') + '</ul><div class="au-rodape"><button class="au-pilula b" id="au-t-nova">Criar outra turma</button>' + (S.turmas.length > 1 ? '<button class="au-pilula" id="au-t-apagar">Apagar esta turma</button>' : '') + '</div>' : '') +
      '</div></div>', 'turma');
    var evitar = t ? (t.evitar || []).slice() : [];
    function desenharDuplas() {
      var sa = $('#au-ev-a'); if (!sa) return;
      var op = nomes.map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
      sa.innerHTML = op; $('#au-ev-b').innerHTML = op;
      $('#au-ev-lista').innerHTML = evitar.map(function (d, i) { return '<span class="au-nome">' + esc(d[0]) + ' e ' + esc(d[1]) + '<button data-ev="' + i + '" aria-label="Tirar esta dupla">' + ICO.apagar + '</button></span>'; }).join('');
      ao('[data-ev]', function (e) { evitar.splice(+e.currentTarget.dataset.ev, 1); desenharDuplas(); }, $('#au-ev-lista'));
    }
    function desenharNomes() {
      $('#au-t-nomes').innerHTML = nomes.map(function (n, i) { return '<span class="au-nome">' + esc(n) + '<button data-tirar="' + i + '" aria-label="Tirar ' + esc(n) + '">' + ICO.apagar + '</button></span>'; }).join('');
      ao('[data-tirar]', function (e) { nomes.splice(+e.currentTarget.dataset.tirar, 1); desenharNomes(); }, $('#au-t-nomes'));
      desenharDuplas();
    }
    function incluir() { var c = $('#au-t-add'); c.value.split(/[,;\n]+/).forEach(function (n) { n = n.trim(); if (n && nomes.indexOf(n) < 0) nomes.push(n); }); c.value = ''; desenharNomes(); }
    desenharNomes();
    ao('[data-voltar]', function () { verInicio(); });
    ao('[data-sair]', function () { api.irA('inicio'); });
    ao('[data-f]', function (e) { faixa = e.currentTarget.dataset.f; $$('[data-f]', vista).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === faixa); }); });
    $('#au-t-incluir').addEventListener('click', incluir);
    var addDupla = $('#au-ev-add');
    if (addDupla) addDupla.addEventListener('click', function () {
      var x = $('#au-ev-a').value, y = $('#au-ev-b').value;
      if (!x || !y || x === y) { api.aviso('Escolha duas crianças diferentes.'); return; }
      if (!evitar.some(function (d) { return (d[0] === x && d[1] === y) || (d[0] === y && d[1] === x); })) evitar.push([x, y]);
      desenharDuplas();
    });
    $('#au-t-add').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); incluir(); } });
    $('#au-t-ok').addEventListener('click', function () {
      incluir();
      var nome = $('#au-t-nome').value.trim() || 'Minha turma';
      if (t) { t.nome = nome; t.faixa = faixa; t.criancas = nomes; t.evitar = evitar.filter(function (d) { return nomes.indexOf(d[0]) >= 0 && nomes.indexOf(d[1]) >= 0; }); }
      else { t = { id: 't' + Date.now(), nome: nome, faixa: faixa, criancas: nomes, aulas: [], perguntas: [], vagalumes: 0, andamento: null, dur: 60 }; S.turmas.push(t); S.atual = t.id; }
      gravar(); verInicio();
    });
    ao('[data-trocar]', function (e) { S.atual = e.currentTarget.dataset.trocar; gravar(); verInicio(); });
    var nv = $('#au-t-nova'); if (nv) nv.addEventListener('click', function () { verTurma(true); });
    var ap = $('#au-t-apagar'); if (ap) ap.addEventListener('click', function () {
      if (!window.confirm('Apagar a turma "' + t.nome + '", com o jardim e o diário? Isto não pode ser desfeito.')) return;
      S.turmas = S.turmas.filter(function (x) { return x.id !== t.id; }); S.atual = S.turmas[0].id; gravar(); verInicio();
    });
  }

  /* ---------- Preparar: a aula montada ---------- */
  function verPlano(a) {
    var t = turma(), tema = temaDaAula(a), jogos = jogosPossiveis(tema, t.faixa);
    a.jogo = a.jogo && jogos.indexOf(a.jogo) >= 0 ? a.jogo : menosUsado(jogos, t, 'jogo');
    if (a.jogo === 'encenar') a.expressao = 'mural';
    var m = roteiro(a, t);
    var naMao = m.reduce(function (s, x) { return s + ((x.k === 'chegada' || x.k === 'missao' || x.k === 'jogo' || (x.k === 'expressao' && a.expressao === 'mural')) ? x.min : 0); }, 0);
    var pend = t.perguntas.filter(function (p) { return !p.feita; });
    var seP = tema.seperguntarem || [];
    mostrar(topo('Preparar o encontro') +
      '<div class="au-rolar"><div class="au-coluna">' +
      '<h1 class="au-titulo">' + esc(tema.titulo) + '</h1>' +
      '<p class="au-sub" style="margin-top:6px">' + esc(t.nome) + ' · ' + esc(faixaDe(t).nome) + ', ' + esc(faixaDe(t).idade) + (tema.unidade ? ' · Currículo da FEB, ' + esc(tema.unidade) : '') + '</p>' +
      (a.parecidos.length ? '<div class="au-sugestoes"><span class="au-sub" style="align-self:center">Também combina:</span>' + a.parecidos.map(function (id) { return '<button class="au-pilula b" data-outro="' + id + '">' + esc(temaPorId(id).titulo) + '</button>'; }).join('') + '</div>' : '') +
      (a.aviso ? '<div class="au-delicado"><b>Com cuidado:</b> ' + esc(a.aviso) + '</div>' : '') +
      '<p style="margin-top:14px;line-height:1.5"><b>O que queremos:</b> ' + esc(tema.objetivo) + '</p>' +
      '<div class="au-campo">Quanto tempo você tem?<div class="au-escolhas">' + [45, 60, 90].map(function (d) { return '<button class="au-pilula" data-dur="' + d + '" aria-pressed="' + (a.dur === d) + '">' + d + ' minutos</button>'; }).join('') + '</div></div>' +
      '<h3 class="au-sec">O roteiro</h3><ol class="au-trilho">' + m.map(function (x) {
        var M = MOMENTOS[x.k], nome = M.nome, d = M.d, troca = '';
        if (x.k === 'jogo') { nome = JOGOS[a.jogo].nome; d = JOGOS[a.jogo].d; if (jogos.length > 1) troca = '<button class="au-pilula" data-trocar-jogo>Trocar por outra brincadeira</button>'; }
        if (x.k === 'missao') {
          if (a.missao === 'amigo') { nome = 'Amigo do bem'; d = 'Cada criança cuida de outra, sorteada em roda, e ninguém fica de fora. Só quem recebe vê o nome.'; }
          troca = (podeAmigo(t) ? '<button class="au-pilula" data-missao-tipo>' + (a.missao === 'amigo' ? 'Trocar por Missão surpresa' : 'Trocar por Amigo do bem') + '</button> ' : '') + '<button class="au-pilula" data-missao-tirar>Tirar deste encontro</button>';
        }
        if (x.k === 'expressao') { nome = JOGOS[a.expressao].nome; d = JOGOS[a.expressao].d; if (a.jogo !== 'encenar') troca = '<button class="au-pilula" data-trocar-exp>Trocar por ' + esc(JOGOS[a.expressao === 'mural' ? 'encenar' : 'mural'].nome) + '</button>'; }
        return '<li><span class="au-min' + (x.k === 'jogo' || x.k === 'expressao' ? ' jogo' : '') + '">' + x.min + '<br>min</span><div><h4>' + esc(nome) + '</h4><p>' + esc(d) + '</p>' + troca + '</div></li>';
      }).join('') + '</ol>' +
      (a.missao ? '' : '<div class="au-rodape" style="margin-top:6px"><button class="au-pilula b" data-missao-por>Incluir a Missão surpresa hoje</button><span class="au-sub">Ela está prevista para 2 encontros por mês.</span></div>') +
      '<p class="au-aviso-suave">O tablet fica nas mãos das crianças por cerca de ' + naMao + ' dos ' + a.dur + ' minutos. No resto, a turma olha para você, e não para a tela. Os minutos são uma sugestão: a FEB não fixa uma duração.</p>' +
      (tema.aberta ? '<h3 class="au-sec">A história</h3><p class="au-sub">Escreva a sua, em poucos parágrafos, ou use uma pronta:</p>' +
        '<label class="au-campo"><textarea id="au-minha" rows="5" placeholder="Era uma vez…">' + esc(a.minhaHistoria) + '</textarea></label>' +
        '<details class="au-det"><summary>Escolher uma história pronta' + (a.historiaDe ? ': ' + esc(temaPorId(a.historiaDe).titulo) : '') + '</summary><div class="au-sugestoes">' + DADOS.temas.map(function (x) { return '<button class="au-pilula" data-hist="' + x.id + '" aria-pressed="' + (a.historiaDe === x.id) + '">' + esc(x.titulo) + '</button>'; }).join('') + '</div></details>' +
        '<h3 class="au-sec">Sementes para o jogo (se quiser)</h3><p class="au-sub">Uma por linha. Com pelo menos duas em cada, entra o Jardim de sementes.</p>' +
        '<label class="au-campo">Atitudes que ajudam<textarea id="au-sim" rows="3">' + esc((tema.semear ? tema.semear.sim : []).join('\n')) + '</textarea></label>' +
        '<label class="au-campo">Atitudes que atrapalham<textarea id="au-nao" rows="3">' + esc((tema.semear ? tema.semear.nao : []).join('\n')) + '</textarea></label>' : '') +
      '<h3 class="au-sec">Para você estudar antes</h3>' +
      (a.missao ? '<p style="line-height:1.5"><b>A sua missão de hoje:</b> ' + esc(a.missaoProf) + ' <button class="au-pilula" data-prof>Trocar</button></p>' : '') +
      (tema.dica ? '<p style="line-height:1.5"><b>Para contar:</b> ' + esc(tema.dica) + '</p>' : '') +
      '<p style="line-height:1.5;margin-top:8px"><b>Material:</b> ' + esc(tema.material) + '</p>' +
      '<div id="au-base">' + tema.base.map(baseHtml).join('') + '</div>' +
      '<div class="au-rodape" style="margin-top:8px"><button class="au-pilula b" id="au-mais">' + (tema.aberta ? 'Procurar nas obras' : 'Procurar mais nas obras') + '</button></div><div id="au-achados"></div>' +
      (seP.length ? '<h3 class="au-sec">Se perguntarem…</h3>' + seP.map(function (q) { return '<details class="au-det"><summary>' + esc(q.p) + '</summary><p style="line-height:1.5;margin:0 0 8px">' + esc(q.r) + '</p></details>'; }).join('') : '') +
      (pend.length ? '<h3 class="au-sec">Da caixinha de perguntas</h3><ul class="au-lista">' + pend.slice(0, 4).map(function (p) { return '<li><span class="txt">' + esc(p.t) + '</span></li>'; }).join('') + '</ul><div class="au-rodape"><button class="au-pilula" data-ver-caixa>Abrir a caixinha</button></div>' : '') +
      '<p class="au-revisao">' + esc(DADOS.status) + '</p>' +
      '<div class="au-fim-plano"><button class="au-acao" id="au-comecar">Começar o encontro</button></div>' +
      '</div></div>', 'plano');
    function guardarEdicoes() {
      if (!tema.aberta) return;
      var mh = $('#au-minha'); a.minhaHistoria = mh ? mh.value.trim() : '';
      var sim = linhas('#au-sim'), nao = linhas('#au-nao');
      tema.semear = sim.length >= 2 && nao.length >= 2 ? { rotulos: ['Ajuda', 'Atrapalha'], sim: sim, nao: nao } : null;
    }
    function linhas(s) { var e = $(s); return e ? e.value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean) : []; }
    function redesenhar() { var y = $('.au-rolar', vista).scrollTop; guardarEdicoes(); verPlano(a); $('.au-rolar', vista).scrollTop = y; }
    ao('[data-voltar]', function () { verInicio(); });
    ao('[data-outro]', function (e) { var x = temaPorId(e.currentTarget.dataset.outro), novos = [a.temaId].concat(a.parecidos.filter(function (i) { return i !== x.id; })).filter(Boolean); var b = novaAula(a.pedido, x, []); b.parecidos = novos; b.dur = a.dur; verPlano(b); });
    ao('[data-dur]', function (e) { a.dur = +e.currentTarget.dataset.dur; t.dur = a.dur; gravar(); redesenhar(); });
    ao('[data-trocar-jogo]', function () { a.jogo = jogos[(jogos.indexOf(a.jogo) + 1) % jogos.length]; redesenhar(); });
    ao('[data-trocar-exp]', function () { a.expressao = a.expressao === 'mural' ? 'encenar' : 'mural'; redesenhar(); });
    ao('[data-hist]', function (e) { a.historiaDe = a.historiaDe === e.currentTarget.dataset.hist ? null : e.currentTarget.dataset.hist; redesenhar(); });
    ao('[data-ver-caixa]', function () { verCaixinha(); });
    ao('[data-missao-tipo]', function () { a.missao = a.missao === 'amigo' ? 'simples' : 'amigo'; a.amigos = null; a.dadas = {}; redesenhar(); });
    ao('[data-missao-tirar]', function () { a.missao = null; redesenhar(); });
    ao('[data-missao-por]', function () { a.missao = 'simples'; redesenhar(); });
    ao('[data-prof]', function () { a.missaoProf = sortearMissaoProf(a.missaoProf); redesenhar(); });
    ligarBase($('#au-base'), tema);
    var mais = $('#au-mais');
    function procurar() {
      mais.disabled = true; mais.textContent = 'Procurando nas obras…';
      api.buscar(a.pedido || tema.titulo, 5).then(function (us) {
        mais.hidden = true; var c = $('#au-achados');
        c.innerHTML = us.length ? us.map(function (u, i) { return '<div class="au-achado"><small>' + esc(u.ref) + '</small><p>' + esc(cortar(u.txt, 360)) + '</p><button class="au-pilula" data-abrir="' + i + '">Abrir no livro</button></div>'; }).join('') : '<p class="au-sub">Não achei esse assunto nas obras. Tente com outra palavra.</p>';
        ao('[data-abrir]', function (e) { var u = us[+e.currentTarget.dataset.abrir]; api.abrirLivro(u.l, u.c, u.b, 'aulas'); }, c);
      }).catch(function () { mais.disabled = false; mais.textContent = 'Tentar de novo'; api.aviso('Não consegui abrir os livros agora.'); });
    }
    mais.addEventListener('click', procurar);
    if (tema.aberta && !$('#au-achados').children.length && a.pedido) procurar();
    $('#au-comecar').addEventListener('click', function () {
      guardarEdicoes();
      var js = jogosPossiveis(tema, t.faixa); if (js.indexOf(a.jogo) < 0) a.jogo = js[0];
      t.andamento = { aula: a, i: 0, inicio: Date.now(), estado: {} }; gravar(); som('revelacao'); verSala();
    });
  }
  function baseHtml(b, i) { return '<div class="au-cit">“' + esc(b.cit) + '”<small>' + esc(b.ref) + '</small><button class="au-pilula" data-base="' + i + '">Abrir no livro</button></div>'; }
  function ligarBase(raiz, tema) { ao('[data-base]', function (e) { var b = tema.base[+e.currentTarget.dataset.base]; api.abrirItem(b.obra, b.cap, b.n, 'aulas'); }, raiz); }

  /* ---------- O encontro ---------- */
  var filaAtual = null;
  // A vez: cada criança uma vez, sem repetir até dar a volta.
  function Fila(nomes) {
    var ordem = embaralhar(nomes), i = -1;
    return { vazia: !nomes.length, atual: function () { return i < 0 ? this.proxima() : ordem[i]; }, proxima: function () { if (!ordem.length) return null; i++; if (i >= ordem.length) { ordem = embaralhar(nomes); i = 0; } return ordem[i]; }, olhar: function () { if (!ordem.length) return null; return ordem[(i + 1) % ordem.length]; } };
  }
  function presentes() { var t = turma(), a = t.andamento.aula; return a.presentes.length ? a.presentes : t.criancas; }
  function vezHtml(nome) { return nome ? '<span class="au-vez">Vez de ' + esc(nome) + '</span>' : '<span class="au-vez">Vez da próxima criança</span>'; }

  function verSala() {
    var t = turma(); if (!t.andamento) return verInicio();
    var and = t.andamento, a = and.aula, m = roteiro(a, t), tema = temaDaAula(a);
    if (and.i >= m.length) and.i = m.length - 1;
    filaAtual = Fila(presentes());
    var i = and.i, atual = m[i], M = MOMENTOS[atual.k], crianca = atual.k === 'missao' || atual.k === 'jogo' || (atual.k === 'expressao' && a.expressao === 'mural');
    var estreito = window.matchMedia('(max-width: 880px), (orientation: portrait)').matches;
    var prox = m[i + 1];
    mostrar('' +
      '<div class="au-barra"><button class="au-redondo" id="au-pausar" aria-label="Pausar o encontro">' + ICO.fechar + '</button>' +
      '<div class="au-passos" role="progressbar" aria-valuemin="0" aria-valuemax="' + m.length + '" aria-valuenow="' + (i + 1) + '" aria-label="Momento ' + (i + 1) + ' de ' + m.length + '">' + m.map(function (_, k) { return '<i class="' + (k < i ? 'feito' : k === i ? 'agora' : '') + '"></i>'; }).join('') + '<span class="au-brt-passo" aria-hidden="true">' + svgBrotinho() + '</span></div>' +
      '<span class="au-relogio" id="au-relogio">' + atual.min + ' min</span>' +
      '<button class="au-redondo" id="au-guardar" aria-label="Guardar uma pergunta das crianças">' + ICO.pergunta + '</button>' +
      '<button class="au-redondo" id="au-guia" aria-label="Como conduzir este momento" aria-expanded="false">' + ICO.guia + '</button></div>' +
      '<div class="au-corpo"><div class="au-palco" id="au-palco"></div><aside class="au-nota" id="au-nota"' + (crianca || estreito ? ' hidden' : '') + '></aside></div>' +
      '<div class="au-pe"><button class="au-pilula" id="au-antes"' + (i ? '' : ' hidden') + '>Voltar</button><span></span><button class="au-acao" id="au-depois">' + (prox ? 'Próximo: ' + esc(nomeDoMomento(prox.k, a)) : 'Plantar a semente') + '</button></div>', 'sala');
    var nota = $('#au-nota'), guia = $('#au-guia');
    guia.setAttribute('aria-expanded', !nota.hidden);
    nota.innerHTML = notaHtml(atual.k, a, tema);
    ligarBase(nota, tema);
    guia.addEventListener('click', function () { nota.hidden = !nota.hidden; guia.setAttribute('aria-expanded', !nota.hidden); });
    $('#au-pausar').addEventListener('click', function () { gravar(); verInicio(); });
    $('#au-guardar').addEventListener('click', function () { guardarPergunta(); });
    $('#au-antes').addEventListener('click', function () { and.i--; gravar(); verSala(); });
    $('#au-depois').addEventListener('click', function () { if (prox) { and.i++; gravar(); verSala(); } else verPlantio(); });
    var palco = $('#au-palco');
    CENAS[atual.k](palco, a, tema, and.estado);
    // O dia passa: o sol anda a cada momento, e o Brotinho pula de pedra em pedra.
    mundo.ceu(i / Math.max(1, m.length - 1));
    var pedras = $$('.au-passos i', vista), caixa = $('.au-passos', vista), passo = $('.au-brt-passo', vista);
    function xDe(p) { var r = p.getBoundingClientRect(); return r.left + r.width / 2 - caixa.getBoundingClientRect().left; }
    passo.style.left = xDe(pedras[i]) + 'px';
    if (anima) {
      if (ultimoPasso !== null && ultimoPasso !== i) {
        G.fromTo(passo, { x: xDe(pedras[ultimoPasso]) - xDe(pedras[i]) }, { x: 0, duration: .6, ease: 'power2.inOut', clearProps: 'x' });
        G.fromTo(passo, { y: 0 }, { y: -16, duration: .3, ease: 'sine.out', yoyo: true, repeat: 1, clearProps: 'y' });
      }
      var lado = ultimoPasso === null ? 0 : (i >= ultimoPasso ? 1 : -1);
      if (lado) G.from(palco.children, { x: lado * 46, opacity: 0, duration: .45, ease: 'power3.out', clearProps: 'transform,opacity' });
      else G.from(palco, { opacity: 0, duration: .4, clearProps: 'opacity' });
    }
    ultimoPasso = i;
    // Um lembrete só, no meio do encontro, para o evangelizador olhar sem cobrar.
    if (a.missao && atual.k === 'pensar' && !and.estado.lembrou) { and.estado.lembrou = true; gravar(); api.aviso('Repare nos gestos bons das crianças, sem cobrar nem perguntar.'); }
    // Relógio manso: só mostra quanto falta deste momento. Nada apita.
    var t0 = Date.now(), rel = $('#au-relogio'), tiq = setInterval(function () {
      var resta = atual.min - (Date.now() - t0) / 60000;
      rel.textContent = resta > 0 ? Math.ceil(resta) + ' min' : 'Pode seguir';
    }, 15000);
    aoSairDaVista.push(function () { clearInterval(tiq); });
  }
  function nomeDoMomento(k, a) { if (k === 'jogo') return JOGOS[a.jogo].nome; if (k === 'expressao') return JOGOS[a.expressao].nome; return MOMENTOS[k].nome; }
  function notaHtml(k, a, tema) {
    var h = '<h5>Como conduzir</h5><p>' + esc(MOMENTOS[k].nota) + '</p>';
    if (k === 'historia' && tema.dica) h += '<h5>Para contar</h5><p>' + esc(tema.dica) + '</p>';
    if (k === 'pensar' || k === 'historia') {
      if (tema.base.length) h += '<h5>Base em Kardec</h5>' + tema.base.map(baseHtml).join('');
      if ((tema.seperguntarem || []).length) h += '<h5>Se perguntarem…</h5>' + tema.seperguntarem.map(function (q) { return '<details class="au-det"><summary>' + esc(q.p) + '</summary><p>' + esc(q.r) + '</p></details>'; }).join('');
    }
    if (a.missao && a.missaoProf) h += '<details class="au-det"><summary>A sua missão de hoje</summary><p>' + esc(a.missaoProf) + '</p></details>';
    if (k === 'jogo') h += '<h5>Se não der para usar o tablet</h5><p>' + esc(JOGOS[a.jogo].sem) + '</p>';
    if (k === 'expressao') h += '<h5>Se não der para usar o tablet</h5><p>' + esc(JOGOS[a.expressao].sem) + '</p>';
    return h;
  }
  function guardarPergunta() {
    api.abrirGaveta('<h2>Guardar uma pergunta</h2><p style="line-height:1.5">Se não souber responder agora, diga isso à criança, com tranquilidade. Guarde aqui, estude e traga a resposta no próximo encontro.</p><label class="au-campo">A pergunta<textarea id="au-p-txt" rows="3"></textarea></label><button class="au-acao" id="au-p-ok" style="width:100%;margin:12px 0">Guardar na caixinha</button>', function (g) {
      $('#au-p-ok', g).addEventListener('click', function () {
        var txt = $('#au-p-txt', g).value.trim(); if (!txt) return;
        var t = turma(); t.perguntas.push({ id: 'p' + Date.now(), t: txt, em: Date.now(), feita: false }); gravar(); api.fecharGaveta(); api.aviso('Pergunta guardada na caixinha.');
      });
    });
  }

  /* ---------- As cenas do encontro ---------- */
  var CENAS = {
    chegada: function (p) {
      var t = turma(), a = t.andamento.aula, lista = t.criancas;
      function des() {
        var n = a.presentes.length;
        p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Que bom ter vocês aqui</p><h2 class="au-grande">Quem chegou hoje?</h2><p class="au-sub">' + (lista.length ? 'Toque no seu nome' : 'A turma ainda não tem nomes. Inclua quem chegou:') + '</p>' +
          '<div class="au-bolhas">' + lista.map(function (x, i) { return '<button class="au-bolha' + (a.presentes.indexOf(x) >= 0 ? ' acesa' : '') + '" data-c="' + i + '" aria-pressed="' + (a.presentes.indexOf(x) >= 0) + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
          '<form class="au-acrescentar"><input type="text" maxlength="24" placeholder="Chegou alguém novo?" aria-label="Nome da criança nova"><button class="au-pilula b" type="submit">Incluir</button></form>' +
          (n ? '<p class="au-sub" style="margin-top:6px">' + n + (n === 1 ? ' criança chegou' : ' crianças chegaram') + '</p>' : '') + '</div>';
        ao('[data-c]', function (e) {
          var nome = lista[+e.currentTarget.dataset.c], k = a.presentes.indexOf(nome);
          if (k >= 0) a.presentes.splice(k, 1); else { a.presentes.push(nome); som('suave'); api.brilho(e.currentTarget, 14); }
          gravar(); des();
        }, p);
        $('form', p).addEventListener('submit', function (e) { e.preventDefault(); var c = $('input', p), n2 = c.value.trim(); if (!n2) return; if (lista.indexOf(n2) < 0) lista.push(n2); if (a.presentes.indexOf(n2) < 0) a.presentes.push(n2); som('suave'); gravar(); des(); });
      }
      des();
    },
    missao: function (p, a, tema) { cenaMissao(p, a, tema); },
    bem: function (p, a) { cenaBem(p, a); },
    prece1: function (p) { cenaPrece(p, 'Vamos começar com uma prece', 'Vamos respirar devagar e acalmar o coração.'); },
    prece2: function (p) { cenaPrece(p, 'Vamos agradecer', 'Agradecer pelo encontro e por tudo o que aprendemos hoje.'); },
    lembrar: function (p) {
      var t = turma(), u = ultimaAula(t), tema = u.tema ? temaPorId(u.tema) : null, nomes = presentes();
      var viv = u.vivencia || (tema && tema.vivencia) || '', st = t.andamento.aula, feitos = st.conseguiram || (st.conseguiram = []);
      var pr = t.perguntas.filter(function (x) { return x.trazer && !x.feita; });
      function des() {
        p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Da última vez falamos de</p><h2 class="au-grande">' + esc(u.titulo) + '</h2>' +
          (viv ? '<p style="font-size:1.1em;line-height:1.4;max-width:34em">A tarefa era: ' + esc(viv) + '</p>' : '') +
          (nomes.length ? '<p class="au-sub">Quem conseguiu acende um vaga-lume no jardim. E quem não conseguiu ainda pode tentar!</p><div class="au-bolhas">' + nomes.map(function (x, i) { return '<button class="au-bolha' + (feitos.indexOf(x) >= 0 ? ' acesa' : '') + '" data-c="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>' : '<p class="au-sub">Quem conseguiu? Como foi?</p>') +
          (pr.length ? '<div class="au-recado"><b>Vocês perguntaram:</b>\n' + pr.map(function (x) { return esc(x.t); }).join('\n') + '</div>' : '') + '</div>';
        ao('[data-c]', function (e) {
          var nome = nomes[+e.currentTarget.dataset.c], k = feitos.indexOf(nome);
          if (k >= 0) { feitos.splice(k, 1); t.vagalumes = Math.max(0, (t.vagalumes || 0) - 1); } else { feitos.push(nome); t.vagalumes = (t.vagalumes || 0) + 1; som('suave'); api.brilho(e.currentTarget, 14); }
          gravar(); des();
        }, p);
      }
      des();
    },
    abrir: function (p, a, tema) {
      p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Hoje vamos falar de: ' + esc(tema.titulo) + '</p><h2 class="au-grande">' + esc(tema.abrir) + '</h2><div id="au-roda"></div></div>';
      montarRoda($('#au-roda', p));
    },
    historia: function (p, a, tema) {
      var t = turma(), pars = historiaDaAula(a, t), pag = 0;
      var titulo = tema.tituloHistoria || tema.titulo, fonte = tema.fonteHistoria || (tema.base[0] ? 'Com base em ' + tema.base[0].ref : '');
      if (a.historiaDe) { var h = temaPorId(a.historiaDe); titulo = h.tituloHistoria || h.titulo; fonte = h.fonteHistoria || ''; }
      if (!pars || !pars.length) {
        p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Hora da história</p><h2 class="au-grande">Agora, uma história sobre ' + esc(tema.titulo.toLowerCase()) + '</h2><p class="au-sub">Conte com as suas palavras. Você preparou esta história no plano da aula.</p></div>';
        return;
      }
      var fig = a.historiaDe ? temaPorId(a.historiaDe).figurinha : tema.figurinha;
      var figura = '<div class="au-figura">' + (fig ? fig.svg : svgPlanta(DADOS.temas.indexOf(tema) + 1)) + '</div>';
      function des() {
        p.innerHTML = (pag === 0 ? '<p class="au-eyebrow" style="text-align:center">' + esc(titulo) + '</p>' + figura : '') + '<p class="au-pagina" id="au-pag">' + esc(pars[pag]) + '</p>' +
          '<div class="au-hist-pe"><button class="au-redondo" id="au-h-a" aria-label="Parte anterior"' + (pag ? '' : ' disabled style="opacity:.3"') + '>' + ICO.voltar + '</button><span>' + (pag + 1) + ' de ' + pars.length + '</span>' + botaoOuvir() + '<button class="au-redondo" id="au-h-d" aria-label="Próxima parte"' + (pag < pars.length - 1 ? '' : ' disabled style="opacity:.3"') + '><span style="transform:scaleX(-1);display:block;height:22px">' + ICO.voltar + '</span></button></div>' +
          (fonte ? '<p class="au-ref">' + esc(fonte) + '</p>' : '');
        $('#au-h-a', p).addEventListener('click', function () { if (pag) { pag--; pararFala(); des(); som('folhear'); } });
        $('#au-h-d', p).addEventListener('click', function () { if (pag < pars.length - 1) { pag++; pararFala(); des(); som('folhear'); } });
        $('[data-ouvir]', p).addEventListener('click', function (e) { falar(pars[pag], e.currentTarget); });
        if (anima) G.from('#au-pag', { opacity: 0, y: 10, duration: .5, clearProps: 'all' });
      }
      des();
      var x0 = null;
      p.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
      p.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) < 60) return; if (dx < 0 && pag < pars.length - 1) { pag++; pararFala(); des(); } else if (dx > 0 && pag) { pag--; pararFala(); des(); } });
    },
    pensar: function (p, a) {
      var qs = perguntasDaAula(a, turma()), i = 0, fila = filaAtual;
      function des(nome) {
        p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Pensar juntos · ' + (i + 1) + ' de ' + qs.length + '</p><h2 class="au-grande">' + esc(qs[i]) + '</h2>' +
          (nome ? '<span class="au-vez">' + esc(nome) + ', o que você acha?</span>' : '') +
          '<div class="au-rodape" style="justify-content:center;margin-top:10px">' + (fila.vazia ? '' : '<button class="au-pilula b" id="au-quem">Quem responde?</button>') + (i < qs.length - 1 ? '<button class="au-pilula" id="au-p-prox">Próxima pergunta</button>' : '') + '</div></div>';
        var q = $('#au-quem', p); if (q) q.addEventListener('click', function () { som('suave'); des(fila.proxima()); });
        var n = $('#au-p-prox', p); if (n) n.addEventListener('click', function () { i++; des(); });
      }
      des();
    },
    jogo: function (p, a, tema) { JOGOS_CENA[a.jogo](p, tema, a); },
    expressao: function (p, a, tema) { JOGOS_CENA[a.expressao](p, tema, a); },
    vivencia: function (p, a, tema) {
      var recado = 'Olá, família! Hoje, na evangelização, conversamos sobre: ' + tema.titulo + '.\n' + tema.familia + '\nA tarefa da semana: ' + tema.vivencia + (a.missao ? '\nHoje cada criança também tentou fazer um gesto bom, como surpresa para os colegas. Se ela quiser contar, ouçam com alegria. Não precisa perguntar.' : '');
      p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">A tarefa da semana</p><h2 class="au-grande">' + esc(tema.vivencia) + '</h2>' +
        '<div class="au-recado" id="au-recado">' + esc(recado) + '</div>' +
        '<div class="au-rodape" style="justify-content:center;margin-top:4px">' + (navigator.share ? '<button class="au-pilula b" id="au-enviar">Enviar para as famílias</button>' : '') + '<button class="au-pilula" id="au-copiar">Copiar o recado</button></div></div>';
      var env = $('#au-enviar', p); if (env) env.addEventListener('click', function () { navigator.share({ text: recado }).catch(function () {}); });
      $('#au-copiar', p).addEventListener('click', function () {
        function ok() { api.aviso('Recado copiado. Agora é só colar no grupo das famílias.'); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(recado).then(ok).catch(function () { selecionar(); });
        else selecionar();
        function selecionar() { var r = document.createRange(); r.selectNodeContents($('#au-recado', p)); var s = getSelection(); s.removeAllRanges(); s.addRange(r); api.aviso('Texto selecionado: copie e cole no grupo.'); }
      });
    }
  };
  function cenaPrece(p, titulo, sub) {
    var nomes = presentes(), PN = DADOS.pai_nosso;
    p.innerHTML = '<div class="au-meio"><div class="au-respira"><span>Respire<br>devagar</span></div><h2 class="au-grande">' + esc(titulo) + '</h2><p class="au-sub">' + esc(sub) + '</p><p id="au-quem-reza" class="au-vez" hidden></p><div class="au-rodape" style="justify-content:center;margin-top:0">' + (nomes.length ? '<button class="au-pilula" id="au-reza">Quem quer fazer a prece?</button>' : '') + '<button class="au-pilula" id="au-ver-pn" aria-expanded="false">Ver o Pai Nosso</button></div><p class="au-pn" id="au-pn" hidden>' + PN.map(esc).join('<br>') + '</p></div>';
    var f = Fila(nomes), rz = $('#au-reza', p);
    if (rz) rz.addEventListener('click', function () { var q = $('#au-quem-reza', p); q.hidden = false; q.textContent = f.proxima() + ', você quer fazer a prece hoje?'; rz.textContent = 'Perguntar a outra criança'; });
    var v = $('#au-ver-pn', p);
    v.addEventListener('click', function () { var pn = $('#au-pn', p); pn.hidden = !pn.hidden; v.setAttribute('aria-expanded', !pn.hidden); v.textContent = pn.hidden ? 'Ver o Pai Nosso' : 'Esconder o Pai Nosso'; var r = $('.au-respira', p); r.hidden = !pn.hidden; });
  }
  /* ---------- Missão surpresa e Amigo do bem ---------- */
  // "Surpresa", e não "segredo": vale só entre os colegas e termina no mesmo dia. Materiais de prevenção de abuso ensinam
  // essa diferença (ver CONTINUAR.md). Ninguém conta o que fez, e sim o bem que viu (Evangelho, cap. XIII, itens 1 e 3).
  var REGRA_SURPRESA = 'É surpresa só para os colegas. Adultos de confiança podem saber. E segredo que dá medo a gente sempre conta.';
  function podeAmigo(t) { return t.faixa !== 'jardim' && t.criancas.length >= 3; }
  // Dois encontros por mês (pedido do usuário), com pelo menos 10 dias entre eles. No plano dá para ligar ou desligar.
  // De 7 a 10 anos, a cada três missões, uma é o Amigo do bem.
  function qualMissaoHoje(t) {
    var hoje = new Date(), noMes = 0, ultima = 0, feitas = 0;
    t.aulas.forEach(function (x) {
      if (!x.missao) return;
      feitas++;
      var d = new Date(x.em);
      if (d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) noMes++;
      if (x.em > ultima) ultima = x.em;
    });
    if (noMes >= 2 || hoje.getTime() - ultima < 10 * 864e5) return null;
    return (feitas + 1) % 3 === 0 && (t.faixa === 'ciclo1' || t.faixa === 'ciclo2') && t.criancas.length >= 3 ? 'amigo' : 'simples';
  }
  function sortearMissaoProf(atual) { var l = DADOS.missoes.evangelizador.filter(function (x) { return x !== atual; }); return l[Math.floor(Math.random() * l.length)]; }
  // Em roda: cada criança cuida da seguinte, então todas recebem cuidado. Evita as duplas marcadas na turma e, se der, repetir.
  function sortearAmigos(nomes, t) {
    var evitar = t.evitar || [], hist = t.amigoHist || {}, melhor = null, pior = Infinity;
    function proibida(x, y) { return evitar.some(function (d) { return (d[0] === x && d[1] === y) || (d[0] === y && d[1] === x); }); }
    for (var n = 0; n < 400 && pior > 0; n++) {
      var o = embaralhar(nomes), pena = 0;
      o.forEach(function (x, i) { var y = o[(i + 1) % o.length]; if (proibida(x, y)) pena += 100; if ((hist[x] || []).indexOf(y) >= 0) pena += 1; });
      if (pena < pior) { pior = pena; melhor = o; }
    }
    var mapa = {}; melhor.forEach(function (x, i) { mapa[x] = melhor[(i + 1) % melhor.length]; });
    return { mapa: mapa, conflito: pior >= 100 };
  }
  // Os 3 envelopes: uma missão do tema e duas gerais, sem repetir o que a criança já recebeu nem o que já saiu hoje.
  function missoesPara(a, tema, t, chave) {
    var M = DADOS.missoes, usadas = (t.missHist && t.missHist[chave]) || [], hoje = Object.keys(a.dadas).map(function (n) { return a.dadas[n].t; }), alvo = a.amigos && a.amigos[chave];
    function livre(x) { return usadas.indexOf(x.t) < 0 && hoje.indexOf(x.t) < 0; }
    if (alvo) {
      var todas = M.amigo.map(function (g) { return { t: g.t.replace(/\{nome\}/g, alvo), k: g.k, alvo: alvo }; });
      var boas = embaralhar(todas.filter(livre));
      return (boas.length >= 3 ? boas : embaralhar(todas)).slice(0, 3);
    }
    var doTema = M.temas[tema.id] || [], geral = M.geral[faixaDe(t).historia];
    var l = embaralhar(doTema.filter(livre)).slice(0, 1).concat(embaralhar(geral.filter(livre)).slice(0, 2));
    // Acabaram as gerais: usa as de outros temas antes de repetir o que a criança já recebeu.
    if (l.length < 3) { var outras = []; Object.keys(M.temas).forEach(function (id) { outras = outras.concat(M.temas[id]); }); l = l.concat(embaralhar(outras.filter(livre)).filter(function (x) { return l.indexOf(x) < 0; })).slice(0, 3); }
    if (l.length < 3) l = l.concat(embaralhar(geral).filter(function (x) { return l.indexOf(x) < 0; })).slice(0, 3);
    return embaralhar(l);
  }
  function cenaMissao(p, a, tema) {
    var t = turma(), nomes = presentes(), leitura = faixaDe(t).historia === 'jardim';
    a.dadas = a.dadas || {};
    if (a.missao === 'amigo' && !a.amigos && nomes.length >= 3) {
      var sorteio = sortearAmigos(nomes, t); a.amigos = sorteio.mapa; gravar();
      if (sorteio.conflito) api.aviso('Não deu para evitar todas as duplas marcadas na turma.');
    }
    function lista() {
      pararFala();
      var entregues = Object.keys(a.dadas).length;
      p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">' + (a.amigos ? 'Amigo do bem' : 'Missão surpresa') + '</p><h2 class="au-grande">Uma surpresa boa para cada um</h2><p class="au-regra">' + esc(REGRA_SURPRESA) + '</p>' +
        (nomes.length
          ? '<p class="au-sub">Toque no seu nome, longe dos olhos dos amigos</p><div class="au-bolhas">' + nomes.map(function (n, i) { return '<button class="au-bolha' + (a.dadas[n] ? ' guardada' : '') + '" data-m="' + i + '">' + esc(n) + '</button>'; }).join('') + '</div>' + (entregues >= nomes.length ? '<p class="au-vez">Todos já receberam. Agora é só fazer!</p>' : '')
          : '<button class="au-acao" id="au-m-prox">Próxima criança</button><p class="au-sub">' + entregues + (entregues === 1 ? ' missão entregue' : ' missões entregues') + '</p>') + '</div>';
      ao('[data-m]', function (e) { var n = nomes[+e.currentTarget.dataset.m]; if (a.dadas[n]) revelar(n, a.dadas[n], null); else envelopes(n); }, p);
      var prox = $('#au-m-prox', p); if (prox) prox.addEventListener('click', function () { envelopes('crianca' + (entregues + 1)); });
    }
    function titulo(chave) { return nomes.indexOf(chave) >= 0 ? 'Só para ' + chave : 'Só para você'; }
    function envelopes(chave) {
      var ops = missoesPara(a, tema, t, chave);
      p.innerHTML = '<div class="au-meio"><span class="au-vez">' + esc(titulo(chave)) + '</span><h2 class="au-grande">Escolha um envelope</h2><div class="au-envelopes">' + ops.map(function (_, i) { return '<button class="au-envelope" data-e="' + i + '" aria-label="Envelope ' + (i + 1) + '">' + ENVELOPE + '</button>'; }).join('') + '</div></div>';
      ao('[data-e]', function (e) { som('revelacao'); revelar(chave, ops[+e.currentTarget.dataset.e], ops); }, p);
    }
    function revelar(chave, m, ops) {
      var ja = !!a.dadas[chave];
      p.innerHTML = '<div class="au-meio"><span class="au-vez">' + esc(titulo(chave)) + '</span>' + (m.alvo ? '<p class="au-eyebrow">Hoje você cuida de ' + esc(m.alvo) + '</p>' : '') + '<div class="au-tipo">' + svgTipo(m.k) + '</div><p class="au-missao-texto">' + esc(m.t) + '</p>' +
        '<div class="au-rodape" style="justify-content:center;margin-top:6px"><button class="au-pilula" id="au-m-ouvir">Ouvir baixinho</button>' + (ja ? '' : '<button class="au-pilula" id="au-m-trocar">Trocar</button>') + '<button class="au-acao" id="au-m-ok">Guardei</button></div></div>';
      if (leitura && !ja) falar(m.t, null, true);
      $('#au-m-ouvir', p).addEventListener('click', function () { falar(m.t, null, true); });
      var tr = $('#au-m-trocar', p);
      if (tr) tr.addEventListener('click', function () { var novas = (ops || missoesPara(a, tema, t, chave)).filter(function (x) { return x.t !== m.t; }); ops = novas.length ? novas : missoesPara(a, tema, t, chave); revelar(chave, ops[0], ops); });
      $('#au-m-ok', p).addEventListener('click', function () {
        if (!ja) {
          a.dadas[chave] = m;
          if (nomes.indexOf(chave) >= 0) { var h = t.missHist || (t.missHist = {}); (h[chave] = h[chave] || []).push(m.t); if (h[chave].length > 60) h[chave].shift(); if (m.alvo) { var ah = t.amigoHist || (t.amigoHist = {}); (ah[chave] = ah[chave] || []).push(m.alvo); if (ah[chave].length > 4) ah[chave].shift(); } }
          gravar(); som('suave');
        }
        lista();
      });
    }
    lista();
  }
  // Cada gesto visto abre uma pétala e acende um vaga-lume no jardim. A conta é da turma, nunca de uma criança.
  function cenaBem(p, a) {
    var t = turma(), fila = filaAtual, nomes = presentes(), total = Math.max(6, Math.min(12, nomes.length || 6)), CORES = ['#F2A0B4', '#F7C948', '#B8A2E8', '#F58D68', '#7FB5EA', '#9BBF62'];
    a.gestos = a.gestos || 0;
    function flor(novo) {
      var h = '<svg viewBox="0 0 200 200" aria-hidden="true">';
      for (var i = 0; i < total; i++) {
        var ang = i * 6.2832 / total - 1.5708, aberta = i < a.gestos;
        h += '<circle class="pet' + (novo && i === a.gestos - 1 ? ' nova' : '') + '" cx="' + (100 + Math.cos(ang) * 58).toFixed(1) + '" cy="' + (100 + Math.sin(ang) * 58).toFixed(1) + '" r="27" fill="' + (aberta ? CORES[i % CORES.length] : '#EDE5D6') + '"/>';
      }
      return h + '<circle cx="100" cy="100" r="30" fill="' + (a.gestos >= total ? '#F9D65F' : '#F2E3BE') + '"/></svg>';
    }
    function des(quem, novo) {
      p.innerHTML = '<div class="au-meio" style="gap:8px"><p class="au-eyebrow">O bem que vimos</p><h2 class="au-grande">Quem viu uma coisa boa hoje?</h2><p class="au-sub" style="font-size:1.05em;max-width:34em">Conte o que você viu um amigo fazer. O que você mesmo fez não precisa contar aqui.' + (a.amigos ? ' Alguém sentiu que estava sendo cuidado? Quem quiser, pode tentar adivinhar quem foi.' : '') + '</p>' +
        (quem ? '<span class="au-vez">' + esc(quem) + ', o que você viu?</span>' : '') + '<div class="au-flor">' + flor(novo) + '</div>' +
        '<p class="au-sub">' + (a.gestos ? a.gestos + (a.gestos === 1 ? ' gesto bom visto' : ' gestos bons vistos') : 'Cada gesto abre uma pétala') + '</p>' +
        '<div class="au-rodape" style="justify-content:center;margin-top:0">' + (fila.vazia ? '' : '<button class="au-pilula" id="au-b-quem">Quem conta?</button>') + '<button class="au-acao" id="au-b-mais" style="min-height:50px;font-size:1em">Vimos mais um gesto bom</button><button class="au-pilula" id="au-b-sil">Um instante em silêncio</button></div></div>';
      var q = $('#au-b-quem', p); if (q) q.addEventListener('click', function () { som('suave'); des(fila.proxima()); });
      $('#au-b-mais', p).addEventListener('click', function () { a.gestos++; t.vagalumes = (t.vagalumes || 0) + 1; gravar(); som('suave'); des(null, true); api.brilho($('.au-flor', p), 16); });
      $('#au-b-sil', p).addEventListener('click', silencio);
    }
    function silencio() {
      p.innerHTML = '<div class="au-meio"><div class="au-respira"><span>Respire<br>devagar</span></div><h2 class="au-grande">Em silêncio: como você se sentiu hoje?</h2><p class="au-sub" style="font-size:1.05em">A surpresa termina hoje. Quem quiser, pode contar para a família.</p></div>';
      var tm = setTimeout(function () { des(); }, 20000); aoSairDaVista.push(function () { clearTimeout(tm); });
    }
    des();
  }
  // A roda: sorteia quem fala, sem repetir enquanto houver alguém que ainda não falou.
  function montarRoda(el) {
    var nomes = presentes(); if (!nomes.length) { el.innerHTML = '<p class="au-sub">Quem quer começar?</p>'; return; }
    var n = nomes.length, CORES = ['#F7CF8B', '#CBDD9A', '#D6C8EE', '#F6B8A4', '#BBD8F0', '#FBE19E', '#C3E0C2', '#EFC5DD'], ja = [], giro = 0, girando = false;
    var fatias = '', i;
    if (n === 1) fatias = '<circle cx="100" cy="100" r="98" fill="' + CORES[0] + '"/><text x="100" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#3A2B22">' + esc(nomes[0]) + '</text>';
    else for (i = 0; i < n; i++) {
      var a0 = (i - .5) * 6.2832 / n - 1.5708, a1 = (i + .5) * 6.2832 / n - 1.5708, x0 = 100 + 98 * Math.cos(a0), y0 = 100 + 98 * Math.sin(a0), x1 = 100 + 98 * Math.cos(a1), y1 = 100 + 98 * Math.sin(a1), meio = i * 360 / n;
      fatias += '<path d="M100 100 L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A98 98 0 ' + (n < 2 ? 1 : 0) + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" fill="' + CORES[i % CORES.length] + '" stroke="#FFF" stroke-width="2"/>';
      fatias += '<text x="100" y="' + (n > 8 ? 26 : 30) + '" text-anchor="middle" font-size="' + (n > 8 ? 11 : 14) + '" font-weight="700" fill="#3A2B22" transform="rotate(' + meio.toFixed(1) + ' 100 100)">' + esc(cortar(nomes[i], 10)) + '</text>';
    }
    el.innerHTML = '<div class="au-roda-caixa"><svg class="au-roda" viewBox="0 0 200 200" aria-hidden="true"><g id="au-giro" style="transform-origin:100px 100px">' + fatias + '</g></svg><span class="au-roda-seta"></span><button class="au-roda-botao" id="au-girar">Girar</button></div><p class="au-vez" id="au-escolhido" hidden style="margin:8px auto 0"></p>';
    var g = $('#au-giro', el);
    $('#au-girar', el).addEventListener('click', function () {
      if (girando) return; girando = true; var res = $('#au-escolhido', el); res.hidden = true;
      var livres = nomes.map(function (_, k) { return k; }).filter(function (k) { return ja.indexOf(k) < 0; });
      if (!livres.length) { ja = []; livres = nomes.map(function (_, k) { return k; }); }
      var alvo = livres[Math.floor(Math.random() * livres.length)]; ja.push(alvo);
      var vezes = anima ? 4 : 0, fim = 360 * vezes + (360 - alvo * 360 / n);
      giro = giro - (giro % 360) + 360 + fim;
      var pronto = function () { girando = false; res.hidden = false; res.textContent = 'Vez de ' + nomes[alvo] + '!'; som('revelacao'); };
      if (anima) { som('tique'); g.style.transition = 'transform 3s cubic-bezier(.16,.84,.26,1)'; g.style.transform = 'rotate(' + giro + 'deg)'; var tm = setTimeout(pronto, 3050); aoSairDaVista.push(function () { clearTimeout(tm); }); }
      else { g.style.transform = 'rotate(' + giro + 'deg)'; pronto(); }
    });
  }
  function festa(p, titulo, sub) {
    p.innerHTML = '<div class="au-meio"><div class="au-figura au-comemora" style="width:clamp(110px,20vmin,180px)">' + svgBrotinho() + '</div><h2 class="au-grande">' + esc(titulo) + '</h2><p class="au-sub" style="font-size:1.1em">' + esc(sub) + '</p></div>';
    som('revelacao'); var c = $('.au-grande', p); if (c) api.brilho(c, 30);
  }

  /* ---------- As brincadeiras: todos jogam juntos ---------- */
  var JOGOS_CENA = {
    // Cada criança leva uma semente ao lugar certo, arrastando ou tocando. Errar não tira nada: a turma ajuda.
    semear: function (p, tema) {
      var se = tema.semear, fila = filaAtual, itens = embaralhar(se.sim.map(function (t) { return { t: t, boa: true }; }).concat(se.nao.map(function (t) { return { t: t, boa: false }; }))), i = 0, plantadas = 0, fora = [];
      fila.proxima();
      function des() {
        if (i >= itens.length) { festa(p, 'A turma plantou ' + plantadas + ' sementes!', 'Vocês fizeram isso juntos.'); return; }
        var it = itens[i], brotos = ''; for (var k = 0; k < plantadas; k++) brotos += '<span style="left:' + (12 + k * 76 / Math.max(1, se.sim.length - 1)) + '%">' + svgPlanta(k, k >= plantadas - 1 && false) + '</span>';
        p.innerHTML = '<div class="au-sem">' + vezHtml(fila.atual()) + '<div style="display:flex;align-items:center;gap:10px"><div class="au-semente" id="au-sem">' + esc(it.t) + '</div>' + botaoOuvir() + '</div>' +
          '<div class="au-zonas"><button class="au-zona boa" data-z="1"><span>' + esc(se.rotulos[0]) + '</span><span class="au-brotos">' + brotos + '</span></button><button class="au-zona fora" data-z="0"><span>' + esc(se.rotulos[1]) + '</span><span class="au-fora-lista">' + fora.map(esc).join('<br>') + '</span></button></div></div>';
        $('[data-ouvir]', p).addEventListener('click', function (e) { falar(it.t, e.currentTarget); });
        function decidir(z) {
          if ((z === 1) === it.boa) {
            som('suave'); if (it.boa) plantadas++; else fora.push(it.t);
            api.brilho($('#au-sem', p) || p, 14); i++; fila.proxima(); pararFala(); des();
          } else {
            var s = $('#au-sem', p); s.classList.remove('au-treme'); void s.offsetWidth; s.classList.add('au-treme');
            api.aviso('Hmm… o que a turma acha? Peçam ajuda aos amigos.');
          }
        }
        ao('[data-z]', function (e) { decidir(+e.currentTarget.dataset.z); }, p);
        arrastar($('#au-sem', p), $$('[data-z]', p), function (z) { decidir(+z.dataset.z); });
      }
      des();
    },
    // Uma situação, três caminhos. A resposta nunca diz "errado": pergunta de novo.
    caminhos: function (p, tema) {
      var sits = embaralhar(tema.caminhos), s = 0, fila = filaAtual; fila.proxima();
      function des() {
        if (s >= sits.length) { festa(p, 'Quantos caminhos bons!', 'Agora é só lembrar deles nesta semana.'); return; }
        var it = sits[s], ops = embaralhar(it.ops);
        p.innerHTML = '<div class="au-meio" style="gap:6px">' + vezHtml(fila.atual()) + '<div style="display:flex;align-items:center;gap:10px;justify-content:center"><p class="au-sit">' + esc(it.sit) + '</p>' + botaoOuvir() + '</div><div class="au-ops">' + ops.map(function (o, k) { return '<button data-o="' + k + '">' + esc(o.t) + '</button>'; }).join('') + '</div><p class="au-resposta" id="au-resp" hidden></p><div class="au-rodape" id="au-seg" style="justify-content:center;margin-top:6px" hidden><button class="au-acao" id="au-seg-b">Próxima situação</button></div></div>';
        $('[data-ouvir]', p).addEventListener('click', function (e) { falar(it.sit + '. ' + ops.map(function (o) { return o.t; }).join('. Ou: '), e.currentTarget); });
        ao('[data-o]', function (e) {
          var b = e.currentTarget, o = ops[+b.dataset.o], r = $('#au-resp', p);
          pararFala(); r.hidden = false; r.textContent = o.r;
          if (o.bom) { b.classList.add('certa'); som('suave'); api.brilho(b, 16); $('#au-seg', p).hidden = false; $$('[data-o]', p).forEach(function (x) { x.disabled = true; }); }
          else { b.classList.add('pense'); }
        }, p);
        $('#au-seg-b', p).addEventListener('click', function () { s++; fila.proxima(); des(); });
      }
      des();
    },
    memoria: function (p, tema) {
      var fila = filaAtual, cartas = [], abertas = [], travado = false, achados = 0; fila.proxima();
      tema.pares.slice(0, 4).forEach(function (par, k) { cartas.push({ t: par[0], k: k }); cartas.push({ t: par[1], k: k }); });
      cartas = embaralhar(cartas);
      p.innerHTML = '<div class="au-meio" style="gap:6px"><span id="au-mv">' + vezHtml(fila.atual()) + '</span><p class="au-sub">Toque em duas cartas. O que combina?</p><div class="au-mem">' + cartas.map(function (c, i) { return '<button class="au-carta" data-i="' + i + '" aria-label="Carta ' + (i + 1) + '"></button>'; }).join('') + '</div></div>';
      ao('[data-i]', function (e) {
        var b = e.currentTarget, c = cartas[+b.dataset.i]; if (travado || b.classList.contains('aberta') || b.classList.contains('par')) return;
        b.classList.add('aberta'); b.textContent = c.t; som('tique'); falar(c.t); abertas.push({ b: b, c: c });
        if (abertas.length < 2) return;
        travado = true;
        var a1 = abertas[0], a2 = abertas[1];
        if (a1.c.k === a2.c.k) {
          achados++; [a1, a2].forEach(function (x) { x.b.classList.remove('aberta'); x.b.classList.add('par'); }); som('suave'); api.brilho(b, 14);
          abertas = []; travado = false; $('#au-mv', p).innerHTML = vezHtml(fila.proxima());
          if (achados === cartas.length / 2) setTimeout(function () { festa(p, 'A turma achou todos os pares!', 'Foi um trabalho de equipe.'); }, 900);
        } else {
          var tm = setTimeout(function () { [a1, a2].forEach(function (x) { x.b.classList.remove('aberta'); x.b.textContent = ''; }); abertas = []; travado = false; $('#au-mv', p).innerHTML = vezHtml(fila.proxima()); }, 1800);
          aoSairDaVista.push(function () { clearTimeout(tm); });
        }
      }, p);
    },
    ordem: function (p, tema, a) {
      var pars = historiaDaAula(a, turma()) || [], fila = filaAtual, certos = 0, ordem = embaralhar(pars.map(function (t, i) { return { t: t, i: i }; })); fila.proxima();
      function des() {
        if (certos >= pars.length) { festa(p, 'História recontada!', 'A turma lembrou de tudo, junta.'); return; }
        p.innerHTML = '<div class="au-meio" style="gap:6px;margin-top:0">' + vezHtml(fila.atual()) + '<p class="au-sub">O que aconteceu ' + (certos ? 'depois' : 'primeiro') + '? Toque na parte certa.</p><div class="au-ordem">' +
          pars.slice(0, certos).map(function (t, k) { return '<div class="feito">' + (k + 1) + '. ' + esc(cortar(t, 70)) + '</div>'; }).join('') +
          ordem.filter(function (x) { return x.i >= certos; }).map(function (x) { return '<button data-p="' + x.i + '">' + esc(cortar(x.t, 110)) + '</button>'; }).join('') + '</div></div>';
        ao('[data-p]', function (e) {
          if (+e.currentTarget.dataset.p === certos) { certos++; fila.proxima(); som('suave'); des(); }
          else { var b = e.currentTarget; b.classList.remove('au-treme'); void b.offsetWidth; b.classList.add('au-treme'); api.aviso('Quase! A turma pode ajudar a lembrar.'); }
        }, p);
      }
      des();
    },
    quiz: function (p, tema) {
      var qs = tema.quiz.slice(0, 5), i = 0, fila = filaAtual; fila.proxima();
      function des() {
        if (i >= qs.length) { festa(p, 'A turma sabe muito!', 'Vocês responderam juntos a todas as perguntas.'); return; }
        var q = qs[i], ops = embaralhar(q.opcoes.map(function (t, k) { return { t: t, certa: k === q.certa }; }));
        p.innerHTML = '<div class="au-meio" style="gap:6px">' + vezHtml(fila.atual()) + '<div style="display:flex;align-items:center;gap:10px;justify-content:center"><p class="au-sit">' + esc(q.pergunta) + '</p>' + botaoOuvir() + '</div><div class="au-ops">' + ops.map(function (o, k) { return '<button data-q="' + k + '">' + esc(o.t) + '</button>'; }).join('') + '</div><p class="au-resposta" id="au-resp" hidden></p></div>';
        $('[data-ouvir]', p).addEventListener('click', function (e) { falar(q.pergunta + ' ' + ops.map(function (o) { return o.t; }).join('. Ou: '), e.currentTarget); });
        ao('[data-q]', function (e) {
          var b = e.currentTarget, o = ops[+b.dataset.q], r = $('#au-resp', p);
          if (o.certa) { b.classList.add('certa'); r.hidden = false; r.textContent = 'Isso!'; som('suave'); api.brilho(b, 18); pararFala(); $$('[data-q]', p).forEach(function (x) { x.disabled = true; }); var tm = setTimeout(function () { i++; fila.proxima(); des(); }, 1400); aoSairDaVista.push(function () { clearTimeout(tm); }); }
          else { b.classList.add('pense'); r.hidden = false; r.textContent = 'Quem pode ajudar? Vamos tentar de novo.'; }
        }, p);
      }
      des();
    },
    // Mural coletivo: vários dedos ao mesmo tempo, passa de mão em mão, e fica guardado.
    mural: function (p, tema) {
      var fila = filaAtual, TINTAS = ['#2B2236', '#D9483B', '#F08A24', '#F4C22F', '#5F9F3F', '#2F86C9', '#8A5BC2', '#E67BAF', '#8A5A33', '#FFFFFF'], cor = TINTAS[1], tam = 12, nome = fila.proxima(), SEG = 45, resta = SEG;
      p.innerHTML = '<div class="au-mural"><div class="au-prompt"><span>' + esc(tema.desenho) + '</span><span id="au-mv">' + vezHtml(nome) + '</span></div><div class="au-tela-mural"><canvas id="au-cv"></canvas></div>' +
        '<div class="au-tintas">' + TINTAS.map(function (c, i) { return '<button class="au-tinta" data-t="' + c + '" style="background:' + c + '" aria-label="Cor ' + (i + 1) + '" aria-pressed="' + (c === cor) + '"></button>'; }).join('') + [6, 12, 26].map(function (t) { return '<button class="au-pincel" data-tam="' + t + '" aria-label="Pincel de tamanho ' + t + '" aria-pressed="' + (t === tam) + '"><i style="width:' + t + 'px;height:' + t + 'px"></i></button>'; }).join('') + '</div>' +
        '<div class="au-rodape" style="margin-top:2px;justify-content:center"><button class="au-pilula" id="au-desf">Desfazer</button>' + (fila.vazia ? '' : '<button class="au-pilula b" id="au-passa">Passar o tablet <span class="au-tempo-vez" id="au-tv">' + SEG + 's</span></button>') + '<button class="au-acao" id="au-guarda" style="min-height:48px;font-size:.95em">Guardar no mural</button></div></div>';
      var cv = $('#au-cv', p), caixa = $('.au-tela-mural', p), ctx = cv.getContext('2d'), d = Math.min(window.devicePixelRatio || 1, 2), dedos = {}, pilha = [];
      function ajustar() {
        var r = caixa.getBoundingClientRect(); if (!r.width || !r.height) return;
        var w = Math.round(r.width * d), h = Math.round(r.height * d); if (cv.width === w && cv.height === h) return;
        var ant = cv.width > 1 ? document.createElement('canvas') : null;
        if (ant) { ant.width = cv.width; ant.height = cv.height; ant.getContext('2d').drawImage(cv, 0, 0); }
        cv.width = w; cv.height = h; ctx.fillStyle = '#FFF'; ctx.fillRect(0, 0, w, h);
        if (ant && ant.width) ctx.drawImage(ant, 0, 0, w, h);
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      }
      ajustar(); window.addEventListener('resize', ajustar); aoSairDaVista.push(function () { window.removeEventListener('resize', ajustar); });
      function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * d, y: (e.clientY - r.top) * d }; }
      function guardarPasso() { try { pilha.push(ctx.getImageData(0, 0, cv.width, cv.height)); if (pilha.length > 6) pilha.shift(); } catch (e) {} }
      cv.addEventListener('pointerdown', function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} if (!Object.keys(dedos).length) guardarPasso(); var a = pos(e); dedos[e.pointerId] = a; ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(a.x, a.y, tam * d / 2, 0, 6.2832); ctx.fill(); });
      cv.addEventListener('pointermove', function (e) { var a = dedos[e.pointerId]; if (!a) return; var b = pos(e); ctx.strokeStyle = cor; ctx.lineWidth = tam * d; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); dedos[e.pointerId] = b; });
      function solta(e) { delete dedos[e.pointerId]; }
      cv.addEventListener('pointerup', solta); cv.addEventListener('pointercancel', solta);
      ao('[data-t]', function (e) { cor = e.currentTarget.dataset.t; $$('[data-t]', p).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === cor); }); som('tique'); }, p);
      ao('[data-tam]', function (e) { tam = +e.currentTarget.dataset.tam; $$('[data-tam]', p).forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.tam === tam); }); }, p);
      $('#au-desf', p).addEventListener('click', function () { var u = pilha.pop(); if (u) ctx.putImageData(u, 0, 0); });
      var passa = $('#au-passa', p);
      if (passa) {
        passa.addEventListener('click', function () { nome = fila.proxima(); $('#au-mv', p).innerHTML = vezHtml(nome); resta = SEG; som('suave'); });
        var tiq = setInterval(function () { resta = Math.max(0, resta - 1); var tv = $('#au-tv', p); if (tv) tv.textContent = resta ? resta + 's' : 'agora!'; }, 1000);
        aoSairDaVista.push(function () { clearInterval(tiq); });
      }
      $('#au-guarda', p).addEventListener('click', function () {
        var esc2 = Math.min(1, 1000 / cv.width), c2 = document.createElement('canvas'); c2.width = Math.round(cv.width * esc2); c2.height = Math.round(cv.height * esc2);
        c2.getContext('2d').drawImage(cv, 0, 0, c2.width, c2.height);
        var t = turma();
        guardarMural({ turma: t.id, titulo: tema.titulo, em: Date.now(), img: c2.toDataURL('image/jpeg', .72) }).then(function () { som('revelacao'); api.aviso('Guardado no mural da turma!'); api.brilho($('#au-guarda', p), 20); }).catch(function () { api.aviso('Não consegui guardar o desenho neste aparelho.'); });
      });
    },
    // O tablet forma as duplas; as crianças saem da tela e encenam.
    encenar: function (p, tema) {
      var nomes = embaralhar(presentes()), duplas = [], i;
      for (i = 0; i < nomes.length; i += 2) duplas.push(nomes.slice(i, i + 2));
      if (duplas.length > 1 && duplas[duplas.length - 1].length === 1) duplas[duplas.length - 2].push(duplas.pop()[0]);
      var k = 0;
      function des() {
        var d = duplas[k];
        p.innerHTML = '<div class="au-meio"><p class="au-eyebrow">Vamos encenar</p><h2 class="au-grande" style="font-size:clamp(1.3em,2.4vw + 10px,2em)">' + esc(tema.encenar) + '</h2>' +
          (d ? '<p class="au-dupla">' + d.map(esc).join(' e ') + '</p>' : '') +
          (duplas.length > 1 ? '<div class="au-rodape" style="justify-content:center;margin-top:6px"><span class="au-sub">' + (k + 1) + ' de ' + duplas.length + '</span>' + (k < duplas.length - 1 ? '<button class="au-pilula b" id="au-e-prox">Próxima dupla</button>' : '') + '</div>' : '') + '</div>';
        var b = $('#au-e-prox', p); if (b) b.addEventListener('click', function () { k++; som('suave'); des(); });
      }
      des();
    }
  };
  // Arrastar a semente com o dedo; ao soltar sobre um lugar, decide. Só tocar nos lugares também funciona.
  function arrastar(el, zonas, aoSoltar) {
    if (!el) return;
    var ini = null, id = null;
    function emCima(x, y) { return zonas.filter(function (z) { var r = z.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; })[0] || null; }
    el.addEventListener('pointerdown', function (e) { ini = { x: e.clientX, y: e.clientY }; id = e.pointerId; try { el.setPointerCapture(id); } catch (x) {} el.style.transition = 'none'; el.style.zIndex = 9; });
    el.addEventListener('pointermove', function (e) { if (!ini || e.pointerId !== id) return; el.style.transform = 'translate(' + (e.clientX - ini.x) + 'px,' + (e.clientY - ini.y) + 'px) rotate(-3deg)'; var z = emCima(e.clientX, e.clientY); zonas.forEach(function (o) { o.classList.toggle('alvo', o === z); }); });
    function fim(e) { if (!ini || e.pointerId !== id) return; var z = emCima(e.clientX, e.clientY); ini = null; zonas.forEach(function (o) { o.classList.remove('alvo'); }); el.style.transition = 'transform .3s var(--mola)'; el.style.transform = ''; if (z) aoSoltar(z); }
    function soltar() { if (!ini) return; ini = null; zonas.forEach(function (o) { o.classList.remove('alvo'); }); el.style.transition = 'transform .3s var(--mola)'; el.style.transform = ''; }
    // Toque interrompido (ou perdido): a semente volta ao lugar, nunca fica presa no meio do caminho.
    el.addEventListener('pointerup', fim); el.addEventListener('pointercancel', soltar); el.addEventListener('lostpointercapture', soltar);
  }

  /* ---------- Plantar e avaliar ---------- */
  function verPlantio() {
    var t = turma(), and = t.andamento, a = and.aula, tema = temaDaAula(a);
    mundo.ceu(1); mundo.plantas(t);
    mostrar('<div class="au-topo"><h2>O jardim da turma</h2></div><div class="au-plantio"><h1 class="au-titulo" id="au-pl-t">Hoje plantamos: ' + esc(tema.titulo) + '</h1><p class="au-sub" id="au-pl-s">Todo mundo junto: toquem na semente!</p><div class="au-plantio-pe"><div class="au-brotinho" id="au-pl-brt">' + svgBrotinho() + '</div><button class="au-acao" id="au-plantar">Plantar a semente</button></div></div>', 'plantio');
    $('#au-plantar').addEventListener('click', function () {
      var reg = { tema: a.temaId, titulo: tema.titulo, pedido: a.pedido, em: Date.now(), presentes: a.presentes.length, jogo: a.jogo, expressao: a.expressao, vivencia: tema.vivencia, conseguiram: (a.conseguiram || []).length, missao: a.missao || null, gestos: a.gestos || 0, aval: null, nota: '' };
      t.aulas.push(reg); t.andamento = null; gravar();
      var n = t.aulas.length; mundo.plantas(t, true); mundo.pular($('#au-pl-brt'));
      var novaEl = $('.au-planta.nova', tela); if (novaEl && anima) api.brilho(novaEl, 26); som('revelacao');
      $('#au-pl-t').textContent = n === 1 ? 'A primeira planta do jardim!' : 'Agora são ' + n + ' plantas no jardim!';
      $('#au-pl-s').textContent = 'Até o próximo encontro. A semente de hoje continua crescendo em casa.';
      var b = $('#au-plantar'); b.textContent = 'Terminar'; b.replaceWith(b.cloneNode(true));
      $('#au-plantar').addEventListener('click', function () { verAvaliar(reg); });
    });
  }
  function verAvaliar(reg) {
    mostrar('<div class="au-topo"><h2>Só para você</h2></div><div class="au-rolar"><div class="au-coluna"><h1 class="au-titulo">Como foi o encontro?</h1><p class="au-sub" style="margin-top:6px">A FEB inclui, ao fim de cada ação, “Avaliar a ação e se autoavaliar no processo”. Um minuto basta, e fica no seu diário.</p>' +
      '<div class="au-escolhas" style="margin-top:16px">' + ['Foi muito bem', 'Foi bem', 'Foi difícil'].map(function (o) { return '<button class="au-pilula" data-a="' + o + '" aria-pressed="false">' + o + '</button>'; }).join('') + '</div>' +
      '<label class="au-campo">O que funcionou? O que você mudaria? Alguma criança precisa de atenção?<textarea id="au-av" rows="4"></textarea></label>' +
      '<div class="au-rodape"><button class="au-acao" id="au-av-ok">Guardar no diário</button><button class="au-pilula" id="au-av-pula">Agora não</button></div></div></div>', 'avaliar');
    ao('[data-a]', function (e) { reg.aval = e.currentTarget.dataset.a; $$('[data-a]', vista).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.a === reg.aval); }); });
    $('#au-av-ok').addEventListener('click', function () { reg.nota = $('#au-av').value.trim(); gravar(); verInicio(true); });
    $('#au-av-pula').addEventListener('click', function () { verInicio(true); });
  }

  /* ---------- Programa do ano ---------- */
  function verPrograma() {
    var t = turma(), feitos = {}; t.aulas.forEach(function (a) { if (a.tema) feitos[a.tema] = 1; });
    var n = 0;
    mostrar(topo('Programa do ano') + '<div class="au-rolar"><div class="au-coluna"><p class="au-sub">' + DADOS.temas.length + ' encontros na ordem dos módulos do Currículo da FEB. Você pode seguir na ordem, pular ou escrever outro assunto a qualquer momento.</p>' +
      DADOS.modulos.map(function (m) {
        return '<h3 class="au-sec">Módulo ' + m.id + ': ' + esc(m.nome) + '</h3><ul class="au-lista">' + DADOS.temas.filter(function (x) { return x.modulo === m.id; }).map(function (x) {
          n++;
          return '<li><span class="au-feito' + (feitos[x.id] ? ' sim' : '') + '">' + (feitos[x.id] ? ICO.feito : n) + '</span><span class="txt">' + esc(x.titulo) + '<small>' + esc(x.unidade) + '</small></span><button class="au-pilula" data-tema="' + x.id + '">Preparar</button></li>';
        }).join('') + '</ul>';
      }).join('') +
      '<p class="au-revisao">' + DADOS.fontes.map(esc).join('<br>') + '</p></div></div>', 'programa');
    ao('[data-voltar]', function () { verInicio(); });
    ao('[data-tema]', function (e) { verPlano(novaAula('', temaPorId(e.currentTarget.dataset.tema), [])); });
  }

  /* ---------- Caixinha de perguntas ---------- */
  function verCaixinha() {
    var t = turma(), abertas = t.perguntas.filter(function (p) { return !p.feita; }), feitas = t.perguntas.filter(function (p) { return p.feita; });
    mostrar(topo('Caixinha de perguntas') + '<div class="au-rolar"><div class="au-coluna"><p class="au-sub">As perguntas das crianças ficam aqui até você trazer a resposta. Procure nas obras, estude e leve no próximo encontro.</p>' +
      '<form class="au-busca" id="au-cx"><input type="text" maxlength="200" placeholder="Escreva uma pergunta" aria-label="Nova pergunta"><button class="au-acao" type="submit">Guardar</button></form>' +
      (abertas.length ? '<ul class="au-lista" style="margin-top:14px">' + abertas.map(function (p) {
        return '<li style="display:block"><div class="txt" style="font-weight:600">' + esc(p.t) + '<small>' + dataCurta(p.em) + '</small></div><div class="au-sugestoes" style="min-height:0"><button class="au-pilula b" data-busca="' + p.id + '">Procurar nas obras</button><button class="au-pilula" data-trazer="' + p.id + '" aria-pressed="' + !!p.trazer + '">Levar no próximo encontro</button><button class="au-pilula" data-feita="' + p.id + '">Já respondi</button></div><div data-res="' + p.id + '"></div></li>';
      }).join('') + '</ul>' : '<p class="au-sub" style="margin-top:18px">Nenhuma pergunta esperando.</p>') +
      (feitas.length ? '<details class="au-det" style="margin-top:18px"><summary>Já respondidas (' + feitas.length + ')</summary><ul class="au-lista">' + feitas.map(function (p) { return '<li><span class="txt">' + esc(p.t) + '</span></li>'; }).join('') + '</ul></details>' : '') +
      '</div></div>', 'caixinha');
    function acha(id) { return t.perguntas.filter(function (p) { return p.id === id; })[0]; }
    ao('[data-voltar]', function () { verInicio(); });
    $('#au-cx').addEventListener('submit', function (e) { e.preventDefault(); var c = $('input', e.currentTarget), v = c.value.trim(); if (!v) return; t.perguntas.push({ id: 'p' + Date.now(), t: v, em: Date.now(), feita: false }); gravar(); verCaixinha(); });
    ao('[data-feita]', function (e) { acha(e.currentTarget.dataset.feita).feita = true; gravar(); verCaixinha(); });
    ao('[data-trazer]', function (e) { var p = acha(e.currentTarget.dataset.trazer); p.trazer = !p.trazer; e.currentTarget.setAttribute('aria-pressed', !!p.trazer); gravar(); });
    ao('[data-busca]', function (e) {
      var b = e.currentTarget, p = acha(b.dataset.busca), c = $('[data-res="' + p.id + '"]', vista); b.disabled = true; b.textContent = 'Procurando…';
      api.buscar(p.t, 4).then(function (us) {
        b.hidden = true;
        c.innerHTML = us.length ? us.map(function (u, i) { return '<div class="au-achado"><small>' + esc(u.ref) + '</small><p>' + esc(cortar(u.txt, 340)) + '</p><button class="au-pilula" data-abrir="' + i + '">Abrir no livro</button></div>'; }).join('') : '<p class="au-sub">Nada encontrado. Tente com outras palavras.</p>';
        ao('[data-abrir]', function (ev) { var u = us[+ev.currentTarget.dataset.abrir]; api.abrirLivro(u.l, u.c, u.b, 'aulas'); }, c);
      }).catch(function () { b.disabled = false; b.textContent = 'Tentar de novo'; });
    });
  }

  /* ---------- Mural da turma (os desenhos ficam no IndexedDB do aparelho) ---------- */
  function dbMural() {
    return new Promise(function (ok, erro) {
      var r = indexedDB.open('lar-aulas-mural', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('desenhos', { keyPath: 'id', autoIncrement: true }); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { erro(r.error); };
    });
  }
  function guardarMural(d) { return dbMural().then(function (db) { return new Promise(function (ok, erro) { var tx = db.transaction('desenhos', 'readwrite'); tx.objectStore('desenhos').add(d); tx.oncomplete = function () { ok(); }; tx.onerror = function () { erro(tx.error); }; }); }); }
  function lerMural() { return dbMural().then(function (db) { return new Promise(function (ok, erro) { var q = db.transaction('desenhos').objectStore('desenhos').getAll(); q.onsuccess = function () { ok(q.result); }; q.onerror = function () { erro(q.error); }; }); }); }
  function apagarMural(id) { return dbMural().then(function (db) { return new Promise(function (ok, erro) { var tx = db.transaction('desenhos', 'readwrite'); tx.objectStore('desenhos').delete(id); tx.oncomplete = function () { ok(); }; tx.onerror = function () { erro(tx.error); }; }); }); }
  function verMural() {
    var t = turma();
    mostrar(topo('Mural da turma') + '<div class="au-rolar"><div class="au-coluna"><div id="au-gal" class="au-galeria"></div><p id="au-gal-v" class="au-sub"></p></div></div>', 'mural');
    ao('[data-voltar]', function () { verInicio(); });
    lerMural().then(function (l) {
      l = l.filter(function (d) { return d.turma === t.id; }).reverse();
      var g = $('#au-gal'); if (!g) return;
      if (!l.length) { $('#au-gal-v').textContent = 'Os desenhos da turma vão aparecer aqui. Escolha o Mural da turma ao preparar um encontro.'; return; }
      g.innerHTML = l.map(function (d, i) { return '<button data-d="' + i + '"><img src="' + d.img + '" alt="Desenho da turma: ' + esc(d.titulo) + '"><small>' + esc(d.titulo) + ' · ' + dataCurta(d.em) + '</small></button>'; }).join('');
      ao('[data-d]', function (e) {
        var d = l[+e.currentTarget.dataset.d];
        api.abrirGaveta('<h2>' + esc(d.titulo) + '</h2><img src="' + d.img + '" alt="" style="display:block;width:100%;border-radius:14px;margin:10px 0"><p class="au-sub">' + dataCurta(d.em) + '</p><button class="au-pilula" id="au-d-apagar" style="margin:10px 0">Apagar este desenho</button>', function (gv) {
          $('#au-d-apagar', gv).addEventListener('click', function () { if (!window.confirm('Apagar este desenho?')) return; apagarMural(d.id).then(function () { api.fecharGaveta(); verMural(); }); });
        });
      }, g);
    }).catch(function () { var v = $('#au-gal-v'); if (v) v.textContent = 'Este aparelho não guarda desenhos.'; });
  }

  /* ---------- Diário ---------- */
  function verDiario() {
    var t = turma(), l = t.aulas.slice().reverse();
    mostrar(topo('Diário da turma') + '<div class="au-rolar"><div class="au-coluna">' +
      (l.length ? '<ul class="au-lista">' + l.map(function (a) { return '<li><span class="txt"><b>' + esc(a.titulo) + '</b><small>' + dataCurta(a.em) + (a.presentes ? ' · ' + a.presentes + (a.presentes === 1 ? ' criança' : ' crianças') : '') + (a.gestos ? ' · ' + a.gestos + (a.gestos === 1 ? ' gesto bom visto' : ' gestos bons vistos') : '') + (a.aval ? ' · ' + esc(a.aval) : '') + '</small>' + (a.nota ? '<span style="display:block;margin-top:4px">' + esc(a.nota) + '</span>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="au-sub">Os encontros aparecem aqui, com as suas anotações.</p>') +
      '</div></div>', 'diario');
    ao('[data-voltar]', function () { verInicio(); });
  }
};
