import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function HeroContent() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/rotas/login");
  };

  return (
    <main className="flex flex-col-reverse md:flex-row items-center justify-between min-h-[80vh] w-full px-8 py-12 gap-8 bg-[#0f1f4b]">
      <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          <TypeAnimation
            sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
            speed={200}
            repeat={Infinity}
          />
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8 text-[#D1FAE5] leading-relaxed drop-shadow-md">
          Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
        </p>
        <div className="w-full flex justify-center md:justify-start">
          <button
            type="button"
            className="bg-[#34D399] hover:bg-[#2ca66e] text-white px-8 py-3 rounded-md font-semibold shadow-md transition"
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
          className="w-full max-w-[500px] h-auto rounded-lg shadow-lg"
        />
      </div>
    </main>
  );
}
