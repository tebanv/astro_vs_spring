package co.com.savia.usecase.analyzedatabase;

import co.com.savia.model.excel.gateways.ExcelRepository;
import co.com.savia.model.report.ReportModel;
import co.com.savia.model.report.gateways.ReportRepository;
import co.com.savia.model.report.request.*;
import co.com.savia.model.report.response.DownloadReport;
import co.com.savia.model.report.response.Error;
import co.com.savia.model.report.response.ReportResponse;
import co.com.savia.usecase.analyzedatabase.util.Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Log4j2
@RequiredArgsConstructor
public class AnalyzeDatabaseUseCase {

    private final Environment environment;
    private final ReportRepository reportRepository;
    private final ExcelRepository excelRepository;

    public Mono<ReportResponse> analyzeDatabaseWithRules(List<Map<String, String>> records, ValidationRules rules,
                                                         String fileName) {
        if (!records.isEmpty() && !Objects.isNull(rules)) {

            String reportId = UUID.randomUUID().toString();
            ReportModel reportModel = reportRepository.saveReport(ReportModel.builder()
                    .status("PENDIENTE")
                    .reportId(reportId)
                    .build());

            analyzeDataBaseAndUpdateStatusReport(records, rules, fileName, reportId, reportModel);

            return Mono.just(ReportResponse.builder()
                    .code(200)
                    .data(reportModel)
                    .build());
        } else {
            return Mono.just(ReportResponse.builder()
                    .code(400)
                    .error(Error.builder()
                            .detail("Bad Request")
                            .message("Los archivos no pudieron ser leidos")
                            .build())
                    .build());
        }
    }

    private void analyzeDataBaseAndUpdateStatusReport(List<Map<String, String>> records, ValidationRules rules,
                                                      String fileName, String reportId, ReportModel reportModel) {

        log.info("Se empieza a validar cada registro...");
        Mono.just(reportId)
                .doOnNext(id -> {
                    Mono.fromRunnable(() -> {
                                validateRecordsAndGenerateErrorFile(records, rules, fileName, reportModel);
                            }).subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                })
                .subscribe();
    }

    private void validateRecordsAndGenerateErrorFile(List<Map<String, String>> records, ValidationRules rules,
                                                     String fileName, ReportModel reportModel) {

        List<String[]> errorRows = validateRecords(records, rules);
        log.info("Se Validaron los registros correctamente...");

        String errorFileName = Objects.requireNonNull(environment.getProperty("general.prefix-name"))
                .concat(fileName)
                .concat(Objects.requireNonNull(environment.getProperty("general.file-type-report-generated")));
        String filePath = Objects.requireNonNull(environment.getProperty("general.file-path-report-generated"))
                .concat(errorFileName);

        String errorFilePath = excelRepository.generateErrorFileExcel(rules.getReport().getHeaders().size(),
                errorRows, filePath);

        if (errorFilePath != null && !errorFilePath.isEmpty()) {
            File errorFile = new File(errorFilePath);

            if (errorFile.exists()) {
                log.info("Se generó un archivo de errores en la ruta: {}", errorFilePath);
                reportModel.setStatus("COMPLETADO");
                reportModel.setResultFilePath(errorFilePath);
                reportModel.setFileName(errorFileName);
                ReportModel reportModelUpdated = reportRepository.updateReport(reportModel);

                log.info("Se actualiza registro en base de datos: {}", reportModelUpdated);
            } else {
                log.error("El archivo de errores no se pudo encontrar en la ruta: {}", errorFilePath);
                reportModel.setStatus("ERROR");
                ReportModel reportModelUpdated = reportRepository.updateReport(reportModel);

                log.info(" Se actualiza registro en base de datos: {}", reportModelUpdated);
            }
        }
    }

    // Validar Bases de datos
    private List<String[]> validateRecords(List<Map<String, String>> records, ValidationRules rules) {

        List<String[]> errorRows = new ArrayList<>();
        List<String> reportHeaders = rules.getReport().getHeaders();
        List<String> completeHeaders = new ArrayList<>(reportHeaders);

        completeHeaders.addAll(environment.getProperty("headers.categoriesRules") != null ?
                Arrays.asList(Objects.requireNonNull(environment.getProperty("headers.categoriesRules")).split(",")) :
                null);

        String[] header = completeHeaders.toArray(new String[0]);
        errorRows.add(header);
        // Calculate the starting index for error columns
        int errorColumnStartIndex = reportHeaders.size();
        // Iterar sobre cada registro y realizar las validaciones
        for (Map<String, String> record : records) {

            String[] errorRow = new String[header.length];
            for (int i = 0; i < reportHeaders.size(); i++) {
                errorRow[i] = record.get(reportHeaders.get(i));
            }

            // Listas para recolectar errores por categoría
            List<String> nullErrors = new ArrayList<>();
            List<String> notNullErrors = new ArrayList<>();
            List<String> variableTypeErrors = new ArrayList<>();
            List<String> sizeErrors = new ArrayList<>();
            List<String> duplicationErrors = new ArrayList<>();
            List<String> dictionaryByNameErrors = new ArrayList<>();
            List<String> dictionariesHabitsErrors = new ArrayList<>();
            List<String> rangeWithWordErrors = new ArrayList<>();
            List<String> comparisonBetweenColumnsErrors = new ArrayList<>();
            List<String> minMaxErrors = new ArrayList<>();
            List<String> conditionalNonNullInColumnsErrors = new ArrayList<>();
            List<String> orderColumnsErrors = new ArrayList<>();
            List<String> comparisonsWithDateErrors = new ArrayList<>();
            List<String> datesRangeErrors = new ArrayList<>();
            List<String> specificValuesErrors = new ArrayList<>();
            List<String> conditionalNonNullErrors = new ArrayList<>();

            //1 Validar campos No Nulos
            Util.validateFieldsNotNull(record, rules.getRules().getCategories().getNotNullRules(), notNullErrors);
            // 1,1 Validar campos Nulos
            Util.validateFieldsNull(record, rules.getRules().getCategories().getNullRules(), nullErrors);
            // 2 Validar Tipo de Variables
            Util.validateVariableType(record, rules.getRules().getCategories().getVariableTypeRules(), variableTypeErrors);
            //3 Validar Tamaños o Longitudes del campo
            Util.validateSize(record, rules.getRules().getCategories().getSizeRules(), sizeErrors);
            //4 Validar duplicaciones
            Util.validateDuplications(record, records, rules.getRules().getCategories().getDuplicationRules(), duplicationErrors);
            // 5 Validar dictionary por nombre
            validateDictionaryEntries(record, rules.getRules().getDictionaries().getNames(), dictionaryByNameErrors);
            // 5,1 Validar dictionary Validation
            validateHabits(record, rules.getRules().getDictionaries().getHabits(), dictionariesHabitsErrors);
            // 6 Validar rango con palabra
            Util.validateRangeWithWord(record, rules.getRules().getCategories().getRangeWithWordRules(), rangeWithWordErrors);
            // 7 Validar comparaciones entre columnas
            Util.validateComparisonsBetweenColumns(record, rules.getRules().getCategories().getComparisonsWithOtherColumnRules(), comparisonBetweenColumnsErrors);
            // 8 Validar mínimos y máximos
            Util.validateMinMax(record, rules.getRules().getCategories().getMinimumAndMaximumRules(), minMaxErrors);
            // 9 Validar condicionales not null en columnas
            Util.validateConditionalNonNullInColumns(record,
                        rules.getRules().getCategories().getConditionalNonNullInColumnsspecificRules(),
                        conditionalNonNullInColumnsErrors);
            // 10 Validar Orden de Columnas
            Util.validateColumnOrder(record, rules.getRules().getCategories().getOrderColumnsRules(), orderColumnsErrors);
            // 11 Validar Comparaciones de Fechas
            Util.validateDateComparisons(record, rules.getRules().getCategories().getComparisonsWithDateRules(), comparisonsWithDateErrors);
            // 11,1 Validar Rangos entre Fechas
            Util.validateDatesInRange(record, rules.getRules().getCategories().getDateRangeRules(), datesRangeErrors);
            // 12 Validar el valor de campos especificos
            Util.validateSpecificValues(record, rules.getRules().getCategories().getSpecificValuesRules(), specificValuesErrors);
            // 13 Validar condicionales not null
            Util.validateConditionalNonNull(record, rules.getRules().getCategories().getConditionalNonNullRules(), conditionalNonNullErrors);

            // Agregar los errores a las columnas correspondientes
            errorRow[errorColumnStartIndex] = String.join("; ", notNullErrors); // 1 No Nulos
            errorRow[errorColumnStartIndex + 1] = String.join("; ", nullErrors); // 1,1 Nulos
            errorRow[errorColumnStartIndex + 2] = String.join("; ", variableTypeErrors);    // 2 Tipo de variable
            errorRow[errorColumnStartIndex + 3] = String.join("; ", sizeErrors);  // 3 Tamaño
            errorRow[errorColumnStartIndex + 4] = String.join("; ", duplicationErrors); // 4 Duplicación
            errorRow[errorColumnStartIndex + 5] = String.join("; ", dictionaryByNameErrors); // 5 Diccionario por nombre
            errorRow[errorColumnStartIndex + 6] = String.join("; ", dictionariesHabitsErrors); // 5,1 Diccionario por nombre
            errorRow[errorColumnStartIndex + 7] = String.join("; ", rangeWithWordErrors); // 6 Rango con palabra
            errorRow[errorColumnStartIndex + 8] = String.join("; ", comparisonBetweenColumnsErrors); // 7 Comparación entre columnas
            errorRow[errorColumnStartIndex + 9] = String.join("; ", minMaxErrors); // 8 MinMax
            errorRow[errorColumnStartIndex + 10] = String.join("; ", conditionalNonNullInColumnsErrors); // 9 Condionalidad de no nulos con valor numerico
            errorRow[errorColumnStartIndex + 11] = String.join("; ", orderColumnsErrors); // 10 Orden de columnas
            errorRow[errorColumnStartIndex + 12] = String.join("; ", comparisonsWithDateErrors); // 11 Comparación entre fechas
            errorRow[errorColumnStartIndex + 13] = String.join("; ", datesRangeErrors); // 11,1 Rangos entre Fechas
            errorRow[errorColumnStartIndex + 14] = String.join("; ", specificValuesErrors); // 12 valor de campos especificos
            errorRow[errorColumnStartIndex + 15] = String.join("; ", conditionalNonNullErrors); // 13 condicionales not null

            // Añadir la fila con errores a la lista de errores
            errorRows.add(errorRow);
        }

        return errorRows;
    }

    // Consultar estado del reporte de errores
    public Mono<ReportModel> getReportStatus(String reportId) {
        return Mono.just(reportRepository.findByReportId(reportId));
    }

    // Buscar archivo y promover la descarga
    public DownloadReport getResource(String filename) {

        Path filePath = Paths.get(Objects.requireNonNull(environment.getProperty("general.file-path-report-generated")))
                .resolve(filename).normalize();

        File file = filePath.toFile();

        // Validar si el archivo existe
        if (!file.exists()) {
            log.info("archivo no existe");
            return DownloadReport.builder()
                    .code(404)
                    .data(new ByteArrayResource(("File not found: " + filename).getBytes()))
                    .build();
        }

        // Crear el recurso del archivo
        Resource resource = new FileSystemResource(file);

        return DownloadReport.builder()
                .code(200)
                .data(resource)
                .build();
    }

    // Procesar el archivo Excel
    public List<Map<String, String>> processExcelFile(InputStream dbFileInputStream) throws IOException {
        return excelRepository.processExcelFile(dbFileInputStream);
    }

    // Validar diccionarios
    public void validateDictionaryEntries(Map<String, String> record, List<DirectoriesNames> dictionaries, List<String> errors) {
        // Si el arreglo de diccionarios está vacío, no hacer nada
        if (dictionaries == null || dictionaries.isEmpty()) {
            return;
        }

        for (DirectoriesNames dictionaryRule : dictionaries) {
            String columnName = dictionaryRule.getColumnName(); // Nombre de la columna en los registros
            String dictionaryName = dictionaryRule.getDictionaryName(); // Nombre del diccionario
            String columnNameInDictionary = dictionaryRule.getColumnNameInDictionary(); // Nombre de la columna en el diccionario
            String fieldValue = record.get(columnName); // Valor del registro en la columna

            // Validar si el valor está vacío
            if (fieldValue == null || fieldValue.trim().isEmpty()) {
                errors.add("El campo " + columnName + " está vacío.");
                continue;
            }

            try {
                // Obtener el diccionario cargado
                List<Map<String, String>> dictionaryEntries = excelRepository.getDictionary(dictionaryName);

                // Validar si el diccionario está vacío
                if (dictionaryEntries == null || dictionaryEntries.isEmpty()) {
                    log.warn("El diccionario {} no se pudo cargar o está vacío.", dictionaryName);
                    continue;
                }

                // Validar si el valor del registro no está en el diccionario
                boolean found = dictionaryEntries.stream()
                        .anyMatch(entry -> {
                            // Obtener el valor completo del diccionario para la columna
                            String dictionaryValue = entry.get(columnNameInDictionary);

                            // Si el diccionario tiene valores separados por comas, dividimos en términos y los normalizamos
                            List<String> dictionaryTerms = Arrays.stream(dictionaryValue.split(","))
                                    .map(String::trim)
                                    .map(this::normalizeScientificName) // Normalizamos los términos
                                    .toList();

                            // Normalizar el valor del campo de la base de datos
                            String normalizedFieldValue = normalizeScientificName(fieldValue);

                            // Verificar si el valor normalizado coincide con algún término del diccionario
                            return dictionaryTerms.contains(normalizedFieldValue) ||
                                    dictionaryValue.toLowerCase().contains(normalizedFieldValue.toLowerCase());
                        });

                if (!found) {
                    errors.add("El valor '" + fieldValue + "' en el campo '" + columnName +
                            "' no se encuentra en el diccionario '" + dictionaryName +
                            "' en la columna '" + columnNameInDictionary + "'.");
                }

            } catch (Exception e) {
                log.error("Error al cargar o validar el diccionario {}: {}", dictionaryName, e.getMessage());
                errors.add("Error al validar el campo " + columnName + " con el diccionario " + dictionaryName + ".");
            }
        }
    }
    private String normalizeScientificName(String value) {
        if (value == null) {
            return "";
        }
        // Eliminar números y caracteres no alfabéticos al principio
        value = value.replaceAll("^[0-9.\\-\\s]+", ""); // Regex para eliminar números, puntos, guiones al inicio
        // Eliminar espacios en exceso
        value = value.trim().replaceAll("\\s+", " ");
        return value;
    }


    public void validateHabits(Map<String, String> record, List<DirectoriesHabits> directoriesHabits, List<String> errors) {
        if (directoriesHabits == null || directoriesHabits.isEmpty()) {
            return;
        }

        for (DirectoriesHabits habitRule : directoriesHabits) {
            String columnNameHabit = habitRule.getColumnNameHabit();
            String columnNameToCompare = habitRule.getColumnNameToCompare();
            String dictionaryName = habitRule.getDictionaryName();
            String columnNameInDictionary = habitRule.getColumnNameInDictionary();
            List<Habits> habits = habitRule.getHabits();

            String habitValue = record.get(columnNameHabit);
            String compareValueStr = record.get(columnNameToCompare);

            // Validar si el valor del hábito está vacío
            if (habitValue == null || habitValue.trim().isEmpty()) {
                errors.add("El campo " + columnNameHabit + " está vacío.");
                continue;
            }

            try {
                // Obtener el diccionario cargado
                List<Map<String, String>> dictionaryEntries = excelRepository.getDictionary(dictionaryName);

                // Validar si el diccionario está vacío
                if (dictionaryEntries == null || dictionaryEntries.isEmpty()) {
                    log.warn("El diccionario {} no se pudo cargar o está vacío.", dictionaryName);
                    continue;
                }

                // Validar si el valor del hábito no está en el diccionario
                boolean found = dictionaryEntries.stream()
                        .anyMatch(entry -> {
                            String dictionaryValue = entry.get(columnNameInDictionary);

                            List<String> dictionaryTerms = Arrays.stream(dictionaryValue.split(","))
                                    .map(String::trim)
                                    .map(this::normalizeScientificName)
                                    .toList();

                            String normalizedHabitValue = normalizeScientificName(habitValue);
                            return dictionaryTerms.contains(normalizedHabitValue) ||
                                    dictionaryValue.toLowerCase().contains(normalizedHabitValue.toLowerCase());
                        });

                if (!found) {
                    errors.add("El valor '" + habitValue + "' en el campo '" + columnNameHabit +
                            "' no se encuentra en el diccionario '" + dictionaryName +
                            "' en la columna '" + columnNameInDictionary + "'.");
                    continue;
                }

                // Validar la comparación de valores para el hábito
                Optional<Habits> matchingHabit = habits.stream()
                        .filter(h -> h.getHabit().equalsIgnoreCase(habitValue))
                        .findFirst();

                if (matchingHabit.isPresent()) {
                    Habits habit = matchingHabit.get();
                    double maxValue = Double.parseDouble(habit.getValue());

                    try {
                        double compareValue = Double.parseDouble(compareValueStr);
                        if (compareValue > maxValue) {
                            errors.add("El valor '" + compareValue + "' en la columna '" + columnNameToCompare +
                                    "' para el hábito '" + habitValue +
                                    "' excede el límite permitido de '" + maxValue + "'.");
                        }
                    } catch (NumberFormatException e) {
                        errors.add("El valor '" + compareValueStr + "' en la columna '" + columnNameToCompare +
                                "' no es un número válido.");
                    }
                }

            } catch (Exception e) {
                log.error("Error al cargar o validar el diccionario {}: {}", dictionaryName, e.getMessage());
                errors.add("Error al validar el campo " + columnNameHabit + " con el diccionario " + dictionaryName + ".");
            }
        }
    }


}
