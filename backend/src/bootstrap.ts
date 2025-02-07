import * as dotenv from "dotenv";
import { join } from "path";
import { existsSync } from "fs";

// デバッグ情報の表示
console.log("Current working directory:", process.cwd());

// 直接.envファイルを探す
const envPath = join(process.cwd(), ".env");
console.log("Looking for .env file at:", envPath);
console.log("File exists:", existsSync(envPath));

// 環境変数を手動で設定
// Note: これらの値は.envファイルから読み込まれるべきですが、一時的な対処として設定します
process.env.AUTONOME_BASE_URL = "https://autonome.alt.technology";
process.env.AUTONOME_INSTANCE_ID = "cdb-gcqmjr";
process.env.AUTONOME_USERNAME = "cdb";

// .envファイルからも読み込みを試みる
const result = dotenv.config();
console.log("Dotenv config result:", result.error ? "Error" : "Success");

// 環境変数のデバッグ情報
console.log("Current environment variables:", {
  AUTONOME_BASE_URL: process.env.AUTONOME_BASE_URL,
  AUTONOME_INSTANCE_ID: process.env.AUTONOME_INSTANCE_ID,
  AUTONOME_USERNAME: process.env.AUTONOME_USERNAME,
  AUTONOME_PASSWORD: process.env.AUTONOME_PASSWORD ? "設定済み" : "未設定",
});

import "./server.js";
