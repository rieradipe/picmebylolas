package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record CreateProductRequest(

        @Schema(example = "BOC-VEG-001", description = "SKU único del producto") @NotBlank @Size(min = 2, max = 64) String sku,

        @Schema(example = "Bocata vegetal", description = "Nombre del producto") @NotBlank @Size(min = 2, max = 120) String name,

        @Schema(example = "bocata-vegetal", description = "Slug legible para URLs") @NotBlank @Size(min = 2, max = 160) String slug,

        @Schema(example = "Bocadillo con lechuga, tomate y atún", description = "Descripción corta") @Size(max = 500) String shortDescription,

        @Schema(example = "550", description = "Precio en céntimos de euro") @NotNull @Positive Integer priceCents,

        @Schema(example = "EUR", description = "Moneda ISO 4217 (3 letras en mayúsculas)") @NotBlank @Pattern(regexp = "^[A-Z]{3}$", message = "Moneda ISO 4217 (3 letras)") String currency,

        @Schema(example = "https://example.com/images/bocata-veg.jpg", description = "URL de la imagen (opcional)") @Size(max = 512) String imageUrl,

        @Schema(example = "bocadillos", description = "Slug de la categoría a la que pertenece") @NotBlank @Size(min = 2, max = 160) String categorySlug,

        @Schema(example = "true", description = "Indica si el producto está activo") Boolean isActive // permite null;
                                                                                                      // en el service
                                                                                                      // pones true por
                                                                                                      // defecto si
                                                                                                      // viene null
) {
}
