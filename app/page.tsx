"use client";
import { useEffect, useState } from "react";

export default function AnalisePage() {
  const [analise, setAnalise] = useState<any>(null);
  const [imagemFinal, setImagemFinal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cupom, setCupom] = useState("");
  const [emailCompra, setEmailCompra] = useState("");
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null);
  const [statusAcesso, setStatusAcesso] = useState("aguardando");
  const [mensagemStatus, setMensagemStatus] = useState("Aguardando liberação.");
  const [codigoVenda, setCodigoVenda] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const acessoSalvo = sessionStorage.getItem("oracle_acesso_liberado");
    const codigoSalvo = sessionStorage.getItem("oracle_codigo_venda");

    if (acessoSalvo === "true") {
      setAcessoLiberado(true);
      setStatusAcesso("liberado");
      setMensagemStatus("Acesso liberado com sucesso.");
      if (codigoSalvo) setCodigoVenda(codigoSalvo);
    }
  }, []);

  const processarAcesso = async () => {
    const textoCupom = cupom.trim().toUpperCase();

    if (textoCupom) {
      setLoading(true);

      try {
        const validar = await fetch("https://oracle-analises.onrender.com/validar-cupom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ cupom: textoCupom })
        });

        const respostaCupom = await validar.json();

        if (validar.ok && respostaCupom.status === "liberado") {
          setAcessoLiberado(true);
          setStatusAcesso("liberado");
          setMensagemStatus("Acesso liberado por cupom.");
          sessionStorage.setItem("oracle_acesso_liberado", "true");
          setLoading(false);
          return;
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    setLinkPagamento(null);

    try {
      const payload = { cupom: cupom.trim() };

      const res = await fetch("https://oracle-analises.onrender.com/criar-pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.init_point) {
        setLinkPagamento(data.init_point);
        window.location.assign(data.init_point);
      } else {
        alert("Falha ao gerar checkout PerfectPay: " + JSON.stringify(data));
      }
    } catch (err: any) {
      alert("Falha ao conectar com o servidor de pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const liberarPorEmail = async () => {
    const email = emailCompra.trim().toLowerCase();

    if (!email) {
      alert("Digite o mesmo e-mail usado na compra.");
      return;
    }

    setLoading(true);
    setStatusAcesso("verificando");
    setMensagemStatus("Verificando pagamento aprovado pelo e-mail informado...");

    try {
      const res = await fetch("https://oracle-analises.onrender.com/verificar-venda-por-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.aprovada) {
        setAcessoLiberado(true);
        setStatusAcesso("liberado");
        setMensagemStatus("Pagamento confirmado com sucesso.");
        setCodigoVenda(data.codigo_venda || null);
        sessionStorage.setItem("oracle_acesso_liberado", "true");
        if (data.codigo_venda) {
          sessionStorage.setItem("oracle_codigo_venda", data.codigo_venda);
        }
      } else {
        setStatusAcesso("pendente");
        setMensagemStatus("Nenhuma venda aprovada encontrada para este e-mail.");
      }
    } catch (err) {
      setStatusAcesso("erro");
      setMensagemStatus("Erro ao validar a compra pelo e-mail.");
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

  const resetarSessao = () => {
    setAcessoLiberado(false);
    setImagemFinal(null);
    setAnalise(null);
    setLinkPagamento(null);
    setCupom("");
    setEmailCompra("");
    setStatusAcesso("aguardando");
    setMensagemStatus("Sessão resetada.");
    setCodigoVenda(null);

    sessionStorage.removeItem("oracle_acesso_liberado");
    sessionStorage.removeItem("oracle_codigo_venda");

    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, "/analise");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        <header className="bg-[#161b22] p-6 rounded-3xl border border-[#30363d] flex justify-between items-center shadow-xl">
          <h1 className="text-xl font-black italic text-white uppercase tracking-tighter">
            Oracle<span className="text-[#0070f3]">.AI</span> Terminal
          </h1>
          <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest bg-[#0d1117] px-3 py-1 rounded-full border border-[#30363d]">
            Gemini 3 Ultra Pro
          </div>
        </header>

        {!acessoLiberado && !imagemFinal && !loading && !linkPagamento && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-[48px] p-20 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0070f3] to-transparent"></div>
            <h2 className="text-4xl font-black text-white italic">DECIFRE O FLUXO INSTITUCIONAL</h2>
            <p className="text-[#8b949e] max-w-lg mx-auto">
              Nossa inteligência artificial mapeia zonas de liquidez e ordens ocultas em milissegundos.
              A tecnologia dos grandes bancos, agora no seu gráfico.
            </p>

            <div className="max-w-sm mx-auto space-y-4 bg-[#0d1117] p-8 rounded-3xl border border-[#30363d]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-[red]"></div>
                <span className="text-xs font-black tracking-widest text-white uppercase">
                  Terminal de Acesso
                </span>
              </div>

              <input
                type="text"
                placeholder="INSIRA SEU CUPOM (OPCIONAL)"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center text-white outline-none focus:border-[#0070f3] text-sm font-bold uppercase"
              />

              <button
                onClick={processarAcesso}
                className="w-full bg-[#430606] hover:bg-[#5a0808] border border-[red]/20 text-white font-black py-4 rounded-xl transition-all shadow-lg text-sm tracking-widest"
              >
                ADQUIRIR ACESSO — R$ 19,90
              </button>

              <div className="pt-4 border-t border-[#30363d] space-y-3">
                <input
                  type="email"
                  placeholder="DIGITE O E-MAIL USADO NA COMPRA"
                  value={emailCompra}
                  onChange={(e) => setEmailCompra(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center text-white outline-none focus:border-[#00ff7f] text-sm font-bold"
                />

                <button
                  onClick={liberarPorEmail}
                  className="w-full bg-[#0d1117] hover:bg-[#111827] border border-[#00ff7f]/30 text-[#00ff7f] font-black py-4 rounded-xl transition-all shadow-lg text-sm tracking-widest"
                >
                  JÁ PAGUEI / LIBERAR ACESSO
                </button>
              </div>
            </div>

            {(statusAcesso === "pendente" || statusAcesso === "erro" || statusAcesso === "verificando") && (
              <div className="max-w-xl mx-auto mt-6 bg-[#0b1220] border border-[#30363d] rounded-2xl p-4">
                <p className={`text-sm font-bold ${
                  statusAcesso === "erro"
                    ? "text-[red]"
                    : statusAcesso === "pendente"
                    ? "text-[#f0b90b]"
                    : "text-[#0070f3]"
                }`}>
                  {mensagemStatus}
                </p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#0070f3] rounded-full animate-spin"></div>
            <div className="text-[#0070f3] font-black tracking-widest text-sm animate-pulse uppercase">
              PROCESSANDO...
            </div>
            <p className="text-[#8b949e] text-sm text-center max-w-md">
              {mensagemStatus}
            </p>
          </div>
        )}

        {linkPagamento && !loading && (
          <div className="bg-[#161b22] border border-[#00ff7f]/30 rounded-[48px] p-20 text-center space-y-8 shadow-[0_0_50px_rgba(0,255,127,0.05)] relative overflow-hidden animate-in zoom-in duration-500">
            <h2 className="text-4xl font-black text-white italic">CHECKOUT LIBERADO</h2>
            <p className="text-[#8b949e] max-w-md mx-auto">
              Seu acesso foi preparado. Clique no botão abaixo para prosseguir com o pagamento seguro.
            </p>
            <a
              href={linkPagamento}
              className="inline-block w-full max-w-sm bg-[#00ff7f] hover:bg-[#00cc66] text-black font-black py-5 rounded-xl transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              FINALIZAR PAGAMENTO
            </a>
          </div>
        )}

        {acessoLiberado && !imagemFinal && !loading && !linkPagamento && (
          <div className="space-y-6">
            <div className="bg-[#161b22] border border-[#00ff7f]/20 rounded-3xl px-6 py-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-[#00ff7f] uppercase font-black tracking-widest mb-1">
                  Status do Terminal
                </p>
                <h3 className="text-lg font-black text-white uppercase italic">
                  Acesso liberado com sucesso
                </h3>
                <p className="text-xs text-[#8b949e] mt-2">{mensagemStatus}</p>
                {codigoVenda && (
                  <p className="text-xs text-[#8b949e] mt-1">Código da venda: {codigoVenda}</p>
                )}
              </div>

              <button
                onClick={resetarSessao}
                className="bg-[#0d1117] border border-[#30363d] text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase"
              >
                Resetar Sessão
              </button>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] border-dashed rounded-[48px] p-24 flex flex-col items-center justify-center relative cursor-pointer group shadow-2xl hover:border-[#0070f3] transition-colors duration-300">
              <input
                type="file"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-20 h-20 bg-[#0d1117] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔭</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic">Scanner Ativo</h2>
              <p className="text-[#8b949e] text-sm mt-3 text-center max-w-sm">
                Arraste seu gráfico para análise.
              </p>
            </div>
          </div>
        )}

        {imagemFinal && analise && !linkPagamento && (
          <div className="space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-3xl flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">
                  Sinal
                </p>
                <h3
                  className={`text-3xl font-black italic uppercase ${
                    analise.direcao.includes("COMPRA") ? "text-[#00ff7f]" : "text-[red]"
                  }`}
                >
                  {analise.direcao}
                </h3>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-[#30363d] bg-[#161b22] p-2 shadow-xl max-w-4xl mx-auto">
              <img src={imagemFinal} className="w-full h-auto rounded-[22px]" alt="Análise" />
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-3xl max-w-4xl mx-auto text-center">
              <p className="text-[10px] text-[#0070f3] uppercase font-black tracking-widest mb-4">
                Laudo Técnico Institucional (SMC)
              </p>
              <p className="text-[#e6edf3] text-sm leading-relaxed">
                {analise.justificativa_completa_institucional}
              </p>
              <button
                onClick={() => {
                  setImagemFinal(null);
                  setAnalise(null);
                }}
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
