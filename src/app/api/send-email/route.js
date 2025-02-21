import sendEmail from "@/lib/email";

export async function POST(req) {
  try {
    const { email, orderId, status, items } = await req.json();

    if (!email || !orderId || !status || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400 }
      );
    }

    let subject = "";
    let message = "";
    const formattedItems = items.map((item) => `- ${item.name} ($${item.price})`).join("\n");

    // Wybór szablonu wiadomości na podstawie statusu zamówienia
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
        return new Response(
          JSON.stringify({ error: "Invalid status type" }),
          { status: 400 }
        );
    }

    await sendEmail(email, subject, message);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Email processing error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
