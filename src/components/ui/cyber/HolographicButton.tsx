import React from 'react';

interface HolographicButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-cyber-mid text-cyber-purple';
      case 'danger':
        return 'bg-threat-red text-cyber-dark';
      default:
        return 'bg-cyber-purple text-matrix-green';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`cyber-button ${getVariantClass()} ${getSizeClass()} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
      type="button"
    >
      {loading && (
        <div className="cyberpunk-text animate-pulse">
          Loading...
        </div>
      )}
      {!loading && children}
    </button>
  );
};

export default HolographicButton;