"use client";

import { useState } from "react";

export default function AnalisePage() {
  const [analise, setAnalise] = useState<any>(null);
  const [imagemFinal, setImagemFinal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cupom, setCupom] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);

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

  const verificarAcesso = async () => {
    // REGRA DO CUPOM FREE1
    if (cupom.toUpperCase() === "FREE1") {
      setAcessoLiberado(true);
      return;
    }

    // Se não for o cupom, tenta criar pagamento no Mercado Pago
    try {
      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cupom: cupom })
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      alert("Erro ao processar pagamento.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-[#30363d] pb-6 bg-[#161b22] px-8 py-5 rounded-3xl shadow-xl">
          <h1 className="text-xl font-black italic uppercase text-white">
            Oracle<span className="text-[#0070f3]">.AI</span> <span className="text-[10px] font-mono text-[#8b949e] ml-2">TERMINAL v6.0</span>
          </h1>
        </div>

        {/* TELA DE BLOQUEIO / CUPOM */}
        {!acessoLiberado && !imagemFinal && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 text-center space-y-8 shadow-2xl">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white italic">ACESSO RESTRITO</h2>
                <p className="text-[#8b949e]">Insira seu cupom ou adquira acesso vitalício.</p>
            </div>
            
            <div className="max-w-xs mx-auto space-y-4">
                <input 
                    type="text" 
                    placeholder="CUPOM DE ACESSO" 
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-2xl text-center font-bold uppercase text-[#0070f3] focus:outline-none focus:border-[#0070f3]"
                />
                <button 
                    onClick={verificarAcesso}
                    className="w-full bg-[#0070f3] hover:bg-[#005bc1] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
                >
                    Liberar Terminal
                </button>
            </div>
          </div>
        )}

        {/* ÁREA DE UPLOAD (Só aparece se o acesso for liberado) */}
        {acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 flex flex-col items-center justify-center cursor-pointer hover:border-[#0070f3]/50 transition-all group relative shadow-2xl">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 border border-[#30363d]">
                <span className="text-4xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold uppercase text-white italic">Scan Vision Ativo</h2>
            <p className="text-[#8b949e] text-sm mt-3 text-center">Acesso Liberado com sucesso. Arraste seu print agora.</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-24 space-y-8 bg-[#161b22] rounded-[48px] border border-[#30363d] text-center">
            <div className="w-14 h-14 border-4 border-[#0070f3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#0070f3] font-black uppercase text-xs tracking-[0.4em]">Mapeando Liquidez...</p>
          </div>
        )}

        {/* RESULTADO (MESMO CÓDIGO DA v6.0) */}
        {imagemFinal && (
           <div className="space-y-8 animate-in zoom-in duration-700 pb-20">
             <div className="relative rounded-[40px] overflow-hidden border border-[#30363d] bg-[#161b22] p-4">
               <img src={imagemFinal} alt="Análise Oracle" className="w-full h-auto rounded-[32px]" />
               <div className="absolute top-10 left-10 bg-[#0070f3] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl">Análise Verificada</div>
             </div>
             {/* ... (resto do código de exibição da analise) */}
             <div className="bg-[#161b22] p-10 rounded-[40px] border border-[#30363d]">
                <h3 className="text-xl font-bold text-white mb-4">{analise.ativo} - {analise.timeframe}</h3>
                <p className="text-[#00ff7f] text-4xl font-black italic">{analise.direcao}</p>
                <p className="text-gray-400 mt-4 italic">{analise.justificativa}</p>
                <button onClick={() => setImagemFinal(null)} className="mt-8 text-xs text-gray-500 uppercase font-bold">× Nova Consulta</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}