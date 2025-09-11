package com.lolas.picmebylolas.controller.web.dto;

import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        Integer priceCents, // 👈 en lugar de BigDecimal
        UUID categoryId,
        String categoryName) {
}
