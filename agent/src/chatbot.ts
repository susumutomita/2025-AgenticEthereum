import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import logger from "./logger";

dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// --- Swagger Setup ---
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Agent API",
    version: "1.0.0",
    description: "API documentation for the Coinbase AgentKit based service",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
    },
  ],
};
const swaggerOptions = {
  swaggerDefinition,
  apis: [__filename],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Chat with the agent
 *     description: Sends a text message to the agent and returns its response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Hello, Agent!"
 *     responses:
 *       200:
 *         description: Agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   example: "This is the agent's response."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
async function startAgentServer() {
  logger.info("Starting Agent API server...");
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`, { body: req.body });
    next();
  });

  app.post("/message", (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        logger.warn("Invalid request received", { body: req.body });
        return res
          .status(400)
          .json({ error: "Invalid request: 'text' field is required." });
      }

      logger.info("Processing chat request", { text });
      try {
        const { agent, config } = await initializeAgent();
        const stream = await agent.stream(
          { messages: [new HumanMessage(text)] },
          config,
        );
        let fullResponse = "";
        for await (const chunk of stream) {
          if (
            "agent" in chunk &&
            chunk.agent.messages &&
            chunk.agent.messages[0]
          ) {
            fullResponse += chunk.agent.messages[0].content;
          }
        }
        logger.info("Agent response", { response: fullResponse });
        res.json({ text: fullResponse });
      } catch (error) {
        logger.error("Error processing chat request", { error });
        next(error);
      }
    })().catch(next);
  });

  app.get("/healthz", (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      logger.info(`Received POST request on /healthz`, { body: req.body });

      if (req.body && req.body.message === "healthz") {
        logger.info("Health check passed.");
        return res.status(200).json({ status: "ok" });
      }
    })().catch(next);
  });


  app.post("/healthz", (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      logger.info(`Received POST request on /healthz`, { body: req.body });

      if (req.body && req.body.message === "healthz") {
        logger.info("Health check passed.");
        return res.status(200).json({ status: "ok" });
      }
    })().catch(next);
  });

  app.listen(port, () => {
    logger.info(`Agent API server is listening on port ${port}`);
    logger.info(`Swagger UI available at http://localhost:${port}/api-docs`);
  });
}

function validateEnvironment(): void {
  logger.info("Validating environment variables...");
  const missingVars: string[] = [];
  const requiredVars = ["CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  if (
    process.env.API_TARGET !== "ollama" &&
    process.env.API_TARGET !== "groq" &&
    !process.env.OPENAI_API_KEY
  ) {
    missingVars.push("OPENAI_API_KEY or set API_TARGET to 'ollama' or 'groq'");
  }
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  if (missingVars.length > 0) {
    logger.error("Missing required environment variables", { missingVars });
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
  if (!process.env.NETWORK_ID) {
    logger.warn("NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
  logger.info("Environment validation completed");
}

validateEnvironment();

const WALLET_DATA_FILE = "wallet_data.txt";

async function initializeAgent() {
  logger.info("Initializing agent...");
  try {
    let llm;
    const target = process.env.API_TARGET || "openai";
    if (target === "groq") {
      llm = new ChatGroq({
        model: process.env.GROQ_MODEL || "llama3-70b-8192",
        apiKey: process.env.GROQ_API_KEY,
      });
      logger.info("Using GROQ as the LLM provider");
    } else if (target === "ollama") {
      llm = new ChatOllama({
        model: process.env.OLLAMA_MODEL || "llama3.1:latest",
        baseUrl: process.env.OLLAMA_ENDPOINT || "http://localhost:11434",
      });
      logger.info("Using Ollama as the LLM provider");
    } else {
      llm = new ChatOpenAI({
        model: "gpt-4o-mini",
      });
      logger.info("Using OpenAI as the LLM provider");
    }

    let walletDataStr: string | null = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
        logger.info("Successfully read wallet data from file");
      } catch (error) {
        logger.error("Error reading wallet data file", { error });
      }
    }

    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      ),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);
    logger.info("Wallet provider configured successfully");

    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n",
          ),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n",
          ),
        }),
      ],
    });
    logger.info("AgentKit initialized successfully");

    const tools = await getLangChainTools(agentkit);
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request
        funds from the user. Before executing your first action, get the wallet details to see what network
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone
        asks you to do something you can't do with your currently available tools, you must say so, and
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from
        restating your tools' descriptions unless it is explicitly requested.
      `,
    });
    logger.info("Agent created successfully");

    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
    logger.info("Wallet data exported and saved successfully");

    return { agent, config: agentConfig };
  } catch (error) {
    logger.error("Failed to initialize agent", { error });
    throw error;
  }
}

async function runAutonomousMode(agent: any, config: any, interval = 10) {
  logger.info("Starting autonomous mode...");
  while (true) {
    try {
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";
      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config,
      );
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
          logger.info("Agent response received", {
            content: chunk.agent.messages[0].content,
          });
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
          logger.info("Tool response received", {
            content: chunk.tools.messages[0].content,
          });
        }
        console.log("-------------------");
      }
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      logger.error("Error in autonomous mode", { error });
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

async function runChatMode(agent: any, config: any) {
  logger.info("Starting chat mode...");
  console.log("Starting chat mode... Type 'exit' to end.");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));
  try {
    while (true) {
      const userInput = await question("\nPrompt: ");
      if (userInput.toLowerCase() === "exit") {
        logger.info("Chat mode terminated by user");
        break;
      }
      logger.info("Processing user input", { userInput });
      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config,
      );
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
          logger.info("Agent response received", {
            content: chunk.agent.messages[0].content,
          });
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
          logger.info("Tool response received", {
            content: chunk.tools.messages[0].content,
          });
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    logger.error("Error in chat mode", { error });
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function chooseMode(): Promise<"chat" | "auto"> {
  logger.info("Prompting user to choose mode...");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));
  while (true) {
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");
    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();
    if (choice === "1" || choice === "chat") {
      logger.info("User selected chat mode");
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      logger.info("User selected autonomous mode");
      rl.close();
      return "auto";
    }
    logger.warn("Invalid mode choice", { choice });
    console.log("Invalid choice. Please try again.");
  }
}

async function main() {
  try {
    logger.info("Starting main application...");
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();
    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    logger.error("Fatal error in main", { error });
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  const modeEnv = process.env.MODE?.toLowerCase();
  if (modeEnv === "server") {
    logger.info("Starting in server mode...");
    startAgentServer().catch((error) => {
      logger.error("Failed to start agent server", { error });
      console.error("Failed to start agent server:", error);
      process.exit(1);
    });
  } else {
    logger.info("Starting in CLI mode...");
    main().catch((error) => {
      logger.error("Fatal error in application", { error });
      console.error("Fatal error:", error);
      process.exit(1);
    });
  }
}
