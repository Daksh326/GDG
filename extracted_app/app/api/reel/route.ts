import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { inputUrl, caption } = await req.json();

    const result = await cloudinary.uploader.upload(inputUrl, {
      resource_type: "video",
      eager: [
        {
          width: 1080,
          height: 1920,
          crop: "fill",
          duration: 15,
          overlay: {
            font_family: "Arial",
            font_size: 50,
            text: caption || "Your Reel",
          },
          color: "white",
          gravity: "south",
          y: 80,
        },
      ],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
