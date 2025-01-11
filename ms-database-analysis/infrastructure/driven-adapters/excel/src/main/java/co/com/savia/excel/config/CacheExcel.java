package co.com.savia.excel.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.Map;


@Configuration
public class CacheExcel {
    @Bean
    public Cache<String, List<Map<String, String>>> dictionaryCache() {

        return Caffeine.newBuilder()
                .maximumSize(5) // Máximo 5 diccionarios
                .expireAfterAccess(7, TimeUnit.DAYS) // Expiran tras 30 minutos de inactividad
                .build();
    }

}
