import connectToDatabase from "@/lib/mongodb";


import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const TestCollection = db.model("Test", new db.Schema({ message: String }));
    
    await TestCollection.create({ message: "MongoDB działa!" });

    return NextResponse.json({ success: true, message: "MongoDB działa!" });
  } catch (error) {
    console.error("Błąd MongoDB:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
