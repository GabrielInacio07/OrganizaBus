import nodemailer from 'nodemailer';

export async function POST(req) {
  const { to, subject, text } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls:{
      rejectUnauthorized: false // Permite conexões TLS não verificadas
    }
  });

  try {
    await transporter.sendMail({
      from: `"OrganizaBus" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return new Response('Email enviado com sucesso', { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return new Response('Erro ao enviar email', { status: 500 });
  }
}
