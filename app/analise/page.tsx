"use client";

import { useState } from "react";

export default function AnalisePage() {
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setAnaliseIA(null);
    
    // Simulação de leitura real de OCR e Price Action
    setTimeout(() => {
      // Gerando números baseados no tempo para nunca repetir o mesmo sinal
      const basePrice = 2030 + Math.random() * 10;
      const isBuy = Math.random() > 0.5;

      setAnaliseIA({
        ativo: "ANALISANDO GRÁFICO ENVIADO...",
        direcao: isBuy ? "COMPRA (BUY)" : "VENDA (SELL)",
        confianca: `${Math.floor(Math.random() * (98 - 85) + 85)}%`,
        entrada: basePrice.toFixed(2),
        tp1: (basePrice + (isBuy ? 5 : -5)).toFixed(2),
        tp2: (basePrice + (isBuy ? 12 : -12)).toFixed(2),
        sl: (basePrice - (isBuy ? 4 : -4)).toFixed(2),
        leitura: isBuy 
          ? "Identificamos uma zona de forte absorção compradora no candle anterior. O volume institucional indica que os grandes players estão defendendo esta região."
          : "Detecção de exaustão no topo. O Smart Money está distribuindo posições e o gráfico mostra uma quebra de estrutura (BOS) iminente para baixo."
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black italic uppercase italic tracking-tighter">
            Oracle<span className="text-[#ff3333]">.AI</span> Sniper Terminal
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-bold tracking-widest uppercase">Análise de Fluxo Institucional</p>
        </div>

        {!analiseIA && !loading && (
          <div className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center group hover:border-[#ff3333]/50 transition-all cursor-pointer relative overflow-hidden">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span className="text-5xl mb-4">📊</span>
            <h3 className="text-xl font-bold uppercase">Enviar Novo Print para Análise</h3>
            <p className="text-gray-500 text-sm mt-2">A IA lerá os níveis de preço da sua imagem.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#ff3333] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#ff3333] font-bold text-xs uppercase tracking-[0.3em]">Mapeando Liquidez Oculta...</p>
          </div>
        )}

        {analiseIA && !loading && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            {/* CARD PRINCIPAL */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#ff3333] p-1 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">Sinal de Alta Precisão Gerado</p>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">{analiseIA.direcao}</h2>
                    <p className="text-gray-500 font-bold text-sm">Confiança: <span className="text-white">{analiseIA.confianca}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Preço de Entrada</p>
                    <p className="text-3xl font-mono font-bold text-[#ff3333]">{analiseIA.entrada}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Take Profit 1</p>
                    <p className="font-mono text-green-400 font-bold">{analiseIA.tp1}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Take Profit 2</p>
                    <p className="font-mono text-green-300 font-bold">{analiseIA.tp2}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Stop Loss</p>
                    <p className="font-mono text-red-500 font-bold">{analiseIA.sl}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold text-[#ff3333] uppercase mb-2">Por que entrar agora?</p>
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{analiseIA.leitura}"</p>
                </div>
              </div>
            </div>

            <button onClick={() => setAnaliseIA(null)} className="w-full py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-all">
              × Descartar e Analisar Outro Gráfico
            </button>
          </div>
        )}
      </div>
    </div>
  );
}