"use client";

import { useRouter } from "next/navigation";
import CheckoutAuxilio from "@/components/checkoutAuxilio";
import CheckoutPagar from "@/components/checkoutPagar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { UserService } from "@/services/user.service";
import { BotaoSair } from "@/components/botaoSair";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function PaginaAluno() {
 const [aluno, setAluno] = useState(null);
const router = useRouter();

useEffect(() => {
  const fetchAluno = async () => {
    try {
      const response = await UserService.buscarAluno();
      console.log("ALUNO RECEBIDO:", response.data); // <= adicione isso
      setAluno(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do aluno:", error);
    }
  };
  fetchAluno();
}, []);

const handleLogout = () => {
  UserService.logout();
  router.push("/rotas/login");
};

if (!aluno) {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Carregando dados do aluno...
      </h1>
    </div>
  );
}

// mover para cá
const valorMensalidade = parseFloat(aluno.valorMensalidade || 0);
const valorBolsa = aluno.possuiBolsa && aluno.valorBolsa ? parseFloat(aluno.valorBolsa) : 0;
const valorFinalMensalidade = valorMensalidade - valorBolsa;
console.log('Aluno:', aluno);

  return (
    <>
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
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
            <BotaoSair onClick={handleLogout} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {aluno.possuiBolsa  && (
              <CheckoutAuxilio
                title="Bolsa-Estudantil"
                price={aluno.valorBolsa}
                quantity={1}
                alunoId={aluno.id}
              />
            )}

            <CheckoutPagar
              title="Pagamento do Aluno"
              price={valorFinalMensalidade}
              quantity={1}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
