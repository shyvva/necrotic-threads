"use client"; // Dodaj to na samej górze!

export default function Success() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-green-500">Payment Successful!</h1>
      <p className="mt-4">Thank you for your purchase. Your order is being processed.</p>
      <a href="/" className="mt-6 inline-block px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
        Return to Home
      </a>
    </div>
  );
}
