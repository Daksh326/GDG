"use client";

import { useEffect, useRef } from "react";
import type { PixabayVideo } from "@/app/api/search/route";

interface ReelViewerProps {
  video: PixabayVideo;
  onClose: () => void;
}

export default function ReelViewer({ video, onClose }: ReelViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pick best available URL
  const src =
    video.videos.medium.url ||
    video.videos.small.url ||
    video.videos.tiny.url;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Autoplay when mounted
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel viewer"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(340px, 90vw)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "calc(var(--radius) * 2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close viewer"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="11" y1="1" x2="1" y2="11" />
          </svg>
        </button>

        {/* 9:16 video container */}
        <div style={{ position: "relative", paddingTop: "177.78%" /* 9:16 */, background: "#000" }}>
          <video
            ref={videoRef}
            src={src}
            controls
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--foreground)",
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
              justifyContent: "space-between",
              color: "var(--muted)",
              fontSize: "0.72rem",
            }}
          >
            <span>by {video.user}</span>
            <a
              href={video.pageURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--accent)",
                textDecoration: "none",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              Pixabay ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
