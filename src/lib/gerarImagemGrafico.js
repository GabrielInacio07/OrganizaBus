import Chart from "chart.js/auto";

export async function gerarImagemGrafico(dados) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: dados.map((d) => d.name),
        datasets: [
          {
            data: dados.map((d) => d.value),
            backgroundColor: ["#10B981", "#EF4444"], // verde / vermelho
          },
        ],
      },
      options: {
        responsive: false,
        animation: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    // Espera a renderização do gráfico
    setTimeout(() => {
      const imageDataUrl = canvas.toDataURL("image/png");
      resolve(imageDataUrl);
    }, 500);
  });
}