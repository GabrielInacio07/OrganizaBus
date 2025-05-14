import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mercadopago from "mercadopago";

const prisma = new PrismaClient();
mercadopago.configure({
    access_token: process.env.CHAVE,
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const motoristaId = parseInt(searchParams.get("motoristaId"));

    if (!motoristaId) {
        return NextResponse.json({ error: "Motorista não encontrado" }, { status: 400 });
    }
    const alunos = await prisma.aluno.findMany({
        where: { motoristaId },
        include: {
            pagamentos: true
        },
        orderBy: { id: "desc" },

    })
    // Após criar o pagamento com Mercado Pago
    await prisma.aluno.update({
        where: { id: userId },
        data: {
            statusPagamento: "gerado",
            codigoPix: mpResponse.qr_code,
            imagemPix: mpResponse.qr_code_base64,
        },
    })


    return NextResponse.json(alunos);
}