#!/usr/bin/env python3
"""Rebuild the shared page chrome on every page (see DESIGN.md). Safe to re-run.

- <head>: shared CSS (assets/tw.css + assets/site.css) instead of cdn.tailwindcss.com,
  favicon set, no build-tool leftovers; page <style> blocks lose their copies of shared
  rules (tokens, nav, buttons, badges, cards), keeping only page-specific rules.
- Skip link, one accessible header (EN/DE/NL/ES/PT-BR), dialog-style mobile menu, footer.
- <main id="main"> on every page; assets/site.js loaded once.
- The network consent banner loads before any Google tag (Consent Mode defaults first).
Pages without a site header (404) only get the <head> clean-up and site.js.

Usage (from the repo root): python3 scripts/build_chrome.py
"""
import pathlib, re, html

LANGS = ['en', 'de', 'nl', 'es', 'pt-br']
LABEL = {'en': 'EN', 'de': 'DE', 'nl': 'NL', 'es': 'ES', 'pt-br': 'PT'}
def _paths(name):
    return {l: ('/' if l == 'en' else f'/{l}/') + name for l in LANGS}
PAGES = {
    'home': {l: ('/' if l == 'en' else f'/{l}/') for l in LANGS},
    'isradios': _paths('intrinsically-safe-radios.html'),
    'twoway': _paths('intrinsically-safe-two-way-radios.html'),
    'motorola': _paths('motorola-intrinsically-safe-radios.html'),
    'vs': _paths('motorola-dp4401ex-vs-kenwood-nx330exe.html'),
    'privacy': _paths('privacy.html'),
}
GUIDES = ['vs', 'isradios', 'twoway', 'motorola']
EN_G = {'isradios': 'Intrinsically Safe Radios', 'twoway': 'Intrinsically Safe Two-Way Radios',
        'motorola': 'Motorola Intrinsically Safe Radios', 'vs': 'DP4401Ex vs NX-330EXE'}
def _nav(lang, radios, cert, tech, contact):
    h = PAGES['home'][lang]
    return [(radios, h + '#solutions'), ('GUIDES', None), (cert, h + '#certification'), (tech, h + '#technology'), (contact, h + '#contact')]
S = {
 'en': dict(skip='Skip to content', menu='Menu', open='Open menu', close='Close menu', guides='Guides', lang='Language', cmp='Compare',
   nav=_nav('en', 'Radios', 'Certification', 'Technologies', 'Contact'), contact='/#contact', home='Home', rev='Rev 2026.09 · IEC 60079', tag='ATEX · IECEx reference',
   g={'isradios': (EN_G['isradios'], 'Ex ia and Ex ib radios explained'), 'twoway': (EN_G['twoway'], 'Zone 1 two-way radios by industry'),
      'motorola': (EN_G['motorola'], 'MOTOTRBO and TETRA Ex series'), 'vs': (EN_G['vs'], 'Motorola and Kenwood head to head')},
   foot='Engineering reference, not a safety certificate.', privacy='Privacy', contact_l='Contact', network='Part of the Hazardous Area Guide network'),
 'de': dict(skip='Zum Inhalt springen', menu='Menü', open='Menü öffnen', close='Menü schließen', guides='Ratgeber', lang='Sprache', cmp='Vergleichen',
   nav=_nav('de', 'Funkgeräte', 'Zertifizierung', 'Technologien', 'Kontakt'), contact='/de/#contact', home='Startseite', rev='Rev 2026.09 · IEC 60079', tag='ATEX · IECEx Referenz',
   g={'isradios': (EN_G['isradios'] + ' (EN)', 'Ex-ia- und Ex-ib-Funkgeräte erklärt'), 'twoway': (EN_G['twoway'] + ' (EN)', 'Zone-1-Funkgeräte nach Branche'),
      'motorola': (EN_G['motorola'] + ' (EN)', 'MOTOTRBO- und TETRA-Ex-Serien'), 'vs': ('DP4401Ex vs. NX-330EXE', 'Motorola und Kenwood im direkten Vergleich')},
   foot='Technische Referenz, kein Sicherheitszertifikat.', privacy='Datenschutz', contact_l='Kontakt', network='Teil des Hazardous-Area-Guide-Netzwerks'),
 'nl': dict(skip='Naar inhoud', menu='Menu', open='Menu openen', close='Menu sluiten', guides='Gidsen', lang='Taal', cmp='Vergelijken',
   nav=_nav('nl', 'Portofoons', 'Certificering', 'Technologieën', 'Contact'), contact='/nl/#contact', home='Home', rev='Rev 2026.09 · IEC 60079', tag='ATEX · IECEx referentie',
   g={'isradios': (EN_G['isradios'] + ' (EN)', 'Ex ia- en Ex ib-portofoons uitgelegd'), 'twoway': (EN_G['twoway'] + ' (EN)', 'Zone 1-portofoons per sector'),
      'motorola': (EN_G['motorola'] + ' (EN)', 'MOTOTRBO- en TETRA-Ex-series'), 'vs': ('DP4401Ex vs NX-330EXE', 'Motorola en Kenwood rechtstreeks vergeleken')},
   foot='Technische referentie, geen veiligheidscertificaat.', privacy='Privacy', contact_l='Contact', network='Onderdeel van het Hazardous Area Guide-netwerk'),
 'es': dict(skip='Saltar al contenido', menu='Menú', open='Abrir menú', close='Cerrar menú', guides='Guías', lang='Idioma', cmp='Comparar',
   nav=_nav('es', 'Radios', 'Certificación', 'Tecnologías', 'Contacto'), contact='/es/#contact', home='Inicio', rev='Rev 2026.09 · IEC 60079', tag='Referencia ATEX · IECEx',
   g={'isradios': (EN_G['isradios'] + ' (EN)', 'Radios Ex ia y Ex ib explicadas'), 'twoway': (EN_G['twoway'] + ' (EN)', 'Radios para Zona 1 por sector'),
      'motorola': (EN_G['motorola'] + ' (EN)', 'Series Ex MOTOTRBO y TETRA'), 'vs': ('DP4401Ex vs NX-330EXE', 'Motorola y Kenwood cara a cara')},
   foot='Referencia técnica, no un certificado de seguridad.', privacy='Privacidad', contact_l='Contacto', network='Parte de la red Hazardous Area Guide'),
 'pt-br': dict(skip='Pular para o conteúdo', menu='Menu', open='Abrir menu', close='Fechar menu', guides='Guias', lang='Idioma', cmp='Comparar',
   nav=_nav('pt-br', 'Rádios', 'Certificação', 'Tecnologias', 'Contato'), contact='/pt-br/#contact', home='Início', rev='Rev 2026.09 · IEC 60079', tag='Referência ATEX · IECEx',
   g={'isradios': (EN_G['isradios'] + ' (EN)', 'Rádios Ex ia e Ex ib explicados'), 'twoway': (EN_G['twoway'] + ' (EN)', 'Rádios para Zona 1 por setor'),
      'motorola': (EN_G['motorola'] + ' (EN)', 'Séries Ex MOTOTRBO e TETRA'), 'vs': ('DP4401Ex vs NX-330EXE', 'Motorola e Kenwood frente a frente')},
   foot='Referência técnica, não um certificado de segurança.', privacy='Privacidade', contact_l='Contato', network='Parte da rede Hazardous Area Guide'),
}
LOGO = ('<svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">'
        '<path d="M16 2.5l11.5 6.5v13L16 28.5 4.5 22V9L16 2.5Z" stroke="#1a1a1a" stroke-width="1.6" stroke-linejoin="round"/>'
        '<rect x="10" y="8" width="12" height="16" rx="2" stroke="#1a1a1a" stroke-width="1.6"/>'
        '<circle cx="16" cy="12" r="1.4" fill="#22c55e"/>'
        '<line x1="16" y1="4" x2="16" y2="8" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round"/></svg>')

def guide_href(g, lang):
    """Translated guide if it exists, else the English one (marked (EN) in the labels)."""
    u = PAGES[g][lang]
    return u if exists(u) else PAGES[g]['en']

def page_key(rel):
    url = '/' + (rel[:-len('index.html')] if rel.endswith('index.html') else rel)
    for k, v in PAGES.items():
        for l, u in v.items():
            if u == url:
                return k, l, url
    lang = rel.split('/')[0] if rel.split('/')[0] in LANGS else 'en'
    return None, lang, url

def exists(url):
    return pathlib.Path(url.lstrip('/') + ('index.html' if url.endswith('/') else '')).exists()

def lang_links(key, lang, cls=''):
    out = []
    for l in LANGS:
        target = PAGES.get(key or 'home', PAGES['home'])[l]
        if not exists(target):
            target = PAGES['home'][l]
        cur = ' aria-current="true"' if l == lang else ''
        out.append(f'<a href="{target}" hreflang="{l}" lang="{l}"{cur}{cls}>{LABEL[l]}</a>')
    return out

def chrome(key, lang, url, compare):
    t = S[lang]
    home = PAGES['home'][lang]
    cur = lambda u: ' aria-current="page"' if url == u else ''
    items = []
    for label, href in t['nav']:
        if href is None:
            gl = ''.join(f'<a href="{guide_href(g, lang)}" class="dd-item"{cur(guide_href(g, lang))}><span class="dd-item-title">{html.escape(t["g"][g][0])}</span>'
                         f'<span class="dd-item-desc">{html.escape(t["g"][g][1])}</span></a>' for g in GUIDES)
            items.append(f'<div class="dd relative"><button type="button" class="dd-toggle" aria-expanded="false" aria-controls="guides-panel">{t["guides"]} '
                         '<svg width="12" height="12" viewBox="0 0 12 12" class="dd-chev" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
                         f'<div class="dd-panel" id="guides-panel">{gl}</div></div>')
        else:
            items.append(f'<a href="{href}" class="nav-link">{html.escape(label)}</a>')
    compare_btn = ('\n      <button id="compareToggle" type="button" class="btn btn-secondary !py-2 !px-4 !text-[13px] hidden lg:inline-flex">'
                   f'{t["cmp"]} <span class="badge badge-neutral !py-0 !px-2 ml-1" id="compareCount">0</span></button>') if compare else ''
    drawer_links = ''.join(f'\n        <a href="{h}" class="mobile-nav-link">{html.escape(l)}</a>' for l, h in t['nav'] if h)
    drawer_guides = ''.join(f'\n        <a href="{guide_href(g, lang)}" class="mobile-nav-link !pl-5"{cur(guide_href(g, lang))}>{html.escape(t["g"][g][0])}</a>' for g in GUIDES)
    return f'''<a class="skip-link" href="#main">{t["skip"]}</a>
<header class="site-header glass sticky top-0 z-30">
  <div class="max-w-[1140px] mx-auto px-4 md:px-6 min-h-16 py-2 flex items-center gap-3 md:gap-6">
    <a href="{home}" class="brand flex items-center gap-2.5">
      {LOGO}
      <span class="flex flex-col leading-none min-w-0">
        <span class="brand-name">explosionproofradios<span style="color:var(--ash)" class="font-normal hidden sm:inline">.com</span></span>
        <span class="brand-tag hidden sm:block">{t["tag"]}</span>
      </span>
    </a>
    <nav class="hidden md:flex items-center gap-6 text-[14px]" aria-label="Main">
      {"".join(items)}
    </nav>
    <div class="ml-auto flex items-center gap-2 md:gap-3">
      <span class="hidden 2xl:inline whitespace-nowrap mono text-[11.5px]" style="color:var(--ash)">{t["rev"]}</span>
      <nav class="hidden md:flex items-center gap-2 mono text-[12px]" aria-label="{t["lang"]}">{" ".join(lang_links(key, lang, ' class="nav-link"'))}</nav>{compare_btn}
      <button type="button" class="icon-btn md:hidden" data-menu-open aria-controls="mobileMenu" aria-expanded="false" aria-label="{t["open"]}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
      </button>
    </div>
  </div>
</header>

<div id="mobileMenu" class="mobile-menu" role="dialog" aria-modal="true" aria-label="{t["menu"]}" hidden>
  <div class="scrim" data-menu-close></div>
  <div class="mobile-drawer">
    <div class="p-5">
      <div class="flex items-center justify-between mb-6">
        <span class="font-semibold text-sm">{t["menu"]}</span>
        <button type="button" class="icon-btn" data-menu-close aria-label="{t["close"]}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="flex flex-col gap-1" aria-label="{t["menu"]}">
        <a href="{home}" class="mobile-nav-link"{cur(home)}>{t["home"]}</a>{drawer_links}
        <div class="my-3 h-px" style="background:var(--border)"></div>
        <span class="mono text-[11px] uppercase tracking-[0.12em] mb-1 px-3" style="color:var(--ash)">{t["guides"]}</span>{drawer_guides}
        <div class="my-3 h-px" style="background:var(--border)"></div>
        <span class="mono text-[11px] uppercase tracking-[0.12em] mb-2 px-3" style="color:var(--ash)">{t["lang"]}</span>
        <div class="lang-links px-3">{" ".join(lang_links(key, lang))}</div>
      </nav>
    </div>
  </div>
</div>
'''

def footer(lang):
    t = S[lang]
    return f'''<footer class="site-footer">
  <div class="max-w-[1140px] mx-auto px-4 md:px-6 py-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
    <span>© 2026 explosionproofradios.com · {t["foot"]}</span>
    <span class="flex flex-wrap gap-x-5"><a href="{PAGES["privacy"][lang]}">{t["privacy"]}</a><a href="{t["contact"]}">{t["contact_l"]}</a></span>
  </div>
</footer>'''

SHARED_SEL = re.compile(r'^(:root|html|body|html,\s*body|\.serif|\.mono|\.glass|\.lang-select|#guidesDD\b.*|\.dd-[\w-]+(:hover)?|\.dd-chev|\.mobile-[\w-]+(:hover)?|'
                        r'\.btn(-primary|-secondary|-ghost|-pri|-sec)?(:hover)?|\.badge(-green|-warn|-neutral|-dark|-atex|-iec|-z1)?|\.card(:hover)?|\.chip)$')
KEEP_PROPS = re.compile(r'^\s*(padding[\w-]*|margin[\w-]*)\s*:')

def strip_shared_rules(css):
    def rule(m):
        sels = [x.strip() for x in m.group(1).split(',')]
        if sels and all(SHARED_SEL.match(x) for x in sels):
            keep = [d.strip() for d in m.group(2).split(';') if KEEP_PROPS.match(d)]
            return ('\n  ' + m.group(1).strip() + '{' + ';'.join(keep) + '}') if keep else ''
        return m.group(0)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    return re.sub(r'([^{}@]+)\{([^{}]*)\}', rule, css)

BANNER = '<script src="https://hazardousareaguide.com/consent-banner.js"></script>'

import hashlib
def _ver(*names):
    """Content hash for cache busting: Cloudflare caches /assets/* for a year."""
    h = hashlib.md5()
    for name in names:
        h.update(pathlib.Path(name).read_bytes())
    return h.hexdigest()[:8]
CSS_V = _ver('assets/site.css', 'assets/tw.css')
JS_V = _ver('assets/site.js')

HEAD_ASSETS = ('<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
               '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">\n'
               '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
               f'<link rel="stylesheet" href="/assets/site.css?v={CSS_V}">\n'   # components first ...
               f'<link rel="stylesheet" href="/assets/tw.css?v={CSS_V}">\n')    # ... so utilities (md:hidden etc.) win

def process(p):
    rel = p.as_posix()
    s = o = p.read_text(encoding='utf-8')
    if 'http-equiv="refresh"' in s[:3000]:
        return False
    key, lang, url = page_key(rel)
    head, body = s.split('</head>', 1)
    head = re.sub(r'\s*<template id="__bundler_thumbnail">.*?</template>', '', head, flags=re.S)
    head = re.sub(r'\s*<script src="https://cdn\.tailwindcss\.com"></script>', '', head)
    head = re.sub(r'\s*<script>\s*tailwind\.config\s*=.*?</script>', '', head, flags=re.S)
    head = re.sub(r'[ \t]*<link rel="(?:icon|apple-touch-icon)"[^>]*>\n?', '', head)
    head = re.sub(r'[ \t]*<link rel="stylesheet" href="/assets/(?:tw|site)\.css(?:\?v=\w+)?">\n?', '', head)
    head = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + strip_shared_rules(m.group(2)) + m.group(3), head, flags=re.S)
    head = re.sub(r'[ \t]*(\.burger\{[^}]*\}|@media\(max-width:767px\)\{\.burger\{display:block\}[^\n]*)\n', '', head)   # old burger menu
    head = re.sub(r'[ \t]*<style[^>]*>\s*</style>\s*', '', head)
    a = re.search(r'[ \t]*<link rel="preconnect"|[ \t]*<link href="https://fonts|[ \t]*<style|[ \t]*<script type="application/ld\+json"', head)
    at = a.start() if a else len(head)
    head = head[:at] + HEAD_ASSETS + head[at:]
    # Consent Mode defaults must be set before any Google tag runs (banner script says so).
    if BANNER in head:
        head = re.sub(r'[ \t]*' + re.escape(BANNER) + r'\n?', '', head)
        g = re.search(r'[ \t]*(<!-- Google Ads|<!-- GA4|<script async src="https://www\.googletagmanager|<script>\(function\(w,d,s,l,i\))', head)
        at = g.start() if g else len(head)
        head = head[:at] + BANNER + '\n' + head[at:]
    hm = re.search(r'(<a class="skip-link"[^>]*>[^<]*</a>\s*)?<header\b.*?</header>\s*', body, re.S)
    if hm:
        block = chrome(key, lang, url, compare=(key == 'home'))
        dm = re.search(r'<div id="mobileMenu".*?\n</div>\n', body[hm.end():], re.S)
        end = hm.end() + dm.end() if dm and body[hm.end():hm.end() + dm.start()].strip() == '' else hm.end()
        body = body[:hm.start()] + block + body[end:]
        fm = re.search(r'<footer\b.*?</footer>', body, re.S)
        if fm and key != 'home':
            body = body[:fm.start()] + footer(lang) + body[fm.end():]
        if not re.search(r'<main\b', body):
            start = body.find(block) + len(block)
            f2 = body.find('<footer', start)
            body = body[:start] + '\n<main id="main">\n' + body[start:f2] + '</main>\n\n' + body[f2:]
    if 'id="main"' not in body and re.search(r'<main\b', body):
        body = re.sub(r'<main id="[^"]*"', '<main', body, count=1)
        body = re.sub(r'<main\b([^>]*)>', r'<main id="main"\1>', body, count=1)
    # the footer belongs after <main>, not inside it
    fm, me = re.search(r'<footer\b', body), body.find('</main>')
    if fm and me > fm.start():
        body = body[:me] + body[me + len('</main>'):]
        body = body[:fm.start()] + '</main>\n\n' + body[fm.start():]
    body = re.sub(r'\s*<script>document\.querySelector\(\'\.burger\'\).*?</script>', '', body, flags=re.S)
    body = re.sub(r"document\.addEventListener\('click',function\(e\)\{var d=document\.getElementById\('guidesDD'\);if\(d&&!d\.contains\(e\.target\)\)d\.classList\.remove\('dd-open'\);\}\);\s*", '', body)
    body = re.sub(r"document\.querySelectorAll\('#mobileMenu a'\)\.forEach\(function\(a\)\{a\.addEventListener\('click',function\(\)\{document\.getElementById\('mobileMenu'\)\.classList\.add\('hidden'\);\}\);\}\);\s*", '', body)
    body = re.sub(r'<script>\s*</script>\s*', '', body)
    body = re.sub(r'<script src="/assets/site\.js(?:\?v=\w+)?" defer></script>', f'<script src="/assets/site.js?v={JS_V}" defer></script>', body)
    if '/assets/site.js' not in body:
        body = body.replace('</body>', f'<script src="/assets/site.js?v={JS_V}" defer></script>\n</body>', 1)
    s = head + '</head>' + body
    if s != o:
        p.write_text(s, encoding='utf-8')
        return True
    return False

if __name__ == '__main__':
    n = sum(process(p) for p in sorted(pathlib.Path('.').rglob('*.html'))
            if not ({'.git', '.audit', 'node_modules'} & set(p.parts)) and not p.name.startswith('google'))
    print('pages updated:', n)
