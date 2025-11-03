import { Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./animations/ScrollReveal";

interface Failure {
  icon: any;
  title: string;
  story: string;
  lesson: string;
  iconColor: string;
}

const failures: Failure[] = [
  {
    icon: Lightbulb,
    title: "The Over-Engineered Chatbot",
    story: "During my first hackathon, I spent 18 hours building an AI chatbot with every feature I could think of. It had ML models, sentiment analysis, and a custom NLP pipeline. We didn't win. Actually, we barely finished the demo.",
    lesson: "Simple solutions that work beat complex ones that don't. Now I start with the core problem, build the simplest solution first, then iterate. That approach helped me win my next two hackathons.",
    iconColor: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Culture Shock & Imposter Syndrome",
    story: "Moving from Vietnam to the US as an international student hit harder than expected. In my first semester, I compared myself to every CS student who seemed more confident, more fluent, more 'American.' I almost gave up on competitive opportunities.",
    lesson: "My unique perspective as an international student is my strength, not a weakness. The way I approach problems through a cross-cultural lens has become my signature in projects. Different doesn't mean lesser.",
    iconColor: "text-secondary",
  },
  {
    icon: BookOpen,
    title: "The Research Paper I Never Published",
    story: "I spent months working on a computer vision project, thinking I'd get published. The results were mediocre. I was devastated and convinced I wasn't cut out for research.",
    lesson: "Failure in research isn't the opposite of success—it's part of the process. That 'failed' project taught me more about experimental design, data collection, and resilience than any successful project could have. I'm still pursuing my PhD dream, just smarter.",
    iconColor: "text-accent",
  },
];

export const FailuresSection = () => {
  return (
    <section id="failures" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Failures & Lessons
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                The projects that didn't work taught me more than the ones that did.
                Here's what breaking things (and myself) taught me about building better.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="space-y-8" staggerDelay={0.2}>
            {failures.map((failure, index) => (
              <StaggerItem key={index}>
                <div className="group relative">
                  {/* Decorative background gradient */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-background border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`flex-shrink-0 ${failure.iconColor}`}>
                        <div className="p-4 bg-muted/50 rounded-xl">
                          <failure.icon className="h-8 w-8" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-foreground">
                          {failure.title}
                        </h3>

                        {/* The Failure Story */}
                        <div className="mb-4 pl-4 border-l-4 border-destructive/30">
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {failure.story}
                          </p>
                        </div>

                        {/* The Lesson */}
                        <div className="pl-4 border-l-4 border-accent/50">
                          <p className="text-sm uppercase tracking-wider font-semibold text-accent mb-2">
                            What I Learned
                          </p>
                          <p className="text-base text-foreground font-medium leading-relaxed">
                            {failure.lesson}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal direction="up" delay={0.6}>
            <div className="mt-12 p-8 bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20 rounded-2xl text-center">
              <p className="text-lg md:text-xl font-medium text-foreground">
                "I haven't failed. I've just found 10,000 ways that won't work."
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                — Thomas Edison (but also me, debugging at 3 AM)
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
