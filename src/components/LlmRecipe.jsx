/* eslint-disable no-unused-vars */
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function LlmRecipe(props) {
    const { recipe, isRecipeExiting, handleResetEnd } = props;

    // Variants for animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5,
                delay: 1,
            },
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const childVariants = {
        hidden: { 
            opacity: 0, 
            y: 20 
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1,
                ease: "easeOut"
            }
        }
    };

    // Create animated components for markdown elements
    const components = {
        pre: ({ node, ...props }) => <motion.p variants={childVariants} {...props} />,
        p: ({ node, ...props }) => <motion.p variants={childVariants} {...props} />,
        h1: ({ node, ...props }) => <motion.h1 variants={childVariants} {...props} />,
        h2: ({ node, ...props }) => <motion.h2 variants={childVariants} {...props} />,
        h3: ({ node, ...props }) => <motion.h3 variants={childVariants} {...props} />,
        ul: ({ node, ...props }) => <motion.ul variants={childVariants} {...props} />,
        ol: ({ node, ...props }) => <motion.ol variants={childVariants} {...props} />,
        li: ({ node, ...props }) => <motion.li variants={childVariants} {...props} />,
        blockquote: ({ node, ...props }) => <motion.blockquote variants={childVariants} {...props} />,
        strong: ({ node, ...props }) => <motion.strong variants={childVariants} {...props} />,
        em: ({ node, ...props }) => <motion.em variants={childVariants} {...props} />,
    };

    return (
        <section 
        className={`suggested-recipe-section ${isRecipeExiting ? 'box-exit' : ''}`}
        onAnimationEnd={handleResetEnd}
        >
            <div className='title'>
                <h2 class>MindMeal Suggests:</h2>
                <span className="block"></span>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={recipe}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <ReactMarkdown components={components}>
                        {recipe}
                    </ReactMarkdown>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}