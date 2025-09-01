package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserResponse(

        @Schema(example = "1", description = "Identificador interno del usuario") Long id,

        @Schema(example = "Lola", description = "Nombre del usuario") String nombre,

        @Schema(example = "Riera", description = "Apellidos del usuario") String apellidos,

        @Schema(example = "lola@example.com", description = "Correo electrónico del usuario") String email) {
}
