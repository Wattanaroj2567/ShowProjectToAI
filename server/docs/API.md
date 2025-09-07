## API Reference

Base URL (development): `http://localhost:8080/api`

Note: Routes are mounted under `/api` in `server.js`. Authentication uses Bearer tokens.

---

### Auth

- POST `/api/auth/register`
  - Body: `{ username, displayName, email, password }`
  - 201 with created user (id, username, displayName, email)

- POST `/api/auth/login`
  - Body: `{ emailOrUsername, password }`
  - 200 with `{ token, user }`

- POST `/api/auth/forgot-password`
  - Body: `{ email }`
  - Sends reset link to email (no-op if email not found). 200

- PUT `/api/auth/reset-password`
  - Body: `{ token, newPassword }`
  - 200 on success

- DELETE `/api/auth/account` (requires auth)
  - Header: `Authorization: Bearer <JWT>`
  - Deletes the current user account. 200 with actions to clear token/redirect

---

### Users (requires auth)

All routes under `/api/user` require `Authorization: Bearer <JWT>`.

- GET `/api/user/profile`
  - Returns current user profile (id, username, displayName, email, profileImage)

- PUT `/api/user/profile`
  - Content-Type: `multipart/form-data`
  - Fields: optional `displayName`, `username`; optional file `profileImage`
  - Updates profile and profile image; returns updated fields

- PUT `/api/user/email`
  - Body: `{ newEmail, password }`
  - Changes email after password verification

- PUT `/api/user/password`
  - Body: `{ oldPassword, newPassword }`
  - Changes password after verification

---

### Books

- GET `/api/book`
  - Query: `page` (default 1), `limit` (default 12)
  - Returns paginated list of books

- GET `/api/book/:id`
  - Returns a single book by id (404 if not found)

---

### Reviews

Note: Review routes are mounted under `/api/review` and include subpaths for books and users.

- POST `/api/review/books/:bookId/reviews` (requires auth)
  - Body: `{ rating, content }`
  - Creates a review for the given book if not already reviewed by the user

- GET `/api/review/books/:bookId/reviews`
  - Query: `page` (default 1), `limit` (default 10)
  - Returns paginated reviews for a book; includes basic user info

- GET `/api/review/users/:userId/reviews`
  - Query: `page` (default 1), `limit` (default 10)
  - Returns paginated reviews written by a user; includes basic book info

- PUT `/api/review/:reviewId` (requires auth)
  - Body: `{ rating?, content? }`
  - Updates user’s own review

- DELETE `/api/review/:reviewId` (requires auth)
  - Deletes user’s own review

---

For detailed behavior and error messages, refer to controllers under `src/features/**`.

