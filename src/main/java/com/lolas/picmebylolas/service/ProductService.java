package com.lolas.picmebylolas.service;

import com.lolas.picmebylolas.controller.web.dto.CreateProductRequest;
import com.lolas.picmebylolas.controller.web.dto.ProductResponse;
import com.lolas.picmebylolas.controller.web.dto.UpdateProductRequest;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponse create(CreateProductRequest req);

    List<ProductResponse> list(String categorySlug);

    ProductResponse get(UUID id);

    ProductResponse update(UUID id, UpdateProductRequest req);

    void delete(UUID id);

    ProductResponse activate(UUID id, boolean active);
}
