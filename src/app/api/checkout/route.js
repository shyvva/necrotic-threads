import stripe from "@/lib/stripe"; // Importujemy z lib/stripe.js

export async function POST(req) {
  try {
    const { cart, email } = await req.json();

    // Konfigurujemy przedmioty do zakupu
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // 1$ = 100 centów
      },
      quantity: item.quantity,
    }));

    // Tworzymy sesję Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: email, // Przechwycenie emaila klienta
    });

    // Po płatności wysyłamy potwierdzenie
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orderId: session.id, items: cart }),
    });

    // Zwracamy URL sesji do frontend
    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
