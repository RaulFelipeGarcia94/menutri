"use client";
import Image from "next/image";
import imageHome from "@/app/assets/img/image-home.svg";
import logo from "@/app/assets/img/logo.svg";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/cardapio");
    }
  }, [router, status]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative">
      <div className="hidden md:absolute md:left-20 md:top-0 md:flex md:flex-col">
        <Image src={logo} alt="Imagem da logo" />
        <span className="text-primary">
          O lugar perfeito para registrar sua dieta
        </span>
      </div>
      <main className="row-start-2 sm:items-start relative h-full w-full md:flex md:justify-between md:bg-primary md:rounded-xl">
        <div className="absolute md:static -top-2/4 left-0 w-full h-full">
          <Image
            src={imageHome}
            alt="Imagem da home"
            className="absolute h-full w-full inset-0 object-cover md:object-contain md:static md:p-10"
          />
        </div>
        <div className="p-8 absolute md:static bottom-0 flex flex-col items-center gap-4 w-full md:h-full md:justify-center md:gap-10">
          <Image src={logo} alt="Imagem da logo" className="md:hidden" />
          <h1 className="text-primary md:hidden">
            O lugar perfeito para registrar sua dieta
          </h1>
          <h1 className="text-white text-2xl hidden md:block lg:text-4xl font-bold text-center">
            Bem-vindo ao MENUTRI
          </h1>
          <h2 className="text-white hidden md:block text-center text-lg font-medium">
            Cadastre os alimentos do seu planejamento alimentar e facilite a
            substituição de itens quando precisar. Nossa plataforma ajuda você a
            manter sua dieta organizada e fazer trocas de maneira simples.
            <br />
            <br />
            Comece agora e tenha mais controle sobre sua alimentação!
          </h2>
          <button
            className="btn btn-primary text-white w-full md:bg-white md:text-primary md:w-[380px]"
            onClick={() => setOpenRegister(true)}
          >
            Cadastre-se
          </button>
          <span className="text-primary md:text-white">
            Já tem cadastro?{" "}
            <span className="cursor-pointer" onClick={() => setOpenLogin(true)}>
              Faça login
            </span>
          </span>
        </div>
        <Login open={openLogin} onClose={() => setOpenLogin(false)} />
        <Register open={openRegister} onClose={() => setOpenRegister(false)} />
      </main>
    </div>
  );
}
