/* empty css                                 */
import { f as createComponent, j as renderHead, k as renderSlot, r as renderTemplate, i as createAstro, l as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BTiRS9nJ.mjs';
import 'kleur/colors';
import 'clsx';
import { a as attr } from '../chunks/_@astro-renderers_DjJuqME3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DjJuqME3.mjs';
import 'esm-env';
import 'jwt-decode';
import { L as Log_out } from '../chunks/log-out_CK9WOV7H.mjs';

const $$Astro = createAstro();
const $$LoginLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LoginLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" class="h-full"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/public/styles/login-styles.css"><link rel="icon" type="image/png" href="/public/icon.png"><title>${title}</title>${renderHead()}</head> <body class="h-full bg-gray-100"> <div id="app" class="h-full flex flex-col"> <main class="grid-area-main flex-grow flex items-center justify-center p-4"> <div class="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"> ${renderSlot($$result, $$slots["default"])} </div> </main> </div> </body></html>`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/layouts/LoginLayout.astro", void 0);

function LoginForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = '';
		let password = '';

		$$renderer.push(`<div class="flex flex-col items-center"><img src="../images/logo.jpg" alt="Logo" class="h-20 w-auto mb-8"/> <form class="space-y-6 w-full"><div><label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email"${attr('value', email)} required="" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/></div> <div><label for="password" class="block text-sm font-medium text-gray-700">Password</label> <input type="password" id="password"${attr('value', password)} required="" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/></div> <div><button type="submit" class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">`);
		Log_out($$renderer, { class: 'mr-2', size: 18, strokeWidth: 2.5 });
		$$renderer.push(`<!----> <span>Iniciar Sesión</span></button></div> `);

		{
			$$renderer.push('<!--[-1-->');
		}

		$$renderer.push(`<!--]--></form></div>`);
	});
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LoginLayout", $$LoginLayout, { "title": "Iniciar Sesi\xF3n" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-8"> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/LoginForm.svelte", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/login.astro", void 0);

const $$file = "C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Login,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
