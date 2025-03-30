import Link from 'next/link' 
import styles from '../styles/Login.module.css'
import LoginCard from "@/components/loginCard"
import Input from '@/components/input'
import Button from '@/components/button'

export default function LoginPage() {
    return (
        <div className={styles.background}>
            <LoginCard title={'Entre em sua Conta'}>
                <form className={styles.form}>
                    <Input type="email" placeholder="Seu e-mail" />
                    <Input type="password" placeholder="Sua senha" />
                    <Button>Entrar</Button>
                    <Link href="/cadastro">Ainda não possui conta?</Link>
                </form>
            </LoginCard >
        </div>
    )
}