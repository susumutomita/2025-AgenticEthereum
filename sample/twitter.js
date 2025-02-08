// twitter.js (JS版)
import fetch from "node-fetch";

async function getUserByUsername(username) {
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  console.log("Fetching user data from Twitter API...");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Twitter API error: ${res.status} ${res.statusText}`);
  }

  // JSONにパース
  const data = await res.json();
  return data;
}

getUserByUsername("elonmusk")
  .then((res) => {
    // 全体を綺麗に表示
    console.log("== Raw JSON ==");
    console.log(JSON.stringify(res, null, 2));

    // 特定のフィールドだけ表示したい場合
    console.log("\n== Extracted fields ==");
    if (res.data) {
      console.log("User ID:", res.data.id);
      console.log("Name:", res.data.name);
      console.log("Username:", res.data.username);
    } else {
      console.log("No data field found");
    }
  })
  .catch((err) => console.error("Error:", err));
