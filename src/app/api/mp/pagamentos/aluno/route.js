import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const alunoId = parseInt(searchParams.get("alunoId"));

  if (!alunoId) {
    return NextResponse.json({ erro: "ID do aluno não fornecido" }, { status: 400 });
  }

  const pagamentos = await prisma.pagamento.findMany({
    where: { alunoId },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(pagamentos);
}
