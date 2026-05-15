// ============ hint ticker ============
function keyLabel(key) {
  const meta = DB.META[key];
  if (meta?.displayName) return meta.displayName.replace(/\s*\(.*$/, '').trim();
  return key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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
    // Fisher-Yates shuffle, take first 3 — avoids duplicates from naive splice-and-random
    for (let k = possible.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [possible[k], possible[j]] = [possible[j], possible[k]];
    }
    return possible.slice(0, 3);
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
            const off = spiralOffset(++_spawnCounter);
            const x = rect.width / 2 - 32 + off.x;
            const y = rect.height / 2 - 32 + off.y;
            window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key, x, y } }));
          };
          return (
            <div key={i} className="alc-ticker-hint">
              <span className="alc-ticker-el" onPointerDown={(e) => spawnKey(h.a, e)}>
                <span className="alc-ticker-icon"><PixelIcon elKey={h.a} /></span>
                <span className="alc-ticker-el-name">{keyLabel(h.a)}</span>
              </span>
              <span className="alc-ticker-plus">+</span>
              <span className="alc-ticker-el" onPointerDown={(e) => spawnKey(h.b, e)}>
                <span className="alc-ticker-icon"><PixelIcon elKey={h.b} /></span>
                <span className="alc-ticker-el-name">{keyLabel(h.b)}</span>
              </span>
              <span className="alc-ticker-plus">=</span>
              <span className="alc-ticker-q">?</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
