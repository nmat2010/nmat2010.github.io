# Thu Nguyen: portfolio

A personal site with two ways in:

- **Play**: *My little Saigon alley*, a small 3D, vintage-Saigon alley you walk through. Each place holds a part of the portfolio: a home (About, with a laptop and a kitchen), a café (Experience, read in a newspaper over coffee), an electronics store (Projects, with the demo videos), a bookshop (Interests) and a post office (Contact).
- **View**: the same content as one fast, simple page.

The landing page asks which one you want. `?mode=play` and `?mode=view` deep-link straight in.

## Stack

React 18 + TypeScript, Vite, Tailwind CSS, Framer Motion, three.js through `@react-three/fiber` and `@react-three/drei`. A few shadcn/ui primitives (button, toast, tooltip).

## Develop

```bash
npm install
npm run dev        # dev server (the 3D scene is noticeably slower here than in a build)
npm run build      # production build into dist/
npm run preview    # serve the build to judge real performance
npm run lint
npm run deploy     # builds and publishes dist/ to GitHub Pages
```

## Where things are

| Path | What |
| --- | --- |
| `src/data/` | All the content: about, experience, projects (with demo video ids), contact, food photos. Edit here. |
| `src/components/` | Landing page (`ModeGate`), View mode sections, navigation. |
| `src/play/` | Play mode: `PlayMode` (HUD, overlays, input), `World` (scene, player, collisions), `Street` (alley buildings and stalls), `home` (first-person house), `scenes` (café, workshop, bookshop, post office), `parts` (characters), `textures`, `audio` (synthesized sounds), `gfx` (model and texture loading). |
| `resume/resume.tex` | The resume. The deploy workflow compiles it to `public/resume.pdf` on every push to `main`, so edit the `.tex` and push: no PDF is ever committed. For a local preview, `npm run resume` builds it too (needs a LaTeX install; the in-site viewer and every resume link read `/resume.pdf`). |
| `public/assets/` | 3D models, PBR textures and the sky HDRI from [Poly Haven](https://polyhaven.com) (CC0). |
| `public/dishes/` | Web-sized food photos. Originals live in the git-ignored `food-originals/`. |

## Credits and notes

- 3D models, textures and HDRI: Poly Haven, CC0.
- The Stony Brook Seawolves logo (`public/seawolves-logo.svg`) is a Stony Brook University trademark, used here as a fan.
- Everything that makes sound is synthesized in the browser with the Web Audio API.
