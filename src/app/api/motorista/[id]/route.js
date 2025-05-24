import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

// GET - Buscar motorista por ID
export async function GET(req, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const id = parseInt(resolvedParams?.id);

    if (isNaN(id)) {
      return NextResponse.json({ erro: "ID inválido" }, { status: 400 });
    }

    const motorista = await prisma.user.findUnique({
      where: {
        id,
        tipo: "motorista"
      },
    });

    if (!motorista) {
      return NextResponse.json({ erro: "Motorista não encontrado" }, { status: 404 });
    }

    return NextResponse.json(motorista);
  } catch (error) {
    console.error("Erro ao buscar motorista:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT - Atualizar motorista por ID
export async function PUT(req, context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ erro: "ID inválido" }, { status: 400 });
    }

    const data = await req.json();

    const motoristaExistente = await prisma.user.findUnique({
      where: {
        id,
        tipo: "motorista"
      },
    });

    if (!motoristaExistente) {
      return NextResponse.json({ erro: "Motorista não encontrado" }, { status: 404 });
    }

    const motoristaAtualizado = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(motoristaAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar motorista:", error);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}