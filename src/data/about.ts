/** Who Thu is: used by the About section, the laptop desktop in Nhà and the bookshop. */
export const focusAreas = [
  {
    title: "Infrastructure & AI systems",
    description: "Scalable systems at the intersection of cloud infrastructure and AI/ML.",
  },
  {
    title: "Hardware design",
    description: "System design and architecture from coursework and hands-on projects.",
  },
  {
    title: "AI research",
    description: "Robotics, VLA, interpretability, lifelong learning, and AI ethics.",
  },
  {
    title: "Policy & governance",
    description: "How AI intersects with law, policy, and political philosophy.",
  },
];

export const researchInterests = [
  "Robotics & Vision-Language-Action models",
  "AI interpretability",
  "Lifelong learning systems",
  "AI ethics & responsible AI",
  "Political philosophy & governance",
  "AI law & policy",
];

/** The books on the Play-mode shelf: one per interest, with Thu's own reasons */
export const bookshelf = [
  {
    title: "Embodied AI",
    subtitle: "Robotics & Vision-Language-Action models",
    area: "AI research",
    cover: { bg: "#d8342b", fg: "#fff3d6", art: "robot" },
    why: "I believe the potential of AI doesn't live only inside a computer. It's in the ability to act in the physical world and take on the tasks that make people's lives better. Doraemon and Big Hero 6 are why I fell for robotics: the best robot is a friend who helps.",
    tags: ["Robotics", "Vision-Language-Action", "Doraemon", "Big Hero 6"],
  },
  {
    title: "Looking Inside",
    subtitle: "AI interpretability & responsible AI",
    area: "AI research",
    cover: { bg: "#1b4b9b", fg: "#ffffff", art: "lens" },
    why: "AI is being woven into almost every domain and trusted with decisions that shape people's lives. That makes it crucial to understand how it \"thinks\", and to make it smarter and safer for everyone. It's also just fascinating: running experiments to look into its brain.",
    tags: ["Interpretability", "AI ethics", "Responsible AI"],
  },
  {
    title: "Never Done Learning",
    subtitle: "Lifelong & continual learning",
    area: "AI research",
    cover: { bg: "#2c8c7e", fg: "#fff3d6", art: "loop" },
    why: "I think continual learning is one of the answers to many of AI's biggest problems today, from catastrophic forgetting to the waste of retraining from scratch.",
    tags: ["Lifelong learning", "Catastrophic forgetting", "Efficiency"],
  },
  {
    title: "The New Social Contract",
    subtitle: "Law & policy in the new tech era",
    area: "Policy & governance",
    cover: { bg: "#f4b73f", fg: "#14111a", art: "scales" },
    why: "Technology is moving faster than our laws, politics and economic structures can keep up, and the gap shows up as real social problems: skill atrophy and the slow loss of critical thinking, unemployment, environmental cost. Technology should make society better, and I want to help shape the law and politics that decide what the next generation inherits.",
    tags: ["AI law & policy", "Political philosophy", "Governance"],
  },
  {
    title: "The Blog",
    subtitle: "Notes and thoughts, in my own words",
    area: "Coming soon",
    cover: { bg: "#efe4cc", fg: "#14111a", art: "quill" },
    why: "A place to write down what I'm learning and thinking about. Coming soon.",
    tags: ["Coming soon"],
  },
];

export const aboutStatement =
  "I'm a junior studying Computer Engineering at Stony Brook University, working between infrastructure engineering and AI research.";
export const aboutParagraphs = [
  "My background includes hardware system design coursework and several hackathon wins. I'm drawn to robotics, interpretability, ethics, and the governance questions AI raises, which is pulling me toward research and policy work.",
];
export const awayParagraph =
  "Away from the screen I cook, lift and swim, and play guitar, acoustic and electric. I love music in general, and dogs and cats even more.";
