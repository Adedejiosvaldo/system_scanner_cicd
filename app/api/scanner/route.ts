import { SystemInfo } from "@/types/scan";
import { NextRequest, NextResponse } from "next/server";
import si from "systeminformation";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Replace 'some-library' with the actual library name

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY! as string);

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export async function POST(request: NextRequest) {
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const disk = await si.diskLayout();
    const graphics = await si.graphics();
    const os = await si.osInfo();

    const systemInfo = {
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
      },
      cpu: {
        model: cpu.manufacturer + " " + cpu.brand,
        cores: cpu.cores,
        speed: cpu.speed,
        maxSpeed: cpu.speedMax,
        baseSpeed: cpu.speedMin,
      },
      ram: {
        total: formatBytes(mem.total),
        free: formatBytes(mem.free),
      },
      storage: {
        total: formatBytes(disk[1].size),
        type: disk[1].type.toUpperCase() === "SSD" ? "SSD" : "HDD",
      },
      gpus: graphics.controllers.map((gpu) => ({
        model: gpu.model,
        memory: formatBytes(gpu.vram! * 1024 * 1024), // Convert MB to Bytes
      })),
    };
    console.log(disk[0].type);
    console.log(disk[1].type);

    // Get AI recommendations
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Given these system specifications and years of experience as a technical expert on computers:
      CPU: ${systemInfo.cpu.model} with ${systemInfo.cpu.cores} cores at ${
      systemInfo.cpu.speed
    }GHz
      RAM: ${systemInfo.ram.total}
      Storage: ${systemInfo.storage.total} ${systemInfo.storage.type}
      GPU: ${systemInfo.gpus
        .map((gpu) => `${gpu.model} with ${gpu.memory}`)
        .join(", ")}
      OS: ${systemInfo.os.platform} ${systemInfo.os.distro} ${
      systemInfo.os.release
    }

      Recommend only essential softwares that an average person would use in their day to day with versions. Return only JSON in this format:
      [{"name": "Software Name", "version": "Version Number"}]`;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const aiText = await aiResponse.text();

    // Ensure the response is valid JSON
    const jsonStartIndex = aiText.indexOf("[");
    const jsonEndIndex = aiText.lastIndexOf("]") + 1;
    const jsonString = aiText.substring(jsonStartIndex, jsonEndIndex);

    const recommendations = JSON.parse(jsonString);

    const formattedRecommendations = recommendations.map((rec: any) => ({
      name: rec.name,
      version: rec.version,
    }));

    return NextResponse.json({
      systemInfo,
      recommendations: formattedRecommendations,
    });

    // return NextResponse.json({ systemInfo, recommendations });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
