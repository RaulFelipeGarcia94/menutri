import connect from "@/app/utils/db";
import Menu from "@/app/models/Menu";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const revalidate = 0;

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

    console.log(`Received userId: ${userId}`);

    // Verifique se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid User ID format" }),
        { status: 400 }
      );
    }

    await connect();
    console.log("Connected to database");

    // Busca o menu do usuário
    const menu = await Menu.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).exec();

    if (!menu) {
      console.log(`Menu not found for userId: ${userId}`);
      return new NextResponse(JSON.stringify({ message: "Menu not found" }), {
        status: 404,
      });
    }

    console.log("Menu found:", menu);

    // Retorna o menu
    return new NextResponse(JSON.stringify(menu), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Error fetching menu",
      }),
      { status: 500 }
    );
  }
};
