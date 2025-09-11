-- Products con UUID y FK a categories(UUID)
-- (si no existe pgcrypto por algún motivo, se creó ya en V7)
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NULL,

  sku          VARCHAR(64)  NOT NULL UNIQUE,
  name         VARCHAR(120) NOT NULL UNIQUE,
  slug         VARCHAR(160) NOT NULL UNIQUE,
  description  TEXT,

  price_cents  BIGINT       NOT NULL CHECK (price_cents >= 0),
  stock        INTEGER      NOT NULL DEFAULT 0 CHECK (stock >= 0),

  category_id  UUID         NOT NULL,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);




