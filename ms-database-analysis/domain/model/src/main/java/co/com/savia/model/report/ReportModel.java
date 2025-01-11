package co.com.savia.model.report;
import lombok.*;
//import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ReportModel {
    private Long id;
    private String reportId;
    private String status;
    private String resultFilePath;
    private String fileName;
    private LocalDateTime createdAt;
}
