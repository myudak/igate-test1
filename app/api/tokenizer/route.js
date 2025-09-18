import Midtrans from "midtrans-client";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(request) {
  const { orderId, items, customer } = await request.json();

  // Ensure items array
  const item_details = Array.isArray(items) ? items : [];
  const gross_amount = item_details.reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
    0
  );

  const parameter = {
    item_details,
    transaction_details: {
      order_id: orderId,
      gross_amount,
    },
    customer_details: customer ? {
      first_name: customer.name,
      email: customer.email,
    } : undefined,
    credit_card: {
      secure: true,
    },
  };

  const token = await snap.createTransactionToken(parameter);

  return Response.json({ token });
}
