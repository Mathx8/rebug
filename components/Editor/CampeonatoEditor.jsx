"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Save, Trash2, Trophy, Star, Target, Zap, Loader2, ImagePlus, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase.js";

const PlayerSelect = ({ label, value, onChange, icon: Icon, color, players }) => (
    <div className="space-y-1">
        <label className={`text-[9px] font-black uppercase tracking-widest ${color || 'text-slate-500'} flex items-center gap-1`}>
            {Icon && <Icon size={10} />} {label}
        </label>
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white text-[11px] focus:border-blue-500/50 outline-none"
        >
            <option value="">Selecione...</option>
            {players.map(p => <option key={p.ID} value={p.ID}>{p.Nome}</option>)}
        </select>
    </div>
);

export default function CampeonatoEditor({ campeonatoId, teams, players, onDelete }) {
    const [draft, setDraft] = useState(null);
    const [original, setOriginal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterOwner, setFilterOwner] = useState("");
    const [filterYear, setFilterYear] = useState("");

    useEffect(() => {
        if (campeonatoId) {
            fetchCampeonato();
            fetchCampeonatoTimes();
        } else {
            setDraft(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campeonatoId]);

    async function fetchCampeonato() {
        setLoading(true);
        const { data } = await supabase.from("campeonatos").select("*").eq("id", campeonatoId).single();
        if (data) {
            setDraft(data);
            setOriginal(data);
        }
        setLoading(false);
    }

    async function fetchCampeonatoTimes() {
        const { data } = await supabase
            .from("campeonato_times")
            .select("id_time")
            .eq("id_campeonato", campeonatoId);
        setSelectedTeams(data?.map(t => t.id_time) || []);
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `camp-${Date.now()}.${fileExt}`;
            const filePath = `campeonatos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('escudos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('escudos').getPublicUrl(filePath);
            setDraft({ ...draft, logo_url: data.publicUrl });
        } catch (error) {
            alert("Erro no upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const toggleTeam = async (id_time) => {
        if (selectedTeams.includes(id_time)) {
            const { error } = await supabase
                .from("campeonato_times")
                .delete()
                .eq("id_campeonato", campeonatoId)
                .eq("id_time", id_time);

            if (!error) setSelectedTeams(prev => prev.filter(id => id !== id_time));
        } else {
            const { error } = await supabase
                .from("campeonato_times")
                .insert([{ id_campeonato: campeonatoId, id_time }]);

            if (!error) setSelectedTeams(prev => [...prev, id_time]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const { id, ...updateData } = draft;
        const { error } = await supabase.from("campeonatos").update(updateData).eq("id", id);

        if (!error) {
            setOriginal(draft);
            alert("Dados atualizados com sucesso!");
        } else {
            alert("Erro ao salvar: " + error.message);
        }
        setSaving(false);
    };

    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOwner = filterOwner === "" || team.dono === parseInt(filterOwner);
        const matchesYear = filterYear === "" || team.ano === parseInt(filterYear);
        return matchesSearch && matchesOwner && matchesYear;
    });

    const uniqueYears = [...new Set(teams.map(t => t.ano))].sort((a, b) => b - a);

    if (!campeonatoId) return (
        <div className="mt-8 flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
            <Trophy size={40} className="text-slate-800 mb-4" />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Selecione um campeonato para editar</p>
        </div>
    );

    if (loading || !draft) return <div className="p-20 text-center animate-pulse text-blue-500 font-black">CARREGANDO...</div>;

    const isDirty = JSON.stringify(draft) !== JSON.stringify(original);

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                <div className="flex flex-col md:flex-row gap-5 w-full items-start md:items-center">
                    <label className="relative group cursor-pointer shrink-0">
                        <div className="h-18 w-18 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner overflow-hidden relative transition-all group-hover:border-blue-500/50">
                            {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <img src={draft.logo_url} alt="Logo" className="h-full w-full object-cover" />}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImagePlus size={20} className="text-white" />
                            </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome do Campeonato</label>
                            <input
                                type="text"
                                value={draft.nome || ""}
                                onChange={(e) => setDraft({ ...draft, nome: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Tier</label>
                            <select
                                value={draft.tier || ""}
                                onChange={(e) => setDraft({ ...draft, tier: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm outline-none"
                            >
                                <option value="1">Tier S</option>
                                <option value="2">Academy</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                                Data
                            </label>
                            <input
                                type="date"
                                value={draft.data || ""}
                                onChange={(e) => setDraft({ ...draft, data: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-blue-500/50 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">AÇÕES</label>
                        <button
                            onClick={() => onDelete(draft.id, draft.nome, draft.logo_url)}
                            className="flex items-center bg-black/40 gap-2 px-4 py-2 text-[10px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap cursor-pointer"
                        >
                            <Trash2 size={14} /> Deletar Campeonato
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-3xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-4">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy size={14} /> Times Participantes ({selectedTeams.length})
                    </h4>

                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            placeholder="Pesquisar time..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none focus:border-blue-500/50 w-full md:w-40"
                        />
                        <select
                            value={filterOwner}
                            onChange={(e) => setFilterOwner(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-slate-400 outline-none focus:border-blue-500/50"
                        >
                            <option value="">Todos os Donos</option>
                            {players.map(p => <option key={p.ID} value={p.ID}>{p.Nome}</option>)}
                        </select>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-slate-400 outline-none focus:border-blue-500/50"
                        >
                            <option value="">Todos os Anos</option>
                            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                        {(searchTerm || filterOwner || filterYear) && (
                            <button
                                onClick={() => { setSearchTerm(""); setFilterOwner(""); setFilterYear(""); }}
                                className="text-slate-500 hover:text-white transition-colors"
                                title="Limpar Filtros"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-height-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-wrap gap-2">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map(team => {
                                const isSelected = selectedTeams.includes(team.id);
                                return (
                                    <button
                                        key={team.id}
                                        onClick={() => toggleTeam(team.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer group ${isSelected
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                                            : "bg-black/40 border-white/5 text-slate-500 hover:border-blue-500/30 hover:text-white"
                                            }`}
                                    >
                                        {isSelected ? (
                                            <X size={12} className="text-blue-200" />
                                        ) : (
                                            <Plus size={12} className="text-slate-600 group-hover:text-blue-400" />
                                        )}
                                        {team.nome}
                                        <span className="opacity-50 font-normal text-[8px] ml-1">
                                            {team.ano}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="w-full py-8 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Nenhum time encontrado com os filtros</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#0f111a] border border-white/5 rounded-3xl p-6">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Pódio Final</h4>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase">Campeão</label>
                            <select value={draft.id_campeao || ""} onChange={(e) => setDraft({ ...draft, id_campeao: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs">
                                <option value="">Selecione...</option>
                                {teams.filter(t => selectedTeams.includes(t.id)).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase">Vice-Campeão</label>
                            <select value={draft.id_vice || ""} onChange={(e) => setDraft({ ...draft, id_vice: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-xs">
                                <option value="">Selecione...</option>
                                {teams.filter(t => selectedTeams.includes(t.id)).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f111a] border border-white/5 rounded-3xl p-6">
                    <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Estatísticas</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <PlayerSelect players={players} label="MVP" icon={Star} color="text-purple-400" value={draft.id_mvp} onChange={(val) => setDraft({ ...draft, id_mvp: val })} />
                        <PlayerSelect players={players} label="Artilheiro" icon={Target} color="text-red-400" value={draft.id_artilheiro} onChange={(val) => setDraft({ ...draft, id_artilheiro: val })} />
                        <PlayerSelect players={players} label="Assistência" icon={Zap} color="text-green-400" value={draft.id_assistencia} onChange={(val) => setDraft({ ...draft, id_assistencia: val })} />
                    </div>
                </div>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-3xl p-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3 mb-6">Seleção do Campeonato</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-center text-blue-400">GK</p>
                        <PlayerSelect players={players} label="TOP 1" value={draft.id_top1_gk} onChange={(v) => setDraft({ ...draft, id_top1_gk: v })} />
                        <PlayerSelect players={players} label="TOP 2" value={draft.id_top2_gk} onChange={(v) => setDraft({ ...draft, id_top2_gk: v })} />
                        <PlayerSelect players={players} label="TOP 3" value={draft.id_top3_gk} onChange={(v) => setDraft({ ...draft, id_top3_gk: v })} />
                    </div>
                    <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-center text-amber-400">ZAG</p>
                        <PlayerSelect players={players} label="TOP 1" value={draft.id_top1_zag} onChange={(v) => setDraft({ ...draft, id_top1_zag: v })} />
                        <PlayerSelect players={players} label="TOP 2" value={draft.id_top2_zag} onChange={(v) => setDraft({ ...draft, id_top2_zag: v })} />
                        <PlayerSelect players={players} label="TOP 3" value={draft.id_top3_zag} onChange={(v) => setDraft({ ...draft, id_top3_zag: v })} />
                    </div>
                    <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-center text-green-400">MID</p>
                        <PlayerSelect players={players} label="TOP 1" value={draft.id_top1_mid} onChange={(v) => setDraft({ ...draft, id_top1_mid: v })} />
                        <PlayerSelect players={players} label="TOP 2" value={draft.id_top2_mid} onChange={(v) => setDraft({ ...draft, id_top2_mid: v })} />
                        <PlayerSelect players={players} label="TOP 3" value={draft.id_top3_mid} onChange={(v) => setDraft({ ...draft, id_top3_mid: v })} />
                    </div>
                    <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-center text-red-400">ATK</p>
                        <PlayerSelect players={players} label="TOP 1" value={draft.id_top1_atk} onChange={(v) => setDraft({ ...draft, id_top1_atk: v })} />
                        <PlayerSelect players={players} label="TOP 2" value={draft.id_top2_atk} onChange={(v) => setDraft({ ...draft, id_top2_atk: v })} />
                        <PlayerSelect players={players} label="TOP 3" value={draft.id_top3_atk} onChange={(v) => setDraft({ ...draft, id_top3_atk: v })} />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
                <div className={`bg-[#0f111a] border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-300 ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest pl-4">Alterações pendentes</span>
                    <div className="flex gap-2">
                        <button onClick={() => setDraft(original)} className="px-4 py-2 text-[10px] font-black text-slate-500 hover:text-white uppercase">Descartar</button>
                        <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Salvar Mudanças
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}