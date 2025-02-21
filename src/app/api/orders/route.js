import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    console.log("🔍 Checking request...");

    // Sprawdzamy nagłówki
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("❌ Missing or incorrect Content-Type header");
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    // Pobieramy JSON zamiast text()
    let data;
    try {
      data = await req.json();
    } catch (err) {
      console.error("❌ Error parsing JSON:", err);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    console.log("📩 Parsed JSON:", data);

    const { name, email, product, price } = data;

    if (!name || !email || !product || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const newOrder = await db.collection("orders").insertOne({
      name,
      email,
      product,
      price,
      status: "confirmed",
    });

    console.log(`✅ New order created: ${newOrder.insertedId}`);

    // Wysyłamy e-mail potwierdzający zamówienie
    const emailPayload = {
      email,
      orderId: newOrder.insertedId.toString(),
      status: "confirmed",
      items: [{ name: product, price: `$${price}` }],
    };

    const emailResponse = await fetch("http://localhost:3000/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      console.error("❌ Error sending confirmation email:", await emailResponse.json());
    }

    return NextResponse.json({ success: true, orderId: newOrder.insertedId });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
      console.log("🔍 Checking request...");
  
      // Sprawdzamy nagłówki
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("❌ Missing or incorrect Content-Type header");
        return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
      }
  
      // Pobieramy JSON zamiast text()
      let data;
      try {
        data = await req.json();
      } catch (err) {
        console.error("❌ Error parsing JSON:", err);
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
      }
  
      console.log("📩 Parsed JSON:", data);
  
      const { orderId, status } = data;
  
      // Walidacja, czy oba parametry zostały przesłane
      if (!orderId || !status) {
        console.error("❌ Missing required fields: orderId or status");
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Walidacja, czy orderId jest prawidłowym ObjectId
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json({ error: "Invalid orderId format" }, { status: 400 });
      }
  
      const db = await connectToDatabase();
      const objectId = new mongoose.Types.ObjectId(orderId);
      const order = await db.collection("orders").findOne({ _id: objectId });
  
      if (!order) {
        console.error(`❌ Order with ID ${orderId} not found`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
  
      // Aktualizujemy status zamówienia
      await db.collection("orders").updateOne(
        { _id: objectId },
        { $set: { status } }
      );
  
      console.log(`✅ Order ${orderId} status updated to: ${status}`);
  
      // Wysyłamy e-mail o zmianie statusu
      const emailPayload = {
        email: order.email,
        orderId,
        status,
        items: [{ name: order.product, price: `$${order.price}` }],
      };
  
      const emailResponse = await fetch("http://localhost:3000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });
  
      if (!emailResponse.ok) {
        console.error("❌ Error sending status update email:", await emailResponse.json());
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
  }
  