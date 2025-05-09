import { useState } from "react"
import { Link } from "react-router-dom"
import { IoIosBook } from "react-icons/io"

export default function VerifyEmail() {
    const [resendLoading, setResendLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleResend = async () => {
        setResendLoading(true)
        try {
            const res = await fetch("https://bookcompass.onrender.com/api/auth/confirmEmail/:token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.msg || "Could not resend verification email")

            setMessage("Verification email resent. Please check your inbox.")
        } catch (error) {
            setMessage(error.message)
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Link to="/" className="flex items-center justify-center">
                        <IoIosBook className="text-4xl text-purple-800 transition-transform hover:scale-110" />
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">
                        Verify your email
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        We’ve sent you a confirmation link. Please check your inbox to complete your registration.
                    </p>
                </div>

                {message && (
                    <p className="text-center text-sm text-slate-700 bg-slate-100 p-3 rounded">
                        {message}
                    </p>
                )}

                <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full rounded-md bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                    {resendLoading ? "Resending..." : "Resend Verification Email"}
                </button>

                <div className="text-center text-sm">
                    <span className="text-slate-600">Already verified?</span>{" "}
                    <Link
                        to="/login"
                        className="font-medium text-slate-800 hover:text-slate-900 transition-colors"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
