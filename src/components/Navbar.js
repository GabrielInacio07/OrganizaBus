import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  return (
    <div>
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/"><Image className={styles.image} src='/img/logo.png' width={120} height={120} alt="Logo do site" /></Link>
      </div>
    </nav>
    </div>
  );
}