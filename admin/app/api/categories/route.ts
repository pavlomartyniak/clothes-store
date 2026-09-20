import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

export async function GET() {
  try {
    const data = await api.get("/categories");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await api.post("/categories", body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
