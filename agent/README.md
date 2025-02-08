# CryptoDailyBrief AI Agent

This directory contains the AI agent implementation for CryptoDailyBrief, powered by Autonome. The agent analyzes crypto portfolios, market trends, and provides personalized insights and recommendations through natural language interaction.

## Features

- **Portfolio Analysis**: Analyzes wallet contents and transaction history
- **Market Insights**: Tracks market trends and sentiment
- **Tax Planning**: Provides tax optimization suggestions
- **Risk Management**: Monitors portfolio risk levels and suggests adjustments
- **Multi-LLM Support**: Compatible with OpenAI, GROQ, and Ollama
- **Docker Deployment**: Containerized for easy deployment and scaling

## Prerequisites

### System Requirements

- Node.js v18 or higher
- Docker and Docker Compose
- Git

### API Keys & Configuration

Required environment variables:

#### Core Settings
```env
# Operation Mode (required)
MODE=server  # or 'cli' for command line interface

# Port Configuration (optional)
PORT=3002    # defaults to 3002
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

- `POST /chat`
  - Request body:
    ```json
    {
      "message": "Analyze my portfolio",
      "walletAddress": "0x...",
      "options": {
        "detailed": true,
        "timeframe": "1m"
      }
    }
    ```
  - Response:
    ```json
    {
      "analysis": {
        "summary": "Your portfolio overview...",
        "recommendations": [
          {
            "type": "REBALANCE",
            "description": "Consider reducing ETH exposure..."
          }
        ]
      }
    }
    ```

## Docker Configuration

The agent includes a production-ready Dockerfile and docker-compose configuration:

- `Dockerfile`: Multi-stage build for minimal image size
- `docker-compose.yml`: Service definition with proper networking
- `docker-compose-image.yml`: Pre-built image deployment

### Building Custom Images

```bash
# Build the image
make build

# Push to registry
make push DOCKER_USERNAME=your-username

# Run with custom configuration
make run ENV_FILE=.env.production
```

## Logging

The agent uses a structured logging system:

- **Request/Response Logging**: All interactions are logged
- **Performance Metrics**: Response times and API latencies
- **Error Tracking**: Detailed error information with stack traces
- **Log Rotation**: Automatic log file management

Log files are stored in:
```
logs/
  ├── error.log
  ├── combined.log
  └── api.log
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
