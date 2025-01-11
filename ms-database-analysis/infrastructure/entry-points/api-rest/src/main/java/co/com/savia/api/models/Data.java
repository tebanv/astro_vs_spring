package co.com.savia.api.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@lombok.Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Data {
    private Long id;
    private String reportId;
    private String status;
    private String resultFilePath;
    private LocalDateTime createdAt;
}
