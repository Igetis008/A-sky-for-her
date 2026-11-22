/**
 * ============================================================================
 * SCENE -1: THE SEALED SKY (COUNTDOWN LOCK)
 * ============================================================================
 * Guards the experience until her birthday arrives.
 * Features live drift-free countdown, locked star teaser interactions,
 * final 10-second climax, radial unlock burst, and lazy-loading of Scenes 0-7.
 */

class SkyLockManager {
  constructor(starfield, onUnlockCallback) {
    this.starfield = starfield;
    this.onUnlockCallback = onUnlockCallback;

    this.lockContainer = document.getElementById('lock-screen');
    this.isUnlocked = false;
    this.timerInterval = null;
    this.unlockAtTimestamp = null;
    this.teaserIndex = 0;

    this.init();
  }

  init() {
    // 1. Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const previewVal = urlParams.get('preview');
    const unlockInVal = urlParams.get('unlockIn');

    // Bypass check: ?preview=<previewKey>
    if (previewVal && previewVal === SKY_CONFIG.previewKey) {
      console.info("Sky preview mode activated via previewKey. Bypassing countdown lock.");
      this.unlockImmediate();
      return;
    }

    // Override check: ?unlockIn=15
    if (unlockInVal && !isNaN(parseInt(unlockInVal, 10))) {
      const seconds = Math.max(1, parseInt(unlockInVal, 10));
      this.unlockAtTimestamp = Date.now() + seconds * 1000;
      console.info(`Test unlock override: unlocking in ${seconds} seconds.`);
    } else {
      // Parse ISO 8601 string from config
      if (!SKY_CONFIG.unlockAt) {
        console.error("Invalid unlockAt: date string is missing. Defaulting to immediate unlock.");
        this.unlockImmediate();
        return;
      }

      const parsedDate = new Date(SKY_CONFIG.unlockAt);
      if (isNaN(parsedDate.getTime())) {
        console.error(`Invalid unlockAt date string "${SKY_CONFIG.unlockAt}". It must be an ISO 8601 string with explicit timezone offset (e.g. 2026-12-05T00:00:00+05:30). Defaulting to immediate unlock.`);
        this.unlockImmediate();
        return;
      }

      this.unlockAtTimestamp = parsedDate.getTime();
    }

    // 2. Check if already past unlock time on load
    if (Date.now() >= this.unlockAtTimestamp) {
      this.unlockImmediate();
      return;
    }

    // 3. Render Locked Screen DOM
    this.renderLockScreen();

    // 4. Start starfield in slow locked mode
    this.starfield.lockedMode = true;

    // 5. Start live drift-free timer
    this.startCountdown();

    // 6. Handle tab wake-up / focus events
    this.bindRecheckEvents();
  }

  renderLockScreen() {
    this.lockContainer.classList.remove('hidden');
    this.lockContainer.innerHTML = `
      <div class="lock-wrapper">
        <!-- Sealed center star with orbital rings -->
        <div class="sealed-star-system" id="sealed-star-system" role="button" tabindex="0" aria-label="A sealed star in the center of the sky. Tap it.">
          <div class="sealed-ring outer-ring"></div>
          <div class="sealed-ring inner-ring"></div>
          <div class="sealed-star-core">
            <span class="star-sparkle">✦</span>
          </div>
        </div>

        <div class="lock-typography">
          <h1 class="lock-headline">Something is waiting in the sky.</h1>
          <p class="lock-subtext">It opens on ${SKY_CONFIG.herName}'s birthday.</p>
        </div>

        <!-- Live drift-free countdown in tabular digits -->
        <div class="lock-countdown" id="countdown-display" aria-live="polite">
          <div class="countdown-unit">
            <span class="unit-num" id="cd-days">00</span>
            <span class="unit-label">DAYS</span>
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="unit-num" id="cd-hours">00</span>
            <span class="unit-label">HOURS</span>
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="unit-num" id="cd-mins">00</span>
            <span class="unit-label">MINUTES</span>
          </div>
          <span class="countdown-separator">:</span>
          <div class="countdown-unit">
            <span class="unit-num" id="cd-secs">00</span>
            <span class="unit-label">SECONDS</span>
          </div>
        </div>

        <!-- Playful starlight teaser container -->
        <div class="lock-teaser-tray" id="lock-teaser" aria-live="polite">
          <span class="teaser-icon">✧</span>
          <span class="teaser-text">Touch the center star.</span>
        </div>
      </div>
    `;

    // Interactive tap on sealed star
    const starBtn = document.getElementById('sealed-star-system');
    starBtn.addEventListener('click', () => this.handleStarTap());
    starBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleStarTap();
      }
    });
  }

  handleStarTap() {
    const starBtn = document.getElementById('sealed-star-system');
    if (starBtn) {
      starBtn.classList.remove('star-pulsing');
      void starBtn.offsetWidth; // trigger reflow
      starBtn.classList.add('star-pulsing');
    }

    if (window.skyAudio) window.skyAudio.playTwinkle(1046.50);

    const teaserEl = document.getElementById('lock-teaser');
    if (teaserEl && SKY_CONFIG.lockedTeasers && SKY_CONFIG.lockedTeasers.length > 0) {
      const textEl = teaserEl.querySelector('.teaser-text');
      const quote = SKY_CONFIG.lockedTeasers[this.teaserIndex % SKY_CONFIG.lockedTeasers.length];
      this.teaserIndex++;

      teaserEl.classList.remove('teaser-flash');
      void teaserEl.offsetWidth;
      if (textEl) {
        textEl.textContent = quote;
      }
      teaserEl.classList.add('teaser-flash');
    }
  }

  startCountdown() {
    this.updateClock();
    this.timerInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  updateClock() {
    if (this.isUnlocked) return;

    const remainingMs = this.unlockAtTimestamp - Date.now();

    if (remainingMs <= 0) {
      this.triggerUnlockMoment();
      return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');

    // Climax mode: final 10 seconds
    if (totalSeconds <= 10) {
      if (!this.starfield.climaxMode) {
        this.starfield.climaxMode = true;
      }
      const countdownBox = document.getElementById('countdown-display');
      const starSystem = document.getElementById('sealed-star-system');
      if (countdownBox && !countdownBox.classList.contains('countdown-climax')) {
        countdownBox.classList.add('countdown-climax');
      }
      if (starSystem && !starSystem.classList.contains('star-climax')) {
        starSystem.classList.add('star-climax');
      }
    }
  }

  bindRecheckEvents() {
    const recheck = () => {
      if (!this.isUnlocked) {
        this.updateClock();
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) recheck();
    });
    window.addEventListener('focus', recheck);
  }

  triggerUnlockMoment() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Zero out display
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minsEl) minsEl.textContent = '00';
    if (secsEl) secsEl.textContent = '00';

    // Crack the sealed ring, trigger radial light burst
    const starSystem = document.getElementById('sealed-star-system');
    if (starSystem) {
      const rect = starSystem.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.starfield.triggerRadialBurst(centerX, centerY, 64);
      starSystem.classList.add('star-burst-open');
    }

    // Play unlock chime
    if (window.skyAudio) {
      window.skyAudio.playUnlockChime();
    }

    // Crossfade out lock screen
    this.lockContainer.classList.add('lock-fade-out');

    setTimeout(() => {
      this.lockContainer.classList.add('hidden');
      this.starfield.lockedMode = false;
      this.starfield.climaxMode = false;
      // Initialize full scenes lazy
      if (this.onUnlockCallback) {
        this.onUnlockCallback();
      }
    }, 1100);
  }

  unlockImmediate() {
    this.isUnlocked = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.lockContainer.classList.add('hidden');
    this.starfield.lockedMode = false;
    this.starfield.climaxMode = false;

    // Immediately trigger lazy-init of main experience
    if (this.onUnlockCallback) {
      this.onUnlockCallback();
    }
  }
}

window.SkyLockManager = SkyLockManager;
