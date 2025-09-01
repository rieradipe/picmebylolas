package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(

        @Schema(example = "Bebidas", description = "Nuevo nombre de la categoría") @NotBlank @Size(min = 2, max = 80) String name,

        @Schema(example = "bebidas", description = "Nuevo slug (si cambia)") @NotBlank @Size(min = 2, max = 120) String slug,

        @Schema(example = "true", description = "Activo/inactivo") Boolean isActive) {
}
