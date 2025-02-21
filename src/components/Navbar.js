"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Unikamy błędów hydracji

    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cartItems.length);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  if (!mounted) return null; // Zapobiegamy renderowaniu na serwerze

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
