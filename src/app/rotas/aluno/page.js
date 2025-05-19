'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BotaoSair } from "@/components/botaoSair";
import CheckoutAuxilio from "@/components/checkoutAuxilio";
import CheckoutPagar from "@/components/checkoutPagar";
import { UserService } from "@/services/user.service";

export default function Alunos() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const user = UserService.getCurrentUser();

  const handleLogout = () => {
    UserService.logout();
    router.push('/rotas/login');
  };

  const handleAlterarSenha = async () => {
    try {
      await UserService.alterarSenha(user.email, novaSenha);
      setMensagem('Senha alterada com sucesso!');
      setNovaSenha('');
    } catch (error) {
      setMensagem(error.message);
    }
  };

  return (
    <div>
      <h1>Alunos</h1>
      <BotaoSair onClick={handleLogout} />
      <p>Essa é a página dos alunos.</p>

      <div style={{ marginTop: 20 }}>
        <h2>Alterar Senha</h2>
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <button onClick={handleAlterarSenha}>Salvar nova senha</button>
        {mensagem && <p>{mensagem}</p>}
      </div>

      <CheckoutAuxilio title='Bolsa-Estudantil' price={280} quantity={1} />
      <CheckoutPagar title='Pagamento do Aluno' price={220} quantity={1} />
    </div>
  );
}
