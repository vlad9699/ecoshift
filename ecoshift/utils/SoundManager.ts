
export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicInterval: any = null;
  private isMuted: boolean = false;
  
  // Ambience
  private ambienceNodes: AudioNode[] = [];
  private ambienceInterval: any = null;

  constructor() {
    try {
      // Initialize AudioContext (browser compatibility)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // SFX volume
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.15; // Music volume (lower than SFX)
      this.musicGain.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  private ensureContext() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- AMBIENCE ---

  public startOceanAmbience() {
    if (!this.ctx || !this.masterGain) return;
    this.ensureContext();
    this.stopAmbience();

    // 1. Underwater Rumble (Brown Noise approximation)
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Makeup gain
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter for underwater muffled sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.25; // Base ambience volume

    // Slight volume modulation (waves)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Hz
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.05; // Depth of modulation

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // LFO connects to gain.gain to modulate volume
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.start();
    lfo.start();
    
    this.ambienceNodes.push(noise, filter, gain, lfo, lfoGain);

    // 2. Schedule random whale calls
    this.playWhaleCall(); // Play one immediately
    this.ambienceInterval = setInterval(() => {
        if (Math.random() > 0.5) this.playWhaleCall();
    }, 8000 + Math.random() * 4000);
  }

  public stopAmbience() {
    if (this.ambienceInterval) {
        clearInterval(this.ambienceInterval);
        this.ambienceInterval = null;
    }
    this.ambienceNodes.forEach(node => {
        try { node.disconnect(); } catch(e) {}
        try { (node as any).stop && (node as any).stop(); } catch(e) {}
    });
    this.ambienceNodes = [];
  }

  private playWhaleCall() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const startFreq = 300 + Math.random() * 100;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq / 2, t + 1.5 + Math.random()); // Slow dive

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.5); // Slow attack
    gain.gain.linearRampToValueAtTime(0, t + 2.5); // Slow release

    // Simple Echo/Reverb using Delay
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.4;
    const delayFB = this.ctx.createGain();
    delayFB.gain.value = 0.4;

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    // Echo loop
    gain.connect(delay);
    delay.connect(delayFB);
    delayFB.connect(delay);
    delay.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 3);
  }

  // --- SYNTH INSTRUMENTS ---

  private playKick(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.5);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.musicGain) return;
    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noise.start(time);
    noise.stop(time + 0.2);
    
    // Tonal impact
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.2, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playHiHat(time: number, open: boolean = false) {
    if (!this.ctx || !this.musicGain) return;
    
    // Noise
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    const duration = open ? 0.3 : 0.05;
    const vol = open ? 0.3 : 0.2;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    
    noise.start(time);
    noise.stop(time + duration);
  }

  private playBass(time: number, pitch: number) {
    if (!this.ctx || !this.musicGain) return;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(pitch, time);
    
    // Lowpass filter envelope
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, time);
    filter.frequency.exponentialRampToValueAtTime(1000, time + 0.05); // pluck
    filter.frequency.exponentialRampToValueAtTime(300, time + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  // --- PUBLIC METHODS ---

  public startMusic() {
    if (this.musicInterval || !this.ctx) return;
    this.ensureContext();
    
    let step = 0;
    const noteTime = 0.125; // 16th notes at ~120 BPM

    // Define a simple Cyberpunk Bassline (E minor scaleish)
    const bassNotes = [
      82.41, 82.41, 0, 82.41,  // E2
      82.41, 0, 98.00, 82.41,  // G2
      73.42, 73.42, 0, 73.42,  // D2
      65.41, 65.41, 87.31, 65.41 // C2, F2
    ];

    this.musicInterval = setInterval(() => {
       const now = this.ctx!.currentTime + 0.05; // Lookahead slightly

       // Kick: Beats 0, 4, 8, 12 (Four on the floor)
       if (step % 4 === 0) this.playKick(now);

       // Snare: Beats 4, 12
       if (step % 8 === 4) this.playSnare(now);

       // HiHats: Offbeats (&& random fills)
       if (step % 2 !== 0) {
          this.playHiHat(now, Math.random() > 0.9);
       } else if (Math.random() > 0.8) {
          this.playHiHat(now, false); // Ghost note
       }

       // Bass: Driving 16th notes
       const note = bassNotes[step % 16];
       if (note > 0) {
         this.playBass(now, note);
       }

       step = (step + 1) % 16;
    }, noteTime * 1000);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, startTime: number = 0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  public playCollect() {
    if (!this.ctx) return;
    this.createOscillator('sine', 880, 0.1);
    this.createOscillator('triangle', 1760, 0.1, 0.05);
  }

  public playGemCollect() {
    if (!this.ctx) return;
    // High pitched chime
    this.createOscillator('sine', 1200, 0.1);
    this.createOscillator('sine', 1800, 0.3, 0.1);
  }

  public playEnergy() {
    if (!this.ctx) return;
    // Power up sound
    this.createOscillator('sine', 440, 0.3);
    if (this.ctx && this.masterGain) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
  }

  public playDamage() {
    if (!this.ctx) return;
    this.createOscillator('sawtooth', 100, 0.2);
    this.createOscillator('square', 50, 0.2, 0.05);
  }

  public playExplosion() {
    if (!this.ctx) return;
    if (this.masterGain) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
  }

  public playZap() {
    if (!this.ctx) return;
    if (this.masterGain) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }
  }

  public playBoost() {
    this.createOscillator('triangle', 150, 0.2);
  }
  
  public playSonar() {
    if (!this.ctx) return;
    this.createOscillator('sine', 1200, 0.5); // Ping
  }

  public playBubble() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Frequency sweep up for bubble pop sound
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playWin() {
    if (!this.ctx) return;
    this.createOscillator('square', 523.25, 0.2, 0);
    this.createOscillator('square', 659.25, 0.2, 0.2);
    this.createOscillator('square', 783.99, 0.4, 0.4);
    this.createOscillator('square', 1046.50, 0.8, 0.8);
  }

  public playLose() {
    if (!this.ctx) return;
    this.createOscillator('sawtooth', 300, 0.4, 0);
    this.createOscillator('sawtooth', 200, 0.4, 0.4);
    this.createOscillator('sawtooth', 100, 0.8, 0.8);
  }
}

export const soundManager = new SoundManager();
