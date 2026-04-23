"use client";
import { useState } from "react";

export default function AnalisePage() {
  const [analise, setAnalise] = useState<any>(null);
  const [imagemFinal, setImagemFinal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cupom, setCupom] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);

  const processarAcesso = async () => {
    if (cupom.toUpperCase() === "FREE1") {
      setAcessoLiberado(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cupom })
      });
      
      if (!res.ok) throw new Error("Erro no servidor");
      
      const data = await res.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("O link de pagamento não foi gerado. Verifique sua InfiniteTag no Render.");
      }
    } catch (err) { 
      alert("Falha ao conectar com o terminal de pagamento."); 
    } finally { 
      setLoading(false); 
    }
  };

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
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="bg-[#161b22] p-6 rounded-3xl border border-[#30363d] flex justify-between items-center shadow-xl">
          <h1 className="text-xl font-black italic text-white uppercase">Oracle<span className="text-[#0070f3]">.AI</span> Terminal</h1>
          <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest animate-pulse">Gemini 3 Ultra Ativo</div>
        </header>

        {!acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 text-center space-y-8 shadow-2xl">
            <h2 className="text-4xl font-black text-white italic tracking-tighter">LIBERAR TERMINAL</h2>
            <div className="max-w-sm mx-auto space-y-4">
              <input type="text" placeholder="CÓDIGO (OPCIONAL)" value={cupom} onChange={(e)=>setCupom(e.target.value)} className="w-full bg-[#0d1117] border border-[#30363d] p-5 rounded-2xl text-center text-white outline-none focus:border-[#0070f3]" />
              <button onClick={processarAcesso} className="w-full bg-[#0070f3] hover:bg-[#005bc1] text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_20px_rgba(0,112,243,0.3)]">ACESSAR AGORA</button>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Pagamento Seguro via InfinitePay</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#0070f3] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#0070f3] font-black tracking-widest text-xs">PROCESSANDO...</p>
          </div>
        )}

        {acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl hover:border-[#0070f3]/50 transition-all">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
            <h2 className="text-2xl font-black text-white uppercase italic">Scan Ativo</h2>
            <p className="text-[#8b949e] text-sm mt-2">Clique para enviar seu gráfico.</p>
          </div>
        )}

        {imagemFinal && (
          <div className="space-y-8 pb-20">
            <div className="relative rounded-[40px] overflow-hidden border border-[#30363d] bg-[#161b22] p-4 shadow-2xl">
              <img src={imagemFinal} className="w-full h-auto rounded-[32px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#161b22] p-10 rounded-[40px] border border-[#30363d]">
                <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-2">Direção</p>
                <h3 className={`text-4xl font-black italic uppercase ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>{analise.direcao}</h3>
              </div>
              <div className="md:col-span-2 bg-[#161b22] p-10 rounded-[40px] border border-[#30363d]">
                <p className="text-[10px] text-[#0070f3] uppercase font-black tracking-widest mb-4">Análise Gemini 3 Ultra</p>
                <p className="text-[#e6edf3] text-lg italic bg-[#0d1117] p-6 rounded-2xl">"{analise.justificativa}"</p>
                <button onClick={()=>setImagemFinal(null)} className="mt-6 text-[10px] text-gray-600 font-bold hover:text-white transition-colors">× NOVA ANÁLISE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}