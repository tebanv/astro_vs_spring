package co.com.savia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "tbl_reportes")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String reportId;
    @Column
    private String status;
    @Column
    private String resultFilePath;
    @Column
    private String fileName;
    @Column
    private LocalDateTime createdAt = LocalDateTime.now();


}

