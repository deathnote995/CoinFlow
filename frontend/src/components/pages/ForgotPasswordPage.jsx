import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../auth/AuthSplitLayout";

const RESEND_TIMEOUT_SECONDS = 30;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setErrorMsg("");
    // Later: call sendResetOtpApi({ email })
    setSecondsLeft(RESEND_TIMEOUT_SECONDS);
    setInfoMsg(`OTP sent to ${email}`);
    setStep("otp");
  };

  const handleResendOtp = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_TIMEOUT_SECONDS);
    setInfoMsg(`A new OTP has been sent to ${email}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (otp.length < 4) {
      setErrorMsg("Please enter the OTP sent to your email.");
      return;
    }
    // Later: call verifyResetOtpApi({ email, otp })
    setInfoMsg("");
    setStep("reset");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    // Later: call resetPasswordApi({ email, otp, newPassword })
    navigate("/login", { state: { passwordReset: true } });
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <AuthSplitLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-1 text-sm">
          {step === "email" && "Enter your registered email to receive a recovery OTP."}
          {step === "otp" && `Enter the OTP sent to ${email}.`}
          {step === "reset" && "Create a new password for your CoinFlow account."}
        </p>

        {errorMsg && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500">
            {errorMsg}
          </p>
        )}

        {infoMsg && (
          <p style={{ color: "var(--accent)" }} className="mt-3 text-xs font-medium">
            {infoMsg}
          </p>
        )}

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium">
                Registered Email
              </label>
              <input
                id="fp-email"
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

            <button type="submit" className="cf-btn-primary w-full cursor-pointer py-2.5 text-sm">
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fp-otp" className="mb-1.5 block text-sm font-medium">
                OTP
              </label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                style={{
                  backgroundColor: "var(--bg-app)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-main)",
                }}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm tracking-widest outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button type="submit" className="cf-btn-primary w-full cursor-pointer py-2.5 text-sm">
              Verify OTP
            </button>

            <div
              style={{ color: "var(--text-muted)" }}
              className="flex flex-col items-center gap-1 pt-2 text-center text-xs"
            >
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={secondsLeft > 0}
                style={{
                  color: secondsLeft > 0 ? "var(--text-muted)" : "var(--accent)",
                }}
                className={`font-semibold ${
                  secondsLeft > 0 ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:underline"
                }`}
              >
                Resend OTP
              </button>
              {secondsLeft > 0 && <span>Resend available in {formattedTime}</span>}
            </div>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fp-new-pass" className="mb-1.5 block text-sm font-medium">
                New Password
              </label>
              <input
                id="fp-new-pass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  backgroundColor: "var(--bg-app)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-main)",
                }}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="fp-confirm-pass" className="mb-1.5 block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="fp-confirm-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                style={{
                  backgroundColor: "var(--bg-app)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-main)",
                }}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button type="submit" className="cf-btn-primary w-full cursor-pointer py-2.5 text-sm">
              Update Password
            </button>
          </form>
        )}

        <p style={{ color: "var(--text-muted)" }} className="mt-6 text-center text-sm">
          Remembered your password?{" "}
          <Link
            to="/login"
            style={{ color: "var(--accent)" }}
            className="font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordPage;