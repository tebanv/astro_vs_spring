package co.com.savia.model.report.response;
import co.com.savia.model.report.ReportModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


@lombok.Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ReportResponse {

    private int code;
    private ReportModel data;
    private Error error;
}
