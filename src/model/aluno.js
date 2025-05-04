import { User } from './user.js';
export class Aluno extends User {
  constructor(nome, email, telefone, cpf, senha, faculdade) {
    super(nome, email, telefone, cpf, senha);
    this.faculdade = faculdade;
    this.tipo = 'aluno';
  }
}
