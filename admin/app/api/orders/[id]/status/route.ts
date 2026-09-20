import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await api.patch(`/orders/${id}/status`, body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
