package com.lolas.picmebylolas.controller.web;

import com.lolas.picmebylolas.controller.web.dto.CreateProductRequest;
import com.lolas.picmebylolas.controller.web.dto.ProductResponse;
import com.lolas.picmebylolas.controller.web.dto.UpdateProductRequest;
import com.lolas.picmebylolas.service.ProductService;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Gestión de productos")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Crear producto")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest req) {
        ProductResponse pr = service.create(req);

        // Construir Location: /api/products/{id}
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(pr.id())
                .toUri();

        return ResponseEntity.created(location).body(pr); // 201 + Location
    }

    @GetMapping
    @Operation(summary = "Listar productos", description = "Permite filtrar por categoría (slug).")
    public List<ProductResponse> list(
            @Parameter(description = "Slug de la categoría para filtrar (ej: bocadillos)") @RequestParam(name = "category", required = false) String categorySlug) {
        return service.list(categorySlug);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ProductResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto por ID")
    public ProductResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateProductRequest req) {
        return service.update(id, req);
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activar producto")
    public ProductResponse activate(@PathVariable UUID id) {
        return service.activate(id, true);
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Desactivar producto")
    public ProductResponse deactivate(@PathVariable UUID id) {
        return service.activate(id, false);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar producto")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
