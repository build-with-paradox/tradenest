import { NextResponse, NextRequest } from "next/server";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {

    const { username, email, password } = await req.json();

    if(!username || username.length <= 2){ 
      return NextResponse.json({ error: "Username is too short. Please use suitable name."}, {status:400})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email){ 
        return NextResponse.json({ error: "Please Provide email address."},{status:400})
    }

    if(!emailRegex.test(email)){ 
      return NextResponse.json({ error: "Email is not Valid. Please provide valid email"},{status:400})
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if(!password){
      return NextResponse.json({ error: "Please provide password" }, {status:400})
    }

    if(!strongPasswordRegex.test(password)){ 
      return NextResponse.json({ error: "Password must include 8+ chars, uppercase, lowercase, number & symbol"}, {status:400})
    }

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists. Please log in." }, { status: 400 });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      username,
      email,
      password: hashedpassword,
      role: "buyer",
      provider: "manual",
    });

    return NextResponse.json(
      { message: "Signup completed successfully." }, { status: 201 });
  } catch (error) {

    return NextResponse.json(
      { error: "Oops! Something went wrong during signup." },
      { status: 500 }
    );
  }
};
