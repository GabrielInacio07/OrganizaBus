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
import Footer from "@/components/Footer";

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
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
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
    setCarregandoDados(true);

    try {
      const res = await fetch(
        `/api/dashboard/pagamentos?motoristaId=${id}&mes=${mes}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      const naoPagosTotal =
        (result.not_paid || 0) +
        (result.pending || 0) +
        (result.nao_gerado || 0);

      const novosData = [
        { name: "Pagos", value: result.approved || 0 },
        { name: "Não Pagos", value: naoPagosTotal },
      ];

      setData(novosData);
      setValorTotal(result.total_aprovado || 0);
    } catch (error) {
      console.error("Erro ao carregar dados do gráfico:", error);
      setData([
        { name: "Pagos", value: 0 },
        { name: "Não pagos ", value: 0 },
        { name: "Não Pagos", value: 0 },
      ]);
      setValorTotal(0);
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleMesChange = async (e) => {
    const novoMes = parseInt(e.target.value);
    setMesSelecionado(novoMes);
    if (motorista && motorista.id) {
      await carregarGrafico(motorista.id, novoMes);
    }
  };

  const handleAnoChange = (e) => {
    setAnoSelecionado(Number(e.target.value));
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
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Dashboard do Motorista {motorista?.nome}
          </h1>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button
              variant="outline"
              onClick={() => router.push("/rotas/perfil-motorista")}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <User size={16} />
              Meu Perfil
            </Button>
            {/* Botão para abrir o modal de cadastro de aluno */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 whitespace-nowrap">
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
            {/* Botão para abrir o modal de edição de aluno */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Editar Aluno</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditarAluno} className="grid gap-4 py-4">
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
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {/* Botão de logout */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <ResumoCard
              title="Alunos"
              icon={Users}
              value={alunos.length}
              color="bg-blue-500"
            />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <ResumoCard
              title="Pagos"
              icon={CheckCircle}
              value={data.find((d) => d.name === "Pagos")?.value || 0}
              color="bg-green-500"
            />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <ResumoCard
              title="Não pagos"
              icon={XCircle}
              value={
                data.find((d) => d.name === "Não pagos após prazo")?.value || 0
              }
              color="bg-red-500"
            />
          </div>
        </div>
        {/* Filtros de Mês e Ano */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={mesSelecionado}
            onChange={handleMesChange}
            className="border p-2 rounded w-full sm:w-auto"
          >
            {[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ].map((mes, index) => (
              <option key={index + 1} value={index + 1}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={anoSelecionado}
            onChange={handleAnoChange}
            className="border p-2 rounded w-full sm:w-auto"
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>

        {/* Gráfico */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-10">
          {carregandoDados ? (
            <div className="text-center text-gray-500">
              Carregando gráfico...
            </div>
          ) : (
            <DashboardChart data={data} valorTotal={valorTotal} />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="todos">Todos</option>
            <option value="pago">Pagos</option>
            <option value="nao-pago">Não pagos</option>
          </select>
        </div>

        {/* Lista de Alunos */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4">Alunos Cadastrados</h2>

          {alunos.length === 0 ? (
            <p className="text-gray-500">Nenhum aluno encontrado.</p>
          ) : (
            <div className="space-y-4">
              {alunos
                .filter((aluno) => {
                  if (filtroStatus === "todos") return true;

                  const ultimoPix = aluno.pagamentos?.find(
                    (p) => p.tipo === "mensalidade"
                  );
                  const ultimoAux = aluno.pagamentos?.find(
                    (p) => p.tipo === "auxilio"
                  );

                  const estaPago = [ultimoPix, ultimoAux].some(
                    (p) => p?.status === "approved"
                  );

                  return filtroStatus === "pago" ? estaPago : !estaPago;
                })
                .map((aluno) => {
                  const ultimoPix = aluno.pagamentos?.find(
                    (p) => p.tipo === "mensalidade"
                  );
                  const ultimoAux = aluno.pagamentos?.find(
                    (p) => p.tipo === "auxilio"
                  );

                  return (
                    <div
                      key={aluno.id}
                      className="border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <p className="font-semibold">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">{aluno.email}</p>

                        <div className="mt-2 space-y-1">
                          <p>
                            💰 <strong>Mensalidade:</strong>{" "}
                            {ultimoPix?.status || "Não registrado"}
                          </p>
                          <p>
                            🎓 <strong>Auxílio:</strong>{" "}
                            {ultimoAux?.status || "Não registrado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => abrirModalEdicao(aluno)}
                          variant="outline"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleRemoverAluno(aluno.id)}
                          variant="destructive"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
