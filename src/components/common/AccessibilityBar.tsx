import React from 'react';

/**
 * Barra de acessibilidade padrão GOV.BR (atalhos 1/2/3) + skip link.
 * Manual: govbr-technical-manual/06-acessibilidade.md (§6.3.2 Atalhos de Teclado)
 *   1 = conteúdo principal · 2 = menu de navegação · 3 = rodapé
 *
 * Usa apenas links âncora nativos (<a href="#...">): navegação por teclado
 * funciona sem listener JS global. Requer no layout os alvos:
 *   #conteudo-principal, #menu-navegacao, #rodape
 */
export const AccessibilityBar: React.FC = () => {
  const atalhos = [
    { href: '#conteudo-principal', label: 'Ir para o conteúdo', tecla: '1' },
    { href: '#menu-navegacao', label: 'Ir para o menu', tecla: '2' },
    { href: '#rodape', label: 'Ir para o rodapé', tecla: '3' },
  ];

  return (
    <>
      {/* Skip link: primeiro elemento focável da página, visível só com foco */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded-sm focus:bg-white focus:px-3 focus:py-1.5 focus:text-sm focus:font-semibold focus:text-[#155BCB] focus:shadow-lg focus:outline focus:outline-2 focus:outline-[#155BCB]"
      >
        Pular para o conteúdo principal
      </a>

      {/* Barra gov.br de atalhos */}
      <nav
        aria-label="Atalhos de acessibilidade"
        className="bg-[#071D41] border-b border-[#0C326F] px-4 sm:px-6 lg:px-8 py-0.5"
      >
        <ul className="max-w-7xl mx-auto flex items-center gap-x-4 gap-y-0.5 overflow-x-auto py-0.5 text-xs text-white">
          {atalhos.map(({ href, label, tecla }) => (
            <li key={tecla}>
              <a
                href={href}
                title={`${label} (tecla ${tecla})`}
                className="flex items-center gap-1 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
              >
                {label}
                <kbd className="hidden md:inline-block rounded border border-orange-500 bg-[#0C326F] px-1 font-mono text-[9px]">
                  {tecla}
                </kbd>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
