import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ pageKey, children, className }) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
