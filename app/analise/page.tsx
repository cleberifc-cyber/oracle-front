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
      // Blindagem extra no envio do payload para evitar qualquer Erro 422
      const payload = cupom.trim() !== "" ? { cupom: cupom.trim() } : {};

      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok && data.init_point) {
        // Redirecionamento bem-sucedido para o checkout
        window.location.href = data.init_point;
      } else {
        // Se der erro, avisa exatamente o que a InfinitePay reclamou
        alert("FALHA NA INTEGRAÇÃO: " + (data.detail || "Verifique se a sua tag (handle) cadastrada no backend está exatamente igual ao app da InfinitePay."));
      }
    } catch (err) {
      alert("Falha de rede com o terminal Oracle. Verifique sua conexão ou se o motor no Render está acordado.");
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
        // Recebendo os dados completos da Engine v9.4 Pro
        setAnalise(data.relatorio_completo);
        setImagemFinal(data.imagem_processada_oracle_sniper);
      } else {
        alert("Erro no processamento da imagem: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Erro ao conectar com o motor de visão computacional.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER INSTITUCIONAL */}
        <header className="bg-[#161b22] p-6 rounded-3xl border border-[#30363d] flex justify-between items-center shadow-xl">
          <h1 className="text-xl font-black italic text-white uppercase tracking-tighter">Oracle<span className="text-[#0070f3]">.AI</span> Terminal</h1>
          <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d]">
            Gemini 3 Ultra Pro
          </div>
        </header>

        {/* TELA DE LOGIN / PAGAMENTO */}
        {!acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0070f3] to-transparent"></div>
            <h2 className="text-4xl font-black text-white italic">DECIFRE O FLUXO INSTITUCIONAL</h2>
            <p className="text-[#8b949e] max-w-lg mx-auto">Nossa inteligência artificial mapeia zonas de liquidez e ordens ocultas. A tecnologia dos grandes bancos, agora no seu gráfico.</p>
            
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
              <div className="flex justify-between items-center text-[9px] text-[#8b949e] font-bold uppercase tracking-widest mt-4 px-2">
                <span>Pix Active</span>
                <span>Secure SSL</span>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK DE CARREGAMENTO */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#0070f3] rounded-full animate-spin"></div>
            <div className="text-[#0070f3] font-black tracking-widest text-sm animate-pulse uppercase">Analisando Fluxo Institucional...</div>
          </div>
        )}

        {/* ÁREA DE UPLOAD */}
        {acessoLiberado && !imagemFinal && !loading && (
          <div className="bg-[#161b22] border border-[#30363d] border-dashed rounded-[48px] p-24 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl hover:border-[#0070f3] transition-colors duration-300">
            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🔭</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic">Scanner Ativo</h2>
            <p className="text-[#8b949e] text-sm mt-3 text-center max-w-sm">Faça o upload ou arraste um print do seu gráfico para decodificar as intenções dos algoritmos bancários.</p>
          </div>
        )}

        {/* DASHBOARD DE RESULTADO PROFISSIONAL */}
        {imagemFinal && analise && (
          <div className="space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Header do Relatório */}
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Sinal Principal */}
              <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-3xl flex-1 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Sinal Identificado</p>
                  <h3 className={`text-3xl font-black italic uppercase ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>
                    {analise.direcao}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">Confiança IA</p>
                  <p className={`text-2xl font-black ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>{analise.confianca_geral}</p>
                </div>
              </div>

              {/* Ativo Info */}
              <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-3xl flex items-center justify-center shadow-lg px-12">
                 <h2 className="text-2xl font-black text-white">{analise.ativo}</h2>
              </div>
            </div>

            {/* Print Processado & Alvos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Imagem (Ocupa 7 colunas) */}
              <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#30363d] bg-[#161b22] p-2 shadow-xl">
                <img src={imagemFinal} alt="Análise Gráfica" className="w-full h-auto rounded-[22px] border border-[#30363d]" />
              </div>

              {/* Tabela de Preços e Alvos (Ocupa 5 colunas) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Linha 1: Entrada e Stop */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl">
                     <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mb-2">Entrada Ideal</p>
                     <p className="text-xl font-black text-white">{analise.entrada}</p>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-2xl">
                     <p className="text-[10px] text-[#ff3333] uppercase font-bold tracking-widest mb-2">Stop Loss</p>
                     <p className="text-xl font-black text-[#ff3333]">{analise.stop_loss}</p>
                  </div>
                </div>

                {/* Linha 2: Confluências */}
                <div className="grid grid-cols-3 gap-4 bg-[#161b22] border border-[#30363d] p-5 rounded-2xl">
                  <div className="text-center border-r border-[#30363d]">
                    <p className="text-[9px] text-[#8b949e] uppercase font-bold mb-1">Confluência</p>
                    <p className="text-sm font-black text-white">{analise.fatores_confluencia}</p>
                  </div>
                  <div className="text-center border-r border-[#30363d]">
                    <p className="text-[9px] text-[#8b949e] uppercase font-bold mb-1">Tendência</p>
                    <p className="text-sm font-black text-white uppercase">{analise.tendencia_mercado}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-[#8b949e] uppercase font-bold mb-1">Técnico</p>
                    <p className={`text-sm font-black uppercase ${analise.direcao.includes('COMPRA') ? 'text-[#00ff7f]' : 'text-[#ff3333]'}`}>{analise.analise_tecnica}</p>
                  </div>
                </div>

                {/* Lista de Alvos (Targets) */}
                <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl flex-1 flex flex-col justify-center">
                  <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0070f3]"></span> Alvos Institucionais (Take Profit)
                  </p>
                  
                  <div className="space-y-5">
                    {analise.targets_list && analise.targets_list.map((tp: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 text-xs font-black text-[#8b949e]">{tp.id}</div>
                        <div className="flex-1 bg-[#0d1117] h-2 rounded-full overflow-hidden relative">
                           {/* Barra de Progresso simulando probabilidade */}
                           <div 
                             className={`absolute top-0 left-0 h-full rounded-full ${analise.direcao.includes('COMPRA') ? 'bg-gradient-to-r from-[#00ff7f]/40 to-[#00ff7f]' : 'bg-gradient-to-r from-[#ff3333]/40 to-[#ff3333]'}`} 
                             style={{ width: tp.probabilidade }}
                           ></div>
                        </div>
                        <div className="w-20 text-right">
                          <p className="text-xs font-black text-white">{tp.pontos_pips}</p>
                          <p className="text-[9px] text-[#8b949e]">{tp.risk_reward} | {tp.probabilidade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Níveis de Preço */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#00ff7f]/20 p-4 rounded-xl">
                     <p className="text-[9px] text-[#00ff7f] uppercase font-bold tracking-widest mb-1">Suporte Forte</p>
                     <p className="text-sm font-bold text-white">{analise.suporte_principal}</p>
                  </div>
                  <div className="bg-[#161b22] border border-[#ff3333]/20 p-4 rounded-xl">
                     <p className="text-[9px] text-[#ff3333] uppercase font-bold tracking-widest mb-1">Resistência</p>
                     <p className="text-sm font-bold text-white">{analise.resistencias_detectadas[0]}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Justificativa Lógica SMC */}
            <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#0070f3]"></div>
              <p className="text-[10px] text-[#0070f3] uppercase font-black tracking-widest mb-4">Laudo Técnico Institucional (SMC)</p>
              <p className="text-[#e6edf3] text-sm leading-relaxed">{analise.justificativa_completa_institucional}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {analise.padroes_detectados && analise.padroes_detectados.map((padrao: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-bold text-[#8b949e] uppercase">
                    {padrao}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#30363d] flex justify-end">
                <button 
                  onClick={() => { setImagemFinal(null); setAnalise(null); }} 
                  className="bg-[#0d1117] hover:bg-[#30363d] border border-[#30363d] text-white px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
                >
                  Nova Análise
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}