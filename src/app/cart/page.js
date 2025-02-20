"use client"; // Musi być na górze!

import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
  }, []);

  const removeFromCart = (index) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Aktualizacja Navbar
    window.dispatchEvent(new Event("storage"));
  };

  const checkout = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // Przekierowanie do Stripe Checkout
    } else {
      alert("Error processing payment");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>{item.name} - {item.price}</span>
              <button 
                onClick={() => removeFromCart(index)} 
                className="text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Przycisk "Proceed to Checkout" */}
          <button 
            onClick={checkout} 
            className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
