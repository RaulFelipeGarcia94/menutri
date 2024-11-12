import connect from "@/app/utils/db";
import Menu from "@/app/models/Menu";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { IItemMenu } from "@/app/cardapio/page";

export const DELETE = async (request: Request) => {
  try {
    const { userId, type, id } = await request.json();

    // Verifique se o userId é válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid User ID format" }),
        { status: 400 }
      );
    }

    await connect();
    console.log("Connected to database");

    // Find the menu document for the specific user
    const menu = await Menu.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!menu) {
      console.log(`Menu not found for userId: ${userId}`);
      return new NextResponse("Menu not found", { status: 404 });
    }

    // Find the index of the item to be deleted
    const itemIndex = menu[type].findIndex(
      (item: IItemMenu) => item._id.toString() === id
    );

    if (itemIndex === -1) {
      console.log(`Item not found for id: ${id}`);
      return new NextResponse("Item not found", { status: 404 });
    }

    // Remove the item from the specified type
    menu[type].splice(itemIndex, 1);

    // Save the updated menu
    await menu.save();
    console.log("Menu item deleted successfully");

    return new NextResponse("Menu item deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      error instanceof Error ? error.message : "Error deleting menu item",
      { status: 500 }
    );
  }
};
