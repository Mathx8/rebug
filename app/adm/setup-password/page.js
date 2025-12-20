"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase.js";
import { useRouter } from "next/navigation";

export default function SetupPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("As senhas não coincidem");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Senha definida com sucesso!");
      router.push("/adm"); // Vai para o painel administrativo
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <form onSubmit={handleSetPassword} className="w-full max-w-sm bg-[#0f111a]/80 border border-white/5 rounded-2xl p-12 shadow-2xl">
        <h1 className="text-xl font-black text-blue-600 mb-2 text-center uppercase tracking-tighter">Definir Senha</h1>
        <p className="text-slate-500 text-[10px] uppercase text-center mb-10 tracking-widest font-bold">Crie sua senha de acesso</p>
        <div className="space-y-4">
          <input type="password" placeholder="Nova Senha" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="password" placeholder="Confirme a Senha" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        </div>
        {error && <div className="text-red-500 text-xs mt-4 text-center font-bold bg-red-500/10 py-2 rounded-lg">{error}</div>}
        <button type="submit" disabled={loading} className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white uppercase transition-all">
          {loading ? "Salvando..." : "Confirmar Senha"}
        </button>
      </form>
    </div>
  );
}