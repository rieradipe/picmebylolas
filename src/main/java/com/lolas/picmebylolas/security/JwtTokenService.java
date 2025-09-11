package com.lolas.picmebylolas.security;

import com.lolas.picmebylolas.config.JWTProperties;
import com.lolas.picmebylolas.model.Role;
import com.lolas.picmebylolas.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final SecretKey key;
    private final long ttlSeconds;

    public JwtTokenService(JWTProperties props) {
        this.key = buildKey(props.getSecret());
        this.ttlSeconds = props.getExpMinutes() * 60;
    }

    /**
     * Crear token para un usuario (subject=email) e incluir roles en claim "roles".
     */
    public String generateToken(User user) {
        String username = user.getEmail(); // usamos email como identificador
        List<String> roles = user.getRoles().stream()
                .map(Role::getRoleName) // usamos roleName
                .toList();

        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username) // API 0.12
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(ttlSeconds, ChronoUnit.SECONDS)))
                .claim("roles", roles)
                .signWith(key) // API 0.12
                .compact();
    }

    /** Validar token y devolver el username (subject). */
    public String getUsername(String token) {
        Claims claims = parse(token).getPayload();
        return claims.getSubject();
    }

    /** Devuelve los roles embebidos en el token (claim "roles"). */
    public List<String> getRoles(String token) {
        Claims claims = parse(token).getPayload();
        Object raw = claims.get("roles");
        if (raw instanceof Collection<?> col) {
            return col.stream().map(String::valueOf).collect(Collectors.toList());
        }
        return List.of();
    }

    /** Comprueba firma y expiración. */
    public boolean isValid(String token) {
        try {
            Claims c = parse(token).getPayload();
            Date exp = c.getExpiration();
            return exp == null || exp.toInstant().isAfter(Instant.now());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ===== Helpers =====

    private Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(key) // API 0.12
                .build()
                .parseSignedClaims(token);
    }

    /** Construye la clave HMAC (Base64 o texto plano). */
    private static SecretKey buildKey(String secret) {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException notBase64) {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }
}
