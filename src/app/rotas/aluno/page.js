'use client'
import CheckoutAuxilio from "@/components/checkoutAuxilio"
import CheckoutPagar from "@/components/checkoutPagar"


export default function Alunos() {
    return (
        <div>
            <h1>Alunos</h1>
            <p>Essa página dos alunos.</p>
            <CheckoutAuxilio  title='Bolsa-Estudantil' price= {280} quantity={1} />
            <CheckoutPagar title='Pagamento do Aluno' price= {220} quantity={1}/>
        </div>
    )
}