"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Users, Star, Target, ChevronRight, ArrowLeft, Shield, X, Medal, Triangle, Handshake, Hand, Shirt, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase.js";

export default function CampeonatosPage() {
    const [campeonatos, setCampeonatos] = useState([]);
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [campTeams, setCampTeams] = useState([]);

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [roster, setRoster] = useState([]);
    const [loadingRoster, setLoadingRoster] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchCampeonatos();
    }, []);

    async function fetchCampeonatos() {
        setLoading(true);
        const { data } = await supabase
            .from("campeonatos")
            .select(`
                *,
                campeonato_times(id_time(escudo_url)),
                campeao:id_campeao(nome, escudo_url),
                vice:id_vice(nome, escudo_url),
                mvp:id_mvp(nick),
                artilheiro:id_artilheiro(nick),
                garcom:id_assistencia(nick),
                luva:id_top1_gk(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top2_gk:id_top2_gk(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top3_gk:id_top3_gk(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top1_zag:id_top1_zag(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top2_zag:id_top2_zag(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top3_zag:id_top3_zag(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top1_mid:id_top1_mid(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top2_mid:id_top2_mid(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top3_mid:id_top3_mid(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top1_atk:id_top1_atk(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top2_atk:id_top2_atk(id, nick, time_jogadores(id_time(id, nome, escudo_url))),
                top3_atk:id_top3_atk(id, nick, time_jogadores(id_time(id, nome, escudo_url)))
            `)
            .order('data', { ascending: false });

        setCampeonatos(data || []);
        setLoading(false);
    }


    async function fetchDetails(camp) {
        setSelectedCamp(camp);
        const { data } = await supabase
            .from("campeonato_times")
            .select("time:id_time(id, nome, escudo_url)")
            .eq("id_campeonato", camp.id);

        const sortedTeams = (data?.map(item => item.time) || []).sort((a, b) =>
            a.nome.localeCompare(b.nome)
        );

        setCampTeams(sortedTeams || []);
    }

    async function fetchTeamRoster(time) {
        setSelectedTeam(time);
        setLoadingRoster(true);
        const { data } = await supabase
            .from("time_jogadores")
            .select(`*, jogadores:id_jogador(id, nome, nick)`)
            .eq("id_time", time.id);

        setRoster(data || []);
        setLoadingRoster(false);
    }

    const getRandomShields = (campTimesLink, count = 3) => {
        if (!campTimesLink || campTimesLink.length === 0) return [];

        const shields = campTimesLink
            .map(item => item.id_time?.escudo_url)
            .filter(url => url);

        return [...shields].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#07080d] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#07080d] text-white p-4 md:p-12">

            {selectedTeam && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0f111a] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <img src={selectedTeam.escudo_url} className="w-12 h-12 object-contain" alt="" />
                                <div>
                                    <h3 className="font-black italic uppercase text-2xl leading-none">{selectedTeam.nome}</h3>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Elenco da Temporada</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {loadingRoster ? (
                                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roster.map(player => (
                                        <div key={player.id} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/5">
                                                <img
                                                    src={`https://hubbe.biz/avatar/${player.jogadores.nick}?img_format=png&headonly=2`}
                                                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm truncate uppercase tracking-tight">{player.jogadores.nome}</p>
                                                <p className="text-[10px] text-blue-400 font-black uppercase opacity-70 italic tracking-tighter">@{player.jogadores.nick}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    {!selectedCamp ? (
                        <div className="w-full max-w-7xl flex items-center justify-between space-y-2 cursor-default select-none">
                            <div className="text-center relative z-10">
                                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tighter">
                                    COPAS <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-sm">REBUG</span>
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-12 bg-yellow-600 rounded-full" />
                                    <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Histórico de Glórias</p>
                                </div>
                            </div>

                            <nav className="flex items-center gap-2 md:gap-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 md:px-6 rounded-2xl border border-white/10 transition-all active:scale-95 group shadow-xl">
                                    <LayoutDashboard size={16} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Ranking</span>
                                </Link>
                            </nav>
                        </div>

                    ) : (
                        <button
                            onClick={() => setSelectedCamp(null)}
                            className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group py-2 cursor-pointer"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Outros Campeonatos</span>
                        </button>
                    )}
                </header>

                {!selectedCamp ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {campeonatos.map((camp) => (
                            <div
                                key={camp.id}
                                onClick={() => fetchDetails(camp)}
                                className="group relative bg-[#0f111a] border border-white/5 rounded-[32px] overflow-hidden cursor-pointer hover:border-blue-500/40 transition-all hover:translate-y-[-4px]"
                            >
                                <div className="p-8 relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 shadow-2xl group-hover:border-blue-500/20 transition-colors">
                                            <img src={camp.logo_url} alt="" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${camp.tier === '1' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                            {camp.tier === '1' ? 'Tier S' : 'Academy'}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl font-black mb-1 uppercase italic leading-none group-hover:text-blue-500 transition-colors">{camp.nome}</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Temporada Oficial</p>

                                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                                        <div className="flex -space-x-3">
                                            {getRandomShields(camp.campeonato_times).length > 0 ? (
                                                getRandomShields(camp.campeonato_times).map((url, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-white/[0.03] border-2 border-[#0f111a] flex items-center justify-center overflow-hidden shadow-lg">
                                                        <img src={url} className="w-5 h-5 object-contain" alt="" />
                                                    </div>
                                                ))
                                            ) : (
                                                [1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0f111a] flex items-center justify-center">
                                                        <Users size={12} className="text-slate-600" />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                            Ver Competição
                                        </span>
                                        <ChevronRight size={16} className="text-blue-500 ml-auto group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* COLUNA ESQUERDA */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-[#0f111a] border border-white/5 rounded-[48px] p-8 md:p-12 relative overflow-hidden shadow-2xl space-y-8">
                                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />

                                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img src={selectedCamp.logo_url} className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10" alt="" />
                                        </div>

                                        <div className="flex-1 text-center md:text-left cursor-default">
                                            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8 select-none">
                                                {selectedCamp.nome}
                                            </h2>

                                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                                                    <Triangle size={20} className="text-blue-500" />
                                                    <span className="font-black uppercase italic text-lg text-white">TIER S</span>
                                                </div>
                                                <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                                                    <Users size={20} className="text-blue-500" />
                                                    <span className="font-bold text-lg">{campTeams.length} <span className="text-slate-500 text-xs uppercase font-black ml-1">Times</span></span>
                                                </div>
                                                <div className="bg-amber-500/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-3">
                                                    <Trophy size={20} className="text-amber-500" />
                                                    <span className="font-black uppercase italic text-lg text-amber-500">
                                                        {selectedCamp.campeao?.nome || 'Em disputa'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">
                                            Equipes Participantes
                                        </p>

                                        <div className="relative overflow-hidden flex hover-pause group/marquee">
                                            <div className="flex whitespace-nowrap animate-marquee-slow items-center gap-16 pr-12 py-4">
                                                {campTeams.map(time => (
                                                    <div
                                                        key={`t1-${time.id}`}
                                                        onClick={() => fetchTeamRoster(time)}
                                                        title={time.nome}
                                                        className="flex flex-col items-center gap-2 group/team cursor-pointer min-w-[60px]"
                                                    >
                                                        <div className="w-12 h-12 flex items-center justify-center relative">
                                                            <img
                                                                src={time.escudo_url}
                                                                className="w-full h-full object-contain relative z-10 group-hover/team:scale-125 group-hover/team:-translate-y-1 transition-all duration-300 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                                alt={time.nome}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/team:text-blue-400 transition-colors">
                                                            {time.nome.substring(0, 3)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="absolute top-0 flex whitespace-nowrap animate-marquee2-slow items-center gap-16 pr-12 py-4">
                                                {campTeams.map(time => (
                                                    <div
                                                        key={`t2-${time.id}`}
                                                        onClick={() => fetchTeamRoster(time)}
                                                        title={time.nome}
                                                        className="flex flex-col items-center gap-2 group/team cursor-pointer min-w-[60px]"
                                                    >
                                                        <div className="w-12 h-12 flex items-center justify-center relative">
                                                            <img
                                                                src={time.escudo_url}
                                                                className="w-full h-full object-contain relative z-10 group-hover/team:scale-125 group-hover/team:-translate-y-1 transition-all duration-300 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                                alt={time.nome}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/team:text-blue-400 transition-colors">
                                                            {time.nome.substring(0, 3)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* COLUNA DIREITA */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-b from-[#0f111a] to-[#07080d] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-10 flex items-center gap-3">
                                        <Medal size={18} /> Resumo da Glória
                                    </h4>
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <PodiumItem team={selectedCamp.campeao} label="Campeão" color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
                                            <PodiumItem team={selectedCamp.vice} label="Vice-Campeão" color="text-slate-400" bg="bg-white/5" border="border-white/10" />
                                        </div>
                                        <AwardItem icon={Star} label="Melhor Jogador (MVP)" name={selectedCamp.mvp?.nick} color="text-purple-400" bg="bg-purple-400/10" />
                                        <AwardItem icon={Target} label="Artilheiro" name={selectedCamp.artilheiro?.nick} color="text-red-400" bg="bg-red-400/10" />
                                        <AwardItem icon={Handshake} label="Rei das Assistências" name={selectedCamp.garcom?.nick} color="text-green-400" bg="bg-green-400/10" />
                                        <AwardItem icon={Hand} label="Luva de Ouro" name={selectedCamp.luva?.nick} color="text-amber-400" bg="bg-amber-400/10" />
                                    </div>
                                </div>

                            </div>

                            <div className="col-span-1 md:col-span-1 lg:col-span-3">
                                <div className="bg-[#0f111a] border border-white/5 rounded-[40px] p-8 md:p-10">
                                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-10 flex items-center gap-3">
                                        <Star size={18} fill="currentColor" /> Dream Team Oficial
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                        <PositionGroup title="Goleiros" icon={Hand} color="amber" top1={selectedCamp.luva} top2={selectedCamp.top2_gk} top3={selectedCamp.top3_gk} participantTeamIds={campTeams.map(t => t.id)} />
                                        <PositionGroup title="Zagueiros" icon={Shield} color="blue" top1={selectedCamp.top1_zag} top2={selectedCamp.top2_zag} top3={selectedCamp.top3_zag} participantTeamIds={campTeams.map(t => t.id)} />
                                        <PositionGroup title="Meio-Campo" icon={Shirt} color="green" top1={selectedCamp.top1_mid} top2={selectedCamp.top2_mid} top3={selectedCamp.top3_mid} participantTeamIds={campTeams.map(t => t.id)} />
                                        <PositionGroup title="Atacantes" icon={Target} color="red" top1={selectedCamp.top1_atk} top2={selectedCamp.top2_atk} top3={selectedCamp.top3_atk} participantTeamIds={campTeams.map(t => t.id)} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- COMPONENTES AUXILIARES ---

function PositionGroup({ title, icon: Icon, color, top1, top2, top3, participantTeamIds }) {
    const colors = {
        amber: "from-amber-500/20 text-amber-500 border-amber-500/20",
        blue: "from-blue-500/20 text-blue-500 border-blue-500/20",
        green: "from-green-500/20 text-green-500 border-green-500/20",
        red: "from-red-500/20 text-red-500 border-red-500/20"
    };

    const getShield = (player) => {
        if (!player?.time_jogadores || !participantTeamIds) return null;

        const correctTimeLink = player.time_jogadores.find(link =>
            participantTeamIds.includes(link.id_time?.id)
        );

        return correctTimeLink?.id_time?.escudo_url;
    };

    return (
        <div className="flex flex-col gap-4 cursor-default">
            <div className="flex items-center gap-2 px-1">
                <Icon size={14} className="text-slate-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</span>
            </div>

            <div className={`relative bg-gradient-to-br ${colors[color]} border rounded-[24px] p-5 h-40 overflow-hidden group transition-all hover:scale-[1.03] shadow-lg flex flex-col justify-between`}>
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                    <Icon size={120} />
                </div>

                <div className="relative z-20 flex items-center justify-between">
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/5">TOP 1</span>
                    {getShield(top1) ? (
                        <img
                            src={getShield(top1)}
                            className="w-6 h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            alt="Time"
                            title={top1?.time_jogadores ? top1.time_jogadores.find(link => participantTeamIds.includes(link.id_time?.id))?.id_time?.nome : ''}
                        />
                    ) : (
                        <Trophy size={14} className="opacity-30" />
                    )}
                </div>

                <div className="relative z-20 h-full w-full flex items-end" title={top1?.nick || '---'}>
                    <div className="w-[80%] h-[90%] min-w-0 items-end">
                        <h3 className="text-2xl font-black italic leading-[1] break-all drop-shadow-2xl opacity-90 group-hover:scale-105 transition-transform origin-left">
                            {top1?.nick || "---"}
                        </h3>
                    </div>

                    {top1?.nick && (
                        <div className="absolute -right-5 -bottom-5 w-28 h-28 z-30 pointer-events-none drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-500">
                            <img
                                src={`https://hubbe.biz/avatar/${top1.nick}?img_format=png&headonly=2`}
                                className="w-full h-full object-contain"
                                alt=""
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {[
                    { rank: "02", player: top2 },
                    { rank: "03", player: top3 }
                ].map((item, idx) => (
                    <div key={idx} className="group/row flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all" title={item.player?.nick || '---'}>
                        <span className="text-[10px] font-black text-slate-600 group-hover/row:text-blue-500">{item.rank}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0">
                            {item.player?.nick && <img src={`https://hubbe.biz/avatar/${item.player.nick}?img_format=png&headonly=2`} className="w-full h-full object-cover scale-125" alt="" />}
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover/row:text-white truncate flex-1">
                            {item.player?.nick || "---"}
                        </span>
                        {getShield(item.player) ? (
                            <img
                                src={getShield(item.player)}
                                className="w-6 h-6 object-contain drop-shadow-md"
                                alt="Escudo do Time"
                                title={item.player?.time_jogadores ? item.player.time_jogadores.find(link => participantTeamIds.includes(link.id_time?.id))?.id_time?.nome : ''}
                            />
                        ) : (
                            <Trophy size={14} className="opacity-30" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AwardItem({ icon: Icon, label, name, color, bg }) {
    return (
        <div className="flex items-center gap-5 group cursor-default">
            <div className="relative">
                <div className={`w-16 h-16 rounded-[20px] rounded-tr-[0px] ${bg} flex items-center justify-center ${color} border border-white/5 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-xl`}>
                    {name ? (
                        <img src={`https://hubbe.biz/avatar/${name}?img_format=png&headonly=2`} className="w-full h-full object-cover scale-110 mt-2" alt="" />
                    ) : (
                        <Icon size={24} className="opacity-20" />
                    )}
                </div>
                <div className={`absolute -right-0 -top-0 w-6 h-6 rounded-lg rounded-tr-[0px] ${bg} border border-white/10 flex items-center justify-center ${color} shadow-lg`}>
                    <Icon size={12} />
                </div>
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-xl font-black uppercase italic leading-none group-hover:text-white transition-colors truncate">
                    {name || '---'}
                </p>
            </div>
        </div>
    );
}

function PodiumItem({ team, label, color, bg, border }) {
    return (
        <div className="flex items-center gap-5 group cursor-default">
            <div className="relative">
                <div className={`w-16 h-16 rounded-[20px] rounded-tr-[0px] ${bg} flex items-center justify-center border ${border} group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-xl`}>
                    {team?.escudo_url ? (
                        <img
                            src={team.escudo_url}
                            className="w-10 h-10 object-contain drop-shadow-md"
                            alt=""
                        />
                    ) : (
                        <div className={`text-xl font-black opacity-20 ${color}`}>?</div>
                    )}
                </div>

                <div className={`absolute -right-0 -top-0 w-7 h-7 rounded-lg rounded-tr-[0px] ${bg} border ${border} flex items-center justify-center shadow-lg`}>
                    <span className={`text-[12px] font-black italic ${color}`}>
                        <Medal size={12} />
                    </span>
                </div>
            </div>

            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                    {label}
                </p>
                <p className="text-xl font-black uppercase italic leading-none group-hover:text-white transition-colors truncate">
                    {team?.nome || 'A definir'}
                </p>
            </div>
        </div>
    );
}

function Loader2(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}