/**
 * Joyce's Mini Mart - Offline Web Audio Synthesizer
 * Zero external audio files or network requests.
 * Uses Web Audio API to synthesize cute music-box BGM tracks and SFX,
 * plus natural offline English SpeechSynthesis.
 */

export interface BgmTrack {
  id: string;
  name: string;
  emoji: string;
  tempo: number;
  waveform: OscillatorType;
  bassWaveform: OscillatorType;
  melody: (number | null)[];
  bassline: (number | null)[];
}

const NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  Fs5: 739.99,
  G5: 783.99,
  A5: 880.0,
  Bb5: 932.33,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
} as const;

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'sunny-mart',
    name: 'Sunny Mini Mart',
    emoji: '☀️',
    tempo: 134,
    waveform: 'triangle',
    bassWaveform: 'sine',
    melody: [
      NOTES.C5, NOTES.E5, NOTES.G5, NOTES.E5, NOTES.A5, NOTES.G5, NOTES.E5, null,
      NOTES.F5, NOTES.A5, NOTES.C6, NOTES.A5, NOTES.G5, NOTES.E5, NOTES.D5, null,
      NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6, NOTES.D5, NOTES.F5, NOTES.A5, null,
      NOTES.G5, NOTES.E5, NOTES.C5, NOTES.D5, NOTES.C5, null, null, null,
    ],
    bassline: [
      NOTES.C4, null, NOTES.G4, null, NOTES.F4, null, NOTES.C4, null,
      NOTES.F4, null, NOTES.C4, null, NOTES.G4, null, NOTES.G4, null,
      NOTES.C4, null, NOTES.E4, null, NOTES.F4, null, NOTES.D4, null,
      NOTES.G4, null, NOTES.G4, null, NOTES.C4, null, null, null,
    ],
  },
  {
    id: 'strawberry-picnic',
    name: 'Strawberry Picnic',
    emoji: '🍓',
    tempo: 120,
    waveform: 'sine',
    bassWaveform: 'triangle',
    melody: [
      NOTES.F5, NOTES.A5, NOTES.C6, NOTES.A5, NOTES.Bb5, NOTES.G5, NOTES.E5, null,
      NOTES.F5, NOTES.G5, NOTES.A5, NOTES.F5, NOTES.G5, NOTES.E5, NOTES.C5, null,
      NOTES.D5, NOTES.F5, NOTES.Bb5, NOTES.A5, NOTES.G5, NOTES.E5, NOTES.C5, null,
      NOTES.F5, NOTES.A5, NOTES.G5, NOTES.E5, NOTES.F5, null, null, null,
    ],
    bassline: [
      NOTES.F4, null, NOTES.C4, null, NOTES.G4, null, NOTES.C4, null,
      NOTES.F4, null, NOTES.D4, null, NOTES.C4, null, NOTES.G4, null,
      NOTES.Bb4, null, NOTES.F4, null, NOTES.C4, null, NOTES.G4, null,
      NOTES.F4, null, NOTES.C4, null, NOTES.F4, null, null, null,
    ],
  },
  {
    id: 'twinkle-bakery',
    name: 'Twinkle Bakery',
    emoji: '🧁',
    tempo: 110,
    waveform: 'sine',
    bassWaveform: 'sine',
    melody: [
      NOTES.G5, NOTES.E5, NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6, NOTES.B5, null,
      NOTES.A5, NOTES.F5, NOTES.D5, NOTES.F5, NOTES.A5, NOTES.G5, NOTES.E5, null,
      NOTES.C5, NOTES.D5, NOTES.E5, NOTES.G5, NOTES.F5, NOTES.D5, NOTES.B4, null,
      NOTES.C5, NOTES.E5, NOTES.G5, NOTES.E5, NOTES.C5, null, null, null,
    ],
    bassline: [
      NOTES.C4, null, NOTES.E4, null, NOTES.G4, null, NOTES.E4, null,
      NOTES.F4, null, NOTES.A4, null, NOTES.C4, null, NOTES.G4, null,
      NOTES.A4, null, NOTES.E4, null, NOTES.D4, null, NOTES.G4, null,
      NOTES.C4, null, NOTES.G4, null, NOTES.C4, null, null, null,
    ],
  },
  {
    id: 'candy-parade',
    name: 'Candy Parade',
    emoji: '🍬',
    tempo: 146,
    waveform: 'triangle',
    bassWaveform: 'triangle',
    melody: [
      NOTES.G5, NOTES.G5, NOTES.A5, NOTES.B5, NOTES.D6, NOTES.B5, NOTES.G5, null,
      NOTES.E5, NOTES.Fs5, NOTES.G5, NOTES.A5, NOTES.B5, NOTES.A5, NOTES.G5, null,
      NOTES.C6, NOTES.B5, NOTES.A5, NOTES.G5, NOTES.Fs5, NOTES.G5, NOTES.A5, null,
      NOTES.B5, NOTES.A5, NOTES.G5, NOTES.Fs5, NOTES.G5, null, null, null,
    ],
    bassline: [
      NOTES.G4, null, NOTES.D4, null, NOTES.G4, null, NOTES.B4, null,
      NOTES.C4, null, NOTES.G4, null, NOTES.G4, null, NOTES.D4, null,
      NOTES.C4, null, NOTES.E4, null, NOTES.D4, null, NOTES.Fs4, null,
      NOTES.G4, null, NOTES.D4, null, NOTES.G4, null, null, null,
    ],
  },
  {
    id: 'rainbow-cloud',
    name: 'Rainbow Cloud',
    emoji: '🌈',
    tempo: 126,
    waveform: 'sine',
    bassWaveform: 'sine',
    melody: [
      NOTES.E5, NOTES.G5, NOTES.A5, NOTES.C6, NOTES.A5, NOTES.G5, NOTES.E5, null,
      NOTES.D5, NOTES.E5, NOTES.G5, NOTES.A5, NOTES.G5, NOTES.E5, NOTES.D5, null,
      NOTES.C5, NOTES.E5, NOTES.G5, NOTES.A5, NOTES.C6, NOTES.D6, NOTES.C6, null,
      NOTES.A5, NOTES.G5, NOTES.E5, NOTES.D5, NOTES.C5, null, null, null,
    ],
    bassline: [
      NOTES.C4, null, NOTES.G4, null, NOTES.A4, null, NOTES.E4, null,
      NOTES.G4, null, NOTES.D4, null, NOTES.E4, null, NOTES.G4, null,
      NOTES.F4, null, NOTES.C4, null, NOTES.G4, null, NOTES.E4, null,
      NOTES.F4, null, NOTES.G4, null, NOTES.C4, null, null, null,
    ],
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private volume = 0.6;
  private isMuted = false;
  private bgmStep = 0;
  private currentTrackId = BGM_TRACKS[0].id;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const refreshVoices = () => {
        try {
          this.cachedVoices = window.speechSynthesis.getVoices?.() || [];
        } catch {
          this.cachedVoices = [];
        }
      };
      refreshVoices();
      try {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      } catch {
        // Ignore if onvoiceschanged is unsupported
      }
    }
  }

  private getCurrentTrack(): BgmTrack {
    return (
      BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0]
    );
  }

  public getBgmTracks(): BgmTrack[] {
    return BGM_TRACKS;
  }

  public getCurrentTrackId(): string {
    return this.currentTrackId;
  }

  public setBgmTrack(trackId: string) {
    const exists = BGM_TRACKS.some((t) => t.id === trackId);
    if (!exists) return;
    this.currentTrackId = trackId;
    this.bgmStep = 0;
    if (this.isBgmPlaying) {
      if (this.bgmTimer) {
        window.clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
      this.scheduleNextBgmBeat();
    } else {
      this.startBgm();
    }
  }

  private initContext() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.bgmGain = this.ctx.createGain();
          this.sfxGain = this.ctx.createGain();

          this.bgmGain.connect(this.ctx.destination);
          this.sfxGain.connect(this.ctx.destination);

          this.updateGains();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore audio initialization failures in restricted environments
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    this.updateGains();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateGains();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private updateGains() {
    const effectiveVol = this.isMuted ? 0 : this.volume;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(effectiveVol * 0.16, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(effectiveVol * 0.45, this.ctx.currentTime);
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.initContext();
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleNextBgmBeat();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  private scheduleNextBgmBeat() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    try {
      const track = this.getCurrentTrack();
      const stepDuration = 60 / track.tempo / 2; // eighth notes

      const melodyFreq = track.melody[this.bgmStep % track.melody.length];
      const bassFreq = track.bassline[this.bgmStep % track.bassline.length];

      const now = this.ctx.currentTime;

      // Play melody note (warm music-box tone + gentle sparkle octave shimmer)
      if (melodyFreq) {
        const osc = this.ctx.createOscillator();
        const shimmer = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const shimmerGain = this.ctx.createGain();

        osc.type = track.waveform;
        osc.frequency.setValueAtTime(melodyFreq, now);

        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(melodyFreq * 2, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.55);

        shimmerGain.gain.setValueAtTime(0.001, now);
        shimmerGain.gain.exponentialRampToValueAtTime(0.07, now + 0.015);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

        osc.connect(noteGain);
        shimmer.connect(shimmerGain);
        noteGain.connect(this.bgmGain);
        shimmerGain.connect(this.bgmGain);

        osc.start(now);
        shimmer.start(now);
        osc.stop(now + stepDuration * 1.6);
        shimmer.stop(now + stepDuration);
      }

      // Play bass / accompaniment note
      if (bassFreq) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = track.bassWaveform;
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.8);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration * 1.9);
      }

      this.bgmStep = (this.bgmStep + 1) % track.melody.length;

      this.bgmTimer = window.setTimeout(() => {
        this.scheduleNextBgmBeat();
      }, stepDuration * 1000);
    } catch {
      this.stopBgm();
    }
  }

  /**
   * Sparkling ascending chime when spelling is correct
   */
  public playChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const chimeNotes = [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6];
      const now = this.ctx.currentTime;

      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        const harm = this.ctx.createOscillator();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, now + idx * 0.09);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.4, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.09);
        harm.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.4);
        harm.stop(now + idx * 0.09 + 0.4);
      });
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Gentle, cute wobble / boing when wrong
   */
  public playWobble() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Friendly two-tone descending "uh-oh" wrong-answer SFX
   */
  public playWrong() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { start: 330, end: 260, offset: 0, dur: 0.16 },
        { start: 245, end: 155, offset: 0.17, dur: 0.28 },
      ];

      notes.forEach(({ start, end, offset, dur }) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(start, now + offset);
        osc.frequency.exponentialRampToValueAtTime(end, now + offset + dur);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.42, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + offset);
        osc.stop(now + offset + dur + 0.03);
      });
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Cheerful hand-clapping / applause SFX synthesized via filtered noise bursts
   */
  public playClap() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const sampleRate = this.ctx.sampleRate;
      const clapOffsets = [0.02, 0.16, 0.3, 0.44, 0.58, 0.72, 0.87];

      clapOffsets.forEach((offset, idx) => {
        if (!this.ctx || !this.sfxGain) return;

        const duration = 0.11;
        const bufferSize = Math.floor(sampleRate * duration);
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.028));
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        // Slight pitch variation across claps for natural applause texture
        bandpass.frequency.setValueAtTime(1350 + (idx % 3) * 220, now + offset);
        bandpass.Q.setValueAtTime(1.6, now + offset);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.95, now + offset + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + duration);

        source.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(this.sfxGain);

        source.start(now + offset);
        source.stop(now + offset + duration);
      });
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Soft cute bubble pop for clicks & counter adjustments
   */
  public playPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Cash register / coin drop sound when buying items
   */
  public playBuy() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain2.gain.setValueAtTime(0.35, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.5);
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Phone marimba notification sound when Mom texts
   */
  public playPhoneRing() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const ringNotes = [NOTES.E5, NOTES.G5, NOTES.B4];
      const now = this.ctx.currentTime;

      ringNotes.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.12 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch {
      // Ignore SFX audio failure
    }
  }

  /**
   * Celebratory victory fanfare when Mom's entire list is finished
   */
  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const fanfare = [
        { f: NOTES.C5, d: 0.12 },
        { f: NOTES.C5, d: 0.12 },
        { f: NOTES.C5, d: 0.12 },
        { f: NOTES.G5, d: 0.35 },
        { f: NOTES.E5, d: 0.15 },
        { f: NOTES.G5, d: 0.15 },
        { f: NOTES.C6, d: 0.6 },
      ];

      let t = this.ctx.currentTime;
      fanfare.forEach((n) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + n.d + 0.05);

        t += n.d + 0.03;
      });
    } catch {
      // Ignore SFX audio failure
    }
  }

  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoiceURI: string | null = (() => {
    try {
      return typeof window !== 'undefined'
        ? localStorage.getItem('joyce_minimart_voice_uri')
        : null;
    } catch {
      return null;
    }
  })();
  private speechQueueTimer: number | null = null;

  private refreshVoicesList(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
      const list = window.speechSynthesis.getVoices?.() || [];
      if (list.length > 0) {
        this.cachedVoices = list;
      }
      return this.cachedVoices;
    } catch {
      return [];
    }
  }

  /**
   * Returns available English voices sorted from most natural to least natural
   */
  public getEnglishVoices(): SpeechSynthesisVoice[] {
    const voices = this.refreshVoicesList();
    return voices
      .filter((v) => v.lang.toLowerCase().startsWith('en'))
      .sort((a, b) => this.scoreEnglishVoice(b) - this.scoreEnglishVoice(a));
  }

  public getPreferredVoiceURI(): string | null {
    return this.preferredVoiceURI;
  }

  public setPreferredVoiceURI(uri: string | null) {
    this.preferredVoiceURI = uri;
    try {
      if (typeof window !== 'undefined') {
        if (uri) {
          localStorage.setItem('joyce_minimart_voice_uri', uri);
        } else {
          localStorage.removeItem('joyce_minimart_voice_uri');
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private scoreEnglishVoice(v: SpeechSynthesisVoice): number {
    const lang = v.lang.toLowerCase().replace('_', '-');
    if (!lang.startsWith('en')) return -200;

    let score = 0;
    // Strongly prioritize British English (Anh-Anh / en-GB) accent
    if (lang === 'en-gb') score += 120;
    else if (lang.startsWith('en-au') || lang.startsWith('en-nz') || lang.startsWith('en-ie')) score += 45;
    else if (lang === 'en-us') score += 20;
    else score += 10;

    const name = v.name.toLowerCase();

    // Highest priority: natural / neural / studio / enhanced voices
    if (/natural|neural|online \(natural\)|premium|enhanced|studio/.test(name)) {
      score += 95;
    }

    // Top-tier natural British English voices (Chrome, Edge, macOS/iOS)
    if (/google uk english female/.test(name)) score += 100;
    else if (/\b(libby|sonia|maisie|mia|serena|kate|martha|stephanie)\b/.test(name)) score += 90;
    else if (/google uk english male|\b(daniel|oliver|ryan|arthur|alfie|thomas|george|hazel)\b/.test(name)) score += 80;
    else if (/aria|jenny|ava|emma|allison|samantha|google us english/.test(name)) score += 55;
    else if (/female|victoria|karen|tessa|moira|susan|zira/.test(name)) score += 30;

    // Penalize legacy robotic or novelty voices
    if (/espeak|mbrola|festival|whisper|zarvox|trinoids|fred|albert|junior|bad news|cello/.test(name)) {
      score -= 150;
    }

    if (!v.localService) score += 15;
    return score;
  }

  /**
   * Pick the most natural-sounding English voice available in the browser
   */
  public getBestEnglishVoice(): SpeechSynthesisVoice | null {
    const voices = this.refreshVoicesList();
    if (voices.length === 0) return null;

    if (this.preferredVoiceURI) {
      const explicit = voices.find((v) => v.voiceURI === this.preferredVoiceURI);
      if (explicit) return explicit;
    }

    const english = voices
      .filter((v) => v.lang.toLowerCase().startsWith('en'))
      .sort((a, b) => this.scoreEnglishVoice(b) - this.scoreEnglishVoice(a));

    return english.length > 0 && this.scoreEnglishVoice(english[0]) > -60
      ? english[0]
      : null;
  }

  private queueUtterance(utterance: SpeechSynthesisUtterance) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.speechQueueTimer) {
      window.clearTimeout(this.speechQueueTimer);
      this.speechQueueTimer = null;
    }

    const wasBusy =
      window.speechSynthesis.speaking || window.speechSynthesis.pending;
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    this.currentUtterance = utterance;

    // Small delay after cancel() prevents Chrome/Safari from clipping the first syllable or dropping voice assignment
    if (wasBusy) {
      this.speechQueueTimer = window.setTimeout(() => {
        this.speechQueueTimer = null;
        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore
        }
      }, 45);
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Natural English pronunciation for vocabulary & shopping list words
   */
  public speakWord(word: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    try {
      const raw = word.trim();
      if (!raw) {
        onEnd?.();
        return;
      }
      // Normalize casing so uppercase words (e.g. "PEN") are spoken as words, never spelled letter-by-letter
      const normalized = raw
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const utterance = new SpeechSynthesisUtterance(normalized);
      const voice = this.getBestEnglishVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'en-GB';
      }

      // Natural British English clarity & student-friendly pace
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0.2, Math.min(1, this.volume));

      utterance.onend = () => {
        if (this.currentUtterance === utterance) this.currentUtterance = null;
        try {
          onEnd?.();
        } catch {
          // Ignore callback error
        }
      };
      utterance.onerror = () => {
        if (this.currentUtterance === utterance) this.currentUtterance = null;
        try {
          onEnd?.();
        } catch {
          // Ignore callback error
        }
      };

      this.queueUtterance(utterance);
    } catch {
      onEnd?.();
    }
  }

  /**
   * Stop any currently playing SpeechSynthesis utterance
   */
  public stopSpeech() {
    if (this.speechQueueTimer) {
      window.clearTimeout(this.speechQueueTimer);
      this.speechQueueTimer = null;
    }
    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Speaks Mom's chat message in a warm, natural English voice on tap
   */
  public speakMomMessage(
    text: string,
    onEnd?: () => void,
    onWordBoundary?: (charIndex: number) => void
  ) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    try {
      // Strip emojis so speech synthesis doesn't read emoji descriptions
      const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = this.getBestEnglishVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'en-GB';
      }

      // Natural British conversational pacing and pitch
      utterance.rate = 0.93;
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0.2, Math.min(1, this.volume));

      if (onWordBoundary) {
        utterance.onboundary = (event) => {
          try {
            if (event.name === 'word' || typeof event.charIndex === 'number') {
              onWordBoundary(event.charIndex);
            }
          } catch {
            // Ignore boundary callback error
          }
        };
      }

      utterance.onend = () => {
        if (this.currentUtterance === utterance) this.currentUtterance = null;
        try {
          onEnd?.();
        } catch {
          // Ignore callback error
        }
      };
      utterance.onerror = () => {
        if (this.currentUtterance === utterance) this.currentUtterance = null;
        try {
          onEnd?.();
        } catch {
          // Ignore callback error
        }
      };

      this.queueUtterance(utterance);
    } catch {
      onEnd?.();
    }
  }
}

export const sound = new SoundEngine();
