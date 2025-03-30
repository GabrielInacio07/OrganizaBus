import styles from '../styles/Botao.module.css'

export default function Button({children, ...props}){
    return(
        <button className={styles.botao} {...props}>{children}</button> 
    )
}