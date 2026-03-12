import { b as sanitize_props, j as rest_props, h as fallback, k as attributes, l as clsx, f as ensure_array_like, m as element, d as slot, i as bind_props, c as spread_props } from './_@astro-renderers_DjJuqME3.mjs';

/**
 * @license lucide-svelte v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
};

function Icon($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	const $$restProps = rest_props($$sanitized_props, [
		'name',
		'color',
		'size',
		'strokeWidth',
		'absoluteStrokeWidth',
		'iconNode'
	]);

	$$renderer.component(($$renderer) => {
		let name = fallback($$props['name'], undefined);
		let color = fallback($$props['color'], 'currentColor');
		let size = fallback($$props['size'], 24);
		let strokeWidth = fallback($$props['strokeWidth'], 2);
		let absoluteStrokeWidth = fallback($$props['absoluteStrokeWidth'], false);
		let iconNode = fallback($$props['iconNode'], () => [], true);

		const mergeClasses = (...classes) => classes.filter((className, index, array) => {
			return Boolean(className) && array.indexOf(className) === index;
		}).join(' ');

		$$renderer.push(`<svg${attributes(
			{
				...defaultAttributes,
				...$$restProps,
				width: size,
				height: size,
				stroke: color,
				'stroke-width': absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
				class: clsx(mergeClasses('lucide-icon', 'lucide', name ? `lucide-${name}` : '', $$sanitized_props.class))
			},
			void 0,
			void 0,
			void 0,
			3
		)}><!--[-->`);

		const each_array = ensure_array_like(iconNode);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [tag, attrs] = each_array[$$index];

			element($$renderer, tag, () => {
				$$renderer.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
			});
		}

		$$renderer.push(`<!--]--><!--[-->`);
		slot($$renderer, $$props, 'default', {});
		$$renderer.push(`<!--]--></svg>`);

		bind_props($$props, {
			name,
			color,
			size,
			strokeWidth,
			absoluteStrokeWidth,
			iconNode
		});
	});
}

function Log_out($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);

	/**
	 * @license lucide-svelte v0.456.0 - ISC
	 *
	 * This source code is licensed under the ISC license.
	 * See the LICENSE file in the root directory of this source tree.
	 */
	const iconNode = [
		["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
		["polyline", { "points": "16 17 21 12 16 7" }],
		["line", { "x1": "21", "x2": "9", "y1": "12", "y2": "12" }]
	];

	Icon($$renderer, spread_props([
		{ name: 'log-out' },
		$$sanitized_props,
		{
			/**
			 * @component @name LogOut
			 * @description Lucide SVG icon component, renders SVG Element with children.
			 *
			 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjEgMTIgMTYgNyIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-out
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

export { Icon as I, Log_out as L };
