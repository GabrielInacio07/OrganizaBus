"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/user.service";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Clock } from "lucide-react";
import { BotaoSair } from "@/components/botaoSair";
import { BotaoVoltar } from "@/components/botaoVoltar";
import LoadingOverlay from "@/components/loadingOverlay";

export default function PerfilAluno() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const usuario = UserService.getCurrentUser();
    if (!usuario || usuario.tipo !== "aluno") {
      router.push("/rotas/login");
    } else {
      setUser(usuario);
      carregarPagamentos(usuario.id);
    }
  }, []);

  const carregarPagamentos = async (id) => {
    try {
      const res = await fetch(`/api/mp/pagamentos/aluno?alunoId=${id}`);
      const data = await res.json();
      setPagamentos(data);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
    }
  };

  const traduzirStatus = (status) => {
    const traducoes = {
      approved: "Pago",
      pending: "Pendente",
      rejected: "Recusado",
      in_process: "Em Processamento",
      refunded: "Reembolsado",
      cancelled: "Cancelado",
    };
    return traducoes[status] || status;
  };

  const handleAlterarSenha = async () => {
    try {
      await UserService.alterarSenha(user.email, novaSenha);
      setMensagem("Senha alterada com sucesso!");
      setNovaSenha("");
    } catch (error) {
      setMensagem(error.message);
    }
  };

  const handleLogout = () => {
    UserService.logout();
    router.push("/rotas/login");
  };
    const handeReturn = () => {
    router.push("/rotas/aluno");
    }

  if (!user) return <p>Carregando...</p>;

  return (
    <>
    <LoadingOverlay />
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil do Aluno</h1>
        <BotaoSair onClick={handleLogout} />
        <BotaoVoltar onClick={handeReturn}/> 
      </div>
        
      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <User size={16} /> Dados Pessoais
          </TabsTrigger>
         
        </TabsList>

        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Visualize e gerencie suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <p className="text-sm text-gray-700">{user.nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Alterar Senha</h3>
                <CardDescription>Digite uma nova senha segura.</CardDescription>
                <Input
                  type="password"
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full mt-2"
                />
                <Button onClick={handleAlterarSenha} className="mt-4">
                  Salvar nova senha
                </Button>
                {mensagem && <p className="mt-2 text-sm text-gray-700">{mensagem}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
      </Tabs>
    </div>
    </>
  );
}
