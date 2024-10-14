"use client";
import Image from "next/image";
import imageHome from "@/app/assets/img/image-home.svg";
import logo from "@/app/assets/img/logo.svg";
import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-2 sm:items-start relative h-full w-full">
        <div className="absolute -top-2/4 left-0 w-full h-full">
          <Image
            src={imageHome}
            alt="Imagem da home"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-8 absolute bottom-0 flex flex-col items-center gap-4 w-full">
          <Image src={logo} alt="Imagem da logo" />
          <h1 className="text-primary">
            O lugar perfeito para registrar sua dieta
          </h1>
          <button
            className="btn btn-primary text-white w-full"
            onClick={() => setOpenRegister(true)}
          >
            Cadastre-se
          </button>
          <span className="text-primary">
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
