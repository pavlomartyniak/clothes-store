import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/session";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

// Multipart passthrough is proxied with native fetch — see
// app/api/products/[id]/images/route.ts for why.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const token = await getToken();

    const res = await fetch(`${API_URL}/brands/${id}/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Не вдалося завантажити зображення" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await api.delete(`/brands/${id}/image`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
