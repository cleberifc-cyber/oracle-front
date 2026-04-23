"use client";
import { useState } from "react";

export default function AnalisePage() {
  const [analise, setAnalise] = useState<any>(null);
  const [imagemFinal, setImagemFinal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cupom, setCupom] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null);

  const processarAcesso = async () => {
    // 1. Limpa espaços e deixa tudo maiúsculo
    const textoCupom = cupom.trim().toUpperCase();

    // 2. Verifica se é o acesso gratuito
    if (textoCupom === "FREE1") {
      setAcessoLiberado(true);
      return;
    }

    // 3. Se não for FREE1 (mesmo se estiver vazio), vai para o pagamento
    setLoading(true);
    setLinkPagamento(null);

    try {
      // Envia o cupom exatamente como o Python espera, mesmo se for vazio
      const payload = { cupom: cupom.trim() };
      
      console.log("Enviando para o motor no Render...", payload);

      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      console.log("Resposta do motor:", data);
      
      if (res.ok && data.init_point) {
        // Sucesso: Ativa o link e tenta redirecionar
        setLinkPagamento(data.init_point);
        window.location.assign(data.init_point);
      } else {
        // Mostra na tela exatamente qual foi o erro
        alert("Falha na InfinitePay: " + JSON.stringify(data));
      }
    } catch (err: any) {
      console.error("Erro de rede:", err);
      alert("O servidor está acordando ou a conexão falhou. Aguarde 30 segundos e clique novamente.");
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
      
      if (data.status === "sucesso") {
        setAnalise(data.relatorio_completo);
        setImagemFinal(data.imagem_processada_oracle_sniper);
      } else {
        alert("Erro no processamento da imagem.");
      }
    } catch (err) {
      alert("Erro ao conectar com o motor visual.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="bg-[#161b22] p-6 rounded-3xl border border-[#30363d] flex justify-between items-center shadow-xl">
          <h1 className="text-xl font-black italic text-white uppercase tracking-tighter">Oracle<span className="text-[#0070f3]">.AI</span> Terminal</h1>
          <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d]">
            Gemini 3 Ultra Pro
          </div>
        </header>

        {/* TELA DE LOGIN / PAGAMENTO */}
        {!acessoLiberado && !imagemFinal && !loading && !linkPagamento && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0070f3] to-transparent"></div>
            <h2 className="text-4xl font-black text-white italic">DECIFRE O FLUXO INSTITUCIONAL</h2>
            <p className="text-[#8b949e] max-w-lg mx-auto">Nossa inteligência artificial mapeia zonas de liquidez e ordens ocultas em milissegundos. A tecnologia dos grandes bancos, agora no seu gráfico.</p>
            
            <div className="max-w-sm mx-auto space-y-4 bg-[#0d1117] p-8 rounded-3xl border border-[#30363d]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-[#ff3333]"></div>
                <span className="text-xs font-black tracking-widest text-white uppercase">Terminal de Acesso</span>
              </div>
              <input 
                type="text" 
                placeholder="INSIRA SEU CUPOM (OPCIONAL)" 
                value={cupom} 
                onChange={(e)=>setCupom(e.target.value)} 
                className="w-full bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center text-white outline-none focus:border-[#0070f3] text-sm font-bold uppercase" 
              />
              <button 
                onClick={processarAcesso} 
                className="w-full bg-[#430606] hover:bg-[#5a0808] border border-[#ff3333]/20 text-white font-black py-4 rounded-xl transition-all shadow-lg text-sm tracking-widest"
              >
                ADQUIRIR ACESSO — R$ 19,90
              </button>
            </div>
          </div>
        )}

        {/* SPINNER DE CARREGAMENTO */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#0070f3] rounded-full animate-spin"></div>
            <div className="text-[#0070f3] font-black tracking-widest text-sm animate-pulse uppercase">GERANDO LINK SEGURO...</div>
          </div>
        )}

        {/* BOTÃO FALLBACK (Caso o navegador trave o redirecionamento) */}
        {linkPagamento && !loading && (
          <div className="bg-[#161b22] border border-[#00ff7f]/30 rounded-[48px] p-20 text-center space-y-8 shadow-[0_0_50px_rgba(0,255,127,0.05)] relative overflow-hidden animate-in zoom-in duration-500">
            <h2 className="text-4xl font-black text-white italic">CHECKOUT LIBERADO</h2>
            <p className="text-[#8b949e] max-w-md mx-auto">Seu acesso foi preparado. Clique no botão abaixo para prosseguir com o pagamento seguro.</p>
            <a 
              href={linkPagamento} 
              className="inline-block w-full max-w-sm bg-[#00ff7f] hover:bg-[#00cc66] text-black font-black py-5 rounded-xl transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              FINALIZAR PAGAMENTO
            </a>
          </div>
        )}

        {/* ÁREA DE SCANNER (Ativada com FREE1) */}
        {acessoLiberado && !imagemFinal && !loading && !linkPagamento && (
          <div className="bg-[#161b22] border border-[#30363d] border-dashed rounded-[48px] p-24 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl hover:border-[#0070f3] transition-colors duration-300">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🔭</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic">Scanner Ativo</h2>
            <p className="text-[#8b949e] text-sm mt-3 text-center max-w-sm">Arraste seu gráfico para análise.</p>
          </div>
        )}

        {/* RESULTADO DA ANÁLISE */}
        {imagemFinal && analise && !linkPagamento && (
          <div className="space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-3xl flex justify-between items-center shadow-lg">
               <div>
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Sinal</p>
                  <h3 className={`text-3xl font-black italic uppercase ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>{analise.direcao}</h3>
               </div>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden border border-[#30363d] bg-[#161b22] p-2 shadow-xl max-w-4xl mx-auto">
               <img src={imagemFinal} className="w-full h-auto rounded-[22px]" alt="Análise" />
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl max-w-4xl mx-auto text-center">
               <p className="text-[10px] text-[#0070f3] uppercase font-black tracking-widest mb-4">Laudo Técnico Institucional (SMC)</p>
               <p className="text-[#e6edf3] text-sm leading-relaxed">{analise.justificativa_completa_institucional}</p>
               <button 
                  onClick={() => { setImagemFinal(null); setAnalise(null); }} 
                  className="mt-8 bg-[#0d1117] border border-[#30363d] text-white px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase"
                >
                  Nova Análise
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}