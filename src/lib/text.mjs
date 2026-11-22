// The Markdown twin of the home page and llms.txt, written from src/lib/site.mjs.

import {
	DOMAIN, SITE, NAME, VERIFIED, LOCALES, SITES, LINKS, GROUPS, TEXT, homePath, mdPath, llmsPath, siteUrl,
} from './site.mjs';

/** One line per site: `- [name](url): about. Languages: a, b.` */
function siteLine(site, lang) {
	const t = TEXT[lang];
	const languages = site.languages ? `${lang === 'en' ? ' ' : ''}${t.languages}${t.colon}${site.languages.join(t.sep)}${t.stop}` : '';
	return `- [${site.name[lang]}](${siteUrl(site, lang)})${t.colon}${site.about[lang]}${t.stop}${languages}`;
}

/** Markdown twin of the home page: `/index.md`, `/zh-tw.md`. */
export function homeMarkdown(locale) {
	const { lang } = locale;
	const t = TEXT[lang];
	const others = LOCALES.filter((l) => l !== locale);
	return [
		`# ${NAME}`,
		`> ${t.description}`,
		[
			`- ${t.appliesTo}${t.colon}${t.appliesToValue}`,
			`- ${t.caveat}${t.colon}${t.caveatValue}`,
			`- ${t.verified}${t.colon}${VERIFIED}`,
			`- ${t.html}${t.colon}<${SITE}${homePath(locale)}>`,
			`- ${t.siteList}${t.colon}<${SITE}${llmsPath(locale)}>`,
			...others.map((o) => `- ${t.otherLanguage}${t.colon}[${o.label}](${SITE}${mdPath(o)})`),
		].join('\n'),
		'---',
		...GROUPS.flatMap((group) => [
			`## ${t.groups[group]}`,
			SITES.filter((s) => s.group === group).map((s) => siteLine(s, lang)).join('\n'),
		]),
		`## ${t.links}`,
		LINKS.map((l) => `- [${l.name[lang]}](${l.url})${t.colon}${l.about[lang]}${t.stop}`).join('\n'),
	].join('\n\n') + '\n';
}

/** `/llms.txt`, `/zh-tw/llms.txt`: what is under the domain and where each site lists its pages. */
export function llmsIndex(locale) {
	const { lang } = locale;
	const t = TEXT[lang];
	const others = LOCALES.filter((l) => l !== locale);
	return [
		`# ${NAME}`,
		`> ${t.description}`,
		`## ${t.llms.heading}`,
		t.llms.notes.map((n) => `- ${n}`).join('\n'),
		`## ${t.llms.sites}`,
		SITES.map((s) => {
			const list = s.llms ? (lang === 'en' ? ` (${t.pageList}: <${DOMAIN}${s.llms[lang]}>)` : `（${t.pageList}：<${DOMAIN}${s.llms[lang]}>）`) : '';
			return `- [${s.name[lang]}](${siteUrl(s, lang)})${t.colon}${s.about[lang]}${t.stop}${list}`;
		}).join('\n'),
		`## ${t.links}`,
		LINKS.map((l) => `- [${l.name[lang]}](${l.url})${t.colon}${l.about[lang]}${t.stop}`).join('\n'),
		`## ${t.llms.pages}`,
		[
			`- [${t.llms.homeTitle}](${SITE}${mdPath(locale)})${t.colon}${t.description}`,
			...others.map((o) => `- ${t.otherLanguage}${t.colon}[${o.label}](${SITE}${llmsPath(o)})`),
		].join('\n'),
	].join('\n\n') + '\n';
}

/** Text left at the old address of a bundle, or JSON at the old address of `index.json`. */
export function movedFile(file) {
	if (file.path.endsWith('.json')) return JSON.stringify({ moved: file.to, pages: [] }, null, 2) + '\n';
	return `# ${TEXT[file.lang].moved(`<${file.to}>`)}\n`;
}

/** Markdown left at the old address of a moved page's twin. */
export function movedMarkdown(page) {
	const t = TEXT[page.lang];
	const twin = page.to.replace(/\/$/, '') + '.md';
	return `# ${t.moved(`<${page.to}>`)}\n\n- ${t.markdown}${t.colon}<${twin}>\n`;
}
