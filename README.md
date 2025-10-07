# zentra
Zentra is an upcoming social media app being built for students to connect, share updates, collaborate in real time, and engage with their campus communities on a secure and user-friendly platform.


---

# 🧰 Monorepo Guide

This project contains both frontend and backend apps in a single repository.

## 📁 Structure

```
/project-root
  ├── .github   # GitHub configs (do not edit.)
  ├── /client   # Frontend (React/Vite/etc.)
  └── /server   # Backend (Node/Express/etc.)
```

---

## 🚀 Start Both Servers

To run **frontend and backend together**, use:

```bash
npm run start
```

> This uses `concurrently` to start both apps in parallel.

Make sure your root `package.json` includes:

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\""
}
```

---

## 🧪 Run Individually

### ▶️ Frontend Only

```bash
cd client
npm run dev
```

### ▶️ Backend Only

```bash
cd server
npm run start
```

Each subproject should have its own `dev` script defined in its `package.json`.

---

## 📦 Install Dependencies

From root:

```bash
npm install
```

Or manually:

```bash
cd client && npm install
cd ../server && npm install
```

---

## 📝 Notes

- Ensure ports don’t conflict (e.g., frontend on `3000`, backend on `5000`)
- Use `.env` files for config
- Backend should support CORS for frontend dev

---