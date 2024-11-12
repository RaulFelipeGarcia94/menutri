"use client";
import { FormEvent, useState } from "react";
import InputDefault from "../InputDefault";
import { IOpenModal } from "@/app/types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toast } from "@/app/lib/Toast";
import { useLoading } from "@/app/contexts/Loading";

export default function Login({ open, onClose }: IOpenModal) {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        Toast("success", "Login efetuado com sucesso!");
        router.push("/cardapio");
        onClose();
      } else if (res?.error) {
        Toast("error", "E-mail ou senha inválidos");
        if (res?.url) router.replace("/");
      }
    } catch (error) {
      Toast("error", "Ocorreu um erro ao tentar fazer login");
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      className={`${open && "modal-open"} modal modal-bottom md:modal-middle`}
    >
      <div className="modal-box flex h-[600px] flex-col items-center md:justify-center gap-4">
        <h1 className="text-2xl font-bold text-primary text-center">Login</h1>
        <h2 className="text-primary text-center">
          Bem-vindo de volta! Informe seus dados.
        </h2>
        <form
          className="space-y-5 flex flex-col items-center w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <InputDefault
            type="text"
            className="grow !text-black"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputDefault
            type="password"
            className="grow"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button className="btn btn-primary w-full text-white" type="submit">
            ENTRAR
          </button>
          {/* <span className="text-primary font-bold">Esqueci minha senha</span> */}
        </form>
      </div>
      <span className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
