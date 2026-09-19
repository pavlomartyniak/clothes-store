import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await api.get(`/products/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await api.patch(`/products/${id}`, body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await api.delete(`/products/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
