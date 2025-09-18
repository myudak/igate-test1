export const product = {
  // Treat this as an event with ticket tiers
  id: `EVT-${~~(Math.random() * 100) + 1}`,
  image: "/image.png",
  name: "Summer Fest 2025",
  date: "Sat, Nov 15, 2025 • 19:00",
  venue: "Jakarta Convention Center",
  description:
    "Experience an unforgettable night with top artists, dazzling lights, and immersive stages. Choose your ticket tier and secure your spot now!",
  tickets: [
    { id: "GA", name: "General Admission", price: 150000, stock: 500 },
    { id: "VIP", name: "VIP", price: 350000, stock: 100 },
    { id: "VVIP", name: "VVIP", price: 650000, stock: 50 },
  ],
};
