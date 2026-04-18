'use client';

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState("");

  const generate = async () => {
    const res = await fetch("/api/reel", {
      method: "POST",
      body: JSON.stringify({
        inputUrl: url,
        caption: "Some messages can't wait",
      }),
    });

    const data = await res.json();
    setVideo(data.url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Reel Generator</h2>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste video URL"
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={generate} style={{ marginTop: 10 }}>
        Generate
      </button>

      {video && (
        <video src={video} controls autoPlay style={{ width: "100%", marginTop: 20 }} />
      )}
    </div>
  );
}
