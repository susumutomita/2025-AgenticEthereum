# Chatbot README (English)

Below is an updated README for the CDP AgentKit LangChain Extension Example – Chatbot (TypeScript) project. This README describes the project’s purpose, setup steps, and usage instructions.

```markdown
# CDP AgentKit LangChain Extension Examples - Chatbot (TypeScript)

This example demonstrates an agent setup as a terminal-style chatbot with access to the full set of CDP AgentKit actions. Your AI Agent is empowered to interact onchain using the Coinbase Developer Platform AgentKit.

## What Can Your Chatbot Do?

Ask your chatbot to engage with the Web3 ecosystem! For example:
- "Transfer a portion of your ETH to a random address"
- "What is the price of BTC?"
- "Deploy an NFT that will go super viral!"
- "Deploy an ERC-20 token with total supply 1 billion"

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

### API Keys
You will need the following API keys:
- [CDP API Key](https://portal.cdp.coinbase.com/access/api)
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)

Once obtained, rename the `.env-local` file to `.env` and set the following environment variables:

- `CDP_API_KEY_NAME`
- `CDP_API_KEY_PRIVATE_KEY`
- `OPENAI_API_KEY`
- Optionally, `NETWORK_ID` (defaults to "base-sepolia" if not set)

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

   Create a `.env` file in the project root (or use Replit’s Secrets) with the required API keys.

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

This project includes a Dockerfile to build a lightweight Docker image for production. The image is based on `node:20-alpine` and optimized to reduce size by using multi-stage builds and cleaning up unnecessary files.

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

(Ensure you have a `.env` file with the necessary environment variables, and DOCKER_USERNAME is set in your environment.)

## Deployment on Autonome

For production deployment, we recommend using Autonome:
- **Reliable uptime:** Autonome provides a stable hosting environment.
- **Enhanced performance:** Benefit from optimized infrastructure.
- **Persistent storage:** Ensures your agent’s state is maintained across restarts.

Coinbase currently offers sponsorships to CDP developers for Autonome Core, providing upgraded AI and deployment credits. Contact kevin.leffew@coinbase.com for details.

## Frontend Integration

Once your agent is running, you can integrate it with a frontend. For example, you may use the provided [frontend template](https://replit.com/@alissacrane1/onchain-agent-demo-frontend) to build a user interface that communicates with your agent.
