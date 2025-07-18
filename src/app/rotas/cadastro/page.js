"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faLock,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faDollarSign,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { UserService } from "@/services/user.service";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import Swal from "sweetalert2";
import Image from "next/image";
import LoadingOverlay from "@/components/loadingOverlay";

export default function CadastroPage() {
  const router = useRouter();
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pixTipo, setPixTipo] = useState(false);
  const [pixEditavel, setPixEditavel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    valorMensalidade: "",
    pixChave: "",
    diaVencimento: "",
  });

  const [fieldErrors, setFieldErrors] = useState({ telefone: "", cpf: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !isLightMode);
  }, [isLightMode]);

  const formatarTelefone = (value) => {
    const nums = value.replace(/\D/g, "");
    return nums.length <= 10
      ? nums.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
      : nums.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatarCPF = (value) => {
    const nums = value.replace(/\D/g, "");
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const validarTelefone = (tel) => tel.replace(/\D/g, "").length >= 10;
  const validarCPF = (cpf) => cpf.replace(/\D/g, "").length === 11;

  const handleFormEdit = (e, name) => {
    const value = e.target.value;
    const formattedValue =
      name === "telefone"
        ? formatarTelefone(value)
        : name === "cpf"
        ? formatarCPF(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = {};
    if (!validarTelefone(formData.telefone)) {
      errors.telefone = "Telefone inválido";
    }
    if (!validarCPF(formData.cpf)) {
      errors.cpf = "CPF inválido";
    }
    if (formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Senha muito curta",
        text: "A senha deve ter no mínimo 6 caracteres.",
      });
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Senhas diferentes",
        text: "As senhas não coincidem.",
      });
      setIsLoading(false);
      return;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await UserService.registrar(
        formData.name,
        formData.email,
        formData.telefone.replace(/\D/g, ""),
        formData.cpf.replace(/\D/g, ""),
        formData.password,
        parseFloat(formData.valorMensalidade) || 0,
        parseInt(formData.diaVencimento) || 1,
      );

      Swal.fire({
        icon: "success",
        title: "Cadastro realizado!",
        text: "Usuário cadastrado com sucesso.",
        confirmButtonText: "Ir para o login",
      }).then(() => {
        router.push("/rotas/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar",
        text: err.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isLightMode ? "bg-gray-50" : "bg-[#0f1f4b]"
        }`}
      >
        <div className="absolute top-5 right-5 z-10">
          <ThemeToggleButton
            isLightMode={isLightMode}
            setIsLightMode={setIsLightMode}
          />
        </div>

        <div className="flex flex-col items-center gap-4 px-4 sm:px-6 lg:px-8 max-w-[800px] w-full">
          <div className="mt- md:w-35 md:h-35 sm:w-40 sm:h-40 rounded-full mx-auto mb-1 shadow-md bg-white">
            <Link href="/" className="flex items-center justify-center">
              <Image src="/img/logo.png" width={150} height={150} alt="Logo" />
            </Link>
          </div>

          <div
            className={`text-center text-sm ${
              isLightMode ? "text-blue-600" : "text-white"
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
            className="flex flex-col items-center gap-6 w-full mb-9 p-6 sm:p-8 rounded-3xl shadow-2xl bg-white"
          >
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Criar Conta
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[
                { icon: faUser, name: "name", placeholder: "Nome" },
                {
                  icon: faEnvelope,
                  name: "email",
                  placeholder: "Email",
                  type: "email",
                },
                {
                  icon: faPhone,
                  name: "telefone",
                  placeholder: "Telefone",
                  maxLength: 15,
                },
                {
                  icon: faIdCard,
                  name: "cpf",
                  placeholder: "CPF",
                  maxLength: 14,
                },
              ].map(({ icon, ...input }) => (
                <div
                  key={input.name}
                  className="flex items-center px-4 py-2 rounded-xl h-10 md:h-12 shadow-inner gap-2 bg-gray-100 text-gray-900"
                >
                  <FontAwesomeIcon icon={icon} className="text-lg" />
                  <input
                    {...input}
                    type={input.type || "text"}
                    value={formData[input.name]}
                    onChange={(e) => handleFormEdit(e, input.name)}
                    className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                    required
                  />
                </div>
              ))}
              <div className="flex items-center px-4 py-2 rounded-xl h-10 md:h-12 shadow-inner gap-2 bg-gray-100 text-gray-900">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />
                <input
                  type="number"
                  name="diaVencimento"
                  placeholder="Dia de vencimento (1 a 31)"
                  value={formData.diaVencimento}
                  onChange={(e) => handleFormEdit(e, "diaVencimento")}
                  min={1}
                  max={31}
                  className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                  required
                />
              </div>

              {/* Mensalidade */}
              <div className="flex items-center px-4 py-2 rounded-xl h-10 md:h-12 shadow-inner gap-2 bg-gray-100 text-gray-900">
                <FontAwesomeIcon icon={faDollarSign} className="text-lg" />
                <input
                  type="number"
                  name="valorMensalidade"
                  placeholder="Valor da mensalidade (R$)"
                  value={formData.valorMensalidade}
                  onChange={(e) => handleFormEdit(e, "valorMensalidade")}
                  className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                  required
                />
              </div>

              {/* Chave Pix com abas */}
              <div className="relative mt-6 w-full col-span-1 md:col-span-1 md:mt-4">
                <div className="absolute -top-6 left-2 sm:left-4 flex flex-wrap gap-2 bg-white px-2 z-10">
                  {["telefone", "email", "aleatoria"].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => {
                        setPixTipo(tipo);
                        setPixEditavel(false);
                      }}
                      className={`px-3 py-1 text-sm font-medium border rounded-md ${
                        pixTipo === tipo
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {tipo === "telefone"
                        ? "Telefone"
                        : tipo === "email"
                        ? "Email"
                        : "Chave aleatória"}
                    </button>
                  ))}
                </div>

                <div className="mt-3 md:mt-3 flex items-center px-4 py-2 rounded-xl h-10 md:h-12 shadow-inner gap-2 bg-gray-100 text-gray-900">
                  <input
                    type="text"
                    onClick={() => {
                      if (pixTipo !== "aleatoria") setPixEditavel(true);
                    }}
                    readOnly={pixTipo !== "aleatoria" && !pixEditavel}
                    value={
                      pixTipo === "telefone" && !pixEditavel
                        ? formData.telefone
                        : pixTipo === "email" && !pixEditavel
                        ? formData.email
                        : formData.pixChave
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pixChave: e.target.value,
                      }))
                    }
                    placeholder={
                      `Chave Pix ` +
                      (pixTipo === "telefone"
                        ? "Telefone"
                        : pixTipo === "email"
                        ? "Email"
                        : "Aleatória")
                    }
                    className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Senhas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[
                ["password", "Senha"],
                ["confirmPassword", "Repita a senha"],
              ].map(([field, placeholder]) => (
                <div
                  key={field}
                  className="relative flex items-center px-4 py-2 rounded-xl h-10 md:h-12 shadow-inner gap-2 bg-gray-100 text-gray-900"
                >
                  <FontAwesomeIcon icon={faLock} className="text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChange={(e) => handleFormEdit(e, field)}
                    className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-md py-2 font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>

            <Link
              href="/rotas/login"
              className="text-sm text-blue-500 hover:underline mt-2 text-center w-full"
            >
              Já possui conta? Faça login
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}