import { User } from "@/model/user";

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

    static async buscarPorEmail(email) {
        const users = this.getUsers()
        return users.find(user => user.email === email)
    }
}
