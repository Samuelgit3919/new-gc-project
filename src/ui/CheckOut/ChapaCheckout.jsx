import { useState, useContext } from "react";
import Layout from "../../Layout";
import { DataContext } from "../../DataProvider/DataProvider.jsx";
import { ClipLoader } from "react-spinners";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Payment = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    });
    const [error, setError] = useState(null);
    const [process, setProcess] = useState(false);

    const [{ user, basket }, dispatch] = useContext(DataContext);
    const navigate = useNavigate();

    const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
    const total = basket?.reduce((amount, item) => item.price * item.amount + amount, 0);

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    // const handlePayment = async (e) => {
    //     e.preventDefault();
    //     setError(null);
    //     setProcess(true);

    //     const tx_ref = `tx-${Date.now()}`;

    //     const data = {
    //         ...formData,
    //         amount: total,
    //         currency: "ETB",
    //         tx_ref,
    //         callback_url: "https://bookcompass.onrender.com/api/order/payment-callback",
    //         return_url: "https://bookcompass.onrender.com/api/order/payment-success",
    //         customization: {
    //             title: "Book Payment",
    //             description: "Order payment via Chapa",
    //         },
    //     };

    //     try {
    //         const response = await axios.post("https://api.chapa.co/v1/transaction/initialize", data, {
    //             headers: {
    //                 Authorization: `Bearer YOUR_CHAPA_SECRET_KEY`,
    //             },
    //         });

    //         const checkoutUrl = response.data.data.checkout_url;
    //         window.location.href = checkoutUrl;
    //     } catch (err) {
    //         console.error(err);
    //         setError("Payment initialization failed. Please try again.");
    //         setProcess(false);
    //     }
    // };

    return (
        <Layout>
            <div className="text-2xl font-semibold px-4 py-4 border-b">Checkout ({totalItem} items)</div>

            <section className="px-4 py-6 max-w-4xl mx-auto space-y-6">
                {/* Delivery Address */}
                <div className="space-y-2">
                    <h2 className="text-xl font-medium">Delivery Address</h2>
                    <div className="bg-gray-100 p-4 rounded-md">
                        <p>{user?.email}</p>
                        <p>ASTU</p>
                        <p>Adama, Ethiopia</p>
                    </div>
                </div>

                {/* Review Items */}
                <div className="space-y-2">
                    <h3 className="text-xl font-medium">Review Items and Delivery</h3>
                    <div className="space-y-3">
                        {basket?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-gray-600">Qty: {item.amount}</p>
                                </div>
                                <div className="font-medium">ETB {item.price * item.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chapa Payment Form */}
                {/* <div className="bg-[#0D1B2A] rounded-md p-6 text-white">
                    <h3 className="text-xl font-semibold mb-4">Chapa Checkout</h3>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <img src="https://chapa.co/static/media/telebirr.548e88dc.svg" className="w-12" />
                            <img src="https://chapa.co/static/media/safepay.fad6acb6.svg" className="w-12" />
                            <img src="https://chapa.co/static/media/mpesa.8a3f89ab.svg" className="w-12" />
                            <img src="https://chapa.co/static/media/halopesa.04f4b4f6.svg" className="w-12" />
                        </div>
                        <form onSubmit={handlePayment} className="space-y-4">
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <input
                                type="tel"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                className="w-full p-2 rounded bg-[#1B263B] text-white border border-gray-600"
                            />

                            <div className="flex items-center justify-between">
                                <span>Total</span>
                                <span className="font-bold text-green-400">ETB {total.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-full rounded-md flex items-center justify-center gap-2"
                                disabled={process}
                            >
                                {process ? <><ClipLoader size={14} color="#fff" /> Processing...</> : `Pay ETB ${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div> */}
                <button>
                    <Link target="_blank" to={`https://checkout.chapa.co/checkout/payment/gUeUyepwAQXLsasMyPjhN4mqA5GBiRRzGoOYie4xidEXR`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                        pay with chapa
                    </Link>
                </button>

            </section>
        </Layout>
    );
};

export default Payment;
