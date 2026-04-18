import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { inputUrl, caption } = await req.json();

    if (!inputUrl) {
      return NextResponse.json({ error: "inputUrl is required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(inputUrl, {
      resource_type: "video",
      eager: [
        // Step 1: crop to 9:16 portrait
        {
          width: 1080,
          height: 1920,
          crop: "fill",
          gravity: "center",
        },
        // Step 2: add text overlay on top of the cropped video
        {
          width: 1080,
          height: 1920,
          crop: "fill",
          gravity: "center",
          overlay: {
            font_family: "Arial",
            font_size: 50,
            font_weight: "bold",
            text: (caption || "Your Reel").replace(/,/g, "%2C").replace(/\//g, "%2F"),
          },
          color: "white",
          gravity: "south",
          y: 80,
        },
      ],
      eager_async: false,
    });

    // Prefer the last eager transformation (with overlay), fall back to first or original
    const eagerUrl =
      result.eager && result.eager.length > 0
        ? result.eager[result.eager.length - 1].secure_url
        : result.secure_url;

    return NextResponse.json({ url: eagerUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
