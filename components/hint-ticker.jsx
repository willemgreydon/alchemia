// ============ hint ticker ============
function HintTicker({ discovered, recent, total, playRef }) {
  const [refreshCount, setRefreshCount] = React.useState(0);
  // suggest possible recipes from discovered elements (only ones we haven't done yet)
  const hints = React.useMemo(() => {
    const dArr = [...discovered];
    const possible = [];
    for (let i = 0; i < dArr.length; i++) {
      for (let j = i; j < dArr.length; j++) {
        const r = DB.combine(dArr[i], dArr[j]);
        if (r && !discovered.has(r)) {
          possible.push({ a: dArr[i], b: dArr[j], r });
        }
      }
    }
    // sample 3
    const out = [];
    for (let k = 0; k < Math.min(3, possible.length); k++) {
      const idx = Math.floor(Math.random() * possible.length);
      out.push(possible[idx]);
      possible.splice(idx, 1);
    }
    return out;
  }, [discovered.size, recent, refreshCount]);

  return (
    <div className="alc-ticker">
      <div className="alc-ticker-label">HINTS</div>
      <button className="alc-ticker-refresh" onClick={() => setRefreshCount(n => n + 1)} title="Reshuffle hints">↺</button>
      <div className="alc-ticker-row">
        {hints.length === 0 && <div className="alc-ticker-empty">try combining what you have</div>}
        {hints.map((h, i) => {
          const spawnKey = (key, e) => {
            e.preventDefault();
            if (!playRef?.current) return;
            const rect = playRef.current.getBoundingClientRect();
            const x = rect.width / 2 - 32 + (Math.random() - 0.5) * 80;
            const y = rect.height / 2 - 32 + (Math.random() - 0.5) * 80;
            window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key, x, y } }));
          };
          return (
            <div key={i} className="alc-ticker-hint">
              <span className="alc-ticker-icon" onPointerDown={(e) => spawnKey(h.a, e)}><PixelIcon elKey={h.a} /></span>
              <span className="alc-ticker-plus">+</span>
              <span className="alc-ticker-icon" onPointerDown={(e) => spawnKey(h.b, e)}><PixelIcon elKey={h.b} /></span>
              <span className="alc-ticker-plus">=</span>
              <span className="alc-ticker-q">?</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
