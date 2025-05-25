"use client";
import { useState } from "react";
import { UserService } from "@/services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faEnvelope,
  faLock,
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/loadingOverlay";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormEdit = (event, name) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setShowCreateAccount(false);

    try {
      const usuario = await UserService.verificarUsuario(
        formData.email,
        formData.password
      );

      if (!usuario) {
        setShowCreateAccount(true);
        setError(
          "Usuário não encontrado ou senha incorreta. Deseja criar uma conta?"
        );
        return;
      }

      UserService.setCurrentUser(usuario);

      const route =
        usuario.tipo === "motorista" ? "/rotas/motorista" : "/rotas/aluno";

      const result = await Swal.fire({
        title: "Login realizado com sucesso",
        text: `Você será redirecionado para a página do ${usuario.tipo}.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      if (result.isConfirmed) {
        setLoading(true);
        router.push(route);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro ao realizar login.");
    }
  };

  const handleSignUp = () => {
    router.push("/rotas/cadastro");
  };

  return (
    <div className={`${isLightMode ? "bg-gray-100" : "bg-[#121212]"} min-h-screen flex items-center justify-center transition-colors duration-300`}>
      {loading && <LoadingOverlay />}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggleButton isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className={`text-center text-sm ${isLightMode ? "text-gray-800" : "text-white"}`}>
          <Link href="/" className="flex items-center gap-2 hover:text-gray-400 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} />
            Voltar para a página inicial
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`flex flex-col items-center gap-4 w-[clamp(320px,40vw,480px)] p-12 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isLightMode ? "bg-white shadow-lg" : "bg-[#1e1e1e]"
          }`}
        >
          <div className={`text-3xl mb-4 font-semibold ${isLightMode ? "text-gray-900" : "text-white"}`}>
            Entrar
          </div>

          <div className={`flex items-center px-4 py-2 rounded-xl w-full h-12 shadow-inner gap-2 ${isLightMode ? "bg-gray-200 text-gray-800" : "bg-[#121212] text-white"}`}>
            <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleFormEdit(e, "email")}
              className="bg-transparent outline-none w-full placeholder-gray-500"
            />
          </div>

          <div className={`relative flex items-center px-4 py-2 rounded-xl w-full h-12 shadow-inner gap-2 ${isLightMode ? "bg-gray-200 text-gray-800" : "bg-[#121212] text-white"}`}>
            <FontAwesomeIcon icon={faLock} className="text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => handleFormEdit(e, "password")}
              className="bg-transparent outline-none w-full placeholder-gray-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          {error && (
            <div className={`w-full p-2 rounded-md text-sm text-center transition-all ${
              isLightMode ? "bg-red-100 text-red-700" : "bg-red-200 text-red-800"
            }`}>
              {error}
            </div>
          )}

          <div className="flex gap-4 w-full mt-4">
            <button
              type="submit"
              className={`flex-1 rounded-md py-2 font-medium transition-colors ${
                isLightMode ? "bg-gray-300 text-gray-800 hover:bg-gray-400" : "bg-[#2b2b2b] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className={`flex-1 rounded-md py-2 font-medium transition-colors ${
                isLightMode ? "bg-gray-300 text-gray-800 hover:bg-gray-400" : "bg-[#2b2b2b] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
