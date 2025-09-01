-- RECREA la tabla de unión user_roles con la forma correcta
-- (Usa esto si no necesitas conservar datos antiguos)

DROP TABLE IF EXISTS user_roles;

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_pk PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
