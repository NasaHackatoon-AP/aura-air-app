import { LoginForm } from "@/components/Authentication/LoginForm/LoginForm";
import Image from "next/image";
import logo from "../../../public/airaurealogo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 sm:p-8">
      <div className="w-full max-w-sm sm:max-w-md mx-4" data-preserve-width>
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Image src={logo} alt="Air Aurea Logo" className="h-32 w-32 sm:h-40 sm:w-40" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Monitoramento inteligente do clima e qualidade do ar
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
