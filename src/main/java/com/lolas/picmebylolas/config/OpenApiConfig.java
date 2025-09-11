package com.lolas.picmebylolas.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "PickmeByLolas API", version = "v1", description = "Mapas, comida y ayuda – API"))
public class OpenApiConfig {

}
