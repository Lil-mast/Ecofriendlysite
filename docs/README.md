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

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecofriendlysite.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ecofriendlysite
   ```

3. Install pnpm (if not already installed):
   ```bash
   npm install -g pnpm
   ```

4. Install dependencies:
   ```bash
   pnpm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values:
     - `STRIPE_SECRET_KEY` - Stripe API secret key
     - `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
     - `MONGODB_URI` - MongoDB connection string
     - `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` - PostgreSQL credentials
     - API keys for: `ELECTRICITYMAP_API_KEY`, `HERE_API_KEY`, `ORS_API_KEY`, `OPENWEATHER_API_KEY`

6. Start the development server:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the project for production
- `pnpm preview` - Preview the production build locally

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

- [Payment Service Documentation](docs/PAYMENT_SERVICE.md) - Detailed guide on the eco-friendly e-commerce system
- [System Architecture](SYSTEM_ARCHITECTURE.md) - Platform infrastructure overview

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
