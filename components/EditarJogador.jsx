"use client";

export default function EditableCell({ value, onChange }) {
    return (
        <div className="relative group">
            <input
                type="number"
                value={value ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="
          w-full bg-[#050505] text-center font-mono text-sm font-bold text-slate-200
          border border-white/10 rounded-md py-2
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none
          transition-all duration-200
          group-hover:border-white/20
        "
            />
            <div className="absolute inset-0 rounded-md pointer-events-none border border-transparent group-hover:border-white/5 transition-colors" />
        </div>
    );
}