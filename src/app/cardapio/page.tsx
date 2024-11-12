"use client";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLoading } from "../contexts/Loading";
import { Toast } from "../lib/Toast";
import { IOpenModal } from "../types";
import InputDefault from "../components/InputDefault";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ICreateMenu extends IOpenModal {
  type: string;
  onItemAdded: (item: IItemMenu) => void;
}

export interface IItemMenu {
  _id: string;
  name: string;
  description: string;
}

const CreateMenu = ({ type, open, onClose, onItemAdded }: ICreateMenu) => {
  const { setIsLoading } = useLoading();
  const { data: session } = useSession();
  const [nameItem, setNameItem] = useState("");
  const [descriptionItem, setDescriptionItem] = useState("");

  const handleCreateMenu = async (e: FormEvent) => {
    e.preventDefault();

    if (!session) {
      Toast("error", "Usuário não autenticado.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/create_menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          type,
          name: nameItem,
          description: descriptionItem,
        }),
      });

      if (res?.ok) {
        const newItem = await res.json();
        Toast("success", "Cadastro efetuado com sucesso!");
        onItemAdded(newItem);
        onClose();
      } else {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        Toast("error", "Erro ao cadastrar item.");
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      className={`${open && "modal-open"} modal modal-bottom md:modal-middle`}
    >
      <div className="modal-box flex h-[600px] flex-col items-center md:justify-center gap-4">
        <form
          className="space-y-5 flex flex-col items-center w-full max-w-lg"
          onSubmit={handleCreateMenu}
        >
          <InputDefault
            type="text"
            className="grow !text-black"
            placeholder="Item"
            value={nameItem}
            onChange={(e) => setNameItem(e.target.value)}
          />
          <InputDefault
            className="grow"
            value={descriptionItem}
            onChange={(e) => setDescriptionItem(e.target.value)}
            placeholder="Descrição"
          />
          <button className="btn btn-primary w-full text-white" type="submit">
            SALVAR
          </button>
        </form>
      </div>
      <span className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
};

export default function Menu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeMenuType, setActiveMenuType] = useState<string>("breakfast");
  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [menuItems, setMenuItems] = useState<{ [key: string]: IItemMenu[] }>(
    {}
  );
  const [filteredItems, setFilteredItems] = useState<IItemMenu[]>([]);

  const handleMenuTypeClick = (type: string) => {
    setActiveMenuType(type);
    setFilteredItems(menuItems[type] || []);
  };

  const handleItemAdded = (newItem: IItemMenu) => {
    setMenuItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[activeMenuType] = [
        ...(updatedItems[activeMenuType] || []),
        newItem,
      ];
      return updatedItems;
    });
    setFilteredItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDeleteItem = async (userId: string, type: string, id: string) => {
    try {
      const res = await fetch(`/api/delete_menu`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, type, id }),
      });
      console.log(res);

      if (res.ok) {
        setMenuItems((prevItems) => {
          const updatedItems = { ...prevItems };
          Object.keys(updatedItems).forEach((key) => {
            if (Array.isArray(updatedItems[key])) {
              updatedItems[key] = updatedItems[key].filter(
                (item) => item._id !== id
              );
            }
          });
          return updatedItems;
        });
        setFilteredItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
        Toast("success", "Item deletado com sucesso!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!session) return;

      try {
        const res = await fetch(`/api/get_menu?userId=${session.user.id}`);
        const text = await res.text();
        console.log("Response text:", text);
        const data = JSON.parse(text);
        console.log("Parsed data:", data);
        setMenuItems(data);
        setFilteredItems(data[activeMenuType] || []);
      } catch (err) {
        console.log("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, [session, activeMenuType]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <div>
      <div className="w-full flex flex-col items-center py-6 pl-3 bg-primary">
        <h1 className="text-lg text-white font-semibold mb-4">Cardápio</h1>
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap w-full">
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "breakfast"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("breakfast")}
          >
            Café da manhã
          </button>
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "morningSnack"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("morningSnack")}
          >
            Lanche
          </button>
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "lunch"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("lunch")}
          >
            Almoço
          </button>
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "afternoonSnack"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("afternoonSnack")}
          >
            Lanche
          </button>
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "dinner"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("dinner")}
          >
            Janta
          </button>
          <button
            className={`btn flex-shrink-0 p-3 ${
              activeMenuType === "supper"
                ? "bg-[#79D653] text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => handleMenuTypeClick("supper")}
          >
            Ceia
          </button>
        </div>
      </div>
      <div className="p-6 gap-8 flex flex-col">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="card bg-primary text-white shadow-xl"
            >
              <div className="card-body">
                <span>
                  <button
                    onClick={() => {
                      if (session) {
                        handleDeleteItem(
                          session.user.id,
                          activeMenuType,
                          item._id
                        );
                      } else {
                        Toast("error", "Usuário não autenticado.");
                      }
                    }}
                  >
                    <Trash2 />
                  </button>
                </span>
                <h2 className="card-title">{item.name}</h2>
                <p>{item.description}</p>
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-ghost text-white p-0 h-0 min-h-0">
                    Ver opções
                  </button>
                </div>
              </div>
            </div>
          ))}
        <div className="w-full flex justify-center">
          <button
            className="btn btn-ghost text-primary text-lg"
            onClick={() => setOpenCreateMenu(true)}
          >
            + Adicionar item
          </button>
        </div>
      </div>
      <CreateMenu
        open={openCreateMenu}
        onClose={() => setOpenCreateMenu(false)}
        type={activeMenuType}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
}
