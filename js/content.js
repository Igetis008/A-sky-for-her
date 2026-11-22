/**
 * ============================================================================
 * A SKY FOR HER — PERSONALIZATION CONFIGURATION
 * ============================================================================
 * Edit this file to customize all text, messages, dates, and settings.
 * No logic changes needed — the entire website adapts dynamically to these values.
 */

const SKY_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. CORE RECIPIENT & SENDER DETAILS
  // --------------------------------------------------------------------------
  herName: "Soumiya",          // Replace with her name
  myName: "Sujal",        // Replace with your name
  age: 18,                  // Replace with her age (e.g., 24). Generates 24 interactive stars.
  birthdayDate: "2025-12-22", // YYYY-MM-DD format for astronomical / zodiac calculations
  birthdayDisplay: "December 22", // Human-friendly display string

  // --------------------------------------------------------------------------
  // 2. SCENE -1: COUNTDOWN LOCK SETTINGS
  // --------------------------------------------------------------------------
  // ISO 8601 string WITH explicit UTC offset (e.g. +05:30). Never omit offset.
  unlockAt: "2025-12-22T00:00:00+05:30",

  // Secret preview key to bypass the countdown lock anytime for testing:
  // Open your browser at: index.html?preview=Sujal-preview
  previewKey: "secret123",

  // Playful teaser lines shown when she taps the sealed star before unlocking:
  lockedTeasers: [
    "Not yet. Good things are slow, like starlight.",
    "The photons are still crossing the void. Give them a moment.",
    "A sealed sky keeps its secrets until the appointed hour.",
    "Patience: even the Crab Nebula took light a few centuries to reach us.",
    "Still in orbit. Return when the clock strikes your birthday.",
    "The universe is aligning its mirrors for you.",
    "A quiet little corner of space is being prepared. Almost ready."
  ],

  // --------------------------------------------------------------------------
  // 3. SCENE 0: THE GATE (ASTRONOMY QUIZ)
  // --------------------------------------------------------------------------
  quiz: {
    question: "Which planet in our solar system rotates on its side with an axial tilt of nearly 98 degrees?",
    answerDisplay: "Uranus",
    // All accepted variations (lowercase, trimmed automatically):
    acceptedAnswers: ["uranus", "ouranos", "uranous", "urane", "planet uranus"],
    hints: [
      "Hint: It's an ice giant with faint, delicate rings and a pale cyan glow.",
      "Hint: Discovered in 1781 by William Herschel; it rolls along its orbit like a cosmic bowling ball.",
      "Hint: It's the seventh planet from the Sun, between Saturn and Neptune!"
    ],
    skipButtonText: "Let me in anyway ✨"
  },

  // --------------------------------------------------------------------------
  // 4. SCENE 1: ARRIVAL
  // --------------------------------------------------------------------------
  arrival: {
    headline: "Happy Birthday, {HER_NAME}.",
    subtext: "I made you a sky. Touch the stars to chart your years.",
    cta: "Step Into The Sky"
  },

  // --------------------------------------------------------------------------
  // 5. SCENE 2: YOUR [AGE] STARS (One per year of her life)
  // --------------------------------------------------------------------------
  // Each star has:
  // - year: number
  // - title: card heading
  // - type: 'compliment' | 'humor' | 'fact' | 'wish'
  // - text: personal, witty, kind message
  // - coords: {x, y} normalized coordinates (0.05 to 0.95) forming a crescent constellation
  stars: [
    {
      year: 1,
      title: "First Light",
      type: "compliment",
      text: "The universe had been expanding for 13.8 billion years before you arrived. Frankly, it was missing your perspective."
    },
    {
      year: 2,
      title: "Gravitational Pull",
      type: "humor",
      text: "Toddler physics: testing gravity by dropping things repeatedly. You were doing empirical science before you could talk."
    },
    {
      year: 3,
      title: "Cosmic Curiosity",
      type: "compliment",
      text: "The age when people start asking 'Why?' Most stop asking at some point; you never did, and that's one of your best qualities."
    },
    {
      year: 4,
      title: "Starlight in the Grass",
      type: "fact",
      text: "Light from the Sun takes roughly 8 minutes and 20 seconds to reach Earth. So you've never seen the Sun as it is, only as it was."
    },
    {
      year: 5,
      title: "Pocket Constellations",
      type: "wish",
      text: "May you always keep that five-year-old ability to find wonder in an ordinary rock or a particularly interesting shadow."
    },
    {
      year: 6,
      title: "The Observer's Eye",
      type: "compliment",
      text: "You notice details that skate right past everyone else — a weirdly shaped leaf, an odd accent, a quiet shift in someone's mood."
    },
    {
      year: 7,
      title: "Orbital Speed",
      type: "fact",
      text: "Earth travels at about 67,000 mph through space. By year seven, you had travelled roughly 4.1 billion miles without getting dizzy."
    },
    {
      year: 8,
      title: "The Bookworm Nebula",
      type: "humor",
      text: "Getting completely lost inside a book while someone calls your name five times. A very respectable form of time travel."
    },
    {
      year: 9,
      title: "Night Sky Discovery",
      type: "compliment",
      text: "The first time you looked at a dark sky and felt small in a peaceful way, rather than a scary way. That takes a poetic mind."
    },
    {
      year: 10,
      title: "A Decade of Photons",
      type: "fact",
      text: "Every atom of calcium in your bones and iron in your blood was forged inside an exploding supergiant star. Literally star-stuff."
    },
    {
      year: 11,
      title: "The Quiet Wits",
      type: "compliment",
      text: "Your sense of humor is surgical. You don't make noise to get attention; you just drop one deadpan line that dissolves the whole room."
    },
    {
      year: 12,
      title: "Perseids & Patios",
      type: "wish",
      text: "A wish for warm summer nights, blankets on the grass, and enough patience to catch the fast green streaks of meteors."
    },
    {
      year: 13,
      title: "The Ringed Jewel",
      type: "fact",
      text: "Saturn's rings are tens of thousands of kilometers wide, but only about 10 meters thick in most spots. Elegance on a cosmic scale."
    },
    {
      year: 14,
      title: "Signal to Noise",
      type: "compliment",
      text: "In a world obsessed with broadcasting noise, you listen with real focus. People feel heard around you; that's rare."
    },
    {
      year: 15,
      title: "Bedtime Relativity",
      type: "humor",
      text: "A light-year is 5.88 trillion miles. Roughly the distance between your bedtime and when you actually close your eyes."
    },
    {
      year: 16,
      title: "Voyager's Record",
      type: "fact",
      text: "Voyager 1 carries a golden phonograph with greeting sounds in 55 languages and the song of humpback whales. Cosmic optimism."
    },
    {
      year: 17,
      title: "The Way You Laugh",
      type: "compliment",
      text: "You have that genuine, unguarded laugh that makes other people want to be funnier than they actually are."
    },
    {
      year: 18,
      title: "Escape Velocity",
      type: "compliment",
      text: "Stepping into adulthood with your own compass. You choose what matters to you with quiet conviction, not peer pressure."
    },
    {
      year: 19,
      title: "Andromeda's Drift",
      type: "fact",
      text: "The Andromeda galaxy is racing toward us at 110 kilometers per second. We will merge in 4.5 billion years. No rush."
    },
    {
      year: 20,
      title: "Midnight Philosophy",
      type: "humor",
      text: "Talking about whether the universe is infinite at 1:30 AM while eating toast. High culture at its peak."
    },
    {
      year: 21,
      title: "The Steady Pulse",
      type: "compliment",
      text: "When things get chaotic, you have this calm, level-headed rhythm. You're the person people quietly count on."
    },
    {
      year: 22,
      title: "Pale Blue Dot",
      type: "fact",
      text: "From Saturn's orbit, Earth is just a tiny speck of dust suspended in a sunbeam. Everything you love lives on that speck."
    },
    {
      year: 23,
      title: "Solar Radiance",
      type: "wish",
      text: "May your twenty-third year bring projects that make your eyes light up and people who appreciate your specific brand of brilliant."
    },
    {
      year: 24,
      title: "This Very Evening",
      type: "wish",
      text: "Twenty-four full revolutions around our star. Here's to clear horizons, warm tea, and a sky that's entirely yours tonight."
    }
  ],

  // --------------------------------------------------------------------------
  // 6. SCENE 3: LIGHT THAT LEFT BEFORE TONIGHT (Astronomical Time Travel)
  // --------------------------------------------------------------------------
  lightTravel: [
    {
      name: "Sirius (Alpha Canis Majoris)",
      constellation: "Canis Major",
      distanceLightYears: 8.6,
      description: "The brightest star in our night sky. The photons reaching your eyes tonight began their void-crossing 8.6 years ago."
    },
    {
      name: "Vega (Alpha Lyrae)",
      constellation: "Lyra",
      distanceLightYears: 25.0,
      description: "Vega's brilliant blue-white starlight has been traveling for 25 years. It crossed the deep dark just to meet your birthday."
    },
    {
      name: "Proxima Centauri",
      constellation: "Centaurus",
      distanceLightYears: 4.24,
      description: "Our nearest stellar neighbor. Its soft red photons set sail just 4.24 years ago."
    },
    {
      name: "Arcturus",
      constellation: "Boötes",
      distanceLightYears: 36.7,
      description: "A golden giant star whose light set off 36.7 years ago, before you arrived, racing through space toward this exact night."
    }
  ],

  // --------------------------------------------------------------------------
  // 7. SCENE 4: ZODIAC CONSTELLATION BLURBS (All 12 signs supported)
  // --------------------------------------------------------------------------
  zodiacBlurbs: {
    Aries: "Aries: Bright, energetic, and unafraid of initiating the voyage. Tradition says you blaze first.",
    Taurus: "Taurus: Patient, rooted, and possessing an eye for beauty that outlasts the tides.",
    Gemini: "Gemini: Restless curiosity, playful wit, and a mind that travels faster than solar wind.",
    Cancer: "Cancer: Deep empathy, quiet strength, and fierce loyalty to the people in your orbit.",
    Leo: "Leo: Radiant warmth, generous spirit, and an innate knack for lighting up a room.",
    Virgo: "Virgo: Meticulous, observant, and gifted at noticing the harmony beneath complicated systems.",
    Libra: "Libra: Graceful, thoughtful, and seeking balance and beauty wherever you land.",
    Scorpio: "Scorpio: Deeply perceptive, magnetic, and fiercely loyal to truth and substance.",
    Sagittarius: "Sagittarius: The philosopher and star-wanderer; always looking toward the next horizon with an open grin.",
    Capricorn: "Capricorn: Steadfast, resilient, and quietly climbing toward goals most would find daunting.",
    Aquarius: "Aquarius: Original, independent, and always thinking two light-years ahead of the rest of us.",
    Pisces: "Pisces: Poetic, intuitive, and carrying a quiet ocean of imagination inside."
  },

  // --------------------------------------------------------------------------
  // 8. SCENE 5: MAKE A WISH (Interactive Shooting Stars)
  // --------------------------------------------------------------------------
  wishes: {
    instruction: "Catch a shooting star to make a wish.",
    subtext: "It stays on your device. Only you can see it.",
    placeholder: "Type a wish and let it sail into the dark...",
    releaseBtn: "Release Into The Sky",
    maxCatches: 3,
    completionTitle: "Three wishes set loose.",
    completionMessage: "Whatever you wished for in the quiet of this evening, may the universe make generous room for it."
  },

  // --------------------------------------------------------------------------
  // 9. SCENE 6: THE TELESCOPE (Hidden Messages in the Deep Sky)
  // --------------------------------------------------------------------------
  telescopeSecrets: [
    {
      id: "secret-1",
      coords: "RA 12h 43m / Dec +08° 52'",
      title: "Deep Sky Note I",
      text: "Carl Sagan: 'The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.'"
    },
    {
      id: "secret-2",
      coords: "RA 18h 36m / Dec +38° 47'",
      title: "Deep Sky Note II (Observer's Log)",
      text: "Observation: Your curiosity is one of the most refreshing things in the world. You look at the dark and find wonder instead of emptiness."
    },
    {
      id: "secret-3",
      coords: "RA 06h 45m / Dec -16° 42'",
      title: "Deep Sky Note III (The Pale Blue Dot)",
      text: "'Look again at that dot. That's here. That's home. That's us.' Happy birthday from one speck of dust to another."
    }
  ],

  // --------------------------------------------------------------------------
  // 10. SCENE 7: FINAL MESSAGE
  // --------------------------------------------------------------------------
  finalMessage: {
    headline: "For {HER_NAME}",
    bodyParagraphs: [
      "Another full orbit completed. I hope your twenty-fourth year is full of clear, dark skies, quiet triumphs, and moments that make you smile without trying.",
      "I built this small planetarium because your love for astronomy is contagious. It's rare to meet someone whose mind is so eager to explore the vast and quiet corners of the world.",
      "No reply needed. I just wanted your day to have a sky."
    ],
    signOff: "With warm admiration,",
    sender: "{MY_NAME}",
    // Optional reply button (set to "" or null to hide completely):
    replyLink: "https://wa.me/?text=Hey%20Sujal%2C%20thank%20you%20for%20the%20sky!",
    replyButtonText: "Say hi back"
  }
};

// Freeze the configuration to prevent accidental mutations
Object.freeze(SKY_CONFIG);

if (typeof window !== 'undefined') {
  window.SKY_CONFIG = SKY_CONFIG;
}

