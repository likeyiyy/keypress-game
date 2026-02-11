import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, access, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

const CACHE_DIR = path.join(process.cwd(), ".tts-cache");

async function ensureCacheDir() {
  try {
    await access(CACHE_DIR);
  } catch {
    await mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    await ensureCacheDir();

    const filename = Buffer.from(text).toString("base64").replace(/[=/]/g, "_");
    const mp3Path = path.join(CACHE_DIR, `${filename}.mp3`);

    // 检查缓存
    try {
      const cached = await readFile(mp3Path);
      return new NextResponse(cached, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      // 缓存不存在，生成新的
    }

    // 生成临时文件名
    const tempId = randomUUID();
    const wavPath = path.join(CACHE_DIR, `${tempId}.wav`);

    // 把文本写入临时文件，避免 shell 转义问题
    const textFile = path.join(CACHE_DIR, `${tempId}.txt`);
    const fs = await import("fs/promises");
    await fs.writeFile(textFile, text, "utf-8");

    // 使用 espeak-ng 从文件读取文本
    await execAsync(`espeak-ng -v zh -s 120 -f "${textFile}" -w "${wavPath}"`);

    // 清理文本文件
    await unlink(textFile).catch(() => {});

    // 转换为 mp3
    try {
      await execAsync(`ffmpeg -y -i "${wavPath}" "${mp3Path}" 2>/dev/null`);
      await unlink(wavPath).catch(() => {});
      const audio = await readFile(mp3Path);
      return new NextResponse(audio, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      // ffmpeg 不可用，直接返回 wav
      const audio = await readFile(wavPath);
      await unlink(wavPath).catch(() => {});
      return new NextResponse(audio, {
        headers: {
          "Content-Type": "audio/wav",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
