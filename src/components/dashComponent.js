"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { UserService } from "@/services/user.service";

const COLORS = ["#22c55e", "#eab308", "#ef4444", "#9ca3af"];

export default function DashboardChart({ data, motoristaId, mesSelecionado }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se dados foram passados como props, usar eles
    if (data && data.length > 0) {
      setChartData(data);
      return;
    }

    // Caso contrário, buscar os dados da API (fallback)
    if (motoristaId && mesSelecionado) {
      fetchPagamentos();
    }
  }, [data, motoristaId, mesSelecionado]);

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      const motorista = UserService.getCurrentUser();
      if (!motorista || !motorista.id) return;

      const mes = mesSelecionado || new Date().getMonth() + 1;
      const res = await fetch(`/api/dashboard/pagamentos?motoristaId=${motorista.id}&mes=${mes}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      
      const formattedData = [
        { name: "Pagos", value: result.approved || 0 },
        { name: "Pendentes", value: result.pending || 0 },
        { name: "Não pagos após prazo", value: result.not_paid || 0 },
        { name: "Não gerados", value: result.nao_gerado || 0 },
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
        textAnchor={x > cx ? 'start' : 'end'} 
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

  const hasData = chartData.some(item => item.value > 0);

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
          <Tooltip 
            formatter={(value, name) => [value, name]}
            labelStyle={{ color: '#333' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 'bold' }}>
                {value}: {entry.payload.value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}