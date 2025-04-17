import styles from '../../styles/components/loginCard.module.css'
import { useState } from 'react'
import { UserService } from '@/services/user.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faEnvelope, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showCreateAccount, setShowCreateAccount] = useState(false)

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
      const user = await UserService.buscarPorEmail(formData.email)

      if (!user) {
        setShowCreateAccount(true)
        throw new Error('Usuário não encontrado ou senha incorreta. Deseja criar uma conta?')
      }

      if (user.senha !== formData.password) {
        throw new Error('Senha incorreta')
      }

      alert('Login realizado com sucesso')
      window.location.href = '/' // redireciona para a home
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSignUp = () => {
    window.location.href = '/cadastro' // redireciona para cadastro
  }

  
  return (
    <div className={styles.container}>
      
    <div className={styles.background}>
      <div className={styles.cardWrapper}>
    <div className={styles.voltarPagina}>
        <Link href={'/'}><FontAwesomeIcon icon={faArrowLeft}/> Voltar para a página inicial</Link>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.loginCardTitle}>Entrar</div>

        <div className={styles.field}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={formData.email}
            onChange={(e) => handleFormEdit(e, 'email')}
          />
        </div>

        <div className={styles.field}>
          <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
          <input
            type="password"
            placeholder="Senha"
            className={styles.inputField}
            value={formData.password}
            onChange={(e) => handleFormEdit(e, 'password')}
          />
        </div>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.error}>{error}</p>
          </div>
        )}

        <div className={styles.btn}>
          <button type="submit" className={styles.button1}>Entrar</button>
          <button type="button" className={styles.button2} onClick={handleSignUp}>Cadastrar</button>
        </div>

      </form>
    </div>
    </div>
    </div>
  )
}
