import type { APIRoute } from 'astro';
import { LOCALES } from '../lib/site.mjs';
import { llmsIndex } from '../lib/text.mjs';

export const prerender = true;
export const GET: APIRoute = () =>
	new Response(llmsIndex(LOCALES[0]), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
