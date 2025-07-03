import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import mercadopago from 'mercadopago';

const prisma = new PrismaClient();

mercadopago.configure({
  access_token: process.env.CHAVE, // sua chave de produção ou sandbox
});

export async function POST(req) {
  try {
    // (Opcional) Validação de assinatura - apenas se você quiser habilitar no futuro:
    /*
    const signature = req.headers.get("x-signature");
    if (signature !== process.env.MP_WEBHOOK_SECRET) {
      console.warn("Assinatura inválida:", signature);
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }
    */

    const body = await req.json();
    console.log("🔔 Webhook recebido:", body);

    if (body.type !== 'payment') {
      return NextResponse.json({ msg: 'Evento ignorado. Não é pagamento.' });
    }

    const paymentId = body.data.id;
    const payment = await mercadopago.payment.findById(paymentId);

    const status = payment.body.status;
    console.log(`✅ Pagamento ${paymentId} com status: ${status}`);

    const resultado = await prisma.pagamento.updateMany({
      where: { pagamentoId: String(paymentId) },
      data: { status },
    });

    console.log("📦 Banco atualizado:", resultado);

    return NextResponse.json({ msg: 'Webhook processado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro no webhook:', err);
    return NextResponse.json({ error: 'Erro ao processar webhook.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
