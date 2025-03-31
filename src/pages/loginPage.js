import Link from 'next/link' 
import styles from '../styles/Login.module.css'
import LoginCard from "@/components/loginCard"
import Input from '@/components/input'
import Button from '@/components/button'
import { verificaUsuario } from '@/model/user'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [showCreateAccount, setShowCreateAccount] = useState(false) // Novo estado para controlar a sugestão
    const router = useRouter()

    const handleFormEdit = (event, name) => {
        event.preventDefault()
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setShowCreateAccount(false)
        try {
            const user = await verificaUsuario.buscaPorEmail(formData.email)
            
            if(!user){
                setShowCreateAccount(true) 
                throw new Error('Usuário não encontrado. Deseja criar uma conta?')
            }
            
            if(user.senha !== formData.password){
                throw new Error('Senha incorreta')
            }
            
            alert('Login realizado com sucesso')
            router.push('/') 
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className={styles.background}>
            <LoginCard title={'Entre em sua Conta'}>
                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.error}>{error}</p>
                        {showCreateAccount && (
                            <Link href="/cadastroPage" className={styles.createAccountLink}>
                                <Button type="button">Criar conta agora</Button>
                            </Link>
                        )}
                    </div>
                )}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input 
                        type="email" 
                        placeholder="Seu e-mail" 
                        required 
                        value={formData.email} 
                        onChange={(e) => handleFormEdit(e, 'email')} 
                    />
                    <Input 
                        type="password" 
                        placeholder="Sua senha" 
                        required 
                        value={formData.password} 
                        onChange={(e) => handleFormEdit(e, 'password')} 
                    />
                    <Button type="submit">Entrar</Button>
                    <Link href="/cadastroPage" className={styles.link}>Ainda não possui conta?</Link>
                </form>
            </LoginCard>
        </div>
    )
}