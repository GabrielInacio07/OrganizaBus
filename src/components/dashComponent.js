'use client';
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { UserService } from "@/services/user.service";

const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#f44336", "#9e9e9e"];

export default function DashboardChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPagamentos = async () => {
      const user = UserService.getCurrentUser();
      if (!user) return;

      const res = await fetch(`/api/dashboard/pagamentos?motoristaId=${user.id}`);
      const result = await res.json();

      setData([
        { name: "Pagos", value: result.approved || 0 },
        { name: "Pendentes", value: result.pending || 0 },
        { name: "Processando", value: result.in_process || 0 },
        { name: "Não pagos após prazo", value: result.not_paid || 0 },
        { name: "Não gerados", value: result.nao_gerado || 0 },
      ]);
    };

    fetchPagamentos();
  }, []);

  return (
    <div style={{ width: "100%", height: 400, marginTop: 50 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Resumo Financeiro</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
