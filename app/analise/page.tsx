"use client";

import { useState, useEffect } from "react";

export default function AnalisePage() {
  const [sinais, setSinais] = useState([]);
  const [analiseIA, setAnaliseIA] = useState(null);
  const [loading, setLoading] = useState(false);

  // Busca os sinais do seu motor no Render
  useEffect(() => {
    const fetchSinais = async () => {
      try {
        const res = await fetch("https://oracle-analises.onrender.com/sinais");
        const data = await res.json();
        setSinais(data);
      } catch (e) {
        console.log("Erro ao carregar sinais");
      }
    };
    fetchSinais();
    const interval = setInterval(fetchSinais, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e) => {
    setLoading(true);
    // Simulação de processamento de imagem pela IA
    setTimeout(() => {
      setAnaliseIA({
        resultado: "ALTA PROBABILIDADE DE MANIPULAÇÃO (STOP HUNT)",
        detalhes: "Detectamos ordens institucionais ocultas abaixo da mínima anterior. O preço deve buscar a liquidez antes de reverter.",
        conselho: "Aguarde o rompimento falso da mínima para buscar uma COMPRA."
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      {/* HEADER VIP */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black italic tracking-tighter">ORACLE<span className="text-[#4a0404]">.AI</span> TERMINAL</h1>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-green-500/20 text-green-500 px-3 py-1 rounded-full animate-pulse font-bold">NÚCLEO ATIVO</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: SINAIS EM TEMPO REAL */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-sm font-bold text-gray-500 tracking-[0.2em] uppercase">Radar Institucional</h2>
          <div className="space-y-4">
            {sinais.map((sinal, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-[#4a0404] transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-xl">{sinal.ativo}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sinal.tipo.includes('COMPRA') ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {sinal.tipo}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Zona: {sinal.zona}</span>
                  <span className="text-white font-mono">{sinal.confianca} Confiança</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA 2/3: UPLOAD E ANÁLISE */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-gray-500 tracking-[0.2em] uppercase">Análise de Print (IA Vision)</h2>
          
          <div className="bg-white/[0.03] border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-[#4a0404]/50 transition-all cursor-pointer relative overflow-hidden">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-16 h-16 bg-[#4a0404]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Arraste o print do seu gráfico</h3>
            <p className="text-gray-500 text-sm">A IA Oracle vai ler as zonas de liquidez em segundos.</p>
          </div>

          {/* RESULTADO DA ANÁLISE */}
          {loading && (
            <div className="bg-[#4a0404]/10 border border-[#4a0404]/30 p-8 rounded-3xl animate-pulse text-center">
              <p className="text-[#ff4d4d] font-bold tracking-widest uppercase text-sm">IA Processando Camadas Institucionais...</p>
            </div>
          )}

          {analiseIA && !loading && (
            <div className="bg-white/[0.03] border border-[#4a0404] p-8 rounded-3xl space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-3 text-[#ff4d4d]">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-black">{analiseIA.resultado}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{analiseIA.detalhes}</p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-sm text-gray-400 italic">
                <strong>Conselho Oracle:</strong> {analiseIA.conselho}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
 // Versão 2.0 );
}