"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export default function CadastroPage() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    cpf: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ telefone: "", cpf: "" });
  const router = useRouter();

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
      setError(err.message);
    }
  };

  useEffect(() =>{
    document.documentElement.classList.toggle("dark", isLightMode);
  }, [isLightMode]);

  return (
     <div className={`${isLightMode ? "bg-gray-100 text-black" : "bg-neutral-900 text-white"} w-full h-screen relative`}>
      <ThemeToggleButton isLightMode={isLightMode} setIsLightMode={setIsLightMode} />

     <div className="flex justify-center items-center h-full animate-fadeIn">
        <form
          onSubmit={handleSubmit}
          className={`w-[clamp(320px,40vw,480px)] rounded-xl shadow-lg p-8 flex flex-col gap-4 ${
            isLightMode ? "bg-gray-100" : "bg-neutral-800"
          }`}
        >
          <Link href="/" className="text-sm text-blue-500 hover:underline mb-2">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Voltar para a página inicial
          </Link>

          <h1 className="text-2xl font-bold mb-2">Crie sua Conta</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          {[
            { icon: faUser, name: "name", placeholder: "Seu nome", type: "text" },
            { icon: faEnvelope, name: "email", placeholder: "Seu e-mail", type: "email" },
            { icon: faPhone, name: "telefone", placeholder: "Seu telefone", type: "text", maxLength: 15 },
            { icon: faIdCard, name: "cpf", placeholder: "Seu CPF", type: "text", maxLength: 14 },
          ].map(({ icon, ...input }) => (
            <div key={input.name} className="flex items-center bg-white dark:bg-neutral-700 rounded-lg px-3 py-2">
              <FontAwesomeIcon icon={icon} className="text-gray-500 mr-2" />
              <input
                {...input}
                value={formData[input.name]}
                onChange={(e) => handleFormEdit(e, input.name)}
                required
                className="flex-1 bg-transparent outline-none text-black dark:text-white"
              />
            </div>
          ))}

          {fieldErrors.telefone && <p className="text-red-500 text-sm">{fieldErrors.telefone}</p>}
          {fieldErrors.cpf && <p className="text-red-500 text-sm">{fieldErrors.cpf}</p>}

          <div className="relative flex items-center bg-white dark:bg-neutral-700 rounded-lg px-3 py-2">
            <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              required
              value={formData.password}
              onChange={(e) => handleFormEdit(e, "password")}
              className="flex-1 bg-transparent outline-none text-black dark:text-white"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 cursor-pointer"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition">
            Cadastrar
          </button>

          <Link href="/rotas/login" className="text-sm text-blue-500 hover:underline text-center">
            Já possui conta? Faça login
          </Link>
        </form>
      </div>
    </div>
  );
}
