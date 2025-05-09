const base = '/api';

export const UserService = {
  // MOTORISTA
  async registrar(nome, email, telefone, cpf, senha) {
    const res = await fetch(`${base}/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, cpf, senha, tipo: 'motorista' }),
    });
    return res.json();
  },

  // ALUNO
  async registrarAluno(nome, email, telefone, cpf, senha, faculdade) {
    const res = await fetch(`${base}/registrarAluno`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, cpf, senha, faculdade, tipo: 'aluno' }),
    });
    return res.json();
  },

  async enviarSenhaPorEmail(email, senha) {
    try {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Bem-vindo a OrganizaBus',
          text: `Olá,

Seu cadastro no OrganizaBus foi realizado com sucesso!

Sua senha temporária é: ${senha}

Por favor, acesse o sistema e altere sua senha no primeiro login.

Atenciosamente,
Equipe OrganizaBus`,
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  },

  // LOGIN
  async verificarUsuario(email, senha) {
    try {
      const res = await fetch(`${base}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
  
      if (!res.ok) return null;
  
      const data = await res.json();
      return data.erro ? null : data;
    } catch (e) {
      console.error('Erro ao verificar usuário:', e);
      return null;
    }
  },
  
  

  // SESSION
  setCurrentUser(user) {
    localStorage.setItem('usuario', JSON.stringify(user));
  },

  getCurrentUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem('usuario');
  },
};
