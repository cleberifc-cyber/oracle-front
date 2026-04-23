"use client";

import { useState } from "react";

export default function AnalisePage() {
  const [analise, setAnalise] = useState<any>(null);
  const [imagemFinal, setImagemFinal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setAnalise(null);
    setImagemFinal(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://oracle-analises.onrender.com/analisar-print-com-desenho", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setAnalise(data.analise);
      setImagemFinal(data.imagem_processada);
    } catch (err) {
      alert("Erro ao conectar com o motor Oracle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-12 text-center">
        
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Oracle<span className="text-[#ff3333]">.AI</span> Sniper</h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.5em] mt-2">Tecnologia Vision Militar</p>
        </div>

        {!imagemFinal && !loading && (
          <div className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[50px] p-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff3333]/50 transition-all group relative">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
            <h2 className="text-2xl font-bold uppercase italic">Enviar Gráfico para IA</h2>
            <p className="text-gray-500 text-sm mt-2">O sistema vai desenhar o gatilho direto no seu print</p>
          </div>
        )}

        {loading && (
          <div className="py-24 space-y-6">
            <div className="w-20 h-20 border-4 border-[#ff3333] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#ff3333] font-black uppercase text-sm tracking-widest animate-pulse">Lendo Fluxo Institucional...</p>
          </div>
        )}

        {imagemFinal && (
          <div className="space-y-10 animate-in zoom-in duration-500 pb-20">
            <div className="relative rounded-[40px] overflow-hidden border-2 border-[#ff3333]/20 shadow-[0_0_50px_rgba(255,51,51,0.1)]">
              <img src={imagemFinal} alt="Análise Oracle" className="w-full h-auto" />
              <div className="absolute top-8 left-8 bg-[#ff3333] text-white px-6 py-2 rounded-full text-xs font-black uppercase shadow-2xl">Sinal Confirmado</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white/[0.03] p-10 rounded-[40px] border border-white/5 space-y-6">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Direção do Mercado</p>
                  <h3 className="text-4xl font-black italic uppercase text-[#ff3333]">{analise.direcao}</h3>
                </div>
                <div className="p-5 bg-black/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Grau de Confiança</p>
                  <p className="text-2xl font-mono font-bold text-green-400">{analise.confianca}</p>
                </div>
              </div>

              <div className="bg-white/[0.03] p-10 rounded-[40px] border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] text-[#ff3333] font-black uppercase tracking-widest mb-4">Análise Técnica</h4>
                  <p className="text-gray-400 text-lg leading-relaxed italic">"{analise.justificativa}"</p>
                </div>
                <button onClick={() => setImagemFinal(null)} className="mt-8 text-xs text-gray-600 font-bold uppercase hover:text-white transition-colors">× Realizar Nova Análise</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}