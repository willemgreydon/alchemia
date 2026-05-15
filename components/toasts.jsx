// ============ toasts ============
function Toasts({ toasts, onDismiss }) {
  return (
    <div className="alc-toasts">
      {toasts.map(t => {
        const m = DB.META[t.key] || { e: '?', c: '#888' };
        let startX = 0;
        const handlers = {
          onClick: () => onDismiss(t.id),
          onPointerDown: e => { startX = e.clientX; },
          onPointerUp: e => { if (e.clientX - startX < -40) onDismiss(t.id); },
        };
        if (t.tierUnlock) {
          return (
            <div
              key={t.id}
              className="alc-toast alc-toast--tier-unlock"
              style={{ '--tint': m.c }}
              {...handlers}
            >
              <div className="alc-toast-tier-number">{t.tierUnlock}</div>
              <div className="alc-toast-text">
                <div className="alc-toast-label">TIER UNLOCKED</div>
                <div className="alc-toast-name">{DB.displayName(t.key)}</div>
              </div>
            </div>
          );
        }
        return (
          <div
            key={t.id}
            className={`alc-toast${m.fact ? ' alc-toast--fact' : ''}`}
            style={{ '--tint': m.c }}
            {...handlers}
          >
            <div className="alc-toast-glyph"><PixelIcon elKey={t.key} /></div>
            <div className="alc-toast-text">
              <div className="alc-toast-label">NEW DISCOVERY</div>
              <div className="alc-toast-name">{DB.displayName(t.key)}</div>
              {m.fact && <div className="alc-toast-fact">{m.fact}</div>}
            </div>
            <div className="alc-toast-spark"><PixelSpark /></div>
          </div>
        );
      })}
    </div>
  );
}
