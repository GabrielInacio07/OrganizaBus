"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";
import { UserService } from "@/services/user.service";
import QRCode from "qrcode";

export default function CheckoutPagar({  title, price, quantity, alunoId, pagamentoIdExistente = null }) {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(900);
  const intervalRef = useRef(null);
  const [jaPago, setJaPago] = useState(false);

  const traduzirStatus = (status) => {
    const traducoes = {
      approved: "Aprovado",
      pending: "Pendente",
      rejected: "Rejeitado",
      in_process: "Em processamento",
      refunded: "Reembolsado",
      canceled: "Cancelado",
    };
    return traducoes[status] || status;
  };

  const handleGerarPix = async () => {
    setLoading(true);
    try {
      const user = UserService.getCurrentUser();
      if (!user || user.tipo !== "aluno") {
        throw new Error("Usuário não autenticado ou não é aluno");
      }

      const res = await fetch("/api/mp/pagamentos", {
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
          userId: alunoId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar pagamento");

      const qrCodeBase64 = await QRCode.toDataURL(data.qr_code);

      setQrCodeData({
        pagamentoId: data.pagamentoId,
        status: data.status,
        qrCode: data.qr_code,
        qrCodeBase64,
        mensagem: data.mensagem,
      });

      setTempoRestante(900);
      setShowModal(true);

      intervalRef.current = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setShowModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      Swal.fire("Erro!", error.message || "Erro ao gerar pagamento PIX.", "error");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (pagamentoIdExistente) {
    fetch(`/api/mp/status?id=${pagamentoIdExistente}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "approved") {
          setJaPago(true);
        }
      });
  }
}, [pagamentoIdExistente]);


  useEffect(() => {
  if (qrCodeData?.pagamentoId && showModal) {
    const polling = setInterval(async () => {
      try {
        const res = await fetch(`/api/mp/status?id=${qrCodeData.pagamentoId}`);
        const data = await res.json();

        if (data.status === "approved") {
          Swal.fire({
            icon: "success",
            title: "Pagamento aprovado!",
            text: "Seu pagamento foi confirmado com sucesso.",
            timer: 3000,
            showConfirmButton: false,
          });

          // Enviar e-mail de confirmação
          try {
            const user = UserService.getCurrentUser();
            await fetch("/api/sendEmail/send-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: user.email,
                nome: user.nome,
                valor: price,
                titulo: title,
              }),
            });
          } catch (err) {
            console.error("Erro ao enviar e-mail de confirmação:", err);
          }

          setShowModal(false);
          clearInterval(polling);
          clearInterval(intervalRef.current);
          setJaPago(true);
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err);
      }
    }, 5000);

    return () => clearInterval(polling);
  }
}, [qrCodeData?.pagamentoId, showModal]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const verificarPagamento = async () => {
      try {
        const res = await fetch(`/api/mp/verificar-pagamento?alunoId=${alunoId}&tipo=mensalidade`);
        const data = await res.json();
        setJaPago(data.pago);
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
      }
    };

    if (alunoId) {
      verificarPagamento();
    }
  }, [alunoId]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md text-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-2xl font-bold text-primary">
          R$ {price.toFixed(2)}
        </p>
        <Button onClick={handleGerarPix} disabled={loading || jaPago}>
          {jaPago ? "Já pago nesse mês" : loading ? "Gerando..." : "Pagar Mensalidade via PIX"}
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento via PIX</DialogTitle>
          </DialogHeader>
          {qrCodeData ? (
            <>
              <img
                src={qrCodeData.qrCodeBase64}
                alt="QR Code PIX"
                className="w-64 h-64 mx-auto"
              />
              <p className="text-center mt-2 text-sm text-red-600">
                Código expira em: {Math.floor(tempoRestante / 60)}:
                {String(tempoRestante % 60).padStart(2, "0")}
              </p>
              <p className="text-center mt-2">
                Status: {traduzirStatus(qrCodeData.status)}
              </p>
              {qrCodeData.mensagem && (
                <p className="text-center text-sm text-gray-500">
                  {qrCodeData.mensagem}
                </p>
              )}
            </>
          ) : (
            <p className="text-center">Carregando QR Code...</p>
          )}
          <Button className="mt-4 w-full" onClick={() => setShowModal(false)} variant="outline">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
