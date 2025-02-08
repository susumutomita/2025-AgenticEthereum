![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/susumutomita/2025-AgenticEthereum)
![GitHub top language](https://img.shields.io/github/languages/top/susumutomita/2025-AgenticEthereum)
![GitHub pull requests](https://img.shields.io/github/issues-pr/susumutomita/2025-AgenticEthereum)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/susumutomita/2025-AgenticEthereum)
![GitHub repo size](https://img.shields.io/github/repo-size/susumutomita/2025-AgenticEthereum)
[![CI](https://img.shields.io/github/actions/workflow/status/susumutomita/2025-AgenticEthereum/ci.yml?branch=main)](https://github.com/susumutomita/2025-AgenticEthereum/actions/workflows/ci.yml)

# CryptoDailyBrief – Daily Personalized Crypto Insights

CryptoDailyBrief is a comprehensive platform that delivers daily, personalized crypto asset insights to help investors optimize their portfolios, manage risk, and plan tax actions. The project comprises four main components: **AI agents** powered by Autonome and Agent Kit working on Base Network. The system aggregates on-chain wallet data (via The Graph) and off-chain market sentiment and economic indicators to generate actionable recommendations through AI agents.

## Table of Contents

- [CryptoDailyBrief – Daily Personalized Crypto Insights](#cryptodailybrief--daily-personalized-crypto-insights)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture \& Technologies](#architecture--technologies)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup Steps](#setup-steps)
  - [Usage](#usage)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Future Enhancements](#future-enhancements)
  - [Contributing](#contributing)
  - [License](#license)
  - [Team](#team)

## Features

- **Daily Personalized Briefing:**
  Get a tailored daily report including portfolio performance, risk management tips, rebalancing recommendations, and tax optimization insights.

- **Real-Time Data Aggregation:**
  Aggregates wallet data (transactions, balances) via The Graph and enriches it with market sentiment, economic indicators, and relevant news through open APIs.

- **AI-Powered Insights:**
  AI agents built with Autonome analyze historical and real-time data to generate specific action items, such as "rebalance portfolio" or "consider tax-loss harvesting."

- **Interactive Dashboard:**
  A user-friendly Next.js dashboard displays dynamic charts (via Chart.js/D3.js), graphs, and real-time notifications.

- **Smart Contract Automation:**
  Implements smart contracts (written in Solidity using Foundry) for features like automated token actions, reward issuance, and transaction verification on testnets.

- **Enhanced Security:**
  Integrates Lit Protocol for decentralized authentication and secure management of sensitive data, ensuring robust security with user-friendly design.

## Architecture & Technologies

- **Frontend:**
  - Next.js (App Router) with TypeScript
  - React, Chart.js, Axios, Socket.IO for real-time updates
  - TailwindCSS for styling
  - Hosted on Vercel

- **Backend:**
  - Node.js & Express for REST API
  - TypeScript for type safety
  - Axios for HTTP requests, Socket.IO for real-time communication
  - Jest for testing
  - Hosted as a Vercel Serverless Function or on an alternative platform (e.g., Render) if needed

- **AI Agent:**
  - Autonome for building and managing AI agents
  - Docker for containerization
  - TypeScript implementation
  - Sophisticated logging and monitoring
  - Configurable through environment variables

- **Blockchain & Smart Contracts:**
  - The Graph for querying on-chain wallet data
  - Solidity smart contracts developed with Foundry
  - OpenZeppelin contracts for security and standards
  - Smart contract interactions integrated with the backend API

- **AI & Security:**
  - Autonome for building AI agents that generate personalized insights
  - Lit Protocol for secure, decentralized authentication

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (for running AI agents)
- [Foundry](https://book.getfoundry.sh/) (for smart contract development)
- A code editor (e.g., VSCode)

### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/2025-AgenticEthereum.git
   cd 2025-AgenticEthereum
   ```

2. **Install Dependencies for All Components:**
   The project uses a Makefile to streamline commands. From the repository root, run:
   ```bash
   make install
   ```

3. **Configure Environment Variables:**
   Create necessary `.env` files in the **backend**, **agent**, and **contracts** directories with required API keys and configuration.

## Usage

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the AI Agent:**
   ```bash
   cd agent
   docker-compose up
   ```

3. **Start the Frontend App:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the Dashboard:**
   Open your browser at `http://localhost:3000` to see your personalized crypto insights dashboard.

## Development

- **Real-Time Data Integration:**
  The backend uses The Graph API to fetch blockchain data and Socket.IO for real-time communication. The frontend displays this data dynamically via an interactive dashboard.

- **AI Agent Implementation:**
  AI agents analyze your wallet and market data to generate personalized recommendations. The agents run in Docker containers and communicate with the backend via a defined API.

- **Smart Contract Interaction:**
  Smart contracts manage automated actions (like token rewards) and are developed using Foundry. Testing and deployment are managed with Forge.

- **Makefile:**
  Use the provided Makefile to run common tasks:

  ```makefile
  install:              # Install dependencies for all components
      npm install
      cd frontend && npm install
      cd backend && npm install
      cd agent && npm install

  dev:                 # Start development servers
      make -j4 dev_frontend dev_backend dev_agent

  build:               # Build all components
      make build_frontend build_backend build_agent

  test:                # Run all tests
      make test_frontend test_backend test_contract

  clean:               # Clean build artifacts
      rm -rf **/dist **/build **/.next
  ```

## Deployment

- **Frontend:**
  Deployed on Vercel for fast and scalable hosting.

- **Backend:**
  Can be deployed on Vercel using Serverless Functions or an alternative such as Render for persistent services.

- **AI Agent:**
  Deployed using Docker containers, either on a cloud provider or dedicated server.

- **Smart Contracts:**
  Deployed on testnets (e.g., Sepolia) using Foundry. Future production deployment can be considered based on project maturity.

## Future Enhancements

- **Enhanced AI Models:**
  Integrate advanced machine learning for more precise investment and risk management recommendations.

- **Expanded Data Sources:**
  Incorporate additional data from DeFi protocols, broader market sentiment APIs, and health/expenditure data.

- **Mobile App Development:**
  Develop a mobile version for more accessible daily insights and notifications.

- **e-Tax Integration:**
  Extend functionality to include automated tax reporting based on user transactions.

## Contributing

Contributions are welcome To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to your branch: `git push origin feature-branch`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Team

- **Susumu Tomita** – Full Stack Developer
  [Personal Website](https://susumutomita.netlify.app/)
