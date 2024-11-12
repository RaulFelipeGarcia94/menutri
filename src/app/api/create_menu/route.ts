import connect from "@/app/utils/db";
import Menu from "@/app/models/Menu";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = async (request: Request) => {
  try {
    const { userId, type, name, description } = await request.json();

    // Conectar ao banco de dados
    await connect();

    // Verificar se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid User ID format" }),
        { status: 400 }
      );
    }

    // Converter userId para ObjectId para garantir o tipo correto
    const objectIdUserId = mongoose.Types.ObjectId.createFromHexString(userId);

    // Verificar se o usuário realmente existe
    const userExists = await mongoose
      .model("User")
      .findById(objectIdUserId)
      .exec();
    if (!userExists) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Verificar se o menu já existe para o usuário
    let menu = await Menu.findOne({ userId: objectIdUserId }).exec();
    console.log("Menu found:", menu);

    // Se não encontrar o menu, crie um novo menu
    if (!menu) {
      menu = new Menu({
        userId: objectIdUserId, // Associar o menu ao userId
        breakfast: [],
        morningSnack: [],
        lunch: [],
        afternoonSnack: [],
        dinner: [],
        supper: [],
      });
      console.log("New menu created:", menu);
    }

    // Criação do novo item de menu
    const newItem = { name, description };

    // Adiciona o novo item no tipo especificado (ex: breakfast, lunch)
    menu[type].push(newItem);

    // Salva o menu com o novo item
    await menu.save();
    console.log("Menu saved:", menu);

    return new NextResponse(JSON.stringify(newItem), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message:
          error instanceof Error ? error.message : "Error adding menu item",
      }),
      { status: 500 }
    );
  }
};
