import { Briefcase, Calendar, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const experiences = [
  {
    title: "Lead Full-Stack Developer & DevOps Engineer",
    company: "World Trade Center Health & Wellness Program",
    location: "Stony Brook, NY",
    period: "April 2025 - Present",
    description:
      "Led a team to ship a searchable oral history archive for the WTC Health Program and Library of Congress.",
    tldr: [
      "Led 4-person team building searchable oral history platform for 9/11 Memorial & Museum + Library of Congress",
      "Architected full-stack system: FastAPI backend, React frontend, hybrid semantic search (PostgreSQL FTS + pgvector), AWS infrastructure (S3, EC2, MediaConvert)",
      "Built end-to-end ML pipeline: 20,000+ GB data migration, WhisperX transcription, LLM-powered chapters for 400+ videos",
      "Implemented CI/CD with GitHub Actions: 80%+ test coverage, automated deployments (90% faster), security scanning",
      "Delivered system achieving sub-second search across 800+ hours of content with 10+ production smoke tests"
    ],
    highlights: [
      {
        category: "Project Management & Team Leadership",
        items: [
          {
            subtitle: "Team & Stakeholder Management",
            points: [
              "Led 4-person team through full product lifecycle: planning, development, testing, deployment, and maintenance",
              "Managed sprint planning, task allocation, and workload distribution using Jira and agile methodologies",
              "Coordinated between multiple stakeholders: WTC Health Program and academic advisors",
              "Delivered regular demos and progress reports to clients, aligning releases with organizational milestones"
            ]
          },
          {
            subtitle: "Project Planning & Execution",
            points: [
              "Created comprehensive project roadmap with milestones, deadlines, and deliverables",
              "Balanced technical debt reduction with feature development to maintain velocity",
              "Facilitated daily standups, sprint retrospectives, and planning sessions",
              "Maintained clear communication channels ensuring team alignment on priorities and blockers"
            ]
          }
        ]
      },
      {
        category: "Cloud Infrastructure & Data Engineering",
        items: [
          {
            subtitle: "AWS Architecture",
            points: [
              "Designed complete AWS infrastructure: S3 for media storage, EC2 for compute/deployment, IAM for access control, Secrets Manager for credentials, MediaConvert for video processing",
              "Automated 20,000+ GB video migration from Dropbox to S3 with 100% accuracy validation",
              "Implemented S3 presigned URLs with short TTL for secure media access"
            ]
          },
          {
            subtitle: "Data Processing Pipeline",
            points: [
              "Built end-to-end automation on EC2: PDF transcript extraction → WhisperX transcription → custom alignment algorithms → word-level timestamps for 100+ videos",
              "Integrated LLM-based chapter generation system to automatically segment videos into contextual sections",
              "Created embedding generation pipeline for semantic search indexing"
            ]
          }
        ]
      },
      {
        category: "AI/ML & Search Architecture",
        items: [
          {
            subtitle: "Hybrid Semantic Search",
            points: [
              "Engineered search engine combining PostgreSQL FTS + pgvector semantic embeddings using Reciprocal Rank Fusion (RRF) algorithm",
              "Implemented chapter-level search granularity with sentence-transformers embeddings, achieving sub-second query times",
              "Built parallel async search tasks (keyword, semantic, description) with intelligent query type detection",
              "Added domain-specific query expansion for medical terminology and 9/11 abbreviations"
            ]
          },
          {
            subtitle: "Machine Learning Integration",
            points: [
              "Integrated WhisperX for high-accuracy speech-to-text with word-level timestamp alignment",
              "Implemented LLM-powered video segmentation creating contextual chapters for granular navigation",
              "Built quality validation systems ensuring transcript-video synchronization accuracy"
            ]
          }
        ]
      },
      {
        category: "Backend Development (FastAPI/Python)",
        items: [
          {
            subtitle: "API & Database",
            points: [
              "Architected RESTful API with 15+ endpoints: unified search, video listing/filtering, transcripts, chapters, occupations, health checks",
              "Designed PostgreSQL schema with SQLAlchemy ORM: Videos, Transcripts, Responders, Chapters, SearchLogs with proper indexing",
              "Implemented search result caching, connection pooling, and query optimization"
            ]
          },
          {
            subtitle: "Performance Optimization",
            points: [
              "Parallelized search operations reducing latency by ~40%",
              "Preloaded embedding model at startup eliminating per-request overhead",
              "Added semaphore-based concurrency control and thread-safe caching"
            ]
          }
        ]
      },
      {
        category: "DevOps & CI/CD",
        items: [
          {
            subtitle: "Automated Deployment Pipeline",
            points: [
              "Built GitHub Actions CI/CD: automated testing (80%+ coverage), security scans (pip-audit/npm audit), Docker builds",
              "Created auto-deployment to staging on merge to dev (90% deployment time reduction: 45min → 5min)",
              "Implemented 10+ comprehensive smoke tests validating APIs, database, and container health",
              "Developed rollback scripts and deployment automation for AWS EC2 infrastructure"
            ]
          },
          {
            subtitle: "Infrastructure",
            points: [
              "Configured Docker Compose for local dev and AWS EC2 production deployment with PostgreSQL+pgvector, FastAPI, React, Node video proxy",
              "Set up nginx reverse proxy on EC2, BuildKit optimization, and multi-stage builds",
            ]
          }
        ]
      },
      {
        category: "Security & Compliance",
        items: [
          {
            subtitle: "Security Hardening",
            points: [
              "Led security audit implementing CSP headers, XSS prevention, rate limiting (slowapi), request size validation, trusted host verification",
              "Built sanitized error responses for production with Sentry integration for monitoring",
              "Configured multi-layer security middleware architecture and CORS policies",
              "Integrated security scanning in CI blocking deployments with vulnerabilities"
            ]
          }
        ]
      },
      {
        category: "Frontend Development (React 19)",
        items: [
          {
            subtitle: "Pages Built",
            points: [
              "Display Page (video player + synchronized transcript + chapters), Topic List, Topic Videos, About Us, Legal Pages (Privacy, Terms, DMCA, Cookies)"
            ]
          },
          {
            subtitle: "Key Features & Components",
            points: [
              "Video.js player with synchronized transcript viewer (auto-scroll, click-to-seek, word-level highlighting)",
              "Chapters panel with thumbnail previews, keyboard shortcuts, and jump navigation",
              "Citation generation, responsive design (Tailwind CSS v4), loading skeletons, error handling",
              "Search result cards with metadata and excerpt highlighting"
            ]
          }
        ]
      },
      {
        category: "Documentation",
        items: [
          {
            subtitle: "Created Comprehensive Docs",
            points: [
              "API reference, backend architecture overview, deployment guides (staging/production)",
              "Team setup guide, Docker guide, CI/CD setup, branching strategy",
              "Search performance analysis, API validation documentation",
              "Architecture diagrams, technical decision rationale, troubleshooting guides"
            ]
          }
        ]
      },
      {
        category: "Technical Stack",
        items: [
          {
            subtitle: "",
            points: [
              "Backend: Python, FastAPI, SQLAlchemy, PostgreSQL, pgvector, sentence-transformers",
              "Frontend: React 19, Vite, Tailwind CSS v4, react-router-dom v7, video.js",
              "ML/AI: WhisperX, LLM APIs, sentence-transformers",
              "Cloud: AWS (S3, EC2, MediaConvert, IAM, Secrets Manager)",
              "DevOps: Docker, GitHub Actions, nginx, Sentry",
              "Security: slowapi, CSP, pip-audit/npm audit"
            ]
          }
        ]
      },
      {
        category: "Key Metrics",
        items: [
          {
            subtitle: "",
            points: [
              "20,000+ GB automated data migration",
              "400+ videos with AI transcription and chapters",
              "Sub-second search response times",
              "90% faster deployments via automation",
              "80%+ test coverage maintained",
              "10+ smoke tests for deployment validation",
              "150+ commits, ~116K net lines of code"
            ]
          }
        ]
      }
    ],
    logo: "/logos/wtc.png",
  },
  {
    title: "Software Engineer Intern",
    company: "FPT Software",
    location: "Ho Chi Minh City, Vietnam",
    period: "June 2025 - August 2025",
    description:
      "Led a team of 5 interns through Jira sprint planning and code reviews, delivering 100% of sprint commitments and improving throughput by 20%.",
    highlights: [
      "Built production REST APIs using Spring Boot with JPA/Hibernate and PostgreSQL, applying layered architecture and validation for reliability",
      "Integrated Kafka for asynchronous messaging, boosting scalability and reducing system bottlenecks",
      "Implemented Keycloak-based role access control to standardize authentication across services",
      "Established JUnit5/Mockito test suite with 90%+ coverage, cutting pre-merge defects",
    ],
    logo: "/logos/fpt.jpg",
  },
];

export const ExperienceSection = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [expandedSubsections, setExpandedSubsections] = useState<{[key: string]: boolean}>({});

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleSubsection = (expIndex: number, sectionIndex: number) => {
    const key = `${expIndex}-${sectionIndex}`;
    setExpandedSubsections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-foreground">Experience</h2>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex gap-6"
              >
                {/* Timeline dot with logo */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full border-4 border-background bg-card shadow-lg overflow-hidden ring-2 ring-accent/20 hover:ring-accent/50 transition-all"
                  >
                    {exp.logo ? (
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-accent" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Content card */}
                <div className="flex-1 pb-8">
                  <motion.div
                    className="border border-border rounded-lg overflow-hidden bg-card hover:border-accent/50 transition-all hover:shadow-lg"
                    whileHover={{ y: -2 }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-accent">
                              {exp.period}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {exp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-3.5 w-3.5" />
                              <span className="font-medium">{exp.company}</span>
                            </div>
                            <span className="text-border">•</span>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedItems.includes(index) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0"
                        >
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {exp.description}
                      </p>
                    </button>

                    <AnimatePresence>
                      {expandedItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-4 border-t border-border/50">
                            {/* TL;DR Section */}
                            {(exp as any).tldr && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-6 p-4 rounded-lg bg-accent/5 border border-accent/20"
                              >
                                <h4 className="text-sm font-bold text-accent mb-3">
                                  Key Highlights
                                </h4>
                                <ul className="space-y-2">
                                  {(exp as any).tldr.map((item: string, i: number) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.05 }}
                                      className="text-sm text-foreground/90 flex items-start gap-2"
                                    >
                                      <span className="text-accent mt-1 shrink-0 font-bold">→</span>
                                      <span className="leading-relaxed">{item}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}

                            <div className="space-y-6">
                              {Array.isArray(exp.highlights) && typeof exp.highlights[0] === 'object' && 'category' in exp.highlights[0] ? (
                                // New structured format with toggleable subsections
                                exp.highlights.map((section: any, sectionIndex: number) => {
                                  const subsectionKey = `${index}-${sectionIndex}`;
                                  const isSubsectionExpanded = expandedSubsections[subsectionKey];

                                  return (
                                    <motion.div
                                      key={sectionIndex}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: sectionIndex * 0.05 }}
                                      className="border border-border/30 rounded-lg overflow-hidden bg-muted/10"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubsection(index, sectionIndex);
                                        }}
                                        className="w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                                      >
                                        <h4 className="text-sm font-bold text-accent flex items-center gap-2">
                                          <span className="w-1 h-4 bg-accent rounded-full" />
                                          {section.category}
                                        </h4>
                                        <motion.div
                                          animate={{ rotate: isSubsectionExpanded ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronDown className="h-4 w-4 text-accent" />
                                        </motion.div>
                                      </button>

                                      <AnimatePresence>
                                        {isSubsectionExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="px-4 pb-3 space-y-3">
                                              {section.items.map((item: any, itemIndex: number) => (
                                                <div key={itemIndex} className="pl-2 space-y-2">
                                                  {item.subtitle && (
                                                    <h5 className="text-sm font-semibold text-foreground">
                                                      {item.subtitle}
                                                    </h5>
                                                  )}
                                                  <ul className="space-y-2">
                                                    {item.points.map((point: string, pointIndex: number) => (
                                                      <li
                                                        key={pointIndex}
                                                        className="text-sm text-muted-foreground flex items-start gap-2 pl-2"
                                                      >
                                                        <span className="text-accent mt-1.5 shrink-0 text-xs">•</span>
                                                        <span className="leading-relaxed">{point}</span>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
                                  );
                                })
                              ) : (
                                // Old simple format (for FPT and other experiences)
                                <>
                                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-accent rounded-full" />
                                    Key Highlights
                                  </h4>
                                  <ul className="space-y-3">
                                    {(exp.highlights as string[]).map((highlight, i) => (
                                      <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="text-sm text-muted-foreground flex items-start gap-3 pl-3"
                                      >
                                        <span className="text-accent mt-1 shrink-0">•</span>
                                        <span>{highlight}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
