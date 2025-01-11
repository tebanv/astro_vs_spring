package co.com.savia.api.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final TempFileCleaner tempFileCleaner;

    public WebConfig(TempFileCleaner tempFileCleaner) {
        this.tempFileCleaner = tempFileCleaner;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tempFileCleaner);
    }
}

