import type { APIRoute } from 'astro';
import { MOVED } from '../lib/site.mjs';
import { movedMarkdown } from '../lib/text.mjs';

export const prerender = true;

/** Old addresses of the Markdown twins: `/repos/kage.md`, `/zh-tw/repos/kage.md`. */
export function getStaticPaths() {
	return MOVED.map((page) => ({ params: { moved: page.id }, props: { page } }));
}
export const GET: APIRoute = ({ props }) =>
	new Response(movedMarkdown(props.page), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
