import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.search;
    const data = await api.get(`/products${query}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await api.post("/products", body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
