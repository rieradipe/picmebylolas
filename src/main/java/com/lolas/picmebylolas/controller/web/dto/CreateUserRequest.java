package com.lolas.picmebylolas.controller.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record CreateUserRequest(
                @Schema(example = "Lola") @NotBlank @Size(min = 2, max = 50) String nombre,
                @Schema(example = "Riera") @NotBlank @Size(min = 2, max = 80) String apellidos,
                @Schema(example = "lola@example.com") @Email @NotBlank String email,
                @Schema(example = "Passw0rd!") @NotBlank @Size(min = 8) String password,
                @Schema(example = "ES7921000813610123456789", description = "IBAN en claro; el backend lo cifra") @NotBlank @Pattern(regexp = "^[A-Z]{2}\\d{2}[A-Z0-9]{10,30}$", message = "IBAN no válido") String iban) {
}
