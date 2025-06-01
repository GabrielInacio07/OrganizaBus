import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
    const router = useRouter();
    const handleLogin = () => {
      router.push("/rotas/login");
    };
  return (
    <header className="bg-gray-200 shadow-md text-blue-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/img/logo.png"
            width={80}
            height={80}
            alt="Logo do site"
            className="object-contain"
          />
        </Link>
        <div className="w-full flex justify-center md:justify-end">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition"
            onClick={handleLogin}
          >
            Vamos Começar
          </button>
        </div>
      </nav>
    </header>
  );
}
