/* ── Radios Nav Component ── */
(function(){
  var i18n = {
    en: {
      nav: ['Radios','Certification','DMR vs TETRA vs PoC','Contact'],
      anchors: ['/#solutions','/#certification','/#technology','/#contact'],
      mobile: ['Home','Radios','Certification','DMR vs TETRA vs PoC','Contact','DP4401Ex vs NX-330EXE'],
      mobileHrefs: ['/','/#solutions','/#certification','/#technology','/#contact','/motorola-dp4401ex-vs-kenwood-nx330exe.html'],
      subtitle: 'ATEX \u00b7 IECEx reference',
      rev: 'Rev 2026.06 \u00b7 IEC 60079',
      compare: 'Compare',
      menu: 'Menu'
    },
    de: {
      nav: ['Funkger\u00e4te','Zertifizierung','DMR vs. TETRA vs. PoC','Kontakt'],
      anchors: ['/#solutions','/#certification','/#technology','/#contact'],
      mobile: ['Startseite','Funkger\u00e4te','Zertifizierung','DMR vs. TETRA vs. PoC','Kontakt'],
      mobileHrefs: ['/de/','/de/#solutions','/de/#certification','/de/#technology','/de/#contact'],
      subtitle: 'ATEX \u00b7 IECEx-Referenz',
      rev: 'Rev. 2026.06 \u00b7 IEC 60079',
      compare: 'Vergleichen',
      menu: 'Men\u00fc'
    },
    es: {
      nav: ['Radios','Certificaci\u00f3n','DMR, TETRA y PoC','Contacto'],
      anchors: ['/#solutions','/#certification','/#technology','/#contact'],
      mobile: ['Inicio','Radios','Certificaci\u00f3n','DMR, TETRA y PoC','Contacto'],
      mobileHrefs: ['/es/','/es/#solutions','/es/#certification','/es/#technology','/es/#contact'],
      subtitle: 'Referencia ATEX \u00b7 IECEx',
      rev: 'Ref. t\u00e9cnica \u00b7 junio 2026',
      compare: 'Comparar',
      menu: 'Men\u00fa'
    },
    nl: {
      nav: ['Portofoons','Certificering','DMR vs TETRA vs PoC','Contact'],
      anchors: ['/#solutions','/#certification','/#technology','/#contact'],
      mobile: ['Home','Radiocertificering','DMR vs TETRA vs PoC','Contact'],
      mobileHrefs: ['/nl/','/nl/#solutions','/nl/#certification','/nl/#technology','/nl/#contact'],
      subtitle: 'ATEX \u00b7 IECEx-referentie',
      rev: 'Rev 2026.06 \u00b7 IEC 60079',
      compare: 'Vergelijken',
      menu: 'Menu'
    },
    'pt-br': {
      nav: ['R\u00e1dios','Certifica\u00e7\u00e3o','DMR x TETRA x PoC','Contato'],
      anchors: ['/#solutions','/#certification','/#technology','/#contact'],
      mobile: ['P\u00e1gina inicial','Certifica\u00e7\u00e3o','DMR vs TETRA vs PoC','Contato'],
      mobileHrefs: ['/pt-br/','/pt-br/#solutions','/pt-br/#certification','/pt-br/#technology','/pt-br/#contact'],
      subtitle: 'Refer\u00eancia ATEX \u00b7 IECEx',
      rev: 'Ref. de eng. \u00b7 junho 2026',
      compare: 'Comparar',
      menu: 'Menu'
    }
  };

  var lang = document.documentElement.lang || 'en';
  var p = window.location.pathname;
  if (p.indexOf('/de/') === 0) lang = 'de';
  else if (p.indexOf('/es/') === 0) lang = 'es';
  else if (p.indexOf('/nl/') === 0) lang = 'nl';
  else if (p.indexOf('/pt-br/') === 0) lang = 'pt-br';
  else lang = 'en';
  var t = i18n[lang] || i18n.en;
  var prefix = lang === 'en' ? '' : '/' + lang;
  var isSubpage = (lang === 'en') ? (p !== '/' && p !== '/index.html') : (p !== prefix + '/' && p !== prefix + '/index.html');

  function rootHref(anchor) {
    if (isSubpage) return prefix + anchor;
    return anchor;
  }

  var langOpts = [
    {v: '/', label: '\ud83c\uddec\ud83c\udde7 EN', lang: 'en'},
    {v: '/de/', label: '\ud83c\udde9\ud83c\uddea DE', lang: 'de'},
    {v: '/nl/', label: '\ud83c\uddf3\ud83c\uddf1 NL', lang: 'nl'},
    {v: '/es/', label: '\ud83c\uddea\ud83c\uddf8 ES', lang: 'es'},
    {v: '/pt-br/', label: '\ud83c\udde7\ud83c\uddf7 PT', lang: 'pt-br'}
  ];

  function langSelect(cls) {
    var s = '<select class="lang-select' + (cls ? ' ' + cls : '') + '" onchange="if(this.value)window.location=this.value" aria-label="Language">';
    langOpts.forEach(function(o) {
      s += '<option value="' + o.v + '"' + (o.lang === lang ? ' selected' : '') + '>' + o.label + '</option>';
    });
    return s + '</select>';
  }

  var navLinks = '';
  t.nav.forEach(function(label, i) {
    navLinks += '<a href="' + rootHref(t.anchors[i]) + '" style="transition:color .15s" onmouseover="this.style.color=\'var(--ink)\'" onmouseout="this.style.color=\'\'">' + label + '</a>';
  });

  var mobileLinks = '';
  t.mobile.forEach(function(label, i) {
    mobileLinks += '<a href="' + t.mobileHrefs[i] + '" class="mobile-nav-link">' + label + '</a>';
  });

  var el = document.getElementById('nav-placeholder');
  if (!el) return;
  el.outerHTML =
    '<header class="glass" style="position:sticky;top:0;z-index:30">' +
      '<div style="max-width:1140px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;gap:24px">' +
        '<a href="' + (prefix || '/') + '" style="display:flex;align-items:center;gap:10px;flex-shrink:0">' +
          '<svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2.5l11.5 6.5v13L16 28.5 4.5 22V9L16 2.5Z" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"/><rect x="10" y="8" width="12" height="16" rx="2" stroke="#1a1a1a" stroke-width="1.6"/><circle cx="16" cy="12" r="1.4" fill="#22c55e"/><line x1="16" y1="4" x2="16" y2="8" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round"/></svg>' +
          '<span style="display:flex;flex-direction:column;line-height:1">' +
            '<span style="font-size:15px;font-weight:600;letter-spacing:-0.015em">explosionproofradios<span style="color:var(--ash);font-weight:400">.com</span></span>' +
            '<span class="mono" style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.16em;margin-top:4px;color:var(--ash)">' + t.subtitle + '</span>' +
          '</span>' +
        '</a>' +
        '<nav style="display:none;align-items:center;gap:24px;font-size:14px;color:var(--graphite)" class="nav-desktop">' + navLinks + '</nav>' +
        '<div style="margin-left:auto;display:flex;align-items:center;gap:12px">' +
          '<span class="mono nav-rev" style="display:none;font-size:11.5px;color:var(--ash)">' + t.rev + '</span>' +
          '<button id="compareToggle" class="btn btn-secondary" style="display:none;padding:8px 16px;font-size:13px">' + t.compare + ' <span class="badge badge-neutral" style="padding:0 8px;margin-left:4px" id="compareCount">0</span></button>' +
          langSelect('') +
          '<button onclick="document.getElementById(\'mobileMenu\').classList.remove(\'hidden\')" class="nav-burger" style="display:none;padding:8px;margin-right:-8px;background:none;border:none;cursor:pointer" aria-label="Open menu">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div id="mobileMenu" class="hidden" style="position:fixed;inset:0;z-index:40">' +
      '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(4px)" onclick="document.getElementById(\'mobileMenu\').classList.add(\'hidden\')"></div>' +
      '<div class="mobile-drawer" style="position:absolute;right:0;top:0;bottom:0;width:280px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow-y:auto">' +
        '<div style="padding:20px 24px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px">' +
            '<span style="font-weight:600;font-size:14px">' + t.menu + '</span>' +
            '<button onclick="document.getElementById(\'mobileMenu\').classList.add(\'hidden\')" style="padding:6px;border-radius:8px;background:none;border:none;cursor:pointer" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
          '</div>' +
          '<nav style="display:flex;flex-direction:column;gap:4px">' + mobileLinks +
            '<div style="margin:12px 0;height:1px;background:var(--border)"></div>' +
            langSelect('') +
          '</nav>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* Responsive: show/hide desktop nav vs burger */
  var style = document.createElement('style');
  style.textContent = '@media(min-width:768px){.nav-desktop{display:flex!important;}.nav-burger{display:none!important;}}@media(max-width:767px){.nav-burger{display:block!important;}}@media(min-width:1024px){.nav-rev{display:inline!important;}#compareToggle{display:inline-flex!important;}}';
  document.head.appendChild(style);
})();
