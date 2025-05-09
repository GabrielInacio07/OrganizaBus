import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { nome, email, telefone, cpf, senha, tipo } = body;

  try {
    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      return new Response(JSON.stringify({ erro: 'Usuário já existe' }), { status: 400 });
    }

    const novo = await prisma.user.create({
      data: { nome, email, telefone, cpf, senha, tipo },
    });

    return new Response(JSON.stringify(novo), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }
}
