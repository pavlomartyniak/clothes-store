import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/route-handler-utils";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; subcategoryId: string }> }
) {
  try {
    const { id, subcategoryId } = await params;
    const data = await api.delete(`/categories/${id}/subcategories/${subcategoryId}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
