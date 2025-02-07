import axios from "axios";

// 環境変数のチェックと設定を行う関数
const getEnvConfig = () => {
  // デフォルト値を設定
  if (!process.env.AUTONOME_BASE_URL) {
    process.env.AUTONOME_BASE_URL = "https://autonome.alt.technology";
  }
  if (!process.env.AUTONOME_INSTANCE_ID) {
    process.env.AUTONOME_INSTANCE_ID = "cdb-gcqmjr";
  }
  if (!process.env.AUTONOME_USERNAME) {
    process.env.AUTONOME_USERNAME = "cdb";
  }
  if (!process.env.AUTONOME_PASSWORD) {
    process.env.AUTONOME_PASSWORD = "rUWoRgSYLt";
  }

  return {
    baseUrl: process.env.AUTONOME_BASE_URL,
    instanceId: process.env.AUTONOME_INSTANCE_ID,
    username: process.env.AUTONOME_USERNAME,
    password: process.env.AUTONOME_PASSWORD,
  };
};

// 設定を取得
const config = getEnvConfig();

// Basic認証ヘッダの生成
const basicAuthHeader =
  "Basic " +
  Buffer.from(`${config.username}:${config.password}`).toString("base64");

export const autonomeService = {
  /**
   * Autonome APIからagent一覧を取得し、最初のagentのIDを返す
   */
  async getAgentId(): Promise<string> {
    const url = `${config.baseUrl}/${config.instanceId}/agents`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: basicAuthHeader },
      });
      const agents = response.data.agents;
      if (agents && agents.length > 0) {
        return agents[0].id;
      }
      throw new Error("Agentが見つかりませんでした");
    } catch (error) {
      console.error("AutonomeからagentID取得エラー:", error);
      throw error;
    }
  },

  /**
   * 指定のagentIDへメッセージ送信
   */
  async sendMessage(agentId: string, message: string): Promise<void> {
    const url = `${config.baseUrl}/${config.instanceId}/${agentId}/message`;
    try {
      await axios.post(
        url,
        { text: message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: basicAuthHeader,
          },
        },
      );
    } catch (error) {
      console.error("Autonomeへのメッセージ送信エラー:", error);
      throw error;
    }
  },
};
