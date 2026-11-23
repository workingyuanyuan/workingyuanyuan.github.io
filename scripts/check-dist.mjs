// Acceptance checks on the built site in dist/. Run with `pnpm check` after `pnpm build`.
// Fails (exit 1) when a reader, a crawler or an agent would get less than the site means to give.
//
//  1. Home page, per language: title, a description of its own within the length limit,
//     canonical, hreflang, a link to its Markdown twin, a link to every site and account,
//     all of it within the first 5,000 characters of the text that a reader keeping only
//     the main article extracts (Readability, then Turndown), and no description, caveat
//     or date in the visible page.
//  2. Markdown twin, per language: the same links, the caveat, within 5,000 characters.
//  3. llms.txt, per language: every site with its page list, within 5,000 characters.
//  4. robots.txt: this site's sitemap, one line per site and no other, the Content-Signal
//     line, and every crawler by name with the rule the owner decided.
//  5. The IndexNow key file at the domain root holds the key that scripts/indexnow.mjs sends.
//  6. The sitemap lists the home page in each language, with lastmod, and nothing else.
//  7. The 404 page links each language's home page and list of sites.
//  8. Every old address of a moved page sends the reader to the new one, in HTML and
//     Markdown, and the old bundles and index.json name their new address.
//  9. No top-level path of this site is the path of another site under the domain.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import {
	DOMAIN, SITE, NAME, VERIFIED, LOCALES, SITES, LINKS, CRAWLERS, TEXT, MOVED, MOVED_FILES, MOVED_TO, homePath, mdPath, llmsPath, siteUrl,
} from '../src/lib/site.mjs';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const LIMIT = 5000;
/** Repository pages that were live at the old addresses when they moved: 21 in each language. */
const MOVED_PAGES = 42;
const turndown = new TurndownService({ headingStyle: 'atx' });
const MAX_DESCRIPTION = { en: 110, 'zh-TW': 70 };
const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);
const has = (path) => existsSync(join(DIST, path));
const read = (path) => (has(path) ? readFileSync(join(DIST, path), 'utf8') : '');
const fileOf = (sitePath) => sitePath.slice(1) + (sitePath.endsWith('/') ? 'index.html' : '');

// 1-3. Home page, twin and llms.txt in each language.
const descriptions = new Set();
for (const locale of LOCALES) {
	const { lang } = locale;
	const t = TEXT[lang];
	const page = homePath(locale);
	const targets = [...SITES.map((s) => siteUrl(s, lang)), ...LINKS.map((l) => l.url)];

	if (!has(fileOf(page))) {
		fail(page, 'missing');
		continue;
	}
	const doc = new JSDOM(read(fileOf(page))).window.document;
	const head = (selector, attr) => doc.querySelector(`head ${selector}`)?.getAttribute(attr);
	if (doc.documentElement.lang !== lang) fail(page, `<html lang> is not ${lang}`);
	if (!doc.querySelector('head title')?.textContent.trim()) fail(page, 'no <title>');
	const description = head('meta[name="description"]', 'content');
	if (description !== t.description) fail(page, 'meta description is not the description in site.mjs');
	if (t.description.length > MAX_DESCRIPTION[lang]) fail(page, `description has ${t.description.length} characters; the limit is ${MAX_DESCRIPTION[lang]}`);
	if (descriptions.has(t.description)) fail(page, 'same description as another language');
	descriptions.add(t.description);
	if (head('link[rel="canonical"]', 'href') !== SITE + page) fail(page, 'canonical link missing or not the page itself');
	for (const other of LOCALES) {
		if (head(`link[rel="alternate"][hreflang="${other.lang}"]`, 'href') !== SITE + homePath(other)) fail(page, `no hreflang link to the ${other.label} version`);
	}
	if (head('link[rel="alternate"][hreflang="x-default"]', 'href') !== SITE + homePath(LOCALES[0])) fail(page, 'x-default is not the home page of the first language');
	if (doc.querySelectorAll('head link[rel="alternate"][hreflang]').length !== LOCALES.length + 1) fail(page, 'an hreflang link too many or too few');
	if (head('link[rel="alternate"][type="text/markdown"]', 'href') !== SITE + mdPath(locale)) fail(page, 'no alternate link to the Markdown twin');
	let jsonLd = null;
	try {
		jsonLd = JSON.parse(doc.querySelector('head script[type="application/ld+json"]')?.textContent ?? '');
	} catch {}
	if (jsonLd?.['@type'] !== 'WebSite' || jsonLd.name !== NAME || jsonLd.url !== SITE + page || jsonLd.inLanguage !== lang || jsonLd.hasPart?.length !== SITES.length) {
		fail(page, 'JSON-LD missing or without the name, address, language and sites of this page');
	}
	if (!doc.querySelector(`body a[href="${mdPath(locale)}"]`)) fail(page, 'no visible link to the Markdown twin');
	for (const other of LOCALES) {
		if (other !== locale && !doc.querySelector(`body a[href="${homePath(other)}"]`)) fail(page, `no link to the ${other.label} page`);
	}
	const main = doc.querySelector('main');
	for (const url of targets) {
		if (!main?.querySelector(`a[href="${url}"]`)) fail(page, `no link to ${url}`);
	}
	for (const a of main?.querySelectorAll('section a[href]') ?? []) {
		if (!targets.includes(a.getAttribute('href'))) fail(page, `links ${a.getAttribute('href')}, which is neither in SITES nor in LINKS`);
	}
	// What a fetch tool gives an agent: the main article as Markdown, links made absolute.
	const article = new Readability(new JSDOM(read(fileOf(page)), { url: SITE + page }).window.document).parse();
	const extracted = turndown.turndown(article?.content ?? '');
	if (extracted.length > LIMIT) fail(page, `extracted text has ${extracted.length} characters; the limit is ${LIMIT}`);
	for (const url of [...targets, SITE + mdPath(locale), SITE + llmsPath(locale)]) {
		if (!extracted.includes(`](${url})`)) fail(page, `extracted text has no link to ${url}`);
	}
	for (const gone of [t.description, t.caveatValue, VERIFIED]) {
		if (doc.body.textContent.includes(gone)) fail(page, `the visible page shows text it is meant to leave to the twin: ${gone}`);
	}

	const md = read(mdPath(locale).slice(1));
	if (!md) fail(mdPath(locale), 'missing');
	else {
		if (md.length > LIMIT) fail(mdPath(locale), `has ${md.length} characters; the limit is ${LIMIT}`);
		for (const url of targets) if (!md.includes(`](${url})`)) fail(mdPath(locale), `no link to ${url}`);
		for (const line of [t.description, t.caveatValue, VERIFIED, `<${SITE}${page}>`]) {
			if (!md.includes(line)) fail(mdPath(locale), `lacks: ${line}`);
		}
		if (/<\/?[a-z][^>]*>/i.test(md.replace(/<https?:[^>]+>/g, ''))) fail(mdPath(locale), 'holds HTML');
	}

	const llms = read(llmsPath(locale).slice(1));
	if (!llms) fail(llmsPath(locale), 'missing');
	else {
		if (llms.length > LIMIT) fail(llmsPath(locale), `has ${llms.length} characters; the limit is ${LIMIT}`);
		for (const site of SITES) {
			if (!llms.includes(`](${siteUrl(site, lang)})`)) fail(llmsPath(locale), `no link to ${siteUrl(site, lang)}`);
			if (site.llms && !llms.includes(`<${DOMAIN}${site.llms[lang]}>`)) fail(llmsPath(locale), `no page list for ${site.root}`);
		}
		for (const link of LINKS) if (!llms.includes(`](${link.url})`)) fail(llmsPath(locale), `no link to ${link.url}`);
		for (const note of t.llms.notes) if (!llms.includes(note)) fail(llmsPath(locale), 'a note is missing');
		if (!llms.includes(`](${SITE}${mdPath(locale)})`)) fail(llmsPath(locale), 'no link to the home page twin');
		for (const other of LOCALES) {
			if (other !== locale && !llms.includes(`](${SITE}${llmsPath(other)})`)) fail(llmsPath(locale), `no link to the ${other.label} list`);
		}
	}
}

// 4. robots.txt: sitemaps, the use of the content, crawlers by name.
const robots = read('robots.txt');
const sitemapLines = robots.split('\n').filter((line) => /^Sitemap:/i.test(line));
const wanted = [`Sitemap: ${SITE}/sitemap-index.xml`, ...SITES.map((s) => `Sitemap: ${DOMAIN}${s.sitemap}`)];
for (const line of wanted) if (!sitemapLines.includes(line)) fail('robots.txt', `lacks the line "${line}"`);
for (const line of sitemapLines) if (!wanted.includes(line)) fail('robots.txt', `has "${line}", which no site in SITES gives`);
if (new Set(sitemapLines).size !== sitemapLines.length) fail('robots.txt', 'names a sitemap twice');
if (!/^Content-Signal: search=yes, ai-input=yes, ai-train=no$/m.test(robots)) fail('robots.txt', 'no Content-Signal line with the owner\'s decision');
// A crawler follows the rules of every group that names it (names compare without case),
// so collect them all. A group is a run of User-agent lines and the rules after it;
// comments and blank lines do not end the run.
const rulesFor = new Map();
let naming = false; // true while reading the User-agent lines that open a group
let current = [];
for (const raw of robots.split('\n')) {
	const line = raw.replace(/#.*/, '').trim();
	if (!line) continue;
	const agent = /^User-agent:\s*(\S+)/i.exec(line)?.[1].toLowerCase();
	if (agent) {
		if (!naming) current = [];
		current.push(agent);
		naming = true;
	} else {
		for (const name of current) rulesFor.set(name, [...(rulesFor.get(name) ?? []), line]);
		naming = false;
	}
}
for (const [names, refused] of [[CRAWLERS.allow, false], [CRAWLERS.disallow, true]]) {
	for (const name of names) {
		const rules = rulesFor.get(name.toLowerCase());
		const disallows = (rules ?? []).filter((r) => /^Disallow:\s*\S/i.test(r));
		const allows = (rules ?? []).filter((r) => /^Allow:\s*\S/i.test(r));
		if (!rules) fail('robots.txt', `${name} is not named`);
		else if (refused && !(disallows.some((r) => /^Disallow:\s*\/$/i.test(r)) && !allows.length)) fail('robots.txt', `${name} gathers training data and is not refused everything`);
		else if (!refused && disallows.length) fail('robots.txt', `${name} is a search or user crawler and is disallowed`);
	}
}
// No other group may refuse anything: a crawler follows the group that names it.
const mayRefuse = CRAWLERS.disallow.map((name) => name.toLowerCase());
for (const [name, rules] of rulesFor) {
	if (!mayRefuse.includes(name) && rules.some((r) => /^Disallow:\s*\S/i.test(r))) fail('robots.txt', `the group for ${name} disallows something`);
}

// 5. IndexNow key file: `<key>.txt` containing the key. At the domain root it covers the
// project sites too, so only this site serves it.
const indexnowKey = readFileSync(fileURLToPath(new URL('./indexnow.mjs', import.meta.url)), 'utf8').match(/INDEXNOW_KEY = '([0-9a-f]{32})'/)?.[1];
if (!indexnowKey || read(`${indexnowKey}.txt`).trim() !== indexnowKey) {
	fail(`${indexnowKey}.txt`, 'IndexNow key file missing or does not hold the key in scripts/indexnow.mjs');
}

// 6. Sitemap: the home page in each language, with lastmod, and nothing else.
const listed = new Map();
for (const [, sitemapUrl] of read('sitemap-index.xml').matchAll(/<loc>([^<]+)<\/loc>/g)) {
	const file = sitemapUrl.startsWith(SITE + '/') ? sitemapUrl.slice(SITE.length + 1) : null;
	if (!file || !has(file)) {
		fail('sitemap-index.xml', `names ${sitemapUrl}, which is not in dist/`);
		continue;
	}
	for (const [, entry] of read(file).matchAll(/<url>([\s\S]*?)<\/url>/g)) {
		listed.set(/<loc>([^<]+)<\/loc>/.exec(entry)?.[1], /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1]);
	}
}
const expected = LOCALES.map((l) => SITE + homePath(l));
for (const url of expected) {
	if (!listed.has(url)) fail('sitemap', `${url} is not listed`);
	else if (listed.get(url)?.slice(0, 10) !== VERIFIED) fail('sitemap', `lastmod of ${url} is ${listed.get(url) ?? 'missing'}, not ${VERIFIED}`);
}
for (const url of listed.keys()) if (!expected.includes(url)) fail('sitemap', `${url} is listed but is not a home page`);

// 7. A wrong URL is not a dead end.
const notFound = new JSDOM(read('404.html')).window.document;
for (const locale of LOCALES) {
	for (const href of [homePath(locale), llmsPath(locale)]) {
		if (!notFound.querySelector(`main a[href="${href}"]`)) fail('404.html', `no link to ${href}`);
	}
}
if (!notFound.querySelector(`main a[href="${MOVED_TO}/"]`)) fail('404.html', 'no link to where the repository pages moved');

// 8. Old addresses of the moved pages.
if (MOVED.length !== MOVED_PAGES || new Set(MOVED.map((p) => p.id)).size !== MOVED_PAGES) {
	fail('MOVED', `has ${MOVED.length} old addresses; ${MOVED_PAGES} pages were live when they moved`);
}
for (const page of MOVED) {
	const file = `${page.id}/index.html`;
	const twin = page.to.replace(/\/$/, '') + '.md';
	if (!has(file)) {
		fail(`/${page.id}/`, 'old address has no page');
		continue;
	}
	const doc = new JSDOM(read(file)).window.document;
	if (doc.querySelector('link[rel="canonical"]')?.getAttribute('href') !== page.to) fail(`/${page.id}/`, 'canonical is not the new address');
	if (doc.querySelector('meta[http-equiv="refresh"]')?.getAttribute('content') !== `0; url=${page.to}`) fail(`/${page.id}/`, 'does not send a browser to the new address');
	if (!doc.querySelector(`body a[href="${page.to}"]`)) fail(`/${page.id}/`, 'no link to the new address in the text');
	if (!doc.querySelector(`body a[href="${twin}"]`)) fail(`/${page.id}/`, 'no link to the new Markdown twin');
	if (!read(`${page.id}.md`).split('\n').some((line) => line.endsWith(`<${twin}>`))) fail(`/${page.id}.md`, 'missing or without a link to the new address');
}
for (const file of MOVED_FILES) {
	const text = read(file.path);
	const named = file.path.endsWith('.json') ? (() => { try { return JSON.parse(text).moved === file.to; } catch { return false; } })() : text.includes(`<${file.to}>`);
	if (!named) fail(`/${file.path}`, 'old address missing or without the new address');
}
// On this machine the repository site sits next to this folder: every page it has must
// have an old address here, and every old address must lead to a page it has.
const reposContent = fileURLToPath(new URL('../../github-repositories/src/content/docs/', import.meta.url));
if (existsSync(reposContent)) {
	for (const locale of LOCALES) {
		const dir = join(reposContent, locale.dir, 'repos');
		const there = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'index.md').map((f) => `${locale.dir ? locale.dir + '/' : ''}repos/${f.slice(0, -3)}`);
		const here = MOVED.filter((p) => p.lang === locale.lang).map((p) => p.id);
		for (const id of there) if (!here.includes(id)) fail(`/${id}/`, 'page of the repository site without an old address here');
		for (const id of here) if (!there.includes(id)) fail(`/${id}/`, 'old address leads to a page the repository site does not have');
	}
}

// 9. A project site is served at /<repository>/ and hides anything this site puts there.
const top = readdirSync(DIST).map((name) => name.toLowerCase());
for (const site of SITES) {
	const name = site.root.replaceAll('/', '').toLowerCase();
	if (top.includes(name)) fail(`/${name}`, `this site has a top-level path that belongs to the site at ${site.root}`);
}

if (failures.length) {
	console.error(`FAIL: ${failures.length} problem(s)\n`);
	for (const f of failures) console.error('- ' + f);
	process.exit(1);
}
console.log(`PASS: ${LOCALES.length} home pages, ${SITES.length} sites, ${MOVED.length} old addresses; all checks passed.`);
