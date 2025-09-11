<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🚀 PickMeByLolas

**Mapas, comida y ayuda segura, estés donde estés.**  
Plataforma fullstack para localizar merenderos con zonas seguras, pedir menús tipo bocatería y solicitar ayuda/soporte.  
La entrega se simula con dron y la app aplica buenas prácticas de seguridad (cifrado de datos y JWT).

> Proyecto creado para porfolio profesional: backend sólido, migraciones versionadas, documentación de API y foco en ciberseguridad.

---

## 📚 Tabla de contenidos

- [Arquitectura](#-arquitectura)
- [Stack](#-stack)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Configuración y arranque](#-configuración-y-arranque)
- [Variables de entorno](#-variables-de-entorno)
- [Migraciones (Flyway)](#-migraciones-flyway)
- [Swagger / OpenAPI](#-swagger--openapi)
- [Endpoints principales](#-endpoints-principales)
- [Decisiones de diseño y seguridad](#-decisiones-de-diseño-y-seguridad)
- [Pruebas rápidas (cURL)](#-pruebas-rápidas-curl)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)

---

## 🧱 Arquitectura

**Modelo–Vista–Controlador (MVC)** sobre Spring Boot:

- **Modelo (JPA)**: `User`, `Role`, `Category`, `Product`, `Order`, `OrderItem`, `LandingZone` (IDs **UUID**).
- **Controladores REST**: exponen `/api/**`.
- **Servicios**: lógica de negocio (validaciones, reglas).
- **Repositorios**: acceso a datos con Spring Data JPA.

**Seguridad en capas**:

1. **Transporte**: JWT (autenticación/autorización).
2. **Datos**: cifrado AES-GCM de IBAN u otros campos sensibles.
3. **Aplicación**: validaciones (`jakarta.validation`) + roles (`ADMIN`, `WAITER`, `USER`).

---

## 🧰 Stack

- **Backend**: Spring Boot **3.3.5**, Spring Security, JJWT **0.12.5**, Lombok
- **DB**: PostgreSQL + **Flyway**
- **Docs**: **springdoc-openapi 2.6.0** (Swagger UI)
- **Build**: Maven, `mvnw`
- **Testing / Utils**: Testcontainers (DB), cURL/Postman

---

## 🗂️ Estructura del proyecto

```
picmebylolas/
├─ pom.xml
├─ run.local.sh
├─ src/
│  ├─ main/
│  │  ├─ java/com/lolas/picmebylolas/
│  │  │  ├─ config/            # Security, OpenAPI, CryptoConfig/props
│  │  │  ├─ controller/web/    # REST Controllers
│  │  │  ├─ dto/               # DTOs
│  │  │  ├─ model/             # Entidades JPA (UUID)
│  │  │  ├─ repository/        # Spring Data JPA
│  │  │  └─ service/           # Lógica de negocio
│  │  └─ resources/
│  │     ├─ application.properties
│  │     └─ db/migration/      # V1__..., V7__create_categories..., V8__create_products...
│  └─ test/
```

---

## ⚙️ Configuración y arranque

> Requisitos: JDK 17, Maven Wrapper (`./mvnw`), PostgreSQL en local.

1. **Clonar e instalar dependencias**

```bash
./mvnw clean install -U
```

2. **Configurar variables (recomendado `.env.local`)**

```bash
APP_CRYPTO_KEY=<base64 de 32 bytes>   # clave AES-GCM
APP_JWT_SECRET=<base64 >=32 bytes>    # secreto JWT
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/picmebylolas
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<tu_password>
```

3. **Arrancar (script)**

```bash
# Asegura formato LF y permisos (si editaste en Windows)
sed -i 's/\r$//' run.local.sh
chmod +x run.local.sh
bash ./run.local.sh
```

---

## 🔐 Variables de entorno

Genera claves Base64 seguras:

```bash
# 32 bytes base64 sin espacios:
openssl rand -base64 32 | tr -d '[:space:]'
```

Mapeo en `application.properties`:

```properties
security.jwt.secret=${APP_JWT_SECRET}
app.crypto.key=${APP_CRYPTO_KEY}
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

---

## 🗃️ Migraciones (Flyway)

- Migraciones en `src/main/resources/db/migration` con formato `Vx__description.sql`.
- **Regla de oro**: **no** modificar migraciones ya aplicadas → crear una nueva versión.
- Cambio a UUID: se creó `V7__create_categories_table.sql` **antes** de `V8__create_products_table.sql` para cumplir el FK.

Reset local (si lo necesitas):

```bash
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='picmebylolas';" || true
psql -U postgres -c "DROP DATABASE IF EXISTS picmebylolas;"
psql -U postgres -c "CREATE DATABASE picmebylolas;"
```

---

## 📖 Swagger / OpenAPI

- UI: `http://localhost:8080/swagger-ui.html`
- Docs JSON: `http://localhost:8080/v3/api-docs`

---

## 📑 Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Categorías

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Productos

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

---

## 🧭 Decisiones de diseño y seguridad

- **UUID en todas las entidades**
- **Precios en céntimos (`long`)**
- **Passwords con BCrypt**
- **IBAN cifrado con AES-GCM**
- **JWT con JJWT 0.12.5** (clave Base64 ≥32 bytes, expiración configurable)
- **Flyway** para versionado reproducible

---

## 🔬 Pruebas rápidas (cURL)

```bash
API=http://localhost:8080

# Ping (público)
curl -i $API/api/ping

# Registro
curl -i -X POST $API/api/auth/register   -H "Content-Type: application/json"   -d '{"nombre":"Lola","apellidos":"Riera","email":"lola@example.com","password":"Passw0rd!","iban":"ES7921000813610123456789"}'

# Login
LOGIN_JSON=$(curl -s -X POST $API/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"lola@example.com","password":"Passw0rd!"}')
TOKEN=$(echo "$LOGIN_JSON" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
```

---

## 🛠️ Troubleshooting

- **Flyway — “no existe la relación categories”** → asegurarse del orden correcto de migraciones.
- **JWT — Illegal base64 character** → limpiar claves con `tr -d '[:space:]'`.
- **Swagger 500 / NoSuchMethodError** → usar Spring Boot 3.3.5 + springdoc 2.6.0.
- **Script — bad interpreter: /bin/bash^M** → `sed -i 's/\r$//' run.local.sh`.

---

## 🗺️ Roadmap

- [ ] Frontend React (mapa, UI de pedido, “zona segura”)
- [ ] Pasarela de pago (mock/sandbox)
- [ ] Despliegue (Docker + cloud)
- [ ] Alertas de ayuda (endpoint + notificaciones)
- [ ] Tests de integración con Testcontainers

---

## ✍️ Autora

**Alba** — Desarrolladora Fullstack (porfolio).  
_PickMeByLolas_ — 2025
>>>>>>> 2aea979063f7f9b9ec429f7570737186b6b34a15
