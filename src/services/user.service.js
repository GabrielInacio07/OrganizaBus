import { User } from "../model/user"
import { Aluno } from "../model/aluno"

export class UserService {
  static getUsers() {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }

  static setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users))
  }

  static async registrar(nome, email, telefone, cpf, senha) {
    const users = this.getUsers()
    const usuarioExistente = users.some((user) => user.email === email || user.cpf === cpf)
    if (usuarioExistente) {
      throw new Error('Usuário já existe')
    }

    const novoUsuario = new User(nome, email, telefone, cpf, senha)
    users.push(novoUsuario)
    this.setUsers(users)
    return novoUsuario
  }

  static async registrarAluno(nome, email, telefone, cpf, senha, faculdade) {
    const users = this.getUsers()
    const usuarioExistente = users.some((user) => user.email === email || user.cpf === cpf)
    if (usuarioExistente) {
      throw new Error('Usuário já existe')
    }

    const novoAluno = new Aluno(nome, email, telefone, cpf, senha, faculdade)
    novoAluno.id = Date.now() 
    users.push(novoAluno)
    this.setUsers(users)
    return novoAluno
  }

  static async buscarPorEmail(email) {
    const users = this.getUsers()
    return users.find(user => user.email === email)
  }

  static listarAlunos() {
    const users = this.getUsers()
    return users.filter(user => user instanceof Aluno) 
  }

  static async editarAluno(id, alunoAtualizado) {
    const users = this.getUsers()
    const index = users.findIndex(user => user.id === id && user instanceof Aluno)
    if (index === -1) {
      throw new Error('Aluno não encontrado')
    }
   
    users[index] = { ...users[index], ...alunoAtualizado }
    this.setUsers(users)
    return users[index]
  }

  static excluirAluno(id) {
    let users = this.getUsers()
    users = users.filter(user => !(user instanceof Aluno && user.id === id))
    this.setUsers(users)
  }

  static verificarAluno(email, senha) {
    const users = this.getUsers()
    return users.find(user => user instanceof Aluno && user.email === email && user.senha === senha)
  }
}
