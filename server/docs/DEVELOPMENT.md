# Development Guide

This document explains how to develop, run, and extend the server with a focus on consistency and clarity.

## Overview

- Purpose: REST API for a fiction book review application (authentication, user profile, books, reviews).
- Stack: Node.js, Express 5, Sequelize (MySQL), JWT auth, Multer for file upload, Nodemailer for email, ESLint for linting.
- Composition root: `src/model-registry/index.js` loads models and wires associations.

## Project Structure

```
server.js                   # App entry (Express server)
src/
  db/                       # Composition root for models + associations
    index.js
  config/                   # Infrastructure configuration
    database.js             # Sequelize instance (MySQL)
    mailer.js               # Nodemailer transport + sendEmail
  core/
    middleware/             # Cross-cutting middleware
      cors.js               # CORS with allowlist from env
      security.js           # Helmet + rate limiter factory
    services/               # Cross-cutting services (import directly)
      email-service.js
      file-service.js
      token-service.js
  features/                 # Feature-first modules
    auth/
      auth-controller.js
      auth-middleware.js
      auth-routes.js
      auth-service.js
    users/
      user-controller.js
      user-model.js
      user-routes.js
      user-service.js
      upload-middleware.js
    books/
      book-controller.js
      book-model.js
      book-routes.js
    reviews/
      review-controller.js
      review-model.js
      review-routes.js
  public/
    images/avatars/default-avatar.png
    images/books/                 # Developer-managed static book covers
  seeders/
    bookSeeder.js           # Optional data seeding helpers
uploads/
  profiles/                 # Uploaded profile images (runtime folder)
docs/                       # Documentation (development, API, production, security)
```

Key decisions:
- Feature-first layout keeps controllers/services/models cohesive per domain.
- Model registry lives in `src/model-registry/index.js` (not under core) for clarity of responsibilities.
- No barrels for services/middleware; import concrete files directly to keep dependency graph explicit.
- Filenames use kebab-case (e.g., `user-service.js`).

## Conventions

- Language & runtime: Node.js (CommonJS). Use `async/await` and return JSON from controllers.
- Error handling: Central error handler in `server.js` (maps `err.status` to HTTP status).
- Logging: Use `debug` with namespaces (e.g., `fictionbook:*`). Enable with `DEBUG=fictionbook:*`.
- HTTP middleware: `helmet` via `security.js`, `cors` via `cors.js`, body parsers via Express.
- Services: Import directly (e.g., `require("../../core/services/token-service")`).
 
- Linting: ESLint (recommended rules). Run `npm run lint`.

## Environment Variables

Minimum required to run locally:
- Database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- Auth: `JWT_SECRET`, optional `JWT_EXPIRES_IN` (default `7d`)
- CORS: `CLIENT_ORIGINS` (comma-separated) or `CLIENT_ORIGIN`
- Mail: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, optional `EMAIL_FROM_ADDRESS`
- Client URL for password reset links: `CLIENT_URL`

Notes:
- The server currently uses `sequelize.sync()` on startup in `server.js` for convenience in development. Avoid `sync()` in production — prefer migrations instead.

## Local Setup

1) Install dependencies
   - `npm install`
2) Create a `.env` file with required variables (see above).
3) Start the server
   - Development with logs: `npm run debug` (uses `DEBUG=fictionbook:*`)
   - Development: `npm run dev` (nodemon)
   - Production-like: `npm start`

The server starts on `http://localhost:8080` by default.

## Linting

- Run lint: `npm run lint`

## Database

- ORM: Sequelize; connection in `src/config/database.js`.
- Models: Defined per feature (e.g., `user-model.js`, `book-model.js`, `review-model.js`).
- Associations: Wired in `src/model-registry/index.js` (e.g., `User.hasMany(Review)`).
- Seeding: Optional helpers under `src/seeders/` (e.g., `bookSeeder.js`).
- Migrations: Not configured yet. If you deploy to production, set up migrations (e.g., `sequelize-cli`) and remove `sequelize.sync()` in favor of a migration step.

## File Uploads

- Profile images use Multer storage in `src/features/users/upload-middleware.js`.
- Files are saved under `uploads/profiles/` with the `profile-<timestamp>-<rand>.<ext>` naming.
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Static file serving:
  - `/uploads` → project `uploads/` directory
  - `/images` → `src/public/images/`
  - Note: Book cover upload endpoint is not part of the current scope; covers are developer-managed under `src/public/images/books/`.

## API

- Base path: `/api`. See `docs/API.md` for endpoint details.
- Postman collection: `docs/postman_collection.json` (Import into Postman and set variables `baseUrl`, `token`)

## DB & Seeding Commands

- Sync schema (development only): `npm run db:sync`
- Seed books from JSON: `npm run seed:books`
- Sync + seed in one go: `npm run seed:all`
- Data source: `src/seeders/data/books.json` (idempotent upsert by `title+author`)

## Security

- Rate limiting for auth routes via `createLimiter` in `src/core/middleware/security.js`.
- `helmet` enabled. CORS configured via allowlist from env. See `docs/SECURITY.md` for details.

## Contribution Workflow

- Keep changes cohesive per feature; avoid unrelated refactors in the same PR.
- Follow kebab-case for filenames and import direct concrete modules (no barrel indirection).
- Run `npm run lint` before pushing.

---

This guide reflects the current structure and patterns of the codebase and will evolve with the project.
