# Zentra

A social media app for students to connect, share updates, collaborate in real time, and engage with campus communities on a secure, user-friendly platform.

---

## Tech Stack

| Layer   | Stack |
|--------|--------|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Socket.IO client |
| **Backend**  | Node.js, Express 5, MongoDB (Mongoose), Socket.IO, JWT, Cloudinary |
| **Dev**      | ESLint, Nodemon (server), Concurrently (monorepo) |

---

## Project Structure

```
zentra/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── api/     # Axios instance, auth service
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/ # Socket.IO
│   │   └── slices/   # Redux
│   └── vite.config.js
├── server/          # Express backend
│   ├── config/      # DB, Cloudinary
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/    # Auth, sync
│   ├── sockets/     # Real-time events
│   ├── utils/
│   ├── server.js
│   └── .env.example
├── package.json     # Root scripts (dev, build, deploy)
└── README.md
```

---

## Quick Start

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Environment

- Copy `server/.env.example` to `server/.env` and fill in your values (MongoDB, JWT, Cloudinary, etc.).
- Optional for client: copy `client/.env.example` to `client/.env` if you need a custom API/socket URL or dev proxy target.

### 3. Run in development

```bash
npm run start
```

This starts the backend (default port **8000**) and frontend (Vite dev server). Use `npm run client` or `npm run server` to run only one.

---

## Scripts (from root)

| Command | Description |
|---------|-------------|
| `npm run start` | Run backend + frontend in dev (concurrent) |
| `npm run dev`   | Same as `start` |
| `npm run client`| Frontend only (Vite dev) |
| `npm run server`| Backend only (Nodemon) |
| `npm run build` | Build client for production (`client/dist`) |
| `npm run start:prod` | Build client, then start server (single process for production) |

Client-only (from `client/`): `npm run lint`, `npm run preview` (preview production build).

---

## Environment Variables

### Server (`server/.env`)

Use `server/.env.example` as a template. Main variables:

- **PORT** — Server port (e.g. `8000`).
- **NODE_ENV** — `development` or `production`.
- **CLIENT_ORIGIN** — Frontend URL for CORS (e.g. `http://localhost:5173` in dev, `https://yourdomain.com` in prod).
- **MONGO_URI** — MongoDB Atlas connection string.
- **JWT_SECRET**, **JWT_EXPIRES_IN** — Auth.
- **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** — Media uploads (optional).

### Client (optional)

- **VITE_API_URL** — API base URL (no trailing slash). Omit for same-origin (dev proxy / same host in prod).
- **VITE_SOCKET_URL** — Socket.IO server URL. Omit to use current origin.
- **VITE_DEV_API_TARGET** — Dev proxy target (default `http://localhost:3000`; use `http://localhost:8000` if your server runs on 8000).

---

## Deployment

The app is ready to deploy. Use the **same variable names** as in `server/.env`, but set their **values** in your hosting platform’s **Environment Variables** (do not commit `.env`).

### Backend env vars to set in production

- **PORT** (often provided by the host)
- **NODE_ENV** = `production`
- **CLIENT_ORIGIN** = your frontend URL (e.g. `https://yourapp.com`)
- **MONGO_URI**, **JWT_SECRET**, **JWT_EXPIRES_IN**
- **CLOUDINARY_*** if you use image uploads

### Single-server production (recommended)

Build the client and run the server from the repo root:

```bash
npm run start:prod
```

The server serves the built frontend from `client/dist` when `NODE_ENV=production`. Set **NODE_ENV** and **CLIENT_ORIGIN** in the host environment.

### Separate frontend/backend hosts

- Build client: `npm run build`. Deploy `client/dist` to a static host (e.g. Vercel, Netlify).
- Deploy `server/` to a Node host (e.g. Railway, Render). Set **CLIENT_ORIGIN** to the frontend URL.
- In the frontend, set **VITE_API_URL** and **VITE_SOCKET_URL** to the backend URL so the client talks to your API and Socket.IO server.

---

## Notes

- Default dev ports: frontend **5173** (Vite), backend **8000** (if set in `server/.env`). Adjust **VITE_DEV_API_TARGET** in client if your backend uses another port.
- CORS is driven by **CLIENT_ORIGIN**; set it correctly in production.
- Lint the client from the repo root: `npm run lint --prefix client`.
