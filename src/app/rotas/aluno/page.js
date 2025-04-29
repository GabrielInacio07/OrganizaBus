'use client'
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
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Sair
        </button>
            <p>Essa página dos alunos.</p>
            <CheckoutAuxilio  title='Bolsa-Estudantil' price= {280} quantity={1} />
            <CheckoutPagar title='Pagamento do Aluno' price= {220} quantity={1}/>
        </div>
    )
}