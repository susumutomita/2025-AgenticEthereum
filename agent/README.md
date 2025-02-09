# CryptoDailyBrief AI Agent

This directory contains the AI agent implementation for CryptoDailyBrief, powered by Autonome. The agent analyzes crypto portfolios, market trends, and provides personalized insights through natural language interaction, with support for ERC1155 tokens and The Graph protocol integration.

## Features

- **Portfolio Analysis**:
  - Wallet content and transaction history analysis
  - ERC1155 token tracking and management
  - Multi-chain support via custom wallet providers

- **Market Intelligence**:
  - Real-time market trend analysis
  - Social sentiment aggregation
  - Price movement predictions
  - Volume and liquidity monitoring

- **The Graph Integration**:
  - Custom subgraph queries
  - Real-time blockchain data indexing
  - Historical transaction analysis
  - Token transfer tracking

- **AI Capabilities**:
  - Multi-LLM support (OpenAI, GROQ, Ollama)
  - Natural language portfolio insights
  - Automated trading suggestions
  - Risk assessment and management

## Prerequisites

### System Requirements

- Node.js v18 or higher
- Docker and Docker Compose
- Git

### API Keys & Configuration

Required environment variables:

#### Core Settings
```env
# Operation Mode
MODE=server  # or 'cli' for command line interface
PORT=3002    # defaults to 3002

# Chain Configuration
NETWORK=base    # or 'base-sepolia' for testnet
RPC_URL=your_rpc_url
CHAIN_ID=8453   # Base Network
```

#### AI Provider Settings (choose one)
```env
# OpenAI Configuration
OPENAI_API_KEY=your_key_here
API_TARGET=openai

# Or GROQ Configuration
GROQ_API_KEY=your_key_here
GROQ_MODEL=mixtral-8x7b-32768
API_TARGET=groq

# Or Ollama Configuration
OLLAMA_MODEL=llama2:latest
OLLAMA_ENDPOINT=http://localhost:11434
API_TARGET=ollama
```

#### Blockchain Integration
```env
# The Graph Configuration
GRAPH_API_KEY=your_key_here
GRAPH_ENDPOINT=https://api.studio.thegraph.com/query/[your-id]/cryptodailybrief/version/latest

# Wallet Configuration
WALLET_PRIVATE_KEY=your_private_key  # For automated operations
WALLET_PROVIDER=evm                  # Available: evm, hardware
```

#### Autonome Integration
```env
AUTONOME_BASE_URL=https://autonome.alt.technology
AUTONOME_INSTANCE_ID=your_instance_id
AUTONOME_USERNAME=your_username
AUTONOME_PASSWORD=your_password
```

## Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build the TypeScript Code:**
   ```bash
   npm run build
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Running the Agent

### Using Docker Compose (Recommended)

1. **Start the Agent:**
   ```bash
   docker-compose up -d
   ```

2. **View Logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the Agent:**
   ```bash
   docker-compose down
   ```

### Manual Start

1. **Development Mode:**
   ```bash
   npm run dev
   ```

2. **Production Mode:**
   ```bash
   npm start
   ```

## API Endpoints

When running in server mode (MODE=server):

### Chat Interface

`POST /chat`
```json
{
  "message": "Analyze my portfolio",
  "walletAddress": "0x...",
  "options": {
    "detailed": true,
    "timeframe": "1m",
    "includeNFTs": true
  }
}
```

### Wallet Operations

`POST /wallet/transfer`
```json
{
  "tokenType": "ERC1155",
  "tokenAddress": "0x...",
  "tokenId": "1",
  "to": "0x...",
  "amount": "1"
}
```

`GET /wallet/nfts/:address`
```json
{
  "collections": [
    {
      "address": "0x...",
      "name": "Collection Name",
      "tokens": [
        {
          "id": "1",
          "balance": "1",
          "metadata": {
            "name": "Token Name",
            "image": "ipfs://..."
          }
        }
      ]
    }
  ]
}
```

### The Graph Queries

`POST /query/subgraph`
```graphql
query UserTransactions($address: String!) {
  account(id: $address) {
    tokens {
      id
      balance
      transfers {
        timestamp
        amount
      }
    }
  }
}
```

## Tools and Providers

### Wallet Providers

- **EVMWalletProvider**: Standard EVM wallet operations
- **HardwareWalletProvider**: Ledger/Trezor support
- **CustomWalletProvider**: Extensible base class

### Action Providers

- **TheGraphActionProvider**: Subgraph interaction
- **ERC1155ActionProvider**: NFT operations
- **MarketActionProvider**: Price and volume data

## Docker Configuration

Production-ready container setup:

- `Dockerfile`: Multi-stage build
- `docker-compose.yml`: Service definition
- `docker-compose-image.yml`: Pre-built deployment

### Custom Build

```bash
# Build
make build

# Push to registry
make push DOCKER_USERNAME=your-username

# Run with custom config
make run ENV_FILE=.env.production
```

## Logging

Structured logging system:

- Request/response tracing
- Performance metrics
- Error tracking
- Log rotation

Files:
```
logs/
  ├── error.log
  ├── combined.log
  ├── wallet.log
  └── graph.log
```

## Testing

```bash
# Full test suite
npm test

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE)
