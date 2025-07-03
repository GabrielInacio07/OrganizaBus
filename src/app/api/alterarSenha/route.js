import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

async function enviarEmailConfirmacao(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"OrganizaBus" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Sua senha foi redefinida',
    text: `Olá,\n\nSua senha foi atualizada com sucesso.\n\nSe você não solicitou essa alteração, entre em contato imediatamente com o suporte.\n\nEquipe OrganizaBus`,
  });
}

export async function PUT(req) {
  try {
    const { email, novaSenha } = await req.json();

    if (!email || !novaSenha) {
      return new Response(JSON.stringify({ erro: 'Dados incompletos' }), { status: 400 });
    }

    const aluno = await prisma.aluno.findUnique({ where: { email } });
    const motorista = await prisma.user.findUnique({ where: { email } });

    if (aluno) {
      await prisma.aluno.update({ where: { email }, data: { senha: novaSenha } });
    } else if (motorista) {
      await prisma.user.update({ where: { email }, data: { senha: novaSenha } }); // <-- Corrigido aqui
    } else {
      return new Response(JSON.stringify({ erro: 'Usuário não encontrado' }), { status: 404 });
    }

    await enviarEmailConfirmacao(email);

    return new Response(JSON.stringify({ mensagem: 'Senha atualizada com sucesso' }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return new Response(JSON.stringify({ erro: 'Erro interno ao atualizar senha' }), { status: 500 });
  }
}
