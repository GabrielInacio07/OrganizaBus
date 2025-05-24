import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    // Primeiro tenta na tabela 'user' (motorista)
    let usuario = await prisma.user.findUnique({ where: { email } });

    // Se não encontrar, tenta na tabela 'aluno'
    if (!usuario) {
      usuario = await prisma.aluno.findUnique({ where: { email } });
    }

    if (!usuario) {
      return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 });
    }

    // Verificar senha - aceita tanto texto simples quanto hash (para migração)
    let senhaCorreta = false;
    
    // Se a senha no banco começa com $2, é um hash bcrypt
    if (usuario.senha.startsWith('$2')) {
      senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    } else {
      // Senão, compara como texto simples (para senhas antigas)
      senhaCorreta = senha === usuario.senha;
    }

    if (!senhaCorreta) {
      return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 });
    }

    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      tipo: usuario.tipo?.toUpperCase() || 'ALUNO',
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}