import { NextResponse } from "next/server";
import fetch from "node-fetch";

// Twitterが返すJSONの型定義 (簡易)
interface TwitterData {
  data?: {
    id: string;
    text: string;
  }[];
  meta?: unknown;
  errors?: unknown;
}

export async function GET(req: Request) {
  try {
    // URLオブジェクトでクエリをパース
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "web3";
    const maxResults = 5;

    const token = process.env.TWITTER_BEARER_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "TWITTER_BEARER_TOKEN is not set" },
        { status: 500 },
      );
    }

    // Twitter APIの recent search endpoint
    const url = new URL("https://api.twitter.com/2/tweets/search/recent");
    url.searchParams.set("query", query);
    url.searchParams.set("max_results", String(maxResults));

    const twitterRes = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!twitterRes.ok) {
      const errorText = await twitterRes.text();
      return NextResponse.json(
        {
          error: `Twitter API error: ${twitterRes.status} ${twitterRes.statusText}`,
          detail: errorText,
        },
        { status: twitterRes.status },
      );
    }

    // 返されるJSONを型定義に合わせる
    const data = (await twitterRes.json()) as TwitterData;
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
