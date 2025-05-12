import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { IoIosBook } from "react-icons/io"

export default function ResetPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const tokenFromURL = queryParams.get("token")
        if (tokenFromURL) {
            setToken(tokenFromURL)
        }
    }, [location])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`https://bookcompass.onrender.com/api/auth/resetPassword/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, confirmPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Auto-navigate after 3 seconds
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError(data.msg || data.error || "Password reset failed. Try again.");
            }
        } catch (error) {
            console.error("Reset error:", error)
            alert("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[100vh] flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        <Link to="/" className="flex items-center justify-center">
                            <IoIosBook className="text-4xl md:text-3xl text-purple-800 transition-transform hover:scale-110" />
                        </Link>
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter a new password for your account.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md">
                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-sm"
                                placeholder="At least 8 characters"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:text-sm"
                                placeholder="Re-enter your password"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting password..." : "Reset Password"}
                    </button>

                    {/* Link to login */}
                    <div className="text-center text-sm">
                        <span className="text-slate-600">Remembered your password?</span>{" "}
                        <Link
                            to="/login"
                            className="font-medium text-slate-800 hover:text-slate-900 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
