'use client';
import { useState } from 'react';

export default function RecuperarAcesso() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarSenha = () => {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let senha = '';
    for (let i = 0; i < 8; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');

    try {
      const novaSenha = gerarSenha();

      // Atualiza a senha no banco
      const resAtualizacao = await fetch('/api/alterarSenha', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, novaSenha }),
      });

      if (!resAtualizacao.ok) {
        const erro = await resAtualizacao.json();
        throw new Error(erro.erro || 'Erro ao atualizar senha');
      }

      // Envia e-mail com a nova senha
      const resEmail = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Recuperação de Acesso - OrganizaBus',
          text: `Olá,\n\nSua nova senha de acesso ao OrganizaBus é: ${novaSenha}\n\nRecomendamos que você altere a senha após o login.\n\nEquipe OrganizaBus`,
        }),
      });

      if (!resEmail.ok) {
        throw new Error('Erro ao enviar o e-mail.');
      }

      setMensagem('Uma nova senha foi enviada para seu e-mail.');
    } catch (erro) {
      console.error(erro);
      setMensagem(erro.message);
    }

    setCarregando(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">Recuperar Acesso</h1>
      <form onSubmit={handleRecuperar}>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={carregando}
        >
          {carregando ? 'Enviando...' : 'Enviar nova senha'}
        </button>
      </form>
      {mensagem && (
        <p className="mt-4 text-center text-sm text-gray-700">{mensagem}</p>
      )}
    </div>
  );
}
