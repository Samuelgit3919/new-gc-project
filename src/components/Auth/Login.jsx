import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosBook } from "react-icons/io";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://bookcompass.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) {
                console.error("Login failed:", data.message);
                setError(data.message || "Login failed. Please try again.");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (error) {
            console.error("Error during login:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[100vh] flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        <Link to="/" className="flex items-center justify-center">
                            <IoIosBook className="text-4xl md:text-3xl text-purple-800 transition-transform hover:scale-110" />
                        </Link>
                        Sign in to BookCompass
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Welcome back, we missed you!
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-600 text-center">
                        {error}
                    </div>
                )}

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md">
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
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

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
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-sm"
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

                    <button
                        type="submit"
                        className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Sign in"}
                    </button>

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