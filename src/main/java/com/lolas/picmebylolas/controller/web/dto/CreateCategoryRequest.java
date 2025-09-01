package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateCategoryRequest(
                @Schema(example = "Bocadillos") @NotBlank @Size(min = 2, max = 80) String name,

                @Schema(example = "bocadillos", description = "Opcional; si falta se genera desde name") @Size(min = 2, max = 120) String slug,

                @Schema(example = "null", description = "UUID de categoría padre si aplica") UUID parentId,

                @Schema(example = "true") Boolean isActive) {
}
