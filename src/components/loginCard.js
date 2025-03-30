import styles from '../styles/loginCard.module.css';

export default function LoginCard({ title,children }) {
    return (
        <div className={styles.card}>
            <h4 className={styles.title}>{title}</h4>
            {children}
        </div>
    )
}