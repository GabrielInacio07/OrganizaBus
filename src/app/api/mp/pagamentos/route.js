import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mercadopago from "mercadopago";

const prisma = new PrismaClient();
mercadopago.configure({
  access_token: process.env.CHAVE,
});

export	async function GET(req){
    const { searchParams } = new URL(req.url);
    const motoristaId = parseInt(searchParams.get("motoristaId"));

    if(!motoristaId){
        return NextResponse.json({error: "Motorista não encontrado"}, {status: 400});
    }
    const alunos = await prisma.aluno.findMany({
        where:{ motoristaId},
        include:{
            pagamentos:true
        },
    })
    return NextResponse.json(alunos);
}