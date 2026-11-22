/**
 * ============================================================================
 * INTERACTIVE EXPERIENCES & EASTER EGGS
 * ============================================================================
 * - Scene 5: Interactive Telescope Lens & Deep Sky Secrets
 * - Easter Eggs: Konami Code, Moon Long-Press (Aurora), and "stargazer" Meteor Shower.
 */

class SkyGameManager {
  constructor(starfield) {
    this.starfield = starfield;

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
  // SCENE 5: THE TELESCOPE LENS
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
