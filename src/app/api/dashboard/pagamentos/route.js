import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const motoristaId = parseInt(searchParams.get("motoristaId"));
    const mes = parseInt(searchParams.get("mes"));

    if (!motoristaId || !mes) {
      return NextResponse.json({ error: "motoristaId e mes são obrigatórios" }, { status: 400 });
    }

    const alunos = await prisma.aluno.findMany({
      where: { motoristaId },
      include: { pagamentos: true },
    });

    let approved = 0;
    let pending = 0;
    let not_paid = 0;
    let nao_gerado = 0;
    let total_aprovado = 0;

    const anoAtual = new Date().getUTCFullYear();

    for (const aluno of alunos) {
      console.log(`📌 Pagamentos do aluno ${aluno.nome} (ID: ${aluno.id}):`);

      for (const p of aluno.pagamentos) {
        console.log(`  → ID: ${p.id}, criadoEm: ${p.criadoEm}, status: ${p.status}`);
      }

      const pagamentosDoMes = aluno.pagamentos.filter((p) => {
        if (!p.criadoEm) return false;
        const data = new Date(p.criadoEm);
        console.log(`  🕓 Data convertida: ${data}, mês: ${data.getUTCMonth() + 1}, ano: ${data.getUTCFullYear()}`);
        return (
          data.getUTCMonth() + 1 === mes &&
          data.getUTCFullYear() === anoAtual
        );
      });

      if (pagamentosDoMes.length === 0) {
        nao_gerado++;
        continue;
      }

      for (const p of pagamentosDoMes) {
        if (p.status === "approved") {
          approved++;
          total_aprovado += parseFloat(p.valor);
        } else if (p.status === "pending") {
          pending++;
        } else {
          not_paid++;
        }
      }
    }

    return NextResponse.json({
      approved,
      pending,
      not_paid,
      nao_gerado,
      total_aprovado,
    });

  } catch (error) {
    console.error("❌ Erro na API de dashboard:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
