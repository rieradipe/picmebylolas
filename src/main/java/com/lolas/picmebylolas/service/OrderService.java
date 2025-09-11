package com.lolas.picmebylolas.service;

import com.lolas.picmebylolas.controller.web.dto.CreateOrderRequest;
import com.lolas.picmebylolas.controller.web.dto.OrderSummary;

import java.util.List;

public interface OrderService {
    OrderSummary create(Long userId, CreateOrderRequest req);

    OrderSummary findSummary(Long id);

    List<OrderSummary> listMine(Long userId);

    OrderSummary acceptInstructions(Long id, Long userId);
}
