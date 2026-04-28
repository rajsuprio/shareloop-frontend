import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectPath = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [banner, setBanner] = useState({ type: "", message: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setBanner({ type: "", message: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.user, data.token);

      setBanner({ type: "success", message: "Login successful." });

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 900);
    } catch (error) {
      setBanner({ type: "error", message: error.message });
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Login"
        description="Log in to continue using ShareLoop."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
      >
        {banner.message && (
          <div className={`rounded-2xl p-4 text-sm font-medium ${
            banner.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}>
            {banner.message}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
        >
          Login
        </button>

        <p className="text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-green-600">
            Sign up
          </Link>
        </p>
      </form>
    </AppShell>
  );
}