import { toast, TypeOptions } from "react-toastify";

export function Toast(typeToast: TypeOptions, text: string) {
  const message =
    typeof text === "string"
      ? text
      : "Aconteceu um erro, tente novamente mais tarde";

  if (typeToast === "default") {
    return toast(message, {
      toastId: message.toLowerCase().replace(" ", "-"),
    });
  }
  return toast[typeToast](message, {
    toastId: message.toLowerCase().replace(" ", "-"),
  });
}
