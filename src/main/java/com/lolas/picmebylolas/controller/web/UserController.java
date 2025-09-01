package com.lolas.picmebylolas.controller.web;

import com.lolas.picmebylolas.controller.web.dto.CreateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UpdateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UserResponse;
import com.lolas.picmebylolas.service.UserService;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Gestión de usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // CREATE
    @PostMapping
    @Operation(summary = "Crear usuario")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
        UserResponse saved = userService.createUser(req);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.id())
                .toUri();

        return ResponseEntity.created(location).body(saved); // 201 + Location
    }

    // READ by ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public UserResponse getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    // READ by email
    @GetMapping("/by-email")
    @Operation(summary = "Obtener usuario por email")
    public UserResponse getByEmail(
            @Parameter(description = "Correo electrónico (case-insensitive)") @RequestParam String email) {
        return userService.getByEmail(email);
    }

    // LIST paginado
    @GetMapping
    @Operation(summary = "Listar usuarios (paginado)", description = "Parámetros: page (0..N), size (1..N), sort (p.ej. 'email,asc' o 'createdAt,desc')")
    public Page<UserResponse> list(
            @PageableDefault(size = 10) Pageable pageable) {
        return userService.list(pageable);
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario por ID")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
        return userService.updateUser(id, req);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar usuario por ID")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
