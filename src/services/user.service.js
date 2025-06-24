const base = '/api';

export const UserService = {
  // MOTORISTA
  async registrar(nome, email, telefone, cpf, senha, valorMensalidade) {
    const res = await fetch(`${base}/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, cpf, senha, tipo: 'motorista', valorMensalidade }),
    });
    return res.json();
  },

  // ALUNO
  async registrarAluno(nome, email, telefone, cpf, senha, faculdade, motoristaId, valorMensalidade, possuiBolsa, valorBolsa) {
  console.log("Dados enviados para a API:", {
    nome,
    email,
    telefone,
    cpf,
    senha,
    faculdade,
    motoristaId,
    valorMensalidade,
    possuiBolsa,
    valorBolsa,
  }); // Log para depuração
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
      valorMensalidade: parseFloat(valorMensalidade) || 0,
      possuiBolsa: Boolean(possuiBolsa), // Converte para booleano
      valorBolsa: possuiBolsa ? parseFloat(valorBolsa) || 0 : null,
      statusPagamento: 'não gerado',
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.erro || 'Erro ao cadastrar aluno');
  }
  return data;
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
    if (!user) return null;
    const parsed = JSON.parse(user);
    parsed.possuiBolsa = parsed.possuiBolsa === true || parsed.possuiBolsa === 'true'; 
    return parsed;
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
  async listarAlunos({ mes, ano } = {}) {
    const user = this.getCurrentUser();
    if (!user?.id) throw new Error('Usuário não encontrado');

    const query = new URLSearchParams({ motoristaId: user.id });
    if (mes) query.append('mes', mes);
    if (ano) query.append('ano', ano);

    const res = await fetch(`/api/alunos?${query.toString()}`);
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro?.erro || 'Erro ao buscar alunos');
    }
    return res.json();
  },

  async buscarAluno() {
    const user = this.getCurrentUser();

    if (!user || user.tipo !== 'aluno') {
      throw new Error('Usuário não é um aluno ou não está autenticado');
    }

    // Corrigir possíveis valores incorretos salvos como string
    user.possuiBolsa = user.possuiBolsa === true || user.possuiBolsa === "true";
    user.valorMensalidade = parseFloat(user.valorMensalidade || 0);
    user.valorBolsa =
      user.valorBolsa !== null && user.valorBolsa !== undefined
        ? parseFloat(user.valorBolsa)
        : 0;

    return Promise.resolve({ data: user });
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
    const res = await fetch(`/api/alunos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...dadosAtualizados }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro?.erro || "Erro ao atualizar aluno");
    }
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