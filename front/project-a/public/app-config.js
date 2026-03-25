window.__APP_CONFIG__ = {
  services: {
    api: "https://httpbin.org/anything/api",
    auth: "https://httpbin.org/anything/auth"
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