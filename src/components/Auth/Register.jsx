import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosBook } from "react-icons/io";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // ⬅️ New state
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const api = "https://bookcompass.onrender.com/api/auth/register";

    const isFormValid = name && email && password.length >= 8 && role;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            console.log("Register response:", data);

            // Check both HTTP status and msg field
            if (response.ok || data?.msg?.toLowerCase().includes("verify your email")) {
                toast.success(data.msg || "Account created successfully!");
                navigate("/verify-email", { state: { email } });
            } else {
                toast.error(data.message || data.msg || "Something went wrong.");
            }
        } catch (err) {
            console.error("Network error:", err);
            toast.error("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <ToastContainer />
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="mt-0 text-3xl font-bold tracking-tight text-slate-900">
                        <Link to="/" className="flex items-center justify-center">
                            <IoIosBook className="text-4xl text-purple-800 hover:scale-110 transition-transform" />
                        </Link>
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Join BookHaven and start your reading journey
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="At least 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters long</p>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                                Register as
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                required
                            >
                                <option value="" disabled>
                                    Select role
                                </option>
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-slate-600">Already have an account?</span>{" "}
                        <Link to="/login" className="font-medium text-slate-800 hover:text-slate-900 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
