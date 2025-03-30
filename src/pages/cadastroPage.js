import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Login.module.css'
import LoginCard from "@/components/loginCard"
import Input from '@/components/input'
import Button from '@/components/button'


export default function cadastroPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefone: '',
        cpf: '',
        password: ''
    })

    const hanldeFormEdit = (event, name) =>{
        event.preventDefault()
        setFormData({
            ...formData,
            [name]: event.target.value
            
        })
        console.log(formData) 
    }

  

    return (
        <div className={styles.background}>
            <LoginCard title={'Crie sua Conta'}>
                <form className={styles.form}>
                    <Input type="text" placeholder="Seu Nome" required value={formData.name} onChange={(e) => { hanldeFormEdit(e, 'name') }} />
                    <Input type="email" placeholder="Seu e-mail" required value={formData.email} onChange={(e) => { hanldeFormEdit(e, 'email') }} />
                    <Input type="text" placeholder="Seu Telefone" required value={formData.telefone} onChange={(e) => { hanldeFormEdit(e, 'telefone') }} />
                    <Input type="text" placeholder="Seu CPF" required value={formData.cpf} onChange={(e) => { hanldeFormEdit(e, 'cpf') }} />
                    <Input type="password" placeholder="Sua senha" required value={formData.password} onChange={(e) => { hanldeFormEdit(e, 'password') }} />
                    <Button>Cadastrar</Button>
                    <Link href="/login">Já possui conta?</Link>
                </form>
            </LoginCard >

        </div>
    )
}