# 🚀 Interactive Personal Portfolio - Thu Nguyen

> **An unforgettable portfolio experience that tells a story from Saigon to Stony Brook**

A next-level interactive portfolio featuring 3D animations, scroll-triggered effects, easter eggs, and unique storytelling sections that showcase not just skills, but personality and authenticity.

[![Portfolio Preview](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)]()
[![React](https://img.shields.io/badge/React-18.3.1-61dafb)]()
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Latest-ff0055)]()

---

## ✨ Key Features

### 🌍 Cinematic Entry Experience
- **3D Globe Journey**: Interactive Three.js globe that zooms from Saigon, Vietnam → Stony Brook, New York
- Animated plane traveling along a curved flight path
- Only shows on first visit (session-based)
- Smooth transition to main portfolio content

### 💥 Bold Storytelling
- **Powerful Hook**: "What if AI could preserve human stories forever?" (not the generic "Hi, I'm...")
- Focus on impact and purpose, not just credentials
- Emphasizes meaningful work (9/11 Memorial & Museum project)

### 🎬 Scroll Animations
- Framer Motion throughout with cinematic effects
- Elements fade, slide, and scale as you scroll
- Stagger animations for lists and cards
- 60fps performance optimized

### ⭐ Unique Sections

#### 1. **Failures & Lessons**
- Shows vulnerability and growth mindset
- Three authentic failure stories with key takeaways
- Makes the portfolio memorable and relatable

#### 2. **Currently**
- Live snapshot: what I'm reading, coding, listening to, cooking
- Real-time "Days Since Moving to USA" counter
- Shows personality beyond just projects

#### 3. **Cook with Me**
- Vietnamese recipes (Phở Gà, Gỏi Cuốn, Cà Phê Sữa Đá) with engineering metaphors
- Interactive modals with detailed instructions
- Connects culture with technical mindset

### 🎮 Easter Eggs & Surprises

1. **Konami Code**: Type `↑↑↓↓←→←→BA` to unlock secret Vietnamese recipes
2. **Console Messages**: Hidden messages for curious developers who inspect the code
3. **Interactive Functions**: Try `hireMe()` and `vietnameseRecipe()` in the console
4. **Lost Robot 404**: Creative 404 page with eyes that follow your cursor
5. **Hidden Hints**: Easter egg references sprinkled throughout

---

## 🛠️ Tech Stack

### Core
- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Fast build tool

### Styling & UI
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **Custom animations** - Tailwind keyframes

### Animations & 3D
- **Framer Motion** - Scroll animations, page transitions
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful Three.js helpers

### Additional Libraries
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **D3** - Ready for data visualizations

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd portfolio

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:8080
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── animations/
│   │   └── ScrollReveal.tsx         # Reusable scroll animations
│   ├── ui/                           # Shadcn UI components
│   ├── GlobeJourney.tsx             # 3D Globe entry experience
│   ├── HeroSection.tsx              # Bold hero with hook
│   ├── AboutSection.tsx             # About with scroll animations
│   ├── FailuresSection.tsx          # ⭐ Failures & Lessons
│   ├── CurrentlySection.tsx         # ⭐ What you're up to now
│   ├── CookWithMeSection.tsx        # ⭐ Vietnamese recipes
│   ├── SecretRecipesModal.tsx       # 🎮 Konami code reward
│   ├── ProjectsSection.tsx          # Projects showcase
│   ├── ResearchSection.tsx          # Research interests
│   └── ContactSection.tsx           # Contact form
├── hooks/
│   └── useKonamiCode.tsx            # Konami code detection
├── utils/
│   └── consoleMessages.ts           # 🔍 Hidden console messages
├── pages/
│   ├── Index.tsx                    # Main page
│   └── NotFound.tsx                 # 🤖 Creative 404
├── types/
│   └── three.d.ts                   # Three.js type definitions
└── assets/
    ├── profile.jpeg                 # Your profile photo
    └── hero-bg.jpg                  # Hero background
```

---

## 🎨 Customization Guide

### 1. Personal Information (Required)

**Update Contact Details** (`src/utils/consoleMessages.ts`, lines 51-53):
```typescript
console.log("%cEmail: your.email@example.com", styles.normal);
console.log("%cLinkedIn: /in/your-linkedin", styles.normal);
console.log("%cGitHub: @yourusername", styles.normal);
```

**Update Currently Section** (`src/components/CurrentlySection.tsx`, lines 29-67):
- Replace placeholder data with your actual:
  - Currently reading book
  - Recently played music
  - Latest GitHub commit
  - Recently cooked dish
  - Learning topics
  - Travel destinations

**Set USA Arrival Date** (`src/components/CurrentlySection.tsx`, line 111):
```typescript
const arrivalDate = new Date("2023-08-20"); // Change to your actual date
```

### 2. Images (Required)

Add these images to `src/assets/`:
- `profile.jpeg` - Your professional photo (recommended: 800x800px)
- `hero-bg.jpg` - Hero background image (recommended: 1920x1080px)

### 3. Failure Stories (Important)

**Personalize** `src/components/FailuresSection.tsx`:
- Replace template stories with YOUR authentic experiences
- Be specific - include actual project names, dates, details
- Make the lessons learned actionable and genuine

### 4. Projects & Research

Update your actual projects in:
- `src/components/ProjectsSection.tsx`
- `src/components/ResearchSection.tsx`

---

## 🎯 Easter Eggs

Your portfolio includes hidden surprises for explorers:

### Konami Code
Type this sequence on the homepage: `↑ ↑ ↓ ↓ ← → ← → B A`
Unlocks a secret modal with bonus Vietnamese recipes!

### Console Commands
Open DevTools console (F12) and try:
```javascript
hireMe()          // Shows hiring message
vietnameseRecipe() // Quick recipe tip
```

### Lost Robot 404
Navigate to any non-existent page (e.g., `/random-page`) to meet the lost robot with interactive eyes!

---

## 📱 Responsive Design

- **Mobile-first approach**
- Fully responsive across all devices
- Touch-friendly interactions
- Optimized animations for mobile performance

---

## 🌓 Dark/Light Mode

- Automatic theme detection based on system preferences
- Smooth transitions between modes
- All components support both themes
- Defined in `src/index.css` with CSS variables

---

## ⚡ Performance

- **Lazy loading** for images and components
- **Code splitting** for optimal bundle size
- **60fps animations** with GPU acceleration
- **Optimized 3D rendering** in Three.js
- **Fast load times** (<3s on average connection)

---

## 🚢 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Alternative: Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify
3. Or connect your GitHub repo for auto-deployment

### GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to gh-pages branch
```

---

## 🐛 Troubleshooting

### Globe not showing?
Clear sessionStorage in browser DevTools → Application → Session Storage

### Animations laggy?
Check browser hardware acceleration is enabled

### TypeScript errors?
```bash
npm install --legacy-peer-deps
```

### Images not loading?
Ensure images exist in `src/assets/` directory

---

## 📝 TODO for You

### Immediate (30 mins)
- [ ] Update contact information in `consoleMessages.ts`
- [ ] Add profile images (`profile.jpeg`, `hero-bg.jpg`)
- [ ] Set USA arrival date in `CurrentlySection.tsx`

### Important (1-2 hours)
- [ ] Customize failure stories with YOUR experiences
- [ ] Update "Currently" section with your actual data
- [ ] Add your real projects and research interests

### Optional Enhancements
- [ ] Interactive knowledge graph for research interests
- [ ] Live AI demo component
- [ ] GitHub heatmap visualization
- [ ] PWA capabilities
- [ ] SEO optimization

See `PORTFOLIO_GUIDE.md` for detailed implementation steps.

---

## 🎓 What Makes This Portfolio Special

Unlike typical portfolios, this one:
- ✅ Opens with a memorable 3D experience
- ✅ Leads with impact, not credentials
- ✅ Shows vulnerability (failures section)
- ✅ Demonstrates personality (cooking, music, culture)
- ✅ Rewards curiosity (easter eggs)
- ✅ Tells a compelling story
- ✅ Proves technical skills through the site itself

**This portfolio makes you unforgettable.**

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built with React, TypeScript, and modern web technologies
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- 3D graphics powered by [Three.js](https://threejs.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

## 📧 Contact

Questions or want to collaborate? Reach out!

- **Email**: your.email@example.com
- **LinkedIn**: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

<div align="center">

**Built with 💙 and lots of ☕ in Stony Brook, NY**

*From Saigon 🇻🇳 to the USA 🇺🇸 - A journey of innovation and impact*

</div>
