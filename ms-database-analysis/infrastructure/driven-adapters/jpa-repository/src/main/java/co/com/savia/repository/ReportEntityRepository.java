package co.com.savia.repository;

import co.com.savia.model.ReportEntity;
import org.springframework.data.repository.CrudRepository;

public interface ReportEntityRepository extends CrudRepository<ReportEntity, Long> {

    ReportEntity findFirstByReportId(String reportId);
}
