"use client";

import { useState } from "react";
import type { PixabayVideo } from "@/app/api/search/route";

interface VideoCardProps {
  video: PixabayVideo;
  onSelect: (video: PixabayVideo) => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const [hovered, setHovered] = useState(false);
  const thumbnail =
    video.videos.medium.thumbnail ||
    video.videos.small.thumbnail ||
    video.videos.tiny.thumbnail;

  return (
    <button
      onClick={() => onSelect(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
      aria-label={`Play video: ${video.tags}`}
    >
      <div
        style={{
          borderRadius: "var(--radius)",
          overflow: "hidden",
          background: "var(--surface)",
          border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
          transition: "border-color 0.15s ease",
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9
            background: "#111",
            overflow: "hidden",
          }}
        >
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={video.tags}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          )}
          {/* Play overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.1)",
              transition: "background 0.15s ease",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: hovered ? "var(--accent)" : "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill={hovered ? "var(--accent-fg)" : "#fff"}
              >
                <path d="M2 1.5l10 5.5-10 5.5V1.5z" />
              </svg>
            </div>
          </div>
          {/* Duration badge */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              letterSpacing: "0.03em",
            }}
          >
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Meta */}
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--foreground)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {video.tags}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--muted)",
              fontSize: "0.72rem",
            }}
          >
            <span>{video.user}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              {video.likes}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
