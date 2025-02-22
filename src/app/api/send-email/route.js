import { NextResponse } from "next/server";
import sendEmail from "@/lib/email";  // Importujemy funkcję wysyłania e-maili

export async function POST(req) {
  try {
    // Pobieramy dane z żądania
    const { email, orderId, status, items } = await req.json();

    if (!email || !orderId || !status || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Formatujemy przedmioty do wysyłania w wiadomości
    const formattedItems = items.map(item => `- ${item.name} ($${item.price})`).join("\n");

    // Przygotowanie tematu i treści wiadomości na podstawie statusu
    let subject = "";
    let message = "";

    switch (status) {
      case "confirmed":
        subject = "Your Order Confirmation - Necrotic Threads";
        message = `Thank you for your order!

Order ID: ${orderId}

Items:
${formattedItems}

We will notify you when your order is shipped.

⚠️ This email is automated. Please do not reply.`;
        break;

      case "preparing":
        subject = "Your Order is Being Prepared";
        message = `Good news! Your order is now being prepared.

Order ID: ${orderId}

Items:
${formattedItems}

You will receive another email once your order is shipped.`;
        break;

      case "shipped":
        subject = "Your Order Has Been Shipped!";
        message = `Your order has been shipped! 🚚

Order ID: ${orderId}

Items:
${formattedItems}

You can track your order using the provided tracking link.`;
        break;

      case "canceled":
        subject = "Your Order Has Been Canceled";
        message = `We're sorry, but your order has been canceled.

Order ID: ${orderId}

If this was a mistake, please contact our support at support@necroticthreads.com.`;
        break;

      default:
        throw new Error("Invalid status type");
    }

    // Wywołanie funkcji wysyłania e-maila
    const emailResponse = await sendEmail(email, subject, message);

    if (!emailResponse) {
      console.error("❌ Error sending confirmation email");
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Zwracamy odpowiedź
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
