import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const motoristaId = parseInt(searchParams.get("motoristaId"));

  if (isNaN(motoristaId)) {
    return NextResponse.json({ error: "Motorista inválido" }, { status: 400 });
  }

  try {
    const alunos = await prisma.aluno.findMany({
      where: { motoristaId },
      include: { pagamentos: true },
    });

    const resumo = {
      approved: 0,
      pending: 0,
      in_process: 0,
      not_paid: 0,
      nao_gerado: 0,
    };

    for (const aluno of alunos) {
      if (!aluno.pagamentos || aluno.pagamentos.length === 0) {
        resumo.nao_gerado++;
        continue;
      }

      for (const pagamento of aluno.pagamentos) {
        if (pagamento.status === "approved") resumo.approved++;
        else if (pagamento.status === "pending") resumo.pending++;
        else if (pagamento.status === "in_process") resumo.in_process++;
        else resumo.not_paid++;
      }
    }

    return NextResponse.json(resumo);
  } catch (err) {
    console.error("Erro ao buscar pagamentos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
