"use client";
import { Search } from "lucide-react";

export default function PlayerSelect({ players, value, onChange }) {
    return (
        <div className="relative w-full md:w-96">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={18} />
            </div>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="
            w-full bg-[#0f111a] border border-white/10 text-slate-300 
            rounded-xl pl-10 pr-4 py-3 appearance-none
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all cursor-pointer hover:bg-[#161925]
        "
            >
                <option value="" disabled>
                    Selecione um jogador para editar...
                </option>

                {players.map((p) => (
                    <option key={p.ID} value={p.ID} className="bg-[#0f111a]">
                        {p.Nome}
                    </option>
                ))}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1L5 5L9 1" />
                </svg>
            </div>
        </div>
    );
}