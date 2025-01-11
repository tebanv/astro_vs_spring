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
public class Dictionary {

    List<DirectoriesNames> names;
    List<DirectoriesNumbers> numbers;
    List<DirectoriesHabits> habits;

}
