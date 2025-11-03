import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Sparkles } from "lucide-react";

interface SecretRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretRecipesModal = ({ isOpen, onClose }: SecretRecipesModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-accent/20 via-background to-secondary/20 border-2 border-accent rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-8 border-b border-accent/30 bg-gradient-to-r from-accent/10 to-secondary/10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-8 w-8 text-accent" />
                  </motion.div>
                  <ChefHat className="h-10 w-10 text-accent" />
                  <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-8 w-8 text-accent" />
                  </motion.div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 text-white">
                  🎉 Secret Unlocked! 🎉
                </h2>
                <p className="text-center text-white/80 text-lg">
                  You found the hidden Vietnamese recipes vault!
                </p>
                <p className="text-center text-accent/80 text-sm mt-2">
                  (↑↑↓↓←→←→BA - You know your classics!)
                </p>
              </motion.div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                {/* Bonus Recipes */}
                <div className="space-y-6">
                  <BonusRecipe
                    emoji="🥖"
                    name="Bánh Mì Thịt"
                    description="The legendary Vietnamese sandwich - crusty baguette meets Asian flavors"
                    secret="My secret: Toast the bread with a thin layer of mayo on the inside for extra crunch!"
                  />
                  <BonusRecipe
                    emoji="🍲"
                    name="Bún Bò Huế"
                    description="Spicy beef noodle soup from Huế - more complex than any algorithm"
                    secret="The key is lemongrass and shrimp paste. Don't skip the blood cubes if you're brave!"
                  />
                  <BonusRecipe
                    emoji="🥥"
                    name="Chè Ba Màu"
                    description="Three-color dessert - layers of beans, jelly, and coconut milk"
                    secret="Each layer represents a different data structure. It's like a delicious stack!"
                  />
                  <BonusRecipe
                    emoji="🍜"
                    name="Mì Quảng"
                    description="Turmeric noodles with pork and shrimp - comfort in a bowl"
                    secret="The peanut-cracker ratio is critical. It's like balancing a binary search tree."
                  />
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20">
                  <p className="text-center text-foreground font-medium mb-2">
                    ✨ Achievement Unlocked: Vietnamese Food Connoisseur ✨
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    Share this with anyone who appreciates good food and good code!
                  </p>
                </div>

                <div className="text-center text-xs text-muted-foreground italic">
                  "Code is like cooking - both require passion, precision, and a willingness to
                  debug when things go wrong." - Thu Nguyen
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BonusRecipe = ({
  emoji,
  name,
  description,
  secret,
}: {
  emoji: string;
  name: string;
  description: string;
  secret: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl bg-background/50 border border-border hover:border-accent/50 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{emoji}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <div className="pl-4 border-l-2 border-accent/50">
            <p className="text-xs font-semibold text-accent mb-1">🤫 Secret Tip:</p>
            <p className="text-xs text-foreground/80">{secret}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
