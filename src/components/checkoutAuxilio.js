
"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Botao.module.css";
import { UserService } from "@/services/user.service";
import { Button } from "@/components/ui/button";

export default function CheckoutAuxilio({ title = "Bolsa Estudantil", price, quantity, onPaymentSuccess }) {
  const [user, setUser] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [codigoPix, setCodigoPix] = useState("");
  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (tempoRestante === null) return;
    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev !== null && prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev !== null ? prev - 1000 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tempoRestante]);

  const handlePayment = async () => {
    if (!user) {
      alert("Usuário não identificado.");
      return;
    }

    try {
      const response = await fetch("/api/mp/pagamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Bolsa Estudantil",
          tipo: "auxilio",
          price,
          quantity,
          payer: {
            email: user.email,
            first_name: user.nome?.split(" ")[0] || "Aluno",
            last_name: user.nome?.split(" ")[1] || "",
          },
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.qr_code_base64 && data.qr_code) {
        setQrCodeBase64(data.qr_code_base64);
        setCodigoPix(data.qr_code);
        setTempoRestante(15 * 60 * 1000);
        if (onPaymentSuccess) onPaymentSuccess("Bolsa Estudantil");
      }
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);
    }
  };

  const formatarTempo = (ms) => {
    const min = Math.floor(ms / 60000);
    const seg = Math.floor((ms % 60000) / 1000);
    return `${min}:${seg < 10 ? "0" : ""}${seg}`;
  };

  return (
    <div>
      <Button
        className={styles.botao}
        onClick={handlePayment}
        disabled={!user}
      >
        Bolsa Estudantil
      </Button>
      {qrCodeBase64 && (
        <div style={{ marginTop: 20 }}>
          {tempoRestante !== null && tempoRestante > 0 ? (
            <p className="text-sm text-red-600">
              Código Pix expira em: {formatarTempo(tempoRestante)}
            </p>
          ) : (
            <Button
              variant="outline"
              onClick={handlePayment}
              style={{ marginBottom: 10 }}
            >
              Gerar Novo Pix
            </Button>
          )}
          <p>Escaneie o QR Code:</p>
          <img
            style={{ width: 200, height: 200 }}
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code PIX"
          />
          <p>
            <strong>PIX Copia e Cola:</strong>
          </p>
          <textarea readOnly value={codigoPix} style={{ width: "100%" }} />
          <Button
            className="mt-2"
            onClick={() => {
              navigator.clipboard.writeText(codigoPix);
              alert("Código Pix copiado para área de transferência.");
            }}
          >
            Copiar código Pix
          </Button>
        </div>
      )}
    </div>
  );
}
