# API Overview

All route handlers return the same envelope:

```json
{
  "success": true,
  "message": "Human readable status",
  "data": {}
}
```

Errors return:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

## Core Endpoints

- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET|POST /api/articles`
- `GET|PATCH|DELETE /api/articles/[id]`
- `POST /api/articles/[id]/publish`
- `POST /api/articles/[id]/unpublish`
- `POST /api/articles/[id]/archive`
- `POST /api/articles/[id]/restore`
- `POST /api/articles/[id]/duplicate`
- `GET /api/articles/slug/[slug]`
- `GET /api/community/articles`
- `GET|POST /api/articles/[id]/comments`
- `PATCH|DELETE /api/comments/[id]`
- `POST /api/comments/[id]/replies`
- `POST|DELETE /api/articles/[id]/likes`
- `POST|DELETE /api/articles/[id]/bookmarks`
- `GET /api/users/[username]`
- `PATCH /api/users/me`
- `POST|DELETE /api/users/[id]/follow`
- `GET /api/users/me/articles`
- `GET /api/users/me/history`
- `POST /api/reports`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/[id]`
- `POST|DELETE /api/uploads/images`
- `GET /api/search`
- `GET /api/analytics/articles/[id]`
- `GET /api/notifications`
- `PATCH /api/notifications/[id]/read`
- `GET /api/health`
