![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/susumutomita/2025-AgenticEthereum)
![GitHub top language](https://img.shields.io/github/languages/top/susumutomita/2025-AgenticEthereum)
![GitHub pull requests](https://img.shields.io/github/issues-pr/susumutomita/2025-AgenticEthereum)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/susumutomita/2025-AgenticEthereum)
![GitHub repo size](https://img.shields.io/github/repo-size/susumutomita/2025-AgenticEthereum)
[![CI](https://github.com/susumutomita/2025-AgenticEthereum/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/susumutomita/2025-AgenticEthereum/actions/workflows/ci.yml)

# CryptoDaily Brief – Daily Personalized Crypto Insights

CryptoDaily Brief is a platform designed to deliver daily, personalized crypto asset insights to help investors optimize their portfolios, manage risk, and plan tax actions—all through a user-friendly dashboard and interactive chat interface. By aggregating on-chain data from users' wallets and off-chain data from market sentiment and economic indicators, our AI agents generate actionable recommendations to guide daily investment decisions.

## Table of Contents

- [CryptoDaily Brief – Daily Personalized Crypto Insights](#cryptodaily-brief--daily-personalized-crypto-insights)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Development](#development)
  - [Future Enhancements](#future-enhancements)
  - [Contributing](#contributing)
  - [License](#license)
  - [Team](#team)

## Features

- **Daily Personalized Briefing:**
  Receive a tailored daily report that includes portfolio performance, risk management tips, investment rebalancing recommendations, and tax optimization insights.

- **Real-Time Data Aggregation:**
  Automatically retrieves wallet data (transactions, balances) via The Graph API and enriches it with external market sentiment, economic indicators, and relevant news using open APIs.

- **AI-Powered Insights:**
  Utilizes AI agents built with Autonome/AgentKit to analyze historical and real-time data, generating specific action items such as “rebalance portfolio” or “consider tax-loss harvesting.”

- **Interactive Dashboard:**
  A user-friendly interface built with React/Next.js displays dynamic charts (using Chart.js or D3.js), graphs, and real-time notifications of daily recommendations.

- **Smart Contract Automation:**
  Implements smart contracts (written in Solidity) on testnets (e.g., Sepolia or Ganache) for features like automated token actions, reward issuance, and transaction verification.

- **Enhanced Security:**
  Integrates Lit Protocol for decentralized authentication and secure management of sensitive data, ensuring a robust security layer without compromising usability.

## Technologies Used

- **Backend:**
  - Node.js & Express for REST API and server-side logic
  - Axios for HTTP requests
  - Socket.IO for real-time communication

- **Blockchain & Data Aggregation:**
  - The Graph for querying blockchain data (transactions, balances)
  - Solidity for smart contract development (using Hardhat/Truffle)

- **AI & Agent Framework:**
  - Autonome/AgentKit for building AI agents that provide personalized insights

- **Frontend:**
  - React or Next.js for building the web dashboard
  - Chart.js / D3.js for data visualization

- **Security:**
  - Lit Protocol for decentralized authentication and secure key management

- **Others:**
  - Open APIs for retrieving market sentiment, economic indicators, and news data

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
- A code editor (e.g., VSCode)
- Metamask (or another wallet) set up for testnet transactions

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cryptodaily-brief.git
   cd cryptodaily-brief
   ```

2. **Setup the backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Setup the frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables:**

   Create a `.env` file in the backend (and/or frontend if needed) with required API keys (The Graph endpoint, wallet keys, etc.).

5. **Run the Backend Server:**

   ```bash
   cd backend
   npm start
   ```

6. **Run the Frontend App:**

   ```bash
   cd ../frontend
   npm start
   ```

## Usage

1. **Access the Dashboard:**
   Open your browser and navigate to `http://localhost:3000` (or the designated port). The dashboard displays your crypto asset summary, daily insights, and actionable recommendations.

2. **Connect Your Wallet:**
   Follow the on-screen instructions to connect your wallet (via MetaMask or other supported wallets). The system will fetch your transaction history and balance data automatically.

3. **Receive Daily Briefing:**
   Every morning, the AI agent will analyze your on-chain and off-chain data and display a personalized briefing with recommendations such as portfolio rebalancing, risk alerts, and tax-saving tips.

4. **Interact via Chatbot:**
   You can also interact with the system using the integrated Telegram (or X) chatbot for real-time inquiries and additional insights.

## Development

- **Real-Time Data Integration:**
  The backend uses The Graph API to fetch blockchain data in real time. Socket.IO is used to push updates to the frontend, ensuring that your dashboard always displays the latest information.

- **AI Agent Implementation:**
  We utilize Autonome/AgentKit for building the AI agent that analyzes data and generates recommendations. The current implementation uses simple rule-based logic, with plans to incorporate machine learning for improved accuracy.

- **Smart Contract Interaction:**
  Smart contracts written in Solidity manage automated actions (e.g., token rewards). The contracts are deployed on a testnet and are integrated with our backend for secure and verifiable operations.

- **Security Considerations:**
  Lit Protocol ensures that user authentication and data privacy are maintained without sacrificing ease of use. All sensitive operations are protected by multi-signature (auto-configured) and other decentralized security measures.

## Future Enhancements

- **Enhanced AI Models:**
  Integrate advanced machine learning models to refine investment and risk management recommendations.

- **Expanded Data Sources:**
  Incorporate additional data sources such as decentralized finance (DeFi) protocols, additional market sentiment APIs, and user health data.

- **Mobile Application:**
  Develop a mobile version for even more accessible daily briefings and notifications.

- **e-Tax Integration:**
  Extend functionality to include automated tax reporting features based on user transactions.

## Contributing

I welcome contributions to improve BlockFeedback. Please fork the repository and submit a pull request with your changes.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Team

- [Susumu Tomita](https://susumutomita.netlify.app/) - Full Stack Developer
