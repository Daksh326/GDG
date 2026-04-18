"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("Some messages can't wait");
  const [video, setVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!url.trim()) {
      setError("Please enter a video URL.");
      return;
    }

    setLoading(true);
    setError("");
    setVideo("");

    try {
      const res = await fetch("/api/reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputUrl: url, caption }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setVideo(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate reel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "var(--muted)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
              letterSpacing: "-0.03em",
            }}
          >
            Reel Generator
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Transform any video URL into a captioned 9:16 reel via Cloudinary.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            htmlFor="video-url"
            style={{ fontSize: "0.85rem", color: "#aaa", fontWeight: 500 }}
          >
            Video URL
          </label>
          <input
            id="video-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) - 2px)",
              color: "var(--foreground)",
              fontSize: "0.95rem",
              padding: "0.65rem 0.9rem",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            htmlFor="caption"
            style={{ fontSize: "0.85rem", color: "#aaa", fontWeight: 500 }}
          >
            Caption
          </label>
          <input
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption text"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "calc(var(--radius) - 2px)",
              color: "var(--foreground)",
              fontSize: "0.95rem",
              padding: "0.65rem 0.9rem",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {error && (
          <p
            style={{
              color: "var(--accent)",
              background: "rgba(255,77,77,0.1)",
              border: "1px solid rgba(255,77,77,0.3)",
              borderRadius: "calc(var(--radius) - 2px)",
              padding: "0.65rem 0.9rem",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading ? "#444" : "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "calc(var(--radius) - 2px)",
            padding: "0.75rem 1.25rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Generating..." : "Generate Reel"}
        </button>
      </div>

      {video && (
        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          <video
            src={video}
            controls
            autoPlay
            playsInline
            style={{ width: "100%", display: "block" }}
          />
        </div>
      )}
    </main>
  );
}
