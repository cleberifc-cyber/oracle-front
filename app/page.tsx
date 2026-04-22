"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, Zap, Shield, ChevronRight, Loader2 } from "lucide-react";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // SEU LINK OFICIAL DO RENDER
  const API_URL = "https://oracle-analises.onrender.com"; 

  const gerarPagamento = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/criar-pagamento`, { method: "POST" });
      const data = await response.json();
      
      if (data.init_point) {
        window.open(data.init_point, "_blank");
      } else {
        alert("Erro ao gerar pagamento.");
      }
    } catch (error) {
      alert("Servidor Offline. Verifique o Render.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files?.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center p-8 font-sans selection:bg-emerald-500/30">
      
      {/* Header Estilo Institucional */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex justify-between items-center mb-16"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-semibold text-xl tracking-wide text-white">ORACLE<span className="text-emerald-500">.AI</span></span>
        </div>
        <div className="text-[10px] text-neutral-600 uppercase tracking-widest border border-neutral-800 px-3 py-1 rounded-full">
          Institutional Engine v1.0
        </div>
      </motion.header>

      {/* Título Premium */}
      <div className="text-center max-w-2xl mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
        >
          Análise Institucional de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Price Action Puro</span>
        </motion.h1>
        <p className="text-neutral-400 text-lg">
          Mapeamento de liquidez e fluxo de ordens via Inteligência Artificial.
        </p>
      </div>

      {/* Box de Upload/Pagamento */}
      <motion.main className="w-full max-w-3xl relative">
        <div className="absolute -inset-0.5 bg-emerald-500/10 rounded-2xl blur-xl"></div>
        
        <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-8 backdrop-blur-md">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isHovering ? "border-emerald-500 bg-emerald-500/5" : "border-neutral-700 bg-neutral-950/50"
            }`}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div key="upload" className="flex flex-col items-center">
                  <UploadCloud className="w-12 h-12 mb-4 text-neutral-500" />
                  <h3 className="text-xl font-medium text-white mb-2">Arraste seu Gráfico Aqui</h3>
                  <p className="text-neutral-500 text-sm mb-8">Formatos suportados: PNG, JPG</p>
                  
                  <button 
                    onClick={gerarPagamento}
                    disabled={loading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>DESBLOQUEAR ANÁLISE — R$ 19,90 <ChevronRight className="w-4 h-4" /></>}
                  </button>
                  <p className="text-[10px] text-neutral-600 mt-6 flex items-center gap-1 uppercase tracking-widest">
                    <Shield className="w-3 h-3" /> Transação Criptografada via Mercado Pago
                  </p>
                </motion.div>
              ) : (
                <motion.div key="success" className="flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-medium text-white">Gráfico Identificado</h3>
                  <p className="text-emerald-500/60 text-sm mb-6">{file.name}</p>
                  <button onClick={() => setFile(null)} className="text-xs text-neutral-500 hover:text-white underline font-light">Substituir Arquivo</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
    </div>
  );
}