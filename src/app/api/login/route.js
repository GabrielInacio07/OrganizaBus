import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuario || usuario.senha !== senha) {
      return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 });
    }

    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      tipo: usuario.tipo.toUpperCase(),
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}
