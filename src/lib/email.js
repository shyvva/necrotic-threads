import { Resend } from "resend";

// Użycie klucza API Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to, subject, message) {
  try {
    await resend.emails.send({
      from: "orders@necroticthreads.com", // Musi być zweryfikowane w Resend
      to,
      subject,
      text: message, // Treść wiadomości
    });
    console.log("E-mail wysłany do:", to);
  } catch (error) {
    console.error("Błąd wysyłania e-maila:", error);
  }
}
