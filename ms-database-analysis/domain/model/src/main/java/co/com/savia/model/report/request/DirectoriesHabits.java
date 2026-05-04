package co.com.savia.model.report.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DirectoriesHabits {
    private String columnNameHabit;
    private String columnNameToCompare;
    private List<Habits> habits;
    private String dictionaryName;
    private String columnNameInDictionary;
}
