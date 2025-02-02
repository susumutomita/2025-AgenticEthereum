"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/telegramBot.ts
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const axios_1 = __importDefault(require("axios"));
const token = "YOUR_TELEGRAM_BOT_TOKEN";
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "こんにちは！CryptoDaily Briefへようこそ。ウォレットアドレスを入力してください。");
});
bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    // msg の型を明示的に指定
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text && /^0x[a-fA-F0-9]{40}$/.test(text)) {
        try {
            const response = yield axios_1.default.get(`http://localhost:3001/api/wallet/${text}`);
            bot.sendMessage(chatId, `取得結果: ${JSON.stringify(response.data)}`);
        }
        catch (error) {
            bot.sendMessage(chatId, `エラーが発生しました: ${error.toString()}`);
        }
    }
    else {
        bot.sendMessage(chatId, "正しいウォレットアドレスを入力してください。");
    }
}));
