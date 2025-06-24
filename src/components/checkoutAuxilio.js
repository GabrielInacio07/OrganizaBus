"use client";
import { useEffect, useRef, useState } from "react";
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

export default function CheckoutAuxilio({ title, price, quantity, alunoId }) {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jaPago, setJaPago] = useState(false);  
  const [tempoRestante, setTempoRestante] = useState(900);
  const intervalRef = useRef(null);

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
          tipo: "auxilio",
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

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Resposta não é JSON:", text);
        throw new Error("Resposta inválida do servidor");
      }

      const data = await res.json();
      console.log("Resposta da API /api/mp/pagamentos (Auxílio):", data);

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar pagamento");
      }

      const qrCodeBase64 = await QRCode.toDataURL(data.qr_code);

      setQrCodeData({
        pagamentoId: data.pagamentoId,
        status: data.status,
        qrCode: data.qr_code,
        qrCodeBase64,
        mensagem: data.mensagem,
      });
      setShowModal(true);
      setTempoRestante(900)
      intervalRef.current = setInterval(() =>{
        setTempoRestante((prev) =>{
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setShowModal(false);
            return 0;
          }
          return prev - 1;
        })
      }, 1000);
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      Swal.fire("Erro!", error.message || "Erro ao gerar pagamento PIX.", "error");
    } finally {
      setLoading(false);
    }
  };
  // Reinicializa o temporizador quando abre o modal
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const verificarPagamento  = async () => {
      try {
        const res = await fetch(`/api/mp/verificar-pagamento?alunoId=${alunoId}&tipo${tipo}` )
        const data = await res.json();
        setJaPago(data.pago)
      }catch(err){
        console.log('erro ao verificar pagamento', err)
      }
    }
    if (alunoId){
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
          {jaPago? "Já pago nesse mês":loading ? "Gerando..." : "Pagar Bolsa via PIX"}
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
      Código expira em: {Math.floor(tempoRestante / 60)}:{String(tempoRestante % 60).padStart(2, "0")}
    </p>
    <p className="text-center mt-2">Status: {traduzirStatus(qrCodeData.status)}</p>
    
  </>
) : (
  <p className="text-center">Carregando QR Code...</p>
)}

          <Button
            className="mt-4 w-full"
            onClick={() => setShowModal(false)}
            variant="outline"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
