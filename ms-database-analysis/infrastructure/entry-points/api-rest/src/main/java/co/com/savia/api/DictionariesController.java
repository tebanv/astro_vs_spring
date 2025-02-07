package co.com.savia.api;

import co.com.savia.model.dictionary.DictionariesResponse;
import co.com.savia.usecase.dictionary.DictionaryUseCase;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping(value = "/api/dictionaries", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
public class DictionariesController {
    private final DictionaryUseCase dictionaryUseCase;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<DictionariesResponse> getDictionaries() {
        try {
            log.info("Se recibe peticion para listar los diccionarios");

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(dictionaryUseCase.getDictionaries());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DictionariesResponse.builder().build());
        }
    }
}
