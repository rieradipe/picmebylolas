package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record UpdateProductRequest(

                @Schema(example = "BOC-VEG-001", description = "SKU único del producto") @NotBlank String sku,

                @Schema(example = "Bocata vegetal", description = "Nombre del producto") @NotBlank String name,

                @Schema(example = "bocata-vegetal", description = "Slug legible para URLs") @NotBlank String slug,

                @Schema(example = "Bocadillo con lechuga, tomate y atún", description = "Descripción corta") @Size(max = 5000) String shortDescription,

                @Schema(example = "550", description = "Precio en céntimos de euro") @NotNull @Min(0) Integer priceCents,

                @Schema(example = "EUR", description = "Moneda en formato ISO 4217 de 3 letras") @Pattern(regexp = "^[A-Z]{3}$") String currency,

                @Schema(example = "https://example.com/images/bocata-veg.jpg", description = "URL de la imagen del producto") String imageUrl,

                @Schema(example = "bocadillos", description = "Slug de la categoría a la que pertenece el producto") String categorySlug,

                @Schema(example = "true", description = "Indica si el producto está activo") Boolean isActive) {
}
