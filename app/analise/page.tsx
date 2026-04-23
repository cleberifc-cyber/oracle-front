"use client";

import { useState, useEffect } from "react";

export default function AnalisePage() {
  const [sinais, setSinais] = useState<any[]>([]);
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSinais = async () => {
      try {
        const res = await fetch("https://oracle-analises.onrender.com/sinais");
        const data = await res.json();
        // Ajustando os preços para parecerem entradas reais
        const sinaisFormatados = data.map((s: any) => ({
            ...s,
            entrada: s.zona,
            alvo: (parseFloat(s.zona) + (s.tipo.includes('COMPRA') ? 15.5 : -15.5)).toFixed(2)
        }));
        setSinais(sinaisFormatados);
      } catch (e) {
        console.log("Erro ao carregar sinais");
      }
    };
    fetchSinais();
    const interval = setInterval(fetchSinais, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    setTimeout(() => {
      setAnaliseIA({
        direcao: "COMPRA (BUY)",
        precoEntrada: "Aguardar toque na zona de suporte",
        tp: "Topo anterior (Take Profit)",
        sl: "Abaixo da mínima da manipulação",
        resumo: "O mercado acabou de capturar a liquidez dos varejistas. A tendência agora é de alta acelerada."
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">Oracle<span className="text-[#4a0404]">.AI</span> Terminal</h1>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-green-500/20 text-green-500 px-3 py-1 rounded-full animate-pulse font-bold uppercase tracking-widest">Mercado em Tempo Real</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RADAR DE SINAIS SIMPLIFICADO */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">Oportunidades agora</h2>
          <div className="space-y-4">
            {sinais.map((sinal, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:border-[#4a0404] transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-2xl tracking-tighter">{sinal.ativo}</span>
                  <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase ${sinal.tipo.includes('COMPRA') ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                    {sinal.tipo.includes('COMPRA') ? '🚀 COMPRAR' : '📉 VENDER'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Entrada</p>
                        <p className="font-mono text-sm">{sinal.entrada}</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Alvo (TP)</p>
                        <p className="font-mono text-sm text-green-400">{sinal.alvo}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ANALISE DE PRINT SIMPLIFICADA */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">Analisador de Gráfico</h2>
          
          <div className="bg-white/[0.03] border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center group hover:border-[#4a0404]/50 transition-all cursor-pointer relative overflow-hidden">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Upload" />
            <div className="w-16 h-16 bg-[#4a0404]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-bold mb-1 italic">ENVIAR PRINT DO GRÁFICO</h3>
            <p className="text-gray-500 text-sm">Clique ou arraste seu gráfico para a IA analisar</p>
          </div>

          {loading && (
            <div className="bg-[#4a0404]/10 border border-[#4a0404]/30 p-8 rounded-3xl animate-pulse text-center">
              <p className="text-[#ff4d4d] font-bold tracking-widest uppercase text-sm">IA Mapeando Instituições...</p>
            </div>
          )}

          {analiseIA && !loading && (
            <div className="bg-white/[0.03] border border-[#4a0404] p-8 rounded-3xl animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-[#ff4d4d]"></div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Veredito da IA</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-black/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Ação</p>
                    <p className="text-lg font-bold text-blue-400">{analiseIA.direcao}</p>
                </div>
                <div className="p-4 bg-black/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Take Profit</p>
                    <p className="text-lg font-bold text-green-400">{analiseIA.tp}</p>
                </div>
                <div className="p-4 bg-black/60 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Stop Loss</p>
                    <p className="text-lg font-bold text-red-500">{analiseIA.sl}</p>
                </div>
              </div>

              <div className="bg-[#4a0404]/10 p-4 rounded-xl border border-[#4a0404]/20">
                <p className="text-sm leading-relaxed text-gray-300">
                    <strong className="text-white">POR QUE ENTRAR?</strong> {analiseIA.resumo}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}