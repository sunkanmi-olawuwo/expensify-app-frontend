Here's the complete auth integration guide:

---

# Auth Endpoints — Frontend Integration Guide

All endpoints are under `/api/v1`. All errors use [RFC 7807 ProblemDetails](https://datatracker.ietf.org/doc/html/rfc7807) format. All endpoints are rate-limited (`429 Too Many Requests`).

---

## 1. Register

**`POST /api/v1/users/register`**

Creates a new user account.

|                  |                    |
| ---------------- | ------------------ |
| **Auth**         | None (anonymous)   |
| **Content-Type** | `application/json` |
| **Success**      | `201 Created`      |

**Request:**

```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "string"
}
```

**Response (`201`):**

```json
{
  "userId": "guid"
}
```

---

## 2. Login

**`POST /api/v1/users/login`**

Authenticates a user and returns a JWT access token and refresh token.

|                  |                    |
| ---------------- | ------------------ |
| **Auth**         | None (anonymous)   |
| **Content-Type** | `application/json` |
| **Success**      | `200 OK`           |

**Request:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (`200`):**

```json
{
  "token": "string",
  "refreshToken": "string"
}
```

> Store both tokens. Use `token` as the Bearer token for authenticated requests. Use `refreshToken` to obtain new tokens when the access token expires.

---

## 3. Refresh Token

**`POST /api/v1/users/refresh`**

Exchanges an expired access token and a valid refresh token for a new token pair.

|                  |                    |
| ---------------- | ------------------ |
| **Auth**         | None (anonymous)   |
| **Content-Type** | `application/json` |
| **Success**      | `200 OK`           |

**Request:**

```json
{
  "token": "string",
  "refreshToken": "string"
}
```

**Response (`200`):**

```json
{
  "token": "string",
  "refreshToken": "string"
}
```

> Both the access token and refresh token are rotated. Discard the old pair and store the new one.

---

## 4. Logout

**`POST /api/v1/users/logout`**

Logs out the current user from **all** active sessions. All previously issued tokens (access + refresh) become invalid.

|                  |                                            |
| ---------------- | ------------------------------------------ |
| **Auth**         | Required — `Authorization: Bearer {token}` |
| **Request body** | None                                       |
| **Success**      | `204 No Content`                           |

```ts
await fetch("/api/v1/users/logout", {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
});
// On 204: clear stored tokens and redirect to login
```

---

## 5. Change Password

**`POST /api/v1/users/change-password`**

Changes the authenticated user's password and invalidates **all** active sessions (including the current one).

|                  |                                                             |
| ---------------- | ----------------------------------------------------------- |
| **Auth**         | Required — `Authorization: Bearer {token}`                  |
| **Content-Type** | `application/json`                                          |
| **Success**      | `204 No Content`                                            |
| **Errors**       | `400` — wrong current password or password policy violation |

**Request:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

> On `204`: all sessions are invalidated. The user must re-authenticate with the new password.

---

## 6. Forgot Password

**`POST /api/v1/users/forgot-password`**

Initiates a password reset flow. If the email exists, a reset link is sent. **Always returns `204`** regardless of whether the account exists (prevents user enumeration).

|                  |                           |
| ---------------- | ------------------------- |
| **Auth**         | None (anonymous)          |
| **Content-Type** | `application/json`        |
| **Success**      | `204 No Content` (always) |

**Request:**

```json
{
  "email": "string"
}
```

> Always show the same "check your email" message to the user regardless of response.

The reset email contains a link in the format:

```
{ResetUrlBase}?email={urlEncodedEmail}&token={base64UrlEncodedToken}
```

The frontend reset page should extract `email` and `token` from the query string and pass them to the reset endpoint below.

---

## 7. Reset Password

**`POST /api/v1/users/reset-password`**

Completes the password reset using the token from the email link. On success, all active sessions are invalidated.

|                  |                                                            |
| ---------------- | ---------------------------------------------------------- |
| **Auth**         | None (anonymous)                                           |
| **Content-Type** | `application/json`                                         |
| **Success**      | `204 No Content`                                           |
| **Errors**       | `400` — invalid/expired token or password policy violation |

**Request:**

```json
{
  "email": "string",
  "token": "string",
  "newPassword": "string"
}
```

> Pass `email` and `token` exactly as received from the URL query parameters — do **not** decode the token.

---

## Error Response Format

All error responses return ProblemDetails:

```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Bad Request",
  "status": 400,
  "detail": "Description of what went wrong",
  "instance": "/api/v1/users/change-password"
}
```

---

## Session Behavior Summary

| Action          | Effect on sessions                          |
| --------------- | ------------------------------------------- |
| Login           | Creates new session (token + refresh token) |
| Refresh         | Rotates token pair, old pair invalidated    |
| Logout          | **All** sessions invalidated                |
| Change password | **All** sessions invalidated                |
| Reset password  | **All** sessions invalidated                |
| Forgot password | No session impact                           |

---

## Typical Frontend Flows

**Login flow:** `Register` or `Login` → store `token` + `refreshToken` → use Bearer token for requests → `Refresh` when token expires.

**Password reset flow:** `Forgot Password` → user clicks email link → frontend extracts `email` + `token` from URL → `Reset Password` → redirect to login.

**Change password flow (settings page):** `Change Password` → clear stored tokens → redirect to login.
