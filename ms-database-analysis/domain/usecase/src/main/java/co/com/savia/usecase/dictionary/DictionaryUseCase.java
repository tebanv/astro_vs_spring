package co.com.savia.usecase.dictionary;

import co.com.savia.model.dictionary.DictionariesResponse;
import co.com.savia.model.dictionary.gateways.DictionaryRepository;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
public class DictionaryUseCase {
    private final DictionaryRepository dictionaryRepository;

    public DictionariesResponse getDictionaries() {

        return dictionaryRepository.getDictionaries();
    }
}
