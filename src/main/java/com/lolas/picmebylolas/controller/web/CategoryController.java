package com.lolas.picmebylolas.controller.web;

import com.lolas.picmebylolas.controller.web.dto.CategoryDto;
import com.lolas.picmebylolas.controller.web.dto.CreateCategoryRequest;
import com.lolas.picmebylolas.controller.web.dto.UpdateCategoryRequest;
import com.lolas.picmebylolas.model.Category;
import com.lolas.picmebylolas.repository.CategoryRepository;
import com.lolas.picmebylolas.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Gestión de categorías de catálogo")
public class CategoryController {

        private final CategoryRepository repo;
        private final ProductRepository productRepo;

        public CategoryController(CategoryRepository repo, ProductRepository productRepo) {
                this.repo = repo;
                this.productRepo = productRepo;
        }

        @PostMapping
        @Operation(summary = "Crear categoría")
        public ResponseEntity<CategoryDto> create(@Valid @RequestBody CreateCategoryRequest r) {
                // parent (opcional)
                Category parent = null;
                if (r.parentId() != null) {
                        parent = repo.findById(r.parentId())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Parent no encontrado"));
                }

                // normaliza inputs
                String name = r.name() != null ? r.name().trim() : null;
                String slug = r.slug() != null ? r.slug().trim().toLowerCase() : null;

                if (name == null || name.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name es obligatorio");
                }
                if (slug == null || slug.isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slug es obligatorio");
                }

                // evita duplicados → 409
                if (repo.existsByNameIgnoreCase(name)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                        "La categoría ya existe por name: " + name);
                }
                if (repo.existsBySlugIgnoreCase(slug)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "El slug ya existe: " + slug);
                }

                Category c = Category.builder()
                                .name(name)
                                .slug(slug)
                                .parent(parent)
                                .isActive(r.isActive() != null ? r.isActive() : true)
                                .build();

                Category saved = repo.save(c);

                CategoryDto dto = new CategoryDto(
                                saved.getId(),
                                saved.getName(),
                                saved.getSlug(),
                                saved.getParent() != null ? saved.getParent().getId() : null,
                                saved.getIsActive(),
                                saved.getCreatedAt(),
                                saved.getUpdatedAt());

                return ResponseEntity.created(URI.create("/api/categories/" + saved.getId())).body(dto);
        }

        @GetMapping
        @Operation(summary = "Listar categorías")
        public List<CategoryDto> list() {
                return repo.findAll().stream().map(this::toDto).toList();
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obtener categoría por ID")
        public CategoryDto get(@PathVariable UUID id) {
                Category c = repo.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Categoría no encontrada"));
                return toDto(c);
        }

        @PutMapping("/{id}")
        @Operation(summary = "Actualizar categoría por ID", description = "Actualiza name/slug/isActive. Devuelve 409 si el name/slug ya existen en otra categoría.")
        public CategoryDto update(@PathVariable UUID id, @Valid @RequestBody UpdateCategoryRequest r) {
                Category c = repo.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Categoría no encontrada"));

                // Normaliza entradas
                String newName = r.name() != null ? r.name().trim() : null;
                String newSlug = r.slug() != null ? r.slug().trim().toLowerCase() : null;

                if (newName == null || newName.isBlank()) {
                        throw new ResponseStatusException(BAD_REQUEST, "name es obligatorio");
                }
                if (newSlug == null || newSlug.isBlank()) {
                        throw new ResponseStatusException(BAD_REQUEST, "slug es obligatorio");
                }

                // Conflictos (evita contar la propia categoría)
                if (!newName.equalsIgnoreCase(c.getName()) && repo.existsByNameIgnoreCase(newName)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                        "La categoría ya existe por name: " + newName);
                }
                if (!newSlug.equalsIgnoreCase(c.getSlug()) && repo.existsBySlugIgnoreCase(newSlug)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "El slug ya existe: " + newSlug);
                }

                // Aplicar cambios
                c.setName(newName);
                c.setSlug(newSlug);
                if (r.isActive() != null) {
                        c.setIsActive(r.isActive());
                }

                Category saved = repo.save(c);
                return new CategoryDto(
                                saved.getId(),
                                saved.getName(),
                                saved.getSlug(),
                                saved.getParent() != null ? saved.getParent().getId() : null,
                                saved.getIsActive(),
                                saved.getCreatedAt(),
                                saved.getUpdatedAt());
        }

        @DeleteMapping("/by-slug/{slug}")
        @Operation(summary = "Eliminar categoría por slug")
        public ResponseEntity<Void> deleteBySlug(@PathVariable String slug) {
                Category category = repo.findBySlugIgnoreCase(slug)
                                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Categoría no encontrada"));

                // protege: si tiene productos asociados -> 409
                if (productRepo.existsByCategory_SlugIgnoreCase(slug)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                        "No se puede borrar: la categoría tiene productos asociados");
                }

                repo.delete(category);
                return ResponseEntity.noContent().build(); // 204
        }

        // --- helpers ---

        private CategoryDto toDto(Category c) {
                return new CategoryDto(
                                c.getId(),
                                c.getName(),
                                c.getSlug(),
                                c.getParent() != null ? c.getParent().getId() : null,
                                c.getIsActive(),
                                c.getCreatedAt(),
                                c.getUpdatedAt());
        }

        // Generador simple de slug (sin acentos, minúsculas, espacios -> '-')
        @SuppressWarnings("unused")
        private static String toSlug(String s) {
                if (s == null)
                        throw new ResponseStatusException(BAD_REQUEST, "name requerido");
                String normalized = Normalizer.normalize(s, Normalizer.Form.NFD)
                                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
                return normalized.toLowerCase().trim()
                                .replaceAll("[^a-z0-9\\s-]", "")
                                .replaceAll("\\s+", "-");
        }
}
