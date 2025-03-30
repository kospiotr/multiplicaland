import { motion, AnimatePresence } from 'framer-motion';

const funnyImages = [
  '/rewards/math-meme-1.jpg',
  '/rewards/math-meme-2.jpg',
  '/rewards/math-meme-3.jpg',
  '/rewards/math-meme-4.jpg',
  '/rewards/math-meme-5.jpg'
];

interface ImageRewardProps {
  show: boolean;
}

const ImageReward = ({ show }: ImageRewardProps) => {
  // Select a random image when the component mounts
  const selectedImage = funnyImages[Math.floor(Math.random() * funnyImages.length)];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-4 max-w-md mx-4"
          >
            <img 
              src={selectedImage} 
              alt="Reward meme" 
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '60vh' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageReward; 