"use client";
import { X, ImagePlus, Shield } from "lucide-react";
import DataSelect from "../EscolheJogador";
import { useState } from "react";

export default function NovoTime({
    isOpen,
    onClose,
    newTeam,
    setNewTeam,
    onSubmit,
    saving,
    players
}) {
    const [preview, setPreview] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewTeam({ ...newTeam, imagem: file }); // Guardamos o arquivo bruto para o upload
            setPreview(URL.createObjectURL(file)); // Criamos uma prévia visual
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f111a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                <button
                    onClick={() => { setPreview(null); onClose(); }}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Novo Time</h3>
                <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Adicione um novo time ao sistema</p>

                <form onSubmit={onSubmit} className="space-y-5">

                    {/* SELETOR DE IMAGEM / ESCUDO */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <label className="group relative cursor-pointer">
                            <div className="h-24 w-24 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-500/50">
                                {preview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-600 group-hover:text-blue-500 transition-colors">
                                        <ImagePlus size={24} />
                                        <span className="text-[8px] font-black uppercase mt-1">Escudo</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <Shield size={20} className="text-white" />
                                </div>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="text-[9px] text-slate-600 mt-2 uppercase font-black tracking-widest">Clique para selecionar</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Time</label>
                        <input
                            required
                            type="text"
                            value={newTeam.nome || ""}
                            onChange={(e) => setNewTeam({ ...newTeam, nome: e.target.value })}
                            placeholder="Ex: 1Q Team"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dono / Responsável</label>
                        <DataSelect
                            items={players}
                            value={newTeam.dono}
                            onChange={(val) => setNewTeam({ ...newTeam, dono: val })}
                            placeholder="Selecione o dono do time..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ano de Atividade</label>
                        <input
                            required
                            type="number"
                            value={newTeam.ano || ""}
                            onChange={(e) => setNewTeam({ ...newTeam, ano: e.target.value })}
                            placeholder="Ex: 2024"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-xl transition-all mt-4 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? "Fazendo Upload..." : "Criar Time"}
                    </button>
                </form>
            </div>
        </div>
    );
}