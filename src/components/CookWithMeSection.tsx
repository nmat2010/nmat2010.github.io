import { useState } from "react";
import { ChefHat, Clock, Users, Flame, Check } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./animations/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/card";

interface Recipe {
  name: string;
  nameVietnamese: string;
  description: string;
  time: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  engineeringLesson: string;
  ingredients: string[];
  steps: string[];
  image: string;
}

const recipes: Recipe[] = [
  {
    name: "Phở Gà",
    nameVietnamese: "Phở Gà (Vietnamese Chicken Noodle Soup)",
    description: "The ultimate comfort food from home. Rich broth, tender chicken, and fresh herbs.",
    time: "2 hours",
    servings: "4-6",
    difficulty: "Medium",
    engineeringLesson: "Like debugging code, making phở is about patience and iteration. You can't rush a good broth, just like you can't skip testing.",
    ingredients: [
      "1 whole chicken (3-4 lbs)",
      "2 large onions, halved",
      "4-inch piece of ginger, halved lengthwise",
      "2 cinnamon sticks",
      "4 star anise",
      "6 cloves",
      "1 tbsp coriander seeds",
      "Rice noodles (bánh phở)",
      "Fresh herbs: cilantro, Thai basil, lime, jalapeños",
      "Fish sauce, salt, sugar to taste",
    ],
    steps: [
      "Char onions and ginger over open flame until blackened (5 mins). This adds depth - like adding comments to code, it's the details that matter.",
      "Toast spices in dry pan until fragrant. The smell test works for spices and for code quality!",
      "Boil chicken in 12 cups water. Skim foam frequently. Remove chicken after 30 mins (overcooking = bugs in production).",
      "Simmer broth with charred aromatics and spices for 1.5 hours. Low and slow, like training a neural network.",
      "Shred chicken. Strain broth. Season with fish sauce, salt, sugar. Taste and adjust - just like tuning hyperparameters.",
      "Cook rice noodles per package. Assemble bowls: noodles, chicken, hot broth, fresh herbs.",
      "Serve with lime, jalapeños, and hoisin sauce. Customization is key - both in food and in code!",
    ],
    image: "🍜",
  },
  {
    name: "Gỏi Cuốn",
    nameVietnamese: "Gỏi Cuốn (Fresh Spring Rolls)",
    description: "Light, fresh, and endlessly customizable. Perfect for meal prep or impressing friends.",
    time: "30 minutes",
    servings: "4",
    difficulty: "Easy",
    engineeringLesson: "Spring rolls teach you about clean interfaces. Each ingredient is modular, testable, and the wrapper (API) holds it all together beautifully.",
    ingredients: [
      "Rice paper wrappers",
      "Rice vermicelli noodles, cooked",
      "Shrimp, cooked and halved (or tofu for vegetarian)",
      "Lettuce leaves",
      "Fresh mint and cilantro",
      "Cucumber, julienned",
      "Carrots, julienned",
      "Peanut dipping sauce (hoisin + peanut butter + water + lime)",
    ],
    steps: [
      "Prep all ingredients first. Mise en place = proper planning prevents poor performance.",
      "Dip rice paper in warm water for 2-3 seconds. Too long and it tears (memory leak!), too short and it won't stick (undefined reference).",
      "Lay on damp towel. Add lettuce first (base layer), then noodles, protein, veggies, herbs.",
      "Fold sides in, then roll tightly from bottom up. Think of it as encapsulation in OOP.",
      "Serve with peanut sauce. The sauce is the user interface - makes everything come together!",
    ],
    image: "🌯",
  },
  {
    name: "Cà Phê Sữa Đá",
    nameVietnamese: "Cà Phê Sữa Đá (Vietnamese Iced Coffee)",
    description: "Stronger than your morning standup, sweeter than merging a PR on the first try.",
    time: "10 minutes",
    servings: "1",
    difficulty: "Easy",
    engineeringLesson: "Vietnamese coffee is proof that simple systems can be powerful. Just 3 components: coffee, condensed milk, ice. No complicated frameworks needed.",
    ingredients: [
      "3-4 tbsp dark roast coffee (preferably Vietnamese coffee)",
      "2-3 tbsp sweetened condensed milk",
      "Hot water",
      "Ice",
      "Vietnamese coffee filter (phin) or strong brewed coffee",
    ],
    steps: [
      "Add condensed milk to glass. This is your foundation - like a good tech stack.",
      "Brew coffee using phin filter or make strong coffee. Patience here = better output (like compiling optimized code).",
      "Let coffee drip slowly into glass. The slow drip is meditation. Use this time to think about your next algorithm.",
      "Stir well to mix coffee and milk. Integration testing!",
      "Add ice. Deploy to production (your mouth).",
      "Optional: Contemplate life, the universe, and why your CSS still doesn't center properly.",
    ],
    image: "☕",
  },
];

export const CookWithMeSection = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <section id="cook-with-me" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6 text-accent" />
                <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                  From Vietnam with Love
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cook with Me
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cooking is like engineering: precise measurements, careful timing, and iterative
                improvement. Here are some Vietnamese recipes that remind me of home.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-8" staggerDelay={0.1}>
            {recipes.map((recipe, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="cursor-pointer"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 group">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      {recipe.image}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className={`h-3 w-3 ${
                          recipe.difficulty === "Easy" ? "text-green-500" :
                          recipe.difficulty === "Medium" ? "text-yellow-500" :
                          "text-red-500"
                        }`} />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Recipe Detail Modal */}
          <AnimatePresence>
            {selectedRecipe && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRecipe(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-background border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground mb-2">
                          {selectedRecipe.nameVietnamese}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{selectedRecipe.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{selectedRecipe.servings}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            <span>{selectedRecipe.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRecipe(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Engineering Lesson */}
                    <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-sm font-semibold text-accent mb-2">
                        🔧 Engineering Lesson
                      </p>
                      <p className="text-sm text-foreground italic">
                        {selectedRecipe.engineeringLesson}
                      </p>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6">
                      <h4 className="text-xl font-bold mb-3 text-foreground">Ingredients</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.ingredients.map((ingredient, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div>
                      <h4 className="text-xl font-bold mb-3 text-foreground">Steps</h4>
                      <ol className="space-y-4">
                        {selectedRecipe.steps.map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </span>
                            <p className="text-sm text-muted-foreground pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
