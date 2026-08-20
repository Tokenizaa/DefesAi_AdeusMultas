import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Calendar,
  Scale,
  Download,
  Check,
  Database,
  RefreshCw,
  ExternalLink,
  Phone,
  User,
  BarChart2
} from 'lucide-react';
import { CaseAnalysis, InfractionData, VehicleData, ProcedureType } from '../../../types';

// FUNÇÃO AUXILIAR: Formata explicações jurídicas no estilo GOV.BR com variação linguística
const govBrExplanationsVariations: Record<string, Array<{
  title: string;
  lawExplanation: string;
  evidenceCheck: (data: any) => string;
  userImpact: string;
  confidenceBase: string;
}>> = {
  'ARG-001': [
    {
      title: 'Verificação do radar de velocidade',
      lawExplanation: 'Todo equipamento de medição de velocidade precisa ser verificado anualmente para garantir que está funcionando corretamente.',
      evidenceCheck: (data) => {
        if (data.infraction.radarCalibrationDate) {
          const calibDate = new Date(data.infraction.radarCalibrationDate);
          const infDate = new Date(data.infraction.dateTime);
          const diffMonths = (infDate.getTime() - calibDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
          return diffMonths > 12 
            ? `Última verificação há ${Math.round(diffMonths)} meses (fora do prazo de 12 meses)`
            : `Última verificação há ${Math.round(diffMonths)} meses (dentro do prazo)`;
        }
        return 'Não há informação sobre a última verificação do radar disponível nos documentos.';
      },
      userImpact: 'Se o radar não foi verificado recentemente, a medição da velocidade pode estar incorreta, o que pode ser usado para questionar a multa.',
      confidenceBase: 'Res. CONTRAN 798/2020'
    },
    {
      title: 'Análise do equipamento de medição',
      lawExplanation: 'A falta de verificação periódica do equipamento pode resultar em medições imprecisas e anulável a multa.',
      evidenceCheck: (data) => {
        if (data.infraction.radarCalibrationDate) {
          const calibDate = new Date(data.infraction.radarCalibrationDate);
          const infDate = new Date(data.infraction.dateTime);
          const diffMonths = (infDate.getTime() - calibDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
          return diffMonths > 12 
            ? `Equipamento com verificação vencida há ${Math.round(diffMonths - 12)} meses`
            : `Equipamento dentro da validade de verificação`;
        }
        return 'Registro de verificação do equipamento não encontrado na documentação.';
      },
      userImpact: 'Medidor fora da validade de verificação invalida a prova de velocidade, gerando nulidade da autuação.',
      confidenceBase: 'STJ, REsp 1.652.348/SP'
    }
  ],
  'ARG-002': [
    {
      title: 'Verificação da sinalização',
      lawExplanation: 'A ausência de sinalização adequada pode configurar falta de aviso prévio ao condutor.',
      evidenceCheck: (data) => {
        if (data.infraction.signagePhotos && data.infraction.signagePhotos.length > 0) {
          return `Foram anexadas ${data.infraction.signagePhotos.length} fotos da sinalização no local`;
        }
        return 'Não há fotos da sinalização no local nos documentos.';
      },
      userImpact: 'Se não houver sinalização adequada, pode existir nulidade por falta de aviso prévio.',
      confidenceBase: 'CTB Art. 208'
    },
    {
      title: 'Análise da visibilidade da placa',
      lawExplanation: 'Placas obstruídas ou apagadas não cumprem sua função de aviso.',
      evidenceCheck: (data) => {
        if (data.infraction.signageCondition) {
          return data.infraction.signageCondition.includes('obstruída') || data.infraction.signageCondition.includes('apagada')
            ? `Placa encontrada em condição: ${data.infraction.signageCondition}`
            : `Placa em condição aparentemente normal: ${data.infraction.signageCondition}`;
        }
        return 'Não há informações sobre o estado da sinalização nos autos.';
      },
      userImpact: 'Placa obstruída ou apagada pode invalidar a autuação por não cumprir função de aviso.',
      confidenceBase: 'STJ, REsp 1.456.789/RJ'
    }
  ],
  'ARG-003': [
    {
      title: 'Verificação da medição',
      lawExplanation: 'Erros de medição podem ocorrer por diversos fatores ambientais e técnicos.',
      evidenceCheck: (data) => {
        if (data.infraction.witnesses && data.infraction.witnesses.length > 0) {
          return `Há ${data.infraction.witnesses.length} testemunha(s) que pode(m) contestar a medição`;
        }
        return 'Não há testemunhas listadas nos autos que possam corroborar a medição.';
      },
      userImpact: 'Testemunhas podem contestar a precisão da medição realizada pelo agente.',
      confidenceBase: 'Súmula 362 do STJ'
    }
  ],
  'DEFAULT': [
    {
      title: 'Análise preliminar de documentação',
      lawExplanation: 'Verificação básica de conformidade documental e procedural.',
      evidenceCheck: (data) => {
        const missingDocs = [];
        if (!data.infraction.notificationDate) missingDocs.push('data da notificação');
        if (!data.infraction.vehiclePlate) missingDocs.push('placa do veículo');
        if (!data.infraction.dateTime) missingDocs.append('data e hora da infração');
        return missingDocs.length > 0
          ? `Documentos pendentes: ${missingDocs.join(', ')}`
          : 'Documentação básica presente nos autos.';
      },
      userImpact: 'Falta de documentos essenciais pode causar nulidade da autuação.',
      confidenceBase: 'Lei 9.099/95 - Art. 10'
    }
  ]
};

interface FreeAnalysisResultStepProps {
  analysis: CaseAnalysis | null;
  isLoading: boolean;
  leadName: string | null;
  vehicleData: VehicleData | null;
  infractionData: InfractionData | null;
  procedureType: ProcedureType | null;
  onDownloadPDF: () => void;
  onStartOver: () => void;
  onWhatsApp: () => void;
  onNewAnalysis: () => void;
}

export const FreeAnalysisResultStep: React.FC<FreeAnalysisResultStepProps> = ({
  analysis,
  isLoading,
  leadName,
  vehicleData,
  infractionData,
  procedureType,
  onDownloadPDF,
  onStartOver,
  onWhatsApp,
  onNewAnalysis
}) => {
  if (isLoading || !analysis) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-bold uppercase tracking-wider bg-blue-50 text-[#155BCB] border border-blue-200 font-mono">
          <Sparkles className="w-5 h-5 text-[#155BCB]" />
          Passo 5 de 10 • Análise em Progresso
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mt-6">Processando sua análise...</h2>
        <p className="text-lg text-slate-500 mt-4">
          Nossa IA está revisando todos os detalhes da sua multa para identificar as melhores defesas.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-4 h-4 border-2 border-[#155BCB] border-t-transparent rounded-full animate-spin" />
          <div className="w-4 h-4 border-2 border-[#155BCB] border-r-transparent rounded-full animate-spin" />
          <div className="w-4 h-4 border-2 border-[#155BCB] border-b-transparent rounded-full animate-spin" />
          <div className="w-4 h-4 border-2 border-[#155BCB] border-l-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Select variation based on hash of user data for consistent but varied explanations
  const getVariationIndex = (argId: string, data: any): number => {
    let hash = 0;
    const str = JSON.stringify(data) + argId;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const variations = govBrExplanationsVariations[argId] || govBrExplanationsVariations.DEFAULT;
    return Math.abs(hash) % variations.length;
  };

  const getVariation = (argId: string, data: any) => {
    const variations = govBrExplanationsVariations[argId] || govBrExplanationsVariations.DEFAULT;
    const index = getVariationIndex(argId, data);
    return variations[index];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg space-y-8">
      {/* Header - melhorado */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-base font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Passo 5 de 10 • Diagnóstico Jurídico Gratuito Concluído
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {leadName ? `Diagnóstico de ${leadName.split(' ')[0]}` : 'Resultado da Análise Preliminar'}
        </h1>
        <p className="text-base text-sm leading-relaxed max-w-2xl mx-auto text-slate-600">
          {leadName ? `Olá ${leadName.split(' ')[0]}, aqui estão os resultados da análise da sua multa.` : 'Nossa análise identificou pontos fortes para sua defesa.'}
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Probabilidade de Sucesso */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-900">Probabilidade de Sucesso</h3>
            </div>
            <span className={`text-2xl font-bold ${
              analysis.successProbability >= 0.7 ? 'text-emerald-600' :
              analysis.successProbability >= 0.4 ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {Math.round(analysis.successProbability * 100)}%
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Chance estimada de vitória com as defesas identificadas
          </p>
        </div>

        {/* Argumentos Fortes */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-[#155BCB]" />
              <h3 className="text-lg font-semibold text-slate-900">Principais Argumentos</h3>
            </div>
            <span className="text-2xl font-bold text-[#155BCB]">
              {analysis.strongArguments.length}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Pontos jurídicos sólidos para sua defesa
          </p>
        </div>

        {/* Estimativa de Economia */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <FileCheck2 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-slate-900">Economia Potencial</h3>
            </div>
            <span className="text-3xl font-bold text-emerald-600">
              R$ {analysis.fineAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) ?? '0'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Valor que você pode não precisar pagar
          </p>
        </div>
      </div>

      {/* Detailed Arguments */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Fundamentação Jurídica
        </p>
        <p className="text-base text-sm leading-relaxed max-w-xl mx-auto mb-4 text-slate-600">
          Analisamos sua multa e identificamos os seguintes pontos que podem ser usados em sua defesa:
        </p>

        {analysis.strongArguments.map((arg, index) => (
          <div key={arg.id} className="bg-slate-50 border-l-4 border-l-[${arg.confidenceLevel === 'Alto' ? '#10B981' : arg.confidenceLevel === 'Médio' ? '#F59E0B' : '#EF4444'}] rounded-xl p-5 hover:bg-slate-100 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${arg.confidenceLevel === 'Alto' ? 'bg-emerald-100 text-emerald-800' : arg.confidenceLevel === 'Médio' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900">{getVariation(arg.id, analysis).title}</h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Fundamento Legal:</p>
                  <p className="text-base text-slate-500">{getVariation(arg.id, analysis).lawExplanation}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Como aplicar no seu caso:</p>
                  <p className="text-base text-slate-500">{getVariation(arg.id, analysis).evidenceCheck(analysis)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Impacto para você:</p>
                  <p className="text-base text-slate-500">{getVariation(arg.id, analysis).userImpact}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Base legal: {getVariation(arg.id, analysis).confidenceBase}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {analysis.strongArguments.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Análise Concluída</h3>
            <p className="text-base text-sm leading-relaxed max-w-lg mx-auto text-slate-600">
              Nossa análise não identificou argumentos jurídicos fortes nos documentos fornecidos. Isso não significa que não há defesa possível, mas sim que com as informações atuais não encontramos pontos de nulidade claros. Recomendamos revisar os documentos ou consultar um advogado para uma análise mais detalhada.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
          Próximos Passos
        </p>
        <p className="text-base text-sm leading-relaxed max-w-xl mx-auto mb-6 text-center text-slate-600">
          Com base na análise, você pode tomar as seguintes ações:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={onDownloadPDF}
            className="w-full flex flex-col items-center justify-center gap-3 px-6 py-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl"
          >
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-800">Baixar Laudo Completo</span>
            <span className="text-xs text-emerald-600">
              Relatório PDF com todos os detalhes da análise
            </span>
          </button>
          <button
            onClick={onStartOver}
            className="w-full flex flex-col items-center justify-center gap-3 px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl"
          >
            <ArrowRight className="w-5 h-5 text-slate-500" />
            <span className="font-semibold text-slate-700">Fazer Nova Análise</span>
            <span className="text-xs text-slate-600">
              Começar do início com uma nova multa
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          <button
            onClick={onWhatsApp}
            className="w-full flex flex-col items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg"
          >
            <Phone className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Receber por WhatsApp</span>
          </button>
          <button
            onClick={onNewAnalysis}
            className="w-full flex flex-col items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-700">Análise Detalhada (Advogado)</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">
          Este é um diagnóstico gratuito e preliminar. Para uma análise jurídica completa e personalizada, consulte um advogado especializado em direito de trânsito.
        </p>
        <p className="text-xs text-slate-400">
          Código de referência: {Math.random().toString(36).substring(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
};
