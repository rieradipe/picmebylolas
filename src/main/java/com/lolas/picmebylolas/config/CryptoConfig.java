package com.lolas.picmebylolas.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Base64;

@Configuration
public class CryptoConfig {

    @Value("${security.crypto.key}")
    private String aesKeyBase64;

    @Bean
    public SecretKey aesKey() {
        byte[] key = Base64.getDecoder().decode(aesKeyBase64.trim()); // evita espacios/nuevas líneas
        if (key.length != 32) {
            throw new IllegalArgumentException("APP_CRYPTO_KEY debe ser Base64 de 32 bytes.");
        }
        return new SecretKeySpec(key, "AES");
    }
}
