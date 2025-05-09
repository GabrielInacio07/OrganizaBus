import prisma from '@/lib/prisma';

export async function POST(request) {
  const data = await request.json();
  const { nome, email, senha, tipo } = data;

  if (!['aluno', 'motorista'].includes(tipo)) {
    return new Response(JSON.stringify({ erro: 'Tipo inválido' }), { status: 400 });
  }

  try {
    const user = await prisma.usuario.create({
      data: { nome, email, senha, tipo },
    });
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ erro: 'Erro ao registrar' }), { status: 500 });
  }
}
