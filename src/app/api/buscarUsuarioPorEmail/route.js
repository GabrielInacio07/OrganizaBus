import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ erro: 'Email não fornecido' }), { status: 400 });
    }

    const aluno = await prisma.aluno.findUnique({ where: { email } });
    if (aluno) {
      return new Response(JSON.stringify(aluno), { status: 200 });
    }

    const motorista = await prisma.user.findUnique({ where: { email } });
    if (motorista) {
      return new Response(JSON.stringify(motorista), { status: 200 });
    }

    return new Response(JSON.stringify({ erro: 'Usuário não encontrado' }), { status: 404 });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(JSON.stringify({ erro: 'Erro interno' }), { status: 500 });
  }
}
