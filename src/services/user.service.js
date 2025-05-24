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
 async registrarAluno(nome, email, telefone, cpf, senha, faculdade, motoristaId) {
  const res = await fetch(`${base}/registrarAluno`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome,
      email,
      telefone,
      cpf,
      senha,
      faculdade,
      tipo: 'aluno',
      motoristaId,
      statusPagamento: 'não gerado'
    }),
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
    console.log("Dados recebidos do backend:", data);

    if (data.erro) return null;

    // Corrigir tipo mesmo se não existir
    if (!data.tipo) {
      data.tipo = 'aluno'; // fallback se backend não mandou
    } else {
      data.tipo = data.tipo.toLowerCase();
    }

    return data;
  } catch (e) {
    console.error('Erro ao verificar usuário:', e);
    return null;
  }
},

  // SESSION
  setCurrentUser(user) {
    if (user?.tipo) {
      user.tipo = user.tipo.toLowerCase(); // garante tipo minúsculo no localStorage
    }
    localStorage.setItem('usuario', JSON.stringify(user));
  },

  getCurrentUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem('usuario');
  },

  // PERFIL DO MOTORISTA
  async obterPerfilMotorista(id) {
    const res = await fetch(`${base}/motorista/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro?.erro || 'Erro ao buscar perfil do motorista');
    }

    return res.json();
  },

  async atualizarPerfilMotorista(id, dadosAtualizados) {
    const res = await fetch(`${base}/motorista/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro?.erro || 'Erro ao atualizar perfil');
    }

    const dadosAtualizadosResponse = await res.json();
    
    // Atualizar dados no localStorage
    const usuarioAtual = this.getCurrentUser();
    if (usuarioAtual && usuarioAtual.id === id) {
      const usuarioAtualizado = { ...usuarioAtual, ...dadosAtualizadosResponse };
      this.setCurrentUser(usuarioAtualizado);
    }

    return dadosAtualizadosResponse;
  },

  async alterarSenhaMotorista(id, senhaAtual, novaSenha) {
    const res = await fetch(`${base}/motorista/${id}/senha`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro?.erro || 'Erro ao alterar senha');
    }

    return res.json();
  },

  // Suporte para lista e remoção de alunos
async listarAlunos() {
  const user = this.getCurrentUser();
  if (!user?.id) throw new Error('Usuário não encontrado');

  const res = await fetch(`/api/alunos?motoristaId=${user.id}`);
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro?.erro || 'Erro ao buscar alunos');
  }
  return res.json();
},

async removerAluno(id) {
  const res = await fetch('/api/alunos', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    let mensagem = 'Erro ao remover aluno';
    try {
      const data = await res.json();
      mensagem = data.erro || mensagem;
    } catch {}
    throw new Error(mensagem);
  }

  try {
    return await res.json();
  } catch {
    return { ok: true }; // fallback seguro
  }
},

async atualizarAluno(id, dadosAtualizados) {
  const res = await fetch(`/api/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
  if (!res.ok) throw new Error("Erro ao atualizar aluno");
  return await res.json();
},

async alterarSenha(email, novaSenha) {
  const res = await fetch('/api/alterarSenha', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, novaSenha }),
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro?.erro || 'Erro ao alterar senha');
  }

  return res.json();
}
};