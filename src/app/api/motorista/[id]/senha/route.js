import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT - Alterar senha do motorista
export async function PUT(req, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const { senhaAtual, novaSenha } = await req.json();

    if (!id || isNaN(id)) {
      return NextResponse.json({ erro: "ID do motorista é obrigatório e deve ser válido" }, { status: 400 });
    }

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json({ erro: "Senha atual e nova senha são obrigatórias" }, { status: 400 });
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ erro: "A nova senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    // Buscar motorista
    const motorista = await prisma.user.findUnique({
      where: { 
        id,
        tipo: "motorista"
      }
    });

    if (!motorista) {
      return NextResponse.json({ erro: "Motorista não encontrado" }, { status: 404 });
    }

    // Verificar senha atual - aceita tanto texto simples quanto hash
    let senhaCorreta = false;
    
    // Se a senha no banco começa com $2a$, $2b$, etc., é um hash bcrypt
    if (motorista.senha.startsWith('$2')) {
      senhaCorreta = await bcrypt.compare(senhaAtual, motorista.senha);
    } else {
      // Senão, compara como texto simples
      senhaCorreta = senhaAtual === motorista.senha;
    }

    if (!senhaCorreta) {
      return NextResponse.json({ erro: "Senha atual incorreta" }, { status: 400 });
    }

    // Criptografar nova senha
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id },
      data: {
        senha: novaSenhaCriptografada
      }
    });

    return NextResponse.json({ 
      sucesso: true,
      mensagem: "Senha alterada com sucesso" 
    });

  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}