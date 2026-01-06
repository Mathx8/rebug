"use client";
import { X } from "lucide-react";

export default function NovoCampeonato({
  isOpen,
  onClose,
  newCampeonato,
  setNewCampeonato,
  onSubmit,
  saving
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f111a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Novo Campeonato</h3>
        <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Adicione um novo campeonato</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome</label>
            <input
              required
              type="text"
              value={newCampeonato.nome}
              onChange={(e) => setNewCampeonato({ ...newCampeonato, nome: e.target.value })}
              placeholder="Ex: Goenji"
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nick (Hubbe)</label>
            <input
              required
              type="text"
              value={newCampeonato.nick}
              onChange={(e) => setNewCampeonato({ ...newCampeonato, nick: e.target.value })}
              placeholder="Ex: Levi"
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-xl transition-all mt-4 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Criando..." : "Criar Campeonato"}
          </button>
        </form>
      </div>
    </div>
  );
}