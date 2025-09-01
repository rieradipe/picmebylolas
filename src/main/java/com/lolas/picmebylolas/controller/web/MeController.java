package com.lolas.picmebylolas.controller.web;

import com.lolas.picmebylolas.model.Role;
import com.lolas.picmebylolas.model.User;
import com.lolas.picmebylolas.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MeController {

        private final UserRepository userRepo;

        public MeController(UserRepository userRepo) {
                this.userRepo = userRepo;
        }

        @GetMapping(path = "/me", produces = "application/json")
        public ResponseEntity<?> me(Authentication auth) {
                // auth.getName() = email del usuario autenticado
                User u = userRepo.findByEmailIgnoreCase(auth.getName())
                                .orElseThrow(() -> new IllegalStateException(
                                                "Usuario no encontrado: " + auth.getName()));

                // roleName ya es String -> no usar .name()
                List<String> roles = u.getRoles().stream()
                                .map(Role::getRoleName)
                                .toList();

                return ResponseEntity.ok(
                                Map.of(
                                                "email", u.getEmail(),
                                                "nombre", u.getNombre(),
                                                "apellidos", u.getApellidos(),
                                                "roles", roles));
        }
}
