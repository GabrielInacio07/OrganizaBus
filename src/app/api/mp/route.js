import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mercadopago from "mercadopago";

const prisma = new PrismaClient();

mercadopago.configure({
  access_token: process.env.CHAVE,
});

export async function POST(req) {
  try {
    const { title, price, quantity, payer, userId } = await req.json();

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

    //Salvar no banco de dados
    await prisma.pagamento.create({
      data: {
        titulo: title,
        valor: price,
        quantidade: quantity,
        status: payment.body.status,
        qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
        qr_code_base64:
          payment.body.point_of_interaction.transaction_data.qr_code_base64,
        codigo_pix: payment.body.point_of_interaction.transaction_data.qr_code,
        pagamentoId: String(payment.body.id),
        alunoId: userId,
      },
    });

    return NextResponse.json({
      pagamentoId: payment.body.id,
      status: payment.body.status,
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        payment.body.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error("Erro ao criar pix:", error);
    return NextResponse.json(
      { error: "Erro ao criar paagamento" },
      { status: 500 }
    );
  }
}
