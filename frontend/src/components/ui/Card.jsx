import { motion } from 'framer-motion';
import { cn } from './Button'; // Reusing the simple utility

const Card = ({ children, className, onClick, hoverEffect = true, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect && onClick ? { y: -4, scale: 1.01 } : hoverEffect ? { y: -4 } : {}}
      className={cn(
        'glass rounded-2xl p-6 transition-shadow duration-300',
        onClick && 'cursor-pointer hover:shadow-hover',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
