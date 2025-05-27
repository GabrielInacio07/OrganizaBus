
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
import CheckoutAuxilio from "@/components/checkoutAuxilio";
import CheckoutPagar from "@/components/checkoutPagar";

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

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil do Aluno</h1>
        <BotaoSair onClick={handleLogout} />
      </div>

      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <User size={16} /> Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Clock size={16} /> Histórico de Pagamentos
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

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>Acompanhe seus pagamentos e gere novos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckoutAuxilio title="Bolsa-Estudantil" price={280} quantity={1} />
                  <CheckoutPagar title="Pagamento do Aluno" price={220} quantity={1} />
                </div>
                <ul className="space-y-2">
                  {pagamentos.map((p) => (
                    <li
                      key={p.id}
                      className="border px-4 py-2 rounded-md bg-gray-100 text-sm"
                    >
                      <strong>{p.titulo}</strong> - R${" "}
                      {Number(p.valor).toFixed(2)} - {p.status} em
                      {" "}
                      {new Date(p.criadoEm).toLocaleString("pt-BR")}
                    </li>
                  ))}
                  {pagamentos.length === 0 && <p>Nenhum pagamento encontrado.</p>}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}