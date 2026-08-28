"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, Globe, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil",
  "Canada","Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt","Ethiopia","Finland",
  "France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Italy",
  "Japan","Jordan","Kenya","Malaysia","Mexico","Morocco","Nepal","Netherlands","New Zealand","Nigeria",
  "Norway","Pakistan","Philippines","Poland","Portugal","Romania","Russia","Saudi Arabia","Senegal",
  "Singapore","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Tanzania","Thailand",
  "Turkey","Uganda","Ukraine","United Kingdom","United States","Venezuela","Vietnam","Zimbabwe",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "STUDENT", country: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!form.country) {
      setError("Please select your country.");
      return;
    }
    setLoading(true);
    const result = await register({
      name: form.name, email: form.email, password: form.password,
      role: form.role, country: form.country,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ScholarPay</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-[var(--color-muted)] text-sm">Join ScholarPay on Stellar Testnet</p>
        </div>

        <div className="card glow">
          <div className="mb-4 flex justify-center">
            <span className="testnet-badge"><Zap className="w-3 h-3" />Stellar TESTNET</span>
          </div>

          {error && (
            <div className="error-box mb-4"><span>⚠</span><span>{error}</span></div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input id="name" name="name" required value={form.name}
                  onChange={handleChange} className="input-field pl-9" placeholder="Your full name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input id="email" name="email" type="email" required value={form.email}
                  onChange={handleChange} className="input-field pl-9" placeholder="you@example.com" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {["STUDENT", "SENDER"].map((r) => (
                  <button
                    key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      form.role === r
                        ? "border-blue-500/60 bg-blue-500/15 text-blue-300"
                        : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-blue-500/30"
                    }`}
                  >
                    {r === "STUDENT" ? "🎓 Student" : "💸 Sender / Sponsor"}
                  </button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="label" htmlFor="country">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <select id="country" name="country" value={form.country}
                  onChange={handleChange} className="input-field pl-9 appearance-none" required>
                  <option value="">Select your country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input id="password" name="password" type={showPass ? "text" : "password"} required
                  value={form.password} onChange={handleChange}
                  className="input-field pl-9 pr-10" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="confirmPassword">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input id="confirmPassword" name="confirmPassword" type="password" required
                  value={form.confirmPassword} onChange={handleChange}
                  className="input-field pl-9" placeholder="Repeat password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--color-muted)] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
