# Specification

## Summary
**Goal:** Build "Memory Keepers" — a cinematic friendship and travel memory experience platform with a Motoko backend and richly animated React frontend, accessible only to 6 pre-seeded members.

**Planned changes:**

### Authentication
- Hardcode 6 user accounts (id, name, email, hashed password, role: admin/member) in Motoko stable storage
- Custom credential validation in Motoko; session persisted in localStorage/React context
- On successful login, display animated typewriter text: "Welcome back, Memory Keeper." with cinematic fade

### Cinematic Intro / Landing
- Full black screen fades in on app load
- Typewriter animation renders: "Some moments were never meant to be forgotten…" in gold (#FFD700)
- After intro completes, transition to main Memory Wheel view
- Custom gold-glowing cursor (rgba(255,215,0,0.6)) applied site-wide

### Memory Wheel (Main Feature)
- Circular wheel UI with memory photos arranged along its border
- Scroll rotates the wheel via CSS transforms + React state
- Centered photo is highlighted (scale/glow); background gradient transitions based on memory's `scene_type`
- Clicking the centered photo triggers the Memory Unlock Animation sequence

### Memory Unlock Animation
- Screen fades to black → heartbeat pulse effect → photo zooms in with Three.js 3D depth/parallax on canvas
- Voice narration audio auto-plays from `voice_note_url`
- Subtitle text slides up with cinematic timing
- Handwritten-style overlay text animates in with draw-in cursive animation

### Dynamic Background Scenes
- `beach` scene_type: warm ocean blur gradient
- `college` scene_type: muted campus-toned background
- `night` scene_type: deep dark cinematic black/indigo
- Backgrounds transition smoothly with Framer Motion

### Mode Toggle: Wheel ↔ Timeline
- Toggle button switches between Wheel Mode and Timeline Mode
- Timeline Mode: vertical scrollable list grouped/sorted by year, each card animates in on scroll via Framer Motion intersection observer

### Travel Map Mode
- Stylized SVG India map with gold marker pins at Vizag, Goa, and Bangalore
- Clicking a pin filters memories by location and shows them in an animated side panel/modal
- Map accessible via main navigation

### Secret Memory Unlock
- Frontend tracks viewed memory IDs and wheel rotation count (5 full rotations)
- When all regular memories viewed OR wheel rotated 5 times, secret memory is revealed
- Reveal triggers golden particle burst + special typewriter message animation
- Backend exposes `unlockSecret` function gated by unlock conditions

### Admin Panel
- Protected route accessible only to admin-role users
- Form fields: photo_url, voice_note_url, story_text, subtitle, year, location, scene_type, special_memory toggle, is_secret toggle
- List existing memories with edit/delete options
- Calls Motoko backend CRUD functions

### Cinematic Ending Page
- Triggers when all memories are viewed
- Full black screen, ambient piano audio auto-plays from stored URL
- Three lines appear sequentially via typewriter animation: "From strangers… to stories." / "From days… to memories." / "Our journey continues…"
- Group photo fades in slowly after text sequence

### Motoko Backend (Memory Data Model)
- Memory record: memory_id, photo_url, voice_note_url, story_text, subtitle, location, year, special_memory (Bool), scene_type, is_secret (Bool)
- Exposed functions: `getMemories`, `getMemoryById`, `createMemory` (admin), `updateMemory` (admin), `deleteMemory` (admin), `markMemoryViewed`, `unlockSecret`
- All state in Motoko stable variables

### Global UI Polish
- Matte black (#0A0A0A) global background; all accents/borders/glows in #FFD700
- Golden floating particle effects on special memory cards
- Ripple animation on all click interactions
- Framer Motion full-page fade transitions between all routes
- Parallax scroll effect on memory cards
- Fully responsive layout (mobile + desktop)

**User-visible outcome:** Members log in to a cinematic, gold-accented experience where they can rotate a memory wheel, explore memories with immersive 3D unlock animations, view a travel map of India, browse a timeline, and ultimately reach a cinematic ending sequence — with an admin able to manage all memory content.
