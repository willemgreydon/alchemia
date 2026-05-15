// shared pixel-icon component
function PixelIcon({ elKey, className = '' }) {
  const html = ICONS.renderIcon(elKey);
  return <div className={`alc-pixel ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

// pixel arrowheads for the library scroll strip
function PixelArrowUp() {
  return (
    <svg width="14" height="10" viewBox="0 0 7 5" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      <rect x="3" y="0" width="1" height="1"/>
      <rect x="2" y="1" width="3" height="1"/>
      <rect x="1" y="2" width="5" height="1"/>
      <rect x="0" y="3" width="7" height="1"/>
    </svg>
  );
}
function PixelArrowDown() {
  return (
    <svg width="14" height="10" viewBox="0 0 7 5" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      <rect x="0" y="0" width="7" height="1"/>
      <rect x="1" y="1" width="5" height="1"/>
      <rect x="2" y="2" width="3" height="1"/>
      <rect x="3" y="3" width="1" height="1"/>
    </svg>
  );
}
