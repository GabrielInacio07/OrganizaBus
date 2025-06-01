"use client";

import { useRouter } from "next/navigation";
import CheckoutAuxilio from "@/components/checkoutAuxilio";
import CheckoutPagar from "@/components/checkoutPagar";
import { Button } from "@/components/ui/button";
import { User, CreditCard } from "lucide-react";

export default function PaginaAluno() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo(a), Aluno</h1>

      <div className="space-y-4">
        <div className="flex gap-4">
          <CheckoutAuxilio title="Bolsa-Estudantil" price={280} quantity={1} />
          <CheckoutPagar title="Pagamento do Aluno" price={220} quantity={1} />
        </div>

        <Button
          onClick={() => router.push("/rotas/aluno/perfil-aluno")}
          className="flex items-center gap-2"
        >
          <User size={18} />
          Acessar Perfil
        </Button>
      </div>
    </div>
  );
}
