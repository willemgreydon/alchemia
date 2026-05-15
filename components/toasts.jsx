// ============ toasts ============
function Toasts({ toasts, onDismiss }) {
  return (
    <div className="alc-toasts">
      {toasts.map(t => {
        const m = DB.META[t.key] || { e: '?', c: '#888' };
        let startX = 0;
        return (
          <div
            key={t.id}
            className={`alc-toast${m.fact ? ' alc-toast--fact' : ''}`}
            style={{ '--tint': m.c }}
            onClick={() => onDismiss(t.id)}
            onPointerDown={e => { startX = e.clientX; }}
            onPointerUp={e => {
              const deltaX = e.clientX - startX;
              if (deltaX < -40) onDismiss(t.id);
            }}
          >
            <div className="alc-toast-glyph"><PixelIcon elKey={t.key} /></div>
            <div className="alc-toast-text">
              <div className="alc-toast-label">NEW DISCOVERY</div>
              <div className="alc-toast-name">{DB.displayName(t.key)}</div>
              {m.fact && <div className="alc-toast-fact">{m.fact}</div>}
            </div>
            <div className="alc-toast-spark">✦</div>
          </div>
        );
      })}
    </div>
  );
}
