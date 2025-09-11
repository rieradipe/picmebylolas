package com.lolas.picmebylolas.util;

import javax.crypto.SecretKey;

public final class CryptoHolder {
    private static volatile SecretKey key;

    private CryptoHolder() {
    }

    public static void setKey(SecretKey k) {
        key = k;
    }

    public static SecretKey getKey() {
        if (key == null)
            throw new IllegalStateException("SecretKey no inicializada");
        return key;
    }
}