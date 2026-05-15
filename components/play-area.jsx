// ============ play area ============
const PlayArea = React.forwardRef(function PlayArea(props, ref) {
  const { instances, setInstances, combine, remove, fx, labelsAlways, onPickup } = props;
  const localRef = React.useRef(null);
  const areaRef = ref || localRef;

  // pointer drag state
  const dragRef = React.useRef(null);

  const onInstancePointerDown = (e, inst) => {
    e.stopPropagation();
    const rect = areaRef.current.getBoundingClientRect();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: inst.id,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left - inst.x,
      offsetY: e.clientY - rect.top - inst.y,
      moved: false
    };
    if (onPickup) onPickup();
    setInstances(prev => prev.map(i => i.id === inst.id ? { ...i, dragging: true, z: Date.now() } : i));
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - d.offsetX;
    const y = e.clientY - rect.top - d.offsetY;
    d.moved = true;
    setInstances(prev => prev.map(i => i.id === d.id ? { ...i, x, y } : i));
    // trail emit
    if (fx.current && Math.random() < 0.35) {
      const inst = instancesRefCurrent(d.id);
      if (inst) {
        const meta = DB.META[inst.key];
        fx.current.particles.emit(inst.x + 30, inst.y + 30, meta?.c || '#FFC838');
      }
    }
  };

  // hack: get current instance position from DOM
  const instancesRefCurrent = (id) => {
    const node = areaRef.current?.querySelector(`[data-inst-id="${id}"]`);
    if (!node) return null;
    const transform = node.style.transform;
    const m = transform.match(/translate\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px\)/);
    if (!m) return null;
    return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;

    const rect = areaRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    setInstances(prev => {
      const me = prev.find(i => i.id === d.id);
      if (!me) return prev;
      // find another instance under pointer
      const TILE = 64;
      const target = prev.find(i => {
        if (i.id === d.id) return false;
        const cx = i.x + TILE/2;
        const cy = i.y + TILE/2;
        return Math.hypot(cx - (me.x + TILE/2), cy - (me.y + TILE/2)) < TILE * 1.15;
      });
      if (target) {
        // defer combine to next tick so we don't recurse
        setTimeout(() => combine(d.id, target.id), 0);
        return prev.map(i => i.id === d.id ? { ...i, dragging: false } : i);
      }
      return prev.map(i => i.id === d.id ? { ...i, dragging: false } : i);
    });
  };

  // accept drops from library
  React.useEffect(() => {
    const onDrop = (e) => {
      const data = e.detail;
      if (!data || data.moved < 8) return;
      const rect = areaRef.current.getBoundingClientRect();
      // only accept if drop is inside play area
      if (data.clientX < rect.left || data.clientX > rect.right ||
          data.clientY < rect.top || data.clientY > rect.bottom) return;
      const x = Math.max(0, Math.min(rect.width - 64, data.clientX - rect.left - 32));
      const y = Math.max(0, Math.min(rect.height - 64, data.clientY - rect.top - 32));
      window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: data.key, x, y } }));
    };
    window.addEventListener('alchemia:librarydrop', onDrop);
    return () => window.removeEventListener('alchemia:librarydrop', onDrop);
  }, []);

  // listen for spawn events
  React.useEffect(() => {
    const onSpawn = (e) => {
      const { key, x, y } = e.detail;
      setInstances(prev => [...prev, { id: uid(), key, x, y, born: Date.now() }]);
    };
    window.addEventListener('alchemia:spawn', onSpawn);
    return () => window.removeEventListener('alchemia:spawn', onSpawn);
  }, []);

  return (
    <div
      ref={areaRef}
      className="alc-playarea"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={(e) => {
        // double-click empty area = nothing (avoid accidental clear)
      }}
    >
      {instances.length === 0 && (
        <div className="alc-empty">
          <div className="alc-empty-glyph">◐◑◒◓</div>
          <div className="alc-empty-title">drag two elements together</div>
          <div className="alc-empty-sub">to discover what happens</div>
          <div className="alc-empty-arrow" />
        </div>
      )}
      {instances.map(inst => (
        <Tile
          key={inst.id}
          inst={inst}
          onPointerDown={(e) => onInstancePointerDown(e, inst)}
          onRemove={() => remove(inst.id)}
          labelsAlways={labelsAlways}
        />
      ))}
    </div>
  );
});

// ============ tile (on play area) ============
function Tile({ inst, onPointerDown, onRemove, labelsAlways }) {
  const meta = DB.META[inst.key] || { e: '?', c: '#888' };
  const name = DB.displayName(inst.key);
  const age = Date.now() - (inst.born || 0);
  const isNew = age < 600;
  const isShaking = inst.shake && Date.now() - inst.shake < 400;
  const isFirstDiscovery = inst.firstDiscovery === true && age < 700;
  return (
    <div
      data-inst-id={inst.id}
      className={`alc-tile-wrap ${inst.dragging ? 'is-dragging' : ''}`}
      style={{
        transform: `translate(${inst.x}px, ${inst.y}px)`,
        zIndex: inst.z || 1
      }}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => { e.preventDefault(); onRemove(); }}
    >
      <div
        className={`alc-tile ${isNew ? 'is-new' : ''} ${isShaking ? 'is-shake' : ''} ${isFirstDiscovery ? 'is-first-discovery' : ''}`}
        style={{ '--tint': meta.c }}
      >
        <div className="alc-tile-emoji"><PixelIcon elKey={inst.key} /></div>
        {labelsAlways && <div className="alc-tile-label">{name}</div>}
        {isShaking && <div className="alc-tile-label alc-tile-no-reaction">no reaction</div>}
        <div className="alc-tile-x" onPointerDown={(e) => { e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); onRemove(); }}>×</div>
      </div>
    </div>
  );
}
