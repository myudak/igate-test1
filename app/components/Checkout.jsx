import React, { useMemo, useState } from "react";

const currency = (n) => new Intl.NumberFormat("id-ID").format(n);

const Checkout = ({ event }) => {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(event.tickets.map((t) => [t.id, 0]))
  );
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const total = useMemo(() => {
    return event.tickets.reduce(
      (sum, t) => sum + (quantities[t.id] || 0) * t.price,
      0
    );
  }, [event.tickets, quantities]);

  const disabled =
    // isLoading ||
    // total <= 0 ||
    // !buyer.name.trim() ||
    // !/^\S+@\S+\.\S+$/.test(buyer.email);
    false;

  const adjust = (id, delta) => {
    setQuantities((q) => {
      const next = { ...q };
      const current = next[id] || 0;
      next[id] = Math.max(0, current + delta);
      return next;
    });
  };

  const checkout = async () => {
    try {
      setIsLoading(true);
      const items = event.tickets
        .filter((t) => (quantities[t.id] || 0) > 0)
        .map((t) => ({
          id: t.id,
          name: `${event.name} - ${t.name}`,
          price: t.price,
          quantity: quantities[t.id],
        }));

      const data = {
        orderId: `${event.id}-${Date.now()}`,
        items,
        customer: { ...buyer },
      };

      const response = await fetch("/api/tokenizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create transaction");

      const requestData = await response.json();

      window.snap?.pay(requestData.token, {
        onSuccess: function () {
          window.location.href =
            "/thanks?email=" + encodeURIComponent(buyer.email);
        },
        onPending: function () {
          window.location.href =
            "/thanks?email=" + encodeURIComponent(buyer.email);
        },
        onError: function () {
          alert("Pembayaran gagal. Coba lagi.");
        },
        onClose: function () {
          // user closed without paying
        },
      });
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat memulai pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {event.tickets.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-gray-600">Rp {currency(t.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-2 py-1 rounded border hover:bg-gray-50"
                onClick={() => adjust(t.id, -1)}
                aria-label={`Kurangi ${t.name}`}
              >
                -
              </button>
              <input
                type="number"
                min={0}
                value={quantities[t.id] || 0}
                onChange={(e) =>
                  setQuantities((q) => ({
                    ...q,
                    [t.id]: Math.max(0, +e.target.value || 0),
                  }))
                }
                className="h-10 w-16 text-black border rounded text-center"
              />
              <button
                className="px-2 py-1 rounded border hover:bg-gray-50"
                onClick={() => adjust(t.id, 1)}
                aria-label={`Tambah ${t.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nama lengkap"
          value={buyer.name}
          onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
          className="h-10 px-3 rounded border text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={buyer.email}
          onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))}
          className="h-10 px-3 rounded border text-black"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold">Total: Rp {currency(total)}</p>
        <button
          disabled={disabled}
          className={`rounded bg-indigo-500 p-3 text-sm font-medium transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          onClick={checkout}
        >
          {isLoading ? "Memproses…" : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
