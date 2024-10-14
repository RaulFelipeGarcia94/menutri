import User from "@/app/models/User";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const POST = async (request: Request) => {
  const { email, password, name }: RegisterRequest = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = password ? await bcrypt.hash(password, 5) : undefined;
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
  });

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err) {
    console.log(err);

    return new NextResponse(
      err instanceof Error ? err.message : "Internal Server Error",
      {
        status: 500,
      }
    );
  }
};
