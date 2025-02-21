import Stripe from "stripe";

// Użyj tajnego klucza API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cart, email } = await req.json();

    // Mapowanie przedmiotów na sesję Stripe
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: 100, // 1$ = 100 centów
      },
      quantity: 1,
    }));

    // Tworzenie sesji Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: email, // Przechwycenie e-maila
    });

    // Po płatności wysyłamy potwierdzenie
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, orderId: session.id, items: cart }),
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
