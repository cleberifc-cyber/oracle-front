"use client";

import { useState } from "react";

export default function AnalisePage() {
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    setAnaliseIA(null); // Limpa análise anterior
    
    // Simulação de processamento de imagem pela IA Sniper
    setTimeout(() => {
      setAnaliseIA({
        ativo: "XAUUSD (Ouro)",
        direcao: "COMPRA (BUY)",
        confianca: "94%",
        zonaEntrada: "2032.50 - 2034.00",
        tp1: "2045.00 (Alvo Curto)",
        tp2: "2058.00 (Alvo Longo)",
        sl: "2025.00 (Abaixo da Liquidez)",
        justificativa: "Detectamos manipulação institucional (Stop Hunt) abaixo da mínima de ontem. O preço capturou a liquidez e agora deve buscar o topo anterior. Alta probabilidade de reversão rápida."
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#4a0404]/30">
      
      {/* HEADER MINIMALISTA */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
            Oracle<span className="text-[#ff3333]">.AI</span> Sniper Terminal
          </h1>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-400 uppercase font-bold tracking-widest">IA Conectada</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 py-12 md:py-20">
        
        {/* ÁREA DE UPLOAD CENTRALIZADA (SÓ APARECE SE NÃO HOUVER ANÁLISE) */}
        {!analiseIA && !loading && (
          <div className="text-center space-y-12 animate-in fade-in duration-700">
            <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                    Análise Profissional<br/> de Gráfico
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
                    Envie o print do seu gráfico agora. Nossa IA Sniper vai ler as zonas de manipulação institucional e te dar a entrada exata em segundos.
                </p>
            </div>
            
            <div className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center group hover:border-[#ff3333]/50 hover:bg-[#ff3333]/5 transition-all cursor-pointer relative overflow-hidden shadow-2xl shadow-black">
                <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Clique para enviar seu gráfico" />
                <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:border-[#ff3333]/30">
                    <span className="text-5xl group-hover:animate-pulse">📸</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Arraste ou Clique</h3>
                <p className="text-gray-400 text-sm">Tamanho máximo: 10MB (PNG, JPG)</p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20 space-y-6 animate-pulse">
            <div className="w-20 h-20 border-4 border-[#ff3333] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#ff3333] font-bold tracking-widest uppercase text-sm">IA Sniper Mapeando Ordens Ocultas...</p>
          </div>
        )}

        {/* RESULTADO SNIPER UNIFICADO (O CARD GIGANTE) */}
        {analiseIA && !loading && (
          <div className="animate-in fade-in zoom-in duration-500 space-y-10">
            
            {/* CABEÇALHO DO SINAL */}
            <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl shadow-black">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Ativo Analisado</p>
                    <h3 className="text-3xl font-black tracking-tighter uppercase">{analiseIA.ativo}</h3>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                    <span className={`text-xl font-black px-6 py-2 rounded-xl uppercase ${analiseIA.direcao.includes('COMPRA') ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                        {analiseIA.direcao}
                    </span>
                    <p className="text-xs text-gray-400 font-mono">Confiança da IA: <span className="text-white font-bold">{analiseIA.confianca}</span></p>
                </div>
            </div>

            {/* CHECKLIST DE OPERAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* COLUNA ESQUERDA: PREÇOS */}
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ponto de Entrada (Zona)</h4>
                        <p className="text-3xl font-mono font-bold text-white bg-black/40 p-4 rounded-xl border border-white/5 text-center">{analiseIA.zonaEntrada}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Take Profit 1</h4>
                            <p className="text-lg font-mono font-bold text-green-400">{analiseIA.tp1}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Stop Loss</h4>
                            <p className="text-lg font-mono font-bold text-red-500">{analiseIA.sl}</p>
                        </div>
                    </div>
                     <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Take Profit 2 (Alvo Longo)</h4>
                        <p className="text-lg font-mono font-bold text-green-300">{analiseIA.tp2}</p>
                    </div>
                </div>

                {/* COLUNA DIREITA: JUSTIFICATIVA */}
                <div className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-[#ff3333]">
                        <span className="text-2xl">🛡️</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">Leitura Institucional</h4>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed p-4 bg-black/30 rounded-xl border border-white/5">
                        {analiseIA.justificativa}
                    </p>
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="text-[11px] text-gray-600 italic">Análise baseada em Price Action e Volume Profile da imagem enviada.</p>
                    </div>
                </div>
            </div>

            {/* BOTÃO PARA NOVA ANÁLISE */}
            <div className="text-center pt-8">
                <button onClick={() => setAnaliseIA(null)} className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                    × LIMPAR E ENVIAR NOVO GRÁFICO
                </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}