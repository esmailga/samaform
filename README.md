# Samaform

Modern, elegant architecture firm website and intake form. This repository contains a Vite + React frontend and a lightweight PHP + SQLite backend to collect multi-step project responses, upload images, and let an admin view/manage responses.

Live preview: https://www.samaform.com

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [API overview](#api-overview)
- [Getting started (dev)](#getting-started-dev)
- [Production / Deployment](#production--deployment)
- [Database & uploads](#database--uploads)
- [Admin & security notes](#admin--security-notes)
- [Contributing](#contributing)
- [License & contact](#license--contact)

---

## Features

- Modern single-page React frontend built with Vite, in Arabic (default) and English
- Multi-step "Record Your Plan" form that uploads images (inspiration / current space)
- Projects page with a carousel per category, managed from the admin
- Admin area: manage projects (name in English and Arabic, category, image), view and delete responses, export responses to Excel and a branded PDF
- Lightweight PHP API with SQLite storage (no external DB required)
- Uploads are checked server-side and only real image files are stored
- Simple JWT-style Bearer token used for admin authentication
- Detailed Terms of Service and Privacy Policy in both languages

---

## Tech stack

- Frontend: TypeScript, React, Vite
- Styling: Tailwind (via @tailwindcss/vite)
- Backend: PHP (single-file API: `api/index.php`)
- Database: SQLite (`database.db`)
- Dev tooling: Node, npm/yarn, Vite

---

## Project structure (high level)

- `/src` — frontend source (Vite + React)
- `/src/data/translations.ts` — all site text in English and Arabic; `/src/data/legal.ts` — Terms and Privacy Policy
- `/public` — static files, including `project-images/` (starter project photos) and `fonts/` (Cairo, used by the PDF export; SIL Open Font License in `fonts/OFL.txt`)
- `/` — static entry (`index.html`)
- `/api/index.php` — PHP backend, routes and DB initialization
- `/database.db` — SQLite DB used by the API
- `/uploads` — directory for uploaded images (created at runtime)

---

## API overview

Base path proxied in development to `http://localhost:8000/api/index.php`

- GET `/api/`  
  Health check — returns API status.

- POST `/api/admin/login`  
  Body: JSON with `username` and `password`.  
  Response: `{ token: "<header>.<payload>.<sig>" }` (Bearer token for admin endpoints)

- POST `/api/form/responses`  
  Save a response (multipart/form-data). Accepts form fields for steps plus `inspirationImages` and `currentSpaceImages` file fields. Returns confirmation JSON.

- GET `/api/admin/responses`  
  Requires `Authorization: Bearer <token>`. Returns all responses with merged data and uploaded image paths.

- DELETE `/api/admin/responses/:id`  
  Requires admin authorization. Deletes a response and its related rows.

- POST `/api/admin/update-credentials`  
  Requires admin authorization. Body: JSON `{ newUsername, newPassword }` — updates admin user.

- GET `/api/projects`  
  Public. Returns all projects: `{ id, category, nameEn, nameAr, image }`.

- POST `/api/admin/projects`  
  Requires admin authorization. multipart/form-data with `category` (`residential` | `commercial` | `garden-terrace`), `nameEn`, `nameAr` and `image`. Adds a project.

- POST `/api/admin/projects/:id`  
  Requires admin authorization. Same fields; `image` is optional. Updates a project (a replaced uploaded image is deleted).

- DELETE `/api/admin/projects/:id`  
  Requires admin authorization. Deletes a project and its uploaded image.

Note: The API stores uploaded images in `/uploads` and returns relative paths like `/uploads/<file>`.

---

## Getting started (dev)

Prerequisites:
- Node 18+ (for Vite)
- PHP 8+ (for the lightweight backend) or any host that can serve `api/index.php`
- npm or yarn

1. Install frontend deps
   - npm: `npm install`
   - yarn: `yarn`

2. Start PHP backend
   - From repository root run:
     ```
     npm run api
     ```
     (this runs `php -S localhost:8000 -t .`)
     This serves `api/index.php` (Vite dev server will proxy `/api` → `http://localhost:8000/api/index.php`).

3. Start frontend dev server (in another terminal)
   - `npm run dev` (or `yarn dev`)
   - Open `http://localhost:5173` (or Vite's printed URL).

Notes:
- Vite config proxies `/api` and `/uploads` to the PHP server for development.
- If your environment disables HMR, set `DISABLE_HMR=true` when running Vite.

---

## Production / Deployment

A simple deployment approach:

- Build frontend:
  - `npm run build`
  - Serve the built static files from any static host (Netlify, Vercel, static server, or a PHP-enabled host).

- Backend:
  - Deploy `api/index.php` and `database.db` to a PHP-enabled host.
  - Ensure the `uploads` directory exists and is writable by the web server.
  - Update the JWT secret in `api/index.php` (do not use the default secret in production).
  - Secure `database.db` and `uploads` so they are not publicly writable except via the app.

Alternatively, containerize the app with a small PHP image and static file server and mount persistent storage for `uploads` and `database.db`.

---

## Database & uploads

- Database file: `database.db` (SQLite). The API will create and initialize it if missing.
- Uploads: saved to `/uploads` relative to the repo root (created automatically when the first file is uploaded).
- Tables created (by `api/index.php`):
  - `users` — admin user(s)
  - `responses`, `response_step1`, ..., `response_step5`
  - `projects` — created on first run and filled with 9 starter projects (images in `public/project-images/`)

Resetting the DB:
- Stop the server and remove `database.db`, then restart the PHP server; the API will recreate tables and seed a default admin user.

---

## Admin & security notes

- Default seeded credentials (development only):
  - username: `admin`
  - password: `admin123`
- The default JWT secret in `api/index.php` is `super-secret-admin-key`. Change this before deploying to production.
- Always change the admin password and secret before making the site public.
- Validate and sanitize any additional data you add to the API if you extend features.
- Consider adding HTTPS, rate limiting, CSRF protections, and stronger token signing (e.g., using a proper JWT library) for production.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR describing the change
4. Write tests (if applicable) and document behavior in the README

If you want improvements to the admin dashboard, CSV export, or PDF generation, open an issue with a short description.

---

## Ideas / Roadmap

- Email notifications on new responses.
- Replace the ad-hoc JWT with a standard library (firebase/php-jwt or similar).
- Add size limits for uploads.

---

## License & contact

- License: MIT (or add your preferred license file)
- Website / demo: https://www.samaform.com
- Maintainer: esmailga (GitHub: @esmailga)
