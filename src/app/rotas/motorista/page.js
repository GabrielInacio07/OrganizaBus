"use client";
import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  User,
  UserRoundPlus,
  LogOut,
} from "lucide-react";
import ResumoCard from "@/components/dashboard/ResumoCard";

export default function Motorista() {
  const DashboardChart = dynamic(() => import("@/components/dashComponent"), {
    ssr: false,
  });
  const router = useRouter();
  const [motorista, setMotorista] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    faculdade: "",
  });
  const [alunos, setAlunos] = useState([]);
  const [motoristaLogado, setMotoristaLogado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [data, setData] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    const usuario = UserService.getCurrentUser();
    if (!usuario) {
      router.push("/rotas/login");
    } else {
      setMotorista(usuario);
      setMotoristaLogado(usuario.tipo?.toLowerCase() === "motorista");
    }
  }, []);

  useEffect(() => {
    if (motorista && motorista.id) {
      carregarAlunos();
      carregarGrafico(motorista.id, mesSelecionado);
    }
  }, [motorista, mesSelecionado]);

  const carregarAlunos = async () => {
    try {
      const alunosCadastrados = await UserService.listarAlunos();
      setAlunos(alunosCadastrados);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
      setAlunos([]);
    }
  };

  const carregarGrafico = async (id, mes = mesSelecionado) => {
    console.log("🔁 carregando gráfico para:", { id, mes });
    setCarregandoDados(true);

    try {
      const res = await fetch(
        `/api/dashboard/pagamentos?motoristaId=${id}&mes=${mes}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("📊 dados recebidos:", result);

      const novosData = [
        { name: "Pagos", value: result.approved || 0 },
        { name: "Pendentes", value: result.pending || 0 },
        { name: "Não pagos após prazo", value: result.not_paid || 0 },
        { name: "Não gerados", value: result.nao_gerado || 0 },
      ];

      setData(novosData);
      setValorTotal(result.total_aprovado || 0);

      console.log("✅ Estado atualizado:", {
        novosData,
        valorTotal: result.total_aprovado,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar dados do gráfico:", error);
      // Resetar dados em caso de erro
      setData([
        { name: "Pagos", value: 0 },
        { name: "Pendentes", value: 0 },
        { name: "Não pagos após prazo", value: 0 },
        { name: "Não gerados", value: 0 },
      ]);
      setValorTotal(0);
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleMesChange = async (e) => {
    const novoMes = parseInt(e.target.value);
    console.log("📅 Mudando mês para:", novoMes);
    setMesSelecionado(novoMes);

    // Forçar recarregamento imediato dos dados
    if (motorista && motorista.id) {
      await carregarGrafico(motorista.id, novoMes);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const abrirModalEdicao = (aluno) => {
    setAlunoSelecionado(aluno);
    setFormData({
      nome: aluno.nome || "",
      email: aluno.email || "",
      telefone: aluno.telefone || "",
      cpf: aluno.cpf || "",
      faculdade: aluno.faculdade || "",
    });
    setShowEditModal(true);
  };

  const handleEditarAluno = async (e) => {
    e.preventDefault();
    try {
      await UserService.atualizarAluno(alunoSelecionado.id, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        faculdade: formData.faculdade,
      });
      Swal.fire("Atualizado!", "Aluno atualizado com sucesso.", "success");
      setShowEditModal(false);
      setAlunoSelecionado(null);
      await carregarAlunos();
    } catch (error) {
      alert("Erro ao atualizar aluno: " + error.message);
    }
  };

  const handleRemoverAluno = async (id) => {
    if (confirm("Tem certeza que deseja remover este aluno?")) {
      try {
        await UserService.removerAluno(id);
        alert("Aluno removido com sucesso.");
        await carregarAlunos();
        // Recarregar gráfico após remover aluno
        if (motorista && motorista.id) {
          await carregarGrafico(motorista.id, mesSelecionado);
        }
      } catch (error) {
        alert("Erro ao remover aluno: " + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const senhaAleatoria = Math.random().toString(36).slice(-8);
      const novoAluno = await UserService.registrarAluno(
        formData.nome,
        formData.email,
        formData.telefone,
        formData.cpf,
        senhaAleatoria,
        formData.faculdade,
        motorista.id
      );
      await UserService.enviarSenhaPorEmail(formData.email, senhaAleatoria);
      Swal.fire(
        "Sucesso!",
        "Aluno cadastrado e senha enviada por email.",
        "success"
      );
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        faculdade: "",
      });
      setShowModal(false);
      carregarAlunos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    UserService.logout();
    router.push("/rotas/login");
  };

  if (!motoristaLogado) return <div>Verificando login...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard do Motorista {motorista?.nome}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/rotas/perfil-motorista")}
            className="flex items-center gap-2"
          >
            <User size={16} />
            Meu Perfil
          </Button>
          <div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button>
                  {" "}
                  <UserRoundPlus size={16} />
                  Novo Aluno
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastro de Aluno</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  {["nome", "email", "telefone", "cpf", "faculdade"].map(
                    (campo) => (
                      <input
                        key={campo}
                        type={campo === "email" ? "email" : "text"}
                        name={campo}
                        value={formData[campo]}
                        onChange={handleChange}
                        placeholder={
                          campo.charAt(0).toUpperCase() + campo.slice(1)
                        }
                        className="border p-2 rounded w-full"
                        required
                      />
                    )
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <ResumoCard
          titulo="Total de Alunos"
          valor={alunos.length}
          Icone={Users}
          cor="text-blue-500"
        />
        <ResumoCard
          titulo="Pagamentos Aprovados"
          valor={data[0]?.value || 0}
          Icone={CheckCircle}
          cor="text-green-500"
        />
        <ResumoCard
          titulo="Pendentes"
          valor={data[1]?.value || 0}
          Icone={Clock}
          cor="text-yellow-500"
        />
        <ResumoCard
          titulo="Não Gerados"
          valor={data[3]?.value || 0}
          Icone={XCircle}
          cor="text-gray-400"
        />
        <ResumoCard
          titulo="Total Recebido"
          valor={`R$ ${valorTotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
          Icone={DollarSign}
          cor="text-emerald-600"
        />
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium mr-2">Filtrar por mês:</label>
        <select
          value={mesSelecionado}
          onChange={handleMesChange}
          className="border px-3 py-1 rounded"
          disabled={carregandoDados}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
            <option key={mes} value={mes}>
              {new Date(0, mes - 1).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>
        {carregandoDados && (
          <span className="ml-2 text-sm text-gray-500">Carregando...</span>
        )}
      </div>
      <DashboardChart
        data={data}
        motoristaId={motorista?.id}
        mesSelecionado={mesSelecionado}
      />

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditarAluno} className="grid gap-4 py-4">
            {["nome", "email", "telefone", "cpf", "faculdade"].map((campo) => (
              <input
                key={campo}
                type={campo === "email" ? "email" : "text"}
                name={campo}
                value={formData[campo]}
                onChange={handleChange}
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                className="border p-2 rounded w-full"
                required
              />
            ))}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <h2 className="text-xl font-semibold mt-12 mb-2">Alunos Cadastrados</h2>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Faculdade</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Pix</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id} className="border-t">
                <td className="px-4 py-2">{aluno.nome}</td>
                <td className="px-4 py-2">{aluno.email}</td>
                <td className="px-4 py-2">{aluno.faculdade}</td>
                <td className="px-4 py-2">{aluno.telefone}</td>
                <td className="px-4 py-2">
                  {aluno.pagamentos?.length
                    ? aluno.pagamentos.map((p) => (
                        <div key={p.id}>
                          <strong>{p.titulo}</strong>:{" "}
                          {p.status === "approved" ? "Pago" : "Pendente"}
                        </div>
                      ))
                    : "Não gerado"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => abrirModalEdicao(aluno)}
                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoverAluno(aluno.id)}
                    className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
