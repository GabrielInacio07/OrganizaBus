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
      pagamentos: true,
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(alunos);
}
