"use client";

import { useRouter } from "next/navigation";
import CheckoutAuxilio from "@/components/checkoutAuxilio";
import CheckoutPagar from "@/components/checkoutPagar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { UserService } from "@/services/user.service";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import NavbarAlt from "@/components/NavBarAlt";
import LoadingOverlay from "@/components/loadingOverlay";

export default function PaginaAluno() {
  const [aluno, setAluno] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(1);
const pagamentosPorPagina = 5;

const totalPaginas = Math.ceil(pagamentos.length / pagamentosPorPagina);
const inicio = (paginaAtual - 1) * pagamentosPorPagina;
const fim = inicio + pagamentosPorPagina;
const pagamentosPaginados = pagamentos.slice(inicio, fim);


  const traduzirStatus = (status) => {
    const traducoes = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
      in_process: "Em processamento",
      refunded: "Reembolsado",
      canceled: "Cancelado",
      not_paid: "Vencido",
    };
    return traducoes[status] || status;
  };

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const response = await UserService.buscarAluno();
        setAluno(response.data);

        const res = await fetch(
          `/api/mp/pagamentos/aluno?alunoId=${response.data.id}`
        );
        const data = await res.json();
        setPagamentos(data);
      } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
      }
    };

    fetchAluno();
  }, []);

 

  if (!aluno) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Carregando dados do aluno...
        </h1>
      </div>
    );
  }

  const valorMensalidade = parseFloat(aluno.valorMensalidade || 0);
  const valorBolsa =
    aluno.possuiBolsa && aluno.valorBolsa ? parseFloat(aluno.valorBolsa) : 0;
  const valorFinalMensalidade = valorMensalidade - valorBolsa;

  return (
    <>
      <LoadingOverlay />
      <NavbarAlt/>
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="w-36 h-36 rounded-full object-cover mx-auto mb-4 shadow-md ">
        <img
          src="/img/imagem-perfil.jpg"
          alt="Imagem de perfil do aluno"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center">
            Bem-vindo(a), <span className="text-primary">{aluno.nome}</span>
          </h1>

          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => router.push("/rotas/aluno/perfil-aluno")}
              className="gap-2"
            >
              <User size={18} />
              Acessar Perfil
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {aluno.possuiBolsa && (
              <CheckoutAuxilio
                title="Bolsa-Estudantil"
                price={valorBolsa}
                quantity={1}
                alunoId={aluno.id}
              />
            )}
            <CheckoutPagar
              title="Pagamento do Aluno"
              price={valorFinalMensalidade}
              quantity={1}
              alunoId={aluno.id}
            />
          </div>

          <div className="mt-10">
  <details open className="bg-white dark:bg-gray-800 rounded-md shadow p-4">
    <summary open className="cursor-pointer font-semibold text-lg">
      📜 Histórico de Pagamentos
    </summary>

<ul className="mt-4 space-y-3">
{pagamentosPaginados.map((p) => {
  const dataCriacao = new Date(p.criadoEm);
  const vencido = p.status !== "approved" && dataCriacao < new Date();

  return (
    <li
      key={p.id}
      className="border rounded-md p-3 text-sm bg-gray-50 dark:bg-gray-900"
    >
      <strong>{p.titulo}</strong> - R$ {Number(p.valor).toFixed(2)} -{" "}
      <span className={`font-semibold ${
        p.status === "approved"
          ? "text-green-600 dark:text-green-400"
          : "text-blue-600 dark:text-blue-300"
      }`}>
        {traduzirStatus(p.status)}
      </span>{" "}
      em {dataCriacao.toLocaleString("pt-BR")}

      {vencido && (
        <p className="text-red-600 dark:text-red-400 mt-1">
          🔴 Pagamento atrasado desde {dataCriacao.toLocaleDateString("pt-BR")}
        </p>
      )}

      {/* Botão para pagamento se ainda não pago */}
      {p.status !== "approved" && (
        <div className="mt-2">
          <CheckoutPagar
            title={p.titulo}
            price={Number(p.valor)}
            quantity={p.quantidade}
            alunoId={aluno.id}
            pagamentoIdExistente={p.pagamentoId}
          />
        </div>
      )}
    </li>
  );
})}

</ul>


    {/* Paginação */}
    {totalPaginas > 1 && (
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaAtual(i + 1)}
            className={`px-3 py-1 rounded ${
              paginaAtual === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )}
  </details>
</div>

        </div>
      </main>
      <Footer />
    </>
  );
}