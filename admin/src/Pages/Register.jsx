import React, { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/admin/register", formData);
      if (res.data.success || res.status === 201) {
        alert("OTP sent to your registered email (Use 712345 to verify).");
        setStep(2);

        const timeout = setTimeout(() => {
          alert("OTP expired! Please register again.");
          setStep(1);
          setFormData({ name: "", email: "", phone: "", password: "" });
          setOtp(["", "", "", "", "", ""]);
        }, 10000);
        setTimer(timeout);
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed. Try again!");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
    else if (!value && index > 0) inputRefs.current[index - 1].focus();
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp === "712345") {
      clearTimeout(timer);
      alert("✅ OTP Verified Successfully!");
      try {
        await login(formData.email, formData.password);
        alert("🎉 Registration complete! Redirecting to dashboard...");
        navigate("/home");
      } catch (err) {
        console.error("Auto-login failed:", err);
        alert(
          "Verification success, but auto-login failed. Please log in manually."
        );
        navigate("/");
      }
    } else {
      alert("❌ Invalid OTP! Please register again.");
      setTimeout(() => {
        setStep(1);
        setFormData({ name: "", email: "", phone: "", password: "" });
        setOtp(["", "", "", "", "", ""]);
      }, 1000);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden p-4 sm:p-0">
      {/* Floating circles */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[-50px] left-[-50px] animate-pulseSlow"></div>
      <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-[-80px] right-[-60px] animate-pulseSlow"></div>

      {/* Form Container */}
      <div
        className={`relative w-full max-w-md sm:w-96 transition-all duration-500
          ${window.innerWidth < 640 ? "slide-up-mobile" : ""}`}
      >
        {step === 1 ? (
          <form
            onSubmit={handleRegister}
            className="p-6 sm:p-10 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/25 shadow-2xl flex flex-col space-y-4 sm:space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-4 tracking-wide">
              Admin Register
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 w-full"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              Register
            </button>

            <p className="text-center text-white/70 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-white cursor-pointer font-medium underline hover:text-white/90"
              >
                Login
              </span>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleOtpVerify}
            className="p-6 sm:p-10 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/25 shadow-2xl flex flex-col space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-4 tracking-wide">
              Enter OTP
            </h2>

            <div className="flex justify-between flex-wrap gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="border w-12 sm:w-14 h-12 sm:h-14 text-center text-xl sm:text-2xl rounded-xl border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 transform hover:scale-105"
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
      </div>

      <style>{`
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.35; }
        }
        .animate-pulseSlow {
          animation: pulseSlow 6s infinite;
        }

        /* Slide up animation for mobile */
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .slide-up-mobile {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Register;
