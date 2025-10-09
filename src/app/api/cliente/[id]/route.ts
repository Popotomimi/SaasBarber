import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;
    await ClienteModel.findByIdAndDelete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const body = await request.json();

  try {
    const { id } = await context.params;
    const updated = await ClienteModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
