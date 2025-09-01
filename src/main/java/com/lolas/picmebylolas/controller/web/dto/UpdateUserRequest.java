package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record UpdateUserRequest(
        @Schema(example = "Lola") @Size(min = 2, max = 50) String nombre,
        @Schema(example = "Riera") @Size(min = 2, max = 80) String apellidos,
        @Schema(example = "lola@example.com") @Email String email,
        @Schema(example = "NuevoPassw0rd!", description = "Opcional; si viene se re-hashea") @Size(min = 8) String password,
        @Schema(example = "ES7921000813610123456789") @Pattern(regexp = "^[A-Z]{2}\\d{2}[A-Z0-9]{10,30}$") String iban) {
}
