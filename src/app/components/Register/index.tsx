"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { IOpenModal } from "@/app/types";
import InputDefault from "../InputDefault";
import { useLoading } from "@/app/contexts/Loading";
import { Toast } from "@/app/lib/Toast";

export default function Register({ open, onClose }: IOpenModal) {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [errorInput, setErrorInput] = useState({
    password: false,
    passwordConfirmation: false,
  });

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorInput({
        password: true,
        passwordConfirmation: true,
      });
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res?.ok) {
        Toast("success", "Cadastro efetuado com sucesso!");
        onClose();
      } else if (res.status === 400) {
        setError("Este email já está registrado");
      } else if (res.status === 200) {
        setError("");
        router.push("/");
      }
    } catch (err) {
      setError("Erro, tente novamente");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      className={`${open && "modal-open"} modal modal-bottom md:modal-middle`}
    >
      <div className="modal-box flex h-[600px] flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-primary text-center">
          Cadastro
        </h1>
        <h2 className="text-primary text-center">Olá! Vamos criar sua conta</h2>
        <form
          className="space-y-5 flex flex-col items-center w-full max-w-lg"
          onSubmit={(e) => handleRegister(e)}
        >
          <InputDefault
            type="text"
            className="grow !text-black"
            placeholder="Nome"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <InputDefault
            type="text"
            className="grow !text-black"
            placeholder="E-mail"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputDefault
            type="password"
            className="grow"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
            error={errorInput.password}
          />
          <InputDefault
            type="password"
            className="grow"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Confirme sua senha"
            error={errorInput.passwordConfirmation}
            textError={
              errorInput.passwordConfirmation &&
              "As senhas digitadas não coincidem"
            }
          />
          <button className="btn btn-primary w-full text-white" type="submit">
            Criar conta
          </button>
          <p className="text-red-600">{error && error}</p>
        </form>
      </div>
      <span className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
