import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const motoristaId = parseInt(searchParams.get("motoristaId"));

  if (!motoristaId) {
    return NextResponse.json({ erro: "Motorista não encontrado" }, { status: 400 });
  }

  const alunos = await prisma.aluno.findMany({
    where: { motoristaId },
    include: {
      pagamentos: {
        orderBy: {criadoEm: "desc"},
        take: 1,
      }
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(alunos);
}
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ erro: "ID do aluno não fornecido" }, { status: 400 });
    }

    // Apagar pagamentos antes (se houver)
    await prisma.pagamento.deleteMany({
      where: { alunoId: id }
    });

    // Agora apagar o aluno
    await prisma.aluno.delete({
      where: { id },
    });

    return NextResponse.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao remover aluno:", err);
    return NextResponse.json({ erro: "Erro ao remover aluno" }, { status: 500 });
  }
}