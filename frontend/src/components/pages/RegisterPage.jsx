import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../auth/AuthSplitLayout";
import { registerUser } from "../../services/authApi";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phnumber, setPhNumber] = useState("")
  const [password, setPassword] = useState("");
  // const [planType, setPlanType] = useState("individual");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8
    },
    {
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(password)
    },
    {
      label: "At least one lowercase letter",
      valid: /[a-z]/.test(password)
    },
    {
      label: "At least one number",
      valid: /[0-9]/.test(password)
    },
    {
      label: "At least one special character",
      valid: /[^A-Za-z0-9\s]/.test(password)
    },
    {
      label: "Maximum 72 bytes",
      valid: new TextEncoder().encode(password).length <= 72
    }
  ];

  const isPasswordValid = passwordRules.every(
    rule => rule.valid
  )
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // console.log("Register payload:", { name, email, phnumber, password, planType });
    // navigate("/verify",{state:{email,planType}})

    e.preventDefault()

    if (loading) return

    setError("")

    if (!isPasswordValid) {
      setError("Please satisfy all password requirements")
      return
    }

    setLoading(true)

    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phnumber,
        password,
      })
      navigate("/verify", { state: { email: email.trim().toLowerCase(), userId: response.userId } })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }

  };

  return (
    <AuthSplitLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-1 text-sm">
          Start tracking personal or shared family expenses in minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium">
              Full name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{
                backgroundColor: "var(--bg-app)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-phnumber" className="mb-1.5 block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="reg-phnumber"
              type="tel"
              required
              value={phnumber}
              onChange={(e) => setPhNumber(e.target.value)}
              placeholder="(+91)00000 00000"
              maxLength={10}
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              style={{
                backgroundColor: "var(--bg-app)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={{
                backgroundColor: "var(--bg-app)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Password requirements */}

            {password.length > 0 && (
              <div className="mt-3 space-y-1.5">

                <p className="text-xs font-semibold">
                  Password requirements:
                </p>

                {passwordRules.map((rule) => (
                  <div
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs ${rule.valid
                        ? "text-green-500"
                        : "text-gray-500"
                      }`}
                  >
                    <span>{rule.valid ? "✓" : "○"}</span>
                    <span>{rule.label}</span>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* <div>
            <span className="mb-1.5 block text-sm font-medium">Account type</span>
            <div className="grid grid-cols-2 gap-2.5">
              {["individual", "family"].map((type) => {
                const active = planType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPlanType(type)}
                    style={{
                      backgroundColor: active ? "var(--accent-soft)" : "var(--bg-app)",
                      borderColor: active ? "var(--accent)" : "var(--border-color)",
                      color: active ? "var(--accent)" : "var(--text-main)",
                    }}
                    className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition"
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div> */}

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button disabled={loading||!isPasswordValid||!email||!name} type="submit" className="cf-btn-primary w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ color: "var(--text-muted)" }} className="mt-6 text-center text-sm">
          Already have an account &rarr;{" "}
          <Link
            to="/login"
            style={{ color: "var(--accent)" }}
            className="font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};

export default RegisterPage;