/* O mundo das Aulas: um jardim vivo que fica atrás de todas as telas do módulo.
   As telas mudam e o jardim continua: a câmera sobe para ler o plano e desce para plantar a semente do dia.
   Em casa, o céu segue a hora do relógio. Durante o encontro, o "dia" passa: o sol cruza o céu a cada momento.
   As camadas (morros, gramado, grama da frente, nuvens) saem de ferramentas/aulas-arte.cjs. */
window.MundoAulas = function (raiz, opcoes) {
  'use strict';
  var G = opcoes.G, anima = opcoes.anima, serial = 0;
  var el = document.createElement('div');
  el.className = 'au-mundo'; el.dataset.camera = 'jardim';
  el.innerHTML = '<div class="au-ceu" aria-hidden="true"></div><i class="au-estrelas" aria-hidden="true"></i><i class="au-astro" aria-hidden="true"></i>' +
    '<img class="au-nuvem n1" src="arte/aulas/nuvem1.webp" alt=""><img class="au-nuvem n2" src="arte/aulas/nuvem2.webp" alt=""><img class="au-nuvem n3" src="arte/aulas/nuvem1.webp" alt="">' +
    '<div class="au-solo"><div class="au-morros" aria-hidden="true"></div><div class="au-gramado" aria-hidden="true"></div><div class="au-canteiro"></div>' +
    '<div class="au-borboleta" aria-hidden="true"><svg viewBox="0 0 40 30"><g class="asa e"><ellipse cx="11" cy="10" rx="10" ry="9" fill="#F4A9C4"/><ellipse cx="13" cy="21" rx="7" ry="6" fill="#F9C7A0"/></g><g class="asa d"><ellipse cx="29" cy="10" rx="10" ry="9" fill="#F4A9C4"/><ellipse cx="27" cy="21" rx="7" ry="6" fill="#F9C7A0"/></g><ellipse cx="20" cy="15" rx="2" ry="9" fill="#5A4030"/></svg></div>' +
    '<div class="au-frente" aria-hidden="true"></div></div>';
  raiz.insertBefore(el, raiz.firstChild);
  var canteiro = el.querySelector('.au-canteiro'), solo = el.querySelector('.au-solo'), astro = el.querySelector('.au-astro');

  /* ---------- O céu ---------- */
  var DIA = [
    { t: 0, c: ['#86C5F0', '#BDE3F8', '#FFF4DC'], x: 12, y: 30 },
    { t: .4, c: ['#74B8EE', '#ADDAF6', '#E9F6EA'], x: 38, y: 8 },
    { t: .75, c: ['#93B6EA', '#DCD3EE', '#FFE9C4'], x: 68, y: 10 },
    { t: 1, c: ['#A79CE0', '#F0C1CC', '#FFD9A0'], x: 88, y: 28 }
  ];
  function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function mistura(a, b, f) { var x = rgb(a), y = rgb(b); return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * f); }).join(',') + ')'; }
  function pintar(c, x, y, hora) {
    el.style.setProperty('--c1', c[0]); el.style.setProperty('--c2', c[1]); el.style.setProperty('--c3', c[2]);
    astro.style.left = x + '%'; astro.style.top = y + '%';
    el.dataset.hora = hora; raiz.dataset.hora = hora;
  }
  function ceu(t) {
    t = Math.max(0, Math.min(1, t));
    var i = 0; while (i < DIA.length - 2 && t > DIA[i + 1].t) i++;
    var a = DIA[i], b = DIA[i + 1], f = (t - a.t) / (b.t - a.t);
    pintar(a.c.map(function (h, k) { return mistura(h, b.c[k], f); }), a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 'dia');
  }
  function ceuDoHorario() {
    if (opcoes.eNoite()) { pintar(['#151B47', '#2C2E6E', '#66588F'], 80, 8, 'noite'); return; }
    var d = new Date(); ceu((d.getHours() + d.getMinutes() / 60 - 6) / 12);
  }

  /* ---------- As plantas da turma ---------- */
  // Flores de pétalas redondas e arbustos. Nunca quatro pétalas, para não lembrar uma cruz.
  function svgPlanta(i, broto) {
    var CORES = [['#F2A0B4', '#F9D65F'], ['#F7C948', '#A8642C'], ['#B8A2E8', '#FDE58F'], ['#F58D68', '#FFE08A'], ['#7FB5EA', '#FFF2B3'], ['#FFF7EA', '#F6C453']];
    var c = CORES[i % CORES.length], tipo = i % 4, s = '<svg viewBox="0 0 60 100" aria-hidden="true">';
    if (broto) return s + '<path d="M30 98 C 29 86, 31 76, 30 60" fill="none" stroke="#5F8A3F" stroke-width="5" stroke-linecap="round"/><ellipse cx="18" cy="58" rx="14" ry="9" transform="rotate(24 18 58)" fill="#86AE55"/><ellipse cx="42" cy="56" rx="14" ry="9" transform="rotate(-24 42 56)" fill="#9BBF62"/></svg>';
    if (tipo === 3) return s + '<path d="M30 98 V 66" stroke="#6B5237" stroke-width="6" stroke-linecap="round"/><circle cx="17" cy="56" r="15" fill="#5E8A40"/><circle cx="43" cy="56" r="15" fill="#6A9846"/><circle cx="30" cy="38" r="20" fill="#7FAE4F"/><circle cx="24" cy="31" r="8" fill="#A4CC6B" opacity=".7"/><circle cx="23" cy="46" r="3.6" fill="' + c[0] + '"/><circle cx="38" cy="32" r="3.6" fill="' + c[0] + '"/><circle cx="41" cy="55" r="3.6" fill="' + c[0] + '"/><circle cx="17" cy="60" r="3.6" fill="' + c[0] + '"/><circle cx="29" cy="24" r="3.6" fill="' + c[0] + '"/></svg>';
    var pet = [5, 8, 6][tipo], d = tipo === 1 ? 13.5 : 12, rp = tipo === 1 ? 6.6 : 9.4;
    s += '<path d="M30 98 C 27 80, 33 62, 30 36" fill="none" stroke="#4F7F35" stroke-width="4.4" stroke-linecap="round"/><ellipse cx="19" cy="74" rx="11" ry="5.4" transform="rotate(24 19 74)" fill="#7BAA4C"/><ellipse cx="41" cy="64" rx="11" ry="5.4" transform="rotate(-24 41 64)" fill="#92BC5C"/>';
    for (var k = 0; k < pet; k++) { var a = k * 6.2832 / pet - 1.5708; s += '<circle cx="' + (30 + Math.cos(a) * d).toFixed(1) + '" cy="' + (30 + Math.sin(a) * d).toFixed(1) + '" r="' + rp + '" fill="' + c[0] + '"/>'; }
    return s + '<circle cx="30" cy="30" r="' + (tipo === 1 ? 8.4 : 7.4) + '" fill="' + c[1] + '"/></svg>';
  }
  // Lugar fixo de cada planta: com sorteio de semente, a turma reencontra o mesmo jardim.
  function lugarDaPlanta(i) {
    var col = 9, lin = 5, total = col * lin, ordem = [], s = 7, n;
    for (n = 0; n < total; n++) ordem.push(n);
    function r() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    for (n = total - 1; n > 0; n--) { var j = Math.floor(r() * (n + 1)), x = ordem[n]; ordem[n] = ordem[j]; ordem[j] = x; }
    var v = ordem[i % total], cx = v % col, ly = Math.floor(v / col), volta = Math.floor(i / total);
    return { x: 6 + cx * (88 / (col - 1)) + ((i * 37) % 7 - 3) * .7 + volta * 2.4, y: 54 + ly * (36 / (lin - 1)) + ((i * 53) % 5 - 2) * .6, tam: 6 + ly * 1.6 };
  }
  var tmBalao = 0;
  function plantas(t, nova) {
    var aulas = t ? t.aulas : [], h = '';
    aulas.forEach(function (a, i) {
      var l = lugarDaPlanta(i);
      h += '<button class="au-planta' + (nova && i === aulas.length - 1 ? ' nova' : '') + '" data-p="' + i + '" style="left:' + l.x.toFixed(1) + '%;top:' + l.y.toFixed(1) + '%;width:' + l.tam.toFixed(1) + 'vmin;z-index:' + Math.round(l.y) + ';animation-delay:-' + (i % 5) + 's" aria-label="' + opcoes.esc(a.titulo) + ', ' + opcoes.data(a.em) + '">' + svgPlanta(i) + '</button>';
    });
    var vaga = t ? Math.min(t.vagalumes || 0, 30) : 0;
    for (var v = 0; v < vaga; v++) h += '<i class="au-vaga" aria-hidden="true" style="left:' + (5 + (v * 61) % 90) + '%;top:' + (46 + (v * 29) % 44) + '%;animation-delay:-' + (v % 7) + 's"></i>';
    canteiro.innerHTML = h;
    // Tocar numa planta mostra de qual encontro ela nasceu.
    Array.prototype.forEach.call(canteiro.querySelectorAll('[data-p]'), function (b) {
      b.addEventListener('click', function () {
        var a = aulas[+b.dataset.p], velho = canteiro.querySelector('.au-balao'); if (velho) velho.remove();
        var bal = document.createElement('div'); bal.className = 'au-balao'; bal.setAttribute('role', 'status');
        bal.innerHTML = '<b>' + opcoes.esc(a.titulo) + '</b>' + opcoes.data(a.em);
        var x = parseFloat(b.style.left); bal.style.left = Math.max(14, Math.min(86, x)) + '%'; bal.style.top = b.style.top;
        var alt = b.getBoundingClientRect().height; bal.style.marginTop = -(alt + 8) + 'px';
        canteiro.appendChild(bal);
        b.classList.remove('toque'); void b.offsetWidth; b.classList.add('toque');
        if (opcoes.som) opcoes.som('suave');
        clearTimeout(tmBalao); tmBalao = setTimeout(function () { bal.remove(); }, 3600);
      });
    });
  }
  // A entrada: o gramado sobe e as plantas brotam. Acontece uma vez, ao abrir o módulo.
  function entrada() {
    if (!anima) return;
    solo.style.transition = 'none';
    G.fromTo(solo, { yPercent: 34 }, { yPercent: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform', onComplete: function () { solo.style.transition = ''; } });
    var ps = canteiro.querySelectorAll('.au-planta svg');
    if (ps.length) G.from(ps, { scale: 0, transformOrigin: '50% 100%', duration: .7, ease: 'back.out(1.7)', stagger: Math.min(.06, .9 / ps.length), delay: .5, clearProps: 'transform' });
  }

  /* ---------- O Brotinho ---------- */
  // Personagem do módulo: uma semente que acaba de brotar. Não fala de doutrina: só acompanha e comemora.
  function svgBrotinho() {
    var id = 'brt' + (++serial);
    return '<svg class="brt" viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="' + id + 'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9D694"/><stop offset="1" stop-color="#E0A052"/></linearGradient><linearGradient id="' + id + 'f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#BFE07A"/><stop offset="1" stop-color="#5F9A40"/></linearGradient></defs>' +
      '<g class="brt-folhas"><path d="M50 46 C 50 42, 50 40, 50 36" stroke="#5F9A40" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 38 C 40 20, 22 15, 10 21 C 15 39, 34 45, 50 38 Z" fill="url(#' + id + 'f)"/><path d="M50 38 C 58 15, 78 5, 91 11 C 89 30, 68 45, 50 38 Z" fill="url(#' + id + 'f)"/></g>' +
      '<ellipse cx="38" cy="112" rx="9" ry="5.5" fill="#C98A4B"/><ellipse cx="62" cy="112" rx="9" ry="5.5" fill="#C98A4B"/>' +
      '<path d="M50 41 C 74 41, 86 58, 85 78 C 84 100, 69 112, 50 112 C 31 112, 16 100, 15 78 C 14 58, 26 41, 50 41 Z" fill="url(#' + id + 'c)"/><ellipse cx="38" cy="56" rx="11" ry="6" fill="#FFF0CC" opacity=".6"/>' +
      '<ellipse cx="27" cy="85" rx="7" ry="4.6" fill="#EE8E7E" opacity=".5"/><ellipse cx="73" cy="85" rx="7" ry="4.6" fill="#EE8E7E" opacity=".5"/>' +
      '<g class="brt-olhos"><ellipse cx="38" cy="75" rx="6" ry="7.6" fill="#2B2236"/><ellipse cx="62" cy="75" rx="6" ry="7.6" fill="#2B2236"/><circle cx="40" cy="72" r="2.2" fill="#FFF"/><circle cx="64" cy="72" r="2.2" fill="#FFF"/></g>' +
      '<path d="M41 90 Q 50 99 59 90" fill="none" stroke="#7A4A22" stroke-width="3.2" stroke-linecap="round"/></svg>';
  }
  function pular(no) { no.classList.remove('feliz'); void no.offsetWidth; no.classList.add('feliz'); }

  ceuDoHorario();
  return {
    camera: function (c) { el.dataset.camera = c; }, ceu: ceu, ceuDoHorario: ceuDoHorario, plantas: plantas, entrada: entrada,
    svgPlanta: svgPlanta, svgBrotinho: svgBrotinho, pular: pular
  };
};
