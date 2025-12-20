import Image from "next/image";
import LogoRebug from "@/public/logods2.ico";

export default function TelaCarregamento() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-blue-900/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-900/10 blur-[140px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-600/30 blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-full border border-white/10 shadow-xl">
            <Image
              src={LogoRebug}
              alt="Rebug"
              width={80}
              height={80}
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm tracking-widest text-slate-400 uppercase">
            Carregando Ranking
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Preparando os dados...
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-150" />
          <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}
