"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Save, RotateCcw, AlertCircle, Trash2, Shield, Calendar, UserCheck, ImagePlus, UserPlus, UserMinus, Loader2 } from "lucide-react";
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

    const [teamPlayers, setTeamPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [selectedPlayerToAdd, setSelectedPlayerToAdd] = useState("");

    const fetchTeamPlayers = async (teamId) => {
        setLoadingPlayers(true);
        const { data, error } = await supabase
            .from("time_jogadores")
            .select(`
                id_jogador,
                jogador:id_jogador (id, nome, nick)
            `)
            .eq("id_time", teamId);

        if (!error && data) {
            setTeamPlayers(data.map(item => item.jogador));
        }
        setLoadingPlayers(false);
    };

    useEffect(() => {
        if (team) {
            setDraft({ ...team });
            setOriginal({ ...team });
            setIsDirty(false);
            fetchTeamPlayers(team.id);
        } else {
            setDraft(null);
            setTeamPlayers([]);
        }
    }, [team]);

    const handleAddPlayer = async () => {
        if (!selectedPlayerToAdd || !draft) return;

        const { error } = await supabase
            .from("time_jogadores")
            .insert([{ id_time: draft.id, id_jogador: parseInt(selectedPlayerToAdd) }]);

        if (error) {
            alert("Erro ao adicionar jogador: " + error.message);
        } else {
            setSelectedPlayerToAdd("");
            fetchTeamPlayers(draft.id);
        }
    };

    const handleRemovePlayer = async (playerId) => {
        if (!confirm("Remover este jogador do time?")) return;

        const { error } = await supabase
            .from("time_jogadores")
            .delete()
            .eq("id_time", draft.id)
            .eq("id_jogador", playerId);

        if (error) {
            alert("Erro ao remover: " + error.message);
        } else {
            fetchTeamPlayers(draft.id);
        }
    };

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
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome do Time</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input
                                        type="text"
                                        value={draft.nome || ""}
                                        onChange={(e) => handleChange("nome", e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
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
                                        className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
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

                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">AÇÕES</label>
                                <button
                                    onClick={() => onDelete(draft.id, draft.nome, draft.escudo_url)}
                                    className="flex items-center w-full bg-black/40 gap-2 px-4 py-2.5 text-[10px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap cursor-pointer"
                                >
                                    <Trash2 size={14} /> Deletar Time
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 shadow-xl mb-24">
                <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">ELENCO ATUAL</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedPlayerToAdd}
                            onChange={(e) => setSelectedPlayerToAdd(e.target.value)}
                            className="bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-300 outline-none focus:border-blue-500/50"
                        >
                            <option value="" className="bg-[#0f111a]">Selecionar jogador...</option>
                            {players
                                .filter(p => !teamPlayers.some(tp => tp?.ID === p.ID))
                                .map(p => <option className="bg-[#0f111a]" key={p.ID} value={p.ID}>{p.Nome}</option>)
                            }
                        </select>
                        <button
                            onClick={handleAddPlayer}
                            disabled={!selectedPlayerToAdd}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 p-1.5 rounded-lg text-white transition-all cursor-pointer"
                        >
                            <UserPlus size={16} />
                        </button>
                    </div>
                </div>

                {loadingPlayers ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : teamPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {teamPlayers.map((p) => (
                            <div key={p?.id} className="flex items-center justify-between bg-black/20 border border-white/[0.03] p-3 rounded-xl group hover:border-white/10 transition-all">
                                <div className="flex items-center justify-between gap-3">
                                    <img src={`https://hubbe.biz/avatar/${p.nick}?img_format=png&headonly=2`} className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 object-cover" alt="" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white">{p?.nome}</span>
                                        <span className="text-[9px] text-slate-500 tracking-tighter">@{p?.nick}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemovePlayer(p?.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all cursor-pointer"
                                >
                                    <UserMinus size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-slate-600 text-[10px] uppercase font-bold tracking-widest">Nenhum jogador no elenco</p>
                )}
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
                <div className={`bg-[#0f111a]/95 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-300 ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                    <div className="text-sm text-slate-500 pl-4">
                        {isDirty ? (
                            <span className="text-amber-400 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Alterações pendentes
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 opacity-50 text-[9px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Sincronizado
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setDraft(original); setIsDirty(false); }} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl text-slate-500 hover:text-white transition-all uppercase"><RotateCcw size={14} /> Descartar</button>
                        <button onClick={() => onSaveToDb(draft)} disabled={saving || !isDirty} className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase shadow-xl ${isDirty ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500' : 'bg-white/5 text-slate-700'}`}>
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Atualizar Time</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}