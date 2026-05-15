// ============ top bar ============
function TopBar({ discoveredCount, total, totalRecipes, progress, onHelp, onReset, onClear, libView, onCombos }) {
  return (
    <div className="alc-topbar">
      <div className="alc-brand">
        <div className="alc-logo">ALCHEMIA</div>
        <div className="alc-tagline">an experiment in everything · {totalRecipes.toLocaleString()} recipes</div>
      </div>
      <div className="alc-counter">
        <div className="alc-counter-num">
          <span className="alc-counter-discovered">{discoveredCount}</span>
          <span className="alc-counter-slash">/</span>
          <span className="alc-counter-total">{total}</span>
        </div>
        <div className="alc-counter-bar">
          <div className="alc-counter-bar-fill" style={{ width: (progress * 100).toFixed(1) + '%' }} />
        </div>
        <div className="alc-counter-label">DISCOVERED</div>
      </div>
      <div className="alc-actions">
        <button className="alc-btn" onClick={onClear} title="Clear play area">CLEAR</button>
        <button className={`alc-btn${libView === 'combos' ? ' alc-btn-active' : ''}`} onClick={onCombos}>COMBOS</button>
        <button className="alc-btn" onClick={onHelp}>HOW</button>
        <button className="alc-btn alc-btn-ghost" onClick={onReset} title="Reset progress">⟲</button>
      </div>
    </div>
  );
}
