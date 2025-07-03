"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "@/components/loadingOverlay";
export default function RecuperarAcesso() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const enviarCodigo = async () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGerado(codigo);

    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Recuperação de Senha",
        text: `Seu código de recuperação é: ${codigo}`,
      }),
    });

    if (res.ok) {
      setEtapa(2);
      Swal.fire({
        icon: "success",
        title: "Código enviado",
        text: "Verifique seu e-mail para continuar.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro ao enviar código",
        text: "Não foi possível enviar o código por e-mail.",
      });
    }
  };

  const validarCodigo = async () => {
    if (codigoDigitado !== codigoGerado) {
      Swal.fire({
        icon: "error",
        title: "Código incorreto",
        text: "Verifique se digitou corretamente.",
      });
      return;
    }

    try {
      const resUsuario = await fetch(`/api/buscarUsuarioPorEmail?email=${email}`);
      const usuario = await resUsuario.json();

      if (!resUsuario.ok || !usuario || !usuario.senha) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Usuário não encontrado.",
        });
        return;
      }

      if (novaSenha === usuario.senha) {
        Swal.fire({
          icon: "warning",
          title: "Senha inválida",
          text: "A nova senha não pode ser igual à anterior.",
        });
        return;
      }

      const res = await fetch("/api/alterarSenha", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, novaSenha }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Senha redefinida",
          text: "Você será redirecionado para o login.",
        }).then(() => {
          router.push("/rotas/login");
        });
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: data.erro || "Erro ao redefinir senha.",
        });
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      Swal.fire({
        icon: "error",
        title: "Erro inesperado",
        text: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <>
    <LoadingOverlay />
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">Recuperar Acesso</h1>

      {etapa === 1 && (
        <>
          <input
            type="email"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            onClick={enviarCodigo}
          >
            Enviar código
          </button>
        </>
      )}

      {etapa === 2 && (
        <>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Digite o código recebido"
            value={codigoDigitado}
            onChange={(e) => setCodigoDigitado(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 mb-4 border rounded pr-10"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            onClick={validarCodigo}
          >
            Redefinir senha
          </button>
        </>
      )}
    </div>
    </>
  );
}
