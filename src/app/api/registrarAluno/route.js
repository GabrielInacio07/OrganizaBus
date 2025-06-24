import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const {
    nome,
    email,
    telefone,
    cpf,
    senha,
    faculdade,
    tipo,
    motoristaId,
    possuiBolsa,
    valorBolsa,
    statusPagamento,
  } = body;

  try {
    // Log para depuração
    console.log("Dados recebidos na API:", body);

    const existente = await prisma.aluno.findUnique({ where: { email } });
    if (existente) {
      return new Response(JSON.stringify({ erro: "Aluno já existe" }), {
        status: 400,
      });
    }

    const motorista = await prisma.user.findUnique({
      where: { id: parseInt(motoristaId) }, // Converte motoristaId para inteiro
    });

    if (!motorista) {
      return new Response(JSON.stringify({ erro: "Motorista não encontrado" }), {
        status: 404,
      });
    }

    const valorMensalidade = motorista.valorMensalidade;
    if (!valorMensalidade || valorMensalidade <= 0) {
      return new Response(JSON.stringify({ erro: "Motorista deve ter um valor de mensalidade válido definido" }), {
        status: 400,
      });
    }

    const novoAluno = await prisma.aluno.create({
      data: {
        nome,
        email,
        telefone,
        cpf,
        senha,
        faculdade,
        tipo,
        motoristaId: parseInt(motoristaId), // Garante que motoristaId seja inteiro
        valorMensalidade: parseFloat(valorMensalidade), // Garante que é float
        possuiBolsa: Boolean(possuiBolsa), // Converte para booleano
        valorBolsa: Boolean(possuiBolsa) ? parseFloat(valorBolsa) || 0 : null,
        statusPagamento,
      },
    });

    return new Response(JSON.stringify(novoAluno), { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar aluno:", error);
    return new Response(JSON.stringify({ erro: error.message }), {
      status: 500,
    });
  }
}