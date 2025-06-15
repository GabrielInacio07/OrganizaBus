// /api/pagamento/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mercadopago from "mercadopago";

const prisma = new PrismaClient();

mercadopago.configure({
  access_token: process.env.CHAVE,
});

export async function POST(req) {
  try {
    const { title, price, quantity, payer, userId,tipo } = await req.json();

    const payment_data = {
      transaction_amount: price,
      description: title,
      payment_method_id: "pix",
      payer: {
        email: payer?.email || "teste@email.com",
        first_name: payer?.first_name || "Aluno",
        last_name: payer?.last_name || "",
      },
    };

    const payment = await mercadopago.payment.create(payment_data);
    const transacao = payment.body.point_of_interaction.transaction_data;

    // Criar registro do pagamento
    await prisma.pagamento.create({
      data: {
        titulo: title,
        valor: price,
        quantidade: quantity,
        status: payment.body.status,
        qr_code: transacao.qr_code,
        codigo_pix: transacao.qr_code,
        pagamentoId: String(payment.body.id),
        alunoId: userId,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000),
        tipo: tipo
      },
    });

    return NextResponse.json({
      pagamentoId: payment.body.id,
      status: payment.body.status,
      qr_code: transacao.qr_code,
      qr_code_base64: transacao.qr_code_base64,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
