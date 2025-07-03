import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserService } from "@/services/user.service";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function NavbarAlt() {
  const router = useRouter();
  const handleLogout = () => {
    UserService.logout();
    router.push("/rotas/login");
  };

  return (
    <header className="bg-gray-200 shadow-md text-blue-900">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center h-20">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/img/logo.png"
            width={100}
            height={100}
            alt="Logo do site"
            className="object-contain"
          />
        </Link>
        <div className="flex justify-end px-6 sm:px-8 lg:px-12">
         <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <LogOut size={16} />
                      Sair
                    </Button>
        </div>
      </nav>
    </header>
  );
}
