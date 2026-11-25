import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../auth/AuthSplitLayout";
import { verifyEmail } from "../../services/authApi";

const RESEND_TIMEOUT_SECONDS = 30;

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your registered email";
  const userId=location.state?.userId
  const [loading,setLoading]=useState(false)
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // if (!otp.trim()) return;
    // // Later: call verifyOtpApi({ email, otp })
    // navigate("/login", { state: { verified: true } });

    e.preventDefault();

  setStatusMsg("");

  if (!userId) {
    setStatusMsg("Registration details are missing.");
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    setStatusMsg("Please enter a valid 6-digit OTP.");
    return;
  }

  setLoading(true);

  try {
    await verifyEmail({
      userId,
      otp,
    });

    navigate("/login", {
      replace: true,
      state: { verified: true },
    });
  } catch (err) {
    setStatusMsg(err.message);
  } finally {
    setLoading(false);
  }
  };

  const handleResendOtp = () => {
    if (secondsLeft > 0) return;
    // Later: call resendOtpApi({ email })
    setSecondsLeft(RESEND_TIMEOUT_SECONDS);
    setStatusMsg("A fresh OTP has been sent to your email.");
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <AuthSplitLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Verification</h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-1 text-sm">
          An OTP has been sent to <strong style={{ color: "var(--text-main)" }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="verify-otp" className="mb-1.5 block text-sm font-medium">
              Enter 6-Digit OTP
            </label>
            <input
              id="verify-otp"
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

          {statusMsg && (
            <p style={{ color: "var(--accent)" }} className="text-xs font-medium">
              {statusMsg}
            </p>
          )}

          <button disabled={loading} type="submit" className="cf-btn-primary w-full cursor-pointer py-2.5 text-sm disabled:opacity-60">
            {loading?"Verifying...":"Verify"}
          </button>
        </form>

        <div
          style={{ color: "var(--text-muted)" }}
          className="mt-6 flex flex-col items-center gap-1.5 text-center text-sm"
        >
          <p>
            Didn&apos;t get the OTP?{" "}
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
          </p>
          {secondsLeft > 0 && (
            <span className="text-xs font-medium">
              Resend available in <strong>{formattedTime}</strong>
            </span>
          )}
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default EmailVerificationPage;