"use client"; // Musi być na samej górze!

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Funkcja pobiera aktualną liczbę produktów w koszyku
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cartItems.length);
    };

    updateCartCount(); // Uruchamiamy funkcję po załadowaniu strony

    // Nasłuchujemy zmian w `localStorage`
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <nav className="flex justify-between p-5 bg-gray-900 text-white">
      <Link href="/">
        <span className="text-xl font-bold cursor-pointer">Necrotic Threads</span>
      </Link>
      <Link href="/cart">
        <div className="relative cursor-pointer">
          <span className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
            Cart ({cartCount})
          </span>
        </div>
      </Link>
    </nav>
  );
}
