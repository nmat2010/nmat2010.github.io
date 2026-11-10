export interface ExperienceDetail {
  subtitle: string;
  points: string[];
}

export interface ExperienceCategory {
  category: string;
  items: ExperienceDetail[];
}

export interface ExperienceStat {
  value: string;
  label: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  /** a short summary list, shown first when a role is opened */
  tldr?: string[];
  /** one line from the highlights, set large as a pull quote in the newspaper */
  pullQuote?: string;
  /** the job title in Vietnamese, printed as a second headline for a role in Vietnam */
  localTitle?: string;
  /** either a flat list of bullets or a list of expandable categories */
  highlights: string[] | ExperienceCategory[];
  logo: string;
  /** printed under the logo, like a photo caption */
  /** a square mark for the small logo slot in View mode; defaults to `logo` */
  logoMark?: string;
  logoCaption?: string;
  /** a boxed run of figures shown under the headline */
  stats?: ExperienceStat[];
}

export const isCategorised = (h: Experience["highlights"]): h is ExperienceCategory[] => typeof h[0] === "object";

export const experiences: Experience[] = [
  {
    title: "Lead Full-Stack Developer & DevOps Engineer",
    company: "Stony Brook World Trade Center Health & Wellness Program",
    location: "Stony Brook, NY",
    period: "April 2025 - Present",
    description:
      "Led the team building a searchable archive for the Remembering 9/11 Oral History Project: 490 first-responder interviews, from a search box on the web to a touch-screen kiosk in a museum.",
    pullQuote: "A transcript rebuild that was rolled back, diagnosed and replanned when it broke syncing.",
    tldr: [
      "Architected the full stack: FastAPI backend, React frontend, hybrid semantic search (PostgreSQL full-text + pgvector) and AWS infrastructure (S3, EC2, CloudWatch)",
      "Built the ML pipeline behind the archive: WhisperX transcription with word-level timing, LLM-generated chapters, and a transcript rebuild that was rolled back, diagnosed and replanned when it broke syncing",
      "Shipped CI/CD with GitHub Actions: automated staging deploys, smoke tests, security scans, and an access-controlled test site on EC2 behind Cloudflare",
      "Led the 2026 redesign: accessible, responsive, touch and museum-kiosk ready, with saved interviews, vignettes, in-video subtitles and a guided help tour",
      "Runs in production with Redis caching, request tracing, rate limiting and CloudWatch alarms"
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
              "Created embedding generation pipeline for semantic search indexing",
              "Rebuilt the transcript set with WhisperX (May 2026) and loaded 490+ transcripts with word-level timing into PostgreSQL",
              "Pre-generated and regenerated high-resolution video thumbnails to cut page load time",
              "Investigated a failed transcript rebuild (the PDF parser merged speaker turns, so words drifted out of sync and interviewer names showed as speech), rolled the table back, and planned a WhisperX + CSV realignment that keeps the authoritative text with accurate timing",
              "Built the vignette (short compilation) API: each short film links to its full interview and speaker metadata, with signed S3 access"
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
              "Added domain-specific query expansion for medical terminology and 9/11 abbreviations",
              "Ran a systematic search-quality pass (March-April 2026): worked through 14+ ranking and performance issues, then wrote an evaluator plan to measure relevance",
              "Built a related-interview suggestion algorithm and daily featured-video selection"
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
              "Deployed the internal testing and demo environment on EC2 behind Cloudflare: custom-domain DNS, Cloudflare Access with an organisation email allowlist so only the team and stakeholders can reach it, and Cloudflare Insights analytics (with a matching CSP)",
              "Set up Alembic database migrations and one-command team setup scripts (Linux, macOS, Windows) with AWS Secrets Manager for .env files",
              "Added production observability: AWS CloudWatch metrics with alarms that notify through SNS, request tracing, and Redis-backed caching and rate limiting; slimmed images with CPU-only PyTorch builds"
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
              "Integrated security scanning in CI blocking deployments with vulnerabilities",
              "Ongoing dependency patching and CSP tuning across backend and frontend (Sept-Oct 2026)"
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
              "Search result cards with metadata and excerpt highlighting",
              "WebVTT in-video subtitles with caption settings, auto-generated video outlines and chapters, and a redesigned video player (including Safari mobile fixes)",
              "Vignette and compilation pages with transcripts, save/resume and citations; My Library with saved and recently watched interviews",
              "Help Center with a rewritten FAQ and an interactive guided tour (driver.js) that spotlights real controls, follows the visitor across pages, and uses screenshots generated from the running site so they never go stale",
              "Museum kiosk build: a separate build with larger type and touch targets, a QR code to continue on a phone, and an idle timer that clears saved lists and returns to the home page after five minutes"
            ]
          },
          {
            subtitle: "Redesign, Accessibility & Kiosk",
            points: [
              "Led the 2026 redesign: shared page header, modal frame and confirm components, with filters and sort state kept in the URL",
              "Accessibility pass: accessible dialogs for citations and transcripts, labelled inputs, enforced standards on vignettes, dedicated accessibility page",
              "Responsive, touch and museum-kiosk layouts; loading skeletons and automatic reload after a deploy replaces page chunks"
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
              "200+ commits and 40+ merged PRs (April 2025 - Nov 2026)"
            ]
          }
        ]
      }
    ],
    logo: "/logos/sbm.png",
    logoMark: "/logos/sbm-mark.png",
    logoCaption: "Stony Brook Medicine, home of the World Trade Center Health Program",
    stats: [
      { value: "490", label: "interviews online" },
      { value: "800+", label: "hours of audio and video" },
      { value: "41", label: "merged pull requests" },
      { value: "217", label: "commits since April 2025" },
    ],
  },
  {
    title: "Software Engineer Intern",
    localTitle: "Thực tập sinh phần mềm",
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
    logoCaption: "FPT Software, Ho Chi Minh City",
    stats: [
      { value: "5", label: "interns led" },
      { value: "100%", label: "sprint commitments met" },
      { value: "+20%", label: "team throughput" },
      { value: "90%+", label: "test coverage" },
    ],
  },
];
