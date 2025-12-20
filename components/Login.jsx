"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) setError("Email ou senha inválidos");
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0f111a]/80 border border-white/5 rounded-2xl p-12 shadow-2xl">
                <h1 className="text-xl font-black text-blue-600 mb-10 text-center uppercase tracking-tighter">Login</h1>
                <div className="space-y-4">
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    <input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                {error && <div className="text-red-500 text-xs mt-4 text-center font-bold bg-red-500/10 py-2 rounded-lg">{error}</div>}
                <button type="submit" disabled={loading} className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white uppercase tracking-tighter shadow-lg shadow-blue-900/20">
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}