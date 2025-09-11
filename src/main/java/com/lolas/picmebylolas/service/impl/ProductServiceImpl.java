package com.lolas.picmebylolas.service.impl;

import com.lolas.picmebylolas.controller.web.dto.CreateProductRequest;
import com.lolas.picmebylolas.controller.web.dto.ProductResponse;
import com.lolas.picmebylolas.controller.web.dto.UpdateProductRequest;
import com.lolas.picmebylolas.mapper.ProductMapper;
import com.lolas.picmebylolas.model.Category;
import com.lolas.picmebylolas.model.Product;
import com.lolas.picmebylolas.repository.CategoryRepository;
import com.lolas.picmebylolas.repository.ProductRepository;
import com.lolas.picmebylolas.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    public ProductServiceImpl(ProductRepository productRepo, CategoryRepository categoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public ProductResponse create(CreateProductRequest r) {
        // ---- Normalización de entradas ----
        String sku = r.sku() != null ? r.sku().trim() : null;
        String name = r.name() != null ? r.name().trim() : null;
        String slug = r.slug() != null ? r.slug().trim().toLowerCase() : null;
        String categorySlug = r.categorySlug() != null ? r.categorySlug().trim().toLowerCase() : null;
        String currency = r.currency() != null ? r.currency().trim().toUpperCase() : null;
        Integer price = r.priceCents();

        // ---- Validaciones mínimas (400) ----
        if (sku == null || sku.isBlank())
            throw new IllegalArgumentException("sku es obligatorio");
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("name es obligatorio");
        if (slug == null || slug.isBlank())
            throw new IllegalArgumentException("slug es obligatorio");
        if (categorySlug == null || categorySlug.isBlank())
            throw new IllegalArgumentException("categorySlug es obligatorio");
        if (price == null || price <= 0)
            throw new IllegalArgumentException("priceCents debe ser > 0");
        if (currency == null || !currency.matches("^[A-Z]{3}$"))
            throw new IllegalArgumentException("currency debe ser ISO 4217 (3 letras)");

        // ---- Conflictos (409 -> lo mapea tu Global) ----
        if (productRepo.existsBySku(sku))
            throw new IllegalStateException("SKU ya existe: " + sku);
        if (productRepo.existsBySlugIgnoreCase(slug))
            throw new IllegalStateException("Slug ya existe: " + slug);
        if (productRepo.existsByNameIgnoreCase(name))
            throw new IllegalStateException("Nombre ya existe: " + name);

        // ---- Categoría (404 si no existe -> Global mapea NoSuchElement) ----
        Category category = categoryRepo.findBySlugIgnoreCase(categorySlug)
                .orElseThrow(() -> new NoSuchElementException("Categoría no encontrada: " + categorySlug));

        // ---- Defaults ----
        boolean active = (r.isActive() == null) ? true : r.isActive();

        // ---- Construcción de entidad ----
        Product entity = Product.builder()
                .sku(sku)
                .name(name)
                .slug(slug)
                .shortDescription(r.shortDescription())
                .priceCents(price)
                .currency(currency)
                .imageUrl(r.imageUrl())
                .isActive(active)
                .category(category)
                .build();

        Product saved = productRepo.save(entity);
        return ProductMapper.toResponse(saved);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ProductResponse> list(String categorySlug) {
        if (categorySlug != null && !categorySlug.isBlank()) {
            return productRepo.findByCategory_SlugIgnoreCaseAndIsActiveTrue(categorySlug.trim().toLowerCase())
                    .stream()
                    .map(ProductMapper::toResponse)
                    .toList();
        }
        return productRepo.findAll()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ProductResponse get(UUID id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado"));
        return ProductMapper.toResponse(p);
    }

    @Override
    public ProductResponse update(UUID id, UpdateProductRequest r) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado"));

        // Normalización con fallback a valores actuales
        String sku = r.sku() != null ? r.sku().trim() : p.getSku();
        String name = r.name() != null ? r.name().trim() : p.getName();
        String slug = r.slug() != null ? r.slug().trim().toLowerCase() : p.getSlug();
        Integer price = r.priceCents() != null ? r.priceCents() : p.getPriceCents();
        String currency = (r.currency() != null && !r.currency().isBlank())
                ? r.currency().trim().toUpperCase()
                : p.getCurrency();
        Boolean active = (r.isActive() == null) ? p.getIsActive() : r.isActive();

        // Validaciones básicas
        if (price <= 0)
            throw new IllegalArgumentException("priceCents debe ser > 0");
        if (!currency.matches("^[A-Z]{3}$"))
            throw new IllegalArgumentException("currency debe ser ISO 4217 (3 letras)");

        // Conflictos solo si cambian
        if (!sku.equals(p.getSku()) && productRepo.existsBySku(sku))
            throw new IllegalStateException("SKU ya existe: " + sku);
        if (!name.equalsIgnoreCase(p.getName()) && productRepo.existsByNameIgnoreCase(name))
            throw new IllegalStateException("Nombre ya existe: " + name);
        if (!slug.equalsIgnoreCase(p.getSlug()) && productRepo.existsBySlugIgnoreCase(slug))
            throw new IllegalStateException("Slug ya existe: " + slug);

        // Asignaciones
        p.setSku(sku);
        p.setName(name);
        p.setSlug(slug);
        p.setShortDescription(r.shortDescription() != null ? r.shortDescription() : p.getShortDescription());
        p.setPriceCents(price);
        p.setCurrency(currency);
        p.setImageUrl(r.imageUrl() != null ? r.imageUrl() : p.getImageUrl());
        p.setIsActive(active);

        // Cambiar categoría SOLO si viene un slug
        if (r.categorySlug() != null && !r.categorySlug().isBlank()) {
            String catSlug = r.categorySlug().trim().toLowerCase();
            Category c = categoryRepo.findBySlugIgnoreCase(catSlug)
                    .orElseThrow(() -> new NoSuchElementException("Categoría no encontrada: " + catSlug));
            p.setCategory(c);
        }

        return ProductMapper.toResponse(productRepo.save(p));
    }

    @Override
    public void delete(UUID id) {
        // Si el id no existe, Spring Data lanzará EmptyResultDataAccessException y tu
        // Global lo mapea a 404
        productRepo.deleteById(id);
    }

    @Override
    public ProductResponse activate(UUID id, boolean active) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado"));
        p.setIsActive(active);
        return ProductMapper.toResponse(productRepo.save(p));
    }
}
