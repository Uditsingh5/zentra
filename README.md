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

## Deploy frontend on Vercel

Zentra uses **Socket.IO** and a long-lived Node server, so the **backend cannot run on Vercel** (Vercel is serverless). Deploy the **frontend (client)** on Vercel and the **backend** on a Node host (e.g. Railway, Render).

### Step 1: Deploy the backend first (Railway / Render / similar)

1. Push your code to GitHub (no `.env`; use the host’s env vars).
2. Create a new project on [Railway](https://railway.app) or [Render](https://render.com).
3. Connect the repo and set the **root directory** to `server` (or the folder that contains `server.js`).
4. Set **Build command** (if any): `npm install`.
5. Set **Start command**: `npm start` or `node server.js`.
6. Add **Environment Variables** (same as `server/.env`):
   - `NODE_ENV` = `production`
   - `PORT` = (often auto-set by the host)
   - `CLIENT_ORIGIN` = `https://your-app.vercel.app` (use your Vercel URL after Step 2, then update this)
   - `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (if you use uploads)
7. Deploy and copy the **backend URL** (e.g. `https://your-api.railway.app` or `https://your-app.onrender.com`).

### Step 2: Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project** and import your GitHub repo.
3. Configure the project:
   - **Root Directory**: click **Edit**, set to `client` (so Vercel builds only the React app).
   - **Framework Preset**: Vite (usually auto-detected).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).
   - **Install Command**: `npm install` (default).
4. Add **Environment Variables** (so the client talks to your backend):
   - `VITE_API_URL` = your backend URL **without** trailing slash (e.g. `https://your-api.railway.app`). The client will call `{VITE_API_URL}/api`.
   - `VITE_SOCKET_URL` = same backend URL (e.g. `https://your-api.railway.app`) for Socket.IO.
5. Click **Deploy**. When it’s done, copy your frontend URL (e.g. `https://zentra.vercel.app`).
6. Go back to your **backend** project (Railway/Render) and set **CLIENT_ORIGIN** to that Vercel URL (e.g. `https://zentra.vercel.app`). Redeploy the backend so CORS allows the frontend.

### Step 3: Check

- Open the Vercel URL; you should see the app and be able to log in and use real-time features (notifications, etc.) via the backend URL you set in Step 2.

---

## Notes

- Default dev ports: frontend **5173** (Vite), backend **8000** (if set in `server/.env`). Adjust **VITE_DEV_API_TARGET** in client if your backend uses another port.
- CORS is driven by **CLIENT_ORIGIN**; set it correctly in production.
- Lint the client from the repo root: `npm run lint --prefix client`.
