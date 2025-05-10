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
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ erro: 'ID do aluno não informado' }), { status: 400 });
    }

    await prisma.aluno.delete({
      where: { id: parseInt(id) },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 }); 
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    return new Response(JSON.stringify({ erro: 'Erro ao deletar aluno' }), { status: 500 });
  }
}
