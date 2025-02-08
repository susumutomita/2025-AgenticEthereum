# CDP AgentKit LangChain Extension Examples - Chatbot (TypeScript)

This example demonstrates a terminal-style chatbot built with the CDP AgentKit and LangChain Extension. Your AI Agent is empowered to interact onchain using the Coinbase Developer Platform AgentKit, and now supports multiple LLM providers via an API target selector.

## What Can Your Chatbot Do?

Ask your chatbot to engage with the Web3 ecosystem! For example:
- "Transfer a portion of your ETH to a random address"
- "What is the price of BTC?"
- "Deploy an NFT that will go super viral!"
- "Deploy an ERC-20 token with a total supply of 1 billion"

## Prerequisites

### Node.js Version
Ensure you have Node.js version 18 or higher installed. Check your version with:

```bash
node --version
```

If you need to install or update Node.js, consider using [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install node
```

### API Keys & LLM Provider Configuration

You will need the following keys and configuration depending on your chosen LLM provider:

- **CDP API Keys:**
  - [CDP API Key](https://portal.cdp.coinbase.com/access/api)
    - `CDP_API_KEY_NAME`
    - `CDP_API_KEY_PRIVATE_KEY`

- **LLM Provider Options:**
  - **OpenAI:**
    - `OPENAI_API_KEY`
  - **GROQ:**
    - `GROQ_API_KEY`
    - Optionally, `GROQ_MODEL`
  - **Ollama:**
    - Set `USE_OLLAMA=true` in your environment, and optionally:
      - `OLLAMA_MODEL` (default: "llama2")
      - `OLLAMA_ENDPOINT` (default: "http://localhost:11434")

In addition, set the environment variable `API_TARGET` to one of the following:
- `openai` (default if not specified)
- `groq`
- `ollama`

Also, optionally set `NETWORK_ID` (defaults to "base-sepolia" if not set).

Once you have your keys, rename the `.env-local` file to `.env` and populate it with the appropriate values. For example:

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
# USE_OLLAMA=true
# OLLAMA_MODEL=llama2
# OLLAMA_ENDPOINT=http://localhost:11434
# API_TARGET=ollama
```

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/2025-AgenticEthereum.git
   cd 2025-AgenticEthereum
   ```

2. **Install Dependencies and Build:**

   From the root directory, run:
   ```bash
   npm install
   npm run build
   ```
   This installs dependencies and builds the project. If you make changes to the core packages, re-run the build command to update the chatbot.

3. **Configure Environment Variables:**

   Create a `.env` file in the project root (or use Replit’s Secrets) with the required API keys and configuration as described above.

## Running the Chatbot

To run the chatbot locally:

1. **Start the Chatbot Server:**

   From the `typescript/examples/langchain-cdp-chatbot` directory (or your project directory), run:

   ```bash
   npm start
   ```

   You will see a prompt to select a mode:
   - **Chat Mode:** For interactive conversation with the agent.
   - **Autonomous Mode:** The agent operates independently, periodically performing onchain actions.

2. **Interacting with the Agent:**

   Follow the on-screen prompts to start a chat session or let the agent run autonomously.

## Docker Deployment

This project includes a Dockerfile to build a lightweight Docker image for production. The image is based on `node:20-alpine` and is optimized to reduce size by using multi-stage builds and cleaning up unnecessary files.

### Build and Run with Docker

- **Build the Docker image:**

  ```bash
  make build
  ```

- **Run the container (ensuring required environment variables are set):**

  ```bash
  make run
  ```

- **Push the image to DockerHub:**

  ```bash
  make push
  ```

(Ensure you have a `.env` file with the necessary environment variables, and `DOCKER_USERNAME` is set in your environment.)

Additionally, to get an interactive shell inside the container for debugging:

```bash
make shell
```

## Deployment on Autonome

For production deployment, we recommend using Autonome:
- **Reliable uptime:** Autonome provides a stable hosting environment.
- **Enhanced performance:** Benefit from optimized infrastructure.
- **Persistent storage:** Ensures your agent’s state is maintained across restarts.

Coinbase currently offers sponsorships to CDP developers for Autonome Core, providing upgraded AI and deployment credits. Contact kevin.leffew@coinbase.com for details.

## Frontend Integration

Once your agent is running, you can integrate it with a frontend. For example, you may use the provided [frontend template](https://replit.com/@alissacrane1/onchain-agent-demo-frontend) to build a user interface that communicates with your agent.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.
