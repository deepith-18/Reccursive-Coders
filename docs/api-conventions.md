# API Conventions

## Response Envelopes

All HTTP API endpoints return responses using the unified `ApiResponse<T>` wrapper:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-10-09T18:00:00Z"
}
```

## Error Envelopes

All errors return the standardized `ErrorResponse` structure with appropriate HTTP status codes:

```json
{
  "status": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "path": "/api/v1/users",
  "timestamp": "2026-10-09T18:00:00Z",
  "validationErrors": {
    "email": ["Must be a valid email address"]
  }
}
```

## Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing or expired JWT token.
- `403 Forbidden`: Authenticated user lacks the required role.
- `404 Not Found`: Entity not found.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email).
- `500 Internal Server Error`: Unhandled server exception.

## Type Generation
Frontend types are automatically synchronized from Springdoc OpenAPI via:
```bash
pnpm generate-api
```
This guarantees zero schema drift between the backend DTOs and frontend TypeScript models.
