package com.lolas.picmebylolas.controller.web.dto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @GetMapping("/test")
    public ResponseEntity<String> testAdmin() {
        return ResponseEntity.ok("Hola Admin, acceso concedido ✅");
    }

}
