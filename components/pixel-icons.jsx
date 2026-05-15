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

// two beamed eighth notes; shows a diagonal slash in orange when muted
function PixelMusicNote({ muted = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 9 9" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      {/* beam connecting both stems */}
      <rect x="2" y="0" width="5" height="2"/>
      {/* left stem */}
      <rect x="2" y="0" width="1" height="7"/>
      {/* right stem */}
      <rect x="6" y="1" width="1" height="7"/>
      {/* left notehead */}
      <rect x="0" y="5" width="3" height="2"/>
      {/* right notehead */}
      <rect x="4" y="6" width="3" height="2"/>
      {muted && (
        <g fill="#FF5A1F">
          <rect x="0" y="8" width="1" height="1"/>
          <rect x="1" y="7" width="1" height="1"/>
          <rect x="2" y="6" width="1" height="1"/>
          <rect x="3" y="5" width="1" height="1"/>
          <rect x="4" y="4" width="1" height="1"/>
          <rect x="5" y="3" width="1" height="1"/>
          <rect x="6" y="2" width="1" height="1"/>
          <rect x="7" y="1" width="1" height="1"/>
          <rect x="8" y="0" width="1" height="1"/>
          <rect x="1" y="8" width="1" height="1"/>
          <rect x="2" y="7" width="1" height="1"/>
          <rect x="3" y="6" width="1" height="1"/>
          <rect x="4" y="5" width="1" height="1"/>
          <rect x="5" y="4" width="1" height="1"/>
          <rect x="6" y="3" width="1" height="1"/>
          <rect x="7" y="2" width="1" height="1"/>
          <rect x="8" y="1" width="1" height="1"/>
        </g>
      )}
    </svg>
  );
}

// pixel speaker with arc waves; shows an X in orange when muted
function PixelSpeaker({ muted = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 9 9" style={{ imageRendering: 'pixelated', display: 'block' }} fill="currentColor">
      {/* speaker body */}
      <rect x="0" y="2" width="2" height="5"/>
      {/* cone triangle expanding right */}
      <rect x="4" y="1" width="1" height="1"/>
      <rect x="3" y="2" width="2" height="1"/>
      <rect x="2" y="3" width="4" height="3"/>
      <rect x="3" y="6" width="2" height="1"/>
      <rect x="4" y="7" width="1" height="1"/>
      {muted ? (
        <g fill="#FF5A1F">
          <rect x="6" y="2" width="1" height="1"/>
          <rect x="7" y="3" width="1" height="1"/>
          <rect x="8" y="4" width="1" height="1"/>
          <rect x="8" y="2" width="1" height="1"/>
          <rect x="7" y="3" width="1" height="1"/>
          <rect x="6" y="4" width="1" height="1"/>
          <rect x="7" y="5" width="1" height="1"/>
          <rect x="8" y="6" width="1" height="1"/>
          <rect x="6" y="6" width="1" height="1"/>
        </g>
      ) : (
        <>
          <rect x="6" y="3" width="1" height="3"/>
          <rect x="8" y="2" width="1" height="5"/>
        </>
      )}
    </svg>
  );
}
