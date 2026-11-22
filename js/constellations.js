/**
 * ============================================================================
 * CONSTELLATIONS DATA & DRAWING ENGINE
 * ============================================================================
 * Contains hand-coded star patterns and connection geometries for all 12 Zodiac
 * signs, plus procedural celestial constellation generation for Scene 2.
 */

const ZODIAC_PATTERNS = {
  Aries: {
    name: "Aries",
    symbol: "♈",
    dateRange: "March 21 – April 19",
    stars: [
      { x: 0.20, y: 0.65, label: "Hamal", brightness: 1.4 },
      { x: 0.45, y: 0.50, label: "Sheratan", brightness: 1.2 },
      { x: 0.68, y: 0.42, label: "Mesarthim", brightness: 1.0 },
      { x: 0.85, y: 0.35, label: "41 Arietis", brightness: 0.9 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3]
    ]
  },
  Taurus: {
    name: "Taurus",
    symbol: "♉",
    dateRange: "April 20 – May 20",
    stars: [
      { x: 0.35, y: 0.48, label: "Aldebaran", brightness: 1.6 },
      { x: 0.44, y: 0.38, label: "Ain", brightness: 1.1 },
      { x: 0.48, y: 0.58, label: "Hyadum I", brightness: 1.0 },
      { x: 0.62, y: 0.30, label: "Elnath", brightness: 1.3 },
      { x: 0.70, y: 0.64, label: "Tianguan", brightness: 1.1 },
      { x: 0.22, y: 0.32, label: "Pleiades Cluster", brightness: 1.2 }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [0, 5]
    ]
  },
  Gemini: {
    name: "Gemini",
    symbol: "♊",
    dateRange: "May 21 – June 20",
    stars: [
      { x: 0.28, y: 0.25, label: "Castor", brightness: 1.5 },
      { x: 0.42, y: 0.20, label: "Pollux", brightness: 1.6 },
      { x: 0.26, y: 0.50, label: "Mebsuta", brightness: 1.1 },
      { x: 0.40, y: 0.46, label: "Wasat", brightness: 1.1 },
      { x: 0.22, y: 0.78, label: "Tejat", brightness: 1.2 },
      { x: 0.38, y: 0.74, label: "Alhena", brightness: 1.3 }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [2, 3]
    ]
  },
  Cancer: {
    name: "Cancer",
    symbol: "♋",
    dateRange: "June 21 – July 22",
    stars: [
      { x: 0.50, y: 0.48, label: "Praesepe", brightness: 1.2 },
      { x: 0.38, y: 0.32, label: "Asellus Borealis", brightness: 1.0 },
      { x: 0.62, y: 0.34, label: "Asellus Australis", brightness: 1.0 },
      { x: 0.32, y: 0.70, label: "Acubens", brightness: 1.1 },
      { x: 0.68, y: 0.68, label: "Altarf", brightness: 1.2 }
    ],
    lines: [
      [1, 0], [0, 2], [0, 3], [0, 4]
    ]
  },
  Leo: {
    name: "Leo",
    symbol: "♌",
    dateRange: "July 23 – August 22",
    stars: [
      { x: 0.25, y: 0.58, label: "Regulus", brightness: 1.6 },
      { x: 0.22, y: 0.42, label: "Eta Leonis", brightness: 1.0 },
      { x: 0.30, y: 0.30, label: "Algieba", brightness: 1.3 },
      { x: 0.40, y: 0.24, label: "Adhafera", brightness: 1.0 },
      { x: 0.44, y: 0.34, label: "Ras Elased", brightness: 1.0 },
      { x: 0.52, y: 0.44, label: "Zosma", brightness: 1.2 },
      { x: 0.54, y: 0.62, label: "Chertan", brightness: 1.1 },
      { x: 0.76, y: 0.48, label: "Denebola", brightness: 1.4 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 7], [5, 6], [6, 0]
    ]
  },
  Virgo: {
    name: "Virgo",
    symbol: "♍",
    dateRange: "August 23 – September 22",
    stars: [
      { x: 0.60, y: 0.72, label: "Spica", brightness: 1.7 },
      { x: 0.48, y: 0.55, label: "Porrima", brightness: 1.3 },
      { x: 0.38, y: 0.38, label: "Vindemiatrix", brightness: 1.2 },
      { x: 0.32, y: 0.52, label: "Zaniah", brightness: 1.0 },
      { x: 0.24, y: 0.62, label: "Zavijava", brightness: 1.0 },
      { x: 0.68, y: 0.48, label: "Heze", brightness: 1.1 },
      { x: 0.74, y: 0.35, label: "Syrma", brightness: 0.9 }
    ],
    lines: [
      [4, 3], [3, 1], [1, 2], [1, 0], [1, 5], [5, 6]
    ]
  },
  Libra: {
    name: "Libra",
    symbol: "♎",
    dateRange: "September 23 – October 22",
    stars: [
      { x: 0.32, y: 0.52, label: "Zubenelgenubi", brightness: 1.4 },
      { x: 0.58, y: 0.34, label: "Zubeneschamali", brightness: 1.4 },
      { x: 0.70, y: 0.58, label: "Zubenelhakrabi", brightness: 1.1 },
      { x: 0.48, y: 0.70, label: "Brachium", brightness: 1.1 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [1, 3]
    ]
  },
  Scorpio: {
    name: "Scorpio",
    symbol: "♏",
    dateRange: "October 23 – November 21",
    stars: [
      { x: 0.28, y: 0.32, label: "Graffias", brightness: 1.2 },
      { x: 0.24, y: 0.40, label: "Dschubba", brightness: 1.2 },
      { x: 0.26, y: 0.50, label: "Pi Scorpii", brightness: 1.0 },
      { x: 0.42, y: 0.45, label: "Antares", brightness: 1.7 },
      { x: 0.54, y: 0.55, label: "Larawag", brightness: 1.1 },
      { x: 0.62, y: 0.68, label: "Sargas", brightness: 1.3 },
      { x: 0.72, y: 0.72, label: "Apollyon", brightness: 1.0 },
      { x: 0.80, y: 0.58, label: "Shaula", brightness: 1.4 },
      { x: 0.78, y: 0.48, label: "Lesath", brightness: 1.1 }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]
    ]
  },
  Sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    dateRange: "November 22 – December 21",
    stars: [
      { x: 0.25, y: 0.45, label: "Alnasl", brightness: 1.2 },
      { x: 0.42, y: 0.38, label: "Kaus Media", brightness: 1.3 },
      { x: 0.40, y: 0.58, label: "Kaus Australis", brightness: 1.6 },
      { x: 0.46, y: 0.26, label: "Kaus Borealis", brightness: 1.2 },
      { x: 0.60, y: 0.34, label: "Phi Sagittarii", brightness: 1.1 },
      { x: 0.68, y: 0.48, label: "Nunki", brightness: 1.5 },
      { x: 0.74, y: 0.60, label: "Ascella", brightness: 1.3 },
      { x: 0.58, y: 0.64, label: "Tau Sagittarii", brightness: 1.0 }
    ],
    lines: [
      // Teapot asterism
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2], [4, 7], [5, 1]
    ]
  },
  Capricorn: {
    name: "Capricorn",
    symbol: "♑",
    dateRange: "December 22 – January 19",
    stars: [
      { x: 0.26, y: 0.35, label: "Algedi", brightness: 1.2 },
      { x: 0.28, y: 0.42, label: "Dabih", brightness: 1.3 },
      { x: 0.48, y: 0.68, label: "Oculus", brightness: 1.0 },
      { x: 0.72, y: 0.52, label: "Nashira", brightness: 1.1 },
      { x: 0.82, y: 0.44, label: "Deneb Algedi", brightness: 1.4 },
      { x: 0.55, y: 0.38, label: "Rho Capricorni", brightness: 0.9 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]
    ]
  },
  Aquarius: {
    name: "Aquarius",
    symbol: "♒",
    dateRange: "January 20 – February 18",
    stars: [
      { x: 0.34, y: 0.32, label: "Sadalmelik", brightness: 1.4 },
      { x: 0.48, y: 0.28, label: "Sadalsuud", brightness: 1.4 },
      { x: 0.58, y: 0.38, label: "Sadachbia", brightness: 1.1 },
      { x: 0.66, y: 0.46, label: "Eta Aquarii", brightness: 1.0 },
      { x: 0.44, y: 0.58, label: "Ancha", brightness: 1.1 },
      { x: 0.32, y: 0.72, label: "Skat", brightness: 1.3 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5]
    ]
  },
  Pisces: {
    name: "Pisces",
    symbol: "♓",
    dateRange: "February 19 – March 20",
    stars: [
      { x: 0.50, y: 0.75, label: "Alrescha", brightness: 1.4 },
      { x: 0.38, y: 0.62, label: "Linteum", brightness: 1.0 },
      { x: 0.28, y: 0.48, label: "Delta Piscium", brightness: 1.1 },
      { x: 0.22, y: 0.34, label: "Circlet Western", brightness: 1.2 },
      { x: 0.62, y: 0.58, label: "Torcular", brightness: 1.0 },
      { x: 0.72, y: 0.40, label: "Revati", brightness: 1.1 },
      { x: 0.78, y: 0.25, label: "Kullat Nunu", brightness: 1.2 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6]
    ]
  }
};

/**
 * Determines Zodiac sign based on birthday string (YYYY-MM-DD or standard parseable date).
 */
function getZodiacSign(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Default fallback to Sagittarius if parsing fails
    return ZODIAC_PATTERNS.Sagittarius;
  }

  const month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate();        // 1-31

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_PATTERNS.Aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_PATTERNS.Taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_PATTERNS.Gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_PATTERNS.Cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_PATTERNS.Leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_PATTERNS.Virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_PATTERNS.Libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_PATTERNS.Scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_PATTERNS.Sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_PATTERNS.Capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_PATTERNS.Aquarius;
  return ZODIAC_PATTERNS.Pisces;
}

/**
 * Renders a Zodiac constellation onto an HTML5 canvas.
 */
function renderZodiacOnCanvas(canvas, zodiacData, progress = 1.0) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, width, height);

  const padding = Math.min(width, height) * 0.12;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const toScreen = (star) => ({
    x: padding + star.x * innerW,
    y: padding + star.y * innerH
  });

  // Draw connecting lines with starlight glow
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(191, 219, 254, 0.45)';
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 10;

  zodiacData.lines.forEach(([i1, i2]) => {
    const p1 = toScreen(zodiacData.stars[i1]);
    const p2 = toScreen(zodiacData.stars[i2]);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    if (progress >= 1.0) {
      ctx.lineTo(p2.x, p2.y);
    } else {
      ctx.lineTo(p1.x + (p2.x - p1.x) * progress, p1.y + (p2.y - p1.y) * progress);
    }
    ctx.stroke();
  });
  ctx.restore();

  // Draw star nodes with halos
  zodiacData.stars.forEach((star) => {
    const pt = toScreen(star);
    const radius = 3.2 * (star.brightness || 1);

    ctx.save();
    // Outer halo
    const halo = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, radius * 3.8);
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    halo.addColorStop(0.3, 'rgba(191, 219, 254, 0.4)');
    halo.addColorStop(1, 'rgba(191, 219, 254, 0)');

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius * 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Core white star
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Star label
    if (star.label) {
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.fillText(star.label, pt.x + 8, pt.y - 6);
    }
    ctx.restore();
  });
}

/**
 * Procedurally generates coordinates for [AGE] stars in Scene 2
 * shaped in a graceful celestial crescent arc.
 */
function generateCrescentStarPositions(count) {
  const positions = [];
  // Center (0.5, 0.5), outer crescent arc & inner curve
  for (let i = 0; i < count; i++) {
    // Distribute along an elegant sweeping crescent moon curve:
    // angle from -0.8 to 2.4 radians
    const t = i / (count - 1);
    const angle = -0.7 + t * 3.2;
    const r = 0.32 + Math.sin(t * Math.PI) * 0.08;

    // Slight organic jitter so it feels like real astronomical stars, not synthetic grid
    const jitterX = Math.sin(i * 12.3) * 0.025;
    const jitterY = Math.cos(i * 8.7) * 0.025;

    let x = 0.5 + Math.cos(angle) * r + jitterX;
    let y = 0.52 + Math.sin(angle) * (r * 1.05) + jitterY;

    // Clamp into 0.08 - 0.92 viewport
    x = Math.max(0.08, Math.min(0.92, x));
    y = Math.max(0.12, Math.min(0.88, y));

    positions.push({ x, y });
  }
  return positions;
}

window.ZODIAC_PATTERNS = ZODIAC_PATTERNS;
window.getZodiacSign = getZodiacSign;
window.renderZodiacOnCanvas = renderZodiacOnCanvas;
window.generateCrescentStarPositions = generateCrescentStarPositions;
