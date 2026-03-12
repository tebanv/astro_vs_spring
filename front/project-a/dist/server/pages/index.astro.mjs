/* empty css                                 */
import { f as createComponent, m as maybeRenderHead, l as renderComponent, r as renderTemplate, i as createAstro, j as renderHead, k as renderSlot } from '../chunks/astro/server_BTiRS9nJ.mjs';
import 'kleur/colors';
import 'clsx';
import { n as noop, s as ssr_context, b as sanitize_props, c as spread_props, d as slot, e as store_get, u as unsubscribe_stores, f as ensure_array_like, g as escape_html, h as fallback, i as bind_props, a as attr } from '../chunks/_@astro-renderers_DjJuqME3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DjJuqME3.mjs';
import 'esm-env';
import { I as Icon, L as Log_out } from '../chunks/log-out_CK9WOV7H.mjs';

/** @import { Equals } from '#client' */


/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a, b) {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
}

/** @import { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable } from '../public.js' */
/** @import { Stores, StoresValues, SubscribeInvalidateTuple } from '../private.js' */

/**
 * @type {Array<SubscribeInvalidateTuple<any> | any>}
 */
const subscriber_queue = [];

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Writable<T>}
 */
function writable(value, start = noop) {
	/** @type {Unsubscriber | null} */
	let stop = null;

	/** @type {Set<SubscribeInvalidateTuple<T>>} */
	const subscribers = new Set();

	/**
	 * @param {T} new_value
	 * @returns {void}
	 */
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	/**
	 * @param {Updater<T>} fn
	 * @returns {void}
	 */
	function update(fn) {
		set(fn(/** @type {T} */ (value)));
	}

	/**
	 * @param {Subscriber<T>} run
	 * @param {() => void} [invalidate]
	 * @returns {Unsubscriber}
	 */
	function subscribe(run, invalidate = noop) {
		/** @type {SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(/** @type {T} */ (value));
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}

/** @import { SSRContext } from '#server' */
/** @import { Renderer } from './internal/server/renderer.js' */

/** @param {() => void} fn */
function onDestroy(fn) {
	/** @type {Renderer} */ (/** @type {SSRContext} */ (ssr_context).r).on_destroy(fn);
}

function Arrow_down_to_line($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M12 17V3" }],
		["path", { "d": "m6 11 6 6 6-6" }],
		["path", { "d": "M19 21H5" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'arrow-down-to-line' },
		$$sanitized_props,
		{
			/**
			 * @component @name ArrowDownToLine
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTdWMyIgLz4KICA8cGF0aCBkPSJtNiAxMSA2IDYgNi02IiAvPgogIDxwYXRoIGQ9Ik0xOSAyMUg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-down-to-line
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Arrow_up_from_line($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "m18 9-6-6-6 6" }],
		["path", { "d": "M12 3v14" }],
		["path", { "d": "M5 21h14" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'arrow-up-from-line' },
		$$sanitized_props,
		{
			/**
			 * @component @name ArrowUpFromLine
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggOS02LTYtNiA2IiAvPgogIDxwYXRoIGQ9Ik0xMiAzdjE0IiAvPgogIDxwYXRoIGQ9Ik01IDIxaDE0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-up-from-line
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Chart_no_axes_column($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["line", { "x1": "18", "x2": "18", "y1": "20", "y2": "10" }],
		["line", { "x1": "12", "x2": "12", "y1": "20", "y2": "4" }],
		["line", { "x1": "6", "x2": "6", "y1": "20", "y2": "14" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'chart-no-axes-column' },
		$$sanitized_props,
		{
			/**
			 * @component @name ChartNoAxesColumn
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTgiIHgyPSIxOCIgeTE9IjIwIiB5Mj0iMTAiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSIyMCIgeTI9IjQiIC8+CiAgPGxpbmUgeDE9IjYiIHgyPSI2IiB5MT0iMjAiIHkyPSIxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chart-no-axes-column
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Chevron_down($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];

	Icon($$renderer, spread_props([
		{ name: 'chevron-down' },
		$$sanitized_props,
		{
			/**
			 * @component @name ChevronDown
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Circle_alert($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["circle", { "cx": "12", "cy": "12", "r": "10" }],
		["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
		[
			"line",
			{ "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
		]
	];

	Icon($$renderer, spread_props([
		{ name: 'circle-alert' },
		$$sanitized_props,
		{
			/**
			 * @component @name CircleAlert
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Cog($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" }],
		["path", { "d": "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" }],
		["path", { "d": "M12 2v2" }],
		["path", { "d": "M12 22v-2" }],
		["path", { "d": "m17 20.66-1-1.73" }],
		["path", { "d": "M11 10.27 7 3.34" }],
		["path", { "d": "m20.66 17-1.73-1" }],
		["path", { "d": "m3.34 7 1.73 1" }],
		["path", { "d": "M14 12h8" }],
		["path", { "d": "M2 12h2" }],
		["path", { "d": "m20.66 7-1.73 1" }],
		["path", { "d": "m3.34 17 1.73-1" }],
		["path", { "d": "m17 3.34-1 1.73" }],
		["path", { "d": "m11 13.73-4 6.93" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'cog' },
		$$sanitized_props,
		{
			/**
			 * @component @name Cog
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjBhOCA4IDAgMSAwIDAtMTYgOCA4IDAgMCAwIDAgMTZaIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDRaIiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIydi0yIiAvPgogIDxwYXRoIGQ9Im0xNyAyMC42Ni0xLTEuNzMiIC8+CiAgPHBhdGggZD0iTTExIDEwLjI3IDcgMy4zNCIgLz4KICA8cGF0aCBkPSJtMjAuNjYgMTctMS43My0xIiAvPgogIDxwYXRoIGQ9Im0zLjM0IDcgMS43MyAxIiAvPgogIDxwYXRoIGQ9Ik0xNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik0yIDEyaDIiIC8+CiAgPHBhdGggZD0ibTIwLjY2IDctMS43MyAxIiAvPgogIDxwYXRoIGQ9Im0zLjM0IDE3IDEuNzMtMSIgLz4KICA8cGF0aCBkPSJtMTcgMy4zNC0xIDEuNzMiIC8+CiAgPHBhdGggZD0ibTExIDEzLjczLTQgNi45MyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/cog
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Download($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
		["polyline", { "points": "7 10 12 15 17 10" }],
		["line", { "x1": "12", "x2": "12", "y1": "15", "y2": "3" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'download' },
		$$sanitized_props,
		{
			/**
			 * @component @name Download
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cG9seWxpbmUgcG9pbnRzPSI3IDEwIDEyIDE1IDE3IDEwIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTUiIHkyPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function File_json($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		[
			"path",
			{
				"d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
			}
		],
		["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
		[
			"path",
			{
				"d": "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"
			}
		],

		[
			"path",
			{
				"d": "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"
			}
		]
	];

	Icon($$renderer, spread_props([
		{ name: 'file-json' },
		$$sanitized_props,
		{
			/**
			 * @component @name FileJson
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik0xMCAxMmExIDEgMCAwIDAtMSAxdjFhMSAxIDAgMCAxLTEgMSAxIDEgMCAwIDEgMSAxdjFhMSAxIDAgMCAwIDEgMSIgLz4KICA8cGF0aCBkPSJNMTQgMThhMSAxIDAgMCAwIDEtMXYtMWExIDEgMCAwIDEgMS0xIDEgMSAwIDAgMS0xLTF2LTFhMSAxIDAgMCAwLTEtMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-json
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function File_spreadsheet($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		[
			"path",
			{
				"d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
			}
		],
		["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
		["path", { "d": "M8 13h2" }],
		["path", { "d": "M14 13h2" }],
		["path", { "d": "M8 17h2" }],
		["path", { "d": "M14 17h2" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'file-spreadsheet' },
		$$sanitized_props,
		{
			/**
			 * @component @name FileSpreadsheet
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik04IDEzaDIiIC8+CiAgPHBhdGggZD0iTTE0IDEzaDIiIC8+CiAgPHBhdGggZD0iTTggMTdoMiIgLz4KICA8cGF0aCBkPSJNMTQgMTdoMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-spreadsheet
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Info$1($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["circle", { "cx": "12", "cy": "12", "r": "10" }],
		["path", { "d": "M12 16v-4" }],
		["path", { "d": "M12 8h.01" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'info' },
		$$sanitized_props,
		{
			/**
			 * @component @name Info
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function List($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M3 12h.01" }],
		["path", { "d": "M3 18h.01" }],
		["path", { "d": "M3 6h.01" }],
		["path", { "d": "M8 12h13" }],
		["path", { "d": "M8 18h13" }],
		["path", { "d": "M8 6h13" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'list' },
		$$sanitized_props,
		{
			/**
			 * @component @name List
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMThoLjAxIiAvPgogIDxwYXRoIGQ9Ik0zIDZoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDEyaDEzIiAvPgogIDxwYXRoIGQ9Ik04IDE4aDEzIiAvPgogIDxwYXRoIGQ9Ik04IDZoMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Save($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		[
			"path",
			{
				"d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
			}
		],
		["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
		["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'save' },
		$$sanitized_props,
		{
			/**
			 * @component @name Save
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function Upload($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
		["polyline", { "points": "17 8 12 3 7 8" }],
		["line", { "x1": "12", "x2": "12", "y1": "3", "y2": "15" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'upload' },
		$$sanitized_props,
		{
			/**
			 * @component @name Upload
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cG9seWxpbmUgcG9pbnRzPSIxNyA4IDEyIDMgNyA4IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMyIgeTI9IjE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/upload
			 * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			 *
			 * @param {Object} props - Lucide icons props and any valid SVG attribute
			 * @returns {FunctionalComponent} Svelte component
			 *
			 */
			iconNode,

			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, 'default', {});
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}

function LogoutButton($$renderer) {

	$$renderer.push(`<button class="w-full bg-purple-400 text-white py-2 px-4 rounded hover:bg-purple-500 transition-colors flex items-center justify-center">`);
	Log_out($$renderer, { class: 'mr-2', size: 18, strokeWidth: 2.5 });
	$$renderer.push(`<!----> <span class="font-normal">Cerrar Sesión</span></button>`);
}

const $$Astro$1 = createAstro();
const $$AsideMenu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AsideMenu;
  const { currentPath } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="h-full overflow-y-auto bg-white p-4 flex flex-col gap-2"> <div class=""> ${renderComponent($$result, "LogoutButton", LogoutButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/LogoutButton.svelte", "client:component-export": "default" })} </div> <div class="bg-zinc-200 p-4 rounded-lg"> <h2 class="text-xl font-bold text-black mb-4">Guía rápida de uso</h2> <ol class="space-y-4"> <li class="flex items-start"> ${renderComponent($$result, "FileSpreadsheet", File_spreadsheet, { "class": "w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Cargar archivo Excel</span> </li> <li class="flex items-start"> ${renderComponent($$result, "List", List, { "class": "w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Revisar y seleccionar cabeceras</span> </li> <li class="flex items-start"> ${renderComponent($$result, "Cog", Cog, { "class": "w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Configurar reglas por categoría</span> </li> <li class="flex items-start"> ${renderComponent($$result, "FileJson", File_json, { "class": "w-5 h-5 text-purple-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Generar JSON de reglas</span> </li> <li class="flex items-start"> ${renderComponent($$result, "BarChart2", Chart_no_axes_column, { "class": "w-5 h-5 text-red-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Analizar datos</span> </li> <li class="flex items-start"> ${renderComponent($$result, "Download", Download, { "class": "w-5 h-5 text-teal-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Descargar resultados</span> </li> </ol> </div> <!-- Instrucciones para guardar y cargar estado --> <div class="bg-zinc-200 p-4 rounded-lg mt-4"> <h2 class="text-xl font-bold text-black mb-4">Guardar/Cargar Progreso</h2> <ul class="space-y-4"> <li class="flex items-start"> ${renderComponent($$result, "Save", Save, { "class": "w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Guarde su progreso haciendo clic en "Guardar Estado"</span> </li> <li class="flex items-start"> ${renderComponent($$result, "Upload", Upload, { "class": "w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Cargue un estado guardado con "Cargar Estado"</span> </li> <li class="flex items-start"> ${renderComponent($$result, "AlertCircle", Circle_alert, { "class": "w-5 h-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" })} <span class="text-black">Guarde regularmente para evitar pérdida de trabajo</span> </li> </ul> </div> </nav>`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/AsideMenu.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-zinc-600 text-white py-8"> <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"> <!-- Dirección --> <div class="flex flex-col items-center justify-center text-center"> <div class="mb-2"> <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current"> <path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602"></path> </svg> </div> <h3 class="font-bold mb-2">Dirección</h3> <p>Cra 79 #45D 137</p> <p>Medellín, Antioquia</p> </div> <!-- Teléfono --> <div class="flex flex-col items-center justify-center text-center"> <div class="mb-2"> <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current"> <path d="M8.26 1.289l-1.564.772c-5.793 3.02 2.798 20.944 9.31 20.944.46 0 .904-.094 1.317-.284l1.542-.755-2.898-5.594-1.54.754c-.181.087-.384.134-.597.134-2.561 0-6.841-8.204-4.241-9.596l1.546-.763-2.875-5.612zm7.746 22.711c-5.68 0-12.221-11.114-12.221-17.832 0-2.419.833-4.146 2.457-4.992l2.382-1.176 3.857 7.347-2.437 1.201c-1.439.772 2.409 8.424 3.956 7.68l2.399-1.179 3.816 7.36s-2.36 1.162-2.476 1.215c-.547.251-1.129.376-1.733.376"></path> </svg> </div> <h3 class="font-bold mb-2">Teléfono</h3> <p>(604)-590 0087</p> <p>Cel. 300 870 55 21</p> </div> <!-- Email --> <div class="flex flex-col items-center justify-center text-center"> <div class="mb-2"> <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current"> <path d="M24 21h-24v-18h24v18zm-23-16.477v15.477h22v-15.477l-10.999 10-11.001-10zm21.089-.523h-20.176l10.088 9.171 10.088-9.171z"></path> </svg> </div> <h3 class="font-bold mb-2">Email</h3> <a href="mailto:info@saviaservicios.com" class="text-white hover:underline">info@saviaservicios.com</a> </div> </div> </div>`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/Footer.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, currentPath } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><!-- Meta información básica --><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/public/styles/global.css"><title>${title}</title><link rel="icon" type="image/png" href="/public/icon.png">${renderHead()}</head> <body class="h-full bg-white"> <div id="app" class="h-full "> <aside class="grid-area-aside flex-col flex overflow-y-auto"> ${renderComponent($$result, "AsideMenu", $$AsideMenu, { "currentPath": currentPath })} </aside> <main class="grid-area-main rounded-lg bg-white w-full"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="grid-area-footer min-h-[80px] text-gray-100"> ${renderComponent($$result, "Footer", $$Footer, {})} </footer> </div> </body></html>`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/layouts/Layout.astro", void 0);

// Crear un store para compartir los encabezados con otros componentes
const headersStore = writable([]);

// stores/excelFileStore.js

const excelFileStore = writable({ file: null, fileName: '' });

function UploadButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let isLoading = writable(false); // Estado de carga

		$$renderer.push(`<div class="flex items-center justify-center w-full"><label for="dropzone-file" class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-green-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"><div class="flex items-center justify-center pt-4 space-x-3"><svg class="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"></path></svg> <p class="text-sm text-black dark:text-gray-400"><span class="font-semibold">Click para cargar excel</span> o arrastre y suelte</p></div> <p class="text-xs text-black dark:text-gray-400 pb-4">XLSX, XLS</p> <input id="dropzone-file" type="file" class="hidden" accept=".xlsx, .xls"/></label></div> `);

		if (store_get($$store_subs ??= {}, '$isLoading', isLoading)) {
			$$renderer.push('<!--[0-->');
			$$renderer.push(`<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"><svg class="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"></path></svg> <p class="text-lg font-semibold text-gray-700">Cargando cabeceras...</p></div></div>`);
		} else {
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]-->`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function HeadersList($$renderer) {
	var $$store_subs;
	let headers = [];

	// Suscribirse al store para obtener las cabeceras
	headers = store_get($$store_subs ??= {}, '$headersStore', headersStore);

	$$renderer.push(`<div class="w-full max-h-[30vh] overflow-y-auto p-2"><h2 class="text-lg text-black font-bold mb-4">Cabeceras del Archivo:</h2> `);

	if (headers.length > 0) {
		$$renderer.push('<!--[0-->');
		$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);

		const each_array = ensure_array_like(headers);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let header = each_array[$$index];

			$$renderer.push(`<div class="bg-zinc-500 p-3 text-white rounded-lg flex items-center justify-center"><span class="text-sm">${escape_html(header)}</span></div>`);
		}

		$$renderer.push(`<!--]--></div>`);
	} else {
		$$renderer.push('<!--[-1-->');
		$$renderer.push(`<p class="text-black">No se ha cargado ningún archivo.</p>`);
	}

	$$renderer.push(`<!--]--></div>`);

	if ($$store_subs) unsubscribe_stores($$store_subs);
}

// rulesStores.js

const initialRules = {
  rules: {
    categories: {
      nullRules: [],
      notNullRules: [],
      variableTypeRules: [],
      sizeRules: [],
      minimumAndMaximumRules: [],
      duplicationRules: [],
      comparisonsWithOtherColumnRules: [],
      comparisonsWithDateRules: [],
      orderColumnsRules: [],
      rangeWithWordRules: [],
      dateRangeRules: [],
      specificValuesRules: [],
      conditionalNonNullInColumnsspecificsRules: [],
      conditionalNonNullRules: [],    
    },
    dictionaries: {
      names: [],
      numbers: [],
      habits: []
    }
  },
  report: {
    headers: []
  }
};

const rulesStore = writable(initialRules);

function Tooltip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let content = fallback($$props['content'], '');

		$$renderer.push(`<div class="relative inline-block"><button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full" aria-label="Más información">`);
		Info$1($$renderer, { size: 18 });
		$$renderer.push(`<!----></button> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { content });
	});
}

function CompareColumnsCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor de la primer Columna debe ser [ Igual a, Menor a o Mayor a ] con la que se compara.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.comparisonsWithOtherColumnRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">7 Comparar Columnas</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

// Definir las reglas de tipo de variable iniciales
const initialVariableTypeRules = [  
  { name: 'numeric', label: 'Numérico' },
  { name: 'string', label: 'Texto' },
  { name: 'uuid', label: 'Alfanumérico' },
  { name: 'binary', label: 'Binario' },
  { name: 'boolean', label: 'Booleano' }
];

// Crear el store con las reglas iniciales
const categoriesStore = writable({
  variableTypeRules: initialVariableTypeRules
});

function HeaderTypeAssociation($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor en la columna seleccionada Debe ser: Texto, Númererico, Alfanumerico, Si o No, Falso o Verdadero, Booleano (1 o 0).";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$categoriesStore', categoriesStore).variableTypeRules;
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.variableTypeRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">2 Tipos de Variable</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function ColumnsOrder($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Se Debe seleccionar dos a cinco columnas y establecer cual debe ser el orden de acuerdo a los valores de las entradas: ejemplo= CAP 1>CAP 2>CAP 3 > CAP 4 > CAP 5 --> Ascendente o Descendiente.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.orderColumnsRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">10 Validar Orden de Columnas</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function RangeWithWord($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Regla para validar palabras claves en una columna (Columna Tipo) si una columna (Columna de Rango)  tiene un valor entre un rango. Ejemplo= si el rango es [ Minimo= 1.5,  Maximo= 5.0 ] Palabra clave = Tipo1, si el rango es [ Minimo= 5.1,  Maximo= 15.0 ] Palabra clave = Tipo2, si el rango es [ Minimo= 15.0,  Maximo= 20.0 ] Palabra clave = Tipo3, si el rango es [ Minimo= 15.0,  Maximo= ] Palabra clave = Tipo4 ";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.rangeWithWordRules?.[0] || { rangeColumn: '', ranges: [], typeColumn: '' };

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex justify-between items-center"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">6 Rangos con Palabras Clave</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors"${attr('aria-label', "Expandir")}>`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function DateRangeRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Se selecciona la fecha inicial y final que debe estar contenida en los valores de la columna de referencia.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.dateRangeRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">11,1 Rango de Fechas</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function SizeRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor en la columna seleccionada debe tener una longitud de caracteres maxima al valor ingresado en el campo Tamaño.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.sizeRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">3 Conteo de Número de Caracteres</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function MinimumAndMaximum($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor en la columna seleccionada debe tener un Minimo y Maximo numéricos.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.minimumAndMaximumRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">8 Reglas de Mínimo y Máximo</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function NullRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor en la columna seleccionada debe ser nulo.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.nullRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg relative"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">1,1 Detección de no nulidad</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function NotNullRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "El valor en la columna seleccionada no debe ser nulo.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.notNullRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">1 Detección de nulidad</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function SpecificValuesRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Validacion de valores especificos. Ejemplo= _Status debe tener valor especifico Validado o Realizado.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories.specificValuesRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">12 Reglas de Valores Específicos</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function ConditionalNonNullRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Columna seleccionada con un valor no nulo no puede tener un valor  nulo en columna comparada [ejemplo, Si estado es realizado, no puede haber valores nulos en fecha de intervención, profesional de intervención y en id de foto de despues]";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories.conditionalNonNullRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">13 No Nulidad por Columna Condicionante.</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function Dictionaries($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Se debe seleccionar la columna y entrada del diccionario que el valor de la entrada debe coincidir (Nombres cientificos con N. comunes, Barrios con comunas, hábito con especie, altura con tipo de altura, Listado de municipios).";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.dictionaries;

		let $$settled = true;
		let $$inner_renderer;

		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">5 Validacion con Diccionarios</h2> `);

			Tooltip($$renderer, {
				content: tooltipContent,
				children: ($$renderer) => {
					Info$1($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
				},
				$$slots: { default: true }
			});

			$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors"${attr('aria-label', "Expandir sección")}>`);

			{
				$$renderer.push('<!--[-1-->');
				Chevron_down($$renderer, {});
			}

			$$renderer.push(`<!--]--></button></div> `);

			{
				$$renderer.push('<!--[-1-->');
			}

			$$renderer.push(`<!--]--></div>`);
		}

		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);

		$$renderer.subsume($$inner_renderer);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function DuplicationRules($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "En la columna seleccionada se compara todos los valores para validar que no esten duplicados.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.duplicationRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">4 Detección de Duplicados</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function CompareDatesCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Se selecciona una columna y se compara con [ Igual a, Menor a o Mayor a ] otra columna de tipo fecha. Ejemplo= fecha de diagnóstico no puede ser posterior a fecha de intervención.";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories?.comparisonsWithDateRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h2 class="text-lg font-bold text-black">11 Regla Comparación de Fechas</h2> `);
		Tooltip($$renderer, { content: tooltipContent });
		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function ConditionalNonNullsspecific($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		const tooltipContent = "Validacion de numero de columnas con valor y con null de acuerdo al numero que haya en una columna seleccionada, ejemplo=  si en la columna de la tabla de excel numero_tallos esta el numero 2, entonces en las columnas previamente seleccionadas por el cliente como tallo_1, tallo_2, tallo_3, tallo_4, tallo_5, entonces tallo_1, tallo_2 deberian estar llenas por algun valor numerico y tallo_3, tallo_4 y tallo_5 en null";

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).rules.categories.conditionalNonNullInColumnsspecificRules || [];

		$$renderer.push(`<div class="custom-green-div p-4 rounded-lg"><div class="flex items-center justify-between"><div class="flex items-center space-x-2"><h2 class="text-lg font-bold text-black">9 Reglas Validación No Nulos</h2> `);

		Tooltip($$renderer, {
			content: tooltipContent,
			children: ($$renderer) => {
				Info$1($$renderer, { size: 20, class: 'text-gray-600 cursor-help' });
			},
			$$slots: { default: true }
		});

		$$renderer.push(`<!----></div> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function CategoriesContainer($$renderer) {
	$$renderer.push(`<div class="space-y-6"><div class="space-y-4">`);
	NotNullRules($$renderer);
	$$renderer.push(`<!----> `);
	NullRules($$renderer);
	$$renderer.push(`<!----> `);
	HeaderTypeAssociation($$renderer);
	$$renderer.push(`<!----> `);
	SizeRules($$renderer);
	$$renderer.push(`<!----> `);
	DuplicationRules($$renderer);
	$$renderer.push(`<!----> `);
	Dictionaries($$renderer);
	$$renderer.push(`<!----> `);
	RangeWithWord($$renderer);
	$$renderer.push(`<!----> `);
	CompareColumnsCard($$renderer);
	$$renderer.push(`<!----> `);
	MinimumAndMaximum($$renderer);
	$$renderer.push(`<!----> `);
	ConditionalNonNullsspecific($$renderer);
	$$renderer.push(`<!----> `);
	ColumnsOrder($$renderer);
	$$renderer.push(`<!----> `);
	CompareDatesCard($$renderer);
	$$renderer.push(`<!----> `);
	DateRangeRules($$renderer);
	$$renderer.push(`<!----> `);
	SpecificValuesRules($$renderer);
	$$renderer.push(`<!----> `);
	ConditionalNonNullRules($$renderer);
	$$renderer.push(`<!----></div></div>`);
	// import NotNullRulesTest from './NotNullRulesTest.svelte';
}

function SaveLoadState($$renderer, $$props) {
	$$renderer.component(($$renderer) => {

		excelFileStore.subscribe((value) => {
			value.fileName;
		});

		$$renderer.push(`<div class="bg-zinc-100 p-4 rounded-lg"><h2 class="text-lg font-bold text-black mb-4">Guardar/Cargar Estado</h2> <div class="flex gap-4"><button class="flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors w-1/2">`);
		Arrow_down_to_line($$renderer, { size: 20 });
		$$renderer.push(`<!----> Guardar Estado</button> <label for="load-state" class="flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer w-1/2">`);
		Arrow_up_from_line($$renderer, { size: 20 });
		$$renderer.push(`<!----> Cargar Estado</label> <input id="load-state" type="file" accept=".json" class="hidden"/></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

function AnalyzeButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let excelFile;

		onDestroy(() => {
		});

		store_get($$store_subs ??= {}, '$rulesStore', rulesStore);
		({ file: excelFile } = store_get($$store_subs ??= {}, '$excelFileStore', excelFileStore));

		$$renderer.push(`<div class="space-y-4 mb-4"><button${attr('disabled', !excelFile, true)} class="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-live="polite">`);

		{
			$$renderer.push('<!--[-1-->');
			$$renderer.push(`Analizar`);
		}

		$$renderer.push(`<!--]--></button> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function ReportHeaders($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		store_get($$store_subs ??= {}, '$headersStore', headersStore);
		store_get($$store_subs ??= {}, '$rulesStore', rulesStore).report?.headers || [];

		$$renderer.push(`<div class="bg-zinc-100 p-4 rounded-lg"><div class="flex items-center justify-between"><h2 class="text-lg font-bold text-black">Cabeceras del Reporte</h2> <button class="text-black hover:text-blue-300 transition-colors">`);

		{
			$$renderer.push('<!--[-1-->');
			Chevron_down($$renderer, {});
		}

		$$renderer.push(`<!--]--></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function ExpirationWarning($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
	});
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Project-a" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid-area-main h-full flex flex-col gap-4 p-4 "> <!-- Área de cabeceras --> <div id="container" class="bg-zinc-200 p-4 rounded-lg backdrop-blur-sm overflow-y-auto flex-shrink-0"> <div class="space-y-4"> <div class="rounded p-2"> ${renderComponent($$result2, "UploadButton", UploadButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/UploadButton.svelte", "client:component-export": "default" })} </div> <div class="bg-zinc-200 rounded p-2"> ${renderComponent($$result2, "HeadersList", HeadersList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/HeadersList.svelte", "client:component-export": "default" })} </div> </div> </div> <!-- Área de categorías --> <div class="backdrop-blur-sm overflow-y-auto flex-grow"> ${renderComponent($$result2, "CategoriesContainer", CategoriesContainer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/CategoriesContainer.svelte", "client:component-export": "default" })} </div> <div> ${renderComponent($$result2, "ReportHeaders", ReportHeaders, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/ReportHeaders.svelte", "client:component-export": "default" })} </div> <!-- Botón para guardar y cargar estado de la app --> <div> ${renderComponent($$result2, "SaveLoadState", SaveLoadState, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/SaveLoadState.svelte", "client:component-export": "default" })} </div> <div> ${renderComponent($$result2, "AnalyzeButton", AnalyzeButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/AnalyzeButton.svelte", "client:component-export": "default" })} </div> </div> ${renderComponent($$result2, "ExpirationWarning", ExpirationWarning, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/ExpirationWarning.svelte", "client:component-export": "default" })} ` })}`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/index.astro", void 0);

const $$file = "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
