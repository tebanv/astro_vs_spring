package co.com.savia.usecase.analyzedatabase.util;

import co.com.savia.model.report.request.*;
import lombok.extern.log4j.Log4j2;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Log4j2
public class Util {

    public static final String EL_CAMPO = "El campo ";
    public static final String DELIMITER = "; ";
    public static final String REGEX_NUMERIC = "-?\\d+(\\.\\d+)?";
    public static final String REGEX_STRING = "[\\p{L}\\p{N}\\p{P}\\p{S}\\s]+";
    public static final String REGEX_UUID = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
    public static final String REGEX_BINARY = "[01]";
    public static final String PATTER_DATE_YYYY_MM_DD = "yyyy-MM-dd";
    private static final String DICTIONARY_PATH = "C:\\Projects\\GitHub\\Savia\\databases";



    // 1 No Nulidad
    public static void validateFieldsNotNull(Map<String, String> record, List<String> fieldsNotNulls, List<String> errors) {
        List<String> nullFieldErrors = new ArrayList<>();

        for (String field : fieldsNotNulls) {
            if (record.get(field) == null || record.get(field).isEmpty()) {
                nullFieldErrors.add(EL_CAMPO + field + " no puede ser nulo o vacio");
            }
        }

        if (!nullFieldErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, nullFieldErrors));
        }
    }

    // 1,1 Nulidad
    public static void validateFieldsNull(Map<String, String> record, List<String> fieldNulls, List<String> errors) {
        List<String> nullFieldErrors = new ArrayList<>();

        for (String field : fieldNulls) {
            if (record.get(field) != null && !record.get(field).isEmpty()) {
                nullFieldErrors.add(EL_CAMPO + field + " debe ser nulo o vacio");
            }
        }

        if (!nullFieldErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, nullFieldErrors));
        }
    }

    // 2 Tipo de variable
    public static void validateVariableType(Map<String, String> record, List<VariableTypeRule> variableTypeRules, List<String> errors) {
        List<String> typeValidationErrors = new ArrayList<>(); // Lista temporal para almacenar los errores de validación de tipos

        for (VariableTypeRule rule : variableTypeRules) {
            String value = record.get(rule.getName());

            if (value != null && !value.isEmpty()) {
                try {
                    validateType(rule, value, typeValidationErrors);
                } catch (NumberFormatException e) {
                    log.error("Error en validateVariableType: {}, en ID: {}, record: {}", e.getMessage(), record.get("id"), record);
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser numerico");
                }
            }
        }

        // Si hay errores de validación de tipo, concatenarlos y añadirlos a la lista de errores
        if (!typeValidationErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, typeValidationErrors));
        }
    }

    private static void validateType(VariableTypeRule rule, String value, List<String> typeValidationErrors) {
        switch (rule.getType()) {
            case "numeric":
                if (!value.matches(REGEX_NUMERIC)) {
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser numérico");
                }
                break;
            case "string":
                if (!value.matches(REGEX_STRING)) {
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser un texto válido");
                }
                break;
            case "uuid":
                if (!value.matches(REGEX_UUID)) {
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser un UUID válido");
                }
                break;
            case "binary":
                if (!value.matches(REGEX_BINARY)) { // Validar solo "0" o "1"
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser binario (0 o 1)");
                }
                break;
            case "true_false":
                if (!value.equalsIgnoreCase("verdadero") && !value.equalsIgnoreCase("falso")) {
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser 'verdadero' o 'falso'");
                }
                break;
            case "yes_no":
                if (!value.equalsIgnoreCase("si") && !value.equalsIgnoreCase("no")) {
                    typeValidationErrors.add(EL_CAMPO + rule.getName() + " debe ser 'si' o 'no'");
                }
                break;
            default:
                typeValidationErrors.add(EL_CAMPO + rule.getName() + " tiene un tipo desconocido: " + rule.getType());
                break;
        }
    }

    // 3 Longitud de cadena
    public static void validateSize(Map<String, String> record, List<SizeRule> sizeRules, List<String> errors) {
        List<String> sizeErrors = new ArrayList<>();

        for (SizeRule rule : sizeRules) {
            String value = record.get(rule.getName());
            if (value != null && value.length() > rule.getSize()) {
                sizeErrors.add(EL_CAMPO + rule.getName() + " excede la longitud maxima de " + rule.getSize() + " caracteres");
            }
        }

        if (!sizeErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, sizeErrors));
        }
    }

    // 4 Duplicación
    public static void validateDuplications(Map<String, String> currentRecord, List<Map<String, String>> allRecords, List<String> duplicationFields, List<String> errors) {
        List<String> duplicationErrors = new ArrayList<>();

        for (String field : duplicationFields) {
            String currentValue = currentRecord.get(field);
            if (currentValue != null) {
                for (Map<String, String> otherRecord : allRecords) {
                    if (!otherRecord.equals(currentRecord) && currentValue.equals(otherRecord.get(field))) {
                        duplicationErrors.add(EL_CAMPO + field + " está duplicado");
                        break; // Se encuentra duplicado, pasamos al siguiente campo
                    }
                }
            }
        }

        // Si hay múltiples errores de duplicación, los concatenamos en un solo mensaje
        if (!duplicationErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, duplicationErrors));
        }
    }


    // 6,1 Transformación númerica (área de polígono)

    public static void validateRangeWithWord(Map<String, String> record, List<RangeWithWordRule> rangeRules,
                                             List<String> errors) {
        List<String> rangeTypeValidationErrors = new ArrayList<>();

        for (RangeWithWordRule rule : rangeRules) {
            String rangeValueStr = record.get(rule.getRangeColumn());
            String typeValue = record.get(rule.getTypeColumn());

            if (rangeValueStr != null && !rangeValueStr.isEmpty()) {
                try {
                    double rangeValue = Double.parseDouble(rangeValueStr);

                    boolean isInRange = false;
                    for (RangeWithword range : rule.getRanges()) {
                        // Validar si el valor está dentro del rango especificado
                        if (rangeValue >= range.getMin() && rangeValue <= range.getMax()) {
                            isInRange = true;

                            // Verificar que el valor de la columna de tipo coincida con el tipo esperado
                            if (typeValue == null || !typeValue.equals(range.getType())) {
                                rangeTypeValidationErrors.add(EL_CAMPO + rule.getTypeColumn() +
                                        " debe ser '" + range.getType() + "' cuando " +
                                        rule.getRangeColumn() + " está en el rango [" + range.getMin() +
                                        ", " + range.getMax() + "]");
                            }
                        }
                    }

                    // Si el valor no está dentro de ningún rango, registrar el error
                    if (!isInRange) {
                        rangeTypeValidationErrors.add(EL_CAMPO + rule.getRangeColumn() +
                                " con valor '" + rangeValue + "' no pertenece a ningún rango válido.");
                    }

                } catch (NumberFormatException e) {
                    log.error("Error en validateRangeWithWord: {}, en ID: {}, record: {}",
                            e.getMessage(), record.get("id"), record);
                    rangeTypeValidationErrors.add(EL_CAMPO + rule.getRangeColumn() +
                            " debe ser numérico para aplicar la validación de rango.");
                }
            }
        }

        // Si hay errores de validación de rango y tipo, concatenarlos y añadirlos a la lista de errores
        if (!rangeTypeValidationErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, rangeTypeValidationErrors));
        }
    }


    // 7 Comparación con otra columana
    public static void validateComparisonsBetweenColumns(Map<String, String> record, List<ComparisonWithOtherColumnRule> comparisonRules, List<String> errors) {
        List<String> comparisonErrors = new ArrayList<>(); // Lista temporal para acumular los errores de comparaciones

        for (ComparisonWithOtherColumnRule rule : comparisonRules) {
            String valueOne = record.get(rule.getComparetorOne());
            String valueTwo = record.get(rule.getComparetorTwo());

            if ((valueOne != null && !valueOne.isEmpty()) && (valueTwo != null && !valueTwo.isEmpty())) {
                try {
                    double numOne = Double.parseDouble(valueOne);
                    double numTwo = Double.parseDouble(valueTwo);

                    switch (rule.getOperator()) {
                        case "greater_than":
                            if (!(numOne > numTwo)) {
                                comparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser mayor que " + rule.getComparetorTwo());
                            }
                            break;
                        case "less_than":
                            if (!(numOne < numTwo)) {
                                comparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser menor que " + rule.getComparetorTwo());
                            }
                            break;
                        case "equal_to":
                            if (!(numOne == numTwo)) {
                                comparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser igual a " + rule.getComparetorTwo());
                            }
                            break;
                    }
                } catch (NumberFormatException e) {
                    //log.error("Error en validateComparisons: {}, en ID: {}, recordOne: {}, recordTwo: {}", e.getMessage(), record.get("id"), record.get(rule.getComparetorOne()), record.get(rule.getComparetorTwo()));
                    comparisonErrors.add("Los campos " + rule.getComparetorOne() + " y " + rule.getComparetorTwo() + " deben ser numéricos");
                }
            } else {
                //log.error("Error en validateComparisons: {}, en ID: {}, recordOne: {}, recordTwo: {}", "Vacios o nulos", record.get("id"), record.get(rule.getComparetorOne()), record.get(rule.getComparetorTwo()));
                comparisonErrors.add("Los campos " + rule.getComparetorOne() + " y " + rule.getComparetorTwo() + " no deben estar vacíos o nulos");
            }
        }

        // Si se encontraron errores de comparación, los concatenamos y añadimos a la lista de errores
        if (!comparisonErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, comparisonErrors));
        }
    }

    // 8 Comparación númerica
    public static void validateMinMax(Map<String, String> record, List<MinMaxRule> minMaxRules, List<String> errors) {
        List<String> minMaxErrors = new ArrayList<>();

        for (MinMaxRule rule : minMaxRules) {
            String value = record.get(rule.getName());
            if (value != null && !value.isEmpty()) {
                try {
                    double numericValue = Double.parseDouble(value);
                    if (numericValue < rule.getMinValue() || numericValue > rule.getMaxValue()) {
                        // Acumular el error en la lista temporal
                        minMaxErrors.add(EL_CAMPO + rule.getName() + " debe estar entre " + rule.getMinValue() + " y " + rule.getMaxValue());
                    }
                } catch (NumberFormatException e) {
                    log.error("Error en validateMinMax: {}, en ID: {}, record: {}", e.getMessage(), record.get("id"), record.get(rule.getName()));
                    // Acumular el error en la lista temporal
                    minMaxErrors.add(EL_CAMPO + rule.getName() + " debe ser numérico");
                }
            }
        }

        // Si se encontraron errores de min/max, los concatenamos y añadimos a la lista de errores
        if (!minMaxErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, minMaxErrors));
        }
    }

    // 9 Conteo valores no nulos
    public static void validateConditionalNonNullInColumns(Map<String, String> record, List<ConditionalNonNullInColumnsRule> rules,
                                                  List<String> errors) {
        if (!rules.isEmpty()) {
            for (ConditionalNonNullInColumnsRule rule : rules) {
                // Obtiene el valor de la columna seleccionada
                String selectedColumnValue = record.get(rule.getSelectedColumn());

                // Si el valor de la columna seleccionada no está vacío y es un número
                if (selectedColumnValue != null && !selectedColumnValue.isEmpty()) {
                    try {
                        int number = Integer.parseInt(selectedColumnValue);
                        List<String> columnsToValidate = rule.getColumnsToValidate();

                        // Verifica las columnas que deberían estar llenas y vacías
                        List<String> missingValues = new ArrayList<>();
                        List<String> invalidNonNullValues = new ArrayList<>();

                        for (int i = 0; i < columnsToValidate.size(); i++) {
                            String columnName = columnsToValidate.get(i);
                            String columnValue = record.get(columnName);

                            // Las primeras 'number' columnas deben tener valores numéricos
                            if (i < number) {
                                if (columnValue == null || columnValue.isEmpty() || !isNumeric(columnValue)) {
                                    missingValues.add(columnName);
                                }
                            }
                            // Las demás columnas deben ser nulas
                            else {
                                if (columnValue != null && !columnValue.isEmpty()) {
                                    invalidNonNullValues.add(columnName);
                                }
                            }
                        }

                        // Registra los errores encontrados
                        if (!missingValues.isEmpty()) {
                            errors.add("Cuando " + rule.getSelectedColumn() + " es '" + number + "', las siguientes columnas deben tener valores numericos: "
                                    + String.join(", ", missingValues));
                        }
                        if (!invalidNonNullValues.isEmpty()) {
                            errors.add("Cuando " + rule.getSelectedColumn() + " es '" + number + "', las siguientes columnas deben estar vacias: "
                                    + String.join(", ", invalidNonNullValues));
                        }
                    } catch (NumberFormatException e) {
                        // Si no es un número válido
                        errors.add("El valor de la columna '" + rule.getSelectedColumn() + "' debe ser un numero. Valor encontrado: " + selectedColumnValue);
                    }
                }
            }
        }
    }

    private static boolean isNumeric(String value) {
        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // 10 Orden cuantitativo
    public static void validateColumnOrder(Map<String, String> record, List<OrderColumnRule> orderColumnRule, List<String> errors) {
        List<String> orderValidationErrors = new ArrayList<>();

        for (OrderColumnRule rule : orderColumnRule) {
            List<String> columns = rule.getColumns();
            String orderType = rule.getOrderType();

            List<Double> values = new ArrayList<>();
            boolean allValuesParsed = true;

            // Extraer y convertir los valores de las columnas seleccionadas
            for (String column : columns) {
                String valueStr = record.get(column);

                try {
                    if (valueStr != null && !valueStr.isEmpty()) {
                        values.add(Double.parseDouble(valueStr));
                    } else {
                        values.add(null); // Añadir null si el valor está vacío
                    }
                } catch (NumberFormatException e) {
                    log.error("Error en validateColumnOrder: Valor no numérico en columna '{}', ID: {}, record: {}", column, record.get("id"), record);
                    orderValidationErrors.add(EL_CAMPO + column + " debe ser numérico para aplicar la validación de orden.");
                    allValuesParsed = false;
                }
            }

            // Continuar solo si todos los valores pudieron ser convertidos a numéricos
            if (allValuesParsed) {
                boolean isOrdered = true;

                // Verificar el orden dependiendo de 'ascendente' o 'descendente'
                for (int i = 1; i < values.size(); i++) {
                    Double prevValue = values.get(i - 1);
                    Double currValue = values.get(i);

                    if (prevValue != null && currValue != null) {
                        if ("ascendente".equalsIgnoreCase(orderType) && prevValue > currValue) {
                            isOrdered = false;
                            break;
                        } else if ("descendente".equalsIgnoreCase(orderType) && prevValue < currValue) {
                            isOrdered = false;
                            break;
                        }
                    }
                }

                // Si el orden es incorrecto, se añade un mensaje de error
                if (!isOrdered) {
                    orderValidationErrors.add("Las columnas " + columns + " deben estar en orden " + orderType + ".");
                }
            }
        }

        // Si hay errores de validación de orden, concatenarlos y añadirlos a la lista de errores
        if (!orderValidationErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, orderValidationErrors));
        }
    }

    // 11 Comparación de fechas
    public static void validateDateComparisons(Map<String, String> record, List<DateComparisonRule> dateComparisonRules, List<String> errors) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(PATTER_DATE_YYYY_MM_DD);
        List<String> dateComparisonErrors = new ArrayList<>(); // Lista temporal para los errores de comparación de fechas

        if (!dateComparisonRules.isEmpty()) {
            for (DateComparisonRule rule : dateComparisonRules) {
                String dateOne = record.get(rule.getComparetorOne());
                String dateTwo = record.get(rule.getComparetorTwo());

                if ((dateOne != null && !dateOne.isEmpty()) && (dateTwo != null && !dateTwo.isEmpty())) {
                    try {
                        LocalDate localDateOne = LocalDate.parse(dateOne.trim(), formatter);
                        LocalDate localDateTwo = LocalDate.parse(dateTwo.trim(), formatter);

                        switch (rule.getOperator()) {
                            case "greater_than":
                                if (!localDateOne.isAfter(localDateTwo)) {
                                    dateComparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser posterior a " + rule.getComparetorTwo());
                                }
                                break;
                            case "less_than":
                                if (!localDateOne.isBefore(localDateTwo)) {
                                    dateComparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser anterior a " + rule.getComparetorTwo());
                                }
                                break;
                            case "equal_to":
                                if (!localDateOne.equals(localDateTwo)) {
                                    dateComparisonErrors.add(EL_CAMPO + rule.getComparetorOne() + " debe ser igual a " + rule.getComparetorTwo());
                                }
                                break;
                        }
                    } catch (DateTimeParseException e) {
                        //log.error("Error en validateDateComparisons: {}, en ID: {}, recordOne: {}, recordTwo: {}", e.getMessage(), record.get("id"), record.get(rule.getComparetorOne()), record.get(rule.getComparetorTwo()));
                        dateComparisonErrors.add("Los campos " + rule.getComparetorOne() + " y " + rule.getComparetorTwo() + " deben tener formato de fecha válido (yyyy-MM-dd)");
                    }
                } else {
                    // Si uno de los campos es nulo o vacio
                    //log.error("Error en validateDateComparisons: {}, en ID: {}, recordOne: {}, recordTwo: {}", "Fecha nula o vacia ", record.get("id"), record.get(rule.getComparetorOne()), record.get(rule.getComparetorTwo()));
                    dateComparisonErrors.add("Los campos " + rule.getComparetorOne() + " y " + rule.getComparetorTwo() + " no deben estar vacíos o nulos");
                }
            }

        }
        // Si hay errores en las comparaciones de fechas, los concatenamos y añadimos a la lista principal de errores
        if (!dateComparisonErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, dateComparisonErrors));
        }
    }

    // 11,1 Rango de fechas
    public static void validateDatesInRange(Map<String, String> record, List<DateRangeRule> dateRangeRules, List<String> errors) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(PATTER_DATE_YYYY_MM_DD); // Ajusta el formato si es necesario
        List<String> dateValidationErrors = new ArrayList<>();

        for (DateRangeRule rule : dateRangeRules) {
            String startDateStr = record.get(rule.getStartDateColumn());
            String endDateStr = record.get(rule.getEndDateColumn());
            String referenceDateStr = record.get(rule.getReferenceDateColumn());

            // Verificar que las fechas no estén vacías
            if (startDateStr == null || endDateStr == null || referenceDateStr == null) {
                dateValidationErrors.add("Fechas en columnas " + rule.getStartDateColumn() + ", " + rule.getEndDateColumn() + " o " + rule.getReferenceDateColumn() + " están vacías.");
                continue;
            }

            try {
                LocalDate startDate = LocalDate.parse(startDateStr, dateFormatter);
                LocalDate endDate = LocalDate.parse(endDateStr, dateFormatter);
                String[] referenceDates = referenceDateStr.split(" - "); // Se asume que las fechas de rango están separadas por un guion

                if (referenceDates.length == 2) {
                    LocalDate referenceStartDate = LocalDate.parse(referenceDates[0].trim(), dateFormatter);
                    LocalDate referenceEndDate = LocalDate.parse(referenceDates[1].trim(), dateFormatter);

                    // Validar que la fecha de inicio y la fecha final estén contenidas en el rango
                    if (startDate.isBefore(referenceStartDate) || endDate.isAfter(referenceEndDate)) {
                        dateValidationErrors.add("El rango de fechas (" + startDateStr + " - " + endDateStr + ") debe estar contenido dentro de " + referenceDateStr);
                    }
                } else {
                    dateValidationErrors.add("Formato de rango de fechas en la columna " + rule.getReferenceDateColumn() + " es incorrecto.");
                }

            } catch (DateTimeParseException e) {
                log.error("Error en validateDateRangeInReference: Formato de fecha inválido en columnas '{}', '{}', o '{}', ID: {}, record: {}", rule.getStartDateColumn(), rule.getEndDateColumn(), rule.getReferenceDateColumn(), record.get("id"), record);
                dateValidationErrors.add("Formato de fecha inválido en una de las columnas: " + rule.getStartDateColumn() + ", " + rule.getEndDateColumn() + ", " + rule.getReferenceDateColumn());
            }
        }

        // Si hay errores de validación de fechas, concatenarlos y añadirlos a la lista de errores
        if (!dateValidationErrors.isEmpty()) {
            errors.add(String.join(DELIMITER, dateValidationErrors));
        }
    }


    // 12 Asociación de columanas para no nulidad
    public static void validateSpecificValues(
            Map<String, String> record,
            List<SpecificValuesRule> specificValueRules,
            List<String> errors) {

        for (SpecificValuesRule rule : specificValueRules) {
            String columnValue = record.get(rule.getColumnName());

            // Verificar que el valor esté en la lista de valores permitidos
            if (columnValue != null && !rule.getAllowedValues().contains(columnValue)) {
                errors.add(EL_CAMPO + rule.getColumnName() + " solo puede tener los valores: "
                        + String.join(", ", rule.getAllowedValues()) + ". Valor encontrado: " + columnValue);
            }
        }
    }

    // 13 Condicional de no nulidad
    public static void validateConditionalNonNull(Map<String, String> record, List<ConditionalNonNullRule> rules,
                                                  List<String> errors) {

        // Lista para almacenar columnas que tienen valores nulos
        List<String> missingColumns = new ArrayList<>();
        // Recorre cada regla para aplicarla al registro
        for (ConditionalNonNullRule rule : rules) {

            // Obtiene el valor de la columna seleccionada en el registro actual
            String selectedColumnValue = record.get(rule.getSelectedColumn());

            // Verifica si el valor cumple la condición especificada en la regla
            if (selectedColumnValue != null && selectedColumnValue.equals(rule.getSelectedValue())) {

                for (String column : rule.getComparedColumns()) {
                    String comparedValue = record.get(column);
                    if (comparedValue == null || comparedValue.isEmpty()) {
                        missingColumns.add(column);
                    }
                }

            }
            if (!missingColumns.isEmpty()) {
                errors.add("Cuando " + rule.getSelectedColumn() + " es '" + rule.getSelectedValue() + "', "
                        + "las siguientes columnas no deben ser nulas: " + String.join(", ", missingColumns));
            }
        }
    }

}
