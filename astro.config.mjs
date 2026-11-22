// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE, LOCALES, VERIFIED, homePath } from './src/lib/site.mjs';

/** The sitemap holds the home page in each language and nothing else. */
const pages = new Set(LOCALES.map((l) => SITE + homePath(l)));

export default defineConfig({
	site: SITE,
	trailingSlash: 'always',
	integrations: [
		sitemap({
			filter: (page) => pages.has(page),
			i18n: {
				defaultLocale: 'root',
				locales: Object.fromEntries(LOCALES.map((l) => [l.dir || 'root', l.lang])),
			},
			serialize: (item) => ({ ...item, lastmod: VERIFIED }),
		}),
	],
});
