import { TypeAnimation } from "react-type-animation";
import styles from "@/styles/components/HeroContent.module.css";
import VamosComecar from "@/components/StyledButton";
import Image from "next/image";

export default function HeroContent() {
  return (
    <main className={styles.heroContainer}>
      <div className={styles.textContent}>
        <h1 className={styles.title}>
          <TypeAnimation
            sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
            speed={{ type: "keyStrokeDelayInMs", value: 120 }}
            style={{ fontSize: "3rem" }}
            repeat={Infinity}
          />
        </h1>
        <p className={styles.description}>
          Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
        </p>
        <div className={styles.buttonWrapper}>
          <VamosComecar />
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src="/img/mock.png"
          alt="OrganizaBus Screenshot"
          width={600}
          height={400}
          className={styles.image}
        />
      </div>
    </main>
  );
}
