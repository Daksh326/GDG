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
        {
          width: 1080,
          height: 1920,
          crop: "fill",
          overlay: {
            font_family: "Arial",
            font_size: 50,
            font_weight: "bold",
            text: caption || "Your Reel",
          },
          color: "white",
          gravity: "south",
          y: 80,
        },
      ],
      eager_async: false,
    });

    const eagerUrl =
      result.eager && result.eager[0]
        ? result.eager[0].secure_url
        : result.secure_url;

    return NextResponse.json({ url: eagerUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
