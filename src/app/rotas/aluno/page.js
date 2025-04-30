'use client'
import { BotaoSair } from "@/components/botaoSair"
import CheckoutAuxilio from "@/components/checkoutAuxilio"
import CheckoutPagar from "@/components/checkoutPagar"
import { UserService } from "@/services/user.service"
import { useRouter } from "next/navigation"
export default function Alunos() {
    const router = useRouter()
    const handleLogout = () => {
        UserService.logout()
        router.push('/rotas/login')
      }
    return (
        <div>
            <h1>Alunos</h1>
            <BotaoSair onClick={handleLogout} />
            <p>Essa página dos alunos.</p>
            <CheckoutAuxilio  title='Bolsa-Estudantil' price= {280} quantity={1} />
            <CheckoutPagar title='Pagamento do Aluno' price= {220} quantity={1}/>
        </div>
    )
}