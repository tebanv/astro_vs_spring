function normalizeBaseUrl(value) {
  if (typeof value !== "string") {
    throw new Error("Invalid service base URL in runtime config");
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error("Empty service base URL in runtime config");
  }

  return trimmedValue.endsWith("/") ? trimmedValue.slice(0, -1) : trimmedValue;
}

function normalizePath(value) {
  if (typeof value !== "string") {
    throw new Error("Invalid endpoint path in runtime config");
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error("Empty endpoint path in runtime config");
  }

  return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;
}

function readRuntimeConfig() {
  if (typeof window === "undefined" || !window.__APP_CONFIG__) {
    throw new Error("Runtime config not found. Expected window.__APP_CONFIG__ from /app-config.js");
  }

  return window.__APP_CONFIG__;
}

function validateServices(services) {
  if (!services || typeof services !== "object") {
    throw new Error("Runtime config must define a services object");
  }

  return Object.entries(services).reduce((resolvedServices, [key, value]) => {
    resolvedServices[key] = normalizeBaseUrl(value);
    return resolvedServices;
  }, {});
}

function validateEndpoints(endpoints) {
  if (!endpoints || typeof endpoints !== "object") {
    throw new Error("Runtime config must define an endpoints object");
  }

  return Object.entries(endpoints).reduce((resolvedEndpoints, [key, value]) => {
    if (!value || typeof value !== "object") {
      throw new Error(`Invalid endpoint definition: ${key}`);
    }

    if (typeof value.service !== "string" || !value.service.trim()) {
      throw new Error(`Endpoint ${key} must declare a service`);
    }

    resolvedEndpoints[key] = {
      service: value.service.trim(),
      path: normalizePath(value.path)
    };

    return resolvedEndpoints;
  }, {});
}

function replacePathParams(path, params = {}) {
  return path.replace(/\{(\w+)\}/g, (match, key) => {
    if (!(key in params)) {
      throw new Error(`Missing path parameter: ${key}`);
    }

    return encodeURIComponent(String(params[key]));
  });
}

function buildUrl(baseUrl, path) {
  return `${baseUrl}${path}`;
}

export function getAppConfig() {
  const runtimeConfig = readRuntimeConfig();

  return {
    services: validateServices(runtimeConfig.services),
    endpoints: validateEndpoints(runtimeConfig.endpoints)
  };
}

export function resolveEndpointUrl(endpointName, params = {}) {
  const config = getAppConfig();
  const endpoint = config.endpoints[endpointName];

  if (!endpoint) {
    throw new Error(`Unknown endpoint: ${endpointName}`);
  }

  const baseUrl = config.services[endpoint.service];

  if (!baseUrl) {
    throw new Error(`Unknown service: ${endpoint.service}`);
  }

  return buildUrl(baseUrl, replacePathParams(endpoint.path, params));
}