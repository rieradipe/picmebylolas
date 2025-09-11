package com.lolas.picmebylolas.controller.web.dto;

import java.time.Instant;
import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

public record CategoryDto(
        @Schema(example = "c2f1d7a4-3b65-4c4a-bd84-7f0e2e2c99f1", description = "Identificador único de la categoría") UUID id,

        @Schema(example = "Bocadillos", description = "Nombre visible de la categoría") String name,

        @Schema(example = "bocadillos", description = "Slug legible para URL de la categoría") String slug,

        @Schema(example = "00000000-0000-0000-0000-000000000000", description = "ID de la categoría padre si es subcategoría; null si es raíz", nullable = true) UUID parentId,

        @Schema(example = "true", description = "Indica si la categoría está activa") Boolean isActive,

        @Schema(example = "2025-08-22T10:15:30Z", description = "Fecha de creación", type = "string", format = "date-time") Instant createdAt,

        @Schema(example = "2025-08-22T10:15:30Z", description = "Fecha de última actualización", type = "string", format = "date-time") Instant updatedAt) {
}
