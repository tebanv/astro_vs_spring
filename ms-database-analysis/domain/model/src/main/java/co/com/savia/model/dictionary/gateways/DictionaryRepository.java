package co.com.savia.model.dictionary.gateways;

import co.com.savia.model.dictionary.DictionariesResponse;

import java.util.List;
import java.util.Map;

public interface DictionaryRepository {

    DictionariesResponse getDictionaries();
    List<Map<String, String>> getDictionary(String dictionaryName);
}
