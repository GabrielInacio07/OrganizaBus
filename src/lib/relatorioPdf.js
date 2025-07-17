import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function gerarRelatorioPagamentos(pagamentos, nome, tipoRelatorio = "semestral") {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Logo
  const logoBytes = await fetch("/img/logo.png").then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes); 
  const logoDims = logoImage.scale(0.05); 

  let page = pdfDoc.addPage([600, 800]);
  let y = 750;

  page.drawText(`Relatório de Pagamentos - ${nome}`, {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  const agora = new Date();
  const dataHoraFormatada = agora.toLocaleString("pt-BR");
  const mesesParaVoltar = tipoRelatorio === "anual" ? 12 : 6;
  const meses = [];

  for (let i = 0; i < mesesParaVoltar; i++) {
    const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    meses.push(data);
  }

  meses.reverse(); 

  const pagamentosPorMes = {};
  for (const mes of meses) {
    const chave = `${mes.getFullYear()}-${mes.getMonth() + 1}`;
    pagamentosPorMes[chave] = [];
  }

  for (const p of pagamentos) {
    const data = new Date(p.criadoEm);
    const chave = `${data.getFullYear()}-${data.getMonth() + 1}`;
    if (pagamentosPorMes[chave]) {
      pagamentosPorMes[chave].push(p);
    }
  }

  for (const mes of meses) {
    const chave = `${mes.getFullYear()}-${mes.getMonth() + 1}`;
    const lista = pagamentosPorMes[chave];
    const nomeMes = mes.toLocaleString("pt-BR", { month: "long" });

    if (y < 120) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }

    page.drawText(`${nomeMes.toUpperCase()} / ${mes.getFullYear()}`, {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 20;

    // Cabeçalho das colunas
    page.drawText("Auxílio Estudantil", { x: 50, y, size: 12, font });
    page.drawText("Pagamento do Aluno", { x: 300, y, size: 12, font });

    // Linha horizontal abaixo do cabeçalho
    page.drawLine({
      start: { x: 45, y: y - 2 },
      end: { x: 550, y: y - 2 },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    y -= 18;

    const auxilios = lista.filter((p) =>
      p.titulo.toLowerCase().includes("auxílio") || p.titulo.toLowerCase().includes("bolsa")
    );
    const pagamentosAluno = lista.filter(
      (p) => !p.titulo.toLowerCase().includes("auxílio") && !p.titulo.toLowerCase().includes("bolsa")
    );

    const linhas = Math.max(auxilios.length, pagamentosAluno.length, 1);

    // Linha vertical separando as colunas
    page.drawLine({
      start: { x: 280, y: y + 18 },
      end: { x: 280, y: y - (linhas * 18) },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });

    for (let i = 0; i < linhas; i++) {
      const aux = auxilios[i];
      const pag = pagamentosAluno[i];

      if (aux) {
        const data = new Date(aux.criadoEm).toLocaleDateString("pt-BR");
        const valor = `R$ ${Number(aux.valor).toFixed(2)}`;
        page.drawText(`${data} - ${valor}`, { x: 50, y, size: 12, font });
      } else if (i === 0) {
        page.drawText("Sem registro", {
          x: 50,
          y,
          size: 12,
          font,
          color: rgb(0.5, 0, 0),
        });
      }

      if (pag) {
        const data = new Date(pag.criadoEm).toLocaleDateString("pt-BR");
        const valor = `R$ ${Number(pag.valor).toFixed(2)}`;
        page.drawText(`${data} - ${valor}`, { x: 300, y, size: 12, font });
      } else if (i === 0) {
        page.drawText("Sem registro", {
          x: 300,
          y,
          size: 12,
          font,
          color: rgb(0.5, 0, 0),
        });
      }

      y -= 18;

      // linha horizontal por registro
      page.drawLine({
        start: { x: 45, y: y + 4 },
        end: { x: 550, y: y + 4 },
        thickness: 0.25,
        color: rgb(0.8, 0.8, 0.8),
      });
    }

    y -= 10;
  }

  // ⬇️ Rodapé na última página
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];

  lastPage.drawImage(logoImage, {
    x: 50,
    y: 40,
    width: logoDims.width,
    height: logoDims.height,
  });

  lastPage.drawText("Relatório gerado em OrganizaBus", {
    x: 50 + logoDims.width + 10,
    y: 70,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  lastPage.drawText(`Gerado em: ${dataHoraFormatada}`, {
    x: 50 + logoDims.width + 10,
    y: 56,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  lastPage.drawText(`Por: ${nome}`, {
    x: 50 + logoDims.width + 10,
    y: 42,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  return await pdfDoc.save();
}
