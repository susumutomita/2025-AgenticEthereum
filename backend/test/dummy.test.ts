// backend/test/dummy.test.ts
import request from "supertest";
import express, { Request, Response } from "express";

const app = express();
// 型注釈を付け、返り値は void とする
app.get("/dummy", (req: Request, res: Response): void => {
  res.send("OK");
});

describe("Dummy Test", () => {
  it("should return OK", async () => {
    const response = await request(app).get("/dummy");
    expect(response.text).toBe("OK");
  });
});
