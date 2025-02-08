// test/autonomeService.test.ts

import axios from "axios";
import { autonomeService } from "../src/services/autonomeService";
import { AutonomeConfig } from "../src/types/autonomeType";

// Mock axios globally
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("autonomeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAgentId", () => {
    it("should return the first agent's ID when the API response is valid", async () => {
      // Arrange
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          agents: [{ id: "agent-123" }, { id: "agent-456" }],
        },
      });

      // Act
      const agentId = await autonomeService.getAgentId();

      // Assert
      expect(agentId).toBe("agent-123");
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://autonome.alt.technology/your-instance-id/agents",
        expect.objectContaining({
          headers: { Authorization: expect.any(String) },
        }),
      );
    });

    it("should throw an error when no agents are found", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { agents: [] },
      });

      await expect(autonomeService.getAgentId()).rejects.toThrow(
        "No agents found in the response.",
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should log and rethrow an error if the request fails (e.g., 500)", async () => {
      const error500 = new Error("Something went wrong");
      // axios のエラーは通常 response プロパティを持つので付与する
      (error500 as any).response = {
        status: 500,
        statusText: "Internal Server Error",
        data: { message: "Something went wrong" },
      };

      mockedAxios.get.mockRejectedValueOnce(error500);

      await expect(autonomeService.getAgentId()).rejects.toThrowError(
        "Something went wrong",
      );
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("sendMessage", () => {
    it("should send a message and return response data when successful", async () => {
      // Arrange
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: "Message delivered" },
      });

      // Act
      const res = await autonomeService.sendMessage({
        text: "Hello, Agent!",
        agentId: "agent-123",
      });

      // Assert
      expect(res).toEqual({ result: "Message delivered" });
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://autonome.alt.technology/your-instance-id/agent-123/message",
        { text: "Hello, Agent!" },
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: expect.any(String),
          },
        }),
      );
    });

    it("should allow overriding the default Autonome config", async () => {
      const customConfig: AutonomeConfig = {
        baseUrl: "https://custom-autonome.example.com",
        instanceId: "custom-instance",
        username: "custom-username",
        password: "custom-password",
      };
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: "Custom config message delivered" },
      });

      const res = await autonomeService.sendMessage({
        text: "Hi with custom config",
        agentId: "agent-999",
        autonome: customConfig,
      });

      expect(res).toEqual({ result: "Custom config message delivered" });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://custom-autonome.example.com/custom-instance/agent-999/message",
        { text: "Hi with custom config" },
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: expect.any(String),
          },
        }),
      );
    });

    it("should log and rethrow an error if the POST request fails (e.g., 404)", async () => {
      const error404 = new Error("Agent not found");
      (error404 as any).response = {
        status: 404,
        statusText: "Not Found",
        data: { error: "Agent not found" },
      };

      mockedAxios.post.mockRejectedValueOnce(error404);

      await expect(
        autonomeService.sendMessage({
          text: "Test error handling",
          agentId: "nonexistent-agent",
        }),
      ).rejects.toThrowError("Agent not found");
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});
