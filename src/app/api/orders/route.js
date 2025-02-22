import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import stripe from "@/lib/stripe"; // Importujemy Stripe
import sendEmail from "@/lib/email";// Poprawiony import do katalogu src/api/send-email/route

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

    // Tworzymy sesję Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product },
            unit_amount: price * 100, // 1$ = 100 centów
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: email, // Przechwycenie emaila klienta
    });

    // Tworzymy zamówienie w bazie danych
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

    const emailResponse = await sendEmail(emailPayload); // Wywołujemy funkcję do wysyłania e-maila

    if (!emailResponse) {
      console.error("❌ Error sending confirmation email");
    }

    // Zwracamy URL sesji Stripe do frontend
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
