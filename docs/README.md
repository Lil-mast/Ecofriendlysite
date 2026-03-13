# EcoNexus

An innovative platform dedicated to promoting sustainability through carbon footprint tracking and eco-friendly practices.

## Description

The EcoFriendlySite is designed to help individuals and organizations monitor and reduce their environmental impact. By calculating carbon footprints based on various activities, the platform provides insights and recommendations to foster a more sustainable lifestyle.

## Features

- **Carbon Footprint Calculator**: Estimate your carbon emissions from daily activities such as transportation, energy usage, and consumption.
- **Sustainability Tracking**: Monitor progress towards eco-friendly goals with personalized dashboards.
- **Carbon Credit Marketplace**: Buy and sell verified carbon credits to offset emissions and support environmental projects.
- **Eco-Friendly E-Commerce**: Integrated payment system powered by Stripe for secure carbon credit transactions.
- **Educational Resources**: Access tips, articles, and tools to learn more about sustainable living.
- **Community Engagement**: Connect with like-minded individuals and share experiences.
- **Geospatial Analysis**: Identify emission hotspots and analyze regional environmental impact.

## Technologies Used

### Frontend
- **React 18**: Progressive Web Application framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component library
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Primary database for structured data
- **MongoDB**: NoSQL database for flexible data storage
- **Redis**: Caching and session management
- **GraphQL**: API query language and runtime

### AI & Machine Learning
- **Python**: Primary ML development language
- **TensorFlow/PyTorch**: Deep learning frameworks
- **Scikit-learn**: Machine learning library
- **Jupyter**: Data science notebooks
- **MLflow**: ML lifecycle management

### Payment & Commerce
- **Stripe**: Payment processing and secure transactions
- **Webhooks**: Real-time payment notifications


### DevOps & Infrastructure(yet to be implemented)
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **AWS/GCP**: Cloud infrastructure
- **GitHub Actions**: CI/CD pipelines
- **Terraform**: Infrastructure as code

### External APIs & Integrations
- **Satellite Data**: NASA, ESA, and commercial satellite providers
- **Weather Data**: Meteorological services integration
- **Geospatial Services**: HERE API, OpenRouteService API
- **Electricity Map**: Real-time carbon intensity data
- **OpenWeather**: Weather data integration

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecofriendlysite.git
   cd ecofriendlysite
   ```

2. **Install pnpm** (if not already installed)
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Configure environment**  
   Copy `.env.example` to `.env` and set the variables below (cloud services or local).

5. **Run the app** (see [How to run](#how-to-run) below).

## How to run

This project uses **pnpm** as the package manager. All commands assume you are in the project root.

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start the **frontend** only (Vite dev server on http://localhost:3000) |
| `pnpm run dev:server` | Start the **API server** only (Express on http://localhost:3001) |
| `pnpm run dev:all` | Start **both** frontend and API server (concurrently) |
| `pnpm run server` or `pnpm start` | Start only the API server (e.g. for production) |
| `pnpm build` | Build the frontend for production (`dist/`) |
| `pnpm preview` | Preview the production frontend build locally |
| `pnpm lint` | Run ESLint |

**Recommended for local development:** run both frontend and API so the app works end-to-end:

```bash
pnpm run dev:all
```

- Frontend: http://localhost:3000 (Vite proxies `/api` to the backend)
- API: http://localhost:3001/api/v1

If you run only `pnpm dev`, the UI will load but API calls will fail unless the backend is running separately.

## Available Scripts

- `pnpm dev` – Frontend development server (Vite, port 3000)
- `pnpm run dev:server` – Backend API server (Express, port 3001)
- `pnpm run dev:all` – Frontend + backend together
- `pnpm run server` / `pnpm start` – API server only
- `pnpm build` – Build frontend for production
- `pnpm preview` – Preview production build
- `pnpm lint` – ESLint

## Backend & database setup

The backend uses three data stores. Configure them in `.env` as follows.

### 1. MongoDB Atlas (replaces local MongoDB)

- Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com).
- Get the connection string: **Connect → Drivers → Node.js**.
- Set in `.env`:
  ```env
  MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/econexus_carbon?retryWrites=true&w=majority
  ```

### 2. Supabase Postgres (replaces local PostgreSQL)

- Create a project at [Supabase](https://supabase.com).
- In **Project Settings → Database**, copy the **Connection string (URI)** (use the **Connection pooling** string, port **6543**, for the backend).
- Set in `.env`:
  ```env
  DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```
- Run the schema once (Supabase **SQL Editor**): paste and run the contents of `src/models/postgres/schema.sql`.

### 3. Redis – Upstash or other public cache (replaces local Redis)

- Create a Redis database at [Upstash](https://console.upstash.com).
- In the Upstash dashboard, get the **ioredis** URL (TLS).
- Set in `.env`:
  ```env
  REDIS_URL=rediss://default:<password>@<endpoint>.upstash.io:6379
  ```
- If you prefer local Redis, use `REDIS_HOST` and `REDIS_PORT` instead of `REDIS_URL`.

### Other env vars

- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`
- **JWT**: `JWT_SECRET` (min 32 characters)
- **APIs** (optional): `ELECTRICITYMAP_API_KEY`, `HERE_API_KEY`, `ORS_API_KEY`, `OPENWEATHER_API_KEY`

## Development workflow

1. Copy `.env.example` to `.env` and set MongoDB Atlas, Supabase `DATABASE_URL`, and Redis `REDIS_URL` (or local equivalents).
2. Run `pnpm run dev:all` to start frontend and API.
3. Open http://localhost:3000; the frontend will proxy `/api` to the backend on port 3001.

## Deployment

### Frontend Deployment
```bash
pnpm build
```
This creates a `dist/` folder with optimized production assets.

### Backend Deployment
The backend can be deployed to services like Heroku, Railway, or Vercel Functions.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

## Architecture

The platform uses a hybrid database approach:

- **MongoDB**: Stores carbon credits, user profiles, and environmental data
- **PostgreSQL**: Manages orders, transactions, and commerce operations
- **Redis**: (Optional) Caching layer for performance optimization

See [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) for detailed architecture information.

## Usage

### Tracking Your Carbon Footprint
1. Sign up for an account.
2. Input your daily activities to calculate your carbon footprint.
3. View reports and get personalized suggestions for reducing emissions.
4. Explore resources and join community discussions.

### Carbon Credit Marketplace
1. **Buy Carbon Credits**: Purchase verified carbon credits to offset your emissions.
   - Browse available credits from verified environmental projects
   - Secure checkout powered by Stripe
   - Instant credit transfer upon payment
2. **Sell Carbon Credits**: List your carbon credits for other users to purchase.
   - Submit project documentation for verification
   - Set your price and availability
   - Track sales through your dashboard
3. **Track Your Impact**: Monitor your offset progress and environmental contribution.

## Documentation

- [Payment Service Documentation](PAYMENT_SERVICE.md) - Detailed guide on the eco-friendly e-commerce system
- [System Architecture](SYSTEM_ARCHITECTURE.md) - Platform infrastructure overview
- [Geospatial Features](GEOSPATIAL.md) - How geospatial works: hubs, routes, hotspots, insights, and API
- [Deploy on Cloudflare](DEPLOY_CLOUDFLARE.md) - Deploy frontend to Cloudflare Pages and backend to Railway/Render/Fly

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and test thoroughly.
4. Submit a pull request with a clear description.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [Tazma](mailto:contact@tazma.com).
