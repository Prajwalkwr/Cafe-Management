# Mithaas Café

Where Every Taste Feels Like Home.

A premium website for Mithaas Café, a Nepali café in Kathmandu. Guests can browse the menu, view signature dishes and the gallery, read guest notes, and reserve a table. Staff manage reservations, the menu, and gallery photos from a protected admin dashboard.

**Live site:** [mithaas-cafe.vercel.app](https://mithaas-cafe.vercel.app)
**API:** `https://mithaas-cafe-api.onrender.com` (health check at `/api/health`)

[![Deploy API to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Prajwalkwr/Cafe-Management)

## Features

- Cinematic loading screen, hero reveal, scroll reveals, and a custom Mithaas logo cursor on desktop
- Menu with category filters and an item detail view
- Signature dishes, photo gallery with lightbox, and guest testimonials
- Table reservations saved to MongoDB, with a confirmation ID such as `MIT-2026-AB12`
- Reservation lookup page at `/reservation/:id`
- Admin sign-in (JWT) with reservation status changes, menu editing, and gallery management
- Validation on both the browser and the server, rate limiting, and hashed admin passwords
- Respects reduced-motion settings; custom cursor only on mouse devices

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS v4, Motion |
| Backend | Node.js, Express 5, Mongoose, Zod, JWT, bcrypt, Helmet |
| Database | MongoDB (Atlas in production, local MongoDB in development) |
| Hosting | Vercel (frontend), Render (API) |

## Project structure

```text
src/            React app (pages, components, motion, hooks, services)
src/assets/     Café photography
server/         Express API (routes, controllers, models, middleware, seed data)
shared/         Validation and café details used by both frontend and backend
public/         Favicon, social image, redirects
render.yaml     Render blueprint for the API
vercel.json     Vercel settings for the frontend
```

## Run locally

Requires Node.js 20.19 or newer.

```bash
npm install
cp .env.example .env    # then edit the values
npm run dev
```

- Website: http://localhost:5173
- API: http://localhost:5000

If `MONGODB_URI` is empty, the server starts a local MongoDB instance and stores data outside the project folder. The menu, gallery, testimonials, and admin account are created automatically the first time.

Quote values that contain `#`, for example `ADMIN_PASSWORD="Mithaas#2026"`. Dotenv treats an unquoted `#` as the start of a comment.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Render | MongoDB Atlas connection string |
| `JWT_SECRET` | Render | Long random string for signing admin sessions |
| `ADMIN_EMAIL` | Render | Admin sign-in email |
| `ADMIN_PASSWORD` | Render | Admin sign-in password |
| `CLIENT_ORIGIN` | Render | Allowed website origins, comma separated. `*` matches one name part, for example `https://mithaas-cafe*.vercel.app` |
| `VITE_API_URL` | Vercel | Public URL of the Render API, for example `https://mithaas-cafe-api.onrender.com` |

## Deploy

### 1. Database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add a database user, and under Network Access allow `0.0.0.0/0` so Render can connect.
3. Copy the connection string and add a database name, for example `.../mithaas?retryWrites=true&w=majority`.

### 2. API on Render

1. Click the **Deploy to Render** button above, or in [Render](https://dashboard.render.com) choose **New → Blueprint** and select this repository. Render reads `render.yaml`.
2. Fill in `MONGODB_URI` and `ADMIN_PASSWORD` when asked. `JWT_SECRET` is generated for you. If `MONGODB_URI` is left empty the API starts its own temporary MongoDB, which works but loses data whenever Render restarts the service.
3. After the deploy, open `https://<your-service>.onrender.com/api/health`. It should return `{"ok":true,"database":"connected"}`.

The free plan sleeps after inactivity, so the first request after a while can take up to a minute.

### 3. Website on Vercel

1. In [Vercel](https://vercel.com/new), import this repository. The Vite settings come from `vercel.json`, and `.vercelignore` keeps the server code and `render.yaml` out of the frontend upload.
2. Add the environment variable `VITE_API_URL` with your Render URL (no trailing slash).
3. Deploy. If your Vercel address does not start with `mithaas-cafe` or `cafe-management`, add it to `CLIENT_ORIGIN` on Render.

## Production on a single server

```bash
npm run build
npm start
```

The Node server then serves both the built website and the API on one port.
