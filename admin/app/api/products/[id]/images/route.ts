import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/session";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

// Multipart passthrough is proxied with native fetch rather than the axios
// helper in lib/api.ts — Node's fetch forwards a FormData/Blob body (and
// sets the multipart boundary) natively, which is the more reliable path
// for streaming an upload through to the backend.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const token = await getToken();

    const res = await fetch(`${API_URL}/products/${id}/images`, {
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
    return NextResponse.json({ message: "Не вдалося завантажити фото" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await api.delete(`/products/${id}/images`, body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
