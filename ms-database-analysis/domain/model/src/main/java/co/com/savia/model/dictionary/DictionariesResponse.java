package co.com.savia.model.dictionary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@lombok.Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class DictionariesResponse {
    private List<Dictionary> dictionaries;
}
