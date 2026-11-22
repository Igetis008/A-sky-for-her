/**
 * ============================================================================
 * MAIN APPLICATION CONTROLLER & SCENE ROUTER
 * ============================================================================
 * Coordinates scenes 0 through 7, lazy-initializes upon countdown unlock,
 * handles accessible navigation, star interactions, and keyboard shortcuts.
 */

class SkyApp {
  constructor() {
    this.currentScene = 0;
    this.maxSceneReached = 0;
    this.visitedStars = new Set();
    this.isConstellationComplete = false;

    // Canvas & Engines
    this.starfieldCanvas = document.getElementById('sky-canvas');
    this.starfield = new Starfield(this.starfieldCanvas);
    this.gameManager = new SkyGameManager(this.starfield);

    // Audio setup
    this.audioBtn = document.getElementById('audio-toggle-btn');
    this.bindAudioToggle();

    // Lock Manager (Scene -1)
    this.lockManager = new SkyLockManager(this.starfield, () => {
      this.initMainExperience();
    });

    this.bindGlobalKeyboard();
  }

  // ==========================================================================
  // LAZY INITIALIZATION (ONLY AFTER UNLOCK)
  // ==========================================================================

  initMainExperience() {
    const mainApp = document.getElementById('main-experience');
    mainApp.classList.remove('hidden');

    this.renderHeaderNav();

    const urlParams = new URLSearchParams(window.location.search);
    const sceneParam = urlParams.get('scene');
    const targetScene = sceneParam !== null && !isNaN(parseInt(sceneParam, 10))
      ? parseInt(sceneParam, 10)
      : 0;

    if (urlParams.get('aurora') === '1') {
      this.starfield.auroraActive = true;
    }

    this.goToScene(targetScene);
  }

  renderHeaderNav() {
    const navDotsContainer = document.getElementById('nav-progress-dots');
    if (!navDotsContainer) return;

    navDotsContainer.innerHTML = '';
    const sceneTitles = [
      "The Gate",
      "Arrival",
      `${SKY_CONFIG.age} Stars`,
      "Ancient Light",
      "Zodiac Sky",
      "Make a Wish",
      "The Telescope",
      "Final Message"
    ];

    sceneTitles.forEach((title, index) => {
      const dot = document.createElement('button');
      dot.className = `nav-dot ${index === this.currentScene ? 'active' : ''}`;
      dot.setAttribute('data-scene', index);
      dot.setAttribute('aria-label', `Scene ${index}: ${title}`);
      dot.setAttribute('title', `Scene ${index}: ${title}`);

      dot.addEventListener('click', () => {
        // Allow navigating to any scene once unlocked
        this.goToScene(index);
      });

      navDotsContainer.appendChild(dot);
    });
  }

  updateNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentScene);
      dot.classList.toggle('visited', index < this.currentScene);
    });
  }

  bindAudioToggle() {
    if (!this.audioBtn) return;

    this.audioBtn.addEventListener('click', () => {
      const isUnmuted = window.skyAudio.toggle();
      this.updateAudioButtonState(isUnmuted);
    });
  }

  updateAudioButtonState(isUnmuted) {
    if (!this.audioBtn) return;
    const textSpan = this.audioBtn.querySelector('.audio-label');
    const iconSpan = this.audioBtn.querySelector('.audio-icon');

    if (isUnmuted) {
      this.audioBtn.setAttribute('aria-pressed', 'true');
      this.audioBtn.classList.add('audio-active');
      if (textSpan) textSpan.textContent = "Sound: On";
      if (iconSpan) iconSpan.textContent = "🔊";
    } else {
      this.audioBtn.setAttribute('aria-pressed', 'false');
      this.audioBtn.classList.remove('audio-active');
      if (textSpan) textSpan.textContent = "Sound: Off";
      if (iconSpan) iconSpan.textContent = "🔇";
    }
  }

  bindGlobalKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Escape key closes open modals
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.celestial-modal:not(.hidden)');
        if (openModal) {
          openModal.classList.add('hidden');
        }
      }

      // Left/Right Arrow navigation between scenes if not typing in textarea/input
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (this.currentScene < 7) {
          this.goToScene(this.currentScene + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.currentScene > 0) {
          this.goToScene(this.currentScene - 1);
        }
      }
    });
  }

  goToScene(sceneIndex) {
    if (sceneIndex < 0 || sceneIndex > 7) return;

    // Clean up previous scene if necessary
    if (this.currentScene === 5 && sceneIndex !== 5) {
      this.gameManager.stopShootingStarGame();
    }

    this.currentScene = sceneIndex;
    this.maxSceneReached = Math.max(this.maxSceneReached, sceneIndex);
    this.updateNavDots();

    // Hide all scenes, show target scene with smooth crossfade
    const sceneElements = document.querySelectorAll('.sky-scene');
    sceneElements.forEach(el => el.classList.remove('active-scene'));

    const targetEl = document.getElementById(`scene-${sceneIndex}`);
    if (targetEl) {
      targetEl.classList.add('active-scene');
      // Scroll to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize scene specific logic
    this.mountScene(sceneIndex);
  }

  mountScene(index) {
    switch (index) {
      case 0:
        this.mountScene0_Gate();
        break;
      case 1:
        this.mountScene1_Arrival();
        break;
      case 2:
        this.mountScene2_AgeStars();
        break;
      case 3:
        this.mountScene3_AncientLight();
        break;
      case 4:
        this.mountScene4_Zodiac();
        break;
      case 5:
        this.mountScene5_WishGame();
        break;
      case 6:
        this.mountScene6_Telescope();
        break;
      case 7:
        this.mountScene7_FinalMessage();
        break;
    }
  }

  // ==========================================================================
  // SCENE 0: THE GATE (ASTRONOMY QUIZ)
  // ==========================================================================

  mountScene0_Gate() {
    const scene = document.getElementById('scene-0');
    if (!scene) return;

    let wrongTries = 0;

    scene.innerHTML = `
      <div class="gate-wrapper">
        <div class="gate-star-node" id="gate-star" aria-hidden="true">
          <span class="gate-star-glyph">✦</span>
          <div class="gate-star-halo"></div>
        </div>

        <div class="gate-prologue">
          <p class="gate-eyebrow">Before the sky opens, one question.</p>
          <h2 class="gate-question">${SKY_CONFIG.quiz.question}</h2>
        </div>

        <form class="gate-quiz-form" id="quiz-form" autocomplete="off" onsubmit="return false;">
          <div class="input-row">
            <input 
              type="text" 
              id="quiz-input" 
              class="celestial-input" 
              placeholder="Enter planet name..." 
              aria-label="Answer the astronomy question"
              required 
            />
            <button type="submit" class="celestial-btn primary-btn" id="quiz-submit-btn">Unlock Sky</button>
          </div>
          <div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div>
          <button type="button" class="skip-btn hidden" id="quiz-skip-btn">${SKY_CONFIG.quiz.skipButtonText}</button>
        </form>
      </div>
    `;

    const input = scene.querySelector('#quiz-input');
    const feedback = scene.querySelector('#quiz-feedback');
    const skipBtn = scene.querySelector('#quiz-skip-btn');
    const form = scene.querySelector('#quiz-form');
    const gateStar = scene.querySelector('#gate-star');

    setTimeout(() => {
      if (input && typeof input.focus === 'function') input.focus();
    }, 150);

    const checkAnswer = () => {
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      const isCorrect = SKY_CONFIG.quiz.acceptedAnswers.some(ans => {
        return val === ans.toLowerCase() || val.includes(ans.toLowerCase());
      });

      if (isCorrect) {
        feedback.className = "quiz-feedback success";
        feedback.textContent = "Correct! The sky is opening...";
        gateStar.classList.add('star-unlocked');

        if (window.skyAudio) window.skyAudio.playTwinkle(1046.5);
        this.starfield.triggerRadialBurst(window.innerWidth / 2, window.innerHeight * 0.35, 40);

        setTimeout(() => {
          this.goToScene(1);
        }, 1200);
      } else {
        wrongTries++;
        feedback.className = "quiz-feedback error";
        gateStar.classList.add('star-shake');
        setTimeout(() => gateStar.classList.remove('star-shake'), 500);

        const hintIndex = Math.min(wrongTries - 1, SKY_CONFIG.quiz.hints.length - 1);
        feedback.textContent = SKY_CONFIG.quiz.hints[hintIndex];

        if (wrongTries >= 3) {
          skipBtn.classList.remove('hidden');
        }
      }
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkAnswer();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        feedback.className = "quiz-feedback success";
        feedback.textContent = "The gates swing open anyway ✨";
        if (window.skyAudio) window.skyAudio.playTwinkle(880);
        setTimeout(() => this.goToScene(1), 800);
      });
    }
  }

  // ==========================================================================
  // SCENE 1: ARRIVAL
  // ==========================================================================

  mountScene1_Arrival() {
    const scene = document.getElementById('scene-1');
    if (!scene) return;

    const headlineText = SKY_CONFIG.arrival.headline.replace('{HER_NAME}', SKY_CONFIG.herName);
    const subtext = SKY_CONFIG.arrival.subtext;

    scene.innerHTML = `
      <div class="arrival-wrapper">
        <div class="arrival-glyph">✧ • ✦ • ✧</div>
        <h1 class="arrival-title">${headlineText}</h1>
        <p class="arrival-subtext">${subtext}</p>
        <div class="arrival-actions">
          <button class="celestial-btn primary-btn large-cta" id="arrival-begin-btn">
            ${SKY_CONFIG.arrival.cta} →
          </button>
        </div>
      </div>
    `;

    const beginBtn = scene.querySelector('#arrival-begin-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        if (window.skyAudio) window.skyAudio.playTwinkle(659.25);
        this.goToScene(2);
      });
    }
  }

  // ==========================================================================
  // SCENE 2: YOUR [AGE] STARS (CORE INTERACTION)
  // ==========================================================================

  mountScene2_AgeStars() {
    const scene = document.getElementById('scene-2');
    if (!scene) return;

    const totalStars = SKY_CONFIG.age;
    const starData = SKY_CONFIG.stars;
    const positions = generateCrescentStarPositions(totalStars);

    scene.innerHTML = `
      <div class="age-stars-wrapper">
        <div class="stars-header">
          <h2 class="stars-title">${SKY_CONFIG.age} Stars In Your Sky</h2>
          <p class="stars-subtitle">Each star holds a memory, observation, or quiet wish. Touch each one to light it.</p>
          <div class="stars-progress-pill" id="stars-counter">
            ${this.visitedStars.size} / ${totalStars} stars charted
          </div>
        </div>

        <div class="constellation-viewport" id="constellation-viewport">
          <!-- Canvas layer for connecting constellation lines -->
          <canvas id="constellation-lines-canvas" class="constellation-canvas"></canvas>
          <!-- Star nodes injected here -->
          <div class="star-nodes-container" id="star-nodes-container"></div>
        </div>

        <div class="stars-footer-action hidden" id="stars-complete-banner">
          <div class="complete-message">✧ Constellation Complete ✧</div>
          <button class="celestial-btn primary-btn" id="stars-proceed-btn">
            Explore Ancient Light →
          </button>
        </div>

        <!-- Star Message Card Modal -->
        <div class="celestial-modal hidden" id="star-card-modal" role="dialog" aria-modal="true">
          <div class="modal-card star-detail-card">
            <button class="modal-close" id="star-modal-close" aria-label="Close dialog">&times;</button>
            <div class="card-badge" id="card-badge">Compliment</div>
            <h3 class="modal-title" id="card-title">Year Title</h3>
            <p class="modal-body" id="card-text">Message content...</p>
            <div class="card-footer-starlight">✦ ✦ ✦</div>
          </div>
        </div>
      </div>
    `;

    const nodesContainer = scene.querySelector('#star-nodes-container');
    const viewport = scene.querySelector('#constellation-viewport');
    const linesCanvas = scene.querySelector('#constellation-lines-canvas');
    const completeBanner = scene.querySelector('#stars-complete-banner');
    const proceedBtn = scene.querySelector('#stars-proceed-btn');

    const modal = scene.querySelector('#star-card-modal');
    const modalClose = scene.querySelector('#star-modal-close');
    const cardBadge = scene.querySelector('#card-badge');
    const cardTitle = scene.querySelector('#card-title');
    const cardText = scene.querySelector('#card-text');

    if (modalClose) {
      modalClose.addEventListener('click', () => modal && modal.classList.add('hidden'));
    }

    // Render [AGE] interactive stars
    for (let i = 0; i < totalStars; i++) {
      const data = starData[i] || {
        year: i + 1,
        title: `Year ${i + 1}`,
        type: "compliment",
        text: `Another brilliant revolution around our star.`
      };

      const pos = positions[i];
      const starEl = document.createElement('button');
      starEl.className = `star-node ${this.visitedStars.has(data.year) ? 'lit' : ''}`;
      starEl.style.left = `${pos.x * 100}%`;
      starEl.style.top = `${pos.y * 100}%`;
      starEl.setAttribute('data-year', data.year);
      starEl.setAttribute('aria-label', `Star for Year ${data.year}: ${data.title}`);

      starEl.innerHTML = `
        <span class="star-halo"></span>
        <span class="star-core"></span>
        <span class="star-number">${data.year}</span>
      `;

      starEl.addEventListener('click', () => {
        // Mark as visited
        starEl.classList.add('lit');
        this.visitedStars.add(data.year);

        // Twinkle chime
        if (window.skyAudio) window.skyAudio.playTwinkle();

        // Update counter
        const counter = scene.querySelector('#stars-counter');
        counter.textContent = `${this.visitedStars.size} / ${totalStars} stars charted`;

        // Open modal
        cardBadge.textContent = (data.type || 'Star').toUpperCase();
        cardBadge.className = `card-badge badge-${data.type || 'compliment'}`;
        cardTitle.textContent = data.title;
        cardText.textContent = data.text;
        modal.classList.remove('hidden');

        // Check if all stars chartered
        if (this.visitedStars.size === totalStars && !this.isConstellationComplete) {
          this.isConstellationComplete = true;
          this.drawConstellationConnections(linesCanvas, positions);
          if (window.skyAudio) window.skyAudio.playConstellationComplete();
          completeBanner.classList.remove('hidden');
        }
      });

      nodesContainer.appendChild(starEl);
    }

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        this.goToScene(3);
      });
    }

    // If already complete from previous visit, draw lines immediately
    if (this.isConstellationComplete) {
      completeBanner.classList.remove('hidden');
      setTimeout(() => this.drawConstellationConnections(linesCanvas, positions), 200);
    }
  }

  drawConstellationConnections(canvas, positions) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    positions.forEach((pos, idx) => {
      const x = pos.x * rect.width;
      const y = pos.y * rect.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  // ==========================================================================
  // SCENE 3: LIGHT THAT LEFT BEFORE TONIGHT
  // ==========================================================================

  mountScene3_AncientLight() {
    const scene = document.getElementById('scene-3');
    if (!scene) return;

    const age = SKY_CONFIG.age;

    // Factual computation based on age
    const siriusAgeAgo = Math.max(0, age - 8.6).toFixed(1);
    const vegaYearsDiff = Math.abs(25.0 - age).toFixed(1);
    const vegaText = age < 25
      ? `Vega's photons set out approximately ${vegaYearsDiff} years before you were born. They crossed the deep vacuum just to reach your eyes tonight.`
      : `When those photons left Vega, you were approximately ${(age - 25.0).toFixed(1)} years old.`;

    const proximaAgeAgo = Math.max(0, age - 4.24).toFixed(1);

    scene.innerHTML = `
      <div class="ancient-light-wrapper">
        <div class="section-badge">Cosmic Chronology</div>
        <h2 class="scene-title">Light That Left Before Tonight</h2>
        <p class="scene-subtext">Starlight is a telescope into the past. Here is where you were when tonight's photons began their journey toward you.</p>

        <div class="light-cards-grid">
          <!-- Sirius Card -->
          <div class="light-card">
            <div class="light-star-name">Sirius</div>
            <div class="light-stat">~8.6 Light-Years Away</div>
            <p class="light-desc">
              The brightest star in our night sky. The light you see from Sirius tonight left it roughly 8.6 years ago.
            </p>
            <div class="light-calc-box">
              You were approximately <strong>${siriusAgeAgo} years old</strong> when those photons set sail.
            </div>
          </div>

          <!-- Vega Card -->
          <div class="light-card featured-light-card">
            <div class="light-star-name">Vega</div>
            <div class="light-stat">~25.0 Light-Years Away</div>
            <p class="light-desc">${vegaText}</p>
            <div class="light-calc-box">
              Traveling at 186,282 miles per second for a quarter century.
            </div>
          </div>

          <!-- Proxima Centauri Card -->
          <div class="light-card">
            <div class="light-star-name">Proxima Centauri</div>
            <div class="light-stat">~4.24 Light-Years Away</div>
            <p class="light-desc">
              Our closest stellar neighbor. Its faint red starlight has been traveling for a little over four years.
            </p>
            <div class="light-calc-box">
              You were approximately <strong>${proximaAgeAgo} years old</strong> when it embarked.
            </div>
          </div>
        </div>

        <div class="scene-actions">
          <button class="celestial-btn primary-btn" id="light-next-btn">
            View Your Zodiac Constellation →
          </button>
        </div>
      </div>
    `;

    const nextBtn = scene.querySelector('#light-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.goToScene(4));
    }
  }

  // ==========================================================================
  // SCENE 4: YOUR ZODIAC CONSTELLATION
  // ==========================================================================

  mountScene4_Zodiac() {
    const scene = document.getElementById('scene-4');
    if (!scene) return;

    const zodiacSign = getZodiacSign(SKY_CONFIG.birthdayDate);
    const blurb = SKY_CONFIG.zodiacBlurbs[zodiacSign.name] || `${zodiacSign.name}: An ancient constellation in your sky.`;

    scene.innerHTML = `
      <div class="zodiac-wrapper">
        <div class="section-badge">Celestial Heritage</div>
        <h2 class="scene-title">Your Constellation: ${zodiacSign.name} ${zodiacSign.symbol}</h2>
        <p class="zodiac-dates">${zodiacSign.dateRange}</p>

        <div class="zodiac-canvas-container">
          <canvas id="zodiac-canvas" class="zodiac-canvas"></canvas>
        </div>

        <div class="zodiac-blurb-box">
          <p class="zodiac-blurb-text">"${blurb}"</p>
          <span class="zodiac-disclaimer">(Tradition says this is your sky.)</span>
        </div>

        <div class="scene-actions">
          <button class="celestial-btn primary-btn" id="zodiac-next-btn">
            Make A Wish →
          </button>
        </div>
      </div>
    `;

    const canvas = scene.querySelector('#zodiac-canvas');
    if (canvas) {
      setTimeout(() => {
        renderZodiacOnCanvas(canvas, zodiacSign);
      }, 50);
    }

    const nextBtn = scene.querySelector('#zodiac-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.goToScene(5));
    }
  }

  // ==========================================================================
  // SCENE 5: MAKE A WISH
  // ==========================================================================

  mountScene5_WishGame() {
    const scene = document.getElementById('scene-5');
    if (!scene) return;

    scene.innerHTML = `
      <div class="wish-scene-wrapper">
        <div class="wish-header">
          <div class="section-badge">Interactive Starlight</div>
          <h2 class="scene-title">Catch A Shooting Star</h2>
          <p class="scene-subtext">Touch a passing shooting star to make a private wish. Three wishes can be sent wandering.</p>
        </div>
        <div class="wish-game-container" id="wish-game-container"></div>
      </div>
    `;

    const gameContainer = scene.querySelector('#wish-game-container');
    this.gameManager.startShootingStarGame(gameContainer, () => {
      this.goToScene(6);
    });
  }

  // ==========================================================================
  // SCENE 6: THE TELESCOPE
  // ==========================================================================

  mountScene6_Telescope() {
    const scene = document.getElementById('scene-6');
    if (!scene) return;

    scene.innerHTML = `
      <div class="telescope-scene-wrapper">
        <div class="telescope-header">
          <div class="section-badge">Deep Sky Observation</div>
          <h2 class="scene-title">The Telescope</h2>
          <p class="scene-subtext">Guide the lens across the dark sky to discover hidden celestial notes and quotes.</p>
        </div>
        <div class="telescope-container" id="telescope-container"></div>
      </div>
    `;

    const container = scene.querySelector('#telescope-container');
    this.gameManager.initTelescope(container, () => {
      this.goToScene(7);
    });
  }

  // ==========================================================================
  // SCENE 7: FINAL MESSAGE
  // ==========================================================================

  mountScene7_FinalMessage() {
    const scene = document.getElementById('scene-7');
    if (!scene) return;

    const data = SKY_CONFIG.finalMessage;
    const headline = data.headline.replace('{HER_NAME}', SKY_CONFIG.herName);
    const sender = data.sender.replace('{MY_NAME}', SKY_CONFIG.myName);

    const paragraphsHtml = data.bodyParagraphs
      .map(p => `<p class="final-paragraph">${p}</p>`)
      .join('');

    const hasReply = !!data.replyLink && data.replyLink.trim().length > 0;
    const replyBtnHtml = hasReply
      ? `<a href="${data.replyLink}" target="_blank" rel="noopener noreferrer" class="celestial-btn secondary-btn reply-btn">
          ${data.replyButtonText || "Say hi back"} ✉️
         </a>`
      : '';

    scene.innerHTML = `
      <div class="final-message-wrapper">
        <div class="final-card">
          <div class="final-glyph">✦ 🪐 ✦</div>
          <h2 class="final-title">${headline}</h2>
          <div class="final-body">
            ${paragraphsHtml}
          </div>
          <div class="final-signature">
            <div class="sig-signoff">${data.signOff}</div>
            <div class="sig-name">${sender}</div>
          </div>

          <div class="final-actions">
            ${replyBtnHtml}
            <button class="celestial-btn replay-btn" id="replay-btn">
              Replay From Start ↺
            </button>
          </div>
        </div>
      </div>
    `;

    // Spawn gentle final shooting star
    setTimeout(() => {
      this.starfield.spawnShootingStar({ speed: 280, life: 3.0 });
    }, 1500);

    const replayBtn = scene.querySelector('#replay-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.goToScene(1);
      });
    }
  }
}

// Instantiate upon DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.skyApp = new SkyApp();
});
