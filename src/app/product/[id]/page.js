"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const products = [
  { id: 1, name: "Dark Soul T-Shirt", price: "$1", description: "Mroczna koszulka z unikalnym wzorem." },
  { id: 2, name: "Necro Hoodie", price: "$1", description: "Czarna bluza z gotyckim motywem." },
];

export default function Product() {
  const params = useParams();
  const product = products.find((p) => p.id == params.id);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
  }, []);

  const addToCart = () => {
    let cartItems = [...cart, product];
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setCart(cartItems);
    window.dispatchEvent(new Event("storage")); // Aktualizacja Navbar
    alert("Added to cart!");
  };

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-400">{product.description}</p>
      <p className="text-xl text-red-400">{product.price}</p>
      <button 
        onClick={addToCart} 
        className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Add to cart
      </button>
    </div>
  );
}
