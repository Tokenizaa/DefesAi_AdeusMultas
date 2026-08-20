import React from 'react';
import {
  FileText,
  Scale,
  Building,
  UserCheck,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { USER_PROCESS_STAGES, UserProcessStage } from '../../../core/onboarding/rules-matrix';

interface DefenseStageStepProps {
  selectedStage: UserProcessStage;
  onSelectStage: (stage: UserProcessStage) => void;
  onBack: () => void;
}

export const DefenseStageStep: React.FC<DefenseStageStepProps> = ({
  selectedStage,
  onSelectStage,
  onBack,
}) => {
  const getIcon = (id: UserProcessStage) => {
    switch (id) {
      case 'primeira_notificacao':
        return <FileText className="w-5 h-5" />;
      case 'notificacao_penalidade':
        return <Scale className="w-5 h-5" />;
      case 'defesa_negada':
        return <Scale className="w-5 h-5" />;
      case 'recurso_jari_negado':
        return <Building className="w-5 h-5" />;
      case 'conversao_advertencia':
        return <UserCheck className="w-5 h-5" />;
      case 'nao_tenho_certeza':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
      {/* Header com pergunta direta e acolhedora - melhorada */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-blue-50 text-[#155BCB] border border-blue-200 font-mono">
          <Sparkles className="w-4 h-4 text-[#155BCB]" />
          Passo 2 de 10 • Fase do processo
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          Em que situação está sua multa?
        </h1>
        <p className="text-base text-sm leading-relaxed max-w-lg mx-auto mb-4">
          Isso define onde seu recurso será julgado.
        </p>
      </div>

      {/* Grid de opções de fase - layout otimizado para melhor escaneabilidade e toque */}
      <div className="grid gap-5 sm:grid-cols-2">
        {USER_PROCESS_STAGES.map((stg) => {
          const isSelected = selectedStage === stg.id;
          return (
            <button
              key={stg.id}
              id={`stage-option-${stg.id}`}
              onClick={() => onSelectStage(stg.id)}
              className={`group flex flex-col items-start p-5 sm:p-6 border rounded-xl shadow hover:shadow-md transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#155BCB] bg-blue-50'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex w-full items-start gap-4 mb-3">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#155BCB] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {getIcon(stg.id)}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-slate-900">{stg.title}</h3>
                  <p className="text-slate-600">{stg.subtitle}</p>
                </div>
              </div>

              <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-2 text-xs font-mono">
                  {stg.badge}
                </span>
                <span className="text-sm font-medium text-[#155BCB] group-hover:underline">
                  Continuar
                </span>
              </div>
            }
          );
        })}
      </div>

      {/* Navigation - melhorada */}
      <div className="pt-5 flex justify-start">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Voltar</span>
        </button>
      </div>
    </div>
  );
};
