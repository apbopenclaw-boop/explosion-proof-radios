/* explosionproofradios.com — shared behaviour (see /DESIGN.md).
   - Guides dropdown: click/keyboard, aria-expanded, Escape, outside click.
   - Mobile menu: real dialog (focus in, focus trap, Escape, scroll lock, focus back).
   - Forms marked data-isp-form: inline errors, "Sending…", success/failure,
     delivered via Web3Forms (JSON API). The inbox address is never in the page. */
(function () {
  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    en: { sending: 'Sending…', required: 'Please fill in this field.', email: 'Please enter a valid email address, like name@company.com.', fail: 'Could not send. Check your connection and try again.', ok: 'Thanks. We will reply by email.', inquire: 'Price and availability request: ' },
    de: { sending: 'Wird gesendet…', required: 'Bitte füllen Sie dieses Feld aus.', email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@firma.de.', fail: 'Senden fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.', ok: 'Danke. Wir antworten per E-Mail.', inquire: 'Anfrage zu Preis und Verfügbarkeit: ' },
    es: { sending: 'Enviando…', required: 'Rellene este campo.', email: 'Introduzca un correo válido, por ejemplo nombre@empresa.com.', fail: 'No se pudo enviar. Compruebe su conexión e inténtelo de nuevo.', ok: 'Gracias. Le responderemos por correo electrónico.', inquire: 'Solicitud de precio y disponibilidad: ' },
    pt: { sending: 'Enviando…', required: 'Preencha este campo.', email: 'Informe um e-mail válido, por exemplo nome@empresa.com.', fail: 'Não foi possível enviar. Verifique sua conexão e tente novamente.', ok: 'Obrigado. Responderemos por e-mail.', inquire: 'Pedido de preço e disponibilidade: ' },
    nl: { sending: 'Verzenden…', required: 'Vul dit veld in.', email: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.', fail: 'Verzenden mislukt. Controleer uw verbinding en probeer het opnieuw.', ok: 'Bedankt. We antwoorden per e-mail.', inquire: 'Aanvraag prijs en beschikbaarheid: ' }
  };
  var t = T[LANG] || T.en;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------- Guides dropdown ---------- */
  document.querySelectorAll('.dd').forEach(function (dd) {
    var btn = dd.querySelector('.dd-toggle');
    if (!btn) return;
    function set(open) { dd.classList.toggle('dd-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(!dd.classList.contains('dd-open')); });
    dd.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dd.classList.contains('dd-open')) { set(false); btn.focus(); } });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) set(false); });
  });

  /* ---------- Mobile menu (dialog) ---------- */
  var menu = document.getElementById('mobileMenu');
  var opener = document.querySelector('[data-menu-open]');
  if (menu && opener) {
    var panel = menu.querySelector('.mobile-drawer');
    function open() {
      menu.hidden = false;
      document.documentElement.classList.add('menu-open');
      opener.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      var c = menu.querySelector('button[data-menu-close]'); if (c) setTimeout(function () { c.focus(); }, 30);
    }
    function close() {
      menu.classList.remove('is-open');
      document.documentElement.classList.remove('menu-open');
      opener.setAttribute('aria-expanded', 'false');
      setTimeout(function () { menu.hidden = true; }, 200);
      opener.focus();
    }
    opener.addEventListener('click', open);
    menu.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', close); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { if (a.hash && a.pathname === location.pathname) close(); }); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var items = [].filter.call(panel.querySelectorAll(FOCUSABLE), function (n) { return n.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Forms ---------- */
  // Web3Forms (replaced FormSubmit 2026-09-30 after its outage). The access key is public by design and maps
  // to the owner's inbox, so no address is in the page.
  var W3F_KEY = '930572e9-b94e-4d18-9c2b-25999a09ef0f';
  var ENDPOINT = 'https://api.web3forms.com/submit';
  var TIMEOUT_MS = 15000;
  function errorFor(f) {
    if (f.type === 'hidden' || f.disabled || f.classList.contains('hp-input')) return '';
    var v = (f.value || '').trim();
    if (f.required && !v) return t.required;
    if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return t.email;
    return '';
  }
  function showError(f, msg) {
    var id = f.id + '-err', el = document.getElementById(id);
    if (!msg) { f.removeAttribute('aria-invalid'); if (el) el.hidden = true; return; }
    if (!el) { el = document.createElement('p'); el.className = 'field-error'; el.id = id; f.insertAdjacentElement('afterend', el); f.setAttribute('aria-describedby', id); }
    el.textContent = msg; el.hidden = false; f.setAttribute('aria-invalid', 'true');
  }
  document.querySelectorAll('form[data-isp-form]').forEach(function (form) {
    form.noValidate = true;
    var status = form.parentNode.querySelector('[data-form-status]');
    var btn = form.querySelector('[type=submit]');
    var label = btn ? btn.innerHTML : '';
    // Pre-fill from an "Inquire" link: /?inquire=Product#contact
    var inquire = new URLSearchParams(location.search).get('inquire');
    var msg = form.querySelector('textarea[name=message]');
    if (inquire && msg && !msg.value) msg.value = t.inquire + inquire.slice(0, 80) + '\n\n';
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') showError(e.target, errorFor(e.target)); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      [].forEach.call(form.elements, function (f) { if (!f.name) return; var m = errorFor(f); showError(f, m); if (m && !bad) bad = f; });
      if (bad) { bad.focus(); return; }
      var hp = form.querySelector('.hp-input'); if (hp && hp.value) return;   // spam trap
      var data = { access_key: W3F_KEY, subject: form.getAttribute('data-subject') || 'explosionproofradios.com enquiry', from_name: 'explosionproofradios.com', page: location.href };
      [].forEach.call(form.elements, function (f) { if (f.name && f.type !== 'submit' && !f.classList.contains('hp-input')) data[f.name] = f.value; });
      if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = t.sending; }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;   // never hang on 'Sending…'
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data), signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { clearTimeout(timer); return r.json(); })
        .then(function (j) {
          if (!j || String(j.success) !== 'true') throw new Error((j && (j.message || (j.body && j.body.message))) || 'send failed');
          form.hidden = true;
          if (status) { status.className = 'form-status form-status--ok'; status.setAttribute('role', 'status'); status.textContent = form.getAttribute('data-success') || t.ok; status.hidden = false; status.setAttribute('tabindex', '-1'); status.focus(); }
        })
        .catch(function (err) {
          clearTimeout(timer); if (window.console) console.warn('Form not sent:', err && err.message);
          if (status) { status.className = 'form-status form-status--error'; status.setAttribute('role', 'alert'); status.textContent = t.fail; status.hidden = false; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = label; } });
    });
  });
})();
