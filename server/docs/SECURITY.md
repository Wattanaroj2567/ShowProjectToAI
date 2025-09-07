# Security Guidelines

This document summarizes the security practices applied in this project and recommendations for production.

## Authentication & Authorization

- JWT-based authentication; tokens are signed with `JWT_SECRET` and have an expiry (`JWT_EXPIRES_IN`, default `7d`).
- Store `JWT_SECRET` in environment variables or a secret manager only (never in source control).
- Rate-limit sensitive endpoints (login, forgot-password) — implemented via `createLimiter` for `/api/auth`.
- For logout/revocation requirements, consider a token denylist or short-lived access tokens with refresh tokens.

## HTTP Security

- `helmet` is enabled to set secure headers.
- CORS allowlist is configurable via `CLIENT_ORIGINS` (comma-separated) or `CLIENT_ORIGIN`. Do not use `*` in production.
- Limit request body sizes at the proxy and/or middleware to mitigate large payload attacks.

## Input Validation & Persistence

- Validate and sanitize inputs (e.g., `express-validator` is available in dependencies).
- Use ORM parameter binding (Sequelize) to prevent SQL injection.
- For file uploads (profile images):
  - Accepted extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.
  - Server stores uploads under `uploads/profiles/`; consider offloading to object storage (e.g., S3) in production.

## Error Handling & Logging

- Centralized error handler returns standard JSON responses; avoid exposing stack traces in production.
- Use `debug` for structured debug logs; forward logs to a centralized system in production.
- Log security-relevant events (failed logins, account deletion).

## Dependency & System Security

- Audit dependencies regularly (`npm audit`) and patch vulnerabilities.
- Commit and maintain a lockfile for deterministic installs.
- Run as a non-root user; restrict container and host privileges.
- Manage secrets via environment or a secret manager; never commit secrets.

---

Reassess these guidelines periodically as dependencies and requirements evolve.

