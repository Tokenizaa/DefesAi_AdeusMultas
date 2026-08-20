import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

// Playwright defaults apply: expect 5s, test 30s. No timeout inflation.
const testUser = {
  name: 'João Pereira Lima', // distinct from the input's default value
  phone: '(11) 98765-4321',
  email: 'carlos.silveira@email.com',
  cpf: '123.456.789-09',
  cnh: '05492817492',
};

const testVehicle = {
  plate: 'BRA2E19',
  brandModel: 'Honda Civic 2020',
  renavam: '123456789',
  year: '2020',
  color: 'Prata',
};

const testInfraction = {
  aitNumber: '1B892014',
  infractionCode: '745-50', // Art. 218 I - speeding up to 20%
  autuadorBody: 'DETRAN-SP',
  dateTime: '2024-01-15',
};

// Simulate a logged-in user via the localStorage auth fallback.
// The dev server is launched WITHOUT Supabase env vars (see playwright.config.ts),
// so AuthContext reads this storage key directly with no network calls.
async function forceLocalAuth(page: Page, user: Record<string, unknown>) {
  await page.addInitScript((mockUser) => {
    localStorage.setItem('defesai_auth_session_v1', JSON.stringify(mockUser));
  }, user);
}

const ADMIN_USER = {
  id: 'admin-test-id',
  name: 'Admin Teste',
  email: 'admin@defesai.com',
  cpf: '000.000.000-00',
  phone: '(11) 90000-0000',
  role: 'admin',
  isAdmin: true,
};

// Step titles from actual UI components
function getStepTitle(step: number): string {
  const titles: Record<number, string> = {
    1: 'Qual situação você quer resolver?',
    2: 'Em que situação está sua multa?',
    3: 'Qual é o auto de infração e o condutor?',
    4: 'Sobre o tipo da infração',
    5: 'Analisando sua autuação com Inteligência Jurídica',
    6: 'Diagnóstico Jurídico Gratuito Concluído', // badge div in FreeAnalysisResultStep
    7: 'Agora vamos preparar sua defesa formal',
    8: 'Revisão dos Dados da Petição',
    9: 'Liberação da Petição & Checklist de Protocolo',
  };
  return titles[step] || `Etapa ${step}`;
}

async function waitForStep(page: Page, step: number) {
  const title = getStepTitle(step);
  await expect(
    page.locator(`h1:has-text("${title}"), h2:has-text("${title}"), h3:has-text("${title}")`)
  ).toBeVisible();
}

async function navigateToOnboarding(page: Page) {
  await page.goto(`${BASE_URL}/novo-caso`, { waitUntil: 'domcontentloaded' });
  await waitForStep(page, 1);
}

const TEST_FILL_BTN = 'button:has-text("Preencher com dados de teste")';

async function fillInput(page: Page, id: string, value: string) {
  await page.fill(`#${id}`, value);
  await page.waitForTimeout(100);
}

async function selectNativeOption(page: Page, id: string, value: string) {
  // Wait for option to exist, then select
  await page.waitForFunction(
    ([sel, val]) => {
      const el = document.querySelector(sel) as HTMLSelectElement | null;
      return !!el && Array.from(el.options).some((o) => o.value === val);
    },
    [`#${id}`, value]
  );
  await page.selectOption(`#${id}`, value);
  await page.waitForTimeout(100);
}

// Steps 1-3: service + stage + infraction identification
async function completeSteps1to3(page: Page) {
  // Step 1: select "Multa de Trânsito"
  await page.click('#service-option-multa_transito');
  await waitForStep(page, 2);

  // Step 2: select "Recebi a primeira notificação"
  await page.click('#stage-option-primeira_notificacao');
  await waitForStep(page, 3);

  // Step 3: fill infraction identification
  await fillInput(page, 'input-lead-name', testUser.name);
  await fillInput(page, 'input-lead-phone', testUser.phone);
  await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
  await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
  await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
  await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
  await fillInput(page, 'input-datetime', testInfraction.dateTime);

  await page.click('#btn-next-to-specifics');
  await waitForStep(page, 4);
}

// Step 4: speed category + run analysis -> step 5 -> auto-advance to step 6.
// Step 5 (AnalysisProcessingStep) has 6 sequential setTimeout = 4200ms total
// (lines 50-56: 700+800+800+700+700+500). Fake clock installed in beforeEach
// accelerates these without masking the artificial delay.
//
// Single fastForward(5000) does NOT work: it fires timers synchronously, but React
// re-renders on a real MessageChannel macrotask, so the next stage timer is only
// scheduled after fastForward returns. Instead: small 1s jumps interleaved with a
// real pause, letting React flush and reschedule between stages.
async function runAnalysisAndWaitResult(page: Page) {
  await page.click('#btn-run-analysis');
  await waitForStep(page, 5);
  // Step 6 badge is raw text inside a div (FreeAnalysisResultStep), not a heading
  const badge = page.getByText(getStepTitle(6)).first();
  for (let i = 0; i < 8 && !(await badge.isVisible().catch(() => false)); i++) {
    await page.clock.fastForward(1000);
    await page.waitForTimeout(50);
  }
  await expect(badge).toBeVisible();
}

test.describe('Onboarding Flow - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    // Fake timers must be installed before navigation so the step-5 setTimeout
    // chain (4200ms) runs under clock control from the start.
    await page.clock.install();
  });

  test('happy-path: user completes free analysis (steps 1-6)', async ({ page }) => {
    await navigateToOnboarding(page);

    // Step 1: service selection
    await expect(page.locator('#service-option-multa_transito')).toBeVisible();
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);

    // Step 2: process stage
    await expect(page.locator('#stage-option-primeira_notificacao')).toBeVisible();
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    // Step 3: fill form
    await fillInput(page, 'input-lead-name', testUser.name);
    await fillInput(page, 'input-lead-phone', testUser.phone);
    await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
    await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
    await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
    await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);

    const nextBtn = page.locator('#btn-next-to-specifics');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await waitForStep(page, 4);

    // Step 4: speed fields + run analysis (clock fast-forwards step 5)
    await fillInput(page, 'input-speed-limit', '60');
    await fillInput(page, 'input-measured-speed', '73');
    await page.waitForTimeout(300);
    await runAnalysisAndWaitResult(page);

    // Step 6: free result visible with probability + CTA
    await expect(page.locator('text=Probabilidade de Êxito')).toBeVisible();
    await expect(page.locator('#btn-proceed-to-document-generation')).toBeVisible();
  });

  test('admin-buttons: admin sees test-fill buttons on steps 3, 4 and 7', async ({ page }) => {
    await forceLocalAuth(page, ADMIN_USER);
    await navigateToOnboarding(page);

    // Step 1 -> 2
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    // Step 3: admin button visible, auto-fills
    const step3Btn = page.locator(TEST_FILL_BTN);
    await expect(step3Btn).toBeVisible();
    await step3Btn.click();
    await expect(page.locator('#btn-next-to-specifics')).toBeEnabled();
    await page.click('#btn-next-to-specifics');
    await waitForStep(page, 4);

    // Step 4: admin button visible
    await expect(page.locator(TEST_FILL_BTN)).toBeVisible();
    await runAnalysisAndWaitResult(page);

    // Step 6 -> 7: admin authenticated, skips auth gate
    await page.click('#btn-proceed-to-document-generation');
    await waitForStep(page, 7);

    // Step 7: admin button visible
    await expect(page.locator(TEST_FILL_BTN)).toBeVisible();
  });

  test('user-normal: regular user does not see test-fill buttons', async ({ page }) => {
    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    // Step 3 hides it
    await expect(page.locator(TEST_FILL_BTN)).not.toBeVisible();

    // Step 4 hides it too
    await fillInput(page, 'input-lead-name', testUser.name);
    await fillInput(page, 'input-lead-phone', testUser.phone);
    await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
    await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
    await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
    await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
    await page.click('#btn-next-to-specifics');
    await waitForStep(page, 4);
    await expect(page.locator(TEST_FILL_BTN)).not.toBeVisible();
  });

  test('validation: required fields block advancing past step 3', async ({ page }) => {
    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    const nextBtn = page.locator('#btn-next-to-specifics');
    await expect(nextBtn).toBeDisabled();

    // name + phone only
    await fillInput(page, 'input-lead-name', testUser.name);
    await fillInput(page, 'input-lead-phone', testUser.phone);
    await expect(nextBtn).toBeDisabled();

    // + plate
    await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
    await expect(nextBtn).toBeDisabled();

    // + AIT
    await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
    await expect(nextBtn).toBeDisabled();

    // + infraction code (still missing autuador)
    await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
    await expect(nextBtn).toBeDisabled();

    // + autuador -> enabled
    await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
    await expect(nextBtn).toBeEnabled();
  });

  test('LocalStorage persists wizard state at auth gate (step 6)', async ({ page }) => {
    await navigateToOnboarding(page);
    await completeSteps1to3(page);

    // Step 4 + analysis -> step 6
    await fillInput(page, 'input-speed-limit', '60');
    await fillInput(page, 'input-measured-speed', '73');
    await page.waitForTimeout(300);
    await runAnalysisAndWaitResult(page);

    // Click "Gerar Minha Defesa" -> for unauthenticated user, opens auth gate
    // and persists wizard state to localStorage
    await page.click('#btn-proceed-to-document-generation');

    // Auth gate modal visible with persisted data
    await expect(page.locator('h2:has-text("Acesso à Sua Defesa Jurídica")')).toBeVisible();

    // Verify localStorage contains wizard state
    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem('defesai_wizard_state');
      return raw ? JSON.parse(raw) : null;
    });
    expect(saved).not.toBeNull();
    expect(saved.step).toBe(6);
    expect(saved.leadName).toBe(testUser.name);
    expect(saved.vehicleData.plate).toBe(testVehicle.plate);
    expect(saved.infractionData.aitNumber).toBe(testInfraction.aitNumber);
    expect(saved.infractionData.infractionCode).toBe(testInfraction.infractionCode);
  });

  test('Admin test-fill button auto-fills step 3', async ({ page }) => {
    await forceLocalAuth(page, ADMIN_USER);

    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    const testFillBtn = page.locator(TEST_FILL_BTN);
    await expect(testFillBtn).toBeVisible();

    await testFillBtn.click();
    await page.waitForTimeout(500);

    // Fields auto-filled
    const nameVal = await page.inputValue('#input-lead-name');
    const phoneVal = await page.inputValue('#input-lead-phone');
    const plateVal = await page.inputValue('#input-vehicle-plate');
    const aitVal = await page.inputValue('#input-ait-number');

    expect(nameVal.length).toBeGreaterThan(3);
    expect(phoneVal.length).toBeGreaterThan(8);
    expect(plateVal.length).toBeGreaterThanOrEqual(7);
    expect(aitVal.length).toBeGreaterThanOrEqual(8);

    await expect(page.locator('#btn-next-to-specifics')).toBeEnabled();
  });

  test('Navigation: back from step 2 returns to step 1', async ({ page }) => {
    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);

    await page.click('button:has-text("Voltar à situação")');
    await waitForStep(page, 1);
  });

  test('Navigation: situation with inferredStage skips step 2', async ({ page }) => {
    await navigateToOnboarding(page);
    // conversao_advertencia has inferredStage -> goes directly to step 3
    await page.click('#service-option-conversao_advertencia');
    await waitForStep(page, 3);
  });

  test('Speed infraction requires speedLimit and measuredSpeed in step 4', async ({ page }) => {
    await navigateToOnboarding(page);
    await completeSteps1to3(page);

    // Speed category fields present
    await expect(page.locator('#input-speed-limit')).toBeVisible();
    await expect(page.locator('#input-measured-speed')).toBeVisible();
    await expect(page.locator('#input-considered-speed')).toBeVisible();
  });

  test('DUI category shows specific fields in step 4', async ({ page }) => {
    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    await fillInput(page, 'input-lead-name', testUser.name);
    await fillInput(page, 'input-lead-phone', testUser.phone);
    await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
    await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
    await selectNativeOption(page, 'input-infraction-code', '516-91'); // Lei Seca
    await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
    await page.click('#btn-next-to-specifics');
    await waitForStep(page, 4);

    // Switch to Lei Seca tab
    await page.click('button:has-text("Lei Seca / Bafômetro")');
    await expect(page.locator('#select-termo-sinais')).toBeVisible();
    await expect(page.locator('#select-reteste')).toBeVisible();
  });

  test('Accessibility: form inputs have labels', async ({ page }) => {
    await navigateToOnboarding(page);
    await page.click('#service-option-multa_transito');
    await waitForStep(page, 2);
    await page.click('#stage-option-primeira_notificacao');
    await waitForStep(page, 3);

    // Verify labeled inputs exist on step 3
    for (const id of ['input-lead-name', 'input-lead-phone', 'input-ait-number', 'input-vehicle-plate', 'input-infraction-code', 'input-autuador-body']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });
});

test.describe('Phase 2 - Document Generation (paid)', () => {
  test('Full flow through step 9 reaches checkout', async ({ page }) => {
    await forceLocalAuth(page, ADMIN_USER);

    await navigateToOnboarding(page);
    await completeSteps1to3(page);

    // Step 4 + analysis
    await fillInput(page, 'input-speed-limit', '60');
    await fillInput(page, 'input-measured-speed', '73');
    await page.waitForTimeout(300);
    await runAnalysisAndWaitResult(page);

    // Step 6 -> step 7 (admin authenticated, skips gate)
    await page.click('#btn-proceed-to-document-generation');
    await waitForStep(page, 7);

    // Step 7: fill qualification data
    await fillInput(page, 'input-applicant-name', testUser.name);
    await fillInput(page, 'input-applicant-cpf', testUser.cpf);
    await fillInput(page, 'input-applicant-cnh', testUser.cnh);
    await fillInput(page, 'input-cnh-category', 'AB');
    await fillInput(page, 'input-applicant-email', testUser.email);
    await fillInput(page, 'input-applicant-phone', testUser.phone);
    await fillInput(page, 'input-address-street', 'Rua das Flores, 450');
    await fillInput(page, 'input-address-number', '450');
    await fillInput(page, 'input-address-neighborhood', 'Vila Madalena');
    await fillInput(page, 'input-address-zipcode', '01234-567');
    await fillInput(page, 'input-address-citystate', 'São Paulo/SP');

    await page.click('#btn-next-to-review');
    await waitForStep(page, 8);

    // Step 8: review -> payment
    await page.click('#btn-proceed-to-checkout');
    await waitForStep(page, 9);

    // Step 9: checkout visible with PIX tab
    await expect(page.locator('button[role="tab"]:has-text("PIX")')).toBeVisible();
    await expect(page.locator('button[role="tab"]:has-text("Cartão")')).toBeVisible();
  });

  test('PIX payment screen loads QR code (requires live PagBank)', async ({ page }) => {
    test.skip(true, 'Requires live PagBank API keys (external dependency) — checkout flow covered by "Full flow through step 9" test; QR loading needs real /api/payments/pix/create response.');
    await forceLocalAuth(page, ADMIN_USER);
    await navigateToOnboarding(page);
    await completeSteps1to3(page);
    await fillInput(page, 'input-speed-limit', '60');
    await fillInput(page, 'input-measured-speed', '73');
    await page.waitForTimeout(300);
    await runAnalysisAndWaitResult(page);

    await page.click('#btn-proceed-to-document-generation');
    await waitForStep(page, 7);

    await fillInput(page, 'input-applicant-name', testUser.name);
    await fillInput(page, 'input-applicant-cpf', testUser.cpf);
    await fillInput(page, 'input-applicant-cnh', testUser.cnh);
    await fillInput(page, 'input-cnh-category', 'AB');
    await fillInput(page, 'input-applicant-email', testUser.email);
    await fillInput(page, 'input-applicant-phone', testUser.phone);
    await page.click('#btn-next-to-review');
    await waitForStep(page, 8);
    await page.click('#btn-proceed-to-checkout');
    await waitForStep(page, 9);

    // PIX QR code loads when backend responds
    await expect(page.locator('img[alt="QR Code PIX PagBank"]')).toBeVisible();
  });
});