
import Link from 'next/link'
export default function Home(){
  
  return(
    <div>
     HOME DO SITE <br />
     <Link href={'/cadastroPage'}>Cadastro</Link> <br />
     <Link href={'/loginPage'}>Login</Link>
    </div>
  )
}
