package com.lolas.picmebylolas.controller.web;

import com.lolas.picmebylolas.model.Role;
import com.lolas.picmebylolas.model.User;
import com.lolas.picmebylolas.repository.RoleRepository;
import com.lolas.picmebylolas.repository.UserRepository;
import com.lolas.picmebylolas.security.JwtTokenService;

import com.lolas.picmebylolas.security.dto.AuthResponse;
import com.lolas.picmebylolas.security.dto.LoginRequest;
import com.lolas.picmebylolas.security.dto.RegisterRequest;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authManager;
        private final PasswordEncoder passwordEncoder;
        private final UserRepository userRepo;
        private final RoleRepository roleRepo;
        private final JwtTokenService jwtService;

        public AuthController(AuthenticationManager authManager,
                        PasswordEncoder passwordEncoder,
                        UserRepository userRepo,
                        RoleRepository roleRepo,
                        JwtTokenService jwtService) {
                this.authManager = authManager;
                this.passwordEncoder = passwordEncoder;
                this.userRepo = userRepo;
                this.roleRepo = roleRepo;
                this.jwtService = jwtService;
        }

        @PostMapping("/register")
        public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
                if (userRepo.existsByEmail(req.getEmail())) {
                        return ResponseEntity.badRequest().body("Email ya registrado");
                }

                User u = new User();
                u.setNombre(req.getNombre());
                u.setApellidos(req.getApellidos());
                u.setEmail(req.getEmail());
                u.setPasswordHash(passwordEncoder.encode(req.getPassword()));

                // roleName es String: "USER" / "ADMIN" / "WAITER"
                Role userRole = roleRepo.findByRoleName("USER")
                                .orElseThrow(() -> new IllegalStateException("Rol USER no existe"));
                u.getRoles().add(userRole);

                userRepo.save(u);

                String token = jwtService.generateToken(u);
                List<String> roles = u.getRoles().stream()
                                .map(Role::getRoleName) // ya es String
                                .toList();

                return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), roles));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
                Authentication auth = authManager.authenticate(
                                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

                User u = userRepo.findByEmail(req.getEmail())
                                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado tras autenticar"));

                String token = jwtService.generateToken(u);
                List<String> roles = u.getRoles().stream()
                                .map(Role::getRoleName) // ya es String
                                .toList();

                return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), roles));
        }
}
