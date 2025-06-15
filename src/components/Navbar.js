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
  <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center h-20">
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/img/logo.png"
        width={90}
        height={90}
        alt="Logo do site"
        className="object-contain"
      />
    </Link>
    <div className="w-full flex justify-end">
      <button
        type="button"
        className="bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  </nav>
</header>

  );
}
