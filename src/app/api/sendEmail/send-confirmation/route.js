import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { to, nome, valor, titulo } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"OrganizaBus" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Confirmação de Pagamento Recebido",
      text: `Olá ${nome},

Recebemos o pagamento de R$ ${Number(valor).toFixed(2)} referente a: "${titulo}".

Obrigado por utilizar o OrganizaBus!`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}
