package co.com.savia.model.excel.gateways;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public interface ExcelRepository {

    List<Map<String, String>> processExcelFile(InputStream dbFileInputStream) throws IOException;
    String generateErrorFileExcel(int sizeHeadersReport, List<String[]> errorRows, String filePath);

    List<Map<String, String>> getDictionary(String dictionaryName);
}
