import { NextRequest, NextResponse } from "next/server";
import Config from "common/config.json";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const response = await fetch(Config.API.MOHD_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.MOHD_API_KEY!,
    },
    body,
  });

  const data = await response.text();
  return new NextResponse(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
