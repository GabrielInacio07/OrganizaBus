import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { motoristaId, valorMensalidade } = await req.json();

  try {
    await prisma.aluno.updateMany({
      where: { motoristaId },
      data: { valorMensalidade: parseFloat(valorMensalidade) },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar mensalidade dos alunos:", error);
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }
}