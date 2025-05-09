import prisma from '@/lib/prisma';

export async function GET() {
  const alunos = await prisma.aluno.findMany();
  return new Response(JSON.stringify(alunos), { status: 200 });
}

export async function PUT(request) {
  const { id, nome, email, senha } = await request.json();

  try {
    const aluno = await prisma.aluno.update({
      where: { id },
      data: { nome, email, senha },
    });
    return new Response(JSON.stringify(aluno), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ erro: 'Erro ao atualizar aluno' }), { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();

  try {
    await prisma.aluno.delete({ where: { id } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ erro: 'Erro ao deletar aluno' }), { status: 500 });
  }
}
