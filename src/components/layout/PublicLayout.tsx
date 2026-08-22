import React from 'react';
import { AccessibilityBar } from '../common/AccessibilityBar';
import { PrivateAccessibilityBar } from '../ui/PrivateAccessibilityBar';
import { PrivateHeader } from '../ui/PrivateHeader';
import { PrivateFooter } from '../ui/PrivateFooter';
import { PrivateCookieBanner } from '../ui/PrivateCookieBanner';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col font-sans text-[#1B1B1B]">
      {/* 0. Skip link + Barra de Acessibilidade gov.br (atalhos 1/2/3) */}
      <AccessibilityBar />

      {/* 1. Barra Superior de Acessibilidade DefesAi (eMAG / Alt + 1-4) */}
      <PrivateAccessibilityBar />

      {/* 2. Cabeçalho Oficial DefesAi (contém nav#main-menu e #main-search existentes) */}
      <div id="menu-navegacao">
        <PrivateHeader />
      </div>

      {/* 3. Conteúdo Principal Acessível */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div id="conteudo-principal" tabIndex={-1}>
          {children}
        </div>
      </main>

      {/* 4. Rodapé Padrão DefesAi (footer#footer interno) */}
      <div id="rodape">
        <PrivateFooter />
      </div>

      {/* 5. Banner de Cookies e Privacidade LGPD */}
      <PrivateCookieBanner />
    </div>
  );
};
