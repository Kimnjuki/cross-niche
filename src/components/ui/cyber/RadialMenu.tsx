import React, { useState } from 'react';

interface RadialMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  disabled?: boolean;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  trigger?: 'click' | 'hover';
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const RadialMenu: React.FC<RadialMenuProps> = ({
  items,
  className = '',
  onOpen,
  onClose,
  trigger = 'click',
  position = 'center'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    } else {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const handleItemClick = (item: RadialMenuItem) => {
    if (!item.disabled && item.action) {
      item.action();
      setIsOpen(false);
      onClose?.();
    }
  };

  const getMenuPosition = () => {
    switch (position) {
      case 'top-left':
        return {
          top: '2rem',
          left: '2rem',
          transform: 'translate(-50%, -50%)'
        };
      case 'top-right':
        return {
          top: '2rem',
          right: '2rem',
          transform: 'translate(50%, -50%)'
        };
      case 'bottom-left':
        return {
          bottom: '2rem',
          left: '2rem',
          transform: 'translate(-50%, 50%)'
        };
      case 'bottom-right':
        return {
          bottom: '2rem',
          right: '2rem',
          transform: 'translate(50%, 50%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  const menuStyle = getMenuPosition();

  return (
    <div className={`relative ${className}`}>
      <div
        ref={setTriggerRef}
        className="cyberpunk-glow cursor-pointer"
        onClick={toggleMenu}
        onMouseEnter={trigger === 'hover' ? toggleMenu : undefined}
        onMouseLeave={trigger === 'hover' ? toggleMenu : undefined}
      >
        <div className="cyberpunk-text text-2xl">
          &#9776;
        </div>
      </div>

      {isOpen && (
        <div
          className="cyberpunk-hologram absolute rounded-full border-2 border-cyber-purple shadow-cyberdeck"
          style={menuStyle}
        >
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`cyberpunk-text text-base mb-2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon && (
                    <div className="mb-1">{item.icon}</div>
                  )}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadialMenu;