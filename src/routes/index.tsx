import React, { useState } from 'react';
import { Calculator, Plus, Trash2, X, Printer, Tag } from 'lucide-react';

interface AcrescimoItem {
  id: number;
  descricao: string;
  valor: number;
}

export default function Index() {
  const [malha, setMalha] = useState('');
  const [cor, setCor] = useState('');
  const [modelo, setModelo] = useState('');
  const [insumo, setInsumo] = useState('');
  const [acrescimo, setAcrescimo] = useState('NAO');
  const [acrescimosList, setAcrescimosList] = useState<AcrescimoItem[]>([]);
  const [valorKg, setValorKg] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [metragem, setMetragem] = useState('');
  const [margemLucro, setMargemLucro] = useState('');

  // Estado do Modal de Resultado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultado, setResultado] = useState({
    modelo: '',
    malhaCor: '',
    valorMetro: 0,
    valorBase: 0,
    insumoVal: 0,
    totalAcrescimos: 0,
    margemVal: 0,
    valorFinal: 0,
  });

  const handleAcrescimoChange = (value: string) => {
    setAcrescimo(value);
    if (value === 'SIM' && acrescimosList.length === 0) {
      setAcrescimosList([{ id: Date.now(), descricao: '', valor: 0 }]);
    } else if (value === 'NAO') {
      setAcrescimosList([]);
    }
  };

  const addAcrescimoRow = () => {
    setAcrescimosList([...acrescimosList, { id: Date.now(), descricao: '', valor: 0 }]);
  };

  const removeAcrescimoRow = (id: number) => {
    setAcrescimosList(acrescimosList.filter(item => item.id !== id));
  };

  const updateAcrescimoItem = (id: number, field: 'descricao' | 'valor', value: string | number) => {
    setAcrescimosList(
      acrescimosList.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calcularPreco = () => {
    const numValorKg = parseFloat(valorKg) || 0;
    const numRendimento = parseFloat(rendimento) || 0;
    const numMetragem = parseFloat(metragem) || 0;
    const numInsumo = parseFloat(insumo) || 0;
    const numMargemLucro = parseFloat(margemLucro) || 0;

    if (!malha || !cor || !modelo || numValorKg === 0 || numRendimento === 0 || numMetragem === 0) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // FÓRMULA: (VALOR DO KG / RENDIMENTO) * METRAGEM DA PEÇA = VALOR BASE
    const valorMetro = numValorKg / numRendimento;
    const valorBase = valorMetro * numMetragem;

    // Acréscimos
    let totalAcrescimos = 0;
    if (acrescimo === 'SIM') {
      acrescimosList.forEach(item => {
        totalAcrescimos += Number(item.valor) || 0;
      });
    }

    // VALOR FINAL = VALOR BASE + INSUMO + ACRÉSCIMO + MARGEM DE LUCRO
    const valorFinal = valorBase + numInsumo + totalAcrescimos + numMargemLucro;

    setResultado({
      modelo,
      malhaCor: `${malha} (${cor})`,
      valorMetro,
      valorBase,
      insumoVal: numInsumo,
      totalAcrescimos,
      margemVal: numMargemLucro,
      valorFinal,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-[#141414] border-b border-zinc-800 py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-black border border-zinc-700 flex items-center justify-center p-1 overflow-hidden shadow-inner">
              <svg viewBox="0 0 500 500" className="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
                <polygon points="250,30 450,450 50,450" fill="none" stroke="#dc2626" strokeWidth="15"/>
                <polygon points="250,470 50,70 450,70" fill="none" stroke="#ffffff" strokeWidth="15"/>
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-wider text-white">
              PRECIFICAÇÃO<span className="text-red-600">.</span>VESTUÁRIO
            </h1>
          </div>
          <span className="text-xs text-zinc-400 uppercase tracking-widest border border-zinc-800 px-2.5 py-1 rounded">
            Sistema de Custos
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-[#1f1f1f] border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-600" /> Ficha Técnica e Custos
            </h2>
            <p className="text-sm text-zinc-400">Preencha os campos abaixo para calcular o valor final da peça.</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. MALHA, COR E MODELO ALINHADOS NO TOPO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Malha</label>
                <input
                  type="text"
                  value={malha}
                  onChange={e => setMalha(e.target.value)}
                  placeholder="Ex: Algodão Penteado 30.1"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Cor</label>
                <input
                  type="text"
                  value={cor}
                  onChange={e => setCor(e.target.value)}
                  placeholder="Ex: Preto / Off-White"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Modelo</label>
                <input
                  type="text"
                  value={modelo}
                  onChange={e => setModelo(e.target.value)}
                  placeholder="Ex: Camiseta Oversized"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
            </div>

            {/* 2. SEQUÊNCIA LINEAR: Valor do KG, Rendimento, Metragem, Insumo */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Valor do KG (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorKg}
                  onChange={e => setValorKg(e.target.value)}
                  placeholder="Ex: 35.00"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Rendimento (M)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rendimento}
                  onChange={e => setRendimento(e.target.value)}
                  placeholder="Ex: 2.5"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Metragem da Peça (M)</label>
                <input
                  type="number"
                  step="0.01"
                  value={metragem}
                  onChange={e => setMetragem(e.target.value)}
                  placeholder="Ex: 1.80"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Insumo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={insumo}
                  onChange={e => setInsumo(e.target.value)}
                  placeholder="Ex: 5.00"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
            </div>

            {/* 3. LOGO ABAIXO: ACRÉSCIMO */}
            <div className="bg-[#0a0a0a]/50 border border-zinc-800 rounded-xl p-4">
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">Acréscimo</label>
              <select
                value={acrescimo}
                onChange={e => handleAcrescimoChange(e.target.value)}
                className="w-full sm:w-48 bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
              >
                <option value="NAO">NÃO</option>
                <option value="SIM">SIM</option>
              </select>

              {acrescimo === 'SIM' && (
                <div className="mt-4 space-y-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-red-600">Custos Adicionais</span>
                    <button
                      type="button"
                      onClick={addAcrescimoRow}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Campo
                    </button>
                  </div>
                  <div className="space-y-2">
                    {acrescimosList.map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Descrição (Ex: Estampa)"
                          value={item.descricao}
                          onChange={e => updateAcrescimoItem(item.id, 'descricao', e.target.value)}
                          className="flex-grow bg-[#0a0a0a] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Valor (R$)"
                          value={item.valor || ''}
                          onChange={e => updateAcrescimoItem(item.id, 'valor', parseFloat(e.target.value) || 0)}
                          className="w-28 bg-[#0a0a0a] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeAcrescimoRow(item.id)}
                          className="bg-zinc-800 hover:bg-red-600 text-white p-2 rounded-lg transition text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. LOGO ABAIXO: MARGEM DE LUCRO */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Margem de Lucro (R$)</label>
              <input
                type="number"
                step="0.01"
                value={margemLucro}
                onChange={e => setMargemLucro(e.target.value)}
                placeholder="Ex: 15.00"
                className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>

            {/* BOTÃO DE CALCULAR */}
            <div className="pt-4">
              <button
                type="button"
                onClick={calcularPreco}
                className="w-full bg-white hover:bg-zinc-200 text-[#0a0a0a] font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-5 h-5" /> Calcular Valor da Peça
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE RESULTADO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f1f] border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-600" /> Resultado da Precificação
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Modelo:</span> <span className="font-semibold text-white">{resultado.modelo}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Malha / Cor:</span> <span className="font-semibold text-white">{resultado.malhaCor}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Valor do Metro:</span> <span className="font-semibold text-white">R$ {resultado.valorMetro.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Valor Base (Malha):</span> <span className="font-semibold text-white">R$ {resultado.valorBase.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Insumo:</span> <span className="font-semibold text-
