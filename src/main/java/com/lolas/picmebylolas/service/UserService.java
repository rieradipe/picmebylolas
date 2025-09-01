package com.lolas.picmebylolas.service;

import com.lolas.picmebylolas.controller.web.dto.CreateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UpdateUserRequest;
import com.lolas.picmebylolas.controller.web.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse createUser(CreateUserRequest req);

    UserResponse getById(Long id);

    UserResponse getByEmail(String email);

    Page<UserResponse> list(Pageable pageable);

    UserResponse updateUser(Long id, UpdateUserRequest req);

    void deleteUser(Long id);
}
