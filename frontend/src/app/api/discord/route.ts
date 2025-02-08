import { NextResponse } from "next/server";

interface DiscordMessage {
  id: string;
  content: string;
  author?: {
    id: string;
    username: string;
  };
  // 必要があれば追加
}

export async function GET(req: Request) {
  try {
    // /api/discord?channel=123456789 みたいな想定
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channel");
    if (!channelId) {
      return NextResponse.json(
        { error: "Missing channel param" },
        { status: 400 },
      );
    }

    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "DISCORD_BOT_TOKEN is not set" },
        { status: 500 },
      );
    }

    const limit = 5; // 取得件数

    const apiUrl = `https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`;
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bot ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          error: `Discord API error: ${res.status} ${res.statusText}`,
          detail: errorText,
        },
        { status: res.status },
      );
    }

    const data = (await res.json()) as DiscordMessage[];
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
