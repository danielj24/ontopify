export async function fetchLyrics(token: string, trackID: string) {
  if (!token) return null;

  try {
    const result = await fetch(
      `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackID}?format=json&market=from_token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36",
          "App-platform": "WebPlayer",
        },
      },
    );

    const json = await result.json();

    console.log(json);

    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
}
