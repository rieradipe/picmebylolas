package com.lolas.picmebylolas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades JWT enlazadas desde application.properties:
 * security.jwt.secret
 * security.jwt.exp-minutes
 */
@ConfigurationProperties(prefix = "security.jwt")
public class JWTProperties {

    /** Clave secreta (recomendada en Base64) */
    private String secret;

    /** Minutos de expiración del token */
    private long expMinutes = 60;

    // Getters & Setters
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpMinutes() {
        return expMinutes;
    }

    public void setExpMinutes(long expMinutes) {
        this.expMinutes = expMinutes;
    }
}
