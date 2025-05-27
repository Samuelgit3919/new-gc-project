import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosBook } from "react-icons/io";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const isFormValid = email && password.length >= 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Please enter valid credentials.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("https://bookcompass.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Login failed. Please try again.");
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("userId", data.user._id); // Corrected from data.userId

            const token = localStorage.getItem("token")
            console.log(token)

            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <ToastContainer />
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        <Link to="/" className="flex items-center justify-center">
                            <IoIosBook className="text-4xl text-purple-800 hover:scale-110 transition-transform" />
                        </Link>
                        Sign in to BookCompass
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">Welcome back, we missed you!</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <Link
                                    to="/forgotPassword"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                                    placeholder="Enter your password"
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
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 transition-colors disabled:opacity-50"
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? "Logging in..." : "Sign in"}
                    </button>

                    {/* Link to Register */}
                    <div className="text-center text-sm">
                        <span className="text-slate-600">Don't have an account?</span>{" "}
                        <Link
                            to="/register"
                            className="font-medium text-slate-800 hover:text-slate-900 transition-colors"
                        >
                            Register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
