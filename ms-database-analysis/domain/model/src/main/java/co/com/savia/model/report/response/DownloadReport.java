package co.com.savia.model.report.response;

import co.com.savia.model.report.ReportModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.core.io.Resource;

@lombok.Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class DownloadReport {

    private int code;
    private Resource data;
}
