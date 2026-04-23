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
      alert("Erro de conexão com o terminal.");
    } finally {
      setLoading(false);
    }
  };

  const processarAcesso = async () => {
    // 1. Se o cara digitou o código mestre, libera na hora sem pagar
    if (cupom.toUpperCase() === "FREE1") {
      setAcessoLiberado(true);
      return;
    }

    // 2. Se não tem cupom ou o cupom é qualquer outra coisa, manda pro Mercado Pago
    setLoading(true);
    try {
      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cupom: cupom })
      });
      const data = await res.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento. Verifique o Token no Render.");
      }
    } catch (err) {
      alert("Falha na comunicação com o Mercado Pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-[#30363d] pb-6 bg-[#161b22] px-8 py-5 rounded-3xl shadow-xl">
          <h1 className="text-xl font-black italic uppercase text-white">
            Oracle<span className="text-[#0070f3]">.AI</span> <span className="text-[10px] font-mono text-[#8b949e] ml-2">TERMINAL v8.0</span>
          </h1>
        </div>

        {/* TELA DE ACESSO */}
        {!acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-12 md:p-20 text-center space-y-8 shadow-2xl">
            <div className="space-y-4">
                <div className="bg-[#0070f3]/10 text-[#0070f3] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0070f3]/20">
                  <span className="text-3xl font-bold">VIP</span>
                </div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter">LIBERAR SCANNER PRO</h2>
                <p className="text-[#8b949e] max-w-md mx-auto text-sm">O modelo Gemini 3 Ultra está pronto. Adquira seu acesso ou insira um código promocional para continuar.</p>
            </div>
            
            <div className="max-w-sm mx-auto space-y-4">
                <input 
                    type="text" 
                    placeholder="CÓDIGO DE ACESSO (OPCIONAL)" 
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] p-5 rounded-2xl text-center font-bold uppercase text-white focus:border-[#0070f3] outline-none transition-all"
                />
                <button 
                    onClick={processarAcesso}
                    className="w-full bg-[#0070f3] hover:bg-[#005bc1] text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-lg shadow-[0_10px_20px_rgba(0,112,243,0.3)]"
                >
                    Acessar Terminal Agora
                </button>
                <p className="text-[10px] text-[#545d68] uppercase font-bold tracking-widest">Pagamento Seguro via Mercado Pago</p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-24 space-y-8 bg-[#161b22] rounded-[48px] border border-[#30363d] text-center shadow-inner animate-pulse">
            <div className="w-14 h-14 border-4 border-[#0070f3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#0070f3] font-black uppercase text-xs tracking-[0.4em]">Sincronizando com o Mercado Pago...</p>
          </div>
        )}

        {/* ÁREA DE UPLOAD (PÓS-PAGAMENTO OU CUPOM) */}
        {acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 flex flex-col items-center justify-center cursor-pointer hover:border-[#0070f3]/50 transition-all group relative shadow-2xl">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="w-24 h-24 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 border border-[#30363d] shadow-inner group-hover:scale-110 transition-transform">
                <span className="text-5xl">📊</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white italic">Scan Ativo</h2>
            <p className="text-[#0070f3] text-sm mt-3 font-bold uppercase tracking-widest animate-pulse">Conectado ao Gemini 3 Ultra</p>
          </div>
        )}

        {/* EXIBIÇÃO DO RESULTADO (GEMINI 3) */}
        {imagemFinal && (
           <div className="space-y-8 animate-in zoom-in duration-700 pb-20">
             <div className="relative rounded-[40px] overflow-hidden border border-[#30363d] shadow-[0_0_100px_rgba(0,112,243,0.15)] bg-[#161b22] p-4">
               <img src={imagemFinal} alt="Oracle Gemini 3" className="w-full h-auto rounded-[32px]" />
               <div className="absolute top-10 left-10 bg-[#0070f3] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase">Analista Sniper v8.0</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] shadow-xl">
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Decisão Final</p>
                  <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>
                    {analise.direcao}
                  </h3>
                </div>
                <div className="md:col-span-2 bg-[#161b22] p-10 rounded-[40px] border border-[#30363d] shadow-xl">
                  <p className="text-[10px] text-[#0070f3] uppercase font-black tracking-widest mb-4">Laudo Técnico Gemini 3</p>
                  <p className="text-[#e6edf3] text-lg leading-relaxed italic bg-[#0d1117] p-6 rounded-2xl border border-[#30363d]">
                    "{analise.justificativa}"
                  </p>
                  <button onClick={() => setImagemFinal(null)} className="mt-6 text-[10px] text-[#545d68] uppercase font-bold hover:text-white transition-colors">× Realizar Nova Análise Profissional</button>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}