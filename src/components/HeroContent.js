import { TypeAnimation } from "react-type-animation";
import styles from "@/styles/components/HeroContent.module.css";
import VamosComecar from "@/components/StyledButton";

export default function HeroContent() {
  return (
    <main className={styles.overlayContent}>
      <h1 className={styles.title}>
        <TypeAnimation
          sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
          speed={{ type: "keyStrokeDelayInMs", value: 120 }}
          style={{ fontSize: "2.5rem" }}
          repeat={Infinity}
        />
      </h1>
      <p className={styles.description}>
        Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
      </p>
      <div className={styles.buttonWrapper}>
        <VamosComecar />
      </div>
    </main>
  );
}