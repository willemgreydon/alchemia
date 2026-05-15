// ALCHEMIA — main app
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const DB = window.ALCHEMIA_DB;
const FX = window.ALCHEMIA_FX;
const ICONS = window.ALCHEMIA_ICONS;

// ============ small utilities ============
function uid() { return Math.random().toString(36).slice(2, 9); }

function useAmbient(canvasRef, particleRef) {
  const fxRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !particleRef.current) return;
    const ambient = FX.initAmbient(canvasRef.current);
    const particles = FX.initParticles(particleRef.current);
    fxRef.current = { ambient, particles };
  }, []);
  return fxRef;
}

// ============ audio (synthesized) ============
// Tonal center: A minor / A Dorian. All melodic events resolve to or orbit A.
// A3=220, E4=329.63, A4=440, C5=523.25, E5=659.25, G5=783.99, A5=880
// Waveform palette: square=warm lead, triangle=soft bass/harmony, sawtooth=tension only
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Core voice builder — handles envelope shaping for all tones
function voice(freq, dur, type, gainPeak, attack = 0.008, decay = 0.06, sustain = 0.7) {
  try {
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + attack);
    g.gain.linearRampToValueAtTime(gainPeak * sustain, ctx.currentTime + attack + decay);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.01);
  } catch (e) {}
}

// Arpeggio helper — fires voices in sequence with a stagger offset (ms)
function arp(notes, dur, type, gainPeak, staggerMs = 55) {
  notes.forEach((freq, i) => setTimeout(() => voice(freq, dur, type, gainPeak), i * staggerMs));
}

// ---- failSound -------------------------------------------------------
// Two descending sawtooth blurps, each slightly detuned, landing on a
// flat 5th — the classic "wrong answer" buzz. Short, dismissive, never
// punishing. The second note is a tritone below the first: the most
// dissonant interval in Western harmony, but kept so quiet it just
// reads as "nope" rather than "you failed badly".
// Notes: B2 (246.94 Hz) -> F2 (174.61 Hz) — tritone descent, sawtooth timbre.
function failSound() {
  try {
    const ctx = getAudio();

    // First blurp: B2, sawtooth, pitch bends down 30 Hz over its life
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(246.94, ctx.currentTime);
    o1.frequency.linearRampToValueAtTime(210, ctx.currentTime + 0.14);
    g1.gain.setValueAtTime(0.07, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    o1.connect(g1).connect(ctx.destination);
    o1.start(); o1.stop(ctx.currentTime + 0.15);

    // Second blurp: F2 (tritone below), slightly lower gain, offset 90ms
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'sawtooth';
    o2.frequency.setValueAtTime(174.61, ctx.currentTime + 0.09);
    o2.frequency.linearRampToValueAtTime(148, ctx.currentTime + 0.25);
    g2.gain.setValueAtTime(0, ctx.currentTime);
    g2.gain.setValueAtTime(0.055, ctx.currentTime + 0.09);
    g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o2.connect(g2).connect(ctx.destination);
    o2.start(); o2.stop(ctx.currentTime + 0.26);
  } catch (e) {}
}

// ---- successSound ----------------------------------------------------
// A quick two-note square wave chime: E4 then A4 (a perfect fourth up).
// Reads as "yes, I know that one" — confirming without celebrating.
// Crisp attack, short decay. The perfect fourth is stable and satisfying
// but not triumphant — exactly right for a known-result confirmation.
// Notes: E4 = 329.63 Hz, A4 = 440 Hz (perfect fourth, A minor home).
function successSound() {
  try {
    // Grace-note approach: tiny lower neighbor before the main pitch
    voice(293.66, 0.06, 'square', 0.07, 0.004, 0.02, 0.0); // D4 grace
    setTimeout(() => voice(329.63, 0.09, 'square', 0.08, 0.005, 0.03, 0.0), 40); // E4
    setTimeout(() => voice(440.00, 0.22, 'square', 0.09, 0.006, 0.05, 0.5), 100); // A4 — lands home
  } catch (e) {}
}

// ---- discoverySound --------------------------------------------------
// The core dopamine hit. A rising arpeggio in A minor: A4, C5, E5, A5 —
// the full octave arrival. Then a shimmering triangle overtone rings on
// top, decaying slowly like a struck crystal glass. The whole gesture
// feels like light breaking through: you just transmuted something new.
// Notes: A4=440, C5=523.25, E5=659.25, A5=880 — A minor triad + octave.
// A triangle voice at A5*1.5 (1320 Hz, the natural 3rd harmonic) adds
// the "bell shimmer" without being a separate melodic event.
function discoverySound() {
  try {
    const ctx = getAudio();

    // Rising arp: square wave, A minor triad climbing to the octave
    const arpNotes = [440, 523.25, 659.25, 880];
    arpNotes.forEach((freq, i) => {
      const delay = i * 70; // 70 ms stagger — faster than chord(), more urgent
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, ctx.currentTime + delay / 1000);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.setValueAtTime(0, ctx.currentTime + delay / 1000);
      g.gain.linearRampToValueAtTime(0.10, ctx.currentTime + delay / 1000 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay / 1000 + 0.38);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + delay / 1000 + 0.40);
    });

    // Bell shimmer: triangle at A5*1.5 = 1320 Hz, fires after arp lands
    const shimmerDelay = arpNotes.length * 70 + 20;
    setTimeout(() => {
      const os = ctx.createOscillator();
      const gs = ctx.createGain();
      os.type = 'triangle';
      os.frequency.setValueAtTime(1320, ctx.currentTime);
      gs.gain.setValueAtTime(0.07, ctx.currentTime);
      gs.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      os.connect(gs).connect(ctx.destination);
      os.start(); os.stop(ctx.currentTime + 0.95);
    }, shimmerDelay);

    // Warm bass undertone: triangle A2 (110 Hz) punches once as the arp starts
    const ob = ctx.createOscillator();
    const gb = ctx.createGain();
    ob.type = 'triangle';
    ob.frequency.setValueAtTime(110, ctx.currentTime);
    gb.gain.setValueAtTime(0.08, ctx.currentTime);
    gb.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    ob.connect(gb).connect(ctx.destination);
    ob.start(); ob.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

// ---- milestoneSound --------------------------------------------------
// A full alchemical fanfare — played only at 25%, 50%, 75%, 100% complete.
// Layered in three waves: (1) a low triangle bass swell, (2) a square-wave
// arp across two octaves of A minor with a raised 7th (G#) for a Dorian
// lift at the top, (3) a triangle bell choir that rings and decays.
// This should feel like the laboratory itself celebrating with you.
// Notes: A2, E3, A3, C4, E4, A4, C5, E5, A5 — two-octave A minor scale climb.
function milestoneSound() {
  try {
    const ctx = getAudio();
    const now = ctx.currentTime;

    // Layer 1: low triangle bass — A2 + E2 (root + fifth), sustained swell
    [[110, 0.12], [82.41, 0.07]].forEach(([freq, gain]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gain, now + 0.08);
      g.gain.setValueAtTime(gain, now + 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(now + 1.45);
    });

    // Layer 2: two-octave arp climb, square wave
    const fanfareNotes = [220, 329.63, 440, 523.25, 659.25, 880, 1046.50, 1318.51];
    fanfareNotes.forEach((freq, i) => {
      const t = now + i * 0.085;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, now);
      g.gain.setValueAtTime(0.09, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 0.57);
    });

    // Layer 3: triangle bell choir — fire three bells offset in time, high register
    // A5 (880), E5 (659.25), C5 (523.25) — the tonic triad ringing down
    [[880, 0.65, 0.08], [1046.50, 0.75, 0.06], [1318.51, 0.85, 0.05]].forEach(([freq, delay, gain]) => {
      const t = now + delay;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, now);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 1.25);
    });
  } catch (e) {}
}

// ---- pickupSound -----------------------------------------------------
// A short, plucked triangle note that cycles through four pitches from the
// A natural minor scale — A4, C5, E5, G5 — so repeated pick-ups feel varied
// rather than repetitive. Each voice has a 2ms attack and 110ms exponential
// decay: tactile and light, like lifting a glass object. A second oscillator
// 3 cents sharp adds subtle beating that gives the tone its resonant quality.
// Gain peak 0.06 — audible without competing with combine sounds.
let _pickupCycle = 0;
const _PICKUP_PITCHES = [440, 523.25, 659.25, 783.99]; // A4 C5 E5 G5 (A minor)
function pickupSound() {
  try {
    const ctx = getAudio();
    const now = ctx.currentTime;
    const freq = _PICKUP_PITCHES[_pickupCycle % _PICKUP_PITCHES.length];
    _pickupCycle++;

    // Main pluck voice — triangle, fast attack, short decay
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'triangle';
    o1.frequency.setValueAtTime(freq, now);
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(0.06, now + 0.002);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    o1.connect(g1).connect(ctx.destination);
    o1.start(now); o1.stop(now + 0.12);

    // Detuned second voice +3 cents — creates a subtle beating shimmer
    const detunedFreq = freq * Math.pow(2, 3 / 1200); // +3 cents
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(detunedFreq, now);
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.025, now + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    o2.connect(g2).connect(ctx.destination);
    o2.start(now); o2.stop(now + 0.10);
  } catch (e) {}
}

// ---- useAmbientSound -------------------------------------------------
// A three-layer alchemical laboratory drone that evolves as you discover
// more elements, with a fourth generative melodic layer added on top.
//
// LAYER A — Root drone: triangle oscillator at A2 (110 Hz). The foundation.
//   Sits beneath everything, barely audible, like a furnace hum.
//
// LAYER B — Shimmer voice: triangle osc at E3 (164.81 Hz, the fifth),
//   modulated by a slow LFO (0.07 Hz triangle wave) that gently wobbles
//   the gain +/- 30% — a breathing, living pulse. As discoveredSize grows,
//   the LFO rate increases slightly (more activity = more life in the room).
//
// LAYER C — Harmonic overtone: sawtooth osc at A3 (220 Hz) run through a
//   steep lowpass filter. The filter cutoff starts at 180 Hz (muffled, nearly
//   inaudible) and opens up to 600 Hz as elements are discovered, letting
//   more harmonic content through — the lab "wakes up" as you progress.
//   This is the most audible evolution of the soundscape.
//
// LAYER D — Generative melodic arpeggiation: a soft triangle voice fires
//   a single note from the A minor pentatonic (A3, C4, E4, G4, A4) every
//   2.5–4.5 seconds, chosen at random. Each note has an 80ms attack and a
//   1.8s exponential decay at peak gain 0.032. A recursive setTimeout varies
//   the inter-note timing so the pattern never locks into a predictable grid.
//   The lab hums to itself — magical, alive, non-intrusive.
//
// All layers share a master gain node so soundOn can kill them cleanly.
// Total gain budget: ~0.077 max across all layers — safe for quiet settings.
function useAmbientSound(discoveredSize, soundOn) {
  const hasInteracted = useRef(false);
  const nodesRef = useRef(null);
  const melodicTimerRef = useRef(null);

  useEffect(() => {
    function startAmbient() {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      document.removeEventListener('pointerdown', startAmbient);

      try {
        const ctx = getAudio();
        const now = ctx.currentTime;
        const progress = Math.min(discoveredSize / 118, 1); // 0..1

        // Master gain — all layers route here
        const master = ctx.createGain();
        master.gain.setValueAtTime(soundOn ? 0.6 : 0, now);
        master.connect(ctx.destination);

        // ---- Layer A: root drone (triangle, A3 = 220 Hz) ----
        const oscA = ctx.createOscillator();
        const gainA = ctx.createGain();
        oscA.type = 'triangle';
        oscA.frequency.setValueAtTime(220, now);
        gainA.gain.setValueAtTime(0.012, now);
        oscA.connect(gainA);
        gainA.connect(master);
        oscA.start();

        // ---- Layer B: shimmer voice (triangle, E3 = 164.81 Hz) with LFO ----
        const oscB = ctx.createOscillator();
        const gainB = ctx.createGain();
        oscB.type = 'triangle';
        oscB.frequency.setValueAtTime(164.81, now);
        gainB.gain.setValueAtTime(0.008, now);
        oscB.connect(gainB);
        gainB.connect(master);
        oscB.start();

        // LFO for gainB — slow breath effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(0.07 + progress * 0.08, now); // 0.07–0.15 Hz
        lfoGain.gain.setValueAtTime(0.006, now); // modulation depth
        lfo.connect(lfoGain);
        lfoGain.connect(gainB.gain); // modulate the shimmer gain
        lfo.start();

        // ---- Layer C: harmonic overtone (sawtooth, A3 = 220 Hz) through lowpass ----
        const oscC = ctx.createOscillator();
        const filterC = ctx.createBiquadFilter();
        const gainC = ctx.createGain();
        oscC.type = 'sawtooth';
        oscC.frequency.setValueAtTime(220, now);
        filterC.type = 'lowpass';
        filterC.Q.setValueAtTime(1.8, now); // gentle resonance, not a scream
        const cutoff = 180 + progress * 420; // 180 Hz (muffled) → 600 Hz (open)
        filterC.frequency.setValueAtTime(cutoff, now);
        gainC.gain.setValueAtTime(0.009, now);
        oscC.connect(filterC);
        filterC.connect(gainC);
        gainC.connect(master);
        oscC.start();

        // ---- Layer D: walking melodic voice ----
        // Steps through an A-minor pentatonic phrase (up and back down) so
        // the melody has contour instead of random scatter. Fires every
        // 650–950 ms — frequent enough to feel like a tune.
        const MELODY = [220, 261.63, 329.63, 440, 523.25, 440, 329.63, 261.63]; // A3→A4 round-trip
        let melodyIdx = 0;
        function scheduleMelodicNote() {
          const intervalMs = 650 + Math.random() * 300; // 0.65–0.95 s
          melodicTimerRef.current = setTimeout(() => {
            try {
              const nodes = nodesRef.current;
              if (!nodes) return;
              const audioCtxNow = getAudio();
              const t = audioCtxNow.currentTime;
              const freq = MELODY[melodyIdx % MELODY.length];
              melodyIdx++;
              // accent every 4th note slightly louder for phrasing
              const isAccent = melodyIdx % 4 === 0;
              const peak = isAccent ? 0.028 : 0.018;
              const decay = isAccent ? 1.4 : 1.0;
              const om = audioCtxNow.createOscillator();
              const gm = audioCtxNow.createGain();
              om.type = 'triangle';
              om.frequency.setValueAtTime(freq, t);
              gm.gain.setValueAtTime(0, t);
              gm.gain.linearRampToValueAtTime(peak, t + 0.05);
              gm.gain.exponentialRampToValueAtTime(0.0001, t + decay);
              om.connect(gm).connect(nodes.master);
              om.start(t); om.stop(t + decay + 0.05);
            } catch (_e) {}
            scheduleMelodicNote();
          }, intervalMs);
        }
        melodicTimerRef.current = setTimeout(scheduleMelodicNote, 1200);

        nodesRef.current = { master, filterC, lfo, lfoGain, gainB };
      } catch (e) {}
    }

    document.addEventListener('pointerdown', startAmbient);
    return () => {
      document.removeEventListener('pointerdown', startAmbient);
      clearTimeout(melodicTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Evolve the ambient as more elements are discovered
  useEffect(() => {
    if (!nodesRef.current) return;
    try {
      const ctx = getAudio();
      const now = ctx.currentTime;
      const progress = Math.min(discoveredSize / 118, 1);
      const { filterC, lfo, lfoGain } = nodesRef.current;

      // Open the lowpass filter cutoff: 180 → 600 Hz over 3 seconds
      const newCutoff = 180 + progress * 420;
      filterC.frequency.linearRampToValueAtTime(newCutoff, now + 3);

      // Quicken the LFO breath slightly: 0.07 → 0.15 Hz
      const newLfoRate = 0.07 + progress * 0.08;
      lfo.frequency.linearRampToValueAtTime(newLfoRate, now + 4);

      // Also deepen LFO modulation a touch: 0.006 → 0.012
      const newDepth = 0.006 + progress * 0.006;
      lfoGain.gain.linearRampToValueAtTime(newDepth, now + 4);
    } catch (e) {}
  }, [discoveredSize]);

  // Toggle master gain on soundOn change
  useEffect(() => {
    if (!nodesRef.current) return;
    try {
      const ctx = getAudio();
      const { master } = nodesRef.current;
      if (soundOn) {
        master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1.5);
      } else {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      }
    } catch (e) {}
  }, [soundOn]);
}

// ============ root app ============
function App() {
  const ambientRef = useRef(null);
  const particleRef = useRef(null);
  const playRef = useRef(null);
  const fx = useAmbient(ambientRef, particleRef);

  // discovered (persisted — all valid META keys are restored, not just periodic table)
  const [discovered, setDiscovered] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('alchemia.discovered') || '[]');
      if (Array.isArray(stored) && stored.length) {
        return new Set([...DB.STARTERS, ...stored.filter(k => k in DB.META)]);
      }
    } catch (e) {}
    return new Set(DB.STARTERS);
  });
  useEffect(() => {
    localStorage.setItem('alchemia.discovered', JSON.stringify([...discovered]));
  }, [discovered]);

  const milestoneRef = useRef(Math.floor((discovered.size / DB.totalElements) * 4));
  const maxTierSeen = useRef((() => {
    let max = 0;
    for (const k of discovered) { const t = DB.META[k]?.t ?? 0; if (t > max) max = t; }
    return max;
  })());
  useEffect(() => {
    const nextQuarter = Math.floor((discovered.size / DB.totalElements) * 4);
    if (nextQuarter > milestoneRef.current) {
      milestoneRef.current = nextQuarter;
      if (fx.current) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        fx.current.particles.burst(cx, cy, '#FFC838', { count: 80, speed: 9 });
      }
      if (tweaks.soundOn) milestoneSound();
    }
  }, [discovered.size]); // eslint-disable-line react-hooks/exhaustive-deps

  // instances on the play area
  const [instances, setInstances] = useState([]);
  // toasts
  const [toasts, setToasts] = useState([]);
  // ui
  const [search, setSearch] = useState('');
  const [helpOpen, setHelpOpen] = useState(() => {
    return localStorage.getItem('alchemia.seenHelp') !== '1';
  });
  const [filter, setFilter] = useState('all'); // all | new | locked
  const [libView, setLibView] = useState('elements'); // elements | combos

  // recent unlocks
  const [recent, setRecent] = useState([]);
  const recentTimestamps = useRef(new Map());
  const [recentTick, setRecentTick] = useState(0);
  useEffect(() => {
    if (!recent.length) return;
    const t = setTimeout(() => setRecentTick(n => n + 1), 60000);
    return () => clearTimeout(t);
  }, [recent, recentTick]);
  const recentKeys = useMemo(() => {
    const now = Date.now();
    return new Set(recent.filter(k => (now - (recentTimestamps.current.get(k) || 0)) < 60000));
  }, [recent, recentTick]);

  // tweaks
  const tweaksDefaults = /*EDITMODE-BEGIN*/{
    "soundOn": true,
    "showHints": true,
    "labelsAlways": true,
    "accentPalette": ["#FF5A1F","#B847C2","#FFC838"]
  }/*EDITMODE-END*/;
  const tweaks = window.useTweaks ? window.useTweaks(tweaksDefaults)[0] : tweaksDefaults;

  useAmbientSound(discovered.size, tweaks.soundOn);

  // discover element helper
  const discover = useCallback((key) => {
    setDiscovered(prev => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setRecent(prev => [key, ...prev.filter(k => k !== key)].slice(0, 8));
    recentTimestamps.current.set(key, Date.now());
    const tier = DB.META[key]?.t ?? 0;
    if (tier > maxTierSeen.current) {
      maxTierSeen.current = tier;
      setToasts(t => [...t, { id: uid(), key, time: Date.now(), tierUnlock: tier }]);
      if (fx.current) fx.current.ambient.pulse(1.0);
    }
  }, []);

  // combine two instances
  const combineInstances = useCallback((aId, bId) => {
    setInstances(prev => {
      const a = prev.find(i => i.id === aId);
      const b = prev.find(i => i.id === bId);
      if (!a || !b || a.id === b.id) return prev;
      const result = DB.combine(a.key, b.key);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;

      if (!result) {
        // failure shake
        if (tweaks.soundOn) failSound();
        if (fx.current) fx.current.particles.burst(mx, my, '#7E7E7E', { count: 14, speed: 3 });
        return prev.map(i => {
          if (i.id === aId || i.id === bId) return { ...i, shake: Date.now() };
          return i;
        });
      }

      // success
      const wasDiscovered = discovered.has(result);
      const meta = DB.META[result] || { c: '#FFC838', e: '✨' };
      if (fx.current) {
        fx.current.particles.burst(mx, my, meta.c, { count: 50, speed: 7 });
        fx.current.particles.burst(mx, my, '#FFFFFF', { count: 20, speed: 4 });
        fx.current.ambient.pulse(wasDiscovered ? 0.3 : 0.9);
      }
      if (tweaks.soundOn) wasDiscovered ? successSound() : discoverySound();

      if (!wasDiscovered) {
        discover(result);
        setToasts(t => [...t, { id: uid(), key: result, time: Date.now() }]);
      }

      const next = prev.filter(i => i.id !== aId && i.id !== bId);
      next.push({ id: uid(), key: result, x: mx, y: my, born: Date.now(), firstDiscovery: !wasDiscovered });
      return next;
    });
  }, [discovered, tweaks.soundOn, discover]);

  // early dismiss — player clicks or swipes left on a toast
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // dismiss toasts — longer delay when a science fact is present
  useEffect(() => {
    if (!toasts.length) return;
    const first = toasts[0];
    const hasFact = DB.META[first.key] && DB.META[first.key].fact;
    const delay = hasFact ? 8000 : 4500;
    const t = setTimeout(() => setToasts(prev => prev.slice(1)), delay);
    return () => clearTimeout(t);
  }, [toasts]);

  // dismiss help permanently
  const closeHelp = () => {
    setHelpOpen(false);
    localStorage.setItem('alchemia.seenHelp', '1');
  };

  // spawn element from library into play area
  const spawn = useCallback((key, x, y) => {
    setInstances(prev => [...prev, { id: uid(), key, x, y, born: Date.now() }]);
  }, []);

  // remove instance
  const remove = useCallback((id) => {
    setInstances(prev => prev.filter(i => i.id !== id));
  }, []);

  // clear play area
  const clearAll = () => setInstances([]);

  // reset
  const resetAll = () => {
    if (!window.confirm('Reset all progress? All your discovered elements will be lost.')) return;
    setDiscovered(new Set(DB.STARTERS));
    setInstances([]);
    setRecent([]);
    localStorage.removeItem('alchemia.discovered');
  };

  // counts
  const total = DB.totalElements;
  const totalRecipes = DB.totalRecipes;
  const discoveredCount = discovered.size;
  const progress = discoveredCount / total;

  return (
    <div className="alc-root">
      <canvas ref={ambientRef} className="alc-ambient" />
      <canvas ref={particleRef} className="alc-particles" />

      <TopBar
        discoveredCount={discoveredCount}
        total={total}
        totalRecipes={totalRecipes}
        progress={progress}
        onHelp={() => setHelpOpen(true)}
        onReset={resetAll}
        onClear={clearAll}
        libView={libView}
        onCombos={() => {
          setLibView(v => v === 'combos' ? 'elements' : 'combos');
          // on mobile, snap the library open
          if (window.innerWidth <= 900) {
            const h = Math.round(window.innerHeight * 0.55);
            document.documentElement.style.setProperty('--lib-h', h + 'px');
          }
        }}
      />

      <PlayArea
        ref={playRef}
        instances={instances}
        setInstances={setInstances}
        combine={combineInstances}
        remove={remove}
        fx={fx}
        labelsAlways={tweaks.labelsAlways}
        onPickup={tweaks.soundOn ? pickupSound : null}
      />

      <Library
        discovered={discovered}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        libView={libView}
        setLibView={setLibView}
        recent={recent}
        recentKeys={recentKeys}
        spawn={spawn}
        playRef={playRef}
        fx={fx}
      />

      {tweaks.showHints && (
        <HintTicker discovered={discovered} recent={recent} total={total} playRef={playRef} />
      )}

      <Toasts toasts={toasts} onDismiss={dismissToast} />

      {helpOpen && <Help onClose={closeHelp} totalRecipes={totalRecipes} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
