"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase.js";
import { LogOut, Trophy, Users, Star, UserPlus, X, ShieldPlus } from "lucide-react";
import Login from "@/components/Login";

import NovoJogador from "@/components/Creator/NovoJogador";
import NovoTime from "@/components/Creator/NovoTime";
import DataSelect from "@/components/EscolheJogador";
import RankingEditor from "@/components/Editor/RankingEditor";
import TimeEditor from "@/components/Editor/TimeEditor";

export default function AdminRankingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("ranking");

  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ nome: "", nick: "" });

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ nome: "", dono: "", ano: new Date().getFullYear() });
  const [teams, setTeams] = useState([]);

  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState(null);

  const fetchPlayers = async () => {
    const { data } = await supabase.from("dados").select("ID, Nome, Nick").order('Nome', { ascending: true });
    setPlayers(data || []);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("times")
      .select(`
        *,
        jogadores!times_dono_fkey (
          nome
        )
      `)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar times:", error.message);
      return;
    }

    setTeams(data || []);
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
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPlayers();
      fetchTeams();
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!selectedId) { setPlayer(null); return; }
    supabase.from("dados").select("*").eq("ID", selectedId).single().then(({ data }) => setPlayer(data));
  }, [selectedId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!selectedTeamId) { setSelectedTeamData(null); return; }
    supabase.from("times").select("*").eq("id", selectedTeamId).single().then(({ data }) => setSelectedTeamData(data));
  }, [selectedTeamId]);

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
    setSaving(true);
    const { error } = await supabase.from("dados").update(updatedPlayerData).eq("ID", updatedPlayerData.ID);
    if (error) alert("Erro: " + error.message);
    else { setPlayer(updatedPlayerData); await fetchPlayers(); }
    setSaving(false);
  };

  const handleUpdateTeam = async (updatedTeam) => {
    setSaving(true);
    const { error } = await supabase
      .from("times")
      .update({
        nome: updatedTeam.nome,
        dono: updatedTeam.dono,
        ano: updatedTeam.ano,
        escudo_url: updatedTeam.escudo_url
      })
      .eq("id", updatedTeam.id);

    if (error) alert("Erro: " + error.message);
    else {
      setSelectedTeamData(updatedTeam);
      await fetchTeams();
    }
    setSaving(false);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.nome || !newTeam.dono) return;

    setSaving(true);
    let publicUrl = null;

    try {
      if (newTeam.imagem) {
        const file = newTeam.imagem;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('escudos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('escudos').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }

      const { error: dbError } = await supabase
        .from("times")
        .insert([{
          nome: newTeam.nome,
          dono: parseInt(newTeam.dono),
          ano: parseInt(newTeam.ano),
          escudo_url: publicUrl
        }]);

      if (dbError) throw dbError;

      alert("Time criado com sucesso!");
      setNewTeam({ nome: "", dono: "", ano: new Date().getFullYear(), imagem: null });
      setIsTeamModalOpen(false);
      fetchTeams();

    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loadingAuth) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div></div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 pb-20">

      <NovoJogador
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPlayer={newPlayer}
        setNewPlayer={setNewPlayer}
        onSubmit={handleCreatePlayer}
        saving={saving}
      />

      <NovoTime
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        newTeam={newTeam}
        setNewTeam={setNewTeam}
        onSubmit={handleCreateTeam}
        players={players}
        saving={saving}
      />

      <div className="border-b border-white/5 bg-[#0f111a]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <h1 className="text-xl font-black text-white tracking-wide">ADMIN <span className="text-slate-500 font-normal">PAINEL</span></h1>
            </div>
            <nav className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab("ranking")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'ranking' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <Star size={14} /> Ranking
              </button>
              <button
                onClick={() => setActiveTab("times")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'times' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <Users size={14} /> Times
              </button>
              <button
                onClick={() => setActiveTab("campeonatos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'campeonatos' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <Trophy size={14} /> Campeonatos
              </button>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase flex items-center gap-2">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {activeTab === "ranking" && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">RANKING</h2>
                <p className="text-sm text-slate-500">Gerencie estatísticas dos jogadores.</p>
              </div>

              <div className="flex items-center gap-3">
                <DataSelect
                  items={players}
                  value={selectedId}
                  onChange={setSelectedId}
                  placeholder="Selecione um jogador para editar..."
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  title="Novo Jogador"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest p-4 rounded-xl transition-all shadow-lg cursor-pointer h-[42px]"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            </div>

            <RankingEditor
              player={player}
              onSaveToDb={handleSaveToDb}
              onDelete={async (id) => {
                if (!confirm(`Tem certeza que deseja deletar ${player.Nome}?`)) return;
                await supabase.from("dados").delete().eq("ID", id);
                setSelectedId(null);
                fetchPlayers();
              }}
              saving={saving}
            />
          </>
        )}

        {activeTab === "times" && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">TIMES</h2>
                <p className="text-sm text-slate-500">Gerencie os dados dos times.</p>
              </div>

              <div className="flex items-center gap-3">
                <DataSelect
                  items={teams.map(t => ({ ID: t.id, Nome: t.nome }))}
                  value={selectedTeamId}
                  onChange={setSelectedTeamId}
                  placeholder="Selecione um time para editar..."
                />
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  title="Novo Time"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest p-4 rounded-xl transition-all shadow-lg cursor-pointer h-[42px]"
                >
                  <ShieldPlus size={16} />
                </button>
              </div>
            </div>

            <TimeEditor
              team={selectedTeamData}
              players={players}
              onSaveToDb={handleUpdateTeam}
              onDelete={async (id, nome, escudoUrl) => {
                if (!confirm(`Deseja deletar o time ${nome}?`)) return;

                setSaving(true);
                try {
                  if (escudoUrl) {
                    const urlParts = escudoUrl.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const filePath = `logos/${fileName}`;

                    const { error: storageError } = await supabase.storage
                      .from('escudos')
                      .remove([filePath]);

                    if (storageError) console.error("Erro storage:", storageError.message);
                  }

                  const { error: dbError } = await supabase
                    .from("times")
                    .delete()
                    .eq("id", id);

                  if (dbError) throw dbError;

                  setSelectedTeamId(null);
                  fetchTeams();
                  alert("Time e escudo removidos com sucesso!");
                } catch (err) {
                  alert("Erro ao deletar: " + err.message);
                } finally {
                  setSaving(false);
                }
              }}
              saving={saving}
            />
          </>
        )}

        {activeTab === "campeonatos" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">CAMPEONATOS</h2>
              <p className="text-sm text-slate-500">Gerencie os resultados dos campeonatos.</p>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
}