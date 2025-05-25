import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroContent() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/rotas/login");
  };

  return (
    <main className="flex flex-row items-center justify-between min-h-[80vh] w-full px-8 py-16">
      <div className="flex-1 flex flex-col items-start justify-center text-left pr-5">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">
          <TypeAnimation
            sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
            speed={{ type: "keyStrokeDelayInMs", value: 120 }}
            style={{ fontSize: "3rem" }}
            repeat={Infinity}
          />
        </h1>
        <p className="text-lg max-w-xl mb-8 text-white leading-relaxed drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]">
          Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
        </p>
        <button
          type="button"
          className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition"
          onClick={handleLogin}
        >
          Vamos Começar
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <Image
          src="/img/mock.png"
          alt="OrganizaBus Screenshot"
          width={600}
          height={400}
          className="max-w-full h-auto rounded-lg"
        />
      </div>
    </main>
  );
}
