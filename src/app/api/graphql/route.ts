import { NextRequest, NextResponse } from "next/server";
import Config from "common/config.json";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const response = await fetch(Config.API.CcreAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.SCREEN_API_KEY!,
    },
    body,
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
  });
}
