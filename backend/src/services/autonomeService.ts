import axios from "axios";
import logger from "../logger";
import { AutonomeConfig } from "../types/autonomeType";

/**
 * Default config for Autonome (Basic Auth required).
 */
const defaultConfig: AutonomeConfig = {
  baseUrl: "https://autonome.alt.technology",
  instanceId: "your-instance-id",
  username: "your-username",
  password: "your-password",
};

/**
 * Generate the Basic Auth header from username and password.
 */
const getAuthHeader = (cfg: AutonomeConfig): string => {
  return `Basic ${Buffer.from(`${cfg.username}:${cfg.password}`).toString("base64")}`;
};

export const autonomeService = {
  /**
   * Send a message to a specific Agent via the Autonome API.
   * Optionally pass payload.autonome to override the default config.
   *
   * Usage example (in your Express route):
   *   const result = await autonomeService.sendMessage({
   *       message,
   *       agentId: finalAgentId,
   *       autonome
   *   });
   */
  async sendMessage(payload: {
    message: string;
    autonome?: AutonomeConfig;
  }): Promise<any> {
    const cfg = payload.autonome ?? defaultConfig;
    const finalUrl = `${cfg.baseUrl}/${cfg.instanceId}/message`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(cfg),
    };

    logger.info(`[sendMessage] POST ${finalUrl}`);
    logger.info(
      `[sendMessage] Request payload: ${JSON.stringify({ text: payload.message })}`,
    );
    logger.info(`[sendMessage] Using headers: ${JSON.stringify(headers)}`);

    try {
      const response = await axios.post(
        finalUrl,
        { message: payload.message },
        { headers },
      );
      logger.info(
        `[sendMessage] Response data: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error: any) {
      logger.error("[sendMessage] Failed to send message.");
      if (error.response) {
        logger.error(
          `[sendMessage] HTTP Status: ${error.response.status} ${error.response.statusText}`,
        );
        logger.error(
          `[sendMessage] Response body: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        logger.error("[sendMessage] No response received from Autonome.");
      } else {
        logger.error(`[sendMessage] Error during setup: ${error.message}`);
      }
      throw error;
    }
  },
};
