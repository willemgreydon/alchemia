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
// 4-pointed pixel-art star used as toast spark decoration
function PixelSpark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      <rect x="4" y="0" width="1" height="2"/>
      <rect x="2" y="2" width="5" height="1"/>
      <rect x="1" y="3" width="7" height="1"/>
      <rect x="0" y="4" width="9" height="1"/>
      <rect x="1" y="5" width="7" height="1"/>
      <rect x="2" y="6" width="5" height="1"/>
      <rect x="4" y="7" width="1" height="2"/>
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
