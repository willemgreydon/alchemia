# ALCHEMIA

A browser-based alchemy game. Combine all 118 periodic table elements to discover hundreds of new substances.

## How to play

Open `Alchemia.html` in a browser — no build step, no server required.

Drag elements from the library onto the canvas and drop them on top of each other to combine. New discoveries unlock more recipes.

## Project structure

```
Alchemia.html          entry point — loads scripts in order
styles.css             all CSS (reset, layout, animations, responsive)

app.jsx                root App component, audio engine, useAmbient hook
components/
  pixel-icons.jsx      PixelIcon, PixelArrowUp, PixelArrowDown
  top-bar.jsx          TopBar
  play-area.jsx        PlayArea, Tile
  library.jsx          Library, LibCard
  hint-ticker.jsx      HintTicker
  toasts.jsx           Toasts
  help.jsx             Help

icons.js               procedural pixel-art icon renderer (14×14 grid, multiframe)
recipes.js             element metadata + recipe database (~1 500 recipes)
engine.js              canvas FX — ambient glow + particle bursts
periodic-elements.js   all 118 periodic table elements with atomic data
tweaks-panel.jsx       dev-only tweaks panel
```

## Tech

No bundler. React 18 + Babel loaded from CDN, JSX compiled in-browser. Plain JS for game logic.
