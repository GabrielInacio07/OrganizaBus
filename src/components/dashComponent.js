"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { UserService } from "@/services/user.service";

const COLORS = ["#22c55e", "#ef4444"]; // Verde para Pagos, Vermelho para Não Pagos

export default function DashboardChart({ data, motoristaId, mesSelecionado }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
      return;
    }

    if (motoristaId && mesSelecionado) {
      fetchPagamentos();
    }
  }, [data, motoristaId, mesSelecionado]);

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      const motorista = UserService.getCurrentUser();
      if (!motorista || !motorista.id) {
        console.warn("Motorista não autenticado ou inválido");
        setChartData([]);
        setLoading(false);
        return;
      }

      const mes = mesSelecionado || new Date().getMonth() + 1;
      const res = await fetch(`/api/dashboard/pagamentos?motoristaId=${motorista.id}&mes=${mes}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      console.log("Dados recebidos do backend:", result);

      // Extrai os valores e previne NaN ou undefined
      const approvedCount = Number(result.approved ?? 0);
      const notPaidCount = Number(result.not_paid ?? 0);
      const pendingCount = Number(result.pending ?? 0);
      const naoGeradoCount = Number(result.nao_gerado ?? 0);

      const naoPagosTotal = notPaidCount + pendingCount + naoGeradoCount;

      console.log("Pagos:", approvedCount, "Não Pagos (incluindo não gerado):", naoPagosTotal);

      const formattedData = [
        { name: "Pagos", value: approvedCount },
        { name: "Não Pagos", value: naoPagosTotal },
      ];

      setChartData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando gráfico...</p>
        </div>
      </div>
    );
  }

  const hasData = chartData.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Nenhum dado encontrado</p>
          <p className="text-sm">Não há pagamentos para o mês selecionado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">Resumo de Pagamentos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} labelStyle={{ color: "#333" }} />
          <Legend
            verticalAlign="bottom"
            height={36}
            payload={[
              {
                id: "Pagos",
                type: "square",
                value: `Pagos: ${chartData.find((d) => d.name === "Pagos")?.value || 0}`,
                color: COLORS[0],
              },
              {
                id: "Não Pagos",
                type: "square",
                value: `Não Pagos: ${chartData.find((d) => d.name === "Não Pagos")?.value || 0}`,
                color: COLORS[1],
              },
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
