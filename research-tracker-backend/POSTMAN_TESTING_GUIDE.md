# Postman Testing Guide

## 1) Import the Collection

- Open Postman.
- Click **Import**.
- Import:
  - `postman_collection.json` (original)
  - `postman_collection_fixed.json` (corrected test-enabled)

Use `postman_collection_fixed.json` for automated test validation.

## 2) Environment / Variables Setup

Collection variables are already included:

- `baseUrl` = `http://localhost:5000`
- `token` = empty initially
- `paperId`, `grantId`, `reviewId` = defaults for first run

Before testing, ensure:

- Backend server is running on port `5000`
- Database is initialized with `db_setup.sql`

## 3) Recommended Execution Order

Run requests in this order for clean flow:

1. **Auth**
   - Register Researcher
   - Register Admin
   - Login (saves `token`)
   - Get Profile
2. **Papers**
   - Submit Paper (saves `paperId`)
   - Get My Papers / Get All Papers / Get by ID
   - Update Paper Status
3. **Grants**
   - Apply Grant (saves `grantId`)
   - Get My Grants / Get All Grants / Get by ID
   - Update Grant Status
   - Record Grant Utilization
4. **Reviews**
   - Submit Review (saves `reviewId`)
   - Get Reviews by Paper
   - Update Review
5. **Reports**
   - Submit Progress Report
   - Get All Reports
   - Get Reports by Grant
   - Generate Grant Summary
6. **Negative Tests**
   - Login Wrong Password (401)
   - Protected Route Without Token (401)
   - Access Admin Route as Researcher (403)
   - Submit Paper Missing Title (400)
   - Apply Grant Missing Amount (400)

## 4) Run Full Suite with Collection Runner

- Click the collection name (`postman_collection_fixed`).
- Click **Run collection**.
- Keep request order as defined.
- Run all requests.

The fixed collection includes tests for:

- status code validation
- schema/field presence checks
- response time (< 2000ms for GET routes)
- token/id auto-capture into collection variables

## 5) How to Read Test Results

- **Green (Pass)**: endpoint behavior matches expected contract.
- **Red (Fail)**: mismatch in status code, response shape, or response time.
- Open failing request -> **Test Results** tab to see the exact assertion that failed.

## 6) Common Errors and Fixes

- **401 Unauthorized**
  - Cause: missing/invalid token, expired session, login not run.
  - Fix: run **Auth/Login** again and re-check `token` collection variable.

- **403 Forbidden**
  - Cause: authenticated user has wrong role for route.
  - Fix: login with proper role account (e.g., admin for admin-only routes).

- **400 Bad Request (Validation)**
  - Cause: missing required fields or invalid input format.
  - Fix: verify request body keys/types (`title`, `amount_requested`, date formats, etc.).

- **404 Not Found**
  - Cause: invalid `paperId`, `grantId`, or `reviewId`.
  - Fix: create entity first and ensure ID variables are updated.
