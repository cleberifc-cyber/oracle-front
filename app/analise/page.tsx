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
      alert("Erro ao conectar com o motor Oracle. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-6 selection:bg-[#0070f3]/30">
      <div className="max-w-6xl mx-auto space-y-12 text-center">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="flex justify-between items-center border-b border-[#30363d] pb-6 bg-[#161b22] p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
            Oracle<span className="text-[#0070f3]">.AI</span> <span className="text-xs font-mono text-[#8b949e]">Sniper v6.0</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-[#8b949e] text-xs font-bold uppercase tracking-widest">Conexão Segura</p>
          </div>
        </div>

        {/* ÁREA DE TRABALHO */}
        {!imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[40px] p-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#0070f3]/50 hover:bg-[#1f242c] transition-all group relative shadow-2xl">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Clique para enviar seu gráfico" />
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">📊</div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Análise Vision Pro</h2>
            <p className="text-[#8b949e] text-sm mt-3 max-w-sm">Arraste seu print. A IA vai escanear o ativo e desenhar as zonas institucionais direto no gráfico.</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-24 space-y-6 bg-[#161b22] rounded-[40px] border border-[#30363d] animate-pulse">
            <div className="w-16 h-16 border-4 border-[#0070f3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#0070f3] font-black uppercase text-xs tracking-widest">Processando Camadas de Smart Money...</p>
          </div>
        )}

        {/* RESULTADO COM O PRINT DESENHADO */}
        {imagemFinal && (
          <div className="space-y-10 animate-in zoom-in duration-500 pb-20">
            <div className="relative rounded-[40px] overflow-hidden border border-[#30363d] shadow-[0_0_60px_rgba(0,112,243,0.1)] bg-[#161b22] p-3">
              <img src={imagemFinal} alt="Análise Oracle AI" className="w-full h-auto rounded-[32px]" />
              <div className="absolute top-8 left-8 bg-[#0070f3] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase shadow-2xl tracking-widest">
                Gatilho Confirmado
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              
              {/* CARD DE DADOS */}
              <div className="md:col-span-1 bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] space-y-6 shadow-xl">
                <div>
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Instrumento</p>
                  <h3 className="text-xl font-bold text-white">{analise.ativo}</h3>
                  <p className="text-sm text-[#8b949e]">{analise.timeframe}</p>
                </div>
                <div className="pt-5 border-t border-[#30363d]">
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Direção</p>
                  <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>
                    {analise.direcao}
                  </span>
                </div>
              </div>

              {/* CARD DE JUSTIFICATIVA */}
              <div className="md:col-span-2 bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] flex flex-col justify-between shadow-xl">
                <div>
                  <h4 className="text-[10px] text-[#0070f3] font-black uppercase tracking-widest mb-4">Veredito da IA</h4>
                  <p className="text-[#e6edf3] text-lg leading-relaxed italic bg-[#0d1117] p-6 rounded-2xl border border-[#30363d]">
                    "{analise.justificativa}"
                  </p>
                </div>
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#30363d]">
                    <span className="text-xs text-[#8b949e]">Grau de Confiança: <span className="font-bold text-white">{analise.confianca}</span></span>
                    <button onClick={() => setImagemFinal(null)} className="text-xs text-[#8b949e] font-bold uppercase hover:text-white transition-colors">
                        × Nova Análise
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