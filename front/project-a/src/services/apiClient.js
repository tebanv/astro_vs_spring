import axios from "axios";

import { resolveEndpointUrl } from "./appConfig.js";

function buildAuthorizedHeaders(token, headers = {}) {
  return token
    ? {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    : headers;
}

export function loginUser(credentials) {
  return fetch(resolveEndpointUrl("login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
}

export function startDatabaseAnalysis(formData, token) {
  return axios.post(resolveEndpointUrl("analyzeDatabase"), formData, {
    headers: buildAuthorizedHeaders(token, {
      "Content-Type": "multipart/form-data",
      Accept: "*/*"
    })
  });
}

export function fetchReportStatus(reportId, token) {
  return axios.get(resolveEndpointUrl("reportStatus", { reportId }), {
    headers: buildAuthorizedHeaders(token)
  });
}

export function getDownloadReportUrl(fileName) {
  return resolveEndpointUrl("downloadExcel", { fileName });
}

export function fetchDictionaries(token) {
  return axios.get(resolveEndpointUrl("dictionaries"), {
    headers: buildAuthorizedHeaders(token, {
      Accept: "*/*"
    })
  });
}