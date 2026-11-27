import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../auth/AuthSplitLayout";
import { loginUser } from "../../services/authApi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Login payload:", { email, password });
    if(loading) return
    setError("")
    setLoading(true)
    try {
      const response=await loginUser({email:email.trim().toLowerCase(),password})      
      navigate("/dashboard",{state:{email:email.trim().toLowerCase(),userId:response.userId}})
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }

  };

  return (
    <AuthSplitLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-1 text-sm">
          Sign in to access your CoinFlow wallets and analytics.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                backgroundColor: "var(--bg-app)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                backgroundColor: "var(--bg-app)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button disabled={loading || !email || !password} type="submit" className="cf-btn-primary w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60">
            Login
          </button>
          
              <p className="text-center">
                <Link
                to="/forgetPass"
                style={{ color: "var(--text-muted)" }}
                className="hover:underline"
                >
                Forget Password
                </Link>
              </p>

        </form>

        <p style={{ color: "var(--text-muted)" }} className="mt-6 text-center text-sm">
          New to CoinFlow &rarr;{" "}
          <Link
            to="/register"
            style={{ color: "var(--accent)" }}
            className="font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};

export default LoginPage;