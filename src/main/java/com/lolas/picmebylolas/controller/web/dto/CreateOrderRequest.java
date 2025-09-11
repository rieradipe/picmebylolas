package com.lolas.picmebylolas.controller.web.dto;

import com.lolas.picmebylolas.delivery.LandingZone;
import com.lolas.picmebylolas.delivery.Merendero;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;

public record CreateOrderRequest(
        @NotEmpty List<@Valid Item> items,
        @NotNull LandingZone zone,
        @NotNull Merendero merendero,
        @AssertTrue boolean instructionsAccepted,
        String paymentToken) {
    public static record Item(@NotNull UUID productId, @Positive int qty) {
    }
}
