'use client'
import styles from '../styles/Botao.module.css'

interface Product{
    title: String,
    price: Number,
    quantity: Number
}


export default function CheckoutAuxilio({title,price,quantity}:Product){

    const handlePayment = async () =>{
       
        const response = await fetch('/api/',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({title,price,quantity})
        })

        const data = await response.json()
        if(data.id){
            window.location.href = `http://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;
        }
        
        
    }

    return(
        <button className={styles.botao} onClick={handlePayment}>Bolsa Estudantil</button>
    )
}