"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isSettingPassword, setIsSettingPassword] = useState(false);

    useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
                if (window.location.hash.includes("access_token")) {
                    setIsSettingPassword(true);
                }
            }
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError("Email ou senha inválidos");
        setLoading(false);
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("As senhas não coincidem");
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setIsSettingPassword(false);
            setError(null);
            alert("Senha definida com sucesso! Agora você pode logar.");
            window.location.hash = "";
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
            <form
                onSubmit={isSettingPassword ? handleSetPassword : handleLogin}
                className="w-full max-w-sm bg-[#0f111a]/80 backdrop-blur border border-white/5 rounded-2xl p-12 shadow-2xl"
            >
                <h1 className="text-xl font-black text-blue-600 mb-2 text-center uppercase tracking-tighter">
                    {isSettingPassword ? "Definir Senha" : "Login"}
                </h1>
                <p className="text-slate-500 text-[10px] uppercase text-center mb-10 tracking-widest font-bold">
                    {isSettingPassword ? "Crie sua senha de acesso" : "Painel Administrativo"}
                </p>

                <div className="space-y-4">
                    {!isSettingPassword ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                        </>
                    ) : (
                        <>
                            <input
                                type="password"
                                placeholder="Nova Senha"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                            <input
                                type="password"
                                placeholder="Confirme a Nova Senha"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                        </>
                    )}
                </div>

                {error && (
                    <div className="text-red-500 text-xs mt-4 text-center font-bold bg-red-500/10 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white transition-all disabled:opacity-50 uppercase shadow-lg shadow-blue-900/20"
                >
                    {loading ? "Processando..." : isSettingPassword ? "Salvar Senha" : "Entrar"}
                </button>

                {isSettingPassword && (
                    <button
                        type="button"
                        onClick={() => { setIsSettingPassword(false); window.location.hash = ""; }}
                        className="w-full mt-4 text-[10px] text-slate-500 hover:text-white uppercase font-bold transition-colors"
                    >
                        Voltar para o Login
                    </button>
                )}
            </form>
        </div>
    );
}