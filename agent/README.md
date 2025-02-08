# CDP AgentKit LangChain Extension Examples - Chatbot (TypeScript)

This example demonstrates a terminal-style chatbot built with the CDP AgentKit and LangChain Extension. Your AI agent is empowered to perform onchain interactions using the Coinbase Developer Platform AgentKit and supports multiple LLM providers via an API target selector.

In this updated version, you can switch the operation mode using the `MODE` environment variable:
- **MODE=server**: Launches the API server mode with Swagger UI for testing the `/chat` endpoint.
- **MODE=cli** (or if `MODE` is not set): Runs in interactive CLI mode.

## What Can Your Chatbot Do?

Your chatbot can interact with the Web3 ecosystem. For example, you can ask it to:
- "Transfer a portion of your ETH to a random address"
- "What is the price of BTC?"
- "Deploy an NFT that will go super viral!"
- "Deploy an ERC-20 token with a total supply of 1 billion"

When running in API server mode, you can test the `/chat` endpoint using Swagger UI.

## Prerequisites

### Node.js Version
Ensure you have Node.js version 18 or higher installed. You can check your version with:

```bash
node --version
```

If needed, consider using [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install node
```

### API Keys & LLM Provider Configuration

You will need the following keys and configuration, depending on your chosen LLM provider:

- **CDP API Keys:**
  - [CDP API Key](https://portal.cdp.coinbase.com/access/api)
    - `CDP_API_KEY_NAME`
    - `CDP_API_KEY_PRIVATE_KEY`

- **LLM Provider Options:**
  - **OpenAI:**
    - `OPENAI_API_KEY`
  - **GROQ:**
    - `GROQ_API_KEY`
    - (Optional) `GROQ_MODEL`
  - **Ollama:**
    - `OLLAMA_MODEL` (default: "llama3.1:latest")
    - `OLLAMA_ENDPOINT` (default: "http://localhost:11434")

Make sure to set the environment variable `API_TARGET` to one of the following:
- `openai` (default if not specified)
- `groq`
- `ollama`

Additionally, you may set `NETWORK_ID` (defaults to "base-sepolia" if not provided).

Finally, use the environment variable `MODE` to select the operation mode:
- Set `MODE=server` for API server mode (with Swagger UI available).
- Set `MODE=cli` (or leave it unset) to run in interactive CLI mode.

An example `.env` file:

```env
# CDP settings
CDP_API_KEY_NAME=your_cdp_api_key_name_here
CDP_API_KEY_PRIVATE_KEY=your_cdp_api_key_private_key_here
NETWORK_ID=base-sepolia

# LLM settings (choose one set)
# For OpenAI:
OPENAI_API_KEY=your_openai_api_key_here
API_TARGET=openai

# For GROQ:
# GROQ_API_KEY=your_groq_api_key_here
# GROQ_MODEL=default-groq-model
# API_TARGET=groq

# For Ollama:
# OLLAMA_MODEL=llama3.1:latest
# OLLAMA_ENDPOINT=http://localhost:11434
# API_TARGET=ollama

# Mode selection:
# MODE=server  (API server mode with Swagger UI)
# MODE=cli     (Interactive CLI mode)
```

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/2025-AgenticEthereum.git
   cd 2025-AgenticEthereum
   ```

2. **Install Dependencies and Build:**

   From the project root, run:

   ```bash
   npm install
   npm run build
   ```

   This will install all required packages and build the project.

3. **Configure Environment Variables:**

   Create a `.env` file in the project root (or use your preferred secret management) with the required API keys and configuration as described above.

## Running the Chatbot

### API Server Mode (with Swagger UI)

Set the environment variable `MODE=server` and start the application. This will launch the API server and Swagger UI will be available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs):

```bash
# Ensure your .env file contains MODE=server
npm start
```

Use the Swagger UI to send JSON requests to the `/chat` endpoint.

### Interactive CLI Mode

If you set `MODE=cli` or leave `MODE` unset, the chatbot will run in CLI mode:

```bash
# Ensure your .env file contains MODE=cli or is not set
npm start
```

Follow the terminal prompts to interact with the AI agent.

## Docker Deployment

A Dockerfile is included for building a lightweight production image based on `node:20-alpine`. This image uses multi-stage builds and optimizations to minimize size.

### Build and Run with Docker

- **Build the Docker image:**

  ```bash
  make build
  ```

- **Run the container (ensure necessary environment variables are set):**

  ```bash
  make run
  ```

- **Push the image to DockerHub:**

  ```bash
  make push
  ```

(Ensure your environment contains the required API keys and `DOCKER_USERNAME` if pushing images.)

For debugging, you can also open an interactive shell inside the container:

```bash
make shell
```

## Deployment on Autonome

For production deployments, we recommend using Autonome:
- **Reliable uptime:** Autonome provides a stable hosting environment.
- **Enhanced performance:** Benefit from optimized infrastructure.
- **Persistent storage:** Maintain your agent’s state across restarts.

Coinbase offers sponsorships to CDP developers for Autonome Core, including upgraded AI and deployment credits. Contact [kevin.leffew@coinbase.com](mailto:kevin.leffew@coinbase.com) for details.

## Frontend Integration

Once your agent is running, you can integrate it with a frontend. For example, you can use the provided [frontend template](https://replit.com/@alissacrane1/onchain-agent-demo-frontend) as a starting point to build a user interface that communicates with your agent.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.
