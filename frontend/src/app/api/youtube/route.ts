import { NextResponse } from "next/server";

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // クエリパラメーターから検索ワードを取得（なければ "web3" をデフォルトに）
    const query = searchParams.get("query") || "ethglobal";

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YOUTUBE_API_KEY is not set" },
        { status: 500 },
      );
    }

    // YouTube Data API の "search" エンドポイントを利用
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "3");
    // 絞り込みを強化するため、関連性の高い順に並べ、英語の結果に限定
    url.searchParams.set("order", "relevance");
    url.searchParams.set("relevanceLanguage", "en");
    url.searchParams.set("key", apiKey);

    const youtubeRes = await fetch(url.toString(), { method: "GET" });
    if (!youtubeRes.ok) {
      const errorText = await youtubeRes.text();
      return NextResponse.json(
        {
          error: `YouTube API error: ${youtubeRes.status} ${youtubeRes.statusText}`,
          detail: errorText,
        },
        { status: youtubeRes.status },
      );
    }
    const data = await youtubeRes.json();

    // 検索結果では、動画IDは item.id.videoId に格納されている
    const videos = (data.items as YouTubeSearchItem[]).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
    }));

    return NextResponse.json({ videos });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
