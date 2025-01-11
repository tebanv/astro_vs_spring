package co.com.savia.model.report.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class DirectoriesHabits {
    private String columnNameHabit;
    private String columnNameToCompare;
    private List<Habits> habits;
    private String dictionaryName;
    private String columnNameInDictionary;
}
