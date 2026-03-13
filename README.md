# EcoNexus

Carbon footprint tracking and carbon credit marketplace platform.

## Quick start

1. **Install dependencies** (uses [pnpm](https://pnpm.io))
   ```bash
   corepack enable && corepack prepare pnpm@latest --activate
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - **MongoDB Atlas**: `MONGODB_URI`
   - **Supabase**: `DATABASE_URL`
   - **Redis (e.g. Upstash)**: `REDIS_URL`
   - Plus `JWT_SECRET`, Stripe keys, and optional API keys (see `.env.example`).

3. **Run the app**
   ```bash
   pnpm run dev:all
   ```
   - Frontend: http://localhost:3000  
   - API: http://localhost:3001/api/v1  

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Frontend only (Vite) |
| `pnpm run dev:server` | API server only |
| `pnpm run dev:all` | Frontend + API (recommended) |
| `pnpm build` | Build frontend for production |
| `pnpm lint` | Run ESLint |

## Documentation

Full setup (MongoDB Atlas, Supabase Postgres, Upstash Redis), architecture, and usage: **[docs/README.md](docs/README.md)**.

- **[Geospatial](docs/GEOSPATIAL.md)** – How geo works (nearby hubs, route emissions, hotspots, check-ins).
- **[Deploy on Cloudflare](docs/DEPLOY_CLOUDFLARE.md)** – Frontend on Cloudflare Pages, API on Railway/Render/Fly.

## Tech stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI  
- **Backend**: Node.js, Express  
- **Data**: MongoDB Atlas, Supabase (PostgreSQL), Redis (Upstash)  
- **Payments**: Stripe  
