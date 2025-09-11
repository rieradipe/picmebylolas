package com.lolas.picmebylolas.repository;

import com.lolas.picmebylolas.model.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String RoleNames);

}
