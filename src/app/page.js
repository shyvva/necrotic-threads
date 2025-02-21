import Link from "next/link";

const products = [
  { id: 1, name: "Dark Soul T-Shirt", price: "$1" }, // Cena 1$
  { id: 2, name: "Necro Hoodie", price: "$1" }, // Cena 1$
];

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">Necrotic Threads</h1>
      <p className="text-center text-gray-400 mb-6">Welcome to the dark side of fashion.</p>

      <div className="grid grid-cols-2 gap-6 p-10">
        {products.map((product) => (
          <div key={product.id} className="border p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.price}</p>
            <Link href={`/product/${product.id}`}>
              <span className="text-red-500 cursor-pointer hover:underline">View Product</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

