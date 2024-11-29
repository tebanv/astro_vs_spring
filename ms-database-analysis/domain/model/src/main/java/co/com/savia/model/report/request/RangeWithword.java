package co.com.savia.model.report.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class RangeWithword {
    private double min;       // Valor mínimo del rango
    private double max;       // Valor máximo del rango
    private String type; // Tipo esperado en la columna correspondiente
}
