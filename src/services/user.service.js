import { User } from "@/model/user";

export class UserService{
    static users = []

    static async registrar(nome, email,telefone, cpf, senha){
        const usuarioExistente = this.users.some((user) => user.email === email || user.cpf === cpf)
        if(usuarioExistente){
            throw new Error('Usuário já existe')
        }
        const novoUsuario = new User(nome, email, telefone, cpf, senha)
        this.users.push(novoUsuario)
        return novoUsuario
    }
    static async buscarPorEmail(email){
        return this.users.find(user => user.email === email)
    }
}