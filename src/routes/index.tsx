import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import logo from '@/assets/aleti-logo.png.asset.json';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Aleti — Precificação Vestuário' },
    { name: 'description', content: 'Calcule o custo e o preço final das suas peças de vestuário.' },
    { property: 'og:title', content: 'Aleti — Precificação Vestuário' },
    { property: 'og:description', content: 'Calcule o custo e o preço final das suas peças de vestuário.' },
  ] }),
  component: Index,
});
import { Calculator, Plus, Trash2, X, Printer, Tag } from 'lucide-react';

interface AcrescimoItem {
  id: number;
  descricao: string;
  valor: number;
}

function Index() {
  const [malha, setMalha] = useState('');
  const [cor, setCor] = useState('');
  const [modelo, setModelo] = useState('');
  const [insumo, setInsumo] = useState('');
  const [acrescimo, setAcrescimo] = useState('NAO');
  const [acrescimosList, setAcrescimosList] = useState<AcrescimoItem[]>([]);
  const [tamanho, setTamanho] = useState('');
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
    valorBruto: 0,
    totalAcrescimos: 0,
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
    const numTamanho = parseFloat(tamanho) || 0;
    const numValorKg = parseFloat(valorKg) || 0;
    const numRendimento = parseFloat(rendimento) || 0;
    const numMetragem = parseFloat(metragem) || 0;
    const numMargemLucro = parseFloat(margemLucro) || 0;

    if (!malha || !cor || !modelo || numValorKg === 0 || numRendimento === 0 || numTamanho === 0) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Fórmulas: VALOR DO KG / RENDIMENTO = VALOR DO METRO
    const valorMetro = numValorKg / numRendimento;

    // VALOR DO METRO X TAMANHO DA PEÇA = VALOR BRUTO
    const fatorCalculo = numMetragem > 0 ? numMetragem : numTamanho;
    const valorBruto = valorMetro * fatorCalculo;

    // Acréscimos
    let totalAcrescimos = 0;
    if (acrescimo === 'SIM') {
      acrescimosList.forEach(item => {
        totalAcrescimos += Number(item.valor) || 0;
      });
    }

    // VALOR BRUTO + MARGEM DE LUCRO (+ Acréscimos) = VALOR DA PEÇA
    const valorFinal = valorBruto + totalAcrescimos + numMargemLucro;

    setResultado({
      modelo,
      malhaCor: `${malha} (${cor})`,
      valorMetro,
      valorBruto,
      totalAcrescimos,
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
            {/* Logo Aleti */}
            <div className="w-10 h-10 rounded-lg bg-black border border-zinc-700 flex items-center justify-center p-1 overflow-hidden shadow-inner">
              <img src={logo.url} alt="Aleti" className="w-full h-full object-contain" />
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
            {/* DADOS BÁSICOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Insumo</label>
                <input
                  type="text"
                  value={insumo}
                  onChange={e => setInsumo(e.target.value)}
                  placeholder="Ex: Linha, Etiqueta, Viés"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
            </div>

            {/* ACRÉSCIMO SECTION */}
            <div className="bg-[#0a0a0a]/50 border border-zinc-800 rounded-xl p-4">
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">Acréscimo?</label>
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

            {/* PARÂMETROS DE CÁLCULO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Tamanho da Peça</label>
                <input
                  type="number"
                  step="0.01"
                  value={tamanho}
                  onChange={e => setTamanho(e.target.value)}
                  placeholder="Ex: 1.80"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
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
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Rendimento (m/kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rendimento}
                  onChange={e => setRendimento(e.target.value)}
                  placeholder="Ex: 2.5"
                  className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Metragem da Peça</label>
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
                <div className="flex justify-between"><span className="text-zinc-400">Valor Bruto:</span> <span className="font-semibold text-white">R$ {resultado.valorBruto.toFixed(2)}</span></div>
                {resultado.totalAcrescimos > 0 && (
                  <div className="flex justify-between border-t border-zinc-800 pt-2">
                    <span className="text-zinc-400">Total Acréscimos:</span>
                    <span className="font-semibold text-white">R$ {resultado.totalAcrescimos.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="bg-red-600/10 border border-red-600/30 p-4 rounded-xl text-center">
                <span className="text-xs uppercase font-bold text-red-600 tracking-wider block mb-1">Valor Final da Peça</span>
                <span className="text-3xl font-black text-white">R$ {resultado.valorFinal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-6 text-xs text-zinc-400 border-t border-zinc-900 mt-auto">
        PRECIFICAÇÃO.VESTUÁRIO &copy; 2026 - Todos os direitos reservados.
      </footer>
    </div>
  );
}