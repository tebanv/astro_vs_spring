const DEFAULT_CONFIG = {
  services: {
    api: "https://valued-teal-complete.ngrok-free.app/api",
    auth: "https://valued-teal-complete.ngrok-free.app/auth"
  },
  endpoints: {
    login: {
      service: "auth",
      path: "/login"
    },
    analyzeDatabase: {
      service: "api",
      path: "/analyze-databases-savia"
    },
    reportStatus: {
      service: "api",
      path: "/report-status/{reportId}"
    },
    downloadExcel: {
      service: "api",
      path: "/download-excel/{fileName}"
    },
    dictionaries: {
      service: "api",
      path: "/dictionaries"
    }
  }
};

function normalizeBaseUrl(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
  }

  return trimmedValue.endsWith("/") ? trimmedValue.slice(0, -1) : trimmedValue;
}

function normalizePath(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
  }

  return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;
}

function readRuntimeConfig() {
  if (typeof window === "undefined") {
    return {};
  }

  return window.__APP_CONFIG__ ?? {};
}

function readEnvConfig() {
  return {
    services: {
      api: import.meta.env.PUBLIC_API_BASE_URL,
      auth: import.meta.env.PUBLIC_AUTH_BASE_URL
    }
  };
}

function mergeServices(runtimeServices = {}, envServices = {}, defaultServices = {}) {
  return Object.keys(defaultServices).reduce((services, key) => {
    services[key] = normalizeBaseUrl(
      runtimeServices[key] ?? envServices[key],
      defaultServices[key]
    );
    return services;
  }, {});
}

function mergeEndpoints(runtimeEndpoints = {}, defaultEndpoints = {}) {
  return Object.keys(defaultEndpoints).reduce((endpoints, key) => {
    const defaultEndpoint = defaultEndpoints[key];
    const runtimeEndpoint = runtimeEndpoints[key] ?? {};

    endpoints[key] = {
      service: runtimeEndpoint.service ?? defaultEndpoint.service,
      path: normalizePath(runtimeEndpoint.path, defaultEndpoint.path)
    };

    return endpoints;
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
  const envConfig = readEnvConfig();

  return {
    services: mergeServices(
      runtimeConfig.services,
      envConfig.services,
      DEFAULT_CONFIG.services
    ),
    endpoints: mergeEndpoints(
      runtimeConfig.endpoints,
      DEFAULT_CONFIG.endpoints
    )
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