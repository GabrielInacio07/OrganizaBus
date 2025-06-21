import { NextResponse } from "next/server";
import mercadopago from "mercadopago";
import prisma from "@/lib/prisma";

mercadopago.configure({
    access_token: process.env.CHAVE
})
export async function POST(req){
    try{
        const body = await req.json();
        if(body.type !== 'payment'){
            return NextResponse.json({message: 'Tipo de evento inválido'}, {status: 400});
        }
        const paymentId = body.data.id;
        const payment = await mercadopago.payment.findById(paymentId)

        if(payment.body.status !== 'approved'){
            const pagamentoAtualizado = await prisma.pagamento.updateMany({
                where: {
                 pagamentoId: String(paymentId),
                },
                data:{
                    status: 'approved   ',
                }
            })
            return NextResponse.json({message: 'Pagamento atualizado com sucesso'}, {status: 200});
        }
        return NextResponse.json({message: 'Pagamento nao aprovado'})
    }catch(error){
        console.log("Erro ao processar webhook:", error);
        return NextResponse.json({message: 'Erro interno do Webhook'}, {status: 500});
        
    }
}