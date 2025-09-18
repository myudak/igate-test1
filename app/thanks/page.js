"use client";
import Link from "next/link";
import React from "react";

const Page = () => {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const email = params.get("email");
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 p-6 text-center">
      <h3 className="text-xl font-semibold">
        Terima kasih telah melakukan pembayaran
      </h3>
      {email && (
        <p className="text-sm text-gray-700">
          Bukti dan e-ticket akan dikirim ke{" "}
          <span className="font-medium">{email}</span>.
        </p>
      )}
      <Link href="/" className="text-indigo-600 underline">
        Kembali ke halaman utama
      </Link>
    </div>
  );
};

export default Page;
