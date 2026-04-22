"use client";

import { useState, useEffect } from "react";

export default function OracleAIPage() {
  const [cupom, setCupom] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Efeito visual de rastro de luz seguindo o mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePagamento = async () => {
    setLoading(true);
    setMensagem("");
    try {
      const response = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cupom: cupom }),
      });
      const data = await response.json();

      if (data.init_point === "FREE_ACCESS") {
        setMensagem("⚡ ACESSO BIOMÉTRICO VALIDADO. REDIRECIONANDO...");
        setTimeout(() => { window.location.href = "/analise"; }, 1500);
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setMensagem("❌ CUPOM EXPIRADO OU INVÁLIDO.");
      }
    } catch (error) {
      setMensagem("❌ FALHA NA CONEXÃO COM O NÚCLEO IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#4a0404]">
      
      {/* BACKGROUND COM GRID E GRÁFICOS */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`, size: '40px 40px' }} />
      
      {/* EFEITO DE LUZ RADIAL (SEGUE O MOUSE) */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-30 transition-opacity duration-300"
           style={{ background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(74, 4, 4, 0.4), transparent 80%)` }} />

      {/* HEADER NAVBAR */}
      <nav className="relative z-20 flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4a0404] rounded-full animate-pulse shadow-[0_0_15px_#4a0404]" />
          <span className="font-bold text-xl tracking-tighter italic">ORACLE<span className="text-[#4a0404]">.AI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest text-gray-500">
          <span className="hover:text-white cursor-pointer transition-colors">INSTITUTIONAL ENGINE V2.0</span>
          <span className="hover:text-white cursor-pointer transition-colors">ORDER FLOW</span>
          <span className="text-[#4a0404] animate-pulse">● LIVE MARKET DATA</span>
        </div>
      </nav>

      <main className="relative z-20 flex flex-col items-center justify-center pt-20 px-6">
        
        {/* BADGE IA */}
        <div className="mb-6 px-4 py-1 border border-[#4a0404]/50 rounded-full bg-[#4a0404]/10 text-[#ff4d4d] text-[10px] font-bold tracking-[0.3em] uppercase animate-bounce">
          Neural Network Analysis Active
        </div>

        {/* TEXTO PRINCIPAL */}
        <h1 className="text-5xl md:text-7xl font-black text-center mb-6 leading-tight tracking-tighter">
          DECIFRE O FLUXO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
            INSTITUCIONAL.
          </span>
        </h1>
        
        <p className="max-w-2xl text-center text-gray-400 text-lg mb-12 leading-relaxed">
          Nossa inteligência artificial mapeia zonas de liquidez e ordens ocultas em milissegundos. 
          A mesma tecnologia dos grandes players, agora no seu gráfico.
        </p>

        {/* CARD DE ACESSO (GLASSMORPHISM) */}
        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4a0404] to-transparent opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-4 bg-[#4a0404] block" />
              DESBLOQUEAR TERMINAL
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="INSIRA SEU CUPOM"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-[#4a0404] outline-none transition-all placeholder:text-gray-600 font-mono text-sm tracking-widest"
                />
              </div>

              <button
                onClick={handlePagamento}
                disabled={loading}
                className={`w-full py-5 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${
                  cupom.toUpperCase() === "FREE1"
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-[#4a0404] text-white hover:bg-[#630606] shadow-[0_10px_30px_rgba(74,4,4,0.3)]"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  cupom.toUpperCase() === "FREE1" ? "INICIAR SESSÃO GRATUITA" : "ADQUIRIR ACESSO FULL — R$ 19,90"
                )}
              </button>
            </div>

            {mensagem && (
              <p className="mt-4 text-center text-[10px] font-bold tracking-widest text-[#ff4d4d] animate-pulse uppercase">
                {mensagem}
              </p>
            )}

            <div className="mt-8 flex justify-between items-center grayscale opacity-30 group-hover:opacity-100 transition-opacity">
               <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo.png" className="h-4" alt="Pix" />
               <div className="h-4 w-[1px] bg-white/20" />
               <span className="text-[10px] font-bold tracking-widest">MASTER / VISA</span>
            </div>
          </div>
        </div>

        {/* FOOTER STATS */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-12 text-center opacity-40">
            <div>
                <p className="text-2xl font-bold">98.4%</p>
                <p className="text-[10px] uppercase tracking-widest">Precisão IA</p>
            </div>
            <div>
                <p className="text-2xl font-bold">~12ms</p>
                <p className="text-[10px] uppercase tracking-widest">Latência</p>
            </div>
            <div className="hidden md:block">
                <p className="text-2xl font-bold">+5000</p>
                <p className="text-[10px] uppercase tracking-widest">Análises/Dia</p>
            </div>
        </div>
      </main>

      <footer className="relative z-20 py-10 text-center">
         <p className="text-[9px] text-gray-700 tracking-[0.5em] uppercase">
           Oracle Senna Intelligence © 2026 • Institutional Trading Only
         </p>
      </footer>
    </div>
  );
}