export class User{
    constructor(nome, email, telefone, cpf, senha){
        this.nome = nome
        this.email = email
        this.telefone = telefone
        this.cpf = cpf
        this.senha = senha

    }
}
export class verificaUsuario{
    static users = []
    static async registro(nome, email, telefone, cpf, senha){
        const userExiste = this.users.some(user => user.email  == email|| user.cpf == cpf)
    if(userExiste){
        throw new Error('Usuário já existe')
    }
    const novoUsuario = new User(nome, email, telefone, cpf, senha)
    this.users.push(novoUsuario)
    return novoUsuario
    }
    static async buscaPorEmail(email){
        return this.users.find(user => user.email == email)
    }
    static async buscaPorCpf(cpf){
        return this.users.find(user => user.cpf == cpf)
    }
}