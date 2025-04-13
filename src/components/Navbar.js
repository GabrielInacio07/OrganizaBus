import Link from "next/link";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">OrganizaBus</Link>
      </div>
      
    </nav>
  );
}