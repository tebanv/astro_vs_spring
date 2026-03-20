window.__APP_CONFIG__ = {
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