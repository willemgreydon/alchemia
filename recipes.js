// ALCHEMIA — recipe database
// 4 base elements → curated tier ladder → procedural modifier expansion to 1,500+

(function () {
  'use strict';

  // ---------- Element metadata (curated) ----------
  // emoji is used as the icon; color drives the tile tint + particle bursts.
  const META = {
    // Tier 0 (primal)
    water:    { e: '💧', c: '#3B7DD8', t: 0 },
    fire:     { e: '🔥', c: '#FF5A1F', t: 0 },
    earth:    { e: '🪨', c: '#8B6F47', t: 0 },
    air:      { e: '🌬️', c: '#A8C8DB', t: 0 },

    // Tier 1 derived
    steam:    { e: '♨️', c: '#B8D4E3', t: 1 },
    mud:      { e: '🟫', c: '#6E4B2A', t: 1 },
    lava:     { e: '🌋', c: '#E84518', t: 1 },
    dust:     { e: '🌫️', c: '#C9B89A', t: 1 },
    energy:   { e: '⚡', c: '#FFC838', t: 1 },
    rain:     { e: '🌧️', c: '#5B8FBF', t: 1 },
    sea:      { e: '🌊', c: '#1F6FB3', t: 1 },
    stone:    { e: '🗿', c: '#7A7268', t: 1 },
    sand:     { e: '🏖️', c: '#E5C99B', t: 1 },
    pressure: { e: '💢', c: '#5F4A8B', t: 1 },

    // Tier 2
    cloud:    { e: '☁️', c: '#DDE6EE', t: 2 },
    plant:    { e: '🌱', c: '#5BB85B', t: 2 },
    metal:    { e: '⚙️', c: '#9098A4', t: 2 },
    glass:    { e: '🔮', c: '#BFE3E0', t: 2 },
    brick:    { e: '🧱', c: '#B85638', t: 2 },
    desert:   { e: '🏜️', c: '#D8B070', t: 2 },
    mountain: { e: '⛰️', c: '#6B7A8A', t: 2 },
    ocean:    { e: '🌊', c: '#0E5A99', t: 2 },
    swamp:    { e: '🥬', c: '#4A6B3A', t: 2 },
    obsidian: { e: '⬛', c: '#1B1820', t: 2 },
    geyser:   { e: '⛲', c: '#7BB0D6', t: 2 },
    rust:     { e: '🟤', c: '#8B4A1F', t: 2 },
    smoke:    { e: '💨', c: '#7A7670', t: 2 },
    ash:      { e: '🪦', c: '#3F3A36', t: 2 },
    wind:     { e: '🍃', c: '#A8D8B0', t: 2 },
    salt:     { e: '🧂', c: '#EFEEE8', t: 2 },
    crystal:  { e: '💎', c: '#9BD4D4', t: 2 },
    sky:      { e: '🌌', c: '#88AED9', t: 2 },

    // Tier 3
    tree:     { e: '🌳', c: '#3F8E3F', t: 3 },
    grass:    { e: '🌿', c: '#79C24E', t: 3 },
    flower:   { e: '🌸', c: '#F09BC2', t: 3 },
    moss:     { e: '🍀', c: '#4E8C4A', t: 3 },
    coal:     { e: '🪨', c: '#262321', t: 3 },
    iron:     { e: '🔩', c: '#8B8B92', t: 3 },
    gold:     { e: '🪙', c: '#FFC83D', t: 3 },
    silver:   { e: '🥈', c: '#C8CCD2', t: 3 },
    copper:   { e: '🥉', c: '#B97A4A', t: 3 },
    diamond:  { e: '💎', c: '#E0F7FF', t: 3 },
    ice:      { e: '🧊', c: '#A8D8E8', t: 3 },
    snow:     { e: '❄️', c: '#E8F0F8', t: 3 },
    storm:    { e: '⛈️', c: '#4A4A6E', t: 3 },
    lightning:{ e: '⚡', c: '#FFE438', t: 3 },
    rainbow:  { e: '🌈', c: '#E84a7A', t: 3 },
    fog:      { e: '🌁', c: '#C8CBCF', t: 3 },
    star:     { e: '⭐', c: '#FFD938', t: 3 },
    moon:     { e: '🌙', c: '#D8D6C0', t: 3 },
    sun:      { e: '☀️', c: '#FFB418', t: 3 },
    forest:   { e: '🌲', c: '#2E5E2E', t: 3 },
    river:    { e: '🏞️', c: '#3A85B8', t: 3 },
    lake:     { e: '🏕️', c: '#2D72A8', t: 3 },
    island:   { e: '🏝️', c: '#5BAE6E', t: 3 },
    volcano:  { e: '🌋', c: '#C8341F', t: 3 },
    canyon:   { e: '🪨', c: '#A85A38', t: 3 },
    waterfall:{ e: '🏞', c: '#5BA8D8', t: 3 },
    pebble:   { e: '🥚', c: '#8E847A', t: 3 },
    boulder:  { e: '🗿', c: '#5F584F', t: 3 },
    clay:     { e: '🧱', c: '#A85B45', t: 3 },
    pottery:  { e: '🏺', c: '#B86F45', t: 3 },

    // Tier 4 — life
    life:     { e: '✨', c: '#FF7AB6', t: 4 },
    seed:     { e: '🌰', c: '#8E6235', t: 4 },
    fruit:    { e: '🍎', c: '#E64545', t: 4 },
    vegetable:{ e: '🥕', c: '#E08838', t: 4 },
    mushroom: { e: '🍄', c: '#D04848', t: 4 },
    algae:    { e: '🟢', c: '#3F8E3F', t: 4 },
    bacteria: { e: '🦠', c: '#7BC857', t: 4 },
    egg:      { e: '🥚', c: '#F4E8C4', t: 4 },
    bird:     { e: '🐦', c: '#5B9BD8', t: 4 },
    fish:     { e: '🐟', c: '#4A8DB8', t: 4 },
    lizard:   { e: '🦎', c: '#5EB85B', t: 4 },
    snake:    { e: '🐍', c: '#5B8E3F', t: 4 },
    cat:      { e: '🐈', c: '#B89B6F', t: 4 },
    dog:      { e: '🐕', c: '#A87E55', t: 4 },
    horse:    { e: '🐎', c: '#7E5535', t: 4 },
    cow:      { e: '🐄', c: '#3A3530', t: 4 },
    sheep:    { e: '🐑', c: '#EAE5D8', t: 4 },
    wolf:     { e: '🐺', c: '#5F574E', t: 4 },
    bear:     { e: '🐻', c: '#6E4A2A', t: 4 },
    dolphin:  { e: '🐬', c: '#6BA8D8', t: 4 },
    whale:    { e: '🐋', c: '#3A6E9E', t: 4 },
    shark:    { e: '🦈', c: '#6E7A88', t: 4 },
    octopus:  { e: '🐙', c: '#D04A8A', t: 4 },
    butterfly:{ e: '🦋', c: '#D89BE8', t: 4 },
    bee:      { e: '🐝', c: '#FFB418', t: 4 },
    spider:   { e: '🕷️', c: '#3A3530', t: 4 },
    dragon:   { e: '🐉', c: '#3F8E5F', t: 4 },
    phoenix:  { e: '🔥', c: '#FF7A28', t: 4 },
    unicorn:  { e: '🦄', c: '#F9B8E4', t: 4 },
    kraken:   { e: '🐙', c: '#1F4A6E', t: 4 },

    // Tier 5 — civilization / abstract
    human:    { e: '🧍', c: '#D8A878', t: 5 },
    farmer:   { e: '🧑‍🌾', c: '#A88B5F', t: 5 },
    sailor:   { e: '🧑‍✈️', c: '#3F7AA8', t: 5 },
    knight:   { e: '🛡️', c: '#A8AEB8', t: 5 },
    wizard:   { e: '🧙', c: '#7A4AB8', t: 5 },
    blacksmith:{ e: '🔨', c: '#5F4A3F', t: 5 },
    baker:    { e: '🧑‍🍳', c: '#E0B868', t: 5 },
    village:  { e: '🏘️', c: '#C8A878', t: 5 },
    city:     { e: '🏙️', c: '#7E8AA0', t: 5 },
    castle:   { e: '🏰', c: '#9098A4', t: 5 },
    pyramid:  { e: '🔺', c: '#D8B070', t: 5 },
    temple:   { e: '⛩️', c: '#C84545', t: 5 },
    bridge:   { e: '🌉', c: '#6B7A8A', t: 5 },
    road:     { e: '🛣️', c: '#5F584F', t: 5 },
    farm:     { e: '🚜', c: '#8EB85B', t: 5 },
    boat:     { e: '⛵', c: '#A87555', t: 5 },
    ship:     { e: '🚢', c: '#4A6E8E', t: 5 },
    sword:    { e: '⚔️', c: '#B8BBC0', t: 5 },
    bow:      { e: '🏹', c: '#8B6F47', t: 5 },
    book:     { e: '📕', c: '#A8453F', t: 5 },
    scroll:   { e: '📜', c: '#D8C898', t: 5 },
    potion:   { e: '🧪', c: '#7AC868', t: 5 },
    magic:    { e: '✨', c: '#B85AE8', t: 5 },
    spell:    { e: '🪄', c: '#9098D8', t: 5 },
    ghost:    { e: '👻', c: '#D8D5D0', t: 5 },
    skeleton: { e: '💀', c: '#E8E5D8', t: 5 },
    zombie:   { e: '🧟', c: '#7AAE5B', t: 5 },
    vampire:  { e: '🧛', c: '#7E1F3F', t: 5 },
    angel:    { e: '👼', c: '#FBE89B', t: 5 },
    demon:    { e: '👹', c: '#C8281F', t: 5 },
    god:      { e: '🌟', c: '#FFD938', t: 5 },
    soul:     { e: '🕯️', c: '#FBE8C8', t: 5 },
    time:     { e: '⏳', c: '#7A6E5F', t: 5 },
    space:    { e: '🌌', c: '#1F1F4E', t: 5 },
    galaxy:   { e: '🌠', c: '#4A2E7A', t: 5 },
    planet:   { e: '🪐', c: '#C87E45', t: 5 },
    blackhole:{ e: '⚫', c: '#0A0A14', t: 5 },
    nebula:   { e: '🌫', c: '#A85AC8', t: 5 },
    comet:    { e: '☄️', c: '#9BB8E0', t: 5 },
    meteor:   { e: '🌠', c: '#FF7A28', t: 5 },
    asteroid: { e: '🌑', c: '#5F584F', t: 5 },
    void:     { e: '⬛', c: '#0A0A0A', t: 5 },
    chaos:    { e: '🌀', c: '#A8285A', t: 5 },
    order:    { e: '◯', c: '#3A6E9E', t: 5 },
    light:    { e: '🔆', c: '#FFF4C8', t: 5 },
    shadow:   { e: '🌑', c: '#1A1820', t: 5 },
    wisdom:   { e: '🦉', c: '#7A5B3A', t: 5 },
    love:     { e: '💗', c: '#FF5A8E', t: 5 },
    music:    { e: '🎵', c: '#7AAEE0', t: 5 },
    art:      { e: '🎨', c: '#E8455B', t: 5 },
    dream:    { e: '💭', c: '#C8C8E8', t: 5 },
    nightmare:{ e: '😱', c: '#3F1F3F', t: 5 },
    idea:     { e: '💡', c: '#FFD938', t: 5 },
    story:    { e: '📖', c: '#B85B3F', t: 5 },
    money:    { e: '💰', c: '#FFC838', t: 5 },
    coin:     { e: '🪙', c: '#FFB418', t: 5 },
    machine:  { e: '⚙️', c: '#7A7E88', t: 5 },
    robot:    { e: '🤖', c: '#B8BBC0', t: 5 },
    computer: { e: '💻', c: '#3A3F4A', t: 5 },
    internet: { e: '🛰️', c: '#3F8BC8', t: 5 },
    alchemia: { e: '🧬', c: '#E84A7A', t: 9 }
  };

  // ---------- Curated recipes ----------
  // [a, b, result] — order-agnostic; lookup normalizes.
  const HAND = [
    // Tier 0 → 1
    ['water','fire','steam'],
    ['water','earth','mud'],
    ['fire','earth','lava'],
    ['water','air','rain'],
    ['fire','air','energy'],
    ['earth','air','dust'],
    ['water','water','sea'],
    ['fire','fire','energy'],
    ['earth','earth','mountain'],
    ['air','air','wind'],
    ['water','wind','rain'],
    ['earth','water','sand'],
    ['earth','fire','stone'],
    ['air','pressure','wind'],
    ['earth','pressure','stone'],

    // Tier 1 → 2
    ['steam','air','cloud'],
    ['water','sand','sea'],
    ['mud','plant','swamp'],
    ['water','earth','plant'],
    ['lava','water','obsidian'],
    ['lava','air','stone'],
    ['stone','fire','metal'],
    ['sand','fire','glass'],
    ['mud','fire','brick'],
    ['sand','sea','desert'],
    ['stone','stone','mountain'],
    ['water','sea','ocean'],
    ['fire','smoke','ash'],
    ['fire','wood','smoke'],
    ['water','salt','sea'],
    ['sea','salt','salt'],
    ['mountain','water','geyser'],
    ['metal','water','rust'],
    ['stone','water','pebble'],
    ['pebble','pebble','stone'],
    ['stone','pressure','crystal'],
    ['cloud','air','sky'],

    // Tier 2 → 3
    ['plant','plant','grass'],
    ['plant','earth','tree'],
    ['tree','tree','forest'],
    ['grass','grass','field'],
    ['plant','flower','flower'],
    ['plant','water','moss'],
    ['tree','fire','coal'],
    ['coal','pressure','diamond'],
    ['metal','fire','iron'],
    ['metal','sun','gold'],
    ['metal','moon','silver'],
    ['metal','earth','copper'],
    ['water','cold','ice'],
    ['water','air','cloud'],
    ['cloud','cold','snow'],
    ['cloud','energy','storm'],
    ['storm','sky','lightning'],
    ['rain','sun','rainbow'],
    ['air','water','fog'],
    ['sky','night','star'],
    ['sky','star','moon'],
    ['sky','fire','sun'],
    ['mountain','river','waterfall'],
    ['river','river','lake'],
    ['lake','lake','sea'],
    ['ocean','earth','island'],
    ['mountain','lava','volcano'],
    ['earth','river','canyon'],
    ['boulder','water','pebble'],
    ['stone','stone','boulder'],
    ['mud','sun','clay'],
    ['clay','fire','pottery'],

    // Tier 3 → 4 (life)
    ['energy','swamp','life'],
    ['lightning','swamp','life'],
    ['water','life','algae'],
    ['mud','life','bacteria'],
    ['life','tree','fruit'],
    ['plant','life','seed'],
    ['seed','earth','plant'],
    ['plant','farm','vegetable'],
    ['plant','moss','mushroom'],
    ['life','egg','bird'],
    ['water','life','fish'],
    ['life','desert','lizard'],
    ['life','swamp','snake'],
    ['life','wolf','dog'],
    ['life','forest','cat'],
    ['life','grass','horse'],
    ['life','farm','cow'],
    ['cow','cloud','sheep'],
    ['life','mountain','wolf'],
    ['life','cave','bear'],
    ['life','ocean','dolphin'],
    ['dolphin','ocean','whale'],
    ['life','sea','shark'],
    ['ocean','life','octopus'],
    ['life','flower','butterfly'],
    ['life','flower','bee'],
    ['life','web','spider'],
    ['lizard','fire','dragon'],
    ['fire','life','phoenix'],
    ['horse','rainbow','unicorn'],
    ['octopus','storm','kraken'],
    ['bird','bird','egg'],
    ['fish','fish','egg'],

    // Tier 4 → 5 (civilization & abstract)
    ['life','stone','human'],
    ['human','plant','farmer'],
    ['human','boat','sailor'],
    ['human','sword','knight'],
    ['human','magic','wizard'],
    ['human','metal','blacksmith'],
    ['human','fire','baker'],
    ['human','human','village'],
    ['village','village','city'],
    ['village','stone','castle'],
    ['stone','desert','pyramid'],
    ['stone','god','temple'],
    ['stone','river','bridge'],
    ['stone','village','road'],
    ['farmer','field','farm'],
    ['wood','sea','boat'],
    ['boat','metal','ship'],
    ['metal','blacksmith','sword'],
    ['wood','blacksmith','bow'],
    ['scroll','wisdom','book'],
    ['paper','idea','scroll'],
    ['water','plant','potion'],
    ['energy','wisdom','magic'],
    ['magic','word','spell'],
    ['human','death','ghost'],
    ['human','time','skeleton'],
    ['human','disease','zombie'],
    ['human','shadow','vampire'],
    ['human','god','angel'],
    ['human','demon','demon'],
    ['light','life','god'],
    ['life','death','soul'],
    ['void','order','time'],
    ['void','sky','space'],
    ['space','star','galaxy'],
    ['space','earth','planet'],
    ['star','time','blackhole'],
    ['space','cloud','nebula'],
    ['star','fire','comet'],
    ['fire','sky','meteor'],
    ['rock','space','asteroid'],
    ['nothing','nothing','void'],
    ['void','life','chaos'],
    ['void','time','order'],
    ['fire','sky','light'],
    ['light','void','shadow'],
    ['book','time','wisdom'],
    ['life','life','love'],
    ['sound','order','music'],
    ['human','dream','art'],
    ['sleep','idea','dream'],
    ['dream','shadow','nightmare'],
    ['human','energy','idea'],
    ['book','dream','story'],
    ['gold','human','money'],
    ['gold','pressure','coin'],
    ['metal','energy','machine'],
    ['machine','life','robot'],
    ['machine','wisdom','computer'],
    ['computer','energy','internet'],

    // Closing: Alchemia itself
    ['magic','wisdom','alchemia'],
    ['god','wisdom','alchemia'],
    ['phoenix','dragon','alchemia']
  ];

  // ---------- Procedural modifier expansion ----------
  // For each modifier × each existing element → variant element + recipe.
  // This is what pushes us past 1,500. Each modifier has a verb, prefix, emoji and color tint.
  const MODIFIERS = [
    { key: 'life',      prefix: 'living',     emoji: '✨', tint: '#FF7AB6' },
    { key: 'ice',       prefix: 'frozen',    emoji: '🧊', tint: '#A8D8E8' },
    { key: 'fire',      prefix: 'burning',   emoji: '🔥', tint: '#FF5A1F' },
    { key: 'time',      prefix: 'ancient',   emoji: '⏳', tint: '#7A6E5F' },
    { key: 'magic',     prefix: 'enchanted', emoji: '✨', tint: '#B85AE8' },
    { key: 'shadow',    prefix: 'shadow',    emoji: '🌑', tint: '#3F2F4A' },
    { key: 'light',     prefix: 'radiant',   emoji: '🔆', tint: '#FFE8A8' },
    { key: 'gold',      prefix: 'golden',    emoji: '🪙', tint: '#FFC838' },
    { key: 'crystal',   prefix: 'crystal',   emoji: '💎', tint: '#9BD4D4' }
  ];

  // build everything
  function build() {
    // ensure every element in HAND has META (some hand recipes mention placeholders we don't fully model)
    const allRecipes = [];
    const seenKey = new Set();

    function addRecipe(a, b, r) {
      const key = [a, b].sort().join('|');
      if (seenKey.has(key)) return false;
      seenKey.add(key);
      allRecipes.push({ a, b, r });
      return true;
    }

    // helper aliases for compound concepts we mention but don't fully grow
    const aliases = {
      cold: 'ice', night: 'shadow', wood: 'tree', web: 'spider', cave: 'mountain',
      death: 'void', disease: 'swamp', word: 'book', sleep: 'shadow', sound: 'air',
      paper: 'tree', nothing: 'void', field: 'grass', rock: 'stone'
    };
    function resolve(name) { return aliases[name] || name; }

    // Hand recipes
    for (const [a, b, r] of HAND) {
      const A = resolve(a), B = resolve(b), R = resolve(r);
      if (!META[R]) META[R] = { e: '✨', c: '#999', t: 5 };
      addRecipe(A, B, R);
    }

    // Procedural modifier recipes
    const baseKeys = Object.keys(META).filter(k => META[k].t < 9);
    for (const mod of MODIFIERS) {
      const modEl = mod.key;
      if (!META[modEl]) continue;
      for (const el of baseKeys) {
        if (el === modEl) continue;
        // skip variants of variants to avoid runaway
        if (el.includes('-')) continue;
        const variant = `${mod.prefix}-${el}`;
        if (!META[variant]) {
          const base = META[el];
          META[variant] = {
            e: `${base.e}${mod.emoji}`,
            c: mod.tint,
            t: Math.max(base.t, META[modEl].t) + 1,
            displayName: `${mod.prefix.replace(/^\w/, c => c.toUpperCase())} ${prettify(el)}`
          };
        }
        addRecipe(modEl, el, variant);
      }
    }

    return allRecipes;
  }

  function prettify(name) {
    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const RECIPES = build();

  // build a fast lookup map keyed by "a|b" (sorted)
  const LOOKUP = new Map();
  for (const { a, b, r } of RECIPES) {
    LOOKUP.set([a, b].sort().join('|'), r);
  }

  function combine(a, b) {
    return LOOKUP.get([a, b].sort().join('|')) || null;
  }

  function displayName(key) {
    const m = META[key];
    if (m && m.displayName) return m.displayName;
    return prettify(key);
  }

  // base elements always discovered at start
  const STARTERS = ['water', 'fire', 'earth', 'air'];

  window.ALCHEMIA_DB = {
    META, RECIPES, LOOKUP, STARTERS,
    combine, displayName, prettify,
    totalRecipes: RECIPES.length,
    totalElements: Object.keys(META).length
  };
})();
