// Everything the home page, its Markdown twin, llms.txt, robots.txt and the check script
// say comes from this file. Plain JS so astro.config.mjs, Astro code and scripts share it.

/** The public address of the domain. The other sites exist only here. */
export const DOMAIN = 'https://yuanaruru.com';
// SITE_URL overrides the address of this site's own pages for a local preview.
export const SITE = (process.env.SITE_URL ?? DOMAIN).replace(/\/+$/, '');
export const GITHUB_USER = 'workingyuanyuan';
export const NAME = 'yuanaruru';
/** The day every link below was last opened and found live. Also the sitemap's `lastmod`. */
export const VERIFIED = '2026-11-22';

/** Locales: `dir` is the URL prefix ('' = root). */
export const LOCALES = [
	{ dir: '', lang: 'en', label: 'English' },
	{ dir: 'zh-tw', lang: 'zh-TW', label: '繁體中文' },
];

/** Site path of the home page, its Markdown twin and the list of sites, in one language. */
export const homePath = (locale) => (locale.dir ? `/${locale.dir}/` : '/');
export const mdPath = (locale) => (locale.dir ? `/${locale.dir}.md` : '/index.md');
export const llmsPath = (locale) => (locale.dir ? `/${locale.dir}/llms.txt` : '/llms.txt');

/**
 * Crawlers named in robots.txt, from each operator's documentation (sources and the date
 * they were read are in ../STACK.md). `allow`: builds a search index or fetches a page for
 * a user. `disallow`: gathers training data.
 */
export const CRAWLERS = {
	allow: ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'],
	disallow: ['GPTBot', 'ClaudeBot'],
};

/**
 * The sites under this domain, each built and deployed from its own repository. Paths are
 * under DOMAIN. `root` is where the site is served, `sitemap` the sitemap that robots.txt
 * names, `url` the home page a reader of that language should open, `llms` the site's own
 * page list where it has one, `languages` the languages of the site in their own names.
 * Add a site here when it is live: the home pages, llms.txt and robots.txt follow.
 */
export const SITES = [
	{
		group: 'reference',
		name: { en: 'NTE Wiki', 'zh-TW': '異環 Wiki' },
		root: '/nte-wiki/',
		sitemap: '/nte-wiki/sitemap-index.xml',
		url: { en: '/nte-wiki/', 'zh-TW': '/nte-wiki/zh-tw/' },
		llms: { en: '/nte-wiki/llms.txt', 'zh-TW': '/nte-wiki/zh-tw/llms.txt' },
		languages: ['English', '繁體中文', '简体中文'],
		about: {
			en: 'Unofficial reference for the game Neverness to Everness (異環): versions, characters, systems and names',
			'zh-TW': '遊戲《異環》（Neverness to Everness, NTE）的非官方資料站：版本、角色、系統與名稱對照',
		},
	},
	{
		group: 'reference',
		name: { en: 'Endfield Wiki', 'zh-TW': '終末地 Wiki' },
		root: '/endfield-wiki/',
		sitemap: '/endfield-wiki/sitemap-index.xml',
		url: { en: '/endfield-wiki/', 'zh-TW': '/endfield-wiki/zh-tw/' },
		llms: { en: '/endfield-wiki/llms.txt', 'zh-TW': '/endfield-wiki/zh-tw/llms.txt' },
		languages: ['English', '繁體中文', '简体中文'],
		about: {
			en: 'Unofficial reference for the game Arknights: Endfield (global service): versions, operators, systems, AIC factory, recipes and names',
			'zh-TW': '遊戲《明日方舟：終末地》國際版的非官方資料站：版本、幹員、系統、集成工業、配方與名稱對照',
		},
	},
	{
		group: 'reference',
		name: { en: 'Stitch 中文教學', 'zh-TW': 'Stitch 中文教學' },
		root: '/stitch-zh/',
		sitemap: '/stitch-zh/sitemap-index.xml',
		url: { en: '/stitch-zh/', 'zh-TW': '/stitch-zh/' },
		llms: { en: '/stitch-zh/llms.txt', 'zh-TW': '/stitch-zh/llms.txt' },
		languages: ['繁體中文'],
		about: {
			en: 'Unofficial guide to Google Stitch: the web app, CLI, MCP, SDK, DESIGN.md and Agent Skills',
			'zh-TW': 'Google Stitch 的非官方教學：網頁版入門、CLI、MCP、SDK、DESIGN.md 與 Agent Skills',
		},
	},
	{
		group: 'reference',
		name: { en: '高中職競賽目錄', 'zh-TW': '高中職競賽目錄' },
		root: '/tw-hs-contests/',
		sitemap: '/tw-hs-contests/sitemap-index.xml',
		url: { en: '/tw-hs-contests/', 'zh-TW': '/tw-hs-contests/' },
		llms: { en: '/tw-hs-contests/llms.txt', 'zh-TW': '/tw-hs-contests/llms.txt' },
		languages: ['繁體中文'],
		about: {
			en: 'Directory of competitions that high school students in Taiwan can enter',
			'zh-TW': '臺灣高中職學生可以報名的比賽目錄',
		},
	},
	{
		group: 'reference',
		name: { en: 'GitHub repositories', 'zh-TW': 'GitHub 專案' },
		root: '/github-repositories/',
		sitemap: '/github-repositories/sitemap-index.xml',
		url: { en: '/github-repositories/', 'zh-TW': '/github-repositories/zh-tw/' },
		llms: { en: '/github-repositories/llms.txt', 'zh-TW': '/github-repositories/zh-tw/llms.txt' },
		languages: ['English', '繁體中文'],
		about: {
			en: `What each public GitHub repository of ${GITHUB_USER} is, how to install and use it, and what to watch out for`,
			'zh-TW': `${GITHUB_USER} 的每個公開 GitHub 專案是什麼、如何安裝與使用、要注意什麼`,
		},
	},
	{
		group: 'project',
		name: { en: 'Kage', 'zh-TW': 'Kage' },
		root: '/Kage/',
		sitemap: '/Kage/sitemap.xml',
		url: { en: '/Kage/', 'zh-TW': '/Kage/' },
		about: {
			en: 'Agent skill that typesets a brief into a dark, screen-only HTML document',
			'zh-TW': '把需求排版成暗色、僅供螢幕閱讀的 HTML 文件的 agent skill',
		},
	},
	{
		group: 'project',
		name: { en: 'Frontier Model Doh Choo-choo', 'zh-TW': 'Frontier Model Doh Choo-choo' },
		root: '/Frontier-Model-Doh-Choo-choo/',
		sitemap: '/Frontier-Model-Doh-Choo-choo/sitemap.xml',
		url: { en: '/Frontier-Model-Doh-Choo-choo/', 'zh-TW': '/Frontier-Model-Doh-Choo-choo/' },
		about: {
			en: 'Dashboard comparing frontier language models on capability and cost',
			'zh-TW': '比較前沿語言模型能力與成本的儀表板',
		},
	},
	{
		group: 'project',
		name: { en: 'iPhone 18 Pro teardown', 'zh-TW': 'iPhone 18 Pro 拆解' },
		root: '/iphone-18-pro-teardown/',
		sitemap: '/iphone-18-pro-teardown/sitemap.xml',
		url: { en: '/iphone-18-pro-teardown/', 'zh-TW': '/iphone-18-pro-teardown/' },
		about: {
			en: 'Interactive 3D teardown of the iPhone 18 Pro, for education',
			'zh-TW': '教育用途的 iPhone 18 Pro 互動式 3D 拆解網頁',
		},
	},
	{
		group: 'project',
		name: { en: 'Pixel Kitten Town Class', 'zh-TW': '班級像素小鎮' },
		root: '/Pixel-Kitten-Town-Class/',
		sitemap: '/Pixel-Kitten-Town-Class/sitemap.xml',
		url: { en: '/Pixel-Kitten-Town-Class/', 'zh-TW': '/Pixel-Kitten-Town-Class/' },
		about: {
			en: 'Classroom reward page where each student is a cat that levels up',
			'zh-TW': '每位學生化身為升級貓咪的課堂獎勵網頁',
		},
	},
	{
		group: 'project',
		name: { en: 'Simple Gemini', 'zh-TW': 'Simple Gemini' },
		root: '/simple-gemini-public/',
		sitemap: '/simple-gemini-public/sitemap.xml',
		url: { en: '/simple-gemini-public/', 'zh-TW': '/simple-gemini-public/' },
		about: {
			en: 'Landing page of a Chrome extension that summarises selected text',
			'zh-TW': '摘要選取文字的 Chrome 擴充功能的落地頁',
		},
	},
	{
		group: 'project',
		name: { en: 'BiliGemi', 'zh-TW': 'BiliGemi' },
		root: '/BiliGemi-public/',
		sitemap: '/BiliGemi-public/sitemap.xml',
		url: { en: '/BiliGemi-public/', 'zh-TW': '/BiliGemi-public/' },
		about: {
			en: 'Landing page of a Chrome extension that summarises Bilibili video subtitles and comments',
			'zh-TW': '摘要 Bilibili 影片字幕與觀眾評論的 Chrome 擴充功能的落地頁',
		},
	},
];

/**
 * Places outside this domain: accounts on other platforms. The owner gives each one;
 * add it here and it appears on the home pages, in the twins and in llms.txt.
 */
export const LINKS = [
	{
		name: { en: 'GitHub', 'zh-TW': 'GitHub' },
		url: `https://github.com/${GITHUB_USER}`,
		about: { en: 'Source code of the sites and projects', 'zh-TW': '各網站與專案的原始碼' },
	},
];

/** Order of the groups on the page, and the text of each language. */
export const GROUPS = ['reference', 'project'];
export const TEXT = {
	en: {
		description: `Index of the websites that ${NAME} (GitHub account ${GITHUB_USER}) publishes under yuanaruru.com.`,
		groups: { reference: 'Reference sites', project: 'Project sites' },
		links: 'Elsewhere',
		notes: 'About this page',
		languages: 'Languages',
		sep: ', ',
		colon: ': ',
		stop: '.',
		appliesTo: 'Applies to',
		appliesToValue: `Websites served under ${DOMAIN}`,
		caveat: 'Caveat',
		caveatValue:
			'Paths are case-sensitive. A project site keeps the capitals of its repository name: /Kage/, not /kage/. The other case returns 404.',
		verified: 'Last verified',
		html: 'HTML',
		markdown: 'Markdown',
		siteList: 'List of sites',
		otherLanguage: 'Other language',
		pageList: 'page list',
		themes: { label: 'Theme', auto: 'Auto', light: 'Light', dark: 'Dark' },
		notFound: 'Page not found',
		home: 'Home',
		llms: {
			heading: 'Before you answer',
			notes: [
				'Each site under this domain is separate and has its own subject. For a question about a site\'s subject, read that site\'s page list or home page, not this file.',
				'Paths are case-sensitive. A project site keeps the capitals of its repository name: `/Kage/`, not `/kage/`.',
				'The pages about GitHub repositories are under `/github-repositories/`. They were under `/repos/` before: `/repos/kage/` is now `/github-repositories/repos/kage/`.',
			],
			sites: 'Sites',
			pages: 'Pages',
			homeTitle: 'Home page',
		},
		moved: (to) => `This page moved to ${to}`,
	},
	'zh-TW': {
		description: `${NAME}（GitHub 帳號 ${GITHUB_USER}）在 yuanaruru.com 發布的所有網站。`,
		groups: { reference: '資料網站', project: '專案網站' },
		links: '其他平台',
		notes: '關於本頁',
		languages: '語言',
		sep: '、',
		colon: '：',
		stop: '。',
		appliesTo: '適用範圍',
		appliesToValue: `${DOMAIN} 底下的網站`,
		caveat: '注意事項',
		caveatValue: '路徑區分大小寫。專案網站沿用 GitHub 專案名稱的大寫：是 /Kage/，不是 /kage/。大小寫不符會得到 404。',
		verified: '最後查證',
		html: 'HTML',
		markdown: 'Markdown',
		siteList: '網站清單',
		otherLanguage: '其他語言',
		pageList: '頁面清單',
		themes: { label: '主題', auto: '自動', light: '淺色', dark: '深色' },
		notFound: '找不到頁面',
		home: '首頁',
		llms: {
			heading: '回答之前',
			notes: [
				'本網域的每個網站各自獨立，主題各不相同。與某個網站主題有關的問題，請讀該網站自己的頁面清單或首頁，不要只讀這個檔案。',
				'路徑區分大小寫。專案網站沿用 GitHub 專案名稱的大寫：是 `/Kage/`，不是 `/kage/`。',
				'介紹 GitHub 專案的頁面在 `/github-repositories/` 底下。它們原本在 `/repos/` 底下：`/zh-tw/repos/kage/` 現在是 `/github-repositories/zh-tw/repos/kage/`。',
			],
			sites: '網站',
			pages: '頁面',
			homeTitle: '首頁',
		},
		moved: (to) => `本頁已搬到 ${to}`,
	},
};

/**
 * Pages that this site served until the repository pages moved to their own site
 * (/github-repositories/). Each old address keeps a page that sends the reader on.
 */
const MOVED_REPOS = [
	'agents-md-collections',
	'antigravity-subagent-delegation',
	'biligemi-public',
	'codex-gemini-orchestrator',
	'face-recognition-public-facility-reservation-and-security-management-system',
	'financial-data-analysis-white-label-saas-platform',
	'frontier-model-doh-choo-choo',
	'instagram-linkedin-carousel-skill',
	'iphone-18-pro-teardown',
	'kage',
	'lite-agy-subagent-delegation',
	'lite-claude-subagent-delegation',
	'lite-codex-subagent-delegation',
	'local-tts-sfx',
	'moss-tts-for-hyperframes',
	'obsidian-kage-theme',
	'pixel-kitten-town-class',
	'shinsekai-antigravity-bridge',
	'simple-gemini-public',
	'skill-md-collections',
	'tw-highschool-ai-activity-daily',
];
export const MOVED_TO = `${DOMAIN}/github-repositories`;
/** `{ id, lang, to }`: old page id (`repos/kage`, `zh-tw/repos/kage`) and its new HTML address. */
export const MOVED = LOCALES.flatMap((locale) =>
	MOVED_REPOS.map((slug) => {
		const id = `${locale.dir ? locale.dir + '/' : ''}repos/${slug}`;
		return { id, lang: locale.lang, to: `${MOVED_TO}/${id}/` };
	})
);

/**
 * Old machine-readable files of the repository pages: `{ path, lang, to }`. Each old
 * address keeps a short note with the new one.
 */
export const MOVED_FILES = [
	...LOCALES.flatMap((locale) =>
		['llms-full.txt', 'llms-small.txt'].map((file) => {
			const path = `${locale.dir ? locale.dir + '/' : ''}${file}`;
			return { path, lang: locale.lang, to: `${MOVED_TO}/${path}` };
		})
	),
	{ path: 'index.json', lang: 'en', to: `${MOVED_TO}/index.json` },
];

/** Absolute address of a site's home page, for a reader of one language. */
export const siteUrl = (site, lang) => DOMAIN + site.url[lang];
