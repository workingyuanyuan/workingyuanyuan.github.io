import type { APIRoute } from 'astro';
import { LOCALES } from '../lib/site.mjs';
import { homeMarkdown } from '../lib/text.mjs';

export const prerender = true;
export const GET: APIRoute = () =>
	new Response(homeMarkdown(LOCALES[1]), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
