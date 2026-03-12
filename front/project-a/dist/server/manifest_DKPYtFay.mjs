import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C5FdalzU.mjs';
import 'es-module-lexer';
import { n as decodeKey } from './chunks/astro/server_BTiRS9nJ.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Projects/GitHub/astro_vs_spring/front/project-a/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Ey4sMfK0.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Ey4sMfK0.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Projects/GitHub/astro_vs_spring/front/project-a/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DKPYtFay.mjs","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/LoginForm.svelte":"_astro/LoginForm.AReZmwb9.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/UploadButton.svelte":"_astro/UploadButton.DOmCb_xU.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/HeadersList.svelte":"_astro/HeadersList.D2_QEKur.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/CategoriesContainer.svelte":"_astro/CategoriesContainer.Fj4xELm3.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/ReportHeaders.svelte":"_astro/ReportHeaders.Cm81Ebv_.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/SaveLoadState.svelte":"_astro/SaveLoadState.C9M9aclA.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/AnalyzeButton.svelte":"_astro/AnalyzeButton.DCTwkBY1.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/ExpirationWarning.svelte":"_astro/ExpirationWarning.BnEjNULN.js","C:/Projects/GitHub/astro_vs_spring/front/project-a/src/components/LogoutButton.svelte":"_astro/LogoutButton.CeKN92Ib.js","@astrojs/svelte/client-v5.js":"_astro/client-v5.Csdsd0gf.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.Ey4sMfK0.css","/favicon.svg","/icon.png","/fonts/Quosm-Bold.woff2","/fonts/Quosm-Italic.woff2","/fonts/Quosm.woff2","/styles/global.css","/styles/login-styles.css","/images/logo.jpg","/_astro/AnalyzeButton.DCTwkBY1.js","/_astro/branches.B9QKNnWq.js","/_astro/CategoriesContainer.Fj4xELm3.js","/_astro/client-v5.Csdsd0gf.js","/_astro/each.CtsTG0AH.js","/_astro/excelFileStore.gbV-VC_8.js","/_astro/ExpirationWarning.BnEjNULN.js","/_astro/HeadersList.D2_QEKur.js","/_astro/headersStore.Clc0YQCW.js","/_astro/Icon.BrkEbXWJ.js","/_astro/if.B0Nv5e7y.js","/_astro/index-client.DTpCKWQu.js","/_astro/index.42ANG6Sg.js","/_astro/input.BVmsS9Vh.js","/_astro/jsonTransformations.EeoP3yVv.js","/_astro/legacy.FXOBXKgj.js","/_astro/lifecycle.C80C0_W0.js","/_astro/log-out.CJcFiUxT.js","/_astro/LoginForm.AReZmwb9.js","/_astro/LogoutButton.CeKN92Ib.js","/_astro/render.BeVIL7UQ.js","/_astro/ReportHeaders.Cm81Ebv_.js","/_astro/rulesStores.BZ0bCq-V.js","/_astro/runtime.BDGQgSfo.js","/_astro/SaveLoadState.C9M9aclA.js","/_astro/template.yPMK5DUL.js","/_astro/this.BPQmgPK1.js","/_astro/UploadButton.DOmCb_xU.js","/_astro/utils.bNKznlZg.js","/_astro/x.CLmiGIWg.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"n0oOPAy2tOcuaxRIODLUd23FVzeYIWi2tDmccFmOXNI=","experimentalEnvGetSecretEnabled":false});

export { manifest };
