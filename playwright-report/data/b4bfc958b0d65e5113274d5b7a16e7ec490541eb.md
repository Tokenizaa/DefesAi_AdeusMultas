# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> Onboarding Flow - E2E >> user-normal: regular user does not see test-fill buttons
- Location: tests/onboarding.spec.ts:229:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Sobre o tipo da infração"), h2:has-text("Sobre o tipo da infração"), h3:has-text("Sobre o tipo da infração")')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1:has-text("Sobre o tipo da infração"), h2:has-text("Sobre o tipo da infração"), h3:has-text("Sobre o tipo da infração")')

```

```yaml
- link "Pular para o conteúdo principal":
  - /url: "#conteudo-principal"
- navigation "Atalhos de acessibilidade":
  - list:
    - listitem:
      - link "Ir para o conteúdo 1":
        - /url: "#conteudo-principal"
    - listitem:
      - link "Ir para o menu 2":
        - /url: "#menu-navegacao"
    - listitem:
      - link "Ir para o rodapé 3":
        - /url: "#rodape"
- link "Ir para o conteúdo 1":
  - /url: "#main-content"
- link "Ir para o menu 2":
  - /url: "#main-menu"
- link "Ir para a busca 3":
  - /url: "#main-search"
- link "Ir para o rodapé 4":
  - /url: "#footer"
- button "Diminuir tamanho da fonte": A-
- button "Redefinir tamanho da fonte": A
- button "Aumentar tamanho da fonte": A+
- button "Alternar modo de alto contraste": Alto Contraste
- banner:
  - text: DEFESAI Sistema de Defesa Autônoma
  - link "Página Inicial":
    - /url: /
  - link "Análise Gratuita":
    - /url: /novo-caso
  - link "Base Jurídica":
    - /url: /knowledge
  - button "Abrir menu de navegação"
  - text: Defe s Ai
  - heading "Adeus Multa CTB • CONTRAN" [level=1]
  - paragraph: Plataforma de Defesa Autônoma para Multas de Trânsito
  - textbox "Buscar serviços ou infrações..."
  - button "Executar busca"
  - button "Análise Gratuita"
  - button "D Acessar Conta"
- main:
  - text: F1 Fase 1 • Diagnóstico Preliminar • 100% Gratuito
  - heading "3. Identificação da Autuação & Veículo" [level=2]
  - text: Passo 3 de 4 • Identificação da Autuação
  - heading "Qual é o auto de infração e o condutor?" [level=1]
  - paragraph: Coletamos os dados da autuação e seu contato para envio imediato do diagnóstico jurídico gratuito e alertas de prazo.
  - text: Seus Dados para o Diagnóstico Gratuito 100% Gratuito Seu Nome Completo *
  - 'textbox "Ex: Carlos Eduardo Silveira"': Carlos Eduardo Silveira
  - text: WhatsApp com DDD *
  - textbox "(11) 98765-4321"
  - paragraph: Anexe uma foto ou PDF da notificação para melhorar a análise (Opcional)
  - paragraph: "Formatos aceitos: PDF, JPG ou PNG. Os dados abaixo devem ser preenchidos manualmente."
  - text: Carregar Notificação Número do Auto de Infração (AIT)
  - 'textbox "Ex: 1B892014 ou R459201"'
  - text: Consta no topo ou centro da notificação recebida. Placa do Veículo *
  - 'textbox "Ex: BRA2E19 ou ABC1234"'
  - text: Placa no formato Mercosul ou padrão anterior cinza. Código da Infração *
  - combobox:
    - option "Selecione o código da infração..." [selected]
    - option "745-50 — Transitar em velocidade superior à máxima permitida em até 20%..."
    - option "746-30 — Transitar em velocidade superior à máxima permitida em mais de 20% até..."
    - option "747-10 — Transitar em velocidade superior à máxima permitida em mais de 50% (Su..."
    - option "516-91 — Recusar-se a ser submetido a teste, exame clínico ou perícia de alcool..."
    - option "516-92 — Dirigir sob a influência de álcool ou substância psicoativa..."
    - option "736-62 — Dirigir veículo segurando ou manuseando telefone celular..."
    - option "735-80 — Dirigir veículo utilizando-se de fones nos ouvidos conectados a aparel..."
    - option "605-01 — Avançar o sinal vermelho do semáforo ou de parada obrigatória (Semafór..."
    - option "605-02 — Avançar o sinal de parada obrigatória em cruzamento (Fiscalização Huma..."
    - option "545-21 — Estacionar o veículo no passeio ou sobre faixa destinada a pedestre..."
    - option "554-12 — Estacionar o veículo em desacordo com as condições de estacionamento r..."
    - option "501-00 — Dirigir veículo sem possuir Carteira Nacional de Habilitação ou Permis..."
    - option "504-50 — Dirigir veículo com validade da CNH vencida há mais de 30 dias..."
    - option "581-70 — Transitar com o veículo em calçadas, passeios, passarelas ou acostamen..."
    - option "596-70 — Ultrapassar pela contramão outro veículo onde houver linha dupla contí..."
    - option "659-92 — Conduzir o veículo que não esteja registrado e devidamente licenciado..."
    - option "685-80 — Transitar com o veículo com lotação excedente..."
    - option "703-81 — Conduzir motocicleta, motoneta ou ciclomotor sem usar capacete de segu..."
    - option "704-81 — Conduzir motocicleta transportando passageiro sem o capacete de segura..."
    - option "518-51 — Deixar o condutor de usar o cinto de segurança..."
    - option "518-52 — Deixar o passageiro de usar o cinto de segurança..."
    - option "758-70 — Transitar na faixa ou pista da esquerda regulamentada como de circulaç..."
    - option "759-50 — Transitar na faixa ou via de trânsito exclusivo para transporte públic..."
    - option "672-61 — Conduzir o veículo em mau estado de conservação, comprometendo a segur..."
  - text: Órgão Autuador / Julgador *
  - combobox:
    - option "Selecione o órgão autuador..." [selected]
  - text: Data da Ocorrência
  - textbox
  - text: Art. 281-A CTB
  - button "Voltar à fase"
  - button "Continuar para Perguntas do Caso" [disabled]
- contentinfo:
  - text: Defe s Ai | Adeus Multa
  - paragraph: Plataforma de inteligência jurídica para geração determinística de defesas e recursos de trânsito em conformidade com o Código de Trânsito Brasileiro (CTB) e Resoluções do CONTRAN.
  - text: Sistema de Defesa Autônoma
  - heading "Serviços ao Usuário" [level=3]
  - list:
    - listitem:
      - button "Análise Preliminar Gratuita de Multa"
    - listitem:
      - button "Defesa Prévia (Notificação de Autuação)"
    - listitem:
      - button "Recurso à JARI (1ª Instância)"
    - listitem:
      - button "Recurso ao CETRAN (2ª Instância)"
    - listitem:
      - button "Conversão em Advertência (Art. 267 CTB)"
  - heading "Legislação & Normas" [level=3]
  - list:
    - listitem:
      - link "Lei nº 9.503/1997 (CTB)":
        - /url: https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm
    - listitem: Resoluções CONTRAN (798, 909, 918)
    - listitem: Súmula 312 do STJ (Notificação Dupla)
    - listitem: Tema 1.097 do STJ
    - listitem:
      - link "SENATRAN — Secretaria Nacional":
        - /url: https://www.gov.br/transportes/pt-br/assuntos/transito/senatran
  - heading "Acessibilidade & LGPD" [level=3]
  - paragraph: Tratamento de dados realizado estritamente segundo as diretrizes da Lei nº 13.709/2018 (LGPD), garantindo sigilo e minimização de coleta.
  - text: Criptografia de Ponta a Ponta
  - paragraph: Em conformidade com o eMAG e WCAG 2.1 / 2.2 AA.
  - text: BRASIL
  - paragraph: © 2026 DefesAi • Tecnologia Jurídica Autônoma • Todos os direitos reservados.
  - text: Padrão DefesAi • Versão 1.0.0
- region "Aviso de Privacidade e Cookies":
  - heading "Privacidade e Proteção de Dados (LGPD — Lei nº 13.709/2018)" [level=4]
  - paragraph: Utilizamos cookies e tecnologias similares estritamente essenciais para garantir a segurança da sessão, acessibilidade e a correta geração das defesas de trânsito.
  - button "Apenas Necessários"
  - button "Aceitar e Continuar"
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
  50  |     const titles: Record<number, string> = {
  51  |       1: 'Qual situação você quer resolver?',
  52  |       2: 'Em que situação está sua multa?',
  53  |       3: 'Sobre o tipo da infração',
  54  |       4: 'Qual é o auto de infração e o condutor?',
  55  |       5: 'Detalhes técnicos da sua autuação',
  56  |       6: 'Processando Análise Jurídica',
  57  |       7: 'Diagnóstico Jurídico Gratuito Concluído', // badge div in FreeAnalysisResultStep
  58  |       8: 'Qualificação do Requerente para a Peça',
  59  |       9: 'Revisão dos Dados da Petição',
  60  |       10: 'Liberação da Petição & Checklist de Protocolo',
  61  |     };
  62  |     return titles[step] || `Etapa ${step}`;
  63  | }
  64  | 
  65  | async function waitForStep(page: Page, step: number) {
  66  |   const title = getStepTitle(step);
  67  |   await expect(
  68  |     page.locator(`h1:has-text("${title}"), h2:has-text("${title}"), h3:has-text("${title}")`)
> 69  |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  70  | }
  71  | 
  72  | async function navigateToOnboarding(page: Page) {
  73  |   await page.goto(`${BASE_URL}/novo-caso`, { waitUntil: 'networkidle' });
  74  |   await waitForStep(page, 1);
  75  | }
  76  | 
  77  | const TEST_FILL_BTN = 'button:has-text("Preencher com dados de teste")';
  78  | 
  79  | async function fillInput(page: Page, id: string, value: string) {
  80  |   await page.fill(`#${id}`, value);
  81  |   await page.waitForTimeout(100);
  82  | }
  83  | 
  84  | async function selectNativeOption(page: Page, id: string, value: string) {
  85  |   // Wait for option to exist, then select
  86  |   await page.waitForFunction(
  87  |     ([sel, val]) => {
  88  |       const el = document.querySelector(sel) as HTMLSelectElement | null;
  89  |       return !!el && Array.from(el.options).some((o) => o.value === val);
  90  |     },
  91  |     [`#${id}`, value]
  92  |   );
  93  |   await page.selectOption(`#${id}`, value);
  94  |   await page.waitForTimeout(100);
  95  | }
  96  | 
  97  | // Steps 1-5: service + stage + category + identification + specific infraction data
  98  | async function completeSteps1to4(page: Page) {
  99  |     // Step 1: select situation (Multa de Trânsito)
  100 |     await page.click('#service-option-multa_transito');
  101 |     await waitForStep(page, 2); // Now goes to step 2 (stage selection)
  102 | 
  103 |     // Step 2: select stage (primeira notificacao)
  104 |     await page.click('#stage-option-primeira_notificacao');
  105 |     await waitForStep(page, 3); // Now goes to step 3 (category selection)
  106 | 
  107 |     // Step 3: select category (Velocidade)
  108 |     await page.click('#category-card-excesso_velocidade');
  109 |     await page.click('#btn-next-to-identification');
  110 |     await waitForStep(page, 4); // Now goes to step 4 (infraction identification)
  111 | 
  112 |     // Step 4: fill infraction identification
  113 |     await fillInput(page, 'input-lead-name', testUser.name);
  114 |     await fillInput(page, 'input-lead-phone', testUser.phone);
  115 |     await fillInput(page, 'input-ait-number', testInfraction.aitNumber);
  116 |     await fillInput(page, 'input-vehicle-plate', testVehicle.plate);
  117 |     await selectNativeOption(page, 'input-infraction-code', testInfraction.infractionCode);
  118 |     await selectNativeOption(page, 'input-autuador-body', testInfraction.autuadorBody);
  119 |     await fillInput(page, 'input-datetime', testInfraction.dateTime);
  120 | 
  121 |     await page.click('#btn-next-to-specifics');
  122 |     await waitForStep(page, 5); // Now goes to step 5 (specific infraction data)
  123 | }
  124 | 
  125 | // Step 5: speed category + run analysis -> step 6 -> auto-advance to step 7.
  126 | async function runAnalysisAndWaitResult(page: Page) {
  127 |   await page.click('#btn-run-analysis');
  128 |   await waitForStep(page, 6);
  129 |   // Step 7 badge is raw text inside a div (FreeAnalysisResultStep), not a heading
  130 |   const badge = page.getByText(getStepTitle(7)).first();
  131 |   for (let i = 0; i < 8 && !(await badge.isVisible().catch(() => false)); i++) {
  132 |     await page.clock.fastForward(1000);
  133 |     await page.waitForTimeout(50);
  134 |   }
  135 |   await expect(badge).toBeVisible();
  136 | }
  137 | 
  138 | test.describe('Onboarding Flow - E2E', () => {
  139 |   test.beforeEach(async ({ page }) => {
  140 |     await page.context().clearCookies();
  141 |     await page.addInitScript(() => {
  142 |       localStorage.removeItem('defesai_wizard_state');
  143 |     });
  144 |     // Fake timers must be installed before navigation so the step-6 setTimeout
  145 |     // chain runs under clock control from the start.
  146 |     await page.clock.install();
  147 |   });
  148 | 
  149 | test('happy-path: user completes free analysis (steps 1-7)', async ({ page }) => {
  150 |     await navigateToOnboarding(page);
  151 | 
  152 |     // Step 1: service selection
  153 |     await expect(page.locator('#service-option-multa_transito')).toBeVisible();
  154 |     await page.click('#service-option-multa_transito');
  155 |     await waitForStep(page, 2); // Now at step 2: stage selection
  156 | 
  157 |     // Step 2: stage selection
  158 |     await expect(page.locator('#stage-option-primeira_notificacao')).toBeVisible();
  159 |     await page.click('#stage-option-primeira_notificacao');
  160 |     await waitForStep(page, 3); // Now at step 3: infraction category selection
  161 | 
  162 |     // Step 3: category selection (Velocidade)
  163 |     await expect(page.locator('#category-card-excesso_velocidade')).toBeVisible();
  164 |     await page.click('#category-card-excesso_velocidade');
  165 |     await page.click('#btn-next-to-identification');
  166 |     await waitForStep(page, 4); // Now at step 4: infraction identification
  167 | 
  168 |     // Step 4: fill identification form
  169 |     await fillInput(page, 'input-lead-name', testUser.name);
```