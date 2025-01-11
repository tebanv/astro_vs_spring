package co.com.savia;

import co.com.savia.model.ReportEntity;
import co.com.savia.model.report.ReportModel;
import co.com.savia.model.report.gateways.ReportRepository;
import co.com.savia.repository.ReportEntityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class ReportEntityAdapter implements ReportRepository {

    public final ReportEntityRepository reportRepository;

    @Override
    public ReportModel findByReportId(String reportId) {
        ReportEntity reportEntity = reportRepository.findFirstByReportId(reportId);
        if (reportEntity == null) {
            return null;
        } else {
            return ReportModel.builder()
                    .id(reportEntity.getId())
                    .createdAt(reportEntity.getCreatedAt())
                    .fileName(reportEntity.getFileName())
                    .reportId(reportEntity.getReportId())
                    .status(reportEntity.getStatus())
                    .resultFilePath(reportEntity.getResultFilePath())
                    .build();
        }
    }

    @Override
    public ReportModel saveReport(ReportModel reportModel) {

        ReportEntity reportEntity = ReportEntity.builder()
                .createdAt(LocalDateTime.now())
                .reportId(reportModel.getReportId())
                .status(reportModel.getStatus())
                .build();
        ReportEntity reportEntitySaved = reportRepository.save(reportEntity);

        log.info(" Se guarda registro en base de datos: {}", reportEntitySaved);
        reportModel.setId(reportEntitySaved.getId());
        reportModel.setCreatedAt(reportEntity.getCreatedAt());
        return reportModel;

    }

    @Override
    public ReportModel updateReport(ReportModel reportModel) {
        // Obtener el registro existente de la base de datos
        Optional<ReportEntity> reportEntity = reportRepository.findById(reportModel.getId());

        if (reportEntity.isPresent()) {
            ReportEntity reportEntity1 = reportEntity.get();
            // Actualizar solo los campos que necesitas (por ejemplo, solo el estado y el archivo)
            reportEntity1.setStatus(reportModel.getStatus());
            reportEntity1.setResultFilePath(reportModel.getResultFilePath());
            reportEntity1.setFileName(reportModel.getFileName());

            // Guardar el registro actualizado
            ReportEntity reportEntitySaved = reportRepository.save(reportEntity1);

            // Actualizar el modelo con los valores del registro guardado
            reportModel.setResultFilePath(reportEntitySaved.getResultFilePath());
            reportModel.setStatus(reportEntitySaved.getStatus());
            // Puedes agregar la actualización de otros campos aquí si lo necesitas

            return reportModel;

        } else {
            // Si no se encuentra el reporte, puedes lanzar una excepción o manejar el caso
            throw new EntityNotFoundException("No se encontró el registro con id: " + reportModel.getId());
        }

    }
}
