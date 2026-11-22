import type { APIRoute } from 'astro';
import { MOVED_FILES } from '../lib/site.mjs';
import { movedFile } from '../lib/text.mjs';

export const prerender = true;

/** Old addresses of the bundles and of index.json: `/llms-full.txt`, `/zh-tw/llms-small.txt`, `/index.json`. */
export function getStaticPaths() {
	return MOVED_FILES.map((file) => ({ params: { file: file.path }, props: { file } }));
}
export const GET: APIRoute = ({ props }) =>
	new Response(movedFile(props.file), {
		headers: { 'Content-Type': `${props.file.path.endsWith('.json') ? 'application/json' : 'text/plain'}; charset=utf-8` },
	});
