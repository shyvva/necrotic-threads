"use client";

import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Unikamy błędów hydracji

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
  }, []);

  const removeFromCart = (index) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const checkout = async () => {
    if (!email) {
      alert("Please enter your email before proceeding.");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, email }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error processing payment");
    }
  };

  if (!mounted) return null; // Zapobiegamy renderowaniu na serwerze

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="bg-gray-900 p-6 shadow-md rounded-lg">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between border-b border-gray-700 py-2">
              <span className="text-gray-300">{item.name} - {item.price}</span>
              <button 
                onClick={() => removeFromCart(index)} 
                className="text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Pole na e-mail użytkownika */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
            />
          </div>

          {/* Przycisk do płatności */}
          <button 
            onClick={checkout} 
            className="mt-4 w-full px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
