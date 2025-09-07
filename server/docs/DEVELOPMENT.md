# Development Guide

This document explains how to develop, run, and extend the server, reflecting the current project structure and best practices.

## Overview

- **Purpose:** REST API for a fiction book review application (authentication, user profile, books, reviews).
- **Stack:** Node.js, Express 5, Sequelize (MySQL), JWT auth, Multer for file upload, Nodemailer for email, ESLint for linting.
- **Composition Root:** `src/model-registry/index.js` loads all models and wires their associations.

## Project Structure (Refactored)

The project follows a "feature-first" approach for business logic, with a centralized `config` directory for all infrastructure setup.

```
server.js                   # App entry (Express server)
src/
  ├── config/               # ✅ Centralized Infrastructure & Setup
  │   ├── index.js          # Main config loader (reads from schema.js)
  │   ├── schema.js         # Defines, validates, and builds the config object from .env
  │   ├── database.js       # Sequelize instance and connection setup
  │   ├── mailer.js         # Nodemailer transport and sendEmail helper
  │   └── passport.js       # Passport.js strategy configuration (e.g., Google OAuth)
  │
  ├── core/                 # Cross-cutting middleware & services
  │   ├── middleware/
  │   └── services/
  │
  ├── features/             # Business logic, separated by domain
  │   ├── auth/
  │   ├── users/
  │   ├── books/
  │   └── reviews/
  │
  ├── model-registry/       # Connects all Sequelize models and defines associations
  │   └── index.js
  │
  ├── public/               # Static assets served by the app
  │
  └── seeders/              # Scripts to populate the database with initial data
uploads/                    # Directory for user-uploaded files (e.g., profile images)
docs/                       # Project documentation
```

### Key Architectural Decisions:
- **Centralized Config:** All infrastructure setup (DB, Mailer, Auth Strategies) resides in `src/config`. This separates setup concerns from business logic.
- **Feature-First:** Controllers, services, and models are grouped by feature (e.g., `src/features/users`) to keep related code cohesive.
- **Explicit Imports:** Services and middleware are imported directly from their files (no barrel files) to maintain a clear dependency graph.

## Local Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Create Environment File:**
    Copy the example `.env` file and fill in your local configuration details.
    ```bash
    cp .env.example .env
    ```
3.  **Start the Server:**
    - **With debug logs (recommended for dev):**
      ```bash
      npm run debug
      ```
    - **Standard development mode:**
      ```bash
      npm run dev
      ```
    - **Production-like mode:**
       ```bash
      npm start
      ```
The server starts on `http://localhost:8080` by default.

## Database Management

- **ORM:** Sequelize. The connection instance is configured in `src/config/database.js`.
- **Schema Sync (Dev Only):** In development, the server automatically runs `sequelize.sync({ alter: true })` on startup to keep your DB schema in sync with your models. **Note:** This is not suitable for production; use migrations instead.
- **Seeding Data:**
    - To sync the schema and seed initial book data:
      ```bash
      npm run seed:all
      ```
    - The data source is `src/seeders/data/books.json`.

## Conventions

- **Logging:** Uses the `debug` library. Enable logs by setting the `DEBUG` environment variable (e.g., `DEBUG=fictionbook:*`).
- **Error Handling:** A central error handler in `server.js` catches errors and returns a standardized JSON response.
- **Linting:** Uses ESLint with recommended rules. Run `npm run lint` to check your code.

---
This guide reflects the current structure and patterns of the codebase. Please keep it updated as the project evolves.
