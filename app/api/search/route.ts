import { NextRequest, NextResponse } from "next/server";

export interface PixabayVideo {
  id: number;
  tags: string;
  duration: number;
  user: string;
  userImageURL: string;
  pageURL: string;
  videos: {
    large: { url: string; width: number; height: number; thumbnail: string };
    medium: { url: string; width: number; height: number; thumbnail: string };
    small: { url: string; width: number; height: number; thumbnail: string };
    tiny: { url: string; width: number; height: number; thumbnail: string };
  };
  views: number;
  downloads: number;
  likes: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "20";

  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PIXABAY_API_KEY is not configured" }, { status: 500 });
  }

  const url = new URL("https://pixabay.com/api/videos/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("page", page);
  url.searchParams.set("per_page", per_page);
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("order", "popular");

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // cache for 24h as Pixabay requires
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
