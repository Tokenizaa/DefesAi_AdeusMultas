import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowLeft,
  FileCheck2,
  Scale
} from 'lucide-react';
import {
  ProcedureType,
  InfractionData,
  VehicleData,
  CaseAnalysis,
  CaseDomain,
  CaseDocumentData
} from '../../types';
import { useRouter } from '../../core/router/RouterContext';
import { useAuth } from '../../core/auth/AuthContext';
import {
  UserSituation,
  UserProcessStage,
  InfractionCategory,
  USER_SITUATIONS,
  USER_PROCESS_STAGES,
  RULES_MATRIX
} from '../../core/onboarding/rules-matrix';

// ============================================================================
// Wizard State Persistence (localStorage)
// ============================================================================

const WIZARD_STORAGE_KEY = 'defesai_wizard_state';

interface WizardPersistedState {
  step: number;
  leadName: string;
  leadPhone: string;
  situation: UserSituation;
  processStage: UserProcessStage;
  infractionCategory: InfractionCategory;
  vehicleData: VehicleData;
  infractionData: InfractionData;
  caseAnalysis: CaseAnalysis;
  documentData: CaseDocumentData;
  savedCaseId?: string;
  savedAt: number; // timestamp
}

function loadWizardState(): WizardPersistedState | null {
  try {
    const raw = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardPersistedState;
    // Expire after 24 hours
    if (Date.now() - parsed.savedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    return null;
  }
}

function saveWizardState(state: Omit<WizardPersistedState, 'savedAt'>) {
  try {
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch { /* quota exceeded, ignore */ }
}

function clearWizardState() {
  try { localStorage.removeItem(WIZARD_STORAGE_KEY); } catch { /* ignore */ }
}

import { ServiceStep } from './steps/ServiceStep';
import { DefenseStageStep } from './steps/DefenseStageStep';
import { InfractionIdentificationStep } from './steps/InfractionIdentificationStep';
import { SpecificInfractionDataStep } from './steps/SpecificInfractionDataStep';
import { AnalysisProcessingStep } from './steps/AnalysisProcessingStep';
import { FreeAnalysisResultStep } from './steps/FreeAnalysisResultStep';
import { RequiredDataStep } from './generation/RequiredDataStep';
import { DocumentReviewStep } from './generation/DocumentReviewStep';
import { DocumentCheckoutStep } from './generation/DocumentCheckoutStep';
import { AccountVerificationGate } from './AccountVerificationGate';

interface OnboardingWizardProps {
  onCaseReadyForCheckout?: (newCase: CaseDomain) => void;
  onOpenKnowledge?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onCaseReadyForCheckout,
  onOpenKnowledge,
}) => {
  const { navigate } = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Load persisted wizard state if available (e.g., after email confirmation)
  const savedState = loadWizardState();

  // Wizard Step (1 to 6: Phase 1 Free Analysis, 7 to 9: Phase 2 Paid Document Generation)
  const [step, setStep] = useState<number>(savedState?.step ?? 1);

  // Lead Data (Collected in Step 3 for Visitor conversion)
  const [leadName, setLeadName] = useState<string>(savedState?.leadName || user?.name || '');
  const [leadPhone, setLeadPhone] = useState<string>(savedState?.leadPhone || user?.phone || '');
  const [isAuthGateOpen, setIsAuthGateOpen] = useState<boolean>(false);
  const [authGateRedirectAction, setAuthGateRedirectAction] = useState<'generation' | 'dashboard'>('generation');

  // =========================================================================
  // FASE 1: DADOS DA ANÁLISE JURÍDICA (100% GRATUITA)
  // =========================================================================
  const [situation, setSituation] = useState<UserSituation>(savedState?.situation ?? 'multa_transito');
  const [processStage, setProcessStage] = useState<UserProcessStage>(savedState?.processStage ?? 'primeira_notificacao');
  const [infractionCategory, setInfractionCategory] = useState<InfractionCategory>(savedState?.infractionCategory ?? 'excesso_velocidade');

  const [vehicleData, setVehicleData] = useState<VehicleData>(savedState?.vehicleData ?? {
    plate: '',
    brandModel: '',
    renavam: '',
    year: '',
    color: '',
  });

  const [infractionData, setInfractionData] = useState<InfractionData>(savedState?.infractionData ?? {
    aitNumber: '',
    infractionCode: '',
    description: '',
    ctbArticle: '',
    severity: 'media',
    points: 0,
    fineAmount: 0,
    autuadorBody: '',
    dateTime: '',
    location: '',
    formalFlawsDetected: [],
  });

  const [caseAnalysis, setCaseAnalysis] = useState<CaseAnalysis>(savedState?.caseAnalysis ?? {
    id: `an_${Date.now()}`,
    caseId: `temp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    overallSuccessRate: 0,
    detectedInconsistencies: [],
    recommendedArguments: [],
    recommendedProcedure: 'defesa_previa',
    competentBody: '',
    summaryReasoning: '',
  });

  // =========================================================================
  // FASE 2: DADOS DE QUALIFICAÇÃO DO CONDUTOR (GERAÇÃO DA PEÇA FORMAL)
  // =========================================================================
  const [documentData, setDocumentData] = useState<CaseDocumentData>(savedState?.documentData ?? {
    applicantName: user?.name || '',
    applicantCpf: user?.cpf || '',
    applicantRg: '',
    applicantCnh: '',
    cnhCategory: '',
    applicantPhone: user?.phone || '',
    applicantEmail: user?.email || '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressZipCode: '',
    addressCityState: '',
    vehicleRenavam: '',
  });

  const [savedCaseId, setSavedCaseId] = useState<string | undefined>(savedState?.savedCaseId);

  // Clear persisted state once loaded (fresh start for next visit)
  useEffect(() => {
    if (savedState) {
      clearWizardState();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance: if user was at step 6 (auth gate) and is now authenticated,
  // advance to step 7 automatically (e.g., after email confirmation)
  useEffect(() => {
    if (savedState && savedState.step === 6 && isAuthenticated && user) {
      setDocumentData((prev) => ({
        ...prev,
        applicantName: user.name || prev.applicantName,
        applicantEmail: user.email || prev.applicantEmail,
        applicantPhone: user.phone || leadPhone || prev.applicantPhone,
        applicantCpf: user.cpf || prev.applicantCpf,
      }));
      setStep(7);
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Deriva o tipo de procedimento canônico
  const mappedProcedure: ProcedureType =
    situation === 'conversao_advertencia'
      ? 'conversao_advertencia'
      : situation === 'indicacao_condutor'
      ? 'indicacao_condutor'
      : situation === 'suspensao_cnh'
      ? 'suspensao_cnh'
      : situation === 'cassacao_cnh'
      ? 'cassacao_cnh'
      : processStage === 'recurso_jari' || processStage === 'defesa_negada'
      ? 'recurso_jari'
      : processStage === 'recurso_cetran' || processStage === 'recurso_jari_negado'
      ? 'recurso_cetran'
      : 'defesa_previa';

  const isPhase1 = step <= 6;
  const isPhase2 = step >= 7;

  // Handlers
  const handleSituationSelect = (selected: UserSituation) => {
    setSituation(selected);
    const sitDef = USER_SITUATIONS.find((s) => s.id === selected);

    if (sitDef?.defaultInfractionCategory) {
      setInfractionCategory(sitDef.defaultInfractionCategory);
    }

    // Se o serviço já define a fase de forma unívoca, pula para a identificação direta
    if (sitDef?.inferredStage) {
      setProcessStage(sitDef.inferredStage);
      setStep(3); // Direto para identificação da autuação
    } else {
      setStep(2); // Pergunta a fase
    }
  };

  const handleStageSelect = (selected: UserProcessStage) => {
    setProcessStage(selected);
    setStep(3); // Passo de identificação técnica
  };

  const handleLeadUpdate = (name: string, phone: string) => {
    setLeadName(name);
    setLeadPhone(phone);
    setDocumentData((prev) => ({
      ...prev,
      applicantName: name || prev.applicantName,
      applicantPhone: phone || prev.applicantPhone,
    }));
  };

  const handleRunAnalysis = async () => {
    setStep(5); // Processando análise
  };

  const handleAnalysisComplete = (analysis: CaseAnalysis) => {
    setCaseAnalysis(analysis);
  };

  const handleAnalysisCompleted = async () => {
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Diagnóstico Auto ${infractionData.aitNumber || 'sem AIT'}`,
          serviceType: mappedProcedure,
          infraction: infractionData,
          vehicle: vehicleData,
          isAnonymous: !isAuthenticated,
          userNome: user?.name || leadName,
          userEmail: user?.email,
          status: 'analisado',
          currentStage: 2,
          analysis: caseAnalysis,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSavedCaseId(data.id);
      }
      // Se o backend retornou análise com successRate > 0, usar a do backend
      if (data.analysis && data.analysis.overallSuccessRate > 0) {
        setCaseAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error saving case:', err);
    }
    setStep(6); // Exibir resultado do diagnóstico gratuito
  };

  const handleProceedToDocumentGeneration = () => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      setDocumentData((prev) => ({
        ...prev,
        applicantName: user.name || prev.applicantName,
        applicantEmail: user.email || prev.applicantEmail,
        applicantPhone: user.phone || leadPhone || prev.applicantPhone,
        applicantCpf: user.cpf || prev.applicantCpf,
      }));
      setStep(7); // Início da Fase 2 (Qualificação)
    } else {
      // Persist wizard state before opening auth gate
      // (user might leave page for email confirmation)
      saveWizardState({
        step: 6,
        leadName,
        leadPhone,
        situation,
        processStage,
        infractionCategory,
        vehicleData,
        infractionData,
        caseAnalysis,
        documentData,
        savedCaseId,
      });
      setAuthGateRedirectAction('generation');
      setIsAuthGateOpen(true);
    }
  };

  const handleSaveToDashboard = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    } else {
      // Persist wizard state before opening auth gate
      saveWizardState({
        step: 6,
        leadName,
        leadPhone,
        situation,
        processStage,
        infractionCategory,
        vehicleData,
        infractionData,
        caseAnalysis,
        documentData,
        savedCaseId,
      });
      setAuthGateRedirectAction('dashboard');
      setIsAuthGateOpen(true);
    }
  };

  const handleAuthSuccess = async (authUser: any) => {
    setIsAuthGateOpen(false);
    clearWizardState(); // Auth succeeded, no need to restore anymore

    // Update document data with verified user data
    setDocumentData((prev) => ({
      ...prev,
      applicantName: authUser.name || leadName || prev.applicantName,
      applicantEmail: authUser.email || prev.applicantEmail,
      applicantPhone: authUser.phone || leadPhone || prev.applicantPhone,
      applicantCpf: authUser.cpf || prev.applicantCpf,
    }));

    // If case was already saved on backend, link it to the user
    if (savedCaseId) {
      try {
        await fetch('/api/cases/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: savedCaseId,
            claimToken: savedCaseId,
            userId: authUser.id,
            userEmail: authUser.email,
            userNome: authUser.name,
          }),
        });
      } catch (err) {
        console.error('Error claiming case for user:', err);
      }
    }

    if (authGateRedirectAction === 'dashboard') {
      navigate('/dashboard');
    } else {
      setStep(7); // Advance directly to Qualification and Document Generation
    }
  };

  const handlePaymentSuccess = (finalCase: CaseDomain) => {
    if (onCaseReadyForCheckout) {
      onCaseReadyForCheckout(finalCase);
      return;
    }
    navigate(`/cases/${finalCase.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Phase Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isPhase1 ? 'bg-[#155BCB] text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isPhase1 ? 'F1' : 'F2'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500">
                {isPhase1 ? 'Fase 1 • Diagnóstico Preliminar' : 'Fase 2 • Petição Formal'}
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                  isPhase1
                    ? 'bg-blue-50 text-[#155BCB] border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isPhase1 ? '100% Gratuito' : 'Minuta Jurídica Oficial'}
              </span>
            </div>
            <h2 className="text-xs font-bold text-slate-900 mt-0.5">
              {step === 1 && '1. Situação que deseja resolver'}
              {step === 2 && '2. Fase do Processo'}
              {step === 3 && '3. Identificação da Autuação & Veículo'}
              {step === 4 && '4. Perguntas Específicas do Seu Caso'}
              {step === 5 && '5. Processando Análise Jurídica'}
              {step === 6 && '6. Diagnóstico Preliminar Concluído'}
              {step === 7 && '7. Qualificação do Requerente para a Peça'}
              {step === 8 && '8. Revisão da Petição Formal'}
              {step === 9 && '9. Emissão & Pagamento Seguro'}
            </h2>
          </div>
        </div>

        {/* Mini progress tracker */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-6 bg-[#155BCB]'
                  : s < step
                  ? 'w-2.5 bg-emerald-600'
                  : 'w-2.5 bg-slate-200'
              }`}
              title={`Etapa ${s}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Step Router */}
      {step === 1 && (
        <ServiceStep
          selectedSituation={situation}
          onSelectSituation={handleSituationSelect}
        />
      )}

      {step === 2 && (
        <DefenseStageStep
          selectedStage={processStage}
          onSelectStage={handleStageSelect}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <InfractionIdentificationStep
          infractionData={infractionData}
          vehicleData={vehicleData}
          leadName={leadName}
          leadPhone={leadPhone}
          onUpdateInfraction={setInfractionData}
          onUpdateVehicle={setVehicleData}
          onUpdateLead={handleLeadUpdate}
          onNext={() => setStep(4)}
          onBack={() => {
            const sitDef = USER_SITUATIONS.find((s) => s.id === situation);
            if (sitDef?.inferredStage) {
              setStep(1);
            } else {
              setStep(2);
            }
          }}
          isAdmin={isAdmin}
        />
      )}

      {step === 4 && (
        <SpecificInfractionDataStep
          category={infractionCategory}
          infractionData={infractionData}
          onSelectCategory={setInfractionCategory}
          onUpdateInfraction={setInfractionData}
          onNext={handleRunAnalysis}
          onBack={() => setStep(3)}
          isAdmin={isAdmin}
        />
      )}

      {step === 5 && (
        <AnalysisProcessingStep 
          infractionData={infractionData}
          onComplete={handleAnalysisCompleted} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {step === 6 && (
        <FreeAnalysisResultStep
          analysis={caseAnalysis}
          infractionData={infractionData}
          vehicleData={vehicleData}
          serviceType={mappedProcedure}
          leadName={leadName}
          leadPhone={leadPhone}
          onProceedToDocumentGeneration={handleProceedToDocumentGeneration}
          onSaveToDashboard={handleSaveToDashboard}
        />
      )}

      {step === 7 && (
        <RequiredDataStep
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          onUpdateDocumentData={setDocumentData}
          onNext={() => setStep(8)}
          onBack={() => setStep(6)}
          isAdmin={isAdmin}
        />
      )}

      {step === 8 && (
        <DocumentReviewStep
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          analysis={caseAnalysis}
          serviceType={mappedProcedure}
          onEditQualification={() => setStep(7)}
          onProceedToPayment={() => setStep(9)}
          onBack={() => setStep(7)}
        />
      )}

      {step === 9 && (
        <DocumentCheckoutStep
          currentCaseId={savedCaseId}
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          analysis={caseAnalysis}
          serviceType={mappedProcedure}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setStep(8)}
        />
      )}

      {/* Smart Account Gate Modal for Visitors */}
      {isAuthGateOpen && (
        <AccountVerificationGate
          leadName={leadName}
          leadPhone={leadPhone}
          infractionData={infractionData}
          vehicleData={vehicleData}
          analysis={caseAnalysis}
          onSuccess={handleAuthSuccess}
          onCancel={() => setIsAuthGateOpen(false)}
        />
      )}
    </div>
  );
};

