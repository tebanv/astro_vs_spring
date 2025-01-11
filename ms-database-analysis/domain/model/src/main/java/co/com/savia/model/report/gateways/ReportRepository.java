package co.com.savia.model.report.gateways;

import co.com.savia.model.report.ReportModel;


public interface ReportRepository {
    ReportModel findByReportId(String reportId);
    ReportModel saveReport(ReportModel reportModel);
    ReportModel updateReport(ReportModel reportModel);
}
