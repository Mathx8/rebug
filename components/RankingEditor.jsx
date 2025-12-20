"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Save, RotateCcw, AlertCircle } from "lucide-react";
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

export default function RankingEditor({ player, onSaveToDb, saving }) {
  const [draft, setDraft] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (player) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(player);
      setOriginal(player);
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
    const updated = { ...draft, [key]: Number(value) };
    setDraft(updated);
    setIsDirty(true);
  };

  const handleReset = () => {
    setDraft(original);
    setIsDirty(false);
  };

  const handleCommit = () => {
    onSaveToDb(draft);
    setOriginal(draft);
    setIsDirty(false);
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


      <div className="flex items-center gap-4 mb-6 px-2">
        <img
          src={`https://hubbe.biz/avatar/${draft.Nick}?img_format=png&headonly=2`}
          alt={draft.Nick}
          className="h-12 w-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg"
        />
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">{draft.Nome}</h2>
          <p className="text-xs text-slate-500">{draft.Nick}</p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div
            key={group.title}
            className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${group.color === 'text-amber-400' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>
                {group.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {group.fields.map(({ label, key }) => (
                <div
                  key={key}
                  className="bg-black/20 rounded-lg p-1 flex flex-col gap-2"
                >
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
              <span className="flex items-center gap-2 opacity-50">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Sincronizado
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={16} />
              Descartar
            </button>

            <button
              onClick={handleCommit}
              disabled={!isDirty && !saving}
              className={`
                        flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg shadow-lg
                        transition-all duration-200
                        ${isDirty
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                    `}
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