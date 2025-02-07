import axios from "axios";

// Autonome 用の設定情報の型定義
export interface AutonomeConfig {
  baseUrl: string;
  instanceId: string;
  username: string;
  password: string;
}

// 環境変数から設定値を読み込み、デフォルト値をセットする関数
const loadAutonomeConfig = (): AutonomeConfig => ({
  baseUrl: process.env.AUTONOME_BASE_URL ?? "https://autonome.alt.technology",
  instanceId: process.env.AUTONOME_INSTANCE_ID ?? "",
  username: process.env.AUTONOME_USERNAME ?? "",
  password: process.env.AUTONOME_PASSWORD ?? "",
});

const config = loadAutonomeConfig();
console.log("Autonome Config:", config);

// Basic認証ヘッダの生成（1度だけ計算する）
const basicAuthHeader = `Basic ${Buffer.from(
  `${config.username}:${config.password}`,
).toString("base64")}`;

export const autonomeService = {
  /**
   * Autonome APIから agent 一覧を取得し、最初の agent の ID を返す
   */
  async getAgentId(): Promise<string> {
    const url = `${config.baseUrl}/${config.instanceId}/agents`;
    console.log("Fetching agent ID from:", url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: basicAuthHeader },
      });
      const agents = response.data.agents;
      if (Array.isArray(agents) && agents.length > 0) {
        return agents[0].id;
      }
      throw new Error("Agentが見つかりませんでした");
    } catch (error) {
      console.error("AutonomeからagentID取得エラー:", error);
      throw error;
    }
  },

  /**
   * 指定の agentID に対してメッセージを送信し、Autonome API のレスポンスデータを返す
   */
  async sendMessage(agentId: string, message: string): Promise<any> {
    const url = `${config.baseUrl}/${config.instanceId}/${agentId}/message`;
    console.log("Sending message to:", url);
    try {
      const response = await axios.post(
        url,
        { text: message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: basicAuthHeader,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Autonomeへのメッセージ送信エラー:", error);
      throw error;
    }
  },
};
