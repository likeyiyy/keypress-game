import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    const filename = Buffer.from(text).toString("base64").replace(/[=/]/g, "_");
    const filepath = path.join(AUDIO_DIR, `${filename}.mp3`);

    // 检查预生成的缓存文件
    try {
      const audio = await readFile(filepath);
      return new NextResponse(audio, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      // 文件不存在
      console.log("Audio not found:", filepath);
    }

    return NextResponse.json({ error: "Audio not found", text }, { status: 404 });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
