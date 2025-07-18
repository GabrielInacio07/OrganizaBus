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
  Lock,
  Users,
  CheckCircle,
  XCircle,
  User,
  UserRoundPlus,
  LogOut,
} from "lucide-react";
import ResumoCard from "@/components/dashboard/ResumoCard";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/loadingOverlay";
import { gerarRelatorioDashboardPDF } from "@/lib/relatorioMensalDashbord";
import { gerarRelatorioAnualDashboardPDF } from "@/lib/relatorioAnualDashbord";

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
    valorMensalidade: "",
    possuiBolsa: false,
    valorBolsa: "",
    pagoEmEspecie: false,
  });
  const [alunos, setAlunos] = useState([]);
  const [motoristaLogado, setMotoristaLogado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [data, setData] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [editarMensalidade, setEditarMensalidade] = useState(false);
  const [novoValorMensalidade, setNovoValorMensalidade] = useState("0");
  const [cadastrandoAluno, setCadastrandoAluno] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1
  );
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [editarVencimento, setEditarVencimento] = useState(false);
  const [novoDiaVencimento, setNovoDiaVencimento] = useState(10);

  useEffect(() => {
    const carregarDadosMotorista = async () => {
      const usuario = UserService.getCurrentUser();
      if (!usuario) {
        router.push("/rotas/login");
        return;
      }

      try {
        const motoristaCompleto = await UserService.obterPerfilMotorista(
          usuario.id
        );
        const diaVencimento =
          motoristaCompleto.diaVencimento || usuario.diaVencimento || 10;

        setMotorista({
          ...usuario,
          ...motoristaCompleto,
          diaVencimento,
        });
        setNovoDiaVencimento(diaVencimento);
        setNovoValorMensalidade(
          motoristaCompleto.valorMensalidade?.toFixed(2) ||
            usuario.valorMensalidade?.toFixed(2) ||
            "0"
        );
        setMotoristaLogado(true);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        const diaVencimento = usuario.diaVencimento || 10;
        setMotorista({
          ...usuario,
          diaVencimento,
        });
        setNovoDiaVencimento(diaVencimento);
        setNovoValorMensalidade(usuario.valorMensalidade?.toFixed(2) || "0");
        setMotoristaLogado(true);
      }
    };

    carregarDadosMotorista();
  }, [router]);

  useEffect(() => {
    const inicializar = async () => {
      if (motorista && motorista.id) {
        await carregarAlunos();
        await carregarGrafico(motorista.id, mesSelecionado, anoSelecionado);
      }
    };
    inicializar();
  }, [motorista, mesSelecionado, anoSelecionado]);

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    setMostrarGrafico(total > 0);
  }, [data]);

  const carregarAlunos = async () => {
    try {
      const alunosCadastrados = await UserService.listarAlunos();
      setAlunos(alunosCadastrados);
      return alunosCadastrados;
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
      setAlunos([]);
      return [];
    }
  };

  const carregarGrafico = async (
    id,
    mes = mesSelecionado,
    ano = anoSelecionado
  ) => {
    setCarregandoDados(true);
    try {
      const queryParams = new URLSearchParams({
        motoristaId: id,
        mes,
        ano,
      });

      const res = await fetch(
        `/api/dashboard/pagamentos?${queryParams.toString()}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      const temAlunos = result.temAlunosNoPeriodo;

      if (!temAlunos) {
        setData([]);
        setMostrarGrafico(false);
        setValorTotal(0);
        return;
      }

      const naoPagosTotal =
        (result.not_paid || 0) +
        (result.pending || 0) +
        (result.nao_gerado || 0);
      const temDados = (result.approved || 0) > 0 || naoPagosTotal > 0;

      if (!temDados) {
        setData([]);
        setMostrarGrafico(false);
        setValorTotal(0);
        return;
      }

      const novosData = [
        { name: "Pagos", value: result.approved },
        { name: "Não Pagos", value: naoPagosTotal },
      ];

      setData(novosData);
      setMostrarGrafico(true);
      setValorTotal(result.total_aprovado || 0);
    } catch (error) {
      console.error("Erro ao carregar dados do gráfico:", error);
      setData([]);
      setValorTotal(0);
      Swal.fire(
        "Erro",
        "Erro ao carregar dados do gráfico. Tente novamente.",
        "error"
      );
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleMesChange = async (e) => {
    const novoMes = parseInt(e.target.value);
    setMesSelecionado(novoMes);
    if (motorista && motorista.id) {
      await carregarGrafico(motorista.id, novoMes, anoSelecionado);
    }
  };

  const handleAnoChange = async (e) => {
    const novoAno = Number(e.target.value);
    setAnoSelecionado(novoAno);
    if (motorista && motorista.id) {
      await carregarGrafico(motorista.id, mesSelecionado, novoAno);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const abrirModalEdicao = (aluno) => {
    setAlunoSelecionado(aluno);
    setFormData({
      nome: aluno.nome || "",
      email: aluno.email || "",
      telefone: aluno.telefone || "",
      cpf: aluno.cpf || "",
      faculdade: aluno.faculdade || "",
      possuiBolsa: aluno.possuiBolsa || false,
      valorBolsa: aluno.valorBolsa || "",
      pagoEmEspecie: false,
    });
    setShowEditModal(true);
  };

  const handleEditarAluno = async (e) => {
    e.preventDefault();
    try {
      const valorBolsa = formData.possuiBolsa
        ? parseFloat(formData.valorBolsa || 0)
        : null;

      await UserService.atualizarAluno(alunoSelecionado.id, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        faculdade: formData.faculdade,
        possuiBolsa: formData.possuiBolsa,
        valorBolsa,
      });

      if (formData.pagoEmEspecie) {
        await fetch("/api/mp/pagamentos/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Mensalidade paga em espécie",
            tipo: "mensalidade",
            price: alunoSelecionado.valorMensalidade || 0,
            quantity: 1,
            payer: {
              email: alunoSelecionado.email,
              first_name: alunoSelecionado.nome?.split(" ")[0] || "Aluno",
              last_name: alunoSelecionado.nome?.split(" ")[1] || "",
            },
            userId: alunoSelecionado.id,
            statusManual: "approved",
          }),
        });
        await carregarAlunos();
      }

      Swal.fire("Atualizado!", "Aluno atualizado com sucesso.", "success");
      setShowEditModal(false);
      setAlunoSelecionado(null);
      await carregarAlunos();
    } catch (error) {
      Swal.fire("Erro", `Erro ao atualizar aluno: ${error.message}`, "error");
    }
  };

  const handleRemoverAluno = async (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Removendo...",
            text: "Por favor, aguarde.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await UserService.removerAluno(id);
          setAlunos((prev) => prev.filter((a) => a.id !== id));

          if (motorista && motorista.id) {
            await carregarGrafico(motorista.id, mesSelecionado);
          }

          Swal.fire({
            title: "✅ Aluno Removido!",
            text: "O aluno foi excluído com sucesso.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          Swal.fire("Erro", `Erro ao remover aluno: ${error.message}`, "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCadastrandoAluno(true);
    try {
      const senhaAleatoria = Math.random().toString(36).slice(-8);
      const valorMensalidade = parseFloat(formData.valorMensalidade || 0);
      const valorBolsa = formData.possuiBolsa
        ? parseFloat(formData.valorBolsa || 0)
        : null;

      const novoAluno = await UserService.registrarAluno(
        formData.nome,
        formData.email,
        formData.telefone,
        formData.cpf,
        senhaAleatoria,
        formData.faculdade,
        motorista.id,
        valorMensalidade,
        formData.possuiBolsa,
        valorBolsa
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
        valorMensalidade: "",
        possuiBolsa: false,
        valorBolsa: "",
      });
      setShowModal(false);
      carregarAlunos();
    } catch (error) {
      Swal.fire("Erro", error?.message || "Erro ao cadastrar aluno.", "error");
    } finally {
      setCadastrandoAluno(false);
    }
  };

  const handleAtualizarMensalidade = async (e) => {
    e.preventDefault();
    try {
      const atual = parseFloat(novoValorMensalidade);
      if (atual <= 0) {
        Swal.fire(
          "Atenção",
          "O valor da mensalidade deve ser maior que zero.",
          "warning"
        );
        return;
      }

      await UserService.atualizarPerfilMotorista(motorista.id, {
        valorMensalidade: atual,
      });

      setMotorista((prev) => ({
        ...prev,
        valorMensalidade: atual,
      }));

      Swal.fire("Sucesso!", "Valor atualizado.", "success");
      setEditarMensalidade(false);

      await fetch("/api/atualizarMensalidadeAlunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motoristaId: motorista.id,
          valorMensalidade: atual,
        }),
      });
    } catch (error) {
      Swal.fire("Erro", `Erro ao atualizar valor: ${error.message}`, "error");
    }
  };

  const handleAtualizarVencimento = async (e) => {
    e.preventDefault();
    try {
      const dia = parseInt(novoDiaVencimento);
      if (dia < 1 || dia > 31) {
        Swal.fire("Erro", "Informe um dia válido (1 a 31).", "warning");
        return;
      }

      const dadosAtualizados = await UserService.atualizarPerfilMotorista(
        motorista.id,
        {
          diaVencimento: dia,
        }
      );

      setMotorista((prev) => ({
        ...prev,
        diaVencimento: dia,
      }));

      const usuarioAtual = UserService.getCurrentUser();
      if (usuarioAtual) {
        UserService.setCurrentUser({
          ...usuarioAtual,
          diaVencimento: dia,
        });
      }

      setEditarVencimento(false);
      Swal.fire("Sucesso!", "Vencimento atualizado.", "success");
    } catch (err) {
      Swal.fire("Erro", "Falha ao atualizar vencimento.", "error");
    }
  };

  const handleLogout = () => {
    UserService.logout();
    router.push("/rotas/login");
  };

  if (!motoristaLogado) {
    return (
      <div>
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay />
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
            {/* Botao Adicionar Aluno */}
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
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-4 py-4 text-sm"
                >
                  {["nome", "email", "telefone", "cpf", "faculdade"].map(
                    (campo) => (
                      <div key={campo} className="space-y-1">
                        <label className="block font-semibold capitalize">
                          {campo}
                        </label>
                        <input
                          type={campo === "email" ? "email" : "text"}
                          name={campo}
                          value={formData[campo]}
                          onChange={handleChange}
                          placeholder={`Digite o ${campo}`}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    )
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="possuiBolsa"
                      checked={formData.possuiBolsa || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="font-medium text-gray-700">
                      Possui bolsa de estudos?
                    </label>
                  </div>

                  {formData.possuiBolsa && (
                    <div className="space-y-1">
                      <label className="block font-semibold">
                        Valor da Bolsa (R$)
                      </label>
                      <input
                        type="number"
                        name="valorBolsa"
                        value={formData.valorBolsa || ""}
                        onChange={handleChange}
                        placeholder="Ex: 150.00"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      disabled={cadastrandoAluno}
                    >
                      {cadastrandoAluno && (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                          />
                        </svg>
                      )}
                      {cadastrandoAluno ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {/* Botao Editar Aluno */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Editar Aluno</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleEditarAluno}
                  className="grid gap-4 py-4 text-sm"
                >
                  {["nome", "email", "telefone", "cpf", "faculdade"].map(
                    (campo) => (
                      <div key={campo} className="space-y-1">
                        <label className="block font-semibold capitalize">
                          {campo}
                        </label>
                        <input
                          type={campo === "email" ? "email" : "text"}
                          name={campo}
                          value={formData[campo]}
                          onChange={handleChange}
                          placeholder={`Digite o ${campo}`}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    )
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="possuiBolsa"
                      checked={formData.possuiBolsa || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="font-medium text-gray-700">
                      Possui bolsa de estudos?
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="pagoEmEspecie"
                      checked={formData.pagoEmEspecie || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="font-medium text-gray-700">
                      Pago em dinheiro
                    </label>
                  </div>
                  {formData.possuiBolsa && (
                    <div className="space-y-1">
                      <label className="block font-semibold">
                        Valor da Bolsa (R$)
                      </label>
                      <input
                        type="number"
                        name="valorBolsa"
                        value={formData.valorBolsa || ""}
                        onChange={handleChange}
                        placeholder="Ex: 150.00"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Salvar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {/* Botao Editar Mensalidade */}
            <Dialog
              open={editarMensalidade}
              onOpenChange={setEditarMensalidade}
            >
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Editar Valor da Mensalidade</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAtualizarMensalidade}
                  className="space-y-4"
                >
                  <input
                    type="number"
                    value={novoValorMensalidade}
                    onChange={(e) => setNovoValorMensalidade(e.target.value)}
                    placeholder="Novo valor da mensalidade"
                    className="border p-2 rounded w-full"
                    required
                    min="0.01"
                    step="0.01"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditarMensalidade(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => {
                setNovoValorMensalidade(
                  motorista?.valorMensalidade?.toFixed(2) || "0"
                );
                setEditarMensalidade(true);
              }}
              className="text-lg px-4 py-2 font-semibold"
              variant="outline"
              title="Clique para editar o valor da mensalidade"
            >
              💵 R$ {motorista?.valorMensalidade?.toFixed(2) || "0,00"}
            </Button>
            {/* Botao Editar Vencimento */}
            <Dialog open={editarVencimento} onOpenChange={setEditarVencimento}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Editar Dia de Vencimento</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAtualizarVencimento}
                  className="space-y-4"
                >
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={novoDiaVencimento}
                    onChange={(e) => setNovoDiaVencimento(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditarVencimento(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => {
                setNovoDiaVencimento(motorista?.diaVencimento || 10);
                setEditarVencimento(true);
              }}
              className="text-lg px-4 py-2 font-semibold"
              variant="outline"
              title="Clique para editar o dia de vencimento"
            >
              📅 Dia {motorista?.diaVencimento || 10}
            </Button>

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
              value={data.find((d) => d.name === "Não Pagos")?.value || 0}
              color="bg-red-500"
            />
          </div>
        </div>

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
        <div className="flex gap-2">
          <Button
            onClick={() => gerarRelatorioDashboardPDF(motorista, alunos, data)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📄 Relatório Mensal
          </Button>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-10">
          {carregandoDados ? (
            <div className="w-full h-40 flex items-center justify-center">
              <p className="text-gray-500">Carregando dados do gráfico...</p>
            </div>
          ) : mostrarGrafico ? (
            <DashboardChart
              data={data}
              motoristaId={motorista?.id}
              mesSelecionado={mesSelecionado}
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center text-center text-gray-500">
              <div>
                <p className="text-lg font-medium mb-1">
                  Nenhum dado disponível
                </p>
                <p className="text-sm">
                  Não há pagamentos registrados ou alunos ativos para o período
                  selecionado.
                </p>
              </div>
            </div>
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
                      className={`border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
    ${
      [
        aluno.pagamentos?.find((p) => p.tipo === "mensalidade")?.status,
        aluno.pagamentos?.find((p) => p.tipo === "auxilio")?.status,
      ].includes("approved")
        ? "bg-green-100"
        : "bg-red-100"
    }
  `}
                    >
                      <div>
                        <p className="font-semibold">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">{aluno.email}</p>
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
