"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { UserService } from "@/services/user.service";
import Swal from "sweetalert2";

export default function CheckoutPagar({ title = "Pagamento do Aluno", price, quantity, onPaymentSuccess }) {
  const [user, setUser] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [codigoPix, setCodigoPix] = useState("");
  const [tempoRestante, setTempoRestante] = useState(null);
  const [open, setOpen] = useState(false);

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
          title,
          tipo: "mensalidade",
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
        setOpen(true);
        if (onPaymentSuccess) onPaymentSuccess(title);
      } else {
        alert("Erro ao gerar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao gerar Pix:", error);
      alert("Erro ao gerar pagamento.");
    }
  };

  const formatarTempo = (ms) => {
    const min = Math.floor(ms / 60000);
    const seg = Math.floor((ms % 60000) / 1000);
    return `${min}:${seg < 10 ? "0" : ""}${seg}`;
  };

  return (
    <>
      <Button onClick={handlePayment} disabled={!user}>
        Pagar com PIX
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg sm:mx-auto p-6 rounded-lg bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Pagamento PIX - {title}</DialogTitle>
            <DialogDescription>
              {tempoRestante !== null && tempoRestante > 0 ? (
                <div className="text-red-600 mb-2">
                  Código Pix expira em: {formatarTempo(tempoRestante)}
                </div>
              ) : (
                <Button variant="outline" onClick={handlePayment} className="mb-4">
                  Gerar Novo Pix
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>

          {qrCodeBase64 && (
            <div className="flex flex-col items-center gap-4">
              <img
                className="w-48 h-48"
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code PIX"
              />
              <div className="font-semibold">PIX Copia e Cola:</div>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(codigoPix);
                  alert("Código Pix copiado para área de transferência.");
                }}
              >
                Copiar código Pix
              </Button>
            </div>
          )}

          <DialogClose asChild>
            <Button variant="ghost" className="mt-6 w-full">
              Fechar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
