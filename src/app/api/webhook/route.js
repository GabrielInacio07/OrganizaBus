import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import mercadopago from 'mercadopago';

const prisma = new PrismaClient();

mercadopago.configure({
  access_token: process.env.CHAVE, // já está configurado corretamente
});

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("❌ Conteúdo inválido:", contentType);
      return new Response("Unsupported content type", { status: 400 });
    }

    const body = await req.json();
    console.log("✅ Webhook body:", body);

    const paymentId = body?.data?.id;
    if (!paymentId) {
      return new Response("ID do pagamento ausente", { status: 400 });
    }

    const payment = await mercadopago.payment.findById(paymentId);

    await prisma.pagamento.updateMany({
      where: { pagamentoId: String(paymentId) },
      data: { status: payment.body.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 Erro no webhook:", error.message);
    return new Response("Erro no webhook", { status: 500 });
  }
}
