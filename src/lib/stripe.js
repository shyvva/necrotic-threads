import Stripe from "stripe";

// Twój klucz tajny
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
