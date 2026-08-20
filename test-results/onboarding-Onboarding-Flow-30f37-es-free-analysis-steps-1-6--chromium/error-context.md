# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> Onboarding Flow - E2E >> happy-path: user completes free analysis (steps 1-6)
- Location: tests/onboarding.spec.ts:148:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Qual situação você quer resolver?"), h2:has-text("Qual situação você quer resolver?"), h3:has-text("Qual situação você quer resolver?")')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1:has-text("Qual situação você quer resolver?"), h2:has-text("Qual situação você quer resolver?"), h3:has-text("Qual situação você quer resolver?")')

```

```yaml
- text: "[plugin:vite:react-babel] /home/lg/workspace/projects/DefesAi_AdeusMultas/src/components/onboarding/steps/FreeAnalysisResultStep.tsx: Unexpected token (163:4) 166 | <div className=\"space-y-6\"> /home/lg/workspace/projects/DefesAi_AdeusMultas/src/components/onboarding/steps/FreeAnalysisResultStep.tsx:163:4 161| }) 162| .slice(0, 3) // Mostra apenas os top 3 argumentos mais relevantes 163| : []; | ^ 164| 165| return ( at toParseError (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parse-error.ts:96:45) at TypeScriptParserMixin.raise (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/tokenizer/index.ts:1504:19) at TypeScriptParserMixin.unexpected (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/tokenizer/index.ts:1544:16) at TypeScriptParserMixin.parseExprAtom (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:1385:22) at TypeScriptParserMixin.parseExprAtom (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/jsx/index.ts:583:22) at TypeScriptParserMixin.parseExprSubscripts (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:742:23) at TypeScriptParserMixin.parseUpdate (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:721:21) at TypeScriptParserMixin.parseMaybeUnary (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:683:23) at TypeScriptParserMixin.parseMaybeUnary (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3893:20) at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:417:14) at TypeScriptParserMixin.parseExprOps (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:429:23) at TypeScriptParserMixin.parseMaybeConditional (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:384:23) at TypeScriptParserMixin.parseMaybeAssign (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:301:21) at TypeScriptParserMixin.parseMaybeAssign (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3764:22) at TypeScriptParserMixin.parseExpressionBase (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:226:23) at callback (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:217:39) at TypeScriptParserMixin.allowInAnd (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:3222:16) at TypeScriptParserMixin.parseExpression (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:217:17) at TypeScriptParserMixin.parseStatementContent (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:688:23) at TypeScriptParserMixin.parseStatementContent (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3220:20) at TypeScriptParserMixin.parseStatementLike (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:482:17) at TypeScriptParserMixin.parseStatementListItem (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:431:17) at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:1444:16) at TypeScriptParserMixin.parseBlockBody (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:1417:10) at TypeScriptParserMixin.parseBlock (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:1385:10) at TypeScriptParserMixin.parseFunctionBody (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:2651:24) at TypeScriptParserMixin.parseArrowExpression (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:2592:10) at TypeScriptParserMixin.parseParenAndDistinguishExpression (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:1877:12) at TypeScriptParserMixin.parseExprAtom (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:1197:21) at TypeScriptParserMixin.parseExprAtom (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/jsx/index.ts:583:22) at TypeScriptParserMixin.parseExprSubscripts (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:742:23) at TypeScriptParserMixin.parseUpdate (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:721:21) at TypeScriptParserMixin.parseMaybeUnary (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:683:23) at TypeScriptParserMixin.parseMaybeUnary (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3893:20) at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:417:14) at TypeScriptParserMixin.parseExprOps (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:429:23) at TypeScriptParserMixin.parseMaybeConditional (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:384:23) at TypeScriptParserMixin.parseMaybeAssign (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:301:21) at TypeScriptParserMixin.parseMaybeAssign (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3764:22) at callback (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:257:12) at TypeScriptParserMixin.allowInAnd (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:3222:16) at TypeScriptParserMixin.parseMaybeAssignAllowIn (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/expression.ts:256:17) at TypeScriptParserMixin.parseVar (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:1587:18) at TypeScriptParserMixin.parseVarStatement (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:1251:10) at TypeScriptParserMixin.parseVarStatement (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3085:33) at TypeScriptParserMixin.parseStatementContent (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:612:21) at TypeScriptParserMixin.parseStatementContent (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/plugins/typescript/index.ts:3220:20) at TypeScriptParserMixin.parseStatementLike (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:482:17) at TypeScriptParserMixin.parseStatementListItem (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:431:17) at TypeScriptParserMixin.parseExportDeclaration (/home/lg/workspace/projects/DefesAi_AdeusMultas/node_modules/@babel/parser/src/parser/statement.ts:2635:17 Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting"
- code: server.hmr.overlay
- text: to
- code: "false"
- text: in
- code: vite.config.ts
- text: .
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  4   | 
  5   | // Playwright defaults apply: expect 5s, test 30s. No timeout inflation.
  6   | const testUser = {
  7   |   name: 'João Pereira Lima', // distinct from the input's default value
  8   |   phone: '(11) 98765-4321',
  9   |   email: 'carlos.silveira@email.com',
  10  |   cpf: '123.456.789-09',
  11  |   cnh: '05492817492',
  12  | };
  13  | 
  14  | const testVehicle = {
  15  |   plate: 'BRA2E19',
  16  |   brandModel: 'Honda Civic 2020',
  17  |   renavam: '123456789',
  18  |   year: '2020',
  19  |   color: 'Prata',
  20  | };
  21  | 
  22  | const testInfraction = {
  23  |   aitNumber: '1B892014',
  24  |   infractionCode: '745-50', // Art. 218 I - speeding up to 20%
  25  |   autuadorBody: 'DETRAN-SP',
  26  |   dateTime: '2024-01-15',
  27  | };
  28  | 
  29  | // Simulate a logged-in user via the localStorage auth fallback.
  30  | // The dev server is launched WITHOUT Supabase env vars (see playwright.config.ts),
  31  | // so AuthContext reads this storage key directly with no network calls.
  32  | async function forceLocalAuth(page: Page, user: Record<string, unknown>) {
  33  |   await page.addInitScript((mockUser) => {
  34  |     localStorage.setItem('defesai_auth_session_v1', JSON.stringify(mockUser));
  35  |   }, user);
  36  | }
  37  | 
  38  | const ADMIN_USER = {
  39  |   id: 'admin-test-id',
  40  |   name: 'Admin Teste',
  41  |   email: 'admin@defesai.com',
  42  |   cpf: '000.000.000-00',
  43  |   phone: '(11) 90000-0000',
  44  |   role: 'admin',
  45  |   isAdmin: true,
  46  | };
  47  | 
  48  | // Step titles from actual UI components
  49  | function getStepTitle(step: number): string {
  50  |   const titles: Record<number, string> = {
  51  |     1: 'Qual situação você quer resolver?',
  52  |     2: 'Em que situação está sua multa?',
  53  |     3: 'Qual é o auto de infração e o condutor?',
  54  |     4: 'Sobre o tipo da infração',
  55  |     5: 'Analisando sua autuação com Inteligência Jurídica',
  56  |     6: 'Diagnóstico Jurídico Gratuito Concluído', // badge div in FreeAnalysisResultStep
  57  |     7: 'Agora vamos preparar sua defesa formal',
  58  |     8: 'Revisão dos Dados da Petição',
  59  |     9: 'Liberação da Petição & Checklist de Protocolo',
  60  |   };
  61  |   return titles[step] || `Etapa ${step}`;
  62  | }
  63  | 
  64  | async function waitForStep(page: Page, step: number) {
  65  |   const title = getStepTitle(step);
  66  |   await expect(
  67  |     page.locator(`h1:has-text("${title}"), h2:has-text("${title}"), h3:has-text("${title}")`)
> 68  |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  69  | }
  70  | 
  71  | async function navigateToOnboarding(page: Page) {
  72  |   await page.goto(`${BASE_URL}/novo-caso`, { waitUntil: 'domcontentloaded' });
  73  |   await waitForStep(page, 1);
  74  | }
  75  | 
  76  | const TEST_FILL_BTN = 'button:has-text("Preencher com dados de teste")';
  77  | 
  78  | async function fillInput(page: Page, id: string, value: string) {
  79  |   await page.fill(`#${id}`, value);
  80  |   await page.waitForTimeout(100);
  81  | }
  82  | 
  83  | async function selectNativeOption(page: Page, id: string, value: string) {
  84  |   // Wait for option to exist, then select
  85  |   await page.waitForFunction(
  86  |     ([sel, val]) => {
  87  |       const el = document.querySelector(sel) as HTMLSelectElement | null;
  88  |       return !!el && Array.from(el.options).some((o) => o.value === val);
  89  |     },
  90  |     [`#${id}`, value]
  91  |   );
  92  |   await page.selectOption(`#${id}`, value);
  93  |   await page.waitForTimeout(100);
  94  | }
  95  | 
  96  | // Steps 1-3: service + stage + infraction identification
  97  | async function completeSteps1to3(page: Page) {
  98  |   // Step 1: select "Multa de Trânsito"
  99  |   await page.click('#service-option-multa_transito');
  100 |   await waitForStep(page, 2);
  101 | 
  102 |   // Step 2: select "Recebi a primeira notificação"
  103 |   await page.click('#stage-option-primeira_notificacao');
  104 |   await waitForStep(page, 3);
  105 | 
  106 |   // Step 3: fill infraction identification
  107 |   await fillInput(page, 'input-lead-name', testUser.name);
  108 |   await fillInput(page, 'input-lead-phone', testUser.phone);
  109 |   await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
  110 |   await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
  111 |   await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
  112 |   await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
  113 |   await fillInput(page, 'input-datetime', testInfraction.dateTime);
  114 | 
  115 |   await page.click('#btn-next-to-specifics');
  116 |   await waitForStep(page, 4);
  117 | }
  118 | 
  119 | // Step 4: speed category + run analysis -> step 5 -> auto-advance to step 6.
  120 | // Step 5 (AnalysisProcessingStep) has 6 sequential setTimeout = 4200ms total
  121 | // (lines 50-56: 700+800+800+700+700+500). Fake clock installed in beforeEach
  122 | // accelerates these without masking the artificial delay.
  123 | //
  124 | // Single fastForward(5000) does NOT work: it fires timers synchronously, but React
  125 | // re-renders on a real MessageChannel macrotask, so the next stage timer is only
  126 | // scheduled after fastForward returns. Instead: small 1s jumps interleaved with a
  127 | // real pause, letting React flush and reschedule between stages.
  128 | async function runAnalysisAndWaitResult(page: Page) {
  129 |   await page.click('#btn-run-analysis');
  130 |   await waitForStep(page, 5);
  131 |   // Step 6 badge is raw text inside a div (FreeAnalysisResultStep), not a heading
  132 |   const badge = page.getByText(getStepTitle(6)).first();
  133 |   for (let i = 0; i < 8 && !(await badge.isVisible().catch(() => false)); i++) {
  134 |     await page.clock.fastForward(1000);
  135 |     await page.waitForTimeout(50);
  136 |   }
  137 |   await expect(badge).toBeVisible();
  138 | }
  139 | 
  140 | test.describe('Onboarding Flow - E2E', () => {
  141 |   test.beforeEach(async ({ page }) => {
  142 |     await page.context().clearCookies();
  143 |     // Fake timers must be installed before navigation so the step-5 setTimeout
  144 |     // chain (4200ms) runs under clock control from the start.
  145 |     await page.clock.install();
  146 |   });
  147 | 
  148 |   test('happy-path: user completes free analysis (steps 1-6)', async ({ page }) => {
  149 |     await navigateToOnboarding(page);
  150 | 
  151 |     // Step 1: service selection
  152 |     await expect(page.locator('#service-option-multa_transito')).toBeVisible();
  153 |     await page.click('#service-option-multa_transito');
  154 |     await waitForStep(page, 2);
  155 | 
  156 |     // Step 2: process stage
  157 |     await expect(page.locator('#stage-option-primeira_notificacao')).toBeVisible();
  158 |     await page.click('#stage-option-primeira_notificacao');
  159 |     await waitForStep(page, 3);
  160 | 
  161 |     // Step 3: fill form
  162 |     await fillInput(page, 'input-lead-name', testUser.name);
  163 |     await fillInput(page, 'input-lead-phone', testUser.phone);
  164 |     await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
  165 |     await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
  166 |     await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
  167 |     await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
  168 | 
```