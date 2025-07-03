"use client";
import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
export default function PerfilMotorista() {
  const router = useRouter();
  const [motorista, setMotorista] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [dadosPessoais, setDadosPessoais] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [dadosSenha, setDadosSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [mostrarSenhas, setMostrarSenhas] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  });

  const [salvandoDados, setSalvandoDados] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  useEffect(() => {
    const usuario = UserService.getCurrentUser();
    if (!usuario || usuario.tipo?.toLowerCase() !== "motorista") {
      router.push("/rotas/login");
      return;
    }
    carregarDadosMotorista(usuario.id);
  }, []);

  const carregarDadosMotorista = async (id) => {
    try {
      setCarregando(true);
      const dados = await UserService.obterPerfilMotorista(id);
      setMotorista(dados);
      setDadosPessoais({
        nome: dados.nome || "",
        email: dados.email || "",
        telefone: dados.telefone || "",
        cpf: dados.cpf || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Swal.fire("Erro!", "Não foi possível carregar seus dados.", "error");
      router.push("/rotas/motorista");
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e, setState) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const toggleMostrarSenha = (campo) => {
    setMostrarSenhas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const salvarDadosPessoais = async (e) => {
    e.preventDefault();

    const { nome, email, telefone, cpf } = dadosPessoais;

    if (!nome || !email || !telefone || !cpf) {
      Swal.fire("Erro!", "Todos os campos devem ser preenchidos.", "error");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Swal.fire("Erro!", "Informe um email válido.", "error");
      return;
    }

    if (cpf.length !== 11) {
      Swal.fire("Erro!", "CPF deve conter 11 dígitos.", "error");
      return;
    }

    try {
      setSalvandoDados(true);
      await UserService.atualizarPerfilMotorista(motorista.id, dadosPessoais);

      Swal.fire("Sucesso!", "Seus dados foram atualizados.", "success");
      await carregarDadosMotorista(motorista.id);
    } catch (error) {
      console.error(error);
      Swal.fire("Erro!", error.message || "Erro ao salvar dados.", "error");
    } finally {
      setSalvandoDados(false);
    }
  };

  const alterarSenha = async (e) => {
    e.preventDefault();
    const { senhaAtual, novaSenha, confirmarSenha } = dadosSenha;

    if (novaSenha !== confirmarSenha) {
      Swal.fire("Erro!", "A nova senha e a confirmação não coincidem.", "error");
      return;
    }

    if (novaSenha.length < 6) {
      Swal.fire("Erro!", "A nova senha deve ter ao menos 6 caracteres.", "error");
      return;
    }

    try {
      setAlterandoSenha(true);
      await UserService.alterarSenhaMotorista(
        motorista.id,
        senhaAtual,
        novaSenha
      );

      Swal.fire("Sucesso!", "Senha alterada com sucesso.", "success");
      setDadosSenha({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      setMostrarSenhas({ senhaAtual: false, novaSenha: false, confirmarSenha: false });
    } catch (error) {
      console.error(error);
      Swal.fire("Erro!", error.message || "Erro ao alterar senha.", "error");
    } finally {
      setAlterandoSenha(false);
    }
  };

  const voltarParaDashboard = () => router.push("/rotas/motorista");

  if (carregando) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando seus dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={voltarParaDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>

      <Tabs defaultValue="dados-pessoais" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dados-pessoais" className="flex items-center gap-2">
            <User size={16} />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="alterar-senha" className="flex items-center gap-2">
            <Lock size={16} />
            Alterar Senha
          </TabsTrigger>
        </TabsList>

        {/* === DADOS PESSOAIS === */}
        <TabsContent value="dados-pessoais">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={salvarDadosPessoais} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nome Completo", name: "nome", icon: <User size={14} /> },
                    { label: "Email", name: "email", icon: <Mail size={14} />, type: "email" },
                    { label: "Telefone", name: "telefone", icon: <Phone size={14} /> },
                    { label: "CPF", name: "cpf", icon: <FileText size={14} /> },
                  ].map(({ label, name, icon, type = "text" }) => (
                    <div key={name}>
                      <label htmlFor={name} className="block text-sm font-medium mb-1">
                        {icon} {label}
                      </label>
                      <input
                        id={name}
                        type={type}
                        name={name}
                        value={dadosPessoais[name]}
                        onChange={(e) => handleChange(e, setDadosPessoais)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={salvandoDados}>
                    {salvandoDados ? "Salvando..." : "Salvar Dados"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ALTERAR SENHA === */}
        <TabsContent value="alterar-senha">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} />
                Alterar Senha
              </CardTitle>
              <CardDescription>Altere sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={alterarSenha} className="space-y-4">
                {[
                  { label: "Senha Atual", name: "senhaAtual" },
                  { label: "Nova Senha", name: "novaSenha" },
                  { label: "Confirmar Nova Senha", name: "confirmarSenha" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium mb-1">
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        id={name}
                        type={mostrarSenhas[name] ? "text" : "password"}
                        name={name}
                        value={dadosSenha[name]}
                        onChange={(e) => handleChange(e, setDadosSenha)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => toggleMostrarSenha(name)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {mostrarSenhas[name] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={alterandoSenha}>
                    {alterandoSenha ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}