"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Medal, Crown, Star, GraduationCap, X, Trophy, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import LogoRebug from "@/public/logods2.ico";
import { supabase } from "@/lib/supabase";
import { calcularPontuacao } from "@/lib/calcPontuacao";
import TelaCarregamento from "./TelaCarregamento";

const ITEMS_PER_PAGE = 10;

export default function Ranking() {
    const [ranking, setRanking] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedCareer, setSelectedCareer] = useState(null);

    const n = (v) => Number(v ?? 0);

    useEffect(() => {
        async function fetchRanking() {
            setLoading(true);
            const { data, error } = await supabase
                .from("public_ranking")
                .select("*")
                .gt("pontos", 0);

            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            const sorted = data
                .map((p) => ({
                    ...p,
                    pontos: calcularPontuacao(p),
                }))
                .sort((a, b) => b.pontos - a.pontos)
                .map((p, index) => ({
                    ...p,
                    pos: index + 1,
                }));

            setRanking(sorted);
            setLoading(false);
        }
        fetchRanking();
    }, []);

    const totalPages = Math.ceil(ranking.length / ITEMS_PER_PAGE);
    const paginatedRanking = ranking.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const getRankConfig = (pos) => {
        if (pos === 1) return { bg: "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500", text: "text-yellow-400", icon: <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400/20" /> };
        if (pos === 2) return { bg: "bg-gradient-to-r from-slate-300/10 to-transparent border-l-4 border-slate-300", text: "text-slate-200", icon: <Medal className="w-5 h-5 text-slate-300" /> };
        if (pos === 3) return { bg: "bg-gradient-to-r from-orange-700/10 to-transparent border-l-4 border-orange-700", text: "text-orange-400", icon: <Medal className="w-5 h-5 text-orange-600" /> };
        return { bg: "border-l-4 border-transparent hover:bg-slate-800/40 border-b border-slate-800/50", text: "text-slate-400", icon: <span className="text-xs font-mono text-slate-600">#{pos}</span> };
    };

    if (loading) return <TelaCarregamento />;

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 p-4 md:p-10 flex flex-col items-center font-sans selection:bg-yellow-500/30">

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-900/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <header className="w-full max-w-7xl flex items-center justify-between mb-12 relative z-30">
                <div className="flex items-center gap-3">
                    <div className="text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">
                            RANKING <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm">REBUG</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="h-1 w-12 bg-yellow-600 rounded-full" />
                            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Classificação oficial dos campeões</p>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center gap-2 md:gap-4">
                    <Link
                        href="/campeonatos"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 md:px-6 rounded-2xl border border-white/10 transition-all active:scale-95 group shadow-xl"
                    >
                        <Trophy size={18} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Campeonatos</span>
                    </Link>
                </nav>
            </header>

            {selectedCareer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all">
                    <div className="bg-[#0f111a] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setSelectedCareer(null)} className="absolute top-5 right-5 text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={20} /></button>

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative mb-4">
                                <div className="absolute -inset-1 bg-blue-500 blur opacity-30 rounded-full"></div>
                                <img src={`https://hubbe.biz/avatar/${selectedCareer.nick}?img_format=png&headonly=2`} className="relative w-20 h-20 rounded-full bg-slate-800 border-2 border-white/10 shadow-2xl" alt="" />
                            </div>
                            <h3 className="font-black text-white text-xl uppercase tracking-tight">{selectedCareer.nome}</h3>
                            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Carreira Academy</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Títulos</p>
                                <p className="text-white font-black text-lg">{n(selectedCareer.titulos_academy)}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Vices</p>
                                <p className="text-white font-black text-lg">{n(selectedCareer.vices_academy)}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">MVP</p>
                                <p className="text-amber-500 font-black text-lg">{n(selectedCareer.mvp_academy)}</p>
                            </div>
                        </div>

                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 flex justify-around items-center shadow-inner">
                            <div className="flex flex-col items-center gap-1.5">
                                <Medal className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                                <div className="text-center">
                                    <span className="text-white font-black text-sm block">{n(selectedCareer.t1_academy)}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Top 1</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col items-center gap-1.5">
                                <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.3)]" />
                                <div className="text-center">
                                    <span className="text-white font-black text-sm block">{n(selectedCareer.t2_academy)}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Top 2</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col items-center gap-1.5">
                                <Medal className="w-5 h-5 text-orange-600 drop-shadow-[0_0_8px_rgba(234,88,12,0.3)]" />
                                <div className="text-center">
                                    <span className="text-white font-black text-sm block">{n(selectedCareer.t3_academy)}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Top 3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl bg-[#0f111a]/70 rounded-3xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="grid grid-cols-12 gap-2 px-4 md:px-6 py-5 bg-[#0a0a0c] text-[9px] md:text-xs font-bold uppercase text-slate-500 border-b border-white/5">
                    <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                    <div className="col-span-4 md:col-span-3">Jogador</div>
                    <div className="col-span-1 text-center font-black text-blue-400/80">
                        <span className="md:hidden" title="Títulos">T</span>
                        <span className="hidden md:inline">Títulos</span>
                    </div>
                    <div className="col-span-1 hidden md:block text-center">Vices</div>
                    <div className="col-span-1 text-center font-black text-amber-500/80">
                        <span className="md:hidden" title="MVP">M</span>
                        <span className="hidden md:inline">MVP</span>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center justify-center gap-5">
                        <Medal className="w-3.5 h-3.5 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]" title="Top 1" />
                        <Medal className="w-3.5 h-3.5 text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.2)]" title="Top 2" />
                        <Medal className="w-3.5 h-3.5 text-orange-600 drop-shadow-[0_0_5px_rgba(234,88,12,0.2)]" title="Top 3" />
                    </div>
                    <div className="col-span-2 md:col-span-2 flex items-center justify-center uppercase tracking-tighter">
                        <GraduationCap size={12} className="md:hidden" title="Academy" />
                        <span className="hidden md:inline">Academy</span>
                    </div>
                    <div className="col-span-2 md:col-span-1 text-right">Pts</div>
                </div>

                {paginatedRanking.map((player) => {
                    const style = getRankConfig(player.pos);
                    const hasAcademy = (n(player.titulos_academy) + n(player.vices_academy) + n(player.mvp_academy) + n(player.t1_academy) + n(player.t2_academy) + n(player.t3_academy)) > 0;

                    return (
                        <div key={player.pos} className={`grid grid-cols-12 gap-2 px-4 md:px-6 py-4 items-center transition-all ${style.bg}`}>
                            <div className="col-span-2 md:col-span-1 flex justify-center">{style.icon}</div>

                            <div className="col-span-4 md:col-span-3 flex items-center gap-2 md:gap-3 shrink-0">
                                <div className="relative shrink-0">
                                    {player.pos <= 3 && (
                                        <div className={`absolute -inset-[1px] rounded-full blur-[2px] opacity-70 ${player.pos === 1 ? 'bg-yellow-500' : player.pos === 2 ? 'bg-slate-300' : 'bg-orange-700'}`} />
                                    )}
                                    <img src={`https://hubbe.biz/avatar/${player.nick}?img_format=png&headonly=2`} className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 object-cover ring-2 ring-[#0f111a]" alt="" />
                                </div>
                                <div className="truncate">
                                    <div className="font-bold text-white truncate">{player.nome}</div>
                                    <div className="text-xs text-slate-500 truncate">@{player.nick}</div>
                                </div>
                            </div>

                            <div className="col-span-1 text-center font-black text-white text-[11px] md:text-sm">{player.titulos || "0"}</div>
                            <div className="col-span-1 hidden md:block text-center text-slate-500 font-medium">{player.vices || "0"}</div>

                            <div className="col-span-1 text-center flex justify-center">
                                {n(player.mvp) > 0 ? (
                                    <span className="text-amber-500 font-black text-[11px] md:text-sm flex items-center gap-0.5">
                                        <Star size={10} fill="currentColor" className="md:w-3 md:h-3" />{player.mvp}
                                    </span>
                                ) : <span className="text-slate-700">-</span>}
                            </div>

                            <div className="col-span-2 hidden md:flex items-center justify-center gap-3 text-xs text-slate-500 font-mono">
                                <div className="flex flex-col items-center" title="Top 1">
                                    <span className={player.top1 > 0 ? "text-white font-bold" : "text-slate-700"}>
                                        {player.top1 > 0 ? player.top1 : "-"}
                                    </span>
                                </div>

                                <div className="w-px h-6 bg-slate-800/50" />

                                <div className="flex flex-col items-center" title="Top 2">
                                    <span className={player.top2 > 0 ? "text-white font-bold" : "text-slate-700"}>
                                        {player.top2 > 0 ? player.top2 : "-"}
                                    </span>
                                </div>

                                <div className="w-px h-6 bg-slate-800/50" />

                                <div className="flex flex-col items-center" title="Top 3">
                                    <span className={player.top3 > 0 ? "text-white font-bold" : "text-slate-700"}>
                                        {player.top3 > 0 ? player.top3 : "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-2 text-center flex justify-center">
                                {hasAcademy ? (
                                    <button
                                        onClick={() => setSelectedCareer(player)}
                                        className="flex items-center justify-center gap-1 bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[8px] md:text-[10px] font-black uppercase px-2 py-1.5 md:py-1 rounded-lg transition-all border border-blue-500/20 active:scale-90 cursor-pointer"
                                    >
                                        <GraduationCap className="shrink-0 size-3 md:size-4" />
                                    </button>
                                ) : <span className="text-slate-600 text-[9px] font-bold">-</span>}
                            </div>

                            <div className="col-span-2 md:col-span-1 text-right">
                                <div className={`font-mono text-xs md:text-lg font-black tracking-tight ${style.text}`}>{player.pontos}</div>
                                <div className="text-[7px] md:text-[8px] text-slate-600 font-bold uppercase leading-none">Pts</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-8 px-4 w-full max-w-7xl">
                <div className="text-[9px] md:text-[10px] text-slate-600 uppercase tracking-widest text-center md:text-left opacity-50">
                    Dados contabilizados a partir de 2022.
                </div>
                <div className="flex items-center gap-1 bg-[#0f111a]/80 backdrop-blur border border-white/5 rounded-full px-2 py-1 shadow-xl">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white disabled:opacity-20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">‹</button>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-900/40">{page}</div>
                    <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white disabled:opacity-20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition">›</button>
                </div>
            </div>
        </div>
    );
}