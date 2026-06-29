# Smart Agri-Connect — Enhancement Changelog

## Security Enhancements

### ✅ Content Security Policy (CSP)
- New file: `src/Middleware/csp.js`
- Per-request nonce generated with `crypto.randomBytes`
- Strict CSP headers: `default-src 'self'`, `script-src 'self' 'nonce-{nonce}'`, `object-src 'none'`
- Additional security headers added to every response:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### ✅ Rate Limiting
- New file: `src/Middleware/rateLimiter.js`
- Global: 100 requests / 15 minutes per IP
- Auth endpoints (login, register, forget-password): 20 requests / 15 minutes per IP
- Returns `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers

### ✅ File Upload Security
- Added `fileFilter` in multer: only image MIME types allowed (jpeg, png, gif, webp)
- File size limit set to 5MB
- Original: no file type or size restrictions

### ✅ CORS Hardening
- CORS options now read from `ALLOWED_ORIGIN` env variable
- Explicit allowed methods and headers

---

## New Features

### ✅ Wishlist
- New Model: `src/Models/wishlist.js`
- New Migration: `src/Migrations/20260629000001-create-wishlist.js`
- New API endpoints:
  - `POST   /api/users/wishlist`       — Add product to wishlist
  - `GET    /api/users/wishlist`       — Get user's wishlist
  - `DELETE /api/users/wishlist/:id`   — Remove item from wishlist
- New frontend page: `public/wishlist.html`
- Duplicate prevention: same product can't be added twice

### ✅ Order History
- New Model: `src/Models/order.js`
- New Migration: `src/Migrations/20260629000002-create-orders.js`
- New API endpoints:
  - `POST /api/users/orders`      — Place order (clears cart after success)
  - `GET  /api/users/orders`      — Get order history
  - `GET  /api/users/orders/:id`  — Get single order detail
- Stores: items snapshot, total amount, payment method, transaction ID, status
- New frontend page: `public/orders.html` with expandable item view

### ✅ Profile Management
- New API endpoints:
  - `GET /api/users/profile`  — Get profile info
  - `PUT /api/users/profile`  — Update name and/or password
- New frontend page: `public/profile.html`
- Password change requires current password verification

---

## Bug Fixes / Improvements

- `src/app.js`: Added 404 handler, body size limits (10mb), CSP + rate limiter applied globally
- `src/Routes/userRoutes.js`: Proper REST verbs (`DELETE` for wishlist, `PUT` for profile)
- `src/Services/userService.js`: `UPI_ID` now read from env variable instead of hardcoded
- Added `.env.example` with all required environment variables documented

---

## Migration Steps

```bash
# Run the new migrations
npx sequelize-cli db:migrate

# Or if using initDB script:
node src/Scripts/initDB.js
```
