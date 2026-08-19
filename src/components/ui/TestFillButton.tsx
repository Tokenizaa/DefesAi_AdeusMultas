import React from 'react';

interface TestFillButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  isAdmin?: boolean;
}

export const TestFillButton: React.FC<TestFillButtonProps> = ({
  onClick,
  label = '\uD83E\uDDEA Preencher com dados de teste',
  className = '',
  isAdmin = false,
}) => {
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`border border-dashed border-blue-300 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};
