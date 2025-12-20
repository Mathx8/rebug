"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase.js";
import { LogOut, UserPlus, X } from "lucide-react";
import Login from "@/components/Login";
import PlayerSelect from "@/components/EscolheJogador";
import RankingEditor from "@/components/RankingEditor";

export default function AdminRankingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ nome: "", nick: "" });

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from("dados")
      .select("ID, Nome, Nick")
      .order('Nome', { ascending: true });
    setPlayers(data || []);
  };

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchPlayers();
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

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    if (!newPlayer.nome || !newPlayer.nick) return;

    setSaving(true);
    const { error } = await supabase
      .from("dados")
      .insert([{ Nome: newPlayer.nome, Nick: newPlayer.nick }]);

    if (error) {
      alert("Erro ao adicionar: " + error.message);
    } else {
      await fetchPlayers();
      setNewPlayer({ nome: "", nick: "" });
      setIsModalOpen(false);
    }
    setSaving(false);
  };

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
      await fetchPlayers();
    }
    setSaving(false);
  };

  const handleDeletePlayer = async (id, name) => {
    if (!confirm(`TEM CERTEZA que deseja deletar ${name}?`)) return;
    setSaving(true);
    const { error } = await supabase.from("dados").delete().eq("ID", id);
    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      setSelectedId(null);
      setPlayer(null);
      await fetchPlayers();
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 pb-20">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f111a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Novo Jogador</h3>
            <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Adicione um novo jogador ao ranking</p>

            <form onSubmit={handleCreatePlayer} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome</label>
                <input
                  required
                  type="text"
                  value={newPlayer.nome}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nome: e.target.value })}
                  placeholder="Ex: Goenji"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nick (Hubbe)</label>
                <input
                  required
                  type="text"
                  value={newPlayer.nick}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nick: e.target.value })}
                  placeholder="Ex: Levi"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 transition-all mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Criando..." : "Criar Jogador"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="border-b border-white/5 bg-[#0f111a]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-xl font-black text-white tracking-wide">ADMIN <span className="text-slate-500 font-normal">PAINEL</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase border border-blue-500/20 px-4 py-2 rounded-xl bg-blue-500/5 cursor-pointer"
            >
              <UserPlus size={14} /> Novo Jogador
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase cursor-pointer"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
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

        <RankingEditor
          player={player}
          onSaveToDb={handleSaveToDb}
          onDelete={handleDeletePlayer}
          saving={saving}
        />
      </div>
    </div>
  );
}