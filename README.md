# Our Love Wrapped

A cinematic, mobile-first love story website that tells a relationship narrative through 8 chapters with continuous music, animated text, photo displays, and a climactic video moment.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

This will create a static export in the `out/` directory.

### Testing

```bash
npm test
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components organized by feature
- `lib/` - Utility functions, state management, and core logic
- `config/` - Content configuration file
- `public/` - Static assets (photos, audio, video)
- `types/` - TypeScript type definitions

## Tech Stack

- **Framework**: Next.js 14 with App Router, TypeScript, Static Export
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Audio**: Howler.js
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library, fast-check (property-based testing)
- **Fonts**: Google Fonts (Cormorant Garamond, Playfair Display, Inter)

## Design System

- **Primary Color**: Burgundy (#800020)
- **Secondary Color**: Rose Gold (#B76E79)
- **Text Color**: Cream (#F5ECD7)
- **Background**: Dark (#0D0608)

## Deployment

Deploy to Vercel with static export optimization.
