import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to, subject, message) {
  try {
    await resend.emails.send({
      from: "orders@necroticthreads.com", // Zweryfikowane w Resend
      to,
      subject,
      text: message,
    });
    console.log(`📧 Email sent to: ${to} | Subject: ${subject}`);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
}
