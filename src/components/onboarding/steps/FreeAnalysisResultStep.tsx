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
      title: 'Verificação do equipamento de medição',
      lawExplanation: 'Os aparelhos de medição de velocidade precisam de calibração periódica anual junto a instituições acreditadas.',
      evidenceCheck: (data) => {
        if (data.infraction.radarCalibrationDate) {
          const calibDate = new Date(data.infraction.radarCalibrationDate);
          const infDate = new Date(data.infraction.dateTime);
          const diffMonths = (infDate.getTime() - calibDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
          return diffMonths > 12 
            ? `Calibração vencida há ${Math.round(diffMonths)} meses (limite: 12 meses)`
            : `Calibração válida há ${Math.round(diffMonths)} meses`;
        }
        return 'Não há informações sobre a calibração do radar nos autos.';
      },
      userImpact: 'Se houver comprovação de que o radar não estava calibrado corretamente, isso pode invalidar a prova de velocidade.',
      confidenceBase: 'Res. CONTRAN 798/2020'
    },
    {
      title: 'Validade técnica do radar utilizado',
      lawExplanation: 'Equipamentos de fiscalização de velocidade devem passar por verificações anuais conforme a Resolução CONTRAN 798/2020.',
      evidenceCheck: (data) => {
        if (data.infraction.radarCalibrationDate) {
          const calibDate = new Date(data.infraction.radarCalibrationDate);
          const infDate = new Date(data.infraction.dateTime);
          const diffMonths = (infDate.getTime() - calibDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
          return diffMonths > 12 
            ? `Última verificação realizada há ${Math.round(diffMonths)} meses (excede o prazo de 12 meses)`
            : `Verificação dentro do prazo de validade (há ${Math.round(diffMonths)} meses)`;
        }
        return 'Não há registro da data da última averificação do equipamento nos autos.';
      },
      userImpact: 'Se o radar não passou pela verificação anual obrigatória, a prova de velocidade pode ser questionada.',
      confidenceBase: 'Res. CONTRAN 798/2020'
    }
  ],
  'ARG-051': [
    {
      title: 'Direito à advertência por escrito (Art. 267 do CTB)',
      lawExplanation: 'Quando a infração é leve ou média e você não cometeu infrações nos últimos 12 meses, a lei exige que a multa seja convertida em advertência por escrito.',
      evidenceCheck: (data) => {
        const infractionCode = data.infraction.infractionCode;
        // Simplificação para demonstração - na prática usaria o catálogo completo
        const isLightOrMedium = ['745-50', '735-80', '736-62', '735-80'].includes(infractionCode); 
        const hasRecentInfractions = data.infraction.hasPreviousInfractionsLast12Months === true;
        
        if (!isLightOrMedium) return 'Infração classificada como grave/gravíssima (não se aplica ao Art. 267)';
        if (hasRecentInfractions) return 'Você teve infrações nos últimos 12 meses, então o direito à advertência não se aplica.';
        return 'Infração leve/média identificada e nenhuma infração recente nos últimos 12 meses.';
      },
      userImpact: 'Você tem direito de converter esta multa em advertência por escrito, o que significa não pagar valor e não perder pontos na CNH.',
      confidenceBase: 'Lei 14.071/2020, art. 267 do CTB'
    },
    {
      title: 'Conversão automática em advertência por lei recente',
      lawExplanation: 'A Lei 14.071/2020 determina que, para infrações leves ou médias sem reincidência recente, a transformação da multa em advertência é obrigatória.',
      evidenceCheck: (data) => {
        const infractionCode = data.infraction.infractionCode;
        const isLightOrMedium = ['745-50', '735-80', '736-62', '735-80'].includes(infractionCode); 
        const hasRecentInfractions = data.infraction.hasPreviousInfractionsLast12Months === true;
        
        if (!isLightOrMedium) return 'Infração de natureza grave ou gravíssima - não se aplica ao Art. 267';
        if (hasRecentInfractions) return 'Existem infrações nos últimos 12 meses - direito à advertência não se aplica.';
        return 'Infração leve/média identificada e nenhuma infração recente nos últimos 12 meses.';
      },
      userImpact: 'Você tem direito adquirente de não pagar a multa e não ter pontos adicionados à sua CNH, conforme determina a lei.',
      confidenceBase: 'Lei 14.071/2020, art. 267 do CTB'
    },
    {
      title: 'Benefício da não reincidência recente (Art. 267 CTB)',
      lawExplanation: 'Se você não cometeu outras infrações nos últimos 12 meses, pode ter direito à advertência por escrito por não reincidência.',
      evidenceCheck: (data) => {
        const infractionCode = data.infraction.infractionCode;
        const isLightOrMedium = ['745-50', '735-80', '736-62', '735-80'].includes(infractionCode); 
        const hasRecentInfractions = data.infraction.hasPreviousInfractionsLast12Months === true;
        
        if (!isLightOrMedium) return 'A infração não é considerada leve ou média segundo o código de trânsito.';
        if (hasRecentInfractions) return 'Foi constatada a existência de infrações nos últimos 12 meses.';
        return 'Infração enquadrada como leve ou média e nenhuma infração recente nos últimos 12 meses confirmada.';
      },
      userImpact: 'Comprovando que não cometeu outras infrações no último ano, você pode evitar tanto o pagamento quanto a perda de pontos na CNH.',
      confidenceBase: 'Lei 14.071/2020, art. 267 do CTB'
    }
  ],
  'ARG-002': [
    {
      title: 'Sinalização de velocidade adequada no local',
      lawExplanation: 'Nenhuma multa pode ser aplicada se a sinalização de velocidade estiver inadequada ou ausente no local.',
      evidenceCheck: (data) => {
        if (data.infraction.hasR19SignageProof === false) return 'Não há comprovação de sinalização regulatória nos documentos.';
        if (data.infraction.hasR19SignageProof === true) return 'Há comprovação de sinalização regulatória nos documentos.';
        return 'Não há informação disponível sobre a sinalização de velocidade no local.';
      },
      userImpact: 'Se houver problemas com a sinalização, isso pode invalidar a multa por velocidade.',
      confidenceBase: 'Art. 90 do CTB, Res. CONTRAN 798/2020'
    },
    {
      title: 'Verificação da placa de limite de velocidade (R-19)',
      lawExplanation: 'Para validar uma medição de velocidade por radar, é necessária a presença da placa R-19 (limite máximo) no local.',
      evidenceCheck: (data) => {
        if (data.infraction.hasR19SignageProof === false) return 'Não há registro da presença da placa R-19 no local da medição.';
        if (data.infraction.hasR19SignageProof === true) return 'A placa R-19 foi constatada nos documentos fiscais.';
        return 'Informação sobre a placa de velocidade não foi fornecida nos autos.';
      },
      userImpact: 'Se não houver a placa de limite de velocidade no trecho da medição, a autuação pode ser anulada por sinalização inadequada.',
      confidenceBase: 'Art. 90 do CTB, Res. CONTRAN 798/2020'
    },
    {
      title: 'Análise da sinalização no local da infração',
      lawExplanation: 'A sinalização de trânsito precisa estar visível, em bom estado e posicionada corretamente para ser válida.',
      evidenceCheck: (data) => {
        if (data.infraction.hasR19SignageProof === false) return 'Não há registro fotográfico ou documental da placa R-19.';
        if (data.infraction.hasR19SignageProof === true) return 'A placa R-19 foi identificada no material probatório.';
        return 'Não há informações sobre a sinalização de velocidade no local nos autos.';
      },
      userImpact: 'Se a placa de limite máximo de velocidade não estiver adequada, isso pode ser usado para questionar a multa.',
      confidenceBase: 'Art. 90 do CTB, Res. CONTRAN 798/2020'
    }
  ]
};

// Função para selecionar aleatoriamente uma variação de explicação
const getRandomGovBrExplanation = (argId: string, caseData: { infraction: InfractionData; vehicle: VehicleData }) => {
  const variations = govBrExplanationsVariations[argId];
  if (!variations || variations.length === 0) {
    // Fallback para explicação genérica caso não haja variação definida
    return {
      title: 'Explicação não disponível',
      lawExplanation: 'Base jurídica não especificada',
      evidenceCheck: () => 'Verificação não configurada',
      userImpact: 'Impacto não determinado',
      confidenceBase: 'Base não definida'
    };
  }
  
  // Seleciona uma variação aleatória (baseada no timestamp para mudar a cada renderização, mas podemos melhorar)
  const index = Math.floor(Math.random() * variations.length);
  return variations[index];
};

// FUNÇÃO AUXILIAR: Formata explicações jurídicas no estilo GOV.BR
const formatLegalPointGovBr = (arg: any, caseData: { infraction: InfractionData; vehicle: VehicleData }) => {
  // Obtém uma variação aleatória da explicação para este argumento
  const explanation = getRandomGovBrExplanation(arg.id, caseData) || {
    title: arg.title,
    lawExplanation: `${arg.legalBase} ${arg.contraranResolution ? `(c/c ${arg.contraranResolution})` : ''}`,
    evidenceCheck: () => 'Verificação específica não configurada para este argumento',
    userImpact: arg.summary,
    confidenceBase: 'Base jurídica padrão'
  };

  // Calcula nível de confiança baseado na evidência disponível
  const evidenceResult = explanation.evidenceCheck({
    infraction: caseData.infraction,
    vehicle: caseData.vehicle
  });
    
  let confidenceLevel: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto' = 'Médio';
  let confidenceReason = '';
    
  // Lógica de confiança baseada na qualidade da evidência
  if (explanation.confidenceBase.includes('Lei') && 
      (evidenceResult.includes('constatada') || evidenceResult.includes('fora da validade'))) {
    confidenceLevel = 'Muito Alto';
    confidenceReason = 'Baseado em lei com alteração recente que tornou o direito obrigatório';
  } else if (explanation.confidenceBase.includes('Res.') && 
             (evidenceResult.includes('fora da validade') || evidenceResult.includes('dentro da validade'))) {
    confidenceLevel = 'Alto';
    confidenceReason = 'Baseado em resolução técnica com prazo claro e objetivo';
  } else if (evidenceResult.includes('Não há registro') || 
            evidenceResult.includes('Não há comprovação') ||
            evidenceResult.includes('ausência de')) {
    confidenceLevel = 'Médio';
    confidenceReason = 'Baseado em ausência de comprovação disponível nos dados fornecidos';
  } else {
    confidenceLevel = 'Baixo';
    confidenceReason = 'Evidência insuficiente para conclusão definitiva';
  }

  return {
    ...explanation,
    evidenceResult,
    confidenceLevel,
    confidenceReason
  };
};

interface FreeAnalysisResultStepProps {
  analysis: CaseAnalysis;
  infractionData: InfractionData;
  vehicleData: VehicleData;
  serviceType: ProcedureType;
  leadName?: string;
  leadPhone?: string;
  onProceedToDocumentGeneration: () => void;
  onSaveToDashboard: () => void;
}

export const FreeAnalysisResultStep: React.FC<FreeAnalysisResultStepProps> = ({
  analysis,
  infractionData,
  vehicleData,
  serviceType,
  leadName = '',
  leadPhone = '',
  onProceedToDocumentGeneration,
  onSaveToDashboard,
}) => {
  const successRate = analysis?.overallSuccessRate ?? 0;
  const isHighProbability = successRate >= 80;
  
  // Calcula pontos de defesa personalizados (top 3 por relevância)
  const defensePoints = analysis?.recommendedArguments
    ?.map(arg => formatLegalPointGovBr(arg, { infraction: infractionData, vehicle: vehicleData }))
    ?.sort((a, b) => {
      // Ordena por: confiança (Muito Alto > Alto > Médio > Baixo) 
      const confidenceOrder: Record<string, number> = {
        'Muito Alto': 4,
        'Alto': 3,
        'Médio': 2,
        'Baixo': 1
      };
      return (confidenceOrder[b.confidenceLevel] || 0) - (confidenceOrder[a.confidenceLevel] || 0);
    })
    .slice(0, 3) // Mostra apenas os top 3 argumentos mais relevantes
    ?? [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho com informações básicas */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Diagnóstico Jurídico Gratuito Concluído
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {leadName ? `Diagnóstico de ${leadName.split(' ')[0]}` : 'Resultado da Análise Preliminar'}
        </h1>
        <p className="text-base text-slate-500">
          Auto nº <span className="font-mono font-bold text-slate-800">{infractionData.aitNumber || 'N/A'}</span> • 
          Placa <span className="font-mono font-bold text-slate-800">{vehicleData.plate || 'N/A'}</span>
          {leadPhone && <span className="ml-2 text-slate-400 font-mono">• WhatsApp: {leadPhone}</span>}
        </p>
        
        {/* Explicação sobre o resultado */}
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            Este é um diagnóstico preliminar gratuito que identifica pontos fortes e fracos na sua autuação. 
            Para uma defesa formal completa com todas as argumentos jurídicos, proceeda para a próxima etapa.
          </p>
        </div>
      </div>

      {/* Probabilidade de Êxito */}
      <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
        <div className="space-y-3">
          <span className="text-base font-bold text-emerald-800 uppercase font-mono block">
            Probabilidade de Êxito
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700 font-mono">
            {successRate}%
          </div>
          <span className="text-lg text-emerald-800 font-medium">
            Alto potencial de anulação
          </span>
        </div>
      </div>

      {/* Resumo informativo (3 colunas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <span className="text-base font-bold uppercase font-mono text-slate-400">Enquadramento</span>
          <p className="text-lg font-bold text-slate-900 truncate">{infractionData.ctbArticle || 'Art. 218 do CTB'}</p>
          <p className="text-base text-slate-500 font-mono">Cód. {infractionData.infractionCode || '745-50'}</p>
        </div>
        <div className="space-y-3">
          <span className="text-base font-bold uppercase font-mono text-slate-400">Órgão Julgador</span>
          <p className="text-lg font-bold text-slate-900 truncate">{infractionData.autuadorBody || 'DETRAN-SP'}</p>
          <p className="text-base text-slate-500">Instância: Defesa Administrativa</p>
        </div>
        <div className="space-y-3">
          <span className="text-base font-bold uppercase font-mono text-slate-400">Impacto Estimado</span>
          <p className="text-lg font-bold text-slate-900">R$ {infractionData.fineAmount?.toFixed(2) || '130,16'}</p>
          <p className="text-base text-amber-700 font-semibold">{infractionData.points || 4} Pontos na CNH</p>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL: Análise jurídica personalizada */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileCheck2 className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900 font-mono uppercase">
            Principais pontos verificados para sua defesa ({defensePoints?.length || 0})
            {analysis?.recommendedArguments?.length > 3 && (
              <span className="text-base text-slate-500 ml-2">
                (+{analysis.recommendedArguments.length - 3} outros pontos disponíveis na visualização completa)
              </span>
            )}
          </h3>
        </div>

        {defensePoints?.length > 0 ? (
          <div className="space-y-6">
            {defensePoints.map((point, idx) => (
              <div
                key={point.title || idx}
                className="p-6 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-5"
              >
                {/* Ícone e título */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">{point.title}</h4>
                    <p className="text-base text-slate-500 font-mono">{point.confidenceBase}</p>
                  </div>
                </div>

                {/* Explicação no estilo GOV.BR */}
                <div className="space-y-4">
                  {/* O que verificamos */}
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Clock className="w-3 h-3" />
                    </div>
                    <span className="text-base font-medium text-slate-700">O que verificamos:</span>
                    <p className="text-lg text-slate-600 leading-relaxed ml-3">{point.title}</p>
                  </div>

                  {/* O que a lei diz */}
                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                      <BookOpen className="w-3 h-3" />
                    </div>
                    <span className="text-base font-medium text-slate-700">O que a lei diz:</span>
                    <p className="text-lg text-slate-600 leading-relaxed ml-3">{point.lawExplanation}</p>
                  </div>

                  {/* O que encontramos */}
                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <span className="text-base font-medium text-slate-700">O que encontramos nos seus dados:</span>
                    <p className="text-lg text-slate-600 leading-relaxed ml-3">{point.evidenceResult}</p>
                  </div>

                  {/* O que isso significa */}
                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-base font-medium text-slate-700">O que isso significa para você:</span>
                    <p className="text-lg text-slate-600 leading-relaxed ml-3">{point.userImpact}</p>
                  </div>

                  {/* Nível de confiança */}
                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
                      <BarChart2 className="w-3 h-3" />
                    </div>
                    <span className="text-base font-medium text-slate-700">Nível de confiança:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium 
                      ${point.confidenceLevel === 'Muito Alto' ? 'bg-emerald-50 text-emerald-700' : ''}
                      ${point.confidenceLevel === 'Alto' ? 'bg-blue-50 text-blue-700' : ''}
                      ${point.confidenceLevel === 'Médio' ? 'bg-amber-50 text-amber-700' : ''}
                      ${point.confidenceLevel === 'Baixo' ? 'bg-rose-50 text-rose-700' : ''}
                    ">
                      {point.confidenceLevel}
                    </span>
                    <span className="text-base text-slate-500 ml-1">({point.confidenceReason})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-lg text-slate-600 leading-relaxed">
              Nenhum vício formal ou tese de anulação foi identificado com base nas informações fornecidas. 
              Recomendamos reunir mais documentos ou consultar um advogado para uma análise mais detalhada.
            </p>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onSaveToDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-lg font-bold transition-colors cursor-pointer border border-slate-700"
          >
            Salvar e Ver no Painel
          </button>

          <div className="space-y-3">
            <p className="text-sm text-slate-600 text-center">
              O próximo passo é criar sua defesa formal com base nesta análise preliminar.
            </p>
          </div>
          
          <button
            id="btn-proceed-to-document-generation"
            onClick={onProceedToDocumentGeneration}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer uppercase tracking-tight"
          >
            <span>Gerar Minha Defesa Completa</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};