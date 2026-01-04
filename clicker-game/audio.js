class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.isMuted = false;
        this.bgmOscs = [];
        this.isPlayingBgm = false;
    }

    // Helper: Create an oscillator with envelope
    playTone(freq, type, duration, startTime = 0, vol = 0.1) {
        if (this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playHit() {
        // Lighter, snappier sound (High pitch short decay)
        this.playTone(400 + Math.random() * 100, 'triangle', 0.05);
        this.playTone(800, 'square', 0.03, 0.01, 0.05);
    }

    playKill() {
        // Explosion/Crunch sound
        this.playTone(100, 'sawtooth', 0.3);
        this.playTone(50, 'square', 0.4, 0.1);
        this.playTone(30, 'sawtooth', 0.5, 0.2);
    }

    playLevelUp() {
        // Happy Arpeggio
        const base = 440; // A4
        this.playTone(base, 'square', 0.2, 0);
        this.playTone(base * 1.25, 'square', 0.2, 0.1); // C#
        this.playTone(base * 1.5, 'square', 0.4, 0.2);  // E
        this.playTone(base * 2, 'square', 0.6, 0.3);    // A5
    }

    playSelect() {
        this.playTone(880, 'sine', 0.1);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

    // --- Advanced BGM Sequencer ---
    startBGM() {
        if (this.isMuted || this.isPlayingBgm) return;
        this.isPlayingBgm = true;
        this.step = 0;
        this.runStep();
    }

    stopBGM() {
        this.isPlayingBgm = false;
        // Logic to stop handled by loop condition in runSequence mainly
    }

    runStep() {
        if (!this.isPlayingBgm) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const time = this.ctx.currentTime;
        // 16th note step
        const stepTime = 0.15;

        // Melody Pattern (32 steps)
        // Key: C Minor Pentatonic-ish for battle feel
        // C4=261.6, Eb4=311.1, F4=349.2, G4=392.0, Bb4=466.2, C5=523.2
        const melody = [
            261.6, 0, 261.6, 311.1, 349.2, 0, 311.1, 0,
            261.6, 0, 261.6, 392.0, 349.2, 0, 311.1, 0,
            261.6, 0, 261.6, 311.1, 349.2, 0, 392.0, 466.2,
            523.2, 0, 466.2, 0, 392.0, 349.2, 311.1, 392.0
        ];

        // Rhythm Pattern (1 = Kick, 2 = Snare)
        const rhythm = [
            1, 0, 0, 0, 2, 0, 0, 1,
            1, 0, 0, 0, 2, 0, 1, 0,
            1, 0, 0, 0, 2, 0, 0, 1,
            1, 0, 1, 0, 2, 0, 2, 0
        ];

        // 1. Play Melody Note
        const freq = melody[this.step % melody.length];
        if (freq > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square'; // NES-like square wave
            osc.frequency.setValueAtTime(freq, time);

            // Envelope
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + 0.12);
        }

        // 2. Play Rhythm Tone
        const beat = rhythm[this.step % rhythm.length];
        if (beat === 1) { // Kick
            this.playTone(100, 'sine', 0.1, 0, 0.2); // Low Sine
        } else if (beat === 2) { // Snare/Hat
            this.playTone(Math.random() * 1000 + 1000, 'sawtooth', 0.05, 0, 0.05); // High noise-ish
        }

        this.step++;
        setTimeout(() => this.runStep(), stepTime * 1000);
    }
}

const audio = new AudioController();
