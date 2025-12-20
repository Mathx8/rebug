"use client";

/* eslint-disable @next/next/no-img-element */
import { Medal, Crown, Star } from "lucide-react";
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

    useEffect(() => {
        async function fetchRanking() {
            setLoading(true);

            const { data, error } = await supabase
                .from("public_ranking")
                .select("*");

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

    const paginatedRanking = ranking.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const getRankConfig = (pos) => {
        if (pos === 1)
            return {
                bg: "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500",
                text: "text-yellow-400",
                icon: <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />,
            };
        if (pos === 2)
            return {
                bg: "bg-gradient-to-r from-slate-300/10 to-transparent border-l-4 border-slate-300",
                text: "text-slate-200",
                icon: <Medal className="w-5 h-5 text-slate-300" />,
            };
        if (pos === 3)
            return {
                bg: "bg-gradient-to-r from-orange-700/10 to-transparent border-l-4 border-orange-700",
                text: "text-orange-400",
                icon: <Medal className="w-5 h-5 text-orange-600" />,
            };

        return {
            bg: "border-l-4 border-transparent hover:bg-slate-800/40 border-b border-slate-800/50",
            text: "text-slate-400",
            icon: <span className="text-xs font-mono text-slate-600">#{pos}</span>,
        };
    };
    if (loading) {
        return <TelaCarregamento />;
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-10 flex flex-col items-center font-sans selection:bg-yellow-500/30">

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-900/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-full shadow-lg border border-slate-700/50">
                    <Image src={LogoRebug} alt="Logo Rebug" width={55} height={55} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                    RANKING{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700">
                        REBUG
                    </span>
                </h1>
                <p className="text-slate-500">Classificação oficial dos campeões</p>
            </div>

            <div className="w-full max-w-6xl bg-[#0f111a]/70 rounded-2xl border border-white/5 shadow-2xl overflow-hidden">

                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-[#0a0a0c] text-xs font-bold uppercase text-slate-500">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-4">Jogador</div>
                    <div className="col-span-1 hidden md:block text-center">Títulos</div>
                    <div className="col-span-1 hidden md:block text-center">Vices</div>
                    <div className="col-span-1 hidden md:block text-center">MVP</div>
                    <div className="col-span-2 hidden md:block text-center">Estatísticas</div>
                    <div className="col-span-2 text-right">Pontuação</div>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-slate-500">
                        Carregando ranking...
                    </div>
                ) : (
                    paginatedRanking.map((player) => {
                        const style = getRankConfig(player.pos);

                        return (
                            <div
                                key={player.pos}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${style.bg}`}
                            >
                                <div className="col-span-1 flex justify-center">
                                    {style.icon}
                                </div>

                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="relative">
                                        {player.pos <= 3 && (
                                            <div className={`absolute -inset-[2px] rounded-full blur-[2px] opacity-70 ${player.pos === 1 ? 'bg-yellow-500' :
                                                player.pos === 2 ? 'bg-slate-300' : 'bg-orange-700'
                                                }`} />
                                        )}
                                        <img
                                            src={`https://hubbe.biz/avatar/${player.nick}?img_format=png&headonly=2`}
                                            alt={player.nick}
                                            className="relative w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-[#0f111a]"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white ">{player.nome}</div>
                                        <div className="text-xs text-slate-500">@{player.nick}</div>
                                    </div>
                                </div>

                                <div className="col-span-1 hidden md:block text-center">
                                    {player.titulos > 0 ? (
                                        <div className="">{player.titulos}</div>
                                    ) : (
                                        <span className="text-slate-700">-</span>
                                    )}
                                </div>
                                <div className="col-span-1 hidden md:block text-center">
                                    {player.vices > 0 ? (
                                        <div className="">{player.vices}</div>
                                    ) : (
                                        <span className="text-slate-700">-</span>
                                    )}
                                </div>

                                <div className="col-span-1 text-center hidden md:flex items-center justify-center">
                                    {player.mvp > 0 ? (
                                        <div className="flex items-center gap-1 text-blue-400 font-bold bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                                            <Star size={12} fill="currentColor" /> {player.mvp}
                                        </div>
                                    ) : (
                                        <span className="text-slate-700">-</span>
                                    )}
                                </div>

                                <div className="col-span-2 hidden md:flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
                                    <div className="flex flex-col items-center" title="Top 1">
                                        <span className="text-yellow-600/80">T1</span>
                                        {player.top1 > 0 ? (
                                            <span>{player.top1}</span>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                    <div className="w-px h-6 bg-slate-800" />
                                    <div className="flex flex-col items-center" title="Top 2">
                                        <span className="text-slate-300">T2</span>
                                        {player.top2 > 0 ? (
                                            <span>{player.top2}</span>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                    <div className="w-px h-6 bg-slate-800" />
                                    <div className="flex flex-col items-center" title="Top 3">
                                        <span className="text-orange-800/80">T3</span>
                                        {player.top3 > 0 ? (
                                            <span>{player.top3}</span>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 text-right pr-2">
                                    <div className={`font-mono text-lg md:text-xl font-black tracking-tight ${style.text}`}>
                                        {player.pontos}
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">PTS</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="flex justify-between items-center mt-6 px-4 w-full max-w-6xl">
                <div className="text-[10px] text-slate-600 uppercase tracking-widest">
                    Dados contabilizados a partir de 2022.
                </div>

                <div className="flex items-center gap-1 bg-[#0f111a]/80 backdrop-blur border border-white/5 rounded-full px-2 py-1 shadow-lg">
                    {/* Anterior */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full
                                    text-slate-400 hover:text-white hover:bg-white/5
                                    disabled:opacity-30 disabled:hover:bg-transparent
                                    transition
                                "
                    >
                        ‹
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/30 blur-md rounded-full" />
                        <div className="relative w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                            {page}
                        </div>
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className=" w-7 h-7 flex items-center justify-center rounded-full
                                    text-slate-400 hover:text-white hover:bg-white/5
                                    disabled:opacity-30 disabled:hover:bg-transparent
                                    transition
                                "
                    >
                        ›
                    </button>
                </div>
            </div>

        </div>
    );
}
