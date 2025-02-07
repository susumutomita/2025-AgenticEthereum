![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/susumutomita/2025-AgenticEthereum)
![GitHub top language](https://img.shields.io/github/languages/top/susumutomita/2025-AgenticEthereum)
![GitHub pull requests](https://img.shields.io/github/issues-pr/susumutomita/2025-AgenticEthereum)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/susumutomita/2025-AgenticEthereum)
![GitHub repo size](https://img.shields.io/github/repo-size/susumutomita/2025-AgenticEthereum)
[![CI](https://img.shields.io/github/actions/workflow/status/susumutomita/2025-AgenticEthereum/ci.yml?branch=main)](https://github.com/susumutomita/2025-AgenticEthereum/actions/workflows/ci.yml)

# CryptoDailyBrief – Daily Personalized Crypto Insights

CryptoDailyBrief is a comprehensive platform that delivers daily, personalized crypto asset insights to help investors optimize their portfolios, manage risk, and plan tax actions. Built as a monorepo, the project comprises three main components: a **frontend** built with Next.js, a **backend** (Node.js/Express) API, and **smart contracts** developed with Foundry. The system aggregates on-chain wallet data (via The Graph) and off-chain market sentiment and economic indicators to generate actionable recommendations through AI agents.

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
  AI agents built with Autonome/AgentKit analyze historical and real-time data to generate specific action items, such as “rebalance portfolio” or “consider tax-loss harvesting.”

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
  - Hosted on Vercel

- **Backend:**
  - Node.js & Express for REST API
  - Axios for HTTP requests, Socket.IO for real-time communication
  - Hosted as a Vercel Serverless Function or on an alternative platform (e.g., Render) if needed

- **Blockchain & Smart Contracts:**
  - The Graph for querying on-chain wallet data
  - Solidity smart contracts developed with Foundry (Foundry, Forge)
  - Smart contract interactions integrated with the backend API

- **AI & Security:**
  - Autonome/AgentKit for building AI agents that generate personalized insights
  - Lit Protocol for secure, decentralized authentication

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
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
   This will install npm packages for the frontend and backend. For the contracts, ensure Foundry is installed and run:
   ```bash
   cd contracts && forge install
   ```

3. **Configure Environment Variables:**
   Create necessary `.env` files in the **backend** and **contracts** directories (if needed) with required API keys and configuration (e.g., The Graph endpoint, wallet keys, etc.).

## Usage

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
2. **Start the Frontend App:**
   ```bash
   cd frontend
   npm start
   ```
3. **Access the Dashboard:**
   Open your browser at `http://localhost:3000` to see your personalized crypto insights dashboard.

## Development

- **Real-Time Data Integration:**
  The backend uses The Graph API to fetch blockchain data and Socket.IO for real-time communication. The frontend displays this data dynamically via an interactive dashboard.

- **AI Agent Implementation:**
  AI agents analyze your wallet and market data to generate personalized recommendations.

- **Smart Contract Interaction:**
  Smart contracts manage automated actions (like token rewards) and are developed using Foundry. Testing and deployment are managed with Forge.

- **Makefile:**
  Use the provided Makefile to run common tasks:

  ```makefile
  install:           # Install npm packages for frontend and backend
      npm install

  build_frontend:    # Build the Next.js frontend
      cd frontend && npm run build

  build_backend:     # Build backend (if applicable)
      cd backend && npm run build

  test:              # Run tests for frontend and backend
      make test_frontend
      make test_backend

  test_frontend:
      cd frontend && npm run test

  test_backend:
      cd backend && npm run test
  ```

## Deployment

- **Frontend:**
  Deployed on Vercel for fast and scalable hosting.

- **Backend:**
  Can be deployed on Vercel using Serverless Functions or an alternative such as Render for persistent services.

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
