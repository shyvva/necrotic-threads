import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Użycie klucza API Resend

// Funkcja wysyłająca e-mail
async function sendEmail({ email, orderId, status, items }) {
  try {
    let subject = "";
    let message = "";
    const formattedItems = items.map((item) => `- ${item.name} ($${item.price})`).join("\n");

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

    // Wysyłanie e-maila
    await resend.send({
      from: "orders@necroticthreads.com",  // Twój e-mail nadawcy
      to: email,
      subject,
      text: message,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export default sendEmail;
