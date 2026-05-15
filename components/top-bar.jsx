// ============ top bar ============
function TopBar({ discoveredCount, total, totalRecipes, progress, onHelp, onReset, onClear, libView, onCombos, confirmReset, setConfirmReset, onResetConfirmed }) {
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (!confirmReset) return;
    timerRef.current = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(timerRef.current);
  }, [confirmReset]);

  const handleConfirm = () => {
    clearTimeout(timerRef.current);
    onResetConfirmed();
    setConfirmReset(false);
  };

  const handleCancel = () => {
    clearTimeout(timerRef.current);
    setConfirmReset(false);
  };

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
          <span className="alc-counter-tick" style={{ left: '25%' }} />
          <span className="alc-counter-tick" style={{ left: '50%' }} />
          <span className="alc-counter-tick" style={{ left: '75%' }} />
          <span className="alc-counter-tick" style={{ left: '100%' }} />
        </div>
        <div className="alc-counter-label">DISCOVERED</div>
      </div>
      <div className="alc-actions">
        <button className="alc-btn" onClick={onClear} title="Clear play area">CLEAR</button>
        <button className={`alc-btn alc-top-combos-btn${libView === 'combos' ? ' alc-btn-active' : ''}`} onClick={onCombos}>COMBOS</button>
        <button className="alc-btn" onClick={onHelp}>HOW</button>
        {confirmReset ? (
          <>
            <button className="alc-btn alc-btn--danger" onClick={handleConfirm} title="Confirm reset">CONFIRM ×</button>
            <button className="alc-btn" onClick={handleCancel}>CANCEL</button>
          </>
        ) : (
          <button className="alc-btn alc-btn-ghost" onClick={onReset} title="Reset progress">⟲</button>
        )}
      </div>
    </div>
  );
}
