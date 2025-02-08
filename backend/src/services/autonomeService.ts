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
   * Fetch the first Agent's ID from the Autonome API.
   * Optionally pass { autonome: { ... } } to override the default config.
   *
   * Usage example (in your Express route):
   *   const agentId = await autonomeService.getAgentId({ autonome });
   */
  async getAgentId(overrides?: { autonome?: AutonomeConfig }): Promise<string> {
    const cfg = overrides?.autonome ?? defaultConfig;
    const finalUrl = `${cfg.baseUrl}/${cfg.instanceId}/agents`;

    const headers: Record<string, string> = {
      Authorization: getAuthHeader(cfg),
    };

    logger.info(`[getAgentId] GET ${finalUrl}`);
    logger.info(`[getAgentId] Using headers: ${JSON.stringify(headers)}`);

    try {
      const response = await axios.get(finalUrl, { headers });
      logger.info(
        `[getAgentId] Response data: ${JSON.stringify(response.data)}`,
      );

      const agents = response.data.agents;
      if (Array.isArray(agents) && agents.length > 0) {
        return agents[0].id;
      }
      throw new Error("No agents found in the response.");
    } catch (error: any) {
      logger.error("[getAgentId] Failed to fetch agent ID.");
      if (error.response) {
        logger.error(
          `[getAgentId] HTTP Status: ${error.response.status} ${error.response.statusText}`,
        );
        logger.error(
          `[getAgentId] Response body: ${JSON.stringify(error.response.data)}`,
        );
      } else if (error.request) {
        logger.error("[getAgentId] No response received from Autonome.");
      } else {
        logger.error(`[getAgentId] Error during setup: ${error.message}`);
      }
      throw error;
    }
  },

  /**
   * Send a message to a specific Agent via the Autonome API.
   * Optionally pass payload.autonome to override the default config.
   *
   * Usage example (in your Express route):
   *   const result = await autonomeService.sendMessage({
   *       text,
   *       agentId: finalAgentId,
   *       autonome
   *   });
   */
  async sendMessage(payload: {
    text: string;
    agentId: string;
    autonome?: AutonomeConfig;
  }): Promise<any> {
    const cfg = payload.autonome ?? defaultConfig;
    const finalUrl = `${cfg.baseUrl}/${cfg.instanceId}/${payload.agentId}/message`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(cfg),
    };

    logger.info(`[sendMessage] POST ${finalUrl}`);
    logger.info(
      `[sendMessage] Request payload: ${JSON.stringify({ text: payload.text })}`,
    );
    logger.info(`[sendMessage] Using headers: ${JSON.stringify(headers)}`);

    try {
      const response = await axios.post(
        finalUrl,
        { text: payload.text },
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
