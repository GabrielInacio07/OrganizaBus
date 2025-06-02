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
} from "@fortawesome/free-solid-svg-icons";
import { UserService } from "@/services/user.service";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function CadastroPage() {
  const router = useRouter();
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
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
    setError("");

    const errors = {};
    if (!validarTelefone(formData.telefone)) {
      errors.telefone = "Telefone inválido (mínimo 10 dígitos)";
    }
    if (!validarCPF(formData.cpf)) {
      errors.cpf = "CPF inválido (deve ter 11 dígitos)";
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await UserService.registrar(
        formData.name,
        formData.email,
        formData.telefone.replace(/\D/g, ""),
        formData.cpf.replace(/\D/g, ""),
        formData.password
      );
      alert("Usuário cadastrado com sucesso");
      router.push("/rotas/login");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isLightMode
          ? "bg-white"
          : "bg-[#0f1f4b]"
      }`}
    >
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggleButton
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
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
          className={`flex flex-col items-center gap-4 w-[clamp(320px,40vw,480px)] p-12 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 bg-white`}
        >
          <h1 className="text-3xl mb-4 font-semibold text-gray-900">
            Criar Conta
          </h1>

          {[
            { icon: faUser, name: "name", placeholder: "Nome" },
            { icon: faEnvelope, name: "email", placeholder: "Email", type: "email" },
            { icon: faPhone, name: "telefone", placeholder: "Telefone", maxLength: 15 },
            { icon: faIdCard, name: "cpf", placeholder: "CPF", maxLength: 14 },
          ].map(({ icon, ...input }) => (
            <div
              key={input.name}
              className="flex items-center px-4 py-2 rounded-xl w-full h-12 shadow-inner gap-2 bg-gray-100 text-gray-900"
            >
              <FontAwesomeIcon icon={icon} className="text-lg" />
              <input
                {...input}
                type={input.type || "text"}
                value={formData[input.name]}
                onChange={(e) => handleFormEdit(e, input.name)}
                className="bg-transparent outline-none w-full placeholder-gray-500"
                required
              />
            </div>
          ))}

          {fieldErrors.telefone && (
            <p className="text-red-500 text-sm w-full">{fieldErrors.telefone}</p>
          )}
          {fieldErrors.cpf && (
            <p className="text-red-500 text-sm w-full">{fieldErrors.cpf}</p>
          )}

          {[["password", "Senha"], ["confirmPassword", "Repita a senha"]].map(
            ([field, placeholder], i) => (
              <div
                key={field}
                className="relative flex items-center px-4 py-2 rounded-xl w-full h-12 shadow-inner gap-2 bg-gray-100 text-gray-900"
              >
                <FontAwesomeIcon icon={faLock} className="text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  value={formData[field]}
                  onChange={(e) => handleFormEdit(e, field)}
                  className="bg-transparent outline-none w-full placeholder-gray-500"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
            )
          )}

          {error && (
            <div className="w-full p-2 rounded-md text-sm text-center bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 rounded-md py-2 font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          >
            Cadastrar
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
  );
}
