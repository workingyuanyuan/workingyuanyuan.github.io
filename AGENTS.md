# Rules for agents maintaining this site

This is the root of `https://yuanaruru.com`: the owner's index of the sites under the domain and of the owner's accounts elsewhere. It also serves the files that count for the whole domain. Each other site is built and deployed from its own repository and served at `/<repository>/`.

## Decisions

- 2026-11-22, owner: the root is a simple index for now. A designed personal page comes later and replaces `src/components/Home.astro` and `src/styles/site.css`; the data in `src/lib/site.mjs` stays.
- 2026-11-22, owner: the pages about the GitHub repositories, which were this site until then, moved unchanged to their own site at `/github-repositories/` (folder `../github-repositories/`). Each old address (`/repos/<name>/`, `/zh-tw/repos/<name>/`, the `.md` twins, the four bundles and `/index.json`) keeps a page or a note that names the new address, because GitHub Pages has no redirects. The 42 pages are the ones that were live on that day; the list (`MOVED` in `src/lib/site.mjs`) does not grow.
- Order of the first deploy: `github-repositories` first, and only when its pages answer on the domain, this site. The other order sends every old address to a 404.
- 2026-11-22: accounts on other platforms are listed only when the owner gives them. `LINKS` holds GitHub alone until then.
- Languages: English at `/`, Traditional Chinese at `/zh-tw/`, as before the move.
- This site is an index, not a documentation site. Of the shared rules it keeps: a Markdown twin per page, `llms.txt` per language, everything within 5,000 characters, a title, description, canonical and `hreflang` per page, a sitemap with `lastmod`, light and dark themes one click away, no sideways scroll on a phone. The visible page is kept bare (2026-11-23): the name, then each site as its name and a few words (`brief`), set in a serif face, with no lead sentence, language list, caveat or date. Those stay in the Markdown twin, and the fuller sentence about each site (`about`) in `llms.txt` and the structured data. The two links at the end of the page (Markdown, `llms.txt`) sit inside `<main>`, so that a reader that keeps only the main text gets them. It has no content collection, bundles, `index.json` or agent test: the page is a list of links.

## Commands

```
pnpm verify      # build, then run the acceptance checks. Run this before you call a change done.
pnpm build       # build only
pnpm check       # acceptance checks on an existing dist/
pnpm preview     # serve dist/ at http://127.0.0.1:4399 with the same Content-Type headers as GitHub Pages
```

## Content rules

- Every site, link and sentence comes from `src/lib/site.mjs`. The home pages, their Markdown twins, `llms.txt` and `robots.txt` are written from it, so one edit changes them all, in both languages.
- A new site: add it to `SITES` once it is live (its home page and sitemap return 200). Set `VERIFIED` to the day you opened every link.
- A new account: add it to `LINKS`. Do not publish personal contact details.
- Do not create a top-level path that is the name of a repository with Pages enabled; the project site hides it. The check script compares against `SITES`.
- Visible text says what a site is. Notes for agents go in `llms.txt` (`TEXT.*.llms.notes`).

## Whole-domain files

| File | Why it is here |
| --- | --- |
| `src/pages/robots.txt.ts` | Crawlers read only the root `robots.txt`: content signals, crawlers by name (`CRAWLERS`; training refused, search and user fetches allowed) and the sitemap of every site in `SITES` |
| `public/<key>.txt` | IndexNow key; at the root it authorizes every URL on the host. `scripts/indexnow.mjs` in each site sends the same key |
| `google-site-verification` meta in `src/components/Home.astro` | Search Console ownership of the domain. Removing it unverifies the property |

## Where things are

| Path | Role |
| --- | --- |
| `src/lib/site.mjs` | Address, locales, sites, accounts, all text, the list of moved pages |
| `src/lib/text.mjs` | Writes the Markdown twins, `llms.txt` and the Markdown left at moved twins |
| `src/components/Home.astro`, `src/pages/index.astro`, `src/pages/zh-tw/index.astro` | The home page in each language |
| `src/components/Head.astro`, `src/components/ThemeButtons.astro`, `src/styles/site.css` | Shared head, theme buttons (storage key `theme`), the look |
| `src/pages/index.md.ts`, `src/pages/zh-tw.md.ts` | Markdown twins: `/index.md`, `/zh-tw.md` |
| `src/pages/llms.txt.ts`, `src/pages/zh-tw/llms.txt.ts` | List of sites per language, each with its own page list |
| `src/pages/[...moved].astro`, `src/pages/[...moved].md.ts`, `src/pages/[...file].ts` | Pages and notes left at the old addresses of the repository pages, their twins, the bundles and `index.json` |
| `src/pages/404.astro` | Links each language's home page and list of sites; GitHub Pages serves one `404.html`, so it is bilingual |
| `scripts/check-dist.mjs` | Acceptance checks |
| `scripts/indexnow.mjs` | Lists pages whose Markdown twin differs from the live one; the deploy workflow submits them to IndexNow |
| `scripts/preview.mjs` | Local preview with GitHub Pages style headers |

Astro documentation: https://docs.astro.build.
