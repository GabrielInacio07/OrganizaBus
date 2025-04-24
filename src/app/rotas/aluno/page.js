'use client'
import CheckoutButton from "@/components/checkoutButton"

export default function Alunos() {
    return (
        <div>
            <h1>Alunos</h1>
            <p>Essa página dos alunos.</p>
            <CheckoutButton  title='Bolsa-Municipal' price= {280} quantity= {1}/>
        </div>
    )
}