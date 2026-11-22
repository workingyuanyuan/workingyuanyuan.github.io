import type { APIRoute } from 'astro';
import { DOMAIN, SITE, CRAWLERS, SITES } from '../lib/site.mjs';

export const prerender = true;

// Content signals state how the content may be used after access:
// search = search indexes, ai-input = grounding AI answers, ai-train = model training.
// This file is served for the whole domain, so it also covers the project sites under it.
//
// The owner's decision: search and AI answers yes, training no. A content signal is a
// statement, so the crawlers that gather training data are also refused by name, and the
// ones that build a search index or fetch for a user are named so that a later change to
// the `*` group does not shut them out. A crawler follows the most specific group only.
const USE = ['Content-Signal: search=yes, ai-input=yes, ai-train=no', 'Allow: /', ''];
export const GET: APIRoute = () =>
	new Response(
		[
			'User-agent: *',
			...USE,
			...CRAWLERS.allow.map((name) => `User-agent: ${name}`),
			...USE,
			...CRAWLERS.disallow.map((name) => `User-agent: ${name}`),
			'Disallow: /',
			'',
			`Sitemap: ${SITE}/sitemap-index.xml`,
			// The other sites under this domain; crawlers read only this robots.txt.
			...SITES.map((site) => `Sitemap: ${DOMAIN}${site.sitemap}`),
			'',
		].join('\n'),
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
	);
