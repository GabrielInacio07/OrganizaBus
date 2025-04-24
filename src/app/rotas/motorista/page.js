'use client'
import { useState, useEffect } from 'react'
import { UserService } from '@/services/user.service'
import { useRouter } from 'next/navigation'

export default function Motorista() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    faculdade: '',
    senha: ''
  })
  const [alunos, setAlunos] = useState([])
  const [motoristaLogado, setMotoristaLogado] = useState(false)

  useEffect(() => {
    const verificarLogin = () => {
      const user = UserService.getCurrentUser()

      if (user && user.tipo === 'motorista'){
        setMotoristaLogado(true)
        carregarAlunos()
      }else{
        alert('Você não está logado como motorista ou não tem permissão para acessar esta página.')
        router.push('/rotas/login')
      }
    
    }
    verificarLogin()
  }, [])

  const carregarAlunos = () => {
    const alunosCadastrados = UserService.listarAlunos()
    console.log('Alunos carregados:', alunosCadastrados) // Adicione este log para debug
    setAlunos(alunosCadastrados)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
      const novoAluno = await UserService.registrarAluno(
        formData.nome,
        formData.email,
        formData.telefone,
        formData.cpf,
        formData.senha,
        formData.faculdade,
        currentUser.email 
      )
  
      console.log('Novo aluno cadastrado:', novoAluno)
      alert('Aluno cadastrado com sucesso')
  
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        faculdade: '',
        senha: ''
      })
  
      carregarAlunos()
    } catch (error) {
      alert(error.message)
    }
  }
  

  const handleLogout = () => {
    UserService.logout()
    router.push('/rotas/login')
  }

  if (!motoristaLogado) {
    return <div>Verificando login...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Página Motorista</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Sair
        </button>
      </div>

      <div style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h2>Cadastrar Novo Aluno</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="faculdade">Faculdade</label>
            <input
              type="text"
              id="faculdade"
              name="faculdade"
              value={formData.faculdade}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 20px', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2>Alunos Cadastrados</h2>
        {alunos.length === 0 ? (
          <p>Nenhum aluno cadastrado ainda.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nome</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Faculdade</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id || aluno.cpf} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{aluno.nome}</td>
                  <td style={{ padding: '12px' }}>{aluno.email}</td>
                  <td style={{ padding: '12px' }}>{aluno.faculdade}</td>
                  <td style={{ padding: '12px' }}>{aluno.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}