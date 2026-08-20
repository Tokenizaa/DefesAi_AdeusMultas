import React from 'react';
import {
  Gauge,
  Beer,
  Smartphone,
  CircleSlash2,
  ParkingCircle,
  HelpCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export type InfractionTypeOption = 'radar' | 'lei_seca' | 'celular' | 'vermelho' | 'estacionamento' | 'cnh_suspensao' | 'outro';

interface InfractionTypeStepProps {
  selectedType: InfractionTypeOption;
  onSelectType: (type: InfractionTypeOption) => void;
  onBack: () => void;
}

export const InfractionTypeStep: React.FC<InfractionTypeStepProps> = ({
  selectedType,
  onSelectType,
  onBack,
}) => {
  const options = [
    { value: 'radar', icon: <Gauge className="w-4 h-4" />, title: 'Excesso de Velocidade (Radar)', description: 'Art. 218 do CTB. Radar fixo, estático ou portátil.' },
    { value: 'lei_seca', icon: <Beer className="w-4 h-4" />, title: 'Lei Seca / Bafômetro / Recusa', description: 'Art. 165 e 165-A do CTB. Recusa ao teste ou ausência de Termo de Sinais.' },
    { value: 'celular', icon: <Smartphone className="w-4 h-4" />, title: 'Celular ao Volante / GPS', description: 'Art. 252 do CTB. Aparelho no suporte veicular ou sem abordagem presencial.' },
    { value: 'vermelho', icon: <CircleSlash2 className="w-4 h-4" />, title: 'Avanço de Sinal / Faixa Exclusiva', description: 'Art. 208 e 184 do CTB. Tempo de amarelo insuficiente ou travamento no cruzamento.' },
    { value: 'estacionamento', icon: <ParkingCircle className="w-4 h-4" />, title: 'Estacionamento / Parada', description: 'Art. 181 do CTB. Falta de placa R-6a visível, vaga de carga/descarga ou pane mecânica justificada.' },
    { value: 'cnh_suspensao', icon: <HelpCircle className="w-4 h-4" />, title: 'CNH Suspensa / Cassação', description: 'Art. 261 do CTB. Dirigir com CNH suspensa ou cassada.' },
    { value: 'outro', icon: <HelpCircle className="w-4 h-4" />, title: 'Outra Infração do CTB', description: 'Qualquer outra infração prevista no Código de Trânsito Brasileiro.' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 font-mono">
          <Sparkles className="w-3 h-3 text-orange-500" />
          Passo 3 de 4 • Tipo
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Qual foi o motivo da autuação?
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Selecione o tipo de infração para começar a análise.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onSelectType(option.value)}
            className={`group flex flex-col items-start p-4 border rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-orange-200/50 ${
              selectedType === option.value
                ? 'border-orange-50 bg-orange-50/50'
                : 'border-slate-200'
            }`}
          >
            <div className="flex w-full items-start gap-3 mb-2">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedType === option.value ? 'bg-orange-50' : 'bg-slate-100 text-slate-700'}`}>
                  {option.icon}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-slate-900">{option.title}</h3>
                <p className="text-slate-600 text-sm">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-3 flex justify-start">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
};
