import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext.jsx"; // Keep path as is

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Maintenance Overlay Flag
  // --------------------------
  const showMaintenance = true; // Set true to show maintenance screen

  return (
    <div className="relative w-full h-screen">
      {/* Original Login Page */}
      <div className={`flex h-screen relative overflow-hidden ${showMaintenance ? "blur-sm pointer-events-none" : ""}`}>
        {/* Left Side */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col justify-center items-start p-16 space-y-6 relative overflow-hidden">
          <h1 className="text-5xl font-bold z-10 relative">Admin Portal</h1>
          <p className="text-xl z-10 relative">Manage your products efficiently</p>
          <ul className="space-y-2 text-lg z-10 relative">
            {["See Products", "Add Products", "Update Products", "Delete Products"].map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="absolute w-36 h-36 bg-pink-400 rounded-full opacity-30 top-[-50px] left-[-50px] animate-pulseSlow"></div>
          <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 bottom-[-80px] right-[-60px] animate-pulseSlow"></div>
          <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[150px] right-[50px] animate-pulseSlow"></div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center items-center bg-gray-100 relative overflow-hidden">
          <div className="absolute w-32 h-32 bg-pink-400 rounded-full opacity-20 top-[-40px] right-[30px] animate-pulseSlow"></div>
          <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-15 bottom-[20px] left-[50px] animate-pulseSlow"></div>
          <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[100px] left-[20px] animate-pulseSlow"></div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 flex flex-col space-y-5"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Admin Login
            </h2>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-3 w-full rounded-lg mb-4 hover:bg-blue-700 transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="bg-gray-200 text-blue-600 px-4 py-3 w-full rounded-lg hover:bg-gray-300 transition"
            >
              Register as Admin
            </button>
          </form>
        </div>

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

      {/* --------------------------
          Maintenance Overlay
      -------------------------- */}
      {showMaintenance && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center z-50">
          {/* Stars */}
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-70 animate-twinkle"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 p-12 rounded-3xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-black shadow-2xl max-w-md mx-auto text-center">
            <h1 className="text-6xl font-extrabold text-yellow-400 mb-4 animate-pulse">🚧 Under Maintenance</h1>
            <p className="text-xl text-gray-300 mb-4">Our portal is currently under maintenance.</p>
            <p className="text-lg text-gray-400 mb-6">We'll be back soon. Thank you for your patience!</p>

            <div className="flex justify-center space-x-3 mt-4">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>

          <style>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.3); }
            }
            .animate-twinkle { animation: twinkle infinite ease-in-out; }

            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-bounce { animation: bounce 1s infinite; }
            .delay-150 { animation-delay: 0.15s; }
            .delay-300 { animation-delay: 0.3s; }

            .animate-pulse {
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Login;
