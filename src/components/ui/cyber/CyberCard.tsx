import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'hologram' | 'terminal';
}

const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className = '',
  onClick,
  title,
  subtitle,
  variant = 'default'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'hologram':
        return 'cyberpunk-hologram';
      case 'terminal':
        return 'cyberpunk-terminal';
      default:
        return 'cyberpunk-theme';
    }
  };

  return (
    <div
      className={`cyber-card ${getVariantClass()} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {title && (
        <div className="cyberpunk-text text-2xl font-bold mb-4">
          {title}
        </div>
      )}
      {subtitle && (
        <div className="cyberpunk-text text-sm text-cyber-purple mb-4">
          {subtitle}
        </div>
      )}
      <div className="cyberpunk-text text-base">
        {children}
      </div>
    </div>
  );
};

export default CyberCard;