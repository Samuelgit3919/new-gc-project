import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  // const txRef = searchParams.get("tx_ref");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const urlParams = new URLSearchParams(window.location.search);
  const txRef = urlParams.get("tx_ref");
  console.log(txRef)

  useEffect(() => {

    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `https://bookcompass.onrender.com/api/order/payment-success?tx_ref=${txRef}`
        );
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (txRef) fetchPaymentDetails();
  }, [txRef]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  const { orderDetails, paymentDetails } = data;

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-sm mt-10 bg-white">
      <h1 className="text-xl font-semibold text-green-600 mb-4">Payment Successful!</h1>

      <div className="mb-6">
        <h2 className="text-md font-medium mb-2">🧾 Order Summary</h2>
        <ul className="space-y-2">
          {orderDetails.items.map((item, i) => (
            <li key={i} className="border-b pb-2">
              <div className="font-semibold">{item.bookTitle}</div>
              <div>Seller: {item.sellerName}</div>
              <div>Qty: {item.quantity} | Price: {item.price} ETB</div>
              {item.accessUrl && (
                <a
                  href={item.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  Access Content
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-md font-medium mb-2">💰 Pricing</h2>
        <p>Subtotal: {orderDetails.pricing.subtotal} ETB</p>
        <p>Delivery: {orderDetails.pricing.deliveryFee} ETB</p>
        <p className="font-bold">Total: {orderDetails.pricing.total} ETB</p>
      </div>

      <div>
        <h2 className="text-md font-medium mb-2">💳 Payment</h2>
        <p>Status: <span className="text-green-600">{paymentDetails.status}</span></p>
        <p>Amount: {paymentDetails.amount} {paymentDetails.currency}</p>
        <p>Charge: {paymentDetails.charge} {paymentDetails.currency}</p>
        <p>Date: {new Date(paymentDetails.date).toLocaleString()}</p>
        <a
          href={paymentDetails.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-blue-600 underline text-sm"
        >
          View Receipt
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;