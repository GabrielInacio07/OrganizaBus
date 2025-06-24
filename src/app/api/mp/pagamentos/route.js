import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mercadopago from "mercadopago";

const prisma = new PrismaClient();

if (!process.env.CHAVE) {
  throw new Error("MERCADO_PAGO_ACCESS_TOKEN não está definido no .env.local");
}

mercadopago.configure({
  access_token: process.env.CHAVE,
});

export async function POST(req) {
  try {
    const { title, price, quantity, payer, userId, tipo, statusManual } = await req.json();
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    // Verifica se já foi pago neste mês
    const pagamentoAprovadoMes = await prisma.pagamento.findFirst({
      where: {
        alunoId: userId,
        tipo,
        status: "approved",
        criadoEm: {
          gte: new Date(anoAtual, mesAtual, 1),
          lt: new Date(anoAtual, mesAtual + 1, 1),
        },
      },
    });

    if (pagamentoAprovadoMes) {
      return NextResponse.json({
        pagamentoId: pagamentoAprovadoMes.pagamentoId,
        status: pagamentoAprovadoMes.status,
        qr_code: pagamentoAprovadoMes.codigo_pix,
        mensagem: "Pagamento já foi feito neste mês.",
      });
    }

    // Se ainda não aprovado, verifica se há pendente válido
    const pagamentoExistente = await prisma.pagamento.findFirst({
      where: {
        alunoId: userId,
        tipo,
        status: { not: "approved" },
        expiraEm: { gt: agora },
      },
      orderBy: { criadoEm: "desc" },
    });

    if (pagamentoExistente) {
      return NextResponse.json({
        pagamentoId: pagamentoExistente.pagamentoId,
        status: pagamentoExistente.status,
        qr_code: pagamentoExistente.codigo_pix,
        mensagem: "Pagamento pendente ainda válido.",
      });
    }

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

    let payment = { body: {} };
    let transacao = { qr_code: null };

    if (statusManual === "approved") {
      payment.body = {
        id: `manual-${Date.now()}`,
        status: "approved",
      };
    } else {
      payment = await mercadopago.payment.create(payment_data);
      transacao = payment.body.point_of_interaction.transaction_data;
    }

    const novoPagamento = await prisma.pagamento.create({
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
        tipo,
      },
    });

    return NextResponse.json({
      pagamentoId: payment.body.id,
      status: payment.body.status,
      qr_code: transacao.qr_code,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar pagamento: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
