import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { email, novaSenha } = await req.json();

    if (!email || !novaSenha) {
      return new Response(JSON.stringify({ erro: 'Dados incompletos' }), { status: 400 });
    }

    const aluno = await prisma.aluno.update({
      where: { email },
      data: { senha: novaSenha },
    });

    return new Response(JSON.stringify({ mensagem: 'Senha atualizada com sucesso', aluno }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return new Response(JSON.stringify({ erro: 'Erro interno ao atualizar senha' }), { status: 500 });
  }
}
