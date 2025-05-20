import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserService } from "@/services/user.service";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function GraficoMensal({ ano }) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchMensal = async () => {
      const user = UserService.getCurrentUser();
      if (!user) return;

      const res = await fetch(`/api/dashboard/mensal?motoristaId=${user.id}&ano=${ano}`);
      const valores = await res.json();

      const dadosFormatados = valores.map((valor, i) => ({
        mes: MESES[i],
        valor,
      }));

      setDados(dadosFormatados);
    };

    fetchMensal();
  }, [ano]);

  return (
    <div style={{ width: "100%", height: 400, marginTop: 40 }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Pagamentos Mensais (R$)</h3>
      <ResponsiveContainer>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Bar dataKey="valor" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
