// ============ help ============
function Help({ onClose, totalRecipes }) {
  return (
    <div className="alc-help-backdrop" onClick={onClose}>
      <div className="alc-help" onClick={(e) => e.stopPropagation()}>
        <div className="alc-help-eye">◉</div>
        <div className="alc-help-title">ALCHEMIA</div>
        <div className="alc-help-sub">a playground for combining the world</div>
        <div className="alc-help-rules">
          <div className="alc-help-row">
            <div className="alc-help-num">01</div>
            <div className="alc-help-body">
              <b>drag or tap</b> an element from the library into the play area.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">02</div>
            <div className="alc-help-body">
              <b>drop one element onto another</b> to combine them. you'll feel it.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">03</div>
            <div className="alc-help-body">
              every successful combine unlocks a <b>new element</b> in your library. {totalRecipes.toLocaleString()} recipes await.
            </div>
          </div>
          <div className="alc-help-row">
            <div className="alc-help-num">04</div>
            <div className="alc-help-body">
              tap × or long-press a tile to remove it from the play area.
            </div>
          </div>
        </div>
        <div className="alc-help-start" onClick={onClose}>BEGIN →</div>
        <div className="alc-help-footnote">start with all 118 periodic table elements — combine them to discover everything else</div>
      </div>
    </div>
  );
}
