# explosionproofradios.com design system

This file is the source of truth for how pages look and behave. The shared files implement it:

| File | What it holds |
|---|---|
| `assets/site.css` | Tokens, base styles, components (buttons, cards, badges, header, drawer, footer, forms) |
| `assets/tw.css` | Compiled Tailwind utilities. Rebuild with `bash scripts/build-css.sh` after changing classes in any page |
| `assets/site.js` | Guides dropdown, mobile menu dialog, and every form marked `data-isp-form` |
| `scripts/build_chrome.py` | Rebuilds the header, mobile menu, footer and head on every page (five languages; English-only guides are marked "(EN)" in translated menus). Safe to re-run |

Load order in every `<head>`: the consent banner script before any Google tag, then `site.css`, then `tw.css`, then the page's own `<style>`. Utilities must come after components so classes like `md:hidden` win.

## Look

Warm paper and ink. Green is a signal, never a fill for text or buttons.

- **Surfaces:** `--bg` white, `--bg-alt` #f5f3f0, `--surface` #f0ece7, `--void` #0c0c0c for the dark home footer.
- **Text:** `--ink` #1a1a1a for headings and buttons, `--graphite` #4a4a4a for body, `--ash` #6b6b63 for captions. All pass WCAG AA on white and on `--surface`.
- **Accent:** `--active` #22c55e only for dots, bars and borders. Green text on light backgrounds uses `--active-text` #15803d or `--mint-ink` on `--mint`.
- **Status:** amber, info and danger each have a background and an ink token. Never use Tailwind's 400-weight colours for text on white.
- **Type:** Instrument Serif for display headings, Inter for everything else, JetBrains Mono for specs and labels. Hero headings are capped at 64px. Form fields use 16px text so phones don't zoom.
- **Shape:** radius tokens xs 6, sm 10, 16, lg 24 and pill. Tap targets are at least 44px.

## Components

- **Buttons:** `.btn` plus `.btn-primary` (ink), `.btn-secondary` (white with border) or `.btn-ghost`. `.btn-pri` and `.btn-sec` are aliases for old markup. One primary button per section.
- **Cards:** `.card`. Padding comes from Tailwind classes or the page.
- **Badges:** `.badge` plus `-green`, `-warn`, `-info`, `-neutral` or `-dark`. `-atex`, `-z1` and `-iec` are aliases.
- **Links in text:** `.link`, or any link inside `.prose` or `.prose-custom`. Ink colour, underlined.
- **Tables:** wrap wide tables in `.table-scroll`. Tables inside `.prose` scroll on their own below 768px.
- **Forms:** `.field-label` + `.field`, with a `for`/`id` pair on every input. Errors, sending state and the result message come from `site.js`.

## Page rules

- Every page has the skip link, one `<header>`, the `#mobileMenu` dialog, one `<main id="main">` and the footer. `build_chrome.py` writes all of them. The home page keeps its own dark footer.
- The header's language links point to the same page in the other language, or that language's home page when no translation exists.
- Every page in more than one language lists all versions with `hreflang`, plus `x-default` pointing to English.
- Titles stay at 60 characters or fewer and descriptions at 160 or fewer.
- Product facts come from the radio data on the home page (`SOLUTIONS` in index.html); guides, translations, structured data and the llms files must match it. Prices are "on request" everywhere. Every price or contact link goes to the on-site form on the page's language home: `<home>?inquire=<product>#contact` (for example `/de/?inquire=Sepura%20STP8X000#contact`).

## Behaviour

- **Guides dropdown:** a real button with `aria-expanded`. It closes on Escape, on outside click and when focus leaves it.
- **Mobile menu:** a dialog. Opening it moves focus to Close, Tab stays inside, Escape closes it, the page doesn't scroll behind it, and focus returns to the menu button.
- **Forms:** add `data-isp-form` to the form and a `<p data-form-status hidden>` after it. The script validates inline, posts to formsubmit.co as JSON, and shows the result in place. The inbox address is stored encoded in `site.js` and never appears in the HTML. `?inquire=` pre-fills the message. The honeypot field is named `_honey` with class `hp-input`.
- **Multilingual home script:** the home pages share one script. Labels, translated values and deployment notes come from the `L` object near its top, which `radios-steps/s02_home_i18n.py` generated per language.
- **Compare panel (home):** up to three picks, with a message on the fourth. The panel is height-capped with its own scroll. Escape or Close hides it, and a floating button reopens it.
- **Motion:** everything respects `prefers-reduced-motion`.

## Rebuilding

```bash
python3 scripts/build_chrome.py   # header, menu, footer, head, consent order
bash scripts/build-css.sh         # after any class change in the HTML
```

## HAG network link policy (2026-09-30)

Run `python3 scripts/hag_link_policy.py <this-site-host>` after any chrome/nav rebuild, translation run or new page. It is idempotent and:
- tags every link to xshielder.com `rel="sponsored"` with UTM (`utm_campaign=hag_network`),
- adds `nofollow` to competitor links (list in the script),
- removes links to the other network sites from header/nav/footer (links in the text stay followed),
- inserts the footer sponsor line ("This site's main sponsor is Xshielder. Want to sponsor this site? Contact us. Part of the Hazardous Area Guide network.") in the page language,
- adds sponsored in-text callouts on the pages listed in `CALLOUTS`,
- loads `hag-links.js`, which sends a GA4 `network_link_click` event (link_type, placement) for every outbound click.
