"use client";

import { useEffect, useState } from "react";
import { Save, RotateCcw, AlertCircle, Trash2, Shield, Calendar, UserCheck, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase.js";

const CompactSelect = ({ items, value, onChange, placeholder }) => (
    <div className="relative group">
        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-8 py-2 text-sm font-bold text-white focus:border-blue-500/50 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
        >
            <option value="" disabled className="bg-[#0f111a]">{placeholder}</option>
            {items.map((item) => (
                <option key={item.ID} value={item.ID} className="bg-[#0f111a]">
                    {item.Nome}
                </option>
            ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <svg width="8" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L5 5L9 1" />
            </svg>
        </div>
    </div>
);

export default function TimeEditor({ team, players, onSaveToDb, onDelete, saving }) {
    const [draft, setDraft] = useState(null);
    const [original, setOriginal] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (team) {
            setDraft({ ...team });
            setOriginal({ ...team });
            setIsDirty(false);
        } else {
            setDraft(null);
        }
    }, [team]);

    if (!draft) {
        return (
            <div className="mt-10 flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                <div className="text-slate-600 mb-2">
                    <AlertCircle size={32} opacity={0.5} />
                </div>
                <p className="text-slate-500 font-medium">Selecione um time acima para começar a editar</p>
            </div>
        );
    }

    const handleChange = (key, value) => {
        setDraft(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${draft.id}-${Math.random()}.${fileExt}`;
            const filePath = `logos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('escudos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('escudos')
                .getPublicUrl(filePath);

            handleChange("escudo_url", data.publicUrl);
        } catch (error) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5 w-full">

                        <div className="relative group">
                            <label className="cursor-pointer block">
                                <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner overflow-hidden relative transition-all group-hover:border-blue-500/50">
                                    {draft.escudo_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={draft.escudo_url} alt="Escudo" className="h-full w-full object-cover" />
                                    ) : (
                                        <Shield size={32} className={uploading ? "animate-pulse opacity-50" : ""} />
                                    )}

                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ImagePlus size={20} className="text-white" />
                                    </div>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                            {uploading && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome do Time</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input
                                        type="text"
                                        value={draft.nome || ""}
                                        onChange={(e) => handleChange("nome", e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:border-blue-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ano de Fundação</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input
                                        type="number"
                                        value={draft.ano || ""}
                                        onChange={(e) => handleChange("ano", e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:border-blue-500/50 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Dono / Proprietário</label>
                                <CompactSelect
                                    items={players}
                                    value={draft.dono}
                                    onChange={(val) => handleChange("dono", val)}
                                    placeholder="Selecione o dono..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ações</label>
                        <button
                            onClick={() => onDelete(draft.id, draft.nome, draft.escudo_url)}
                            className="flex items-center bg-black/40 gap-2 px-4 py-2 text-[10px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap cursor-pointer"
                        >
                            <Trash2 size={14} /> Deletar Time
                        </button>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-4 z-20 flex items-center justify-between bg-[#0f111a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl mt-8">
                <div className="text-sm text-slate-500 pl-2">
                    {isDirty ? (
                        <span className="text-amber-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Alterações pendentes
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 opacity-50 text-[10px] font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Sincronizado
                        </span>
                    )}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setDraft(original); setIsDirty(false); }}
                        disabled={!isDirty || saving || uploading}
                        className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black rounded-xl text-slate-500 hover:text-white transition-all uppercase disabled:opacity-20"
                    >
                        <RotateCcw size={14} /> Descartar
                    </button>
                    <button
                        onClick={() => onSaveToDb(draft)}
                        disabled={!isDirty || saving || uploading}
                        className={`flex items-center gap-2 px-8 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase shadow-xl ${isDirty ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500 cursor-pointer' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
                    >
                        {saving ? "Salvando..." : (
                            <>
                                <Save size={18} /> Atualizar Time
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}