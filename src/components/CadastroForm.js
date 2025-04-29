// src/components/CadastroForm.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faIdCard, 
  faLock, 
  faArrowLeft,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons'
import styles from '@/styles/components/cadastroCard.module.css'
import { UserService } from '@/services/user.service'
import { useRouter } from 'next/navigation'

export default function CadastroForm() {
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
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
    const [isLightMode, setIsLightMode] = useState(false)

    // This useEffect ensures we only render UI elements that might cause
    // hydration mismatches after the component has mounted on the client
    useEffect(() => {
        // Check if there's a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsLightMode(savedTheme === 'light')
        }
        setIsClient(true)
    }, [])

    const formatarTelefone = (value) => {
        const nums = value.replace(/\D/g, '')
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
        const nums = value.replace(/\D/g, '')
        return nums
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    const validarTelefone = (telefone) => {
        const nums = telefone.replace(/\D/g, '')
        return nums.length >= 10
    }

    const validarCPF = (cpf) => {
        const nums = cpf.replace(/\D/g, '')
        return nums.length === 11
    }

    const handleFormEdit = (event, name) => {
        const value = event.target.value
        
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
            await UserService.registrar(
                formData.name, 
                formData.email, 
                formData.telefone.replace(/\D/g, ''),
                formData.cpf.replace(/\D/g, ''),      
                formData.password
            )
            alert('Usuário cadastrado com sucesso')
            router.push('/rotas/login')
        } catch (error) {
            setError(error.message)
        }
    }

    const toggleTheme = () => {
        const newThemeValue = !isLightMode
        setIsLightMode(newThemeValue)
        // Save theme preference
        localStorage.setItem('theme', newThemeValue ? 'light' : 'dark')
    }

    // Only render theme toggle after client-side hydration
    if (!isClient) {
        return <div className={styles.container}><div className={styles.loading}>Carregando...</div></div>
    }

    return (
        <div className={`${styles.container} ${isLightMode ? styles.lightMode : ''}`}>
            <div className={styles.background}>
                <div className={styles.themeToggleContainer}>
                    <label className={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={isLightMode}
                            onChange={toggleTheme}
                        />
                        <span className={`${styles.slider} ${styles.round}`}>
                            <span className={styles.icon}>
                                <FontAwesomeIcon 
                                    icon={isLightMode ? faSun : faMoon} 
                                    className={isLightMode ? styles.sunIcon : styles.moonIcon}
                                />
                            </span>
                        </span>
                    </label>
                </div>

                <div className={styles.cardWrapper}>
                    <div className={styles.voltarPagina}>
                        <Link href={'/'}><FontAwesomeIcon icon={faArrowLeft}/> Voltar para a página inicial</Link>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.loginCardTitle}>Crie sua Conta</div>

                        {error && (
                            <div className={styles.errorContainer}>
                                <p className={styles.error}>{error}</p>
                            </div>
                        )}

                        <div className={styles.field}>
                            <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Seu Nome"
                                className={styles.inputField}
                                required
                                value={formData.name}
                                onChange={(e) => handleFormEdit(e, 'name')}
                            />
                        </div>

                        <div className={styles.field}>
                            <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                className={styles.inputField}
                                required
                                value={formData.email}
                                onChange={(e) => handleFormEdit(e, 'email')}
                            />
                        </div>

                        <div className={styles.field}>
                            <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Seu Telefone"
                                className={styles.inputField}
                                required
                                value={formData.telefone}
                                onChange={(e) => handleFormEdit(e, 'telefone')}
                                maxLength={15}
                            />
                        </div>
                        {fieldErrors.telefone && <span className={styles.error}>{fieldErrors.telefone}</span>}

                        <div className={styles.field}>
                            <FontAwesomeIcon icon={faIdCard} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Seu CPF"
                                className={styles.inputField}
                                required
                                value={formData.cpf}
                                onChange={(e) => handleFormEdit(e, 'cpf')}
                                maxLength={14}
                            />
                        </div>
                        {fieldErrors.cpf && <span className={styles.error}>{fieldErrors.cpf}</span>}

                        <div className={styles.field}>
                            <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="Sua senha"
                                className={styles.inputField}
                                required
                                value={formData.password}
                                onChange={(e) => handleFormEdit(e, 'password')}
                            />
                        </div>

                        <div className={styles.btn}>
                            <button type="submit" className={styles.button1}>Cadastrar</button>
                        </div>

                        <Link href="/rotas/login" className={styles.link}>
                            Já possui conta? Faça login
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}