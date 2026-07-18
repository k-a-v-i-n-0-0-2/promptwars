import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-cyan to-sky text-void hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]',
  secondary: 'glass text-text-primary hover:bg-white/[0.06]',
  danger: 'bg-rose text-white hover:bg-rose/90',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    className={`
      relative inline-flex items-center justify-center gap-2 font-semibold
      rounded-button transition-all duration-300 overflow-hidden cursor-pointer
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
    {...props}
  >
    {variant === 'primary' && (
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
    )}
    {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    <span className="relative">{children}</span>
  </motion.button>
);

export default Button;
