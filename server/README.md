# Fiction Book Review API

REST API for a fiction book review application built with Node.js, Express 5, and Sequelize (MySQL). The codebase follows a feature-first structure with clear separation between controllers, services, and models.

## Quick Start

- Install dependencies
  - `npm install`
- Create your environment file
  - `cp .env.example .env` (or manually create `.env` based on the example)
- Run the server
  - Development: `npm run dev`
  - Debug logs: `npm run debug` (uses `DEBUG=fictionbook:*`)
  - Production-like: `npm start`

The server listens on `http://localhost:8080` by default.

## Scripts

- `npm run dev`: Start with nodemon
- `npm run debug`: Start with debug logs enabled
- `npm start`: Start in production mode
- `npm run lint`: Run ESLint

## Documentation

- API: `docs/API.md`
- Development: `docs/DEVELOPMENT.md`
- Production: `docs/PRODUCTION.md`
- Security: `docs/SECURITY.md`
- Postman collection: `docs/postman_collection.json` (import and set `baseUrl`, `token`)

## Project Structure (high level)

- `server.js`: Express app entry point
- `src/model-registry`: Model registry and associations
- `src/config`: Database and mailer configuration
- `src/core/middleware`: CORS, security (helmet, rate limiter)
- `src/core/services`: Token, email, file services
- `src/features`: Feature-first modules (auth, users, books, reviews)
- `docs`: Project documentation
- `uploads`: Uploaded files (runtime folder)

## License

MIT
