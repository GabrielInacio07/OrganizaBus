import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const motoristaId = parseInt(searchParams.get("motoristaId"));

  if (!motoristaId) {
    return new Response(JSON.stringify({ erro: "Motorista não informado" }), { status: 400 });
  }

  const alunos = await prisma.aluno.findMany({
    where: { motoristaId },
  });

  return new Response(JSON.stringify(alunos), { status: 200 });
}
