import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' 
import styles from '../styles/Login.module.css'
import LoginCard from "@/components/loginCard"
import Input from '@/components/input'
import Button from '@/components/button'
import { verificaUsuario } from '@/model/user'

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefone: '',
        cpf: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({
        telefone: '',
        cpf: ''
    })
    const router = useRouter()

    const formatarTelefone = (value) => {
        // Remove tudo que não é dígito
        const nums = value.replace(/\D/g, '')
        
        // Aplica máscara: (00) 00000-0000
        if (nums.length <= 10) {
            return nums
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
        } else {
            return nums
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
        }
    }

    const formatarCPF = (value) => {
        // Remove tudo que não é dígito
        const nums = value.replace(/\D/g, '')
        
        // Aplica máscara: 000.000.000-00
        return nums
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    const validarTelefone = (telefone) => {
        // Remove não dígitos e verifica se tem pelo menos 10 dígitos (DDD + número)
        const nums = telefone.replace(/\D/g, '')
        return nums.length >= 10
    }

    const validarCPF = (cpf) => {
        // Remove não dígitos e verifica se tem 11 dígitos
        const nums = cpf.replace(/\D/g, '')
        return nums.length === 11
    }

    const handleFormEdit = (event, name) => {
        const value = event.target.value
        
        // Aplica formatação conforme o campo
        let formattedValue = value
        if (name === 'telefone') {
            formattedValue = formatarTelefone(value)
        } else if (name === 'cpf') {
            formattedValue = formatarCPF(value)
        }

        setFormData({
            ...formData,
            [name]: formattedValue
        })

        setFieldErrors({
            ...fieldErrors,
            [name]: ''
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        
        // Validações antes de enviar
        const errors = {}
        if (!validarTelefone(formData.telefone)) {
            errors.telefone = 'Telefone inválido (mínimo 10 dígitos)'
        }
        if (!validarCPF(formData.cpf)) {
            errors.cpf = 'CPF inválido (deve ter 11 dígitos)'
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }

        try {
            await verificaUsuario.registro(
                formData.name, 
                formData.email, 
                formData.telefone.replace(/\D/g, ''),
                formData.cpf.replace(/\D/g, ''),      
                formData.password
            )
            alert('Usuário cadastrado com sucesso')
            router.push('/loginPage') 
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className={styles.background}>
            <LoginCard title={'Crie sua Conta'}>
                {error && <p className={styles.error}>{error}</p>}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input 
                        type="text" 
                        placeholder="Seu Nome" 
                        required 
                        value={formData.name} 
                        onChange={(e) => handleFormEdit(e, 'name')} 
                    />
                    <Input 
                        type="email" 
                        placeholder="Seu e-mail" 
                        required 
                        value={formData.email} 
                        onChange={(e) => handleFormEdit(e, 'email')} 
                    />
                    <Input 
                        type="text" 
                        placeholder="Seu Telefone " 
                        required 
                        value={formData.telefone} 
                        onChange={(e) => handleFormEdit(e, 'telefone')}
                        error={fieldErrors.telefone}
                        maxLength={15}
                    />
                    <Input 
                        type="text" 
                        placeholder="Seu CPF " 
                        required 
                        value={formData.cpf} 
                        onChange={(e) => handleFormEdit(e, 'cpf')}
                        error={fieldErrors.cpf}
                        maxLength={14}
                    />
                    <Input 
                        type="password" 
                        placeholder="Sua senha" 
                        required 
                        value={formData.password} 
                        onChange={(e) => handleFormEdit(e, 'password')} 
                    />
                    <Button type="submit">Cadastrar</Button>
                    <Link href="/loginPage">Já possui conta?</Link>
                </form>
            </LoginCard>
        </div>
    )
}