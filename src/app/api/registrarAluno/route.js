import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { nome, email, telefone, cpf, senha, faculdade, tipo, motoristaId } = body;

  try {
    const existente = await prisma.aluno.findUnique({ where: { email } });
    if (existente) {
      return new Response(JSON.stringify({ erro: 'Aluno já existe' }), { status: 400 });
    }

    const novoAluno = await prisma.aluno.create({
      data: { nome, email, telefone, cpf, senha, faculdade, tipo, motoristaId },
    });

    return new Response(JSON.stringify(novoAluno), { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar aluno:", error);
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }
}
