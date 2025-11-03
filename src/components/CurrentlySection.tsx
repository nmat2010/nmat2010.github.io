import { useState, useEffect } from "react";
import { Book, Music, Code, Coffee, MapPin, Brain, ExternalLink, Clock } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./animations/ScrollReveal";
import { motion } from "framer-motion";

interface CurrentlyCard {
  icon: any;
  title: string;
  content: string;
  detail: string;
  link?: string;
  color: string;
  bgGradient: string;
}

export const CurrentlySection = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Calculate "days ago" for last update
    const updateDate = new Date("2025-11-01"); // You can update this dynamically
    const today = new Date();
    const daysAgo = Math.floor((today.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    setLastUpdated(daysAgo === 0 ? "today" : `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`);
  }, []);

  const currentlyCards: CurrentlyCard[] = [
    {
      icon: Book,
      title: "Currently Reading",
      content: "Life 3.0",
      detail: "by Max Tegmark - Exploring AI's future impact on humanity",
      link: "https://www.goodreads.com",
      color: "text-accent",
      bgGradient: "from-accent/10 to-accent/5",
    },
    {
      icon: Music,
      title: "Recently Played",
      content: "Golden Hour",
      detail: "by JVKE - On repeat while coding",
      link: "https://open.spotify.com",
      color: "text-green-500",
      bgGradient: "from-green-500/10 to-green-500/5",
    },
    {
      icon: Code,
      title: "Latest Commit",
      content: "Implement oral history search",
      detail: "9/11 Memorial project - 6 hours ago",
      link: "https://github.com",
      color: "text-purple-500",
      bgGradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      icon: Coffee,
      title: "Recently Cooked",
      content: "Phở Gà",
      detail: "Vietnamese chicken noodle soup - taste of home",
      color: "text-orange-500",
      bgGradient: "from-orange-500/10 to-orange-500/5",
    },
    {
      icon: Brain,
      title: "Learning Right Now",
      content: "Transformer Architectures",
      detail: "Deep dive into attention mechanisms for NLP",
      link: "https://arxiv.org",
      color: "text-blue-500",
      bgGradient: "from-blue-500/10 to-blue-500/5",
    },
    {
      icon: MapPin,
      title: "Want to Visit",
      content: "Iceland & Norway",
      detail: "Northern lights and Nordic innovation hubs",
      color: "text-teal-500",
      bgGradient: "from-teal-500/10 to-teal-500/5",
    },
  ];

  return (
    <section id="currently" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </motion.div>
                <span className="text-sm font-medium text-accent">Live Updates</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Currently
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A snapshot of my life right now - what I'm reading, building, listening to, and dreaming about
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {currentlyCards.map((card, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <div className={`relative h-full p-6 rounded-2xl border border-border bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm hover:shadow-xl transition-all duration-300 group`}>
                    {/* Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${card.color} p-3 rounded-xl bg-background/50 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="h-6 w-6" />
                      </div>
                      {card.link && (
                        <a
                          href={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                        {card.title}
                      </p>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {card.content}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.detail}
                      </p>
                    </div>

                    {/* Decorative gradient accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${card.color.replace('text-', 'from-')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </ScrollReveal>

          {/* Days since moving to USA counter */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border text-center">
              <DaysSinceCounter />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const DaysSinceCounter = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    // Calculate days since arriving in USA (adjust this date to your actual arrival date)
    const arrivalDate = new Date("2023-08-20"); // Example date
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
    setDays(daysSince);
  }, []);

  return (
    <div>
      <p className="text-sm uppercase tracking-wider font-semibold text-muted-foreground mb-2">
        Days Since Moving to USA
      </p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <p className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          {days.toLocaleString()}
        </p>
      </motion.div>
      <p className="text-sm text-muted-foreground mt-2">
        Every day is a new adventure in innovation
      </p>
    </div>
  );
};
