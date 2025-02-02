// backend/src/telegramBot.ts
import TelegramBot, { Message } from "node-telegram-bot-api";
import axios from "axios";

const token = "YOUR_TELEGRAM_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg: Message) => {
  bot.sendMessage(
    msg.chat.id,
    "こんにちは！CryptoDaily Briefへようこそ。ウォレットアドレスを入力してください。",
  );
});

bot.on("message", async (msg: Message) => {
  // msg の型を明示的に指定
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text && /^0x[a-fA-F0-9]{40}$/.test(text)) {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/wallet/${text}`,
      );
      bot.sendMessage(chatId, `取得結果: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      bot.sendMessage(chatId, `エラーが発生しました: ${error.toString()}`);
    }
  } else {
    bot.sendMessage(chatId, "正しいウォレットアドレスを入力してください。");
  }
});
