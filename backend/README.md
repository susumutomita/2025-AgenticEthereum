# Backend Service for CryptoDailyBrief

This TypeScript-based Express backend service manages communication with multiple external APIs including Autonome, The Graph, Twitter, and YouTube. It provides RESTful and GraphQL endpoints for the frontend, handles wallet data aggregation, and includes comprehensive test coverage with Jest.

## Table of Contents

- [Backend Service for CryptoDailyBrief](#backend-service-for-cryptodailybrief)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
  - [API Documentation](#api-documentation)
    - [REST Endpoints](#rest-endpoints)
      - [1. Portfolio Analysis](#1-portfolio-analysis)
      - [2. Social Media Feeds](#2-social-media-feeds)
      - [3. NFT Operations](#3-nft-operations)
    - [GraphQL Schema](#graphql-schema)
  - [Testing](#testing)
  - [Logging](#logging)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **TypeScript & Express.js**: Fully typed REST API and GraphQL server
- **The Graph Integration**: Efficient blockchain data querying
- **Social Media APIs**: Twitter and YouTube feed integration
- **Autonome Integration**: AI-powered analysis and recommendations
- **ERC1155 Support**: NFT tracking and management
- **Jest Testing**: Comprehensive test coverage
- **Swagger UI**: Interactive REST API documentation
- **GraphQL Playground**: Interactive GraphQL documentation

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- API keys for various services (see Configuration)

---

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the TypeScript code**:
   ```bash
   npm run build
   ```

---

## Configuration

Create a `.env` file using `.env.example` as a template:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Autonome Configuration
AUTONOME_BASE_URL=https://autonome.alt.technology
AUTONOME_INSTANCE_ID=your-instance-id
AUTONOME_USERNAME=your-username
AUTONOME_PASSWORD=your-password

# The Graph Configuration
GRAPH_API_KEY=your-graph-api-key
GRAPH_ENDPOINT=https://api.thegraph.com/subgraphs/name/your-subgraph

# Social Media APIs
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
YOUTUBE_API_KEY=your-youtube-api-key

# Web3 Configuration
RPC_URL=your-rpc-url
CHAIN_ID=8453  # Base Network
```

| Variable | Description | Default |
|----------|------------|----------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `AUTONOME_*` | Autonome API credentials | Required |
| `GRAPH_*` | The Graph API settings | Required |
| `TWITTER_*` | Twitter API credentials | Required |
| `YOUTUBE_*` | YouTube API key | Required |
| `RPC_URL` | Base Network RPC URL | Required |
| `CHAIN_ID` | Network Chain ID | `8453` |

---

## Running the Server

Development mode with hot-reload:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

---

## API Documentation

### REST Endpoints

#### 1. Portfolio Analysis
`POST /api/v1/portfolio/analyze`

Analyzes a wallet's portfolio using AI and on-chain data.

```json
// Request
{
  "walletAddress": "0x...",
  "timeframe": "1d",
  "includeNFTs": true
}

// Response
{
  "analysis": {
    "portfolio": {
      "totalValue": "10000 USD",
      "tokens": [...],
      "nfts": [...],
      "recommendations": [...]
    }
  }
}
```

#### 2. Social Media Feeds
`GET /api/v1/feeds/twitter`
`GET /api/v1/feeds/youtube`

Fetches relevant crypto content from social media.

```json
// Response
{
  "feeds": [
    {
      "id": "1234567890",
      "content": "...",
      "author": "...",
      "timestamp": "2025-02-09T12:00:00Z"
    }
  ]
}
```

#### 3. NFT Operations
`POST /api/v1/nft/transfer`

Handles ERC1155 token transfers.

```json
// Request
{
  "tokenId": "1",
  "from": "0x...",
  "to": "0x...",
  "amount": "1"
}
```

### GraphQL Schema

```graphql
type Query {
  portfolio(address: String!): Portfolio!
  transactions(
    address: String!
    first: Int = 10
    skip: Int = 0
  ): [Transaction!]!
  nftCollections(owner: String!): [NFTCollection!]!
}

type Portfolio {
  totalValueUSD: Float!
  tokens: [Token!]!
  nfts: [NFT!]!
}

type Transaction {
  id: ID!
  hash: String!
  timestamp: Int!
  value: BigInt!
  from: String!
  to: String!
}

type NFTCollection {
  id: ID!
  name: String!
  tokens: [NFT!]!
}
```

Example query:
```graphql
query GetPortfolio($address: String!) {
  portfolio(address: $address) {
    totalValueUSD
    tokens {
      symbol
      balance
      valueUSD
    }
    nfts {
      tokenId
      collection
      lastTransferPrice
    }
  }
}
```

---

## Testing

Run all tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

Generate GraphQL types:
```bash
npm run codegen
```

---

## Logging

Winston-based structured logging:

- Request/response tracing
- Performance metrics
- Error tracking
- Security events

Log files:
```
logs/
  ├── error.log     # Error-level logs
  ├── combined.log  # All logs
  ├── graphql.log   # GraphQL queries
  └── requests.log  # HTTP requests
```

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE)
