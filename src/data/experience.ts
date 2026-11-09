export interface ExperienceDetail {
  subtitle: string;
  points: string[];
}

export interface ExperienceCategory {
  category: string;
  items: ExperienceDetail[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  /** a short summary list, shown first when a role is opened */
  tldr?: string[];
  /** either a flat list of bullets or a list of expandable categories */
  highlights: string[] | ExperienceCategory[];
  logo: string;
}

export const isCategorised = (h: Experience["highlights"]): h is ExperienceCategory[] => typeof h[0] === "object";

export const experiences: Experience[] = [
  {
    title: "Lead Full-Stack Developer & DevOps Engineer",
    company: "Stony Brook World Trade Center Health & Wellness Program",
    location: "Stony Brook, NY",
    period: "April 2025 - Present",
    description:
      "Led a team to ship a searchable oral history archive of 9/11 first responders' interviews.",
    tldr: [
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
    logo: "/logos/suny-rf.png",
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
