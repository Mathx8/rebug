"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";
import { LogOut } from "lucide-react";
import Login from "@/components/Login";
import PlayerSelect from "@/components/EscolheJogador";
import RankingEditor from "@/components/RankingEditor";

export default function AdminRankingPage() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoadingAuth(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("dados")
      .select("ID, Nome, Nick")
      .order('Nick', { ascending: true })
      .then(({ data }) => setPlayers(data || []));
  }, [user]);

  useEffect(() => {
    if (!selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayer(null);
      return;
    }
    supabase
      .from("dados")
      .select("*")
      .eq("ID", selectedId)
      .single()
      .then(({ data }) => setPlayer(data));
  }, [selectedId]);

  const handleSaveToDb = async (updatedPlayerData) => {
    if (!updatedPlayerData) return;
    setSaving(true);
    const { error } = await supabase
      .from("dados")
      .update(updatedPlayerData)
      .eq("ID", updatedPlayerData.ID);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      setPlayer(updatedPlayerData);
    }
    setSaving(false);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 pb-20">
      <div className="border-b border-white/5 bg-[#0f111a]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-xl font-black text-white tracking-wide">ADMIN <span className="text-slate-500 font-normal">PANEL</span></h1>
          </div>

          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Editor de Ranking</h2>
            <p className="text-sm text-slate-500">Gerencie estatísticas dos jogadores.</p>
          </div>
          <PlayerSelect players={players} value={selectedId} onChange={setSelectedId} />
        </div>
        <RankingEditor player={player} onSaveToDb={handleSaveToDb} saving={saving} />
      </div>
    </div>
  );
}