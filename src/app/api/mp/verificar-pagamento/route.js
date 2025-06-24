import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const alunoId = parseInt(searchParams.get("alunoId")); // 👈 convertendo para inteiro
    const tipo = searchParams.get("tipo");

    if (isNaN(alunoId) || !tipo) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    const inicioMes = new Date(ano, mes, 1);
    const proximoMes = new Date(ano, mes + 1, 1);

    const pagamento = await prisma.pagamento.findFirst({
      where: {
        alunoId,
        tipo,
        status: "approved",
        criadoEm: {
          gte: inicioMes,
          lt: proximoMes,
        },
      },
    });

    return NextResponse.json({ pago: !!pagamento });
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
