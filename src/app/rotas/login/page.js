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
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-300 ${
        isLightMode ? "bg-white" : "bg-[#0f1f4b]"
      }`}
    >
      {loading && <LoadingOverlay />}

      <div className="absolute top-5 right-5 z-10">
        <ThemeToggleButton
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <div
          className={`text-center text-sm ${
            isLightMode ? "text-gray-800" : "text-white"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Voltar para a página inicial
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full max-w-lg md:max-w-xl lg:max-w-2xl px-8 py-10 rounded-2xl shadow-xl bg-white transition-all duration-300"
        >
          <div
            className={`text-3xl md:text-4xl mb-2 font-semibold ${
              isLightMode ? "text-gray-900" : "text-gray-900"
            }`}
          >
            Entrar
          </div>

          <div className="flex items-center px-4 py-3 rounded-xl w-full h-14 shadow-inner gap-3 bg-gray-100 text-gray-900">
            <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleFormEdit(e, "email")}
              className="bg-transparent outline-none w-full placeholder-gray-500 text-base"
            />
          </div>

          <div className="relative flex items-center px-4 py-3 rounded-xl w-full h-14 shadow-inner gap-3 bg-gray-100 text-gray-900">
            <FontAwesomeIcon icon={faLock} className="text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => handleFormEdit(e, "password")}
              className="bg-transparent outline-none w-full placeholder-gray-500 text-base"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          {error && (
            <div
              className={`w-full p-3 rounded-md text-sm text-center transition-all ${
                isLightMode
                  ? "bg-red-100 text-red-700"
                  : "bg-red-600 text-red-200"
              }`}
            >
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
            <button
              type="submit"
              className={`w-full sm:flex-1 rounded-xl py-3 font-semibold text-base transition-colors ${
                isLightMode
                  ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className={`w-full sm:flex-1 rounded-xl py-3 font-semibold text-base transition-colors ${
                isLightMode
                  ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  : "bg-blue-700 text-white hover:bg-blue-800"
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
