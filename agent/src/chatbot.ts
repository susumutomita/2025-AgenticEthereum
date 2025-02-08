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

dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// Swagger 定義の設定
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Agent API",
    version: "1.0.0",
    description: "Coinbase AgentKit を利用した API のドキュメント",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
    },
  ],
};
const swaggerOptions = {
  swaggerDefinition,
  // このファイル内の Swagger アノテーションを読み込みます
  apis: [__filename],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: エージェントとのチャット
 *     description: ユーザーのテキストをエージェントに送信し、応答を受け取ります。
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
 *         description: エージェントの応答を含むオブジェクト
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   example: "This is the agent's response."
 *       400:
 *         description: リクエストが不正
 *       500:
 *         description: 内部サーバーエラー
 */
async function startAgentServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // JSON ボディをパースするミドルウェア
  app.use(bodyParser.json());

  // Swagger UI のエンドポイント (/api-docs) を追加
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // /chat エンドポイントの実装
  app.post("/chat", (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res
          .status(400)
          .json({ error: "Invalid request: 'text' field is required." });
      }

      // エージェントを初期化（実運用時はキャッシュするなど工夫してください）
      const { agent, config } = await initializeAgent();

      // ユーザーのメッセージをエージェントへ渡し、ストリーミング応答を取得
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
      res.json({ text: fullResponse });
    })().catch(next);
  });

  app.listen(port, () => {
    console.log(`Agent API server is listening on port ${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  });
}

function validateEnvironment(): void {
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
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
  if (!process.env.NETWORK_ID) {
    console.warn(
      "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet",
    );
  }
}

validateEnvironment();

const WALLET_DATA_FILE = "wallet_data.txt";

async function initializeAgent() {
  try {
    // LLM の初期化：環境変数 API_TARGET によって使用するプロバイダーを切り替え
    let llm;
    const target = process.env.API_TARGET || "openai";
    if (target === "groq") {
      llm = new ChatGroq({
        model: process.env.GROQ_MODEL || "llama3-70b-8192",
        apiKey: process.env.GROQ_API_KEY,
      });
      console.log("Using GROQ as the LLM provider.");
    } else if (target === "ollama") {
      llm = new ChatOllama({
        model: process.env.OLLAMA_MODEL || "llama3.1:latest",
        baseUrl: process.env.OLLAMA_ENDPOINT || "http://localhost:11434",
      });
      console.log("Using Ollama as the LLM provider.");
    } else {
      llm = new ChatOpenAI({
        model: "gpt-4o-mini",
      });
      console.log("Using OpenAI as the LLM provider.");
    }

    let walletDataStr: string | null = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
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

    // エージェントのウォレットデータをエクスポートし、ファイルに保存
    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");
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
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

async function runChatMode(agent: any, config: any) {
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
        break;
      }
      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config,
      );
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function chooseMode(): Promise<"chat" | "auto"> {
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
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      rl.close();
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}

async function main() {
  try {
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();
    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

/*
  MODE 環境変数で動作モードを切り替えます:
    - MODE=server なら API サーバーモード（Swagger UI 経由で /chat エンドポイントをテスト可）
    - MODE=cli    なら CLI モードで対話
  MODE が設定されていない場合はデフォルトで CLI モードになります。
*/
if (require.main === module) {
  const modeEnv = process.env.MODE?.toLowerCase();
  if (modeEnv === "server") {
    console.log("Starting Agent API server...");
    startAgentServer().catch((error) => {
      console.error("Failed to start agent server:", error);
      process.exit(1);
    });
  } else {
    console.log("Starting Agent in CLI mode...");
    main().catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
  }
}
