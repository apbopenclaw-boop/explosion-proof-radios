/* ── Radios Footer Component ── */
(function(){
  var i18n = {
    en: {
      serif: 'Engineering reference for hazardous area radio communications.',
      disc: 'This site provides engineering comparison information only. It is not a substitute for a site-specific Ex inspection, DSEAR assessment, or the manufacturer\u2019s current Certificate of Conformity. Always verify certification documentation before deployment.',
      refLabel: 'References',
      alsoLabel: 'Also see',
      bottom: ['\u00a9 2026 \u00b7 explosionproofradios.com \u00b7 Rev 2026.06', 'Engineering reference \u2014 not a safety certificate.'],
      alsoLinks: [['https://intrinsicallysafephones.com','intrinsicallysafephones.com'],['https://xshielder.com','Xshielder \u2014 ATEX smartphone solutions']]
    },
    de: {
      serif: 'Technische Referenz f\u00fcr Funkkommunikation in explosionsgef\u00e4hrdeten Bereichen.',
      disc: 'Diese Website dient ausschlie\u00dflich zu technischen Vergleichszwecken. Sie ersetzt weder eine standortspezifische Ex-Pr\u00fcfung noch eine DSEAR-Bewertung noch das aktuelle Konformit\u00e4tszertifikat des Herstellers. \u00dcberpr\u00fcfen Sie vor dem Einsatz stets die Zertifizierungsunterlagen.',
      refLabel: 'Referenzen',
      alsoLabel: 'Siehe auch',
      bottom: ['\u00a9 2026 \u00b7 explosionproofradios.com \u00b7 Rev. 2026.06', 'Technische Referenz \u2013 kein Sicherheitszertifikat.'],
      alsoLinks: [['https://intrinsicallysafephones.com','intrinsicallysafephones.com'],['https://xshielder.com','Xshielder \u2013 ATEX-Smartphone-L\u00f6sungen']]
    },
    es: {
      serif: 'Referencia t\u00e9cnica para las comunicaciones por radio en zonas peligrosas.',
      disc: 'Este sitio web ofrece \u00fanicamente informaci\u00f3n comparativa de car\u00e1cter t\u00e9cnico. No sustituye a una inspecci\u00f3n Ex espec\u00edfica del emplazamiento, a una evaluaci\u00f3n DSEAR ni al certificado de conformidad vigente del fabricante. Compruebe siempre la documentaci\u00f3n de certificaci\u00f3n antes de la puesta en servicio.',
      refLabel: 'Referencias',
      alsoLabel: 'V\u00e9ase tambi\u00e9n',
      bottom: ['\u00a9 2026 \u00b7 explosionproofradios.com \u00b7 Rev. 2026.06', 'Referencia t\u00e9cnica \u2014 no es un certificado de seguridad.'],
      alsoLinks: [['https://intrinsicallysafephones.com','intrinsicallysafephones.com'],['https://xshielder.com','Xshielder \u2014 Soluciones para smartphones conformes con ATEX']]
    },
    nl: {
      serif: 'Technische referentie voor radiocommunicatie in gevaarlijke omgevingen.',
      disc: 'Deze website biedt uitsluitend technische vergelijkingsinformatie. Het is geen vervanging voor een locatiespecifieke Ex-inspectie, een DSEAR-beoordeling of het actuele conformiteitscertificaat van de fabrikant. Controleer altijd de certificeringsdocumentatie v\u00f3\u00f3r ingebruikname.',
      refLabel: 'Referenties',
      alsoLabel: 'Zie ook',
      bottom: ['\u00a9 2026 \u00b7 explosionproofradios.com \u00b7 Rev 2026.06', 'Technische referentie \u2014 geen veiligheidscertificaat.'],
      alsoLinks: [['https://intrinsicallysafephones.com','intrinsicallysafephones.com'],['https://xshielder.com','Xshielder \u2014 ATEX-smartphoneoplossingen']]
    },
    'pt-br': {
      serif: 'Refer\u00eancia t\u00e9cnica para comunica\u00e7\u00f5es via r\u00e1dio em \u00e1reas perigosas.',
      disc: 'Este site fornece apenas informa\u00e7\u00f5es de compara\u00e7\u00e3o t\u00e9cnica. Ele n\u00e3o substitui uma inspe\u00e7\u00e3o Ex espec\u00edfica para o local, uma avalia\u00e7\u00e3o DSEAR ou o Certificado de Conformidade atual do fabricante. Sempre verifique a documenta\u00e7\u00e3o de certifica\u00e7\u00e3o antes da implanta\u00e7\u00e3o.',
      refLabel: 'Refer\u00eancias',
      alsoLabel: 'Veja tamb\u00e9m',
      bottom: ['\u00a9 2026 \u00b7 explosionproofradios.com \u00b7 Rev. 2026.06', 'Refer\u00eancia t\u00e9cnica \u2014 n\u00e3o \u00e9 um certificado de seguran\u00e7a.'],
      alsoLinks: [['https://intrinsicallysafephones.com','intrinsicallysafephones.com'],['https://xshielder.com','Xshielder \u2014 Solu\u00e7\u00f5es para smartphones em conformidade com a ATEX']]
    }
  };

  var lang = 'en';
  var p = window.location.pathname;
  if (p.indexOf('/de/') === 0) lang = 'de';
  else if (p.indexOf('/es/') === 0) lang = 'es';
  else if (p.indexOf('/nl/') === 0) lang = 'nl';
  else if (p.indexOf('/pt-br/') === 0) lang = 'pt-br';
  var t = i18n[lang] || i18n.en;

  var refs = [
    ['https://www.iecex.com','IECEx Online Certificate System'],
    ['https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0034','ATEX Directive 2014/34/EU'],
    ['https://webstore.iec.ch/en/publication/622','IEC 60079 series'],
    ['https://www.legislation.gov.uk/uksi/2002/2776/contents/made','DSEAR 2002 (UK)']
  ];

  function linkList(items, opacity) {
    return items.map(function(item) {
      return '<li style="margin-bottom:10px"><a style="opacity:' + opacity + '" href="' + item[0] + '"' + (item[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + item[1] + '</a></li>';
    }).join('');
  }

  var el = document.getElementById('footer-placeholder');
  if (!el) return;
  el.outerHTML =
    '<footer class="site-footer">' +
      '<div style="max-width:1140px;margin:0 auto;padding:80px 24px 40px">' +
        '<div style="display:grid;grid-template-columns:repeat(1,1fr);gap:40px">' +
          '<div>' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">' +
              '<svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2.5l11.5 6.5v13L16 28.5 4.5 22V9L16 2.5Z" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/><rect x="10" y="8" width="12" height="16" rx="2" stroke="#ffffff" stroke-width="1.6"/><circle cx="16" cy="12" r="1.4" fill="#22c55e"/><line x1="16" y1="4" x2="16" y2="8" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/></svg>' +
              '<span style="font-weight:600;font-size:15px">explosionproofradios<span style="opacity:0.6;font-weight:400">.com</span></span>' +
            '</div>' +
            '<p class="serif" style="font-size:28px;line-height:1.15;max-width:22ch">' + t.serif + '</p>' +
            '<p style="font-size:13.5px;margin-top:16px;opacity:0.7;line-height:1.6;max-width:60ch">' + t.disc + '</p>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px">' +
            '<div>' +
              '<div class="mono" style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px">' + t.refLabel + '</div>' +
              '<ul style="list-style:none;font-size:14px">' + linkList(refs, 0.9) + '</ul>' +
            '</div>' +
            '<div>' +
              '<div class="mono" style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px">' + t.alsoLabel + '</div>' +
              '<ul style="list-style:none;font-size:14px">' + linkList(t.alsoLinks, 0.8) + '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="hr-rule" style="background:#1f1f1f;margin:40px 0"></div>' +
        '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;font-size:12px;opacity:0.6">' +
          '<div>' + t.bottom[0] + '</div>' +
          '<div>' + t.bottom[1] + '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';

  /* Footer responsive grid */
  var style = document.createElement('style');
  style.textContent = '@media(min-width:1024px){.site-footer>div>div:first-child{grid-template-columns:5fr 7fr;}}';
  document.head.appendChild(style);
})();
