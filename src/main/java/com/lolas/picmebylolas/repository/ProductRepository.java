package com.lolas.picmebylolas.repository;

import com.lolas.picmebylolas.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Conflictos
    boolean existsBySku(String sku);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsByNameIgnoreCase(String name);

    // Búsquedas
    Optional<Product> findBySku(String sku);

    Optional<Product> findBySlugIgnoreCase(String slug);

    // Filtros
    List<Product> findByCategory_SlugIgnoreCase(String categorySlug);

    List<Product> findByCategory_SlugIgnoreCaseAndIsActiveTrue(String categorySlug);

    //
    // Saber si hay productos en una categoría por su slug (case-insensitive)
    boolean existsByCategory_SlugIgnoreCase(String slug);

}
