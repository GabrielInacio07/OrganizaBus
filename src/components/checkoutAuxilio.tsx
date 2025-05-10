'use client'
import { useEffect, useState } from 'react'
import styles from '../styles/Botao.module.css'
import { UserService } from '@/services/user.service'

interface Product {
  title: string
  price: number
  quantity: number
}

export default function CheckoutAuxilio({ title, price, quantity }: Product) {
  const [user, setUser] = useState<any>(null)
  const [qrCodeBase64, setQrCodeBase64] = useState("")
  const [codigoPix, setCodigoPix] = useState("")

  useEffect(() => {
    const currentUser = UserService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handlePayment = async () => {
    if (!user) {
      alert("Usuário não identificado.")
      return
    }

    const response = await fetch('/api/mp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        price,
        quantity,
        payer: {
          email: user.email,
          first_name: user.nome?.split(" ")[0] || "Aluno",
          last_name: user.nome?.split(" ")[1] || "",
        },
        userId: user.id,
      })
    })

    const data = await response.json()
    if (data.qr_code_base64 && data.qr_code) {
      setQrCodeBase64(data.qr_code_base64)
      setCodigoPix(data.qr_code)
    }
  }

  return (
    <div>
      <button className={styles.botao} onClick={handlePayment} disabled={!user}>
        Bolsa Estudantil
      </button>

      {qrCodeBase64 && (
        <div style={{ marginTop: 20 }}>
          <p>Escaneie o QR Code:</p>
          <img
            style={{ width: 200, height: 200 }}
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code PIX"
          />
          <p>
            <strong>PIX Copia e Cola:</strong>
          </p>
          <textarea readOnly value={codigoPix} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  )
}
