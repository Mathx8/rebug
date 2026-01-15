"use client";
import { X, ImagePlus, Calendar, Trophy } from "lucide-react";
import { useState } from "react";

export default function NovoCampeonato({
  isOpen,
  onClose,
  newCampeonato,
  setNewCampeonato,
  onSubmit,
  saving,
}) {
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCampeonato({ ...newCampeonato, imagem: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f111a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">

        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Novo Campeonato</h3>
        <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Registre uma nova temporada no sistema</p>

        <form onSubmit={onSubmit} className="space-y-5">

          <div className="flex flex-col items-center justify-center mb-6">
            <label className="group relative cursor-pointer">
              <div className="h-28 w-28 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-600 group-hover:text-blue-500 transition-colors">
                    <ImagePlus size={28} />
                    <span className="text-[8px] font-black uppercase mt-2">Capa / Logo</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Trophy size={24} className="text-white" />
                </div>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="text-[9px] text-slate-600 mt-2 uppercase font-black tracking-widest">Clique para selecionar</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Torneio</label>
            <input
              required
              type="text"
              placeholder="Ex: Copa Elite Season 4"
              value={newCampeonato.nome || ""}
              onChange={(e) => setNewCampeonato({ ...newCampeonato, nome: e.target.value })}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tier / Nível</label>
            <select
              required
              value={newCampeonato.tier || ""}
              onChange={(e) => setNewCampeonato({ ...newCampeonato, tier: e.target.value })}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all appearance-none"
            >
              <option value="" className="bg-[#0f111a]">Selecione...</option>
              <option value="1" className="bg-[#0f111a]">Tier S (Principal)</option>
              <option value="2" className="bg-[#0f111a]">Tier Academy</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" />
              Data de Início
            </label>
            <input
              required
              type="date"
              value={newCampeonato.data_inicio || ""}
              onChange={(e) => setNewCampeonato({ ...newCampeonato, data_inicio: e.target.value })}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-xl transition-all mt-4 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Registrando..." : "Criar Campeonato"}
          </button>
        </form>
      </div>
    </div>
  );
}