import { Router } from 'express';

const router = Router();

/**
 * GET /api/onboarding/rules
 * Source of truth for dynamic onboarding form — situation/stage/category matrix.
 */
router.get('/onboarding/rules', (req, res) => {
  const baseRules = {
    situations: [
      { id: 'multa_transito', title: 'Multa de Trânsito', mappedProcedure: 'defesa_previa', requiresStageSelection: true },
      { id: 'conversao_advertencia', title: 'Conversão em Advertência (Art. 267 CTB)', mappedProcedure: 'conversao_advertencia', inferredStage: 'conversao_advertencia', requiresStageSelection: false },
      { id: 'indicacao_condutor', title: 'Indicação de Real Condutor', mappedProcedure: 'indicacao_condutor', inferredStage: 'primeira_notificacao', requiresStageSelection: false },
      { id: 'suspensao_cnh', title: 'Suspensão da CNH / Lei Seca', mappedProcedure: 'suspensao_cnh', requiresStageSelection: true },
      { id: 'cassacao_cnh', title: 'Cassação da CNH', mappedProcedure: 'cassacao_cnh', requiresStageSelection: true },
    ],
    stages: [
      { id: 'primeira_notificacao', title: 'Notificação de Autuação (Defesa Prévia)', mappedProcedure: 'defesa_previa' },
      { id: 'notificacao_penalidade', title: 'Notificação de Penalidade (JARI)', mappedProcedure: 'recurso_jari' },
      { id: 'defesa_negada', title: 'Defesa Prévia Indeferida (JARI)', mappedProcedure: 'recurso_jari' },
      { id: 'recurso_jari_negado', title: 'Recurso JARI Indeferido (CETRAN)', mappedProcedure: 'recurso_cetran' },
      { id: 'conversao_advertencia', title: 'Conversão em Advertência (Art. 267)', mappedProcedure: 'conversao_advertencia' },
      { id: 'nao_tenho_certeza', title: 'Não Tenho Certeza', mappedProcedure: 'defesa_previa' },
    ],
    phase1CoreFields: ['aitNumber', 'plate', 'autuadorBody'],
    phase2QualificationFields: [
      'applicantName', 'applicantCpf', 'applicantCnh', 'applicantEmail', 'applicantPhone',
      'addressStreet', 'addressNumber', 'addressNeighborhood', 'addressZipCode', 'addressCityState',
    ],
    categoryRequirements: {
      excesso_velocidade: {
        required: ['speedLimit', 'measuredSpeed'],
        optional: ['inmetroAferitionDate', 'radarEquipmentId', 'dateTime'],
        autoCalculated: ['consideredSpeed'],
      },
      lei_seca: {
        required: ['infractionCode'],
        optional: ['notes', 'dateTime'],
      },
      celular: {
        required: ['notes'],
        optional: ['dateTime'],
      },
      vermelho: {
        required: ['notes'],
        optional: ['dateTime'],
      },
      estacionamento: {
        required: ['notes'],
        optional: ['dateTime'],
      },
      conversao_advertencia: {
        required: ['notes'],
        optional: ['dateTime'],
      },
      outro: {
        required: ['infractionCode'],
        optional: ['notes', 'dateTime'],
      },
    },
  };

  res.json(baseRules);
});

export default router;
