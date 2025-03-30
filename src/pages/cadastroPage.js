import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Login.module.css'
import LoginCard from "@/components/loginCard"
import Input from '@/components/input'
import Button from '@/components/button'
import { verificaUsuario } from '@/model/user'

export default function cadastroPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefone: '',
        cpf: '',
        password: ''
    })
    const [error, setError] = useState('')

    const hanldeFormEdit = (event, name) =>{
        event.preventDefault()
        setFormData({
            ...formData,
            [name]: event.target.value
            
        })
       
    }
const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try{
        await verificaUsuario.registro(formData.name, formData.email, formData.telefone, formData.cpf, formData.password)
        alert('Usuário cadastrado com sucesso')
    }catch (error){
        setError(error.message)
    }
}
  

return (
    <div className={styles.background}>
        <LoginCard title={'Crie sua Conta'}>
            {error && <p className={styles.error}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input type="text" placeholder="Seu Nome" required value={formData.name} onChange={(e) => { hanldeFormEdit(e, 'name') }} />
                <Input type="email" placeholder="Seu e-mail" required value={formData.email} onChange={(e) => { hanldeFormEdit(e, 'email') }} />
                <Input type="text" placeholder="Seu Telefone" required value={formData.telefone} onChange={(e) => { hanldeFormEdit(e, 'telefone') }} />
                <Input type="text" placeholder="Seu CPF" required value={formData.cpf} onChange={(e) => { hanldeFormEdit(e, 'cpf') }} />
                <Input type="password" placeholder="Sua senha" required value={formData.password} onChange={(e) => { hanldeFormEdit(e, 'password') }} />
                <Button type="submit">Cadastrar</Button>
                <Link href="/loginPage">Já possui conta?</Link>
            </form>
        </LoginCard>
    </div>
)
}