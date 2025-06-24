import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { alunoId, tipo } = await req.json();

    if (!alunoId || !tipo) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    const inicioMes = new Date(ano, mes, 1);
    const proximoMes = new Date(ano, mes + 1, 1);

    // Verifica se já existe um pagamento aprovado neste mês
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        alunoId: parseInt(alunoId),
        tipo,
        status: "approved",
        criadoEm: {
          gte: inicioMes,
          lt: proximoMes,
        },
      },
    });

    if (pagamentoExistente) {
      return NextResponse.json({ message: "Pagamento já registrado para este mês." });
    }

    // Cria um novo pagamento com status approved (manual)
    const novoPagamento = await prisma.pagamento.create({
      data: {
        titulo: `Pagamento manual (${tipo})`,
        valor: 0,
        quantidade: 1,
        status: "approved",
        qr_code: null,
        codigo_pix: null,
        pagamentoId: `manual-${Date.now()}`,
        alunoId: parseInt(alunoId),
        expiraEm: new Date(Date.now() + 15 * 60 * 1000),
        tipo,
      },
    });

    return NextResponse.json({ message: "Pagamento registrado com sucesso", pagamento: novoPagamento });
  } catch (error) {
    console.error("Erro ao registrar pagamento manual:", error);
    return NextResponse.json({ error: "Erro ao registrar pagamento manual" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
