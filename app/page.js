"use client";

import Image from "next/image";
import { product } from "./libs/product";
import Checkout from "./components/Checkout";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // render midtrans snap token
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";

    const clientKey = process.env.NEXT_PUBLIC_CLIENT;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="max-w-2xl mx-auto sm:p-16">
      <div className="flex flex-col">
        <Image
          src={product.image}
          alt={`${product.name} banner`}
          width={800}
          height={450}
          className="w-full object-cover rounded-md"
          priority
        />
        <div className="border border-gray-100 bg-white p-6">
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            {product.name}
          </h1>
          <p className="text-sm text-gray-600">
            {product.date} • {product.venue}
          </p>
          <p className="py-4 text-sm text-gray-700 text-justify">
            {product.description}
          </p>

          <Checkout event={product} />
        </div>
      </div>
    </main>
  );
}
