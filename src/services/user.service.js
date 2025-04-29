import { User } from "../model/user";
import { Aluno } from "../model/aluno";

export class UserService {
  static getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  static setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  static setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static logout() {
    localStorage.removeItem('currentUser');
  }

  static async registrar(nome, email, telefone, cpf, senha) {
    const users = this.getUsers();
    const usuarioExistente = users.some((user) => user.email === email || user.cpf === cpf);
    if (usuarioExistente) {
      throw new Error('Usuário já existe');
    }

    const novoUsuario = new User(nome, email, telefone, cpf, senha);
    users.push(novoUsuario);
    this.setUsers(users);

    // Envia email de boas-vindas (se possível)
    await this.enviarSenhaPorEmail(email, senha);

    return novoUsuario;
  }

  static async registrarAluno(nome, email, telefone, cpf, senha, faculdade) {
    const users = this.getUsers();
    const usuarioExistente = users.some((user) => user.email === email || user.cpf === cpf);
    if (usuarioExistente) {
      throw new Error('Usuário já existe');
    }

    const novoAluno = new Aluno(nome, email, telefone, cpf, senha, faculdade);
    novoAluno.id = Date.now();
    users.push(novoAluno);
    this.setUsers(users);

    // Envia email de boas-vindas (se possível)
    await this.enviarSenhaPorEmail(email, senha);

    return novoAluno;
  }

  static async buscarPorEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  static listarAlunos() {
    const users = this.getUsers();
    return users.filter(user => user.faculdade);
  }

  static verificarAluno(email, senha) {
    const users = this.getUsers();
    return users.find(user => user.faculdade && user.email === email && user.senha === senha);
  }

  static verificarMotorista(email, senha) {
    const users = this.getUsers();
    return users.find(user => !user.faculdade && user.email === email && user.senha === senha);
  }

  static async enviarSenhaPorEmail(email, senha) {
    try {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Cadastro realizado com sucesso',
          text: `Seja bem-vindo!\n\nSua senha é: ${senha}\n\nRecomendamos que altere sua senha após o primeiro acesso.`,
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }
  
}
