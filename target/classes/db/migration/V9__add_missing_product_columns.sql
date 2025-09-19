-- Añade columnas que tu entidad Product necesita y no existen
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url varchar(512),
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS currency varchar(3) DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Asegura defaults razonables
UPDATE products SET currency = 'EUR' WHERE currency IS NULL;
UPDATE products SET is_active = true WHERE is_active IS NULL;

-- Opcional: si quieres permitir productos sin categoría en dev
ALTER TABLE products ALTER COLUMN category_id DROP NOT NULL;
