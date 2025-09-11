package com.lolas.picmebylolas.util;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Cifra/descifra Strings con AES-GCM.
 * - Guarda en BD: Base64( IV(12) || CT )
 * - Lee de BD: si es Base64 válido y descifra OK -> devuelve texto claro
 * si no -> devuelve el valor tal cual (fallback DEV-friendly)
 */
@Converter(autoApply = false)
public class AesGcmAttributeConverter implements AttributeConverter<String, String> {

    private static final Logger log = LoggerFactory.getLogger(AesGcmAttributeConverter.class);
    private static final int IV_LEN = 12; // 96 bits para GCM
    private static final int TAG_BITS = 128; // 16 bytes

    private SecretKey key() {
        return CryptoHolder.getKey(); // lanzará IllegalStateException si no está inicializada
    }

    @Override
    public String convertToDatabaseColumn(String plain) {
        if (plain == null || plain.isBlank())
            return null;
        try {
            byte[] iv = CryptoUtils.secureRandom(IV_LEN);
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.ENCRYPT_MODE, key(), new GCMParameterSpec(TAG_BITS, iv));
            byte[] ct = c.doFinal(plain.getBytes(StandardCharsets.UTF_8));

            byte[] packed = ByteBuffer.allocate(iv.length + ct.length)
                    .put(iv)
                    .put(ct)
                    .array();

            return Base64.getEncoder().encodeToString(packed);
        } catch (Exception e) {
            log.error("Error cifrando valor", e);
            throw new IllegalStateException("Error cifrando valor", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank())
            return null;

        try {
            byte[] packed = Base64.getDecoder().decode(dbData);
            if (packed.length <= IV_LEN) {
                // Demasiado corto para contener IV+CT -> probablemente texto plano antiguo
                log.warn("Dato en BD no parece cifrado (longitud < IV). Devolviendo tal cual.");
                return dbData;
            }

            byte[] iv = new byte[IV_LEN];
            byte[] ct = new byte[packed.length - IV_LEN];
            System.arraycopy(packed, 0, iv, 0, IV_LEN);
            System.arraycopy(packed, IV_LEN, ct, 0, ct.length);

            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(TAG_BITS, iv));
            byte[] pt = c.doFinal(ct);
            return new String(pt, StandardCharsets.UTF_8);

        } catch (IllegalArgumentException b64) {
            // No era Base64 -> probablemente texto plano guardado antes
            log.warn("Valor en BD no es Base64. Devolviendo tal cual.");
            return dbData;
        } catch (Exception e) {
            // Tag inválido, clave distinta, etc.
            log.error("Error descifrando valor. Devolviendo tal cual (fallback).", e);
            return dbData; // Fallback DEV-friendly para no reventar el listado
        }
    }

    // Utilidad para IV aleatorio
    private static final class CryptoUtils {
        private static final java.security.SecureRandom SR = new java.security.SecureRandom();

        static byte[] secureRandom(int len) {
            byte[] b = new byte[len];
            SR.nextBytes(b);
            return b;
        }
    }
}
