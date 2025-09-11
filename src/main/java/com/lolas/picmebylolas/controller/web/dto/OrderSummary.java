package com.lolas.picmebylolas.controller.web.dto;

import com.lolas.picmebylolas.delivery.LandingZone;
import com.lolas.picmebylolas.delivery.Merendero;

public record OrderSummary(
                Long id,
                String status,
                LandingZone zone,
                Merendero merendero,
                double total) {
}
