import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const body = await req.json();
  console.log("Body recebido:", body);
  const { nome, email, telefone, cpf, senha, tipo, valorMensalidade } = body;

  try {
    // Verificar se já existe usuário com este email
    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      return NextResponse.json({ erro: 'Usuário já existe' }, { status: 400 });
    }

    // Validações básicas
    if (!nome || !email || !telefone || !cpf || !senha || !tipo) {
      return NextResponse.json({ erro: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    if (senha.length < 6) {
      return NextResponse.json({ erro: 'A senha deve ter pelo menos 6 caracteres' }, { status: 400 });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const novo = await prisma.user.create({
      data: { 
        nome, 
        email, 
        telefone, 
        cpf, 
        senha: senhaCriptografada, 
        tipo,
        valorMensalidade: parseFloat(valorMensalidade || 0),
      },
    });

    // Retornar usuário sem a senha
    const { senha: _, ...usuarioSemSenha } = novo;
    
    return NextResponse.json(usuarioSemSenha, { status: 201 });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ erro: 'Erro interno do servidor' }, { status: 500 });
  }
}