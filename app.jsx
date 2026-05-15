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
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function blip(freq, dur = 0.15, type = 'sine', gain = 0.15) {
  try {
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch (e) {}
}
function chord(freqs, dur = 0.4) {
  freqs.forEach((f, i) => setTimeout(() => blip(f, dur, 'triangle', 0.1), i * 40));
}
function failSound() {
  blip(180, 0.18, 'sawtooth', 0.06);
  setTimeout(() => blip(140, 0.18, 'sawtooth', 0.06), 80);
}
function successSound() {
  chord([523.25, 659.25, 783.99], 0.3);
}
function discoverySound() {
  chord([523.25, 659.25, 783.99, 1046.50], 0.5);
}

function useAmbientSound(discoveredSize, soundOn) {
  const hasInteracted = useRef(false);
  const nodesRef = useRef(null);

  useEffect(() => {
    function startAmbient() {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      document.removeEventListener('pointerdown', startAmbient);

      const ctx = getAudio();
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200 + discoveredSize * 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(soundOn ? 0.05 : 0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      nodesRef.current = { filter, gain };
    }
    document.addEventListener('pointerdown', startAmbient);
    return () => document.removeEventListener('pointerdown', startAmbient);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!nodesRef.current) return;
    const { filter } = nodesRef.current;
    const ctx = getAudio();
    filter.frequency.linearRampToValueAtTime(200 + discoveredSize * 2, ctx.currentTime + 2);
  }, [discoveredSize]);

  useEffect(() => {
    if (!nodesRef.current) return;
    const { gain } = nodesRef.current;
    const ctx = getAudio();
    if (soundOn) {
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
    } else {
      gain.gain.setValueAtTime(0, ctx.currentTime);
    }
  }, [soundOn]);
}

// ============ root app ============
function App() {
  const ambientRef = useRef(null);
  const particleRef = useRef(null);
  const playRef = useRef(null);
  const fx = useAmbient(ambientRef, particleRef);

  // discovered (persisted)
  const [discovered, setDiscovered] = useState(() => {
    // on load, keep only periodic-table elements — everything else must be re-discovered
    const periodicSet = new Set(DB.PERIODIC_TABLE_KEYS);
    try {
      const stored = JSON.parse(localStorage.getItem('alchemia.discovered') || '[]');
      if (Array.isArray(stored) && stored.length) {
        const filtered = stored.filter(k => periodicSet.has(k));
        return new Set([...filtered, ...DB.STARTERS]);
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
      if (tweaks.soundOn) chord([523.25, 659.25, 783.99, 1046.50, 1318.51], 0.6);
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
  const [confirmReset, setConfirmReset] = useState(false);
  const resetAll = () => setConfirmReset(true);
  const onResetConfirmed = () => {
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
        confirmReset={confirmReset}
        setConfirmReset={setConfirmReset}
        onResetConfirmed={onResetConfirmed}
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
