import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function HeroContent() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/rotas/login");
  };

  return (
   <main className="flex flex-col-reverse md:flex-row items-center justify-between min-h-[70vh] md:min-h-[80vh] w-full px-8 py-20 gap-10 bg-[#0f1f4b] mb-4">
  <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-white drop-shadow-md">
      <TypeAnimation
        sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
        speed={200}
        repeat={Infinity}
      />
    </h1>
    <p className="text-sm sm:text-2xl md:text-2xl max-w-xl mb-4 text-[#D1FAE5] leading-relaxed drop-shadow-sm">
      Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
    </p>
    <div className="w-full flex justify-center md:justify-start">
      <button
        type="button"
        className="bg-green-400 hover:bg-green-500 text-white px-10 py-3 rounded-lg font-semibold shadow-lg transition duration-300 ease-in-out"
        onClick={handleLogin}
      >
        Vamos Começar
      </button>
    </div>
  </div>

  <div className="flex-1 flex justify-center items-center">
    <Image
      src="/img/mock.png"
      alt="OrganizaBus Screenshot"
      width={600}
      height={400}
      className="mb-[-100px] md:mb-[0px] w-full max-w-[700px] h-auto rounded-xl shadow-2xl "
    />
  </div>
</main>

  );
}
