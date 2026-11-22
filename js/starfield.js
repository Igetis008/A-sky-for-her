/**
 * ============================================================================
 * CANVAS PARALLAX STARFIELD & CELESTIAL EFFECTS
 * ============================================================================
 * High-performance 60fps multi-layer parallax night sky.
 * Handles Retina/High-DPI scaling, device tilt, mouse parallax, tab visibility,
 * prefers-reduced-motion, aurora curtains, meteor showers, and unlock bursts.
 */

class Starfield {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.stars = [];
    this.shootingStars = [];
    this.auroraActive = false;
    this.auroraTime = 0;
    this.meteorShowerActive = false;
    this.meteorShowerTimer = null;

    // Speeds & Modes
    this.speedMultiplier = 1.0;
    this.lockedMode = false;
    this.climaxMode = false;
    this.prefersReducedMotion = false;

    // Parallax tracking
    this.mouseTarget = { x: 0, y: 0 };
    this.mouseCurrent = { x: 0, y: 0 };
    this.tiltTarget = { x: 0, y: 0 };

    this.isRunning = false;
    this.rafId = null;

    // Burst particles for unlock moment
    this.burstParticles = [];

    this.init();
  }

  init() {
    this.checkReducedMotion();
    this.resize();
    this.generateStars();
    this.bindEvents();
    this.start();
  }

  checkReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mq.matches;
    mq.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Regenerate stars on significant resize
    if (this.stars.length === 0) {
      this.generateStars();
    }
  }

  generateStars() {
    this.stars = [];
    // Dynamic star count tuned for 60fps on mobile
    const area = this.width * this.height;
    const baseCount = Math.min(Math.floor(area / 3200), 380);

    // Star color palette (Warm gold, pale cyan, crisp white, soft amber)
    const colors = [
      '#ffffff', '#ffffff', '#e2e8f0',
      '#bfdbfe', '#93c5fd', // Pale blue / cyan
      '#fef08a', '#fde047', // Warm gold
      '#fed7aa'            // Soft amber
    ];

    // Layer 1: Distant background stars (60%)
    const l1Count = Math.floor(baseCount * 0.6);
    for (let i = 0; i < l1Count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 0.75 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 1, // Slowest parallax
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Layer 2: Mid-field stars (28%)
    const l2Count = Math.floor(baseCount * 0.28);
    for (let i = 0; i < l2Count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.1 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Layer 3: Foreground luminous stars (12%)
    const l3Count = Math.floor(baseCount * 0.12);
    for (let i = 0; i < l3Count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.4,
        baseAlpha: Math.random() * 0.8 + 0.4,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        hasSpikes: Math.random() > 0.4
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    }, { passive: true });

    // Mouse parallax
    window.addEventListener('mousemove', (e) => {
      if (this.prefersReducedMotion) return;
      const normX = (e.clientX / this.width - 0.5) * 2;
      const normY = (e.clientY / this.height - 0.5) * 2;
      this.mouseTarget.x = normX * 24;
      this.mouseTarget.y = normY * 24;
    }, { passive: true });

    // Mobile device tilt parallax
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (this.prefersReducedMotion || !e.gamma || !e.beta) return;
        // Clamp gamma (-30 to 30) and beta (-30 to 30)
        const g = Math.max(-30, Math.min(30, e.gamma)) / 30;
        const b = Math.max(-30, Math.min(30, e.beta - 40)) / 30;
        this.tiltTarget.x = g * 20;
        this.tiltTarget.y = b * 20;
      }, { passive: true });
    }

    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (time) => {
      if (!this.isRunning) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      this.update(dt);
      this.render();

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  update(dt) {
    // Smooth lerp mouse parallax
    const targetX = this.mouseTarget.x + this.tiltTarget.x;
    const targetY = this.mouseTarget.y + this.tiltTarget.y;
    this.mouseCurrent.x += (targetX - this.mouseCurrent.x) * 0.05;
    this.mouseCurrent.y += (targetY - this.mouseCurrent.y) * 0.05;

    // Effective speed
    let speed = this.speedMultiplier;
    if (this.lockedMode) speed *= 0.35;
    if (this.climaxMode) speed *= 2.8;
    if (this.prefersReducedMotion) speed = 0.05;

    // Drift stars
    const driftY = speed * 8 * dt;

    this.stars.forEach(star => {
      star.y += driftY * (star.layer * 0.4);
      if (star.y > this.height + 10) {
        star.y = -10;
        star.x = Math.random() * this.width;
      }

      // Twinkle phase
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.25;
      star.alpha = Math.max(0.1, Math.min(1.0, star.baseAlpha + twinkle));
    });

    // Update shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      s.alpha = Math.max(0, s.life / s.maxLife);

      if (s.life <= 0 || s.x < -100 || s.x > this.width + 100 || s.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Update burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= dt * 0.7;
      if (p.alpha <= 0) {
        this.burstParticles.splice(i, 1);
      }
    }

    // Aurora update
    if (this.auroraActive) {
      this.auroraTime += dt * 0.5;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle cosmic background radial glows
    this.renderNebula();

    // Render Aurora if active
    if (this.auroraActive) {
      this.renderAurora();
    }

    // Render Stars with Parallax
    const pX = this.prefersReducedMotion ? 0 : this.mouseCurrent.x;
    const pY = this.prefersReducedMotion ? 0 : this.mouseCurrent.y;

    this.stars.forEach(star => {
      const layerMult = star.layer === 1 ? 0.2 : star.layer === 2 ? 0.6 : 1.1;
      const x = star.x + pX * layerMult;
      const y = star.y + pY * layerMult;

      this.ctx.save();
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fillStyle = star.color;

      this.ctx.beginPath();
      this.ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Subtle diffraction spike glow for foreground bright stars
      if (star.hasSpikes && star.layer === 3) {
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x - star.radius * 3, y);
        this.ctx.lineTo(x + star.radius * 3, y);
        this.ctx.moveTo(x, y - star.radius * 3);
        this.ctx.lineTo(x, y + star.radius * 3);
        this.ctx.stroke();
      }

      this.ctx.restore();
    });

    // Render Shooting stars
    this.renderShootingStars();

    // Render Burst particles
    this.renderBurstParticles();
  }

  renderNebula() {
    // Soft deep-space nebula glow
    const g1 = this.ctx.createRadialGradient(
      this.width * 0.3, this.height * 0.25, 10,
      this.width * 0.3, this.height * 0.25, this.width * 0.7
    );
    g1.addColorStop(0, 'rgba(45, 27, 105, 0.16)');
    g1.addColorStop(1, 'rgba(5, 7, 15, 0)');

    const g2 = this.ctx.createRadialGradient(
      this.width * 0.75, this.height * 0.8, 10,
      this.width * 0.75, this.height * 0.8, this.width * 0.6
    );
    g2.addColorStop(0, 'rgba(15, 42, 91, 0.18)');
    g2.addColorStop(1, 'rgba(5, 7, 15, 0)');

    this.ctx.fillStyle = g1;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = g2;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  renderAurora() {
    this.ctx.save();
    const t = this.auroraTime;
    const colors = [
      { r: 46, g: 204, b: 113, a: 0.15 }, // Emerald green
      { r: 52, g: 152, b: 219, a: 0.12 }, // Cyan blue
      { r: 155, g: 89, b: 182, a: 0.10 }  // Violet
    ];

    colors.forEach((col, index) => {
      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.65);
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      grad.addColorStop(0.4, `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`);
      grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height * 0.5);

      const segments = 16;
      const step = this.width / segments;
      for (let i = 0; i <= segments; i++) {
        const x = i * step;
        const offset = Math.sin(t + i * 0.4 + index) * 55 + Math.cos(t * 0.6 + i * 0.3) * 35;
        const y = this.height * 0.28 + offset;
        if (i === 0) this.ctx.lineTo(x, y);
        else this.ctx.lineTo(x, y);
      }

      this.ctx.lineTo(this.width, this.height * 0.65);
      this.ctx.lineTo(0, this.height * 0.65);
      this.ctx.closePath();
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  renderShootingStars() {
    this.shootingStars.forEach(s => {
      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;

      const grad = this.ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.08, s.y - s.vy * 0.08);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#bfdbfe');
      grad.addColorStop(1, 'rgba(191, 219, 254, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = s.size || 2.2;
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - s.vx * 0.08, s.y - s.vy * 0.08);
      this.ctx.stroke();

      // Glowing head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, (s.size || 2) * 0.9, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  renderBurstParticles() {
    if (this.burstParticles.length === 0) return;
    this.ctx.save();
    this.burstParticles.forEach(p => {
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  /**
   * Spawns a shooting star. If isInteractive is true, it can be caught.
   */
  spawnShootingStar(options = {}) {
    const angle = options.angle !== undefined ? options.angle : (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
    const speed = options.speed || (Math.random() * 320 + 480);
    const life = options.life || (Math.random() * 0.6 + 0.8);

    const startX = options.x !== undefined ? options.x : Math.random() * (this.width * 0.8) + this.width * 0.1;
    const startY = options.y !== undefined ? options.y : Math.random() * (this.height * 0.3) + 20;

    const star = {
      id: 'shooting-' + Date.now() + '-' + Math.random(),
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: life,
      maxLife: life,
      alpha: 1,
      size: options.size || (Math.random() * 1.5 + 2.0),
      isInteractive: !!options.isInteractive,
      caught: false
    };

    this.shootingStars.push(star);
    return star;
  }

  /**
   * Explodes particles from coordinate (used when unlocking or catching star).
   */
  triggerRadialBurst(x, y, count = 48) {
    if (this.prefersReducedMotion) return;
    const colors = ['#fde047', '#bfdbfe', '#ffffff', '#e0e7ff', '#fcd34d'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
      const speed = Math.random() * 260 + 100;
      this.burstParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.2 + 1.0,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  /**
   * Triggers a meteor shower (Easter egg "stargazer").
   */
  startMeteorShower(durationMs = 12000) {
    if (this.meteorShowerActive) return;
    this.meteorShowerActive = true;

    const interval = setInterval(() => {
      this.spawnShootingStar({
        speed: Math.random() * 400 + 550,
        size: Math.random() * 2.5 + 1.5
      });
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      this.meteorShowerActive = false;
    }, durationMs);
  }

  toggleAurora() {
    this.auroraActive = !this.auroraActive;
    return this.auroraActive;
  }
}

// Attach to window
window.Starfield = Starfield;
