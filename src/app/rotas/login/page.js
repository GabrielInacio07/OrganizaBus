"use client";
import styles from "@/styles/components/loginCard.module.css";
import { useState } from "react";
import { UserService } from "@/services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faEnvelope,
  faLock,
  faArrowLeft,
  faSun,
  faMoon,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormEdit = (event, name) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setShowCreateAccount(false);
    try {
      const motorista = await UserService.verificarMotorista(
        formData.email,
        formData.password
      );

      if (motorista) {
        UserService.setCurrentUser(motorista);
        alert("Login como motorista realizado com sucesso");
        router.push("/rotas/motorista");
        return;
      }
      const aluno = await UserService.verificarAluno(
        formData.email,
        formData.password
      );
      if (aluno) {
        UserService.setCurrentUser(aluno);
        alert("Login como aluno realizado com sucesso");
        router.push("/rotas/aluno");
        return;
      }
      setShowCreateAccount(true);
      setError(
        "Usuário não encontrado ou senha incorreta. Deseja criar uma conta?"
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = () => {
    router.push("/rotas/cadastro");
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <div
      className={`${styles.container} ${isLightMode ? styles.lightMode : ""}`}
    >
      <div className={styles.background}>
        <div className={styles.themeToggleContainer}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isLightMode}
              onChange={toggleTheme}
            />
            <span className={`${styles.slider} ${styles.round}`}>
              <span className={styles.icon}>
                <FontAwesomeIcon
                  icon={isLightMode ? faSun : faMoon}
                  className={isLightMode ? styles.sunIcon : styles.moonIcon}
                />
              </span>
            </span>
          </label>
        </div>

        <div className={styles.cardWrapper}>
          <div className={styles.voltarPagina}>
            <Link href={"/"}>
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar para a página
              inicial
            </Link>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.loginCardTitle}>Entrar</div>

            <div className={styles.field}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email"
                className={styles.inputField}
                value={formData.email}
                onChange={(e) => handleFormEdit(e, "email")}
              />
            </div>

            <div className={styles.field} style={{ position: "relative" }}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className={styles.inputField}
                value={formData.password}
                onChange={(e) => handleFormEdit(e, "password")}
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            {error && (
              <div className={styles.errorContainer}>
                <p className={styles.error}>{error}</p>
              </div>
            )}

            <div className={styles.btn}>
              <button type="submit" className={styles.button1}>
                Entrar
              </button>
              <button
                type="button"
                className={styles.button2}
                onClick={handleSignUp}
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
