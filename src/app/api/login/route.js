import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    // Tenta encontrar como motorista
    let usuario = await prisma.user.findUnique({ where: { email } });

    // Se não for motorista, tenta encontrar como aluno (já incluindo os campos extras)
    if (!usuario) {
      usuario = await prisma.aluno.findUnique({
        where: { email },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cpf: true,
          tipo: true,
          senha: true,
          valorMensalidade: true,
          valorBolsa: true,
          possuiBolsa: true,
        },
      });
    }

    // Se ainda não encontrou
    if (!usuario) {
      return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 });
    }

    // Verifica a senha (hash ou texto plano)
    let senhaCorreta = false;

    if (usuario.senha.startsWith('$2')) {
      senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    } else {
      senhaCorreta = senha === usuario.senha;
    }

    if (!senhaCorreta) {
      return NextResponse.json({ erro: 'Email ou senha inválidos' }, { status: 401 });
    }

    // Monta resposta comum
    const retorno = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      tipo: usuario.tipo?.toUpperCase() || 'ALUNO',
    };

    // Se for aluno, adiciona campos financeiros
    if (usuario.tipo?.toLowerCase() === 'aluno' || usuario.valorMensalidade !== undefined) {
      retorno.valorMensalidade = usuario.valorMensalidade || 0;
      retorno.valorBolsa = usuario.valorBolsa || 0;
      retorno.possuiBolsa = usuario.possuiBolsa === true;
    }

    return NextResponse.json(retorno);
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}
