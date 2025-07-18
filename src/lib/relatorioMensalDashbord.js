import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import { gerarImagemGrafico } from "./gerarImagemGrafico";

export async function gerarRelatorioDashboardPDF(motorista, alunos, dadosGrafico, options = {}) {
  const isAnual = options.isAnual || false;
  const ano = options.ano || new Date().getFullYear();

  const pdfDoc = await PDFDocument.create();

  const imagemDataUrl = await gerarImagemGrafico(dadosGrafico);
  const imageBytes = await fetch(imagemDataUrl).then((res) => res.arrayBuffer());
  const chartImage = await pdfDoc.embedPng(imageBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const titulo = isAnual
    ? `Relatório Anual - ${ano}`
    : `Relatório Mensal - ${new Date().toLocaleDateString("pt-BR", { month: "long" })}`;

  const logoBytes = await fetch("/img/logo.png").then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.05);

  let page = pdfDoc.addPage([600, 800]);
  let y = 750;

  // 📝 Título
  page.drawText(titulo, {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // 🧑 Nome do motorista
  page.drawText(`Relatório de Pagamentos - ${motorista.nome}`, {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // 📅 Período
  page.drawText(`Período: ${new Date().toLocaleDateString("pt-BR")}`, {
    x: 50,
    y,
    size: 12,
    font,
  });
  y -= 40;

  // ✅ Resumo
  const pagos = dadosGrafico.find((d) => d.name === "Pagos")?.value || 0;
  const naoPagos = dadosGrafico.find((d) => d.name === "Não Pagos")?.value || 0;
  const total = pagos + naoPagos;
  const porcentagemPagos = total > 0 ? ((pagos / total) * 100).toFixed(1) : "0.0";
  const porcentagemNaoPagos = total > 0 ? ((naoPagos / total) * 100).toFixed(1) : "0.0";

  page.drawText("Resumo dos pagamentos:", {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 20;

  page.drawText(`Pagos: ${pagos}`, {
    x: 60,
    y,
    size: 12,
    font,
    color: rgb(0, 0.6, 0),
  });
  y -= 15;

  page.drawText(`Não Pagos: ${naoPagos}`, {
    x: 60,
    y,
    size: 12,
    font,
    color: rgb(0.8, 0, 0),
  });
  y -= 15;

  page.drawText(
    `Total Recebido: R$ ${(pagos * motorista.valorMensalidade).toFixed(2)}`,
    {
      x: 60,
      y,
      size: 12,
      font,
    }
  );
  y -= 30;

  // 📊 Imagem do gráfico
  page.drawImage(chartImage, {
    x: 100,
    y: y - 300,
    width: 400,
    height: 300,
  });
  y -= 310;

  // ✅ Legenda com porcentagem abaixo do gráfico
  const legendaPagos = `% Pagos: ${porcentagemPagos}%`;
  const legendaNaoPagos = `% Não Pagos: ${porcentagemNaoPagos}%`;
  const larguraPagos = font.widthOfTextAtSize(legendaPagos, 12);
  const larguraNaoPagos = font.widthOfTextAtSize(legendaNaoPagos, 12);
  const totalLargura = larguraPagos + 40 + larguraNaoPagos;
  const centerX = 300;
  const startX = centerX - totalLargura / 2;

  page.drawText(legendaPagos, {
    x: startX,
    y,
    size: 12,
    font,
    color: rgb(0, 0.6, 0),
  });

  page.drawText(legendaNaoPagos, {
    x: startX + larguraPagos + 40,
    y,
    size: 12,
    font,
    color: rgb(0.8, 0, 0),
  });
  y -= 30;

  // 📋 Tabela de alunos
  page.drawText("Alunos cadastrados:", {
    x: 50,
    y,
    size: 14,
    font,
  });
  y -= 20;

  page.drawText("Nome do Aluno", { x: 60, y, size: 12, font });
  page.drawText("Status Pagamento", { x: 300, y, size: 12, font });

  page.drawLine({
    start: { x: 50, y: y - 2 },
    end: { x: 550, y: y - 2 },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6),
  });

  y -= 18;

  for (const aluno of alunos) {
    const ultimoPagamento = aluno.pagamentos?.find((p) => p.tipo === "mensalidade");
    const status = ultimoPagamento?.status === "approved" ? "Pago" : "Não Pago";
    const statusColor = status === "Pago" ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0);

    if (y < 80) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }

    page.drawText(aluno.nome, { x: 60, y, size: 11, font });
    page.drawText(status, { x: 300, y, size: 11, font, color: statusColor });

    page.drawLine({
      start: { x: 50, y: y - 2 },
      end: { x: 550, y: y - 2 },
      thickness: 0.25,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 18;
  }

  // 📎 Rodapé com logo
  const dataHoraFormatada = new Date().toLocaleString("pt-BR");
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];

  lastPage.drawImage(logoImage, {
    x: 50,
    y: 40,
    width: logoDims.width,
    height: logoDims.height,
  });

  lastPage.drawText("Relatório gerado por OrganizaBus", {
    x: 50 + logoDims.width + 10,
    y: 70,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  lastPage.drawText(`Data de geração: ${dataHoraFormatada}`, {
    x: 50 + logoDims.width + 10,
    y: 56,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  lastPage.drawText(`Usuário: ${motorista.nome}`, {
    x: 50 + logoDims.width + 10,
    y: 42,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `relatorio_motorista_${motorista.nome}.pdf`, "application/pdf");
}
