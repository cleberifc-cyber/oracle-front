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
      alert("Erro de conexão com o terminal central.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-4 md:p-10 selection:bg-[#0070f3]/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="flex justify-between items-center border-b border-[#30363d] pb-6 bg-[#161b22] px-8 py-5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#0070f3] rounded-full animate-pulse shadow-[0_0_10px_#0070f3]"></div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
              Oracle<span className="text-[#0070f3]">.AI</span> <span className="text-[10px] font-mono text-[#8b949e] ml-2">TERMINAL v6.0</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <p className="text-[#8b949e] text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Analysis</p>
          </div>
        </div>

        {/* ÁREA DE UPLOAD */}
        {!imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 flex flex-col items-center justify-center cursor-pointer hover:border-[#0070f3]/50 hover:bg-[#1c2128] transition-all group relative shadow-2xl">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 border border-[#30363d] group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white italic">Scan Vision Ativo</h2>
            <p className="text-[#8b949e] text-sm mt-3 max-w-sm text-center">Arraste o print do gráfico para iniciar a leitura institucional.</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-24 space-y-8 bg-[#161b22] rounded-[48px] border border-[#30363d] text-center shadow-inner">
            <div className="w-14 h-14 border-4 border-[#0070f3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
                <p className="text-[#0070f3] font-black uppercase text-xs tracking-[0.4em]">Mapeando Liquidez</p>
            </div>
          </div>
        )}

        {/* RESULTADO FINAL */}
        {imagemFinal && (
          <div className="space-y-8 animate-in zoom-in duration-700 pb-20">
            <div className="relative rounded-[40px] overflow-hidden border border-[#30363d] shadow-[0_0_80px_rgba(0,112,243,0.08)] bg-[#161b22] p-4">
              <img src={imagemFinal} alt="Análise Oracle" className="w-full h-auto rounded-[32px] border border-[#30363d]" />
              <div className="absolute top-10 left-10 bg-[#0070f3] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl tracking-tighter">
                Análise Verificada
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] space-y-6 shadow-xl">
                <div>
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Asset & Timeframe</p>
                  <h3 className="text-xl font-bold text-white">{analise.ativo}</h3>
                  <p className="text-sm text-[#0070f3] font-mono">{analise.timeframe}</p>
                </div>
                <div className="pt-6 border-t border-[#30363d]">
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Veredito</p>
                  <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>
                    {analise.direcao}
                  </h3>
                </div>
              </div>

              <div className="md:col-span-2 bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#0070f3] text-lg">🛡️</span>
                    <h4 className="text-[10px] text-white font-black uppercase tracking-widest">Leitura Técnica Smart Money</h4>
                  </div>
                  <div className="bg-[#0d1117] p-8 rounded-3xl border border-[#30363d]">
                    <p className="text-[#e6edf3] text-lg leading-relaxed italic">
                        "{analise.justificativa}"
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-8">
                    <span className="text-[11px] text-[#8b949e] font-bold uppercase tracking-widest">Confiança: <span className="text-white">{analise.confianca}</span></span>
                    <button onClick={() => setImagemFinal(null)} className="text-[10px] bg-[#30363d] hover:bg-[#0070f3] text-white px-5 py-2 rounded-xl transition-all font-bold uppercase">
                        × Nova Consulta
                    </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}