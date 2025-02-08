import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { autonomeService } from "./services/autonomeService";
import logger from "./logger";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

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
      url: `http://localhost:${port}`,
    },
  ],
};
const swaggerOptions = {
  swaggerDefinition,
  apis: [__filename],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/v1/message:
 *   post:
 *     summary: Send a message to the Autonome agent via a flexible payload.
 *     description: |
 *       Sends a message to Autonome. The request payload can include:
 *         - text: the message to send (required)
 *         - autonome: (optional) an object containing:
 *             - baseUrl: Autonome base URL
 *             - instanceId: Autonome instance ID
 *             - username: Autonome username
 *             - password: Autonome password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, Agent!"
 *               autonome:
 *                 type: object
 *                 properties:
 *                   baseUrl:
 *                     type: string
 *                     example: "https://autonome.alt.technology"
 *                   instanceId:
 *                     type: string
 *                     example: "your-instance-id"
 *                   username:
 *                     type: string
 *                     example: "your-username"
 *                   password:
 *                     type: string
 *                     example: "your-password"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agentId:
 *                   type: string
 *                 messageResult:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Message sending failed
 */
app.post("/api/v1/message", async (req, res) => {
  const { message, agentId, autonome } = req.body;

  // Log the incoming request body
  logger.info("[POST /api/v1/message] Incoming request body:", req.body);

  if (!message) {
    return res.status(400).json({ error: "text field is required" });
  }

  try {
    const messageResult = await autonomeService.sendMessage({
      message,
      autonome,
    });

    return res.status(200).json({
      success: true,
      agentId: agentId,
      messageResult,
    });
  } catch (error: any) {
    logger.error("Error in /api/v1/message:", error);
    return res.status(500).json({ error: "fail to send autonomy" });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(port, () => {
  logger.info(`Agent API server is listening on port ${port}`);
  logger.info(`Swagger UI available at http://localhost:${port}/api-docs`);
});

export default app;
