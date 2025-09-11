package com.lolas.picmebylolas.service.impl;

import com.lolas.picmebylolas.controller.web.dto.CreateOrderRequest;
import com.lolas.picmebylolas.controller.web.dto.OrderSummary;
import com.lolas.picmebylolas.order.Order;
import com.lolas.picmebylolas.order.OrderItem;
import com.lolas.picmebylolas.order.OrderStatus;
import com.lolas.picmebylolas.repository.OrderRepository;
import com.lolas.picmebylolas.repository.ProductRepository;
import com.lolas.picmebylolas.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

        private final OrderRepository orders;
        private final ProductRepository products;

        public OrderServiceImpl(OrderRepository orders, ProductRepository products) {
                this.orders = orders;
                this.products = products;
        }

        @Override
        public OrderSummary create(Long userId, CreateOrderRequest req) {
                Order order = new Order();
                order.setUserId(userId);

                order.setZone(req.zone()); // A, B, C, D
                order.setMerendero(req.merendero()); // NORTE o SUR
                order.setInstructionsAccepted(req.instructionsAccepted());
                order.setStatus(OrderStatus.PENDING);

                long totalCents = 0L;

                for (var it : req.items()) {
                        var p = products.findById(it.productId())
                                        .orElseThrow(() -> new NoSuchElementException(
                                                        "Producto no encontrado: " + it.productId()));

                        int unit = p.getPriceCents();
                        long line = (long) unit * it.qty();
                        totalCents += line;

                        OrderItem oi = new OrderItem();
                        oi.setOrder(order);
                        oi.setProductId(p.getId());
                        oi.setProductName(p.getName());
                        oi.setUnitPriceCents(unit);
                        oi.setQty(it.qty());
                        oi.setLineCents(line);

                        order.getItems().add(oi);
                }

                order.setTotalCents(totalCents);
                var saved = orders.save(order);

                return new OrderSummary(
                                saved.getId(),
                                saved.getStatus().name(),
                                saved.getZone(),
                                saved.getMerendero(), // <-- lo devolvemos también
                                saved.getTotalCents() / 100.0);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public OrderSummary findSummary(Long id) {
                var o = orders.findById(id).orElseThrow();
                return new OrderSummary(o.getId(), o.getStatus().name(),
                                o.getZone(), o.getMerendero(), o.getTotalCents() / 100.0);
        }

        @Override
        @Transactional(Transactional.TxType.SUPPORTS)
        public List<OrderSummary> listMine(Long userId) {
                var sort = Sort.by(Sort.Direction.DESC, "createdAt");
                return orders.findByUserId(userId, sort).stream()
                                .map(o -> new OrderSummary(o.getId(), o.getStatus().name(),
                                                o.getZone(), o.getMerendero(), o.getTotalCents() / 100.0))
                                .toList();
        }

        @Override
        public OrderSummary acceptInstructions(Long id, Long userId) {
                var o = orders.findById(id).orElseThrow();
                if (!o.getUserId().equals(userId))
                        throw new NoSuchElementException("Pedido no encontrado");
                o.setInstructionsAccepted(true);
                var saved = orders.save(o);
                return new OrderSummary(saved.getId(), saved.getStatus().name(),
                                saved.getZone(), saved.getMerendero(), saved.getTotalCents() / 100.0);
        }
}
