// backend/src/telegramBot.ts
import TelegramBot from 'node-telegram-bot-api';

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "こんにちは！CryptoDaily Briefへようこそ。ウォレットアドレスを入力してください。");
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  // ウォレットアドレスかどうか簡単なバリデーション
  if (text && /^0x[a-fA-F0-9]{40}$/.test(text)) {
    // ここでバックエンドのAPIを呼び出してデータを取得し、AIエージェントに処理させる
    // 簡単な例として、取得結果をそのまま返す
    try {
      const response = await axios.get(`http://localhost:3001/api/wallet/${text}`);
      bot.sendMessage(chatId, `取得結果: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      bot.sendMessage(chatId, `エラーが発生しました: ${error.toString()}`);
    }
  } else {
    bot.sendMessage(chatId, "正しいウォレットアドレスを入力してください。");
  }
});
