# A Sky For Her 🌌
### A Personalized Interactive Birthday Planetarium

A private, cinematic night sky created as a thoughtful, astronomy-inspired birthday gift. Built entirely with vanilla HTML, CSS, canvas, and the Web Audio API with zero external dependencies or network requests.

---

## 🌟 Quick Overview of Experience Flow

1. **Scene 0: The Gate (Astronomy Quiz)**
   - Dark sky with a single glowing star.
   - Fun astronomy question (*"Which planet spins on its side?"* -> *Uranus*).
   - Case-insensitive, handles common typos and provides playful hints on wrong attempts.
   - After 3 tries, reveals a friendly *"Let me in anyway ✨"* button.

2. **Scene 1: Arrival**
   - Cinematic starlight welcome: *"Happy Birthday, [HER_NAME]. I made you a sky."*
   - Audio toggle visible in the top navigation bar.

3. **Scene 2: Your [AGE] Stars**
   - Displays stars distributed across the sky in a celestial crescent constellation.
   - Tapping each star reveals a personal message card (compliment, witty observation, astronomy fact, or quiet wish).
   - Tapped stars stay brightly lit with a golden halo.
   - When all stars are explored, glowing constellation lines connect them into a crescent moon with a celestial chime.

4. **Scene 3: Light That Left Before Tonight**
   - Computed cosmic time travel based on her exact age:
     - **Sirius** (8.6 light-years away): how old she was when tonight's light left.
     - **Vega** (25.0 light-years away): light that crossed space before she was born.
     - **Proxima Centauri** (4.24 light-years away).

5. **Scene 4: Your Zodiac Constellation**
   - Hand-coded vector star map and connection lines for all 12 signs (auto-calculated from her birthday).
   - Kind, grounded blurb with the note: *"(Tradition says this is your sky.)"*

6. **Scene 5: The Telescope (Hidden Messages)**
   - Interactive circular lens follows the cursor or finger with astronomical reticle crosshairs.
   - Sweeping over dark areas reveals hidden deep-sky observation notes and quotes.

7. **Scene 6: Final Message**
   - Sincere, low-pressure closing message: *"No reply needed. I just wanted your day to have a sky."*
   - Optional *"Say hi back"* button (mailto or WhatsApp link; automatically hidden if empty).
   - Final slow shooting star drifting across the cosmos and a *"Replay from start"* button.

---

## 🎨 Secret Easter Eggs

- **Aurora Borealis Mode**:
  - Enter the Konami Code on your keyboard (`↑ ↑ ↓ ↓ ← → ← → B A`), **OR**
  - Long-press (hold for 1.2s) the 🌙 moon icon in the top header.
  - Toggles undulating curtains of green, cyan, and violet aurora light across the sky!
- **Quiet Meteor Shower**:
  - Type the word `stargazer` anywhere on your keyboard to trigger a cascade of shooting stars.

---

## 🛠️ How to Customize (`js/content.js`)

All personalized text, names, dates, quiz questions, and messages live in one single file: [`js/content.js`](file:///C:/Users/ARIC/a-sky-for-her/js/content.js).

You can edit this file in any text editor without touching any logic:

```javascript
const SKY_CONFIG = {
  herName: "Soumiya",            // Her name
  myName: "Sujal",              // Your name
  age: 18,                      // Her age (generates exact number of interactive stars)
  birthdayDate: "2025-12-22",   // YYYY-MM-DD for astronomical calculations
  birthdayDisplay: "December 22",

  // Optional reply link (leave as "" to hide):
  replyLink: "https://wa.me/?text=Hey%20Sujal%2C%20thank%20you%20for%20the%20sky!"
};
```

---

## 🚀 How to Test Locally

1. **Direct Browsing:**
   Double-click `index.html` or open with a local web server (e.g. `npx serve .` or VS Code Live Server). The sky experience opens directly with Scene 0 (The Gate).

2. **Jump to Any Scene:**
   Open in your browser with the `?scene=` query param (0 to 6):
   - `index.html?scene=0` -> The Gate
   - `index.html?scene=1` -> Arrival
   - `index.html?scene=2` -> Her Stars
   - `index.html?scene=3` -> Ancient Light
   - `index.html?scene=4` -> Zodiac Constellation
   - `index.html?scene=5` -> The Telescope
   - `index.html?scene=6` -> Final Message

---

## 🌐 How to Share

### Option 1: Netlify Drop (Easiest & Free)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the entire `a-sky-for-her` folder into the upload box.
3. You will immediately get a live HTTPS URL (e.g., `https://a-sky-for-tara.netlify.app`) to share with her!

### Option 2: GitHub Pages
1. Push this folder to a GitHub repository.
2. In the repository settings, navigate to **Pages** -> Source: **Deploy from a branch (`main` / root)**.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🔒 Privacy & Performance
- **Zero External Network Calls:** Completely self-contained, offline-ready.
- **Synthesized Audio:** Uses Web Audio API sine/triangle oscillators; no external mp3 files.
- **Battery & CPU Friendly:** Pauses starfield animations when the tab is hidden or minimized.
- **Accessible:** Respects `prefers-reduced-motion`, includes keyboard navigation (Arrow keys, Esc, Enter), and minimum 44px tap targets.
