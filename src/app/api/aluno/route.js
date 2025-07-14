import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const motoristaId = parseInt(searchParams.get("motoristaId"));

  if (!motoristaId) {
    return NextResponse.json({ erro: "Motorista não encontrado" }, { status: 400 });
  }

  const alunos = await prisma.aluno.findMany({
    where: { motoristaId },
    include: {
      pagamentos: {
        orderBy: { criadoEm: "desc" },
        take: 1,
      },
      motorista: {
        select: {
          diaVencimento: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  // Insere diaVencimento manualmente no aluno
  const alunosComVencimento = alunos.map((aluno) => ({
    ...aluno,
    diaVencimento: aluno.motorista?.diaVencimento || 10,
  }));

  return NextResponse.json(alunosComVencimento);
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ erro: "ID do aluno não fornecido" }, { status: 400 });
    }

    // Apagar pagamentos antes (se houver)
    await prisma.pagamento.deleteMany({
      where: { alunoId: id }
    });

    // Agora apagar o aluno
    await prisma.aluno.delete({
      where: { id },
    });

    return NextResponse.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao remover aluno:", err);
    return NextResponse.json({ erro: "Erro ao remover aluno" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      nome,
      email,
      telefone,
      cpf,
      faculdade,
      possuiBolsa,
      valorBolsa,
    } = body;

    if (!id) {
      return NextResponse.json({ erro: "ID do aluno não fornecido" }, { status: 400 });
    }

    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: parseInt(id) },
    });

    if (!alunoExistente) {
      return NextResponse.json({ erro: "Aluno não encontrado" }, { status: 404 });
    }

    const dadosAtualizados = {
      nome,
      email,
      telefone,
      cpf,
      faculdade,
      possuiBolsa: possuiBolsa || false,
      valorBolsa: possuiBolsa ? parseFloat(valorBolsa) : null,
    };

    const alunoAtualizado = await prisma.aluno.update({
      where: { id: parseInt(id) },
      data: dadosAtualizados,
    });

    return NextResponse.json(alunoAtualizado, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}