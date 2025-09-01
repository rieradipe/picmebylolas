package com.lolas.picmebylolas.mapper;

import com.lolas.picmebylolas.controller.web.dto.CreateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UpdateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UserResponse;
import com.lolas.picmebylolas.model.User;

public final class UserMapper {

    private UserMapper() {
        // Utility class
    }

    /** CreateUserRequest -> User (el service ya pasa la password hasheada) */
    public static User toEntity(CreateUserRequest req, String hashedPassword) {
        if (req == null)
            return null;
        User u = new User();
        u.setNombre(req.nombre());
        u.setApellidos(req.apellidos());
        u.setEmail(req.email()); // email ya normalizado en el service
        u.setPasswordHash(hashedPassword);
        u.setIbanCifrado(req.iban()); // IBAN en claro -> el converter cifrará al persistir
        return u;
    }

    /** Actualiza campos no nulos; si viene password hasheada, la aplica */
    public static void update(User u, UpdateUserRequest req, String hashedPasswordOrNull) {
        if (u == null || req == null)
            return;

        if (req.nombre() != null)
            u.setNombre(req.nombre());
        if (req.apellidos() != null)
            u.setApellidos(req.apellidos());
        if (req.email() != null)
            u.setEmail(req.email()); // ya normalizado en el service
        if (hashedPasswordOrNull != null && !hashedPasswordOrNull.isBlank()) {
            u.setPasswordHash(hashedPasswordOrNull);
        }
        if (req.iban() != null)
            u.setIbanCifrado(req.iban()); // converter cifrará
    }

    /** User -> UserResponse (sin password ni IBAN) */
    public static UserResponse toResponse(User u) {
        if (u == null)
            return null;
        return new UserResponse(
                u.getId(),
                u.getNombre(),
                u.getApellidos(),
                u.getEmail());
    }
}
