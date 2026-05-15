// ============ library ============
let _spawnCounter = 0;
function spiralOffset(n) {
  const r = 14 * Math.sqrt(n);
  const theta = n * 2.399963;
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

// formula complexity score:
//   primary   — number of distinct element types (fewer = simpler: H₂ < H₂O)
//   secondary — sum of (atomic number Z × stoichiometric count) per element (H₂ < O₃ because Z(H)=1 < Z(O)=8)
//   fallback  — conceptual/no-formula elements sorted by game tier
function formulaComplexity(key) {
  const meta = DB.META[key];
  if (!meta) return 0;
  const name = meta.displayName || '';
  // grab the last (...) block — handles nested parens like Ca(OH)₂ by greedy match
  const match = name.match(/\((.+)\)\s*$/);
  if (!match) return (meta.t || 0) * 100000 + 50000; // conceptual elements grouped by tier

  const formula = match[1];
  // if the formula contains 2+ consecutive lowercase letters it's descriptive text, not a chemical formula
  // e.g. "Hg-metal alloy", "Mg-porphyrin", "zero resistance" → fall back to tier score
  if (/[a-z]{2}/.test(formula)) return (meta.t || 0) * 100000 + 50000;
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  let ascii = '';
  for (const ch of formula) {
    const i = SUB.indexOf(ch);
    ascii += i >= 0 ? String(i) : ch;
  }

  // extract [ElementSymbol, count] pairs; parenthesised groups lose their multiplier
  // but the approximation is fine for sort ordering
  const BY_SYM = window.PeriodicTable?.BY_SYMBOL || {};
  let elementTypes = 0;
  let weightedZ = 0;
  const seen = new Set();
  for (const [, sym, n] of ascii.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    const z = BY_SYM[sym]?.z ?? 50; // fallback for unknowns (mid-table)
    const count = n ? parseInt(n) : 1;
    if (!seen.has(sym)) { seen.add(sym); elementTypes++; }
    weightedZ += z * count;
  }

  // no element symbols parsed → descriptive text, not a formula (e.g. "zero resistance")
  if (elementTypes === 0) return (meta.t || 0) * 100000 + 50000;
  return elementTypes * 10000 + weightedZ;
}

// deterministic fantasy name from element key — same key always gets same mystery name
function fantasyName(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  const rand = () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 0x100000000; };
  const starts = ['ae','xy','vor','keth','zil','myr','eth','sul','nox','ix','eld','brym','sar','ven','gor','xan','vel','thyr'];
  const mids   = ['ar','em','il','or','un','ath','esh','om','yl'];
  const ends   = ['ax','is','or','um','el','on','ix','eth','an','yr','oth','en'];
  const s = starts[Math.floor(rand() * starts.length)];
  const m = rand() > 0.45 ? mids[Math.floor(rand() * mids.length)] : '';
  const e = ends[Math.floor(rand() * ends.length)];
  return s + m + e;
}

function ElementDetail({ elKey, onClose }) {
  const meta = DB.META[elKey] || {};
  const pt = window.PeriodicTable?.BY_NAME[elKey?.toLowerCase()];
  const recipes = DB.RECIPES.filter(r => r.r === elKey);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="alc-detail-backdrop" onPointerDown={onClose}>
      <div className="alc-detail-sheet" onPointerDown={e => e.stopPropagation()} style={{ '--tint': meta.c }}>
        <button className="alc-detail-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="alc-detail-icon"><PixelIcon elKey={elKey} /></div>
        <div className="alc-detail-name">{DB.displayName(elKey)}</div>
        {pt && (
          <div className="alc-detail-pt">
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">Atomic number</span>
              <span className="alc-detail-pt-value">{pt.z}</span>
            </div>
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">Symbol</span>
              <span className="alc-detail-pt-value">{pt.sym}</span>
            </div>
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">Category</span>
              <span className="alc-detail-pt-value">{pt.cat}</span>
            </div>
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">State</span>
              <span className="alc-detail-pt-value">{pt.state}</span>
            </div>
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">Atomic weight</span>
              <span className="alc-detail-pt-value">{pt.weight}</span>
            </div>
            <div className="alc-detail-pt-row">
              <span className="alc-detail-pt-label">Electron shells</span>
              <span className="alc-detail-pt-value">{pt.shells.join(' · ')}</span>
            </div>
          </div>
        )}
        <div className="alc-detail-section-label">Recipe</div>
        {recipes.length === 0 ? (
          <div className="alc-detail-recipes-empty">Occurs in nature</div>
        ) : (
          <div className="alc-detail-recipes">
            {recipes.map((r, i) => (
              <div key={i} className="alc-detail-recipe">
                <div className="alc-detail-recipe-icon"><PixelIcon elKey={r.a} /></div>
                <div className="alc-detail-recipe-op">+</div>
                <div className="alc-detail-recipe-icon"><PixelIcon elKey={r.b} /></div>
              </div>
            ))}
          </div>
        )}
        {meta.fact && (
          <div className="alc-detail-fact">{meta.fact}</div>
        )}
      </div>
    </div>
  );
}

function LibCard({ elKey, unknown, onPointerDown }) {
  const meta = DB.META[elKey] || { e: '?', c: '#888', t: 0 };
  const pt = window.PeriodicTable?.BY_NAME[elKey?.toLowerCase()];
  if (unknown) {
    return (
      <div className="alc-lib-item alc-combo-unknown">
        <div className="alc-combo-qmark">?</div>
        <div className="alc-lib-name alc-combo-unknown-name">{fantasyName(elKey || '?')}</div>
      </div>
    );
  }
  if (pt) {
    const stateAbbr = { solid: 's', liquid: 'l', gas: 'g' }[pt.state] || '';
    return (
      <div className="alc-lib-item alc-lib-item--pt" data-tier={meta.t} style={{ '--tint': meta.c }} onPointerDown={onPointerDown}>
        <div className="alc-pt-z">{pt.z}</div>
        <div className="alc-pt-state">{stateAbbr}</div>
        <div className="alc-pt-icon"><PixelIcon elKey={elKey} /></div>
        <div className="alc-pt-name">{pt.name}</div>
      </div>
    );
  }
  return (
    <div className="alc-lib-item" data-tier={meta.t} style={{ '--tint': meta.c }} onPointerDown={onPointerDown}>
      <div className="alc-lib-emoji"><PixelIcon elKey={elKey} /></div>
      <div className="alc-lib-name">{DB.displayName(elKey)}</div>
    </div>
  );
}

function Library({ discovered, search, setSearch, filter, setFilter, libView: view, setLibView: setView, recent, recentKeys = new Set(), spawn, playRef, fx }) {

  const [detailKey, setDetailKey] = React.useState(null);
  const closeDetail = React.useCallback(() => setDetailKey(null), []);

  const [comboSearch, setComboSearch] = React.useState('');
  const [comboUndiscOnly, setComboUndiscOnly] = React.useState(false);
  const [comboLimit, setComboLimit] = React.useState(200);

  // reset render limit when search/filter changes
  React.useEffect(() => { setComboLimit(200); }, [comboSearch, comboUndiscOnly, view]);

  // combos: all recipes, filtered + sorted (inputs shown as ? if not yet discovered)
  const combos = React.useMemo(() => {
    if (view !== 'combos') return [];
    const q = comboSearch.trim().toLowerCase();
    let list = [...DB.RECIPES];
    if (q) {
      list = list.filter(({ a, b, r }) =>
        DB.displayName(a).toLowerCase().includes(q) ||
        DB.displayName(b).toLowerCase().includes(q) ||
        DB.displayName(r).toLowerCase().includes(q) ||
        a.includes(q) || b.includes(q) || r.includes(q)
      );
    }
    if (comboUndiscOnly) list = list.filter(({ r }) => !discovered.has(r));
    // sort: undiscovered first (by inputs available: 2→1→0), then by formula complexity asc, then discovered last
    list.sort((x, y) => {
      const xDisc = discovered.has(x.r) ? 1 : 0;
      const yDisc = discovered.has(y.r) ? 1 : 0;
      if (xDisc !== yDisc) return xDisc - yDisc;
      if (xDisc === 0) {
        const xAvail = (discovered.has(x.a) ? 1 : 0) + (discovered.has(x.b) ? 1 : 0);
        const yAvail = (discovered.has(y.a) ? 1 : 0) + (discovered.has(y.b) ? 1 : 0);
        if (xAvail !== yAvail) return yAvail - xAvail; // more available inputs first
      }
      const cDiff = formulaComplexity(x.r) - formulaComplexity(y.r);
      if (cDiff !== 0) return cDiff; // simpler formulas first within same tier
      return x.r.localeCompare(y.r);
    });
    return list;
  }, [view, discovered, comboSearch, comboUndiscOnly]);

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
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    if (moved >= 8 && playRef.current) {
      const r = playRef.current.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) {
        const hint = document.createElement('div');
        hint.className = 'alc-drop-hint';
        hint.textContent = 'drop on the play area';
        hint.style.left = e.clientX + 'px';
        hint.style.top = (e.clientY - 36) + 'px';
        document.body.appendChild(hint);
        hint.addEventListener('animationend', () => hint.remove(), { once: true });
      }
    }
    window.dispatchEvent(new CustomEvent('alchemia:librarydrop', {
      detail: { key: d.key, clientX: e.clientX, clientY: e.clientY }
    }));
    if (moved < 8) {
      if (view === 'elements') {
        setDetailKey(d.key);
      } else if (playRef.current) {
        const rect = playRef.current.getBoundingClientRect();
        const off = spiralOffset(++_spawnCounter);
        const x = rect.width / 2 - 32 + off.x;
        const y = rect.height / 2 - 32 + off.y;
        window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: d.key, x, y } }));
      }
    }
    dragRef.current = null;
  };

  return (
    <>
    {detailKey && <ElementDetail elKey={detailKey} onClose={closeDetail} />}
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
      {view === 'combos' && (
        <div className="alc-combo-toolbar">
          <input
            className="alc-search"
            placeholder="search recipes..."
            value={comboSearch}
            onChange={(e) => setComboSearch(e.target.value)}
          />
          <button
            className={`alc-combo-filter-btn${comboUndiscOnly ? ' active' : ''}`}
            onClick={() => setComboUndiscOnly(v => !v)}
            title="Show only unknown (undiscovered) results"
          >UNKNOWN</button>
        </div>
      )}
      {view === 'elements' && recent.length > 0 && (
        <div className="alc-recent">
          <div className="alc-recent-label">RECENT</div>
          <div className="alc-recent-row">
            {recent.slice(0, 6).map((k, i) => {
              const m = DB.META[k] || { e: '?', c: '#888' };
              return (
                <div key={i} className="alc-recent-dot" title={DB.displayName(k)} onPointerDown={(e) => onItemPointerDown(e, k)}>
                  <PixelIcon elKey={k} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="alc-library-scroll-area">
        <div className={`alc-library-list${view === 'combos' ? ' alc-combos-list' : ''}`} ref={listRef}>
          {view === 'combos' ? (
            combos.length === 0 ? (
              <div className="alc-lib-empty">
                {comboUndiscOnly && DB.RECIPES.length > 0
                  ? "You've found every combination."
                  : <>No combinations yet.<br/>Combine elements to unlock recipes.</>}
              </div>
            ) : (
              <>
                {combos.slice(0, comboLimit).map(({ a, b, r }, i) => (
                  <div key={i} className="alc-combo-row">
                    <LibCard elKey={a} unknown={!discovered.has(a)} onPointerDown={discovered.has(a) ? (e) => onItemPointerDown(e, a) : undefined} />
                    <div className="alc-combo-op">+</div>
                    <LibCard elKey={b} unknown={!discovered.has(b)} onPointerDown={discovered.has(b) ? (e) => onItemPointerDown(e, b) : undefined} />
                    <div className="alc-combo-op">=</div>
                    <LibCard elKey={r} unknown={!discovered.has(r)} onPointerDown={discovered.has(r) ? (e) => onItemPointerDown(e, r) : undefined} />
                    {discovered.has(a) && discovered.has(b) && (
                      <button
                        className="alc-combo-try-btn"
                        title="Place both ingredients on the play area"
                        onClick={() => {
                          if (!playRef.current) return;
                          const rect = playRef.current.getBoundingClientRect();
                          const y = rect.height / 2 - 32;
                          window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: a, x: rect.width / 2 - 80, y } }));
                          window.dispatchEvent(new CustomEvent('alchemia:spawn', { detail: { key: b, x: rect.width / 2 + 16, y } }));
                          if (window.innerWidth <= 900) {
                            document.documentElement.style.setProperty('--lib-h', SNAP_DEFAULT + 'px');
                          }
                        }}
                      >&#9654;</button>
                    )}
                  </div>
                ))}
                {comboLimit < combos.length && (
                  <button className="alc-combos-more" onClick={() => setComboLimit(n => n + 200)}>
                    + {combos.length - comboLimit} more
                  </button>
                )}
              </>
            )
          ) : (
            <>
              {items.map(({ key, meta }) => {
                const pt = window.PeriodicTable?.BY_NAME[key.toLowerCase()];
                if (pt) {
                  const stateAbbr = { solid: 's', liquid: 'l', gas: 'g' }[pt.state] || '';
                  return (
                    <div
                      key={key}
                      className={`alc-lib-item alc-lib-item--pt${recentKeys.has(key) ? ' is-recent' : ''}`}
                      data-tier={meta.t}
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
                    className={`alc-lib-item${recentKeys.has(key) ? ' is-recent' : ''}`}
                    data-tier={meta.t}
                    onPointerDown={(e) => onItemPointerDown(e, key)}
                    style={{ '--tint': meta.c }}
                    title={DB.displayName(key)}
                  >
                    <div className="alc-lib-emoji"><PixelIcon elKey={key} /></div>
                    <div className="alc-lib-name">{DB.displayName(key)}</div>
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
    </>
  );
}
