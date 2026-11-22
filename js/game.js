/**
 * ============================================================================
 * INTERACTIVE EXPERIENCES & EASTER EGGS
 * ============================================================================
 * - Scene 5: Shooting Star Wish Game
 * - Scene 6: Interactive Telescope Lens & Deep Sky Secrets
 * - Easter Eggs: Konami Code, Moon Long-Press (Aurora), and "stargazer" Meteor Shower.
 */

class SkyGameManager {
  constructor(starfield) {
    this.starfield = starfield;
    this.wishesCaught = 0;
    this.maxWishes = 3;
    this.wishActive = false;
    this.shootingStarInterval = null;

    // Telescope state
    this.telescopeActive = false;
    this.discoveredSecrets = new Set();

    // Easter egg key sequences
    this.konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    this.konamiIndex = 0;
    this.keystrokeBuffer = '';

    this.bindEasterEggs();
  }

  // ==========================================================================
  // SCENE 5: MAKE A WISH (SHOOTING STAR GAME)
  // ==========================================================================

  startShootingStarGame(container, onComplete) {
    this.wishesCaught = 0;
    this.onWishesComplete = onComplete;
    this.gameContainer = container;

    // Create interactive canvas overlay for shooting star tap detection
    this.wishCanvas = document.createElement('canvas');
    this.wishCanvas.className = 'wish-canvas-overlay';
    this.wishCanvas.setAttribute('aria-label', 'Shooting stars canvas. Tap a shooting star to make a wish.');
    container.innerHTML = '';
    container.appendChild(this.wishCanvas);

    // Score / Instruction Banner
    const banner = document.createElement('div');
    banner.className = 'wish-banner';
    banner.innerHTML = `
      <div class="wish-count-pill" id="wish-counter">Wishes Caught: 0 / ${this.maxWishes}</div>
      <p class="wish-subtext">Wait for a shooting star and touch it to catch it.</p>
    `;
    container.appendChild(banner);

    // Modal dialog for entering the wish
    this.wishModal = document.createElement('div');
    this.wishModal.className = 'celestial-modal wish-modal-dialog hidden';
    this.wishModal.setAttribute('role', 'dialog');
    this.wishModal.setAttribute('aria-modal', 'true');
    this.wishModal.innerHTML = `
      <div class="modal-card wish-card">
        <button class="modal-close" aria-label="Close dialog">&times;</button>
        <div class="card-starlight-glyph">✦ 🌠 ✦</div>
        <h3 class="modal-title">Make a Wish</h3>
        <p class="modal-whisper">It stays on your device. Only you can see it.</p>
        <textarea id="wish-input" class="wish-textarea" placeholder="Whisper a wish to the cosmos..." maxlength="280"></textarea>
        <button id="wish-release-btn" class="celestial-btn primary-btn">Release Into The Sky</button>
      </div>
    `;
    container.appendChild(this.wishModal);

    const closeBtn = this.wishModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.closeWishModal());

    const releaseBtn = this.wishModal.querySelector('#wish-release-btn');
    releaseBtn.addEventListener('click', () => this.submitWish());

    // Resize wish canvas
    this.resizeWishCanvas();
    this.boundResizeWish = () => this.resizeWishCanvas();
    window.addEventListener('resize', this.boundResizeWish);

    // Spawn shooting stars regularly
    this.activeGameStars = [];
    this.spawnLoop();

    // Tap/Click hit testing
    const handlePointer = (e) => {
      const rect = this.wishCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // 48px hit target for accessibility / mobile fingers
      const hitRadius = 52;
      for (let i = this.activeGameStars.length - 1; i >= 0; i--) {
        const star = this.activeGameStars[i];
        const dist = Math.hypot(clickX - star.x, clickY - star.y);
        if (dist <= hitRadius && !star.caught) {
          star.caught = true;
          this.catchStar(star);
          break;
        }
      }
    };

    this.wishCanvas.addEventListener('pointerdown', handlePointer);
  }

  resizeWishCanvas() {
    if (!this.wishCanvas) return;
    const rect = this.gameContainer.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.wishCanvas.width = Math.floor(rect.width * dpr);
    this.wishCanvas.height = Math.floor(rect.height * dpr);
    this.wishCanvas.style.width = `${rect.width}px`;
    this.wishCanvas.style.height = `${rect.height}px`;
    const ctx = this.wishCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cw = rect.width;
    this.ch = rect.height;
  }

  spawnLoop() {
    if (!this.wishCanvas) return;

    let lastTime = performance.now();
    let spawnTimer = 0;

    const loop = (now) => {
      if (!this.wishCanvas) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      spawnTimer += dt;
      // Spawn star every 1.8 to 2.8 seconds if under limit
      if (spawnTimer > 2.2 && !this.wishModalActive && this.wishesCaught < this.maxWishes) {
        spawnTimer = 0;
        this.spawnInteractiveStar();
      }

      this.updateAndDrawGameStars(dt);
      this.gameRaf = requestAnimationFrame(loop);
    };

    this.gameRaf = requestAnimationFrame(loop);
  }

  spawnInteractiveStar() {
    if (!this.cw || !this.ch) return;

    // Angle: diagonal downward streak
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 260 + 380; // accessible speed to catch
    const startX = Math.random() * (this.cw * 0.6) + 40;
    const startY = Math.random() * (this.ch * 0.25) + 30;

    this.activeGameStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 2.2,
      maxLife: 2.2,
      caught: false,
      size: 3.2
    });
  }

  updateAndDrawGameStars(dt) {
    const ctx = this.wishCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.cw, this.ch);

    for (let i = this.activeGameStars.length - 1; i >= 0; i--) {
      const s = this.activeGameStars[i];
      if (s.caught) {
        this.activeGameStars.splice(i, 1);
        continue;
      }

      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;

      if (s.life <= 0 || s.x > this.cw + 80 || s.y > this.ch + 80) {
        this.activeGameStars.splice(i, 1);
        continue;
      }

      const alpha = Math.max(0, s.life / s.maxLife);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Glow line
      const tailX = s.x - s.vx * 0.12;
      const tailY = s.y - s.vy * 0.12;
      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.3, '#bfdbfe');
      grad.addColorStop(1, 'rgba(191, 219, 254, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = s.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Head halo
      const halo = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, 14);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      halo.addColorStop(0.5, 'rgba(191, 219, 254, 0.4)');
      halo.addColorStop(1, 'rgba(191, 219, 254, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  catchStar(star) {
    if (window.skyAudio) window.skyAudio.playShootingStarCatch();
    this.starfield.triggerRadialBurst(star.x, star.y, 36);

    this.wishModalActive = true;
    this.wishModal.classList.remove('hidden');

    const input = this.wishModal.querySelector('#wish-input');
    if (input) {
      input.value = '';
      setTimeout(() => {
        if (input && typeof input.focus === 'function') input.focus();
      }, 80);
    }
  }

  closeWishModal() {
    this.wishModal.classList.add('hidden');
    this.wishModalActive = false;
  }

  submitWish() {
    const input = this.wishModal.querySelector('#wish-input');
    const wishText = input.value.trim();

    this.closeWishModal();
    this.wishesCaught++;

    // Update counter UI
    const counter = document.getElementById('wish-counter');
    if (counter) {
      counter.textContent = `Wishes Caught: ${this.wishesCaught} / ${this.maxWishes}`;
    }

    if (window.skyAudio) window.skyAudio.playTwinkle(880);

    // Show floating ascending particle animation for the wish
    this.floatWishAscent(wishText || "A secret wish");

    if (this.wishesCaught >= this.maxWishes) {
      setTimeout(() => {
        this.showWishCompletion();
      }, 1400);
    }
  }

  floatWishAscent(text) {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-wish-text';
    floatEl.textContent = `✦ "${text}"`;
    this.gameContainer.appendChild(floatEl);

    setTimeout(() => {
      if (typeof floatEl.remove === 'function') floatEl.remove();
      else if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    }, 2800);
  }

  showWishCompletion() {
    const compBox = document.createElement('div');
    compBox.className = 'wish-completion-card';
    compBox.innerHTML = `
      <div class="completion-glyph">✨ 🌌 ✨</div>
      <h3 class="completion-title">${SKY_CONFIG.wishes.completionTitle}</h3>
      <p class="completion-text">${SKY_CONFIG.wishes.completionMessage}</p>
      <button id="wish-next-btn" class="celestial-btn primary-btn">Proceed to Next Sky →</button>
    `;
    this.gameContainer.appendChild(compBox);

    const nextBtn = compBox.querySelector('#wish-next-btn');
    nextBtn.addEventListener('click', () => {
      if (this.onWishesComplete) this.onWishesComplete();
    });
  }

  stopShootingStarGame() {
    if (this.gameRaf) {
      cancelAnimationFrame(this.gameRaf);
      this.gameRaf = null;
    }
    if (this.boundResizeWish) {
      window.removeEventListener('resize', this.boundResizeWish);
    }
    this.wishCanvas = null;
  }

  // ==========================================================================
  // SCENE 6: THE TELESCOPE LENS
  // ==========================================================================

  initTelescope(container, onComplete) {
    this.telescopeActive = true;
    this.discoveredSecrets.clear();
    container.innerHTML = '';

    // Lens cursor follower
    const lens = document.createElement('div');
    lens.className = 'telescope-lens';
    lens.id = 'telescope-lens';
    lens.innerHTML = `
      <div class="lens-crosshair-h"></div>
      <div class="lens-crosshair-v"></div>
      <div class="lens-ring"></div>
      <div class="lens-reticle-degrees">360° • F/4.5</div>
    `;
    container.appendChild(lens);

    // Tracker UI
    const tracker = document.createElement('div');
    tracker.className = 'telescope-tracker';
    tracker.innerHTML = `
      <div class="tracker-header">🔭 TELESCOPE VIEWPORT</div>
      <div class="tracker-status" id="secret-counter">Deep Sky Secrets: 0 / 3</div>
      <p class="tracker-hint">Sweep your lens over the dark sky to uncover hidden observation notes.</p>
    `;
    container.appendChild(tracker);

    // Secret hotspots in container coordinates
    const secretHotspots = [
      { id: 'sec-1', normX: 0.22, normY: 0.32, data: SKY_CONFIG.telescopeSecrets[0] },
      { id: 'sec-2', normX: 0.78, normY: 0.40, data: SKY_CONFIG.telescopeSecrets[1] },
      { id: 'sec-3', normX: 0.46, normY: 0.76, data: SKY_CONFIG.telescopeSecrets[2] }
    ];

    const secretElements = [];
    secretHotspots.forEach(spot => {
      const el = document.createElement('div');
      el.className = 'deep-sky-secret';
      el.id = spot.id;
      el.innerHTML = `
        <div class="secret-coords">${spot.data.coords}</div>
        <div class="secret-title">${spot.data.title}</div>
        <div class="secret-body">${spot.data.text}</div>
      `;
      container.appendChild(el);
      secretElements.push({ el, spot });
    });

    // Update secret positions on layout
    const updatePositions = () => {
      const rect = container.getBoundingClientRect();
      secretElements.forEach(({ el, spot }) => {
        el.style.left = `${spot.normX * rect.width}px`;
        el.style.top = `${spot.normY * rect.height}px`;
      });
    };
    updatePositions();
    window.addEventListener('resize', updatePositions);

    // Lens movement & collision detection
    const handleMove = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      lens.style.transform = `translate(${x}px, ${y}px)`;

      // Check distance to each secret hotspot
      const lensRadius = Math.min(window.innerWidth < 768 ? 90 : 130, rect.width * 0.35);

      secretElements.forEach(({ el, spot }) => {
        const spotX = spot.normX * rect.width;
        const spotY = spot.normY * rect.height;
        const dist = Math.hypot(x - spotX, y - spotY);

        if (dist < lensRadius) {
          if (!el.classList.contains('revealed')) {
            el.classList.add('revealed');
            this.discoveredSecrets.add(spot.id);

            if (window.skyAudio) window.skyAudio.playTwinkle(783.99);

            const counter = document.getElementById('secret-counter');
            if (counter) {
              counter.textContent = `Deep Sky Secrets: ${this.discoveredSecrets.size} / 3`;
            }

            if (this.discoveredSecrets.size >= 3) {
              this.showTelescopeComplete(container, onComplete);
            }
          }
        }
      });
    };

    container.addEventListener('pointermove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  showTelescopeComplete(container, onComplete) {
    if (document.getElementById('telescope-complete-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'telescope-complete-btn';
    btn.className = 'celestial-btn primary-btn telescope-complete-cta';
    btn.innerHTML = `All Observations Charted • Proceed to Closing →`;
    btn.addEventListener('click', () => {
      if (onComplete) onComplete();
    });
    container.appendChild(btn);
  }

  // ==========================================================================
  // EASTER EGGS
  // ==========================================================================

  bindEasterEggs() {
    // 1. Konami Code Listener
    window.addEventListener('keydown', (e) => {
      const key = e.key;

      // Konami match
      if (key.toLowerCase() === this.konamiSequence[this.konamiIndex].toLowerCase() || key === this.konamiSequence[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.triggerAuroraEgg();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }

      // 2. Typing "stargazer" anywhere
      this.keystrokeBuffer += key.toLowerCase();
      if (this.keystrokeBuffer.length > 20) {
        this.keystrokeBuffer = this.keystrokeBuffer.slice(-20);
      }
      if (this.keystrokeBuffer.endsWith('stargazer')) {
        this.triggerMeteorShowerEgg();
        this.keystrokeBuffer = '';
      }
    });

    // 3. Moon Icon Long-Press
    const moonIcon = document.getElementById('celestial-moon-icon');
    if (moonIcon) {
      let pressTimer = null;
      const startPress = () => {
        pressTimer = setTimeout(() => {
          this.triggerAuroraEgg();
        }, 1200);
      };
      const cancelPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };

      moonIcon.addEventListener('pointerdown', startPress);
      moonIcon.addEventListener('pointerup', cancelPress);
      moonIcon.addEventListener('pointercancel', cancelPress);
      moonIcon.addEventListener('pointerleave', cancelPress);
    }
  }

  triggerAuroraEgg() {
    const active = this.starfield.toggleAurora();
    if (window.skyAudio) window.skyAudio.playTwinkle(1046.50);
    this.showToast(active ? "🌌 Aurora Borealis Active" : "🌌 Aurora Faded");
  }

  triggerMeteorShowerEgg() {
    this.starfield.startMeteorShower(12000);
    if (window.skyAudio) window.skyAudio.playTwinkle(1318.51);
    this.showToast("🌠 Quiet Meteor Shower Passing Over");
  }

  showToast(message) {
    const existing = document.querySelector('.celestial-toast');
    if (existing) {
      if (typeof existing.remove === 'function') existing.remove();
      else if (existing.parentNode) existing.parentNode.removeChild(existing);
    }

    const toast = document.createElement('div');
    toast.className = 'celestial-toast';
    toast.textContent = message;
    const parent = document.body || document.documentElement;
    if (parent) {
      parent.appendChild(toast);
    }

    setTimeout(() => toast.classList.add('visible'), 20);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => {
        if (typeof toast.remove === 'function') toast.remove();
        else if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3200);
  }
}

window.SkyGameManager = SkyGameManager;
