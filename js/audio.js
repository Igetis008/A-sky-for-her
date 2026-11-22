/**
 * ============================================================================
 * WEB AUDIO API SYNTHESIZER
 * ============================================================================
 * Generates ambient pads, starlight twinkles, and celestial chimes entirely
 * in-browser without external audio files.
 * OFF by default, respects user gesture requirements and accessibility.
 */

class SkyAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.padGain = null;
    this.masterGain = null;
    this.padOscillators = [];
    this.isPadRunning = false;
    this.initialized = false;
  }

  /**
   * Initializes the AudioContext upon first explicit user gesture.
   */
  init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn("Web Audio API not supported in this browser.");
        return;
      }
      this.ctx = new AudioCtx();

      // Master output node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn("Audio initialization prevented:", e);
    }
  }

  /**
   * Resumes AudioContext if suspended.
   */
  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Toggle mute state.
   */
  toggle() {
    this.ensureContext();
    if (!this.ctx) return false;

    this.isMuted = !this.isMuted;

    if (this.masterGain) {
      const targetGain = this.isMuted ? 0 : 0.6;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);
    }

    if (!this.isMuted && !this.isPadRunning) {
      this.startAmbientPad();
    }

    return !this.isMuted;
  }

  /**
   * Starts warm, generative ambient space pad.
   */
  startAmbientPad() {
    if (!this.ctx || this.isPadRunning) return;
    this.isPadRunning = true;

    // Frequencies: E3, B3, G#4, D#5 (Dreamlike E Maj 7 / Space pad)
    const freqs = [164.81, 246.94, 415.30, 622.25];

    // Filter node for warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Filter LFO to create a slow celestial "breathing" effect
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Pad Gain
    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.padGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 3.0); // Gentle 3-second fade in

    filter.connect(this.padGain);
    this.padGain.connect(this.masterGain);

    this.padOscillators = [];

    freqs.forEach(freq => {
      // Two detuned oscillators per pitch for rich shimmering chorusing
      [-4, 4].forEach(detuneCents => {
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime(detuneCents, this.ctx.currentTime);
        osc.connect(filter);
        osc.start();
        this.padOscillators.push(osc);
      });
    });
  }

  /**
   * Plays a delicate high-pitched twinkle chime when a star is tapped.
   */
  playTwinkle(frequency = null) {
    if (!this.ctx || this.isMuted) return;

    // Pentatonic frequencies if none provided
    const pentatonic = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const pitch = frequency || pentatonic[Math.floor(Math.random() * pentatonic.length)];

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const bandpass = this.ctx.createBiquadFilter();

    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(pitch, now);
    bandpass.Q.setValueAtTime(4, now);

    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, now);

    // Fast bell attack, long exponential decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  /**
   * Plays an ascending celestial pentatonic arpeggio when all stars are chartered.
   */
  playConstellationComplete() {
    if (!this.ctx || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTwinkle(freq);
      }, index * 180);
    });
  }

  /**
   * Plays a celebratory cosmic sweep and glass chime when countdown unlocks.
   */
  playUnlockChime() {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Resonant sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 1.5);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.3);

    // Harmonic chimes
    [523.25, 659.25, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTwinkle(freq * 1.5);
      }, 400 + idx * 200);
    });
  }

  /**
   * Sound effect when a shooting star is caught.
   */
  playShootingStarCatch() {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.85);
  }
}

// Global audio engine singleton
window.skyAudio = new SkyAudioEngine();
