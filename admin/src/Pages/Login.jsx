import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/admin/login", {
        email,
        password,
      });

      if (res.data.success) {
        sessionStorage.setItem("adminToken", res.data.data.accessToken);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Check credentials!");
    }
  };

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col justify-center items-start p-16 space-y-6 relative overflow-hidden">
        <h1 className="text-5xl font-bold z-10 relative">Admin Portal</h1>
        <p className="text-xl z-10 relative">
          Manage your products efficiently
        </p>
        <ul className="space-y-2 text-lg z-10 relative">
          <li className="flex items-center">
            <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">✓</span>
            See Products
          </li>
          <li className="flex items-center">
            <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">✓</span>
            Add Products
          </li>
          <li className="flex items-center">
            <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">✓</span>
            Update Products
          </li>
          <li className="flex items-center">
            <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">✓</span>
            Delete Products
          </li>
        </ul>

        {/* Left-side pink bubbles */}
        <div className="absolute w-36 h-36 bg-pink-400 rounded-full opacity-30 top-[-50px] left-[-50px] animate-pulseSlow"></div>
        <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 bottom-[-80px] right-[-60px] animate-pulseSlow"></div>
        <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[150px] right-[50px] animate-pulseSlow"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 relative overflow-hidden">
        {/* Right-side pink bubbles */}
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

          <input
            type="email"
            placeholder="Email"
            className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-3 w-full rounded-lg mb-4 hover:bg-blue-700 transition"
          >
            Login
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

      {/* Tailwind Animation */}
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

export default Login;
