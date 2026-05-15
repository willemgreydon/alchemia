// ============ library ============
function LibCard({ elKey, unknown, onPointerDown }) {
  const meta = DB.META[elKey] || { e: '?', c: '#888', t: 0 };
  const pt = window.PeriodicTable?.BY_NAME[elKey?.toLowerCase()];
  if (unknown) {
    return (
      <div className="alc-lib-item alc-combo-unknown">
        <div className="alc-combo-qmark">?</div>
      </div>
    );
  }
  if (pt) {
    const stateAbbr = { solid: 's', liquid: 'l', gas: 'g' }[pt.state] || '';
    return (
      <div className="alc-lib-item alc-lib-item--pt" style={{ '--tint': meta.c }} onPointerDown={onPointerDown}>
        <div className="alc-pt-z">{pt.z}</div>
        <div className="alc-pt-state">{stateAbbr}</div>
        <div className="alc-pt-icon"><PixelIcon elKey={elKey} /></div>
        <div className="alc-pt-name">{pt.name}</div>
      </div>
    );
  }
  return (
    <div className="alc-lib-item" style={{ '--tint': meta.c }} onPointerDown={onPointerDown}>
      <div className="alc-lib-emoji"><PixelIcon elKey={elKey} /></div>
      <div className="alc-lib-name">{DB.displayName(elKey)}</div>
    </div>
  );
}

function Library({ discovered, search, setSearch, filter, setFilter, libView: view, setLibView: setView, recent, spawn, playRef, fx }) {

  // combos: all recipes where both ingredients are discovered
  const combos = React.useMemo(() => {
    if (view !== 'combos') return [];
    return DB.RECIPES.filter(({ a, b }) => discovered.has(a) && discovered.has(b));
  }, [view, discovered]);

  // sort all META by tier, only show discovered
  const items = React.useMemo(() => {
    const arr = [...discovered].map(k => ({ key: k, meta: DB.META[k] || { e: '?', c: '#888', t: 0 } }));
    const periodicOrder = new Map(DB.PERIODIC_TABLE_KEYS.map((k, i) => [k, i]));
    arr.sort((a, b) => {
      const aZ = periodicOrder.get(a.key);
      const bZ = periodicOrder.get(b.key);
      if (aZ !== undefined && bZ !== undefined) return aZ - bZ;
      if (aZ !== undefined) return -1;
      if (bZ !== undefined) return 1;
      if ((a.meta.t || 0) !== (b.meta.t || 0)) return (a.meta.t || 0) - (b.meta.t || 0);
      return a.key.localeCompare(b.key);
    });
    const q = search.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter(i => i.key.includes(q) || DB.displayName(i.key).toLowerCase().includes(q));
  }, [discovered, search]);

  // drag from library
  const dragRef = React.useRef(null);
  const listRef = React.useRef(null);

  // scroll strip — arrow visibility state
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);
  const syncArrows = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 4);
  }, []);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
    return () => el.removeEventListener('scroll', syncArrows);
  }, [syncArrows]);
  React.useEffect(() => { syncArrows(); }, [items.length, syncArrows]);

  // 3-state snap sheet (mobile only)
  const SNAP_PEEK    = 56;
  const SNAP_DEFAULT = 220;
  const snapExpanded = () => Math.round(window.innerHeight * 0.55);
  const snapPoints   = () => [SNAP_PEEK, SNAP_DEFAULT, snapExpanded()];
  const handleRef = React.useRef(null);
  React.useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    let pid = null, startY = 0, startH = SNAP_DEFAULT;
    const getH = () => parseInt(document.documentElement.style.getPropertyValue('--lib-h') || SNAP_DEFAULT, 10);
    const setH = (h) => document.documentElement.style.setProperty('--lib-h', h + 'px');
    const snap = (h) => {
      const pts = snapPoints();
      setH(pts.reduce((a, b) => Math.abs(b - h) < Math.abs(a - h) ? b : a));
    };
    const onDown = (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault(); e.stopPropagation();
      handle.setPointerCapture(e.pointerId);
      pid = e.pointerId; startY = e.clientY; startH = getH();
      document.body.classList.add('lib-dragging');
    };
    const onMove = (e) => {
      if (e.pointerId !== pid) return;
      const pts = snapPoints();
      const h = Math.min(pts[pts.length - 1], Math.max(pts[0], startH + (startY - e.clientY)));
      setH(h);
    };
    const onUp = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      document.body.classList.remove('lib-dragging');
      const totalMove = Math.abs(e.clientY - startY);
      if (totalMove < 8) {
        const pts = snapPoints();
        const cur = getH();
        const idx = pts.findIndex(s => Math.abs(s - cur) < 20);
        setH(pts[(idx + 1) % pts.length]);
      } else {
        snap(getH());
      }
    };
    handle.addEventListener('pointerdown', onDown);
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
    if (window.innerWidth <= 900) setH(SNAP_DEFAULT);
    return () => {
      handle.removeEventListener('pointerdown', onDown);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
    };
  }, []);

  // scroll strip — native DOM listeners (React synthetic events don't reliably
  // handle setPointerCapture on iOS Safari)
  const stripRef = React.useRef(null);
  React.useEffect(() => {
    const strip = stripRef.current;
    const list = listRef.current;
    if (!strip || !list) return;
    let pid = null, startY = 0, startTop = 0;
    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      strip.setPointerCapture(e.pointerId);
      pid = e.pointerId;
      startY = e.clientY;
      startTop = list.scrollTop;
    };
    const onMove = (e) => {
      if (e.pointerId !== pid) return;
      const ratio = list.scrollHeight / Math.max(list.clientHeight, 1);
      list.scrollTop = startTop + (e.clientY - startY) * ratio;
    };
    const onUp = (e) => { if (e.pointerId === pid) pid = null; };
    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerup', onUp);
    strip.addEventListener('pointercancel', onUp);
    return () => {
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerup', onUp);
      strip.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onItemPointerDown = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { key, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };
    const ghost = document.createElement('div');
    ghost.className = 'alc-ghost';
    const meta = DB.META[key];
    ghost.innerHTML = `<div class="alc-tile-emoji alc-pixel">${ICONS.renderIcon(key)}</div>`;
    ghost.style.setProperty('--tint', meta.c);
    document.body.appendChild(ghost);
    ghost.style.left = (e.clientX - 32) + 'px';
    ghost.style.top = (e.clientY - 32) + 'px';
    dragRef.current.ghost = ghost;
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.ghost) {
      d.ghost.style.left = (e.clientX - 32) + 'px';
      d.ghost.style.top = (e.clientY - 32) + 'px';
    }
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.ghost) d.ghost.remove();
    window.dispatchEvent(new CustomEvent('alchemia:librarydrop', {
      detail: { key: d.key, clientX: e.clientX, clientY: e.clientY }
    }));
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    if (moved < 8 && playRef.current) {
      const rect = playRef.current.getBoundingClientRect();
      const x = rect.width / 2 - 32 + (Math.random() - 0.5) * 80;
      const y = rect.height / 2 - 32 + (Math.random() - 0.5) * 80;
      window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: d.key, x, y } }));
    }
    dragRef.current = null;
  };

  return (
    <div className="alc-library" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="alc-lib-handle" ref={handleRef}>
        <div className="alc-lib-handle-pill" />
      </div>
      <div className="alc-library-head">
        <div className="alc-lib-tabs">
          <button className={`alc-lib-tab${view === 'elements' ? ' active' : ''}`} onClick={() => setView('elements')}>ELEMENTS</button>
          <button className={`alc-lib-tab${view === 'combos' ? ' active' : ''}`} onClick={() => setView('combos')}>COMBOS</button>
        </div>
        <div className="alc-library-count">
          {view === 'elements' ? `${discovered.size} elements` : `${combos.length} recipes`}
        </div>
      </div>
      {view === 'elements' && (
        <div className="alc-search-wrap">
          <input
            className="alc-search"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
      {view === 'elements' && recent.length > 0 && (
        <div className="alc-recent">
          <div className="alc-recent-label">RECENT</div>
          <div className="alc-recent-row">
            {recent.slice(0, 6).map((k, i) => {
              const m = DB.META[k] || { e: '?', c: '#888' };
              return (
                <div key={i} className="alc-recent-dot" title={DB.displayName(k)}>
                  <PixelIcon elKey={k} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="alc-library-scroll-area">
        <div className="alc-library-list" ref={listRef}>
          {view === 'combos' ? (
            combos.length === 0 ? (
              <div className="alc-lib-empty">No combinations yet.<br/>Combine elements to unlock recipes.</div>
            ) : combos.map(({ a, b, r }, i) => (
              <div key={i} className="alc-combo-row">
                <LibCard elKey={a} onPointerDown={(e) => onItemPointerDown(e, a)} />
                <div className="alc-combo-op">+</div>
                <LibCard elKey={b} onPointerDown={(e) => onItemPointerDown(e, b)} />
                <div className="alc-combo-op">=</div>
                <LibCard elKey={r} unknown={!discovered.has(r)} onPointerDown={discovered.has(r) ? (e) => onItemPointerDown(e, r) : undefined} />
              </div>
            ))
          ) : (
            <>
              {items.map(({ key, meta }) => {
                const pt = window.PeriodicTable?.BY_NAME[key.toLowerCase()];
                if (pt) {
                  const stateAbbr = { solid: 's', liquid: 'l', gas: 'g' }[pt.state] || '';
                  return (
                    <div
                      key={key}
                      className="alc-lib-item alc-lib-item--pt"
                      onPointerDown={(e) => onItemPointerDown(e, key)}
                      style={{ '--tint': meta.c }}
                      title={`${pt.name} — ${pt.cat}`}
                    >
                      <div className="alc-pt-z">{pt.z}</div>
                      <div className="alc-pt-state">{stateAbbr}</div>
                      <div className="alc-pt-icon"><PixelIcon elKey={key} /></div>
                      <div className="alc-pt-name">{pt.name}</div>
                      <div className="alc-pt-weight">{pt.weight}</div>
                      <div className="alc-pt-shells">{pt.shells.join('·')}</div>
                    </div>
                  );
                }
                return (
                  <div
                    key={key}
                    className="alc-lib-item"
                    onPointerDown={(e) => onItemPointerDown(e, key)}
                    style={{ '--tint': meta.c }}
                    title={DB.displayName(key)}
                  >
                    <div className="alc-lib-emoji"><PixelIcon elKey={key} /></div>
                    <div className="alc-lib-name">{DB.displayName(key)}</div>
                    <div className="alc-lib-tier">T{meta.t}</div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="alc-lib-empty">No matches.</div>
              )}
            </>
          )}
        </div>
        <div className="alc-lib-strip" ref={stripRef}>
          <div className={`alc-lib-arrow${canScrollUp ? ' can-scroll' : ''}`}
            onClick={() => listRef.current?.scrollBy({ top: -80, behavior: 'smooth' })}>
            <PixelArrowUp />
          </div>
          <div className="alc-lib-track" />
          <div className={`alc-lib-arrow${canScrollDown ? ' can-scroll' : ''}`}
            onClick={() => listRef.current?.scrollBy({ top: 80, behavior: 'smooth' })}>
            <PixelArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
}
