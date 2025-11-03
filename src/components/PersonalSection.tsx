import { Book, ChefHat, Plane, Code } from "lucide-react";
import { Card } from "@/components/ui/card";

const currentActivities = [
  {
    icon: Book,
    title: "Currently Reading",
    items: [
      "Life 3.0 by Max Tegmark",
      "Deep Learning by Goodfellow et al.",
      "The Master Algorithm by Pedro Domingos",
    ],
    color: "text-accent",
  },
  {
    icon: Code,
    title: "Learning Now",
    items: [
      "Advanced Reinforcement Learning",
      "ROS (Robot Operating System)",
      "Computer Vision with PyTorch",
    ],
    color: "text-secondary",
  },
  {
    icon: ChefHat,
    title: "In the Kitchen",
    items: [
      "Perfecting Vietnamese Phở",
      "Exploring fusion recipes",
      "Weekend baking experiments",
    ],
    color: "text-accent",
  },
  {
    icon: Plane,
    title: "Travel Adventures",
    items: [
      "NYC exploration continues",
      "Planning: West Coast trip",
      "Dream: Return to Vietnam",
    ],
    color: "text-secondary",
  },
];

export const PersonalSection = () => {
  return (
    <section id="personal" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            Beyond the Code
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Life is about more than just technology — here's what I'm up to now
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {currentActivities.map((activity, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-2 hover:border-accent/30 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg shrink-0">
                  <activity.icon className={`h-6 w-6 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                  <ul className="space-y-2">
                    {activity.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="text-accent mt-1.5">•</span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 animate-fade-in-up">
          <p className="text-lg text-muted-foreground italic">
            "I believe the best innovations come from understanding both the
            technical and human aspects of a problem. Whether I'm cooking a new
            recipe or debugging code, I'm always learning and exploring."
          </p>
        </div>
      </div>
    </section>
  );
};
