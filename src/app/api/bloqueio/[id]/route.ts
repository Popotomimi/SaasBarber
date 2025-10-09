import { NextRequest, NextResponse } from "next/server";
import { Bloqueio } from "@/models/Bloqueio";
import { connectToDatabase } from "@/lib/mongodb";

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;
    const bloqueioRemovido = await Bloqueio.findByIdAndDelete(id);

    if (!bloqueioRemovido) {
      return NextResponse.json(
        { error: "Bloqueio não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Bloqueio excluído com sucesso!", bloqueioRemovido },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir bloqueio." },
      { status: 500 }
    );
  }
}
