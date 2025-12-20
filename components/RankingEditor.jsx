"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Save, RotateCcw, AlertCircle, Trash2, User, Fingerprint } from "lucide-react";
import EditableCell from "./EditarJogador.jsx";

const groups = [
  {
    title: "Estatísticas Principais",
    color: "text-amber-400",
    fields: [
      { label: "Títulos", key: "Títulos" },
      { label: "Vices", key: "Vices" },
      { label: "MVP", key: "MVP" },
      { label: "Top 1", key: "Top 1" },
      { label: "Top 2", key: "Top 2" },
      { label: "Top 3", key: "Top 3" },
    ],
  },
  {
    title: "Academy",
    color: "text-blue-400",
    fields: [
      { label: "Títulos", key: "Títulos Academy" },
      { label: "Vices", key: "Vices Academy" },
      { label: "MVP", key: "MVP.A" },
      { label: "Top 1", key: "T1.A" },
      { label: "Top 2", key: "T2.A" },
      { label: "Top 3", key: "T3.A" },
    ],
  },
];

export default function RankingEditor({ player, onSaveToDb, onDelete, saving }) {
  const [draft, setDraft] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (player) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft({ ...player });
      setOriginal({ ...player });
      setIsDirty(false);
    } else {
      setDraft(null);
    }
  }, [player]);

  if (!draft) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
        <div className="text-slate-600 mb-2">
          <AlertCircle size={32} opacity={0.5} />
        </div>
        <p className="text-slate-500 font-medium">Selecione um jogador acima para começar a editar</p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full">
            <div className="relative group">
              <img
                src={`https://hubbe.biz/avatar/${draft.Nick}?img_format=png&headonly=2`}
                alt={draft.Nick}
                className="h-16 w-16 rounded-2xl bg-black/40 border border-white/10 p-1 object-contain transition-transform group-hover:scale-110"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-md shadow-lg">
                <Fingerprint size={12} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome do Jogador</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input
                    type="text"
                    value={draft.Nome || ""}
                    onChange={(e) => handleChange("Nome", e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:border-blue-500/50 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nick (Hubbe)</label>
                <input
                  type="text"
                  value={draft.Nick || ""}
                  onChange={(e) => handleChange("Nick", e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm font-mono font-bold text-blue-400 focus:border-blue-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ações</label>
            <button
              onClick={() => onDelete(draft.ID, draft.Nome)}
              className="flex items-center bg-black/40 gap-2 px-4 py-2 text-[10px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap cursor-pointer"
            >
              <Trash2 size={14} /> Deletar Jogador
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title} className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${group.color === 'text-amber-400' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>
                {group.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {group.fields.map(({ label, key }) => (
                <div key={key} className="bg-black/20 rounded-lg p-1 flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 uppercase text-center font-semibold tracking-wide block mt-1">
                    {label}
                  </span>
                  <EditableCell
                    value={draft[key] ?? 0}
                    onChange={(v) => handleChange(key, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="sticky bottom-4 z-20 flex items-center justify-between bg-[#0f111a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl mt-8">
          <div className="text-sm text-slate-500 pl-2">
            {isDirty ? (
              <span className="text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Alterações não salvas
              </span>
            ) : (
              <span className="flex items-center gap-2 opacity-50 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Sincronizado
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { setDraft(original); setIsDirty(false); }}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black rounded-xl text-slate-500 hover:text-white transition-all uppercase disabled:opacity-20"
            >
              <RotateCcw size={14} /> Descartar
            </button>
            <button
              onClick={() => onSaveToDb(draft)}
              disabled={!isDirty || saving}
              className={`flex items-center gap-2 px-8 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase shadow-xl ${isDirty ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500 cursor-pointer' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
            >
              {saving ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save size={18} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}