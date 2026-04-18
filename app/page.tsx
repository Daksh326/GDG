"use client";

import { useState, useCallback } from "react";
import VideoCard from "@/components/VideoCard";
import ReelViewer from "@/components/ReelViewer";
import type { PixabayVideo } from "@/app/api/search/route";

const SUGGESTIONS = ["nature", "city", "ocean", "mountains", "technology", "people", "travel"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<PixabayVideo[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PixabayVideo | null>(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string, pageNum = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    if (pageNum === 1) setVideos([]);

    try {
      const params = new URLSearchParams({ q, page: String(pageNum), per_page: "20" });
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setVideos((prev) => (pageNum === 1 ? data.hits : [...prev, ...data.hits]));
      setTotalHits(data.totalHits);
      setPage(pageNum);
      setSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query, 1);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    search(s, 1);
  };

  const hasMore = videos.length < totalHits;

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(8,8,8,0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--accent)", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="var(--accent-fg)">
                <path d="M2 1.5l10 5.5-10 5.5V1.5z" />
              </svg>
            </span>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Pixabay Reels
            </span>
          </div>
          {searched && totalHits > 0 && (
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {totalHits.toLocaleString()} videos found
            </span>
          )}
        </header>

        {/* Search hero */}
        <section style={{
          padding: searched ? "1.5rem 2rem" : "5rem 2rem 3rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem",
          transition: "padding 0.3s ease",
        }}>
          {!searched && (
            <div style={{ textAlign: "center", maxWidth: 540 }}>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
                color: "var(--foreground)", letterSpacing: "-0.04em",
                lineHeight: 1.1, marginBottom: "0.75rem",
              }}>
                Search free<br />
                <span style={{ color: "var(--accent)" }}>stock videos</span>
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>
                Browse millions of royalty-free videos from Pixabay. Click any result to view as a reel.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 580, display: "flex", gap: "0.5rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{
                position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                color: "var(--muted)", display: "flex", alignItems: "center", pointerEvents: "none",
              }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="9" r="6" />
                  <line x1="13.5" y1="13.5" x2="18" y2="18" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search videos..."
                aria-label="Search videos"
                style={{
                  width: "100%", background: "var(--surface)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  color: "var(--foreground)", fontSize: "0.95rem",
                  padding: "0.7rem 1rem 0.7rem 2.4rem", outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "var(--surface)" : "var(--accent)",
                color: loading ? "var(--muted)" : "var(--accent-fg)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                padding: "0.7rem 1.25rem", fontSize: "0.9rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              {loading && page === 1 ? "..." : "Search"}
            </button>
          </form>

          {!searched && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 999, color: "var(--muted)", fontSize: "0.8rem",
                    padding: "0.35rem 0.9rem", cursor: "pointer",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.borderColor = "var(--foreground)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p style={{
              maxWidth: 580, width: "100%",
              color: "#ff6b6b", background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: "var(--radius)", padding: "0.65rem 1rem", fontSize: "0.875rem",
            }}>
              {error}
            </p>
          )}
        </section>

        {/* Results grid */}
        {videos.length > 0 && (
          <section style={{ padding: "0 2rem 4rem", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}>
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} onSelect={setSelected} />
              ))}
            </div>

            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => search(query, page + 1)}
                  disabled={loading}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", color: loading ? "var(--muted)" : "var(--foreground)",
                    fontSize: "0.875rem", fontWeight: 600,
                    padding: "0.65rem 2.5rem", cursor: loading ? "not-allowed" : "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </section>
        )}

        {searched && videos.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
            <p style={{ fontSize: "1rem" }}>No videos found for &quot;{query}&quot;</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Try a different search term</p>
          </div>
        )}
      </main>

      {selected && <ReelViewer video={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
