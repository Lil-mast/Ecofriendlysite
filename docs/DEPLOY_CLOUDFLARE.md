# Deploying EcoNexus on Cloudflare

This guide covers how to deploy the EcoNexus app with the **frontend on Cloudflare Pages** and the **backend API** hosted elsewhere (Cloudflare Workers do not run Node/Express, so the API is deployed to a Node-friendly host).

## Architecture Overview

```
                    ┌─────────────────────────────────────┐
                    │         Cloudflare Pages            │
                    │  (React/Vite frontend – static)     │
                    │  your-project.pages.dev            │
                    └─────────────────┬───────────────────┘
                                      │
                                      │ HTTPS (VITE_API_URL)
                                      ▼
                    ┌─────────────────────────────────────┐
                    │  Backend API (Node/Express)         │
                    │  Railway / Render / Fly.io / etc.   │
                    │  api.yourdomain.com                 │
                    └─────────────────────────────────────┘
```

- **Cloudflare Pages** – Serves the built React app (HTML, JS, CSS) from the `dist/` output of Vite.
- **Backend** – Your existing Node/Express API runs on a platform that supports Node (e.g. Railway, Render). The frontend calls it via `VITE_API_URL` at build time.

---

## Prerequisites

- Cloudflare account (free tier is enough for Pages).
- Backend deployed and reachable over HTTPS (see [Deploy the backend API](#deploy-the-backend-api)).
- Git repository (GitHub/GitLab) for the project, or ability to upload a build manually.

---

## Part 1: Deploy the frontend to Cloudflare Pages

### Option A: Connect a Git repository (recommended)

1. **Log in** to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

2. **Select your repo** (e.g. GitHub `yourusername/ecofriendlysite`). Authorize Cloudflare if needed.

3. **Configure the build:**
   - **Framework preset:** None (or “Vite” if available).
   - **Build command:** `pnpm run build` (or `npm run build` if you use npm).
   - **Build output directory:** `dist`
   - **Root directory:** leave blank (or `/` if the repo root is the app).

4. **Environment variables (Build-time):**  
   Add these so the frontend knows where the API lives:
   - **Variable name:** `VITE_API_URL`  
   - **Value:** `https://your-api-url.com` (your backend’s public URL, no trailing slash)  
   - **Environment:** Production (and Preview if you use branch previews).

   If you haven’t deployed the API yet, use a placeholder (e.g. `https://api.example.com`) and change it after the API is live.

5. **Save and Deploy.** Cloudflare will run `pnpm install` (or npm), then `pnpm run build`, and deploy the contents of `dist/`.

6. **Custom domain (optional):** In the Pages project → **Custom domains** → Add e.g. `app.yourdomain.com` and follow the DNS instructions.

### Option B: Direct upload (no Git)

1. **Build locally:**
   ```bash
   pnpm install
   pnpm run build
   ```
   Set `VITE_API_URL` when building, e.g.:
   ```bash
   # Windows (PowerShell)
   $env:VITE_API_URL="https://your-api-url.com"; pnpm run build

   # Windows (CMD)
   set VITE_API_URL=https://your-api-url.com && pnpm run build

   # Linux / macOS
   VITE_API_URL=https://your-api-url.com pnpm run build
   ```

2. In **Workers & Pages** → **Create** → **Pages** → **Upload assets**, create a project and upload the **contents** of the `dist/` folder (not the folder itself).

3. For future updates, rebuild locally and upload again, or switch to Git-based deploys.

### Build and runtime notes

- The app is a **single-page application (SPA)**. All routes (e.g. `/marketplace`, `/calculator`) are handled by the same `index.html`. Cloudflare Pages serves the SPA correctly by default (it returns `index.html` for non-file paths when using the “Single-page application” behavior, which is usually automatic for static uploads).
- If a path like `/marketplace` returns 404, enable **Single-page application** in Pages → **Settings** → **Builds & deployments** (or add a `_redirects` or `_routes` configuration if your plan supports it).

---

## Part 2: Deploy the backend API

The EcoNexus API is a **Node.js Express** server. It does **not** run on Cloudflare Workers (Workers are a different runtime). Deploy it to any host that supports Node:

### Option 1: Railway

1. Go to [railway.app](https://railway.app), sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select your repo.
3. Set **Root Directory** to the repo root (where `package.json` and `src/server.js` are).
4. **Settings:**
   - **Build command:** `pnpm install` (or `npm install`).
   - **Start command:** `node src/server.js` (or `pnpm start`).
   - **Watch paths:** `src/` (so pushes to `src/` trigger redeploys).
5. **Variables:** Add all env vars from your `.env` (e.g. `MONGODB_URI`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, Stripe keys). Do **not** commit `.env` to Git.
6. Railway assigns a URL like `https://your-app.up.railway.app`. Use this as `VITE_API_URL` in the frontend (Cloudflare Pages) and set `FRONTEND_URL` on the API to your Cloudflare Pages URL (e.g. `https://your-project.pages.dev`) for CORS.

### Option 2: Render

1. Go to [render.com](https://render.com), sign in.
2. **New** → **Web Service** → connect the repo.
3. **Build command:** `pnpm install && pnpm run build` (if you have a build step for the server; otherwise `pnpm install`).
4. **Start command:** `node src/server.js` (or `pnpm start`).
5. **Environment:** Add the same variables as in `.env`.
6. Use the generated URL (e.g. `https://your-service.onrender.com`) as `VITE_API_URL` and set `FRONTEND_URL` on the API.

### Option 3: Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and log in.
2. In the repo root, run `fly launch` and follow prompts (choose a region, don’t add a Postgres/Redis yet if you use Atlas/Supabase/Upstash).
3. Add secrets (env vars):  
   `fly secrets set MONGODB_URI="..." DATABASE_URL="..." REDIS_URL="..." JWT_SECRET="..."` (and the rest).
4. **Start command:** Ensure the app starts with `node src/server.js` (e.g. in `package.json` `"start": "node src/server.js"`).
5. Deploy: `fly deploy`. Use the app URL (e.g. `https://your-app.fly.dev`) as `VITE_API_URL` and set `FRONTEND_URL` on the API.

### Option 4: Other hosts

You can use any Node host (e.g. Heroku, DigitalOcean App Platform, a VPS with PM2). Requirements:

- **Node** (e.g. 18+).
- **Start:** `node src/server.js` (or `pnpm start`).
- **Env:** All variables from `.env` (MongoDB Atlas, Supabase `DATABASE_URL`, Redis/Upstash `REDIS_URL`, JWT, Stripe, etc.).
- **CORS:** Set `FRONTEND_URL` to your Cloudflare Pages URL so the API allows requests from the frontend.

---

## Part 3: Wire frontend and API together

1. **Backend env (on Railway/Render/Fly/etc.):**
   - `FRONTEND_URL` = your Cloudflare Pages URL, e.g. `https://your-project.pages.dev` or `https://app.yourdomain.com`.

2. **Frontend build-time env (Cloudflare Pages):**
   - `VITE_API_URL` = your API URL, e.g. `https://your-app.up.railway.app` or `https://api.yourdomain.com`.

3. **Redeploy** the frontend after setting `VITE_API_URL` (so the built JS points to the correct API). No need to redeploy when only the backend URL changes later if you use a single env and rebuild once.

4. **Optional – custom domains:**
   - Frontend: `app.yourdomain.com` → Cloudflare Pages.
   - API: `api.yourdomain.com` → your backend (CNAME or A/AAAA on your DNS, or Cloudflare proxy in front of the API host). Then set `VITE_API_URL=https://api.yourdomain.com` and `FRONTEND_URL=https://app.yourdomain.com`.

---

## Part 4: Cloudflare-specific tips

### CORS

The API’s CORS is configured with `FRONTEND_URL`. Ensure it exactly matches the origin the browser uses (e.g. `https://your-project.pages.dev` or `https://app.yourdomain.com`), including no trailing slash.

### SPA 404s

If visiting a route like `/marketplace` or `/calculator` directly returns 404 on Pages:

- Use **Pages** → **Settings** → **Builds & deployments** and enable **Single-page application** if available, or
- Add a `public/_redirects` (in the repo) with:
  ```
  /*    /index.html   200
  ```
  so all paths fall back to `index.html`. Rebuild and redeploy.

### Proxy the API through Cloudflare (optional)

You can put the API behind Cloudflare (e.g. `api.yourdomain.com`):

1. Add a DNS record: `api` CNAME or A/AAAA to your backend host.
2. Enable the orange cloud (proxy) so traffic goes through Cloudflare (DDoS protection, optional caching).
3. Backend still runs on Railway/Render/Fly; Cloudflare is just the edge. Keep `VITE_API_URL` as `https://api.yourdomain.com`.

### Workers (future)

If you later want to move part of the API logic to **Cloudflare Workers**, you would rewrite those parts in Workers (no Node/Express). The current Express app would need to be split or replaced for Workers. This doc does not cover that migration.

---

## Checklist

- [ ] Backend deployed (Railway/Render/Fly/other) and returning e.g. `GET /api/v1/health` → `{ "status": "ok" }`.
- [ ] Backend env: `FRONTEND_URL`, `MONGODB_URI`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, Stripe keys, etc.
- [ ] Frontend on Cloudflare Pages with build command `pnpm run build`, output `dist`, and `VITE_API_URL` set to the API URL.
- [ ] CORS allows the Pages origin; no mixed-content (use HTTPS for both).
- [ ] SPA routes work (direct visit to `/marketplace` loads the app).
- [ ] Optional: custom domains and/or API behind Cloudflare proxy.

---

## Summary

- **Frontend:** Build with Vite (`pnpm run build`), deploy the `dist/` folder to **Cloudflare Pages** (Git or direct upload). Set `VITE_API_URL` at build time.
- **Backend:** Deploy the Node/Express app to **Railway, Render, Fly.io**, or another Node host. Set `FRONTEND_URL` and all other env vars there.
- **Integration:** Frontend calls the API using `VITE_API_URL`; API allows the frontend origin via CORS. No Cloudflare Workers are required for this setup.

For more on the app’s stack and env vars, see the main [README](README.md) and [.env.example](../.env.example) in the repo root.
