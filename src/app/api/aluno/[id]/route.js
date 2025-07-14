import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  // Await the params object
  const { id } = await params;

  // Validar params.id
  if (!id || typeof id !== "string") {
    return NextResponse.json({ erro: "ID do aluno inválido" }, { status: 400 });
  }

  const alunoId = parseInt(id, 10);

  if (isNaN(alunoId)) {
    return NextResponse.json({ erro: "ID do aluno inválido" }, { status: 400 });
  }

  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: {
        motorista: {
          select: { diaVencimento: true },
        },
      },
    });

    if (!aluno) {
      return NextResponse.json({ erro: "Aluno não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      ...aluno,
      diaVencimento: aluno.motorista?.diaVencimento || 10,
    });
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}