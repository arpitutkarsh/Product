import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../Context/authContext";

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/admin/register", formData);
      if (res.data.success || res.status === 201) {
        alert("OTP sent to your registered email (Use 712345 to verify).");
        setStep(2);

        const timeout = setTimeout(() => {
          alert("OTP expired! Please register again.");
          resetForm();
        }, 10000);
        setTimer(timeout);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    else if (!value && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp === "712345") {
      clearTimeout(timer);
      alert("✅ OTP Verified Successfully!");
      try {
        await login(formData.email, formData.password); // Auto-login
        navigate("/home");
      } catch (err) {
        console.error("Auto-login failed:", err);
        alert("Verification success, but auto-login failed. Please log in manually.");
        navigate("/");
      }
    } else {
      alert("❌ Invalid OTP! Please register again.");
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ name: "", email: "", phone: "", password: "" });
    setOtp(["", "", "", "", "", ""]);
    clearTimeout(timer);
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
      {/* Floating circles */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[-50px] left-[-50px] animate-pulseSlow"></div>
      <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-[-80px] right-[-60px] animate-pulseSlow"></div>

      {step === 1 ? (
        <form
          onSubmit={handleRegister}
          className="relative w-96 p-10 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/25 shadow-2xl flex flex-col space-y-5 transition-all duration-500"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-4 tracking-wide">
            Admin Register
          </h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-3 p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-3 p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mb-3 p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-4 p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 border-amber-200 rounded-xl bg-blue/30 text-white font-semibold hover:bg-white/40 transition duration-300 shadow-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpVerify}
          className="relative w-200 p-10 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/25 shadow-2xl flex flex-col space-y-6 transition-all duration-500"
        >
          <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
            Enter OTP
          </h2>

          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                className="border w-14 h-14 ml-5 text-center text-2xl rounded-xl border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 transform hover:scale-105"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
          >
            Verify OTP
          </button>
        </form>
      )}

      <style>{`
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.35; }
        }
        .animate-pulseSlow {
          animation: pulseSlow 6s infinite;
        }
      `}</style>
    </div>
  );
}

export default Register;
