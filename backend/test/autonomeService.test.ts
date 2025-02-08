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

  describe("sendMessage", () => {
    it("should send a message and return response data when successful", async () => {
      // Arrange
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: "Message delivered" },
      });

      // Act
      const res = await autonomeService.sendMessage({
        message: "Hello, Agent!",
      });

      // Assert
      expect(res).toEqual({ result: "Message delivered" });
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://autonome.alt.technology/your-instance-id/message",
        { message: "Hello, Agent!" },
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
        message: "Hi with custom config",
        autonome: customConfig,
      });

      expect(res).toEqual({ result: "Custom config message delivered" });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://custom-autonome.example.com/custom-instance/message",
        { message: "Hi with custom config" },
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
          message: "Test error handling",
        }),
      ).rejects.toThrowError("Agent not found");
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});
