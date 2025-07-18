import { gerarRelatorioDashboardPDF } from "@/lib/relatorioMensalDashbord";
import { UserService } from "@/services/user.service";

// Função para gerar o relatório anual consolidado
export async function gerarRelatorioAnualDashboardPDF(motorista) {
  try {
    const todosAlunos = await UserService.listarAlunos();
    const alunosMotorista = todosAlunos.filter((a) => a.motoristaId === motorista.id);

    const meses = Array.from({ length: 12 }, (_, i) => i + 1);
    const anoAtual = new Date().getFullYear();

    let totais = { pagos: 0, naoPagos: 0 };

    for (const mes of meses) {
      const queryParams = new URLSearchParams({
        motoristaId: motorista.id,
        mes,
        ano: anoAtual,
      });

      const res = await fetch(`/api/dashboard/pagamentos?${queryParams.toString()}`);
      if (!res.ok) continue;

      const result = await res.json();
      totais.pagos += result.approved || 0;
      totais.naoPagos +=
        (result.not_paid || 0) +
        (result.pending || 0) +
        (result.nao_gerado || 0);
    }

    const dadosGrafico = [
      { name: "Pagos", value: totais.pagos },
      { name: "Não Pagos", value: totais.naoPagos },
    ];

    // Chama o mesmo gerador de PDF, mas com dados anuais
    await gerarRelatorioDashboardPDF(motorista, alunosMotorista, dadosGrafico, {
      isAnual: true,
      ano: anoAtual,
    });
  } catch (error) {
    console.error("Erro ao gerar relatório anual:", error);
    alert("Erro ao gerar relatório anual. Tente novamente.");
  }
}
