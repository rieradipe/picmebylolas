package com.lolas.picmebylolas.service.impl;

import com.lolas.picmebylolas.controller.web.dto.CreateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UpdateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UserResponse;
import com.lolas.picmebylolas.mapper.UserMapper;
import com.lolas.picmebylolas.model.User;
import com.lolas.picmebylolas.repository.UserRepository;
import com.lolas.picmebylolas.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public UserResponse createUser(CreateUserRequest req) {

        String emailNorm = req.email().trim().toLowerCase();

        if (repo.existsByEmail(emailNorm)) {
            throw new IllegalStateException("Email duplicado");
        }

        String hashed = encoder.encode(req.password());

        CreateUserRequest norm = new CreateUserRequest(
                req.nombre(),
                req.apellidos(),
                emailNorm,
                req.password(),
                req.iban());

        User entity = UserMapper.toEntity(norm, hashed);
        return UserMapper.toResponse(repo.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        User u = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("No existe id " + id));
        return UserMapper.toResponse(u);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByEmail(String emailRaw) {
        String email = emailRaw.trim().toLowerCase();
        User u = repo.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("No existe email " + email));
        return UserMapper.toResponse(u);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> list(Pageable pageable) {
        return repo.findAll(pageable).map(UserMapper::toResponse);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest req) {
        User u = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("No existe id " + id));

        String newEmail = req.email() != null ? req.email().trim().toLowerCase() : null;
        if (newEmail != null && !newEmail.equals(u.getEmail()) && repo.existsByEmail(newEmail)) {
            throw new IllegalStateException("Email duplicado");
        }
        UpdateUserRequest norm = new UpdateUserRequest(
                req.nombre(), req.apellidos(), newEmail != null ? newEmail : u.getEmail(), req.password(),
                req.iban());

        String hashed = (req.password() != null && !req.password().isBlank()) ? encoder.encode(req.password()) : null;

        UserMapper.update(u, norm, hashed);
        return UserMapper.toResponse(repo.save(u));
    }

    @Override
    public void deleteUser(Long id) {
        if (!repo.existsById(id))
            throw new EntityNotFoundException("No existe id " + id);
        repo.deleteById(id);
    }
}