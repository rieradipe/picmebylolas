package com.lolas.picmebylolas.mapper;

import com.lolas.picmebylolas.controller.web.dto.CreateProductRequest;
import com.lolas.picmebylolas.controller.web.dto.ProductResponse;
import com.lolas.picmebylolas.model.Category;
import com.lolas.picmebylolas.model.Product;

public final class ProductMapper {

  private ProductMapper() {
  }

  // De DTO a Entity
  public static Product toEntity(CreateProductRequest r, Category category, boolean active) {
    return Product.builder()
        .sku(r.sku().trim())
        .name(r.name().trim())
        .slug(r.slug().trim().toLowerCase())
        .shortDescription(r.shortDescription())
        .priceCents(r.priceCents())
        .currency(r.currency().trim().toUpperCase())
        .imageUrl(r.imageUrl())
        .isActive(active)
        .category(category)
        .build();
  }

  // De Entity a DTO (Response)
  public static ProductResponse toResponse(Product p) {
    Category c = p.getCategory();
    return new ProductResponse(
        p.getId(),
        p.getName(),
        p.getShortDescription(),
        p.getPriceCents(), // ojo: aquí tienes BigDecimal en ProductResponse → asegúrate que en Product
                           // también es BigDecimal
        (c != null ? c.getId() : null),
        (c != null ? c.getName() : null));
  }
}
