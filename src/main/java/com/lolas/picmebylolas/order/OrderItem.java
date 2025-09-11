package com.lolas.picmebylolas.order;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** referencia al pedido padre */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /** producto al que se refiere */
    private UUID productId;

    private String productName;

    private int qty;

    /** precio unitario en céntimos */
    private int unitPriceCents;

    /** total de esta línea (qty * unitPriceCents) */
    private long lineCents;
}
