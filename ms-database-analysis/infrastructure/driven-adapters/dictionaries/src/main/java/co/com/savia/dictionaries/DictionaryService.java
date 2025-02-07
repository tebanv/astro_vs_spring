package co.com.savia.dictionaries;

import co.com.savia.model.dictionary.DictionariesResponse;
import co.com.savia.model.dictionary.Dictionary;
import co.com.savia.model.dictionary.gateways.DictionaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.github.benmanes.caffeine.cache.Cache;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@Service
public class DictionaryService implements DictionaryRepository {

    private final Environment environment;
    private final Cache<String, List<Map<String, String>>> dictionaryCache;

    @Override
    public DictionariesResponse getDictionaries() {
        String path = environment.getProperty("general.file-path-dictionaries");
        List<Dictionary> dictionaries = new ArrayList<>();

        if (path != null) {
            File directory = new File(path);
            if (directory.exists() && directory.isDirectory()) {
                File[] files = directory.listFiles();
                if (files != null) {
                    int idCounter = 1;
                    for (File file : files) {
                        if (file.isFile()) {
                            dictionaries.add(new Dictionary(idCounter++, file.getName()));
                        }
                    }
                }
            }
        }
        return DictionariesResponse.builder()
                .dictionaries(dictionaries).build();
    }

    @Override
    public List<Map<String, String>> getDictionary(String dictionaryName) {
        return dictionaryCache.get(dictionaryName, key -> {
            try {
                String dictionaryFilePath = environment.getProperty("general.file-path-dictionaries") + File.separator
                        + dictionaryName;
                return loadDictionary(dictionaryFilePath);
            } catch (Exception e) {
                throw new RuntimeException("Error loading dictionary: " + dictionaryName, e);
            }
        });
    }

    public List<Map<String, String>> loadDictionary(String dictionaryFilePath) throws Exception {
        List<Map<String, String>> dictionary = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(new File(dictionaryFilePath));
             Workbook workbook = new XSSFWorkbook(fis)) {
            Sheet sheet = workbook.getSheetAt(0); // Leer la primera hoja
            Row headerRow = sheet.getRow(0); // Asumimos que la primera fila contiene los encabezados
            if (headerRow == null) {
                throw new IllegalArgumentException("El diccionario no tiene encabezados.");
            }

            // Obtener encabezados
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue().trim());
            }

            // Leer las filas de datos (a partir de la segunda fila)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue; // Saltar filas vacías
                }

                Map<String, String> rowData = new HashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = getCellValueAsString(cell);
                    //String cellValue = (cell != null) ? cell.toString().trim() : ""; // Manejar celdas vacías
                    rowData.put(headers.get(j), value);
                }
                dictionary.add(rowData);
            }
        }
        return dictionary;
    }
    public static String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return ""; // Retorna una cadena vacía si la celda está vacía
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue(); // Si es texto, retorna el valor como String
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    // Si es una fecha, formatearla como texto (opcional)
                    return cell.getDateCellValue().toString();
                } else {
                    // Si es numérico, formatearlo como entero si no tiene decimales
                    double numericValue = cell.getNumericCellValue();
                    if (numericValue == Math.floor(numericValue)) {
                        return String.valueOf((long) numericValue); // Convierte a entero sin decimales
                    } else {
                        return String.valueOf(numericValue); // Retorna el valor tal cual si tiene decimales
                    }
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue()); // Si es booleano, retorna como texto
            case FORMULA:
                return cell.getCellFormula(); // Si es fórmula, retorna la fórmula como texto
            case BLANK:
                return ""; // Si está en blanco, retorna una cadena vacía
            default:
                return ""; // Para otros casos no manejados
        }
    }
}
