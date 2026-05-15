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

    // Tier 5 — homodiatomic molecules
    dihydrogen:         { e: '💨', c: '#55EFC4', t: 5, displayName: 'Dihydrogen (H₂)' },
    dioxygen:           { e: '🫧', c: '#55EFC4', t: 5, displayName: 'Dioxygen (O₂)' },
    dinitrogen:         { e: '🌬️', c: '#55EFC4', t: 5, displayName: 'Dinitrogen (N₂)' },
    difluorine:         { e: '🟡', c: '#FDCB6E', t: 5, displayName: 'Difluorine (F₂)' },
    dichlorine:         { e: '🟩', c: '#FDCB6E', t: 5, displayName: 'Dichlorine (Cl₂)' },
    dibromine:          { e: '🟤', c: '#FDCB6E', t: 5, displayName: 'Dibromine (Br₂)' },
    diiodine:           { e: '🟣', c: '#FDCB6E', t: 5, displayName: 'Diiodine (I₂)' },
    disulfur:           { e: '🟨', c: '#FDD835', t: 5, displayName: 'Disulfur (S₂)' },

    // Tier 5–6 — key inorganic compounds
    // Binary hydrides & acids
    ammonia:            { e: '🫧', c: '#A8D8E8', t: 5, displayName: 'Ammonia (NH₃)' },
    'hydrogen-sulfide': { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Sulfide (H₂S)' },
    'hydrogen-chloride':{ e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Chloride (HCl)' },
    'hydrogen-fluoride':{ e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Fluoride (HF)' },
    'hydrogen-iodide':  { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Iodide (HI)' },
    // Carbon oxides
    'carbon-monoxide':  { e: '💨', c: '#4A4A4A', t: 5, displayName: 'Carbon Monoxide (CO)' },
    'carbon-dioxide':   { e: '💨', c: '#A8C8DB', t: 5, displayName: 'Carbon Dioxide (CO₂)' },
    // Sulfur oxides
    'sulfur-dioxide':   { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Sulfur Dioxide (SO₂)' },
    'sulfur-trioxide':  { e: '💨', c: '#FDD835', t: 5, displayName: 'Sulfur Trioxide (SO₃)' },
    // Nitrogen oxides
    'nitrogen-monoxide':{ e: '💨', c: '#DDE6EE', t: 5, displayName: 'Nitric Oxide (NO)' },
    'nitrogen-dioxide': { e: '🟫', c: '#E17055', t: 5, displayName: 'Nitrogen Dioxide (NO₂)' },
    // Ozone
    ozone:              { e: '🫧', c: '#55EFC4', t: 5, displayName: 'Ozone (O₃)' },
    // Acids (from oxides + water)
    'sulfuric-acid':    { e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Sulfuric Acid (H₂SO₄)' },
    'nitric-acid':      { e: '🧪', c: '#E17055', t: 6, displayName: 'Nitric Acid (HNO₃)' },
    'carbonic-acid':    { e: '🧪', c: '#A8C8DB', t: 6, displayName: 'Carbonic Acid (H₂CO₃)' },
    'hydrochloric-acid':{ e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Hydrochloric Acid (HCl aq)' },
    'hydrofluoric-acid':{ e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Hydrofluoric Acid (HF aq)' },
    'phosphoric-acid':  { e: '🧪', c: '#55EFC4', t: 6, displayName: 'Phosphoric Acid (H₃PO₄)' },
    // Hydroxides
    'sodium-hydroxide': { e: '🧪', c: '#FF6B6B', t: 6, displayName: 'Sodium Hydroxide (NaOH)' },
    'calcium-hydroxide':{ e: '🧪', c: '#FF9F43', t: 6, displayName: 'Calcium Hydroxide (Ca(OH)₂)' },
    'potassium-hydroxide':{ e: '🧪', c: '#FF6B6B', t: 6, displayName: 'Potassium Hydroxide (KOH)' },
    'iron-hydroxide':   { e: '🟫', c: '#8B4A1F', t: 6, displayName: 'Iron Hydroxide (Fe(OH)₃)' },
    // Metal oxides
    'magnesium-oxide':  { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Magnesium Oxide (MgO)' },
    'calcium-oxide':    { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Calcium Oxide (CaO / quicklime)' },
    'iron-oxide':       { e: '🟤', c: '#8B4A1F', t: 5, displayName: 'Iron Oxide (Fe₂O₃)' },
    'copper-oxide':     { e: '🟤', c: '#B97A4A', t: 5, displayName: 'Copper Oxide (CuO)' },
    'aluminum-oxide':   { e: '⚪', c: '#74B9FF', t: 5, displayName: 'Aluminum Oxide (Al₂O₃)' },
    'silicon-dioxide':  { e: '💎', c: '#A29BFE', t: 5, displayName: 'Silicon Dioxide (SiO₂)' },
    'zinc-oxide':       { e: '⚪', c: '#9098A4', t: 5, displayName: 'Zinc Oxide (ZnO)' },
    'titanium-dioxide': { e: '⚪', c: '#9098A4', t: 5, displayName: 'Titanium Dioxide (TiO₂)' },
    // Metal halides
    'sodium-chloride':  { e: '🧂', c: '#EFEEE8', t: 5, displayName: 'Sodium Chloride (NaCl)' },
    'potassium-chloride':{ e: '🧂', c: '#EFEEE8', t: 5, displayName: 'Potassium Chloride (KCl)' },
    'calcium-chloride': { e: '🧂', c: '#FF9F43', t: 5, displayName: 'Calcium Chloride (CaCl₂)' },
    'iron-chloride':    { e: '🧂', c: '#8B4A1F', t: 5, displayName: 'Iron(III) Chloride (FeCl₃)' },
    'copper-chloride':  { e: '🧂', c: '#B97A4A', t: 5, displayName: 'Copper Chloride (CuCl₂)' },
    'silver-chloride':  { e: '⬜', c: '#C8CCD2', t: 5, displayName: 'Silver Chloride (AgCl)' },
    // Metal sulfides
    'iron-sulfide':     { e: '🟤', c: '#8B4A1F', t: 5, displayName: 'Iron Sulfide (FeS)' },
    'copper-sulfide':   { e: '🟤', c: '#B97A4A', t: 5, displayName: 'Copper Sulfide (CuS)' },
    'zinc-sulfide':     { e: '✨', c: '#9098A4', t: 5, displayName: 'Zinc Sulfide (ZnS)' },
    // Metal nitrides
    'lithium-nitride':  { e: '🔴', c: '#FF6B6B', t: 5, displayName: 'Lithium Nitride (Li₃N)' },
    'calcium-nitride':  { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Calcium Nitride (Ca₃N₂)' },
    // Metal carbonates
    'calcium-carbonate':{ e: '🪨', c: '#FF9F43', t: 6, displayName: 'Calcium Carbonate (CaCO₃)' },
    'sodium-carbonate': { e: '🧂', c: '#FF6B6B', t: 6, displayName: 'Sodium Carbonate (Na₂CO₃)' },
    // Organic
    methane:            { e: '💨', c: '#55EFC4', t: 6, displayName: 'Methane (CH₄)' },
    ethylene:           { e: '💨', c: '#55EFC4', t: 6, displayName: 'Ethylene (C₂H₄)' },
    acetylene:          { e: '💨', c: '#55EFC4', t: 6, displayName: 'Acetylene (C₂H₂)' },
    ethanol:            { e: '🍶', c: '#DDE6EE', t: 7, displayName: 'Ethanol (C₂H₅OH)' },
    'acetic-acid':      { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Acetic Acid (CH₃COOH)' },
    glucose:            { e: '🍬', c: '#FFC838', t: 7, displayName: 'Glucose (C₆H₁₂O₆)' },
    urea:               { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Urea (CO(NH₂)₂)' },

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
    alchemia: { e: '🧬', c: '#E84A7A', t: 9 },

    // ---------- Periodic Table (all 118 elements) ----------
    // iron, gold, silver, copper already defined above.
    // Colors: nonmetal #55EFC4 · halogen #FDCB6E · noble gas #81ECEC
    //         alkali #FF6B6B · alk-earth #FF9F43 · transition #9098A4
    //         post-trans #74B9FF · metalloid #A29BFE
    //         lanthanide #FD79A8 · actinide #E17055

    // Period 1
    hydrogen:      { e: '💨', c: '#55EFC4', t: 6 },
    helium:        { e: '🎈', c: '#81ECEC', t: 6 },
    // Period 2
    lithium:       { e: '🔋', c: '#FF6B6B', t: 6 },
    beryllium:     { e: '⚪', c: '#FF9F43', t: 6 },
    boron:         { e: '🪨', c: '#A29BFE', t: 6 },
    carbon:        { e: '⬛', c: '#262321', t: 6 },
    nitrogen:      { e: '🌬️', c: '#55EFC4', t: 6 },
    oxygen:        { e: '🫧', c: '#55EFC4', t: 6 },
    fluorine:      { e: '🟡', c: '#FDCB6E', t: 6 },
    neon:          { e: '💡', c: '#81ECEC', t: 6 },
    // Period 3
    sodium:        { e: '🧂', c: '#FF6B6B', t: 6 },
    magnesium:     { e: '✨', c: '#FF9F43', t: 6 },
    aluminum:      { e: '🥤', c: '#74B9FF', t: 6 },
    silicon:       { e: '💻', c: '#A29BFE', t: 6 },
    phosphorus:    { e: '🔴', c: '#55EFC4', t: 6 },
    sulfur:        { e: '🟨', c: '#55EFC4', t: 6 },
    chlorine:      { e: '🟩', c: '#FDCB6E', t: 6 },
    argon:         { e: '🫙', c: '#81ECEC', t: 6 },
    // Period 4
    potassium:     { e: '🍌', c: '#FF6B6B', t: 7 },
    calcium:       { e: '🦴', c: '#FF9F43', t: 7 },
    scandium:      { e: '🔬', c: '#9098A4', t: 7 },
    titanium:      { e: '🚀', c: '#9098A4', t: 7 },
    vanadium:      { e: '🔩', c: '#9098A4', t: 7 },
    chromium:      { e: '🪞', c: '#9098A4', t: 7 },
    manganese:     { e: '🔧', c: '#9098A4', t: 7 },
    cobalt:        { e: '🔵', c: '#9098A4', t: 7 },
    nickel:        { e: '🪙', c: '#9098A4', t: 7 },
    zinc:          { e: '🪣', c: '#9098A4', t: 7 },
    gallium:       { e: '🌡️', c: '#74B9FF', t: 7 },
    germanium:     { e: '🖥️', c: '#A29BFE', t: 7 },
    arsenic:       { e: '☠️', c: '#A29BFE', t: 7 },
    selenium:      { e: '🔆', c: '#55EFC4', t: 7 },
    bromine:       { e: '🟤', c: '#FDCB6E', t: 7 },
    krypton:       { e: '🦸', c: '#81ECEC', t: 7 },
    // Period 5
    rubidium:      { e: '💜', c: '#FF6B6B', t: 7 },
    strontium:     { e: '🎆', c: '#FF9F43', t: 7 },
    yttrium:       { e: '🔭', c: '#9098A4', t: 7 },
    zirconium:     { e: '💍', c: '#9098A4', t: 7 },
    niobium:       { e: '⚙️', c: '#9098A4', t: 7 },
    molybdenum:    { e: '🔩', c: '#9098A4', t: 7 },
    technetium:    { e: '☢️', c: '#9098A4', t: 7 },
    ruthenium:     { e: '🪩', c: '#9098A4', t: 7 },
    rhodium:       { e: '🏅', c: '#9098A4', t: 7 },
    palladium:     { e: '🥈', c: '#9098A4', t: 7 },
    cadmium:       { e: '🔋', c: '#9098A4', t: 7 },
    indium:        { e: '🔷', c: '#74B9FF', t: 7 },
    tin:           { e: '🥫', c: '#74B9FF', t: 7 },
    antimony:      { e: '🔮', c: '#A29BFE', t: 7 },
    tellurium:     { e: '🌑', c: '#A29BFE', t: 7 },
    iodine:        { e: '🟣', c: '#FDCB6E', t: 7 },
    xenon:         { e: '💫', c: '#81ECEC', t: 7 },
    // Period 6
    caesium:       { e: '🌕', c: '#FF6B6B', t: 8 },
    barium:        { e: '🎇', c: '#FF9F43', t: 8 },
    lanthanum:     { e: '✴️', c: '#FD79A8', t: 8 },
    cerium:        { e: '🌸', c: '#FD79A8', t: 8 },
    praseodymium:  { e: '💚', c: '#FD79A8', t: 8 },
    neodymium:     { e: '🧲', c: '#FD79A8', t: 8 },
    promethium:    { e: '☢️', c: '#FD79A8', t: 8 },
    samarium:      { e: '🪝', c: '#FD79A8', t: 8 },
    europium:      { e: '💡', c: '#FD79A8', t: 8 },
    gadolinium:    { e: '🏥', c: '#FD79A8', t: 8 },
    terbium:       { e: '🌿', c: '#FD79A8', t: 8 },
    dysprosium:    { e: '🔋', c: '#FD79A8', t: 8 },
    holmium:       { e: '🌀', c: '#FD79A8', t: 8 },
    erbium:        { e: '🔴', c: '#FD79A8', t: 8 },
    thulium:       { e: '🌊', c: '#FD79A8', t: 8 },
    ytterbium:     { e: '⚗️', c: '#FD79A8', t: 8 },
    lutetium:      { e: '🔬', c: '#FD79A8', t: 8 },
    hafnium:       { e: '⚙️', c: '#9098A4', t: 8 },
    tantalum:      { e: '🛡️', c: '#9098A4', t: 8 },
    tungsten:      { e: '💡', c: '#9098A4', t: 8 },
    rhenium:       { e: '✈️', c: '#9098A4', t: 8 },
    osmium:        { e: '🪨', c: '#9098A4', t: 8 },
    iridium:       { e: '☄️', c: '#9098A4', t: 8 },
    platinum:      { e: '💍', c: '#9098A4', t: 8 },
    mercury:       { e: '🌡️', c: '#9098A4', t: 8 },
    thallium:      { e: '☠️', c: '#74B9FF', t: 8 },
    lead:          { e: '⚓', c: '#74B9FF', t: 8 },
    bismuth:       { e: '🌈', c: '#74B9FF', t: 8 },
    polonium:      { e: '☢️', c: '#74B9FF', t: 8 },
    astatine:      { e: '⚫', c: '#FDCB6E', t: 8 },
    radon:         { e: '🌫️', c: '#81ECEC', t: 8 },
    // Period 7
    francium:      { e: '⚡', c: '#FF6B6B', t: 8 },
    radium:        { e: '💚', c: '#FF9F43', t: 8 },
    actinium:      { e: '✨', c: '#E17055', t: 8 },
    thorium:       { e: '🌑', c: '#E17055', t: 8 },
    protactinium:  { e: '🔬', c: '#E17055', t: 8 },
    uranium:       { e: '☢️', c: '#E17055', t: 8 },
    neptunium:     { e: '🔵', c: '#E17055', t: 8 },
    plutonium:     { e: '💣', c: '#E17055', t: 8 },
    americium:     { e: '🔴', c: '#E17055', t: 8 },
    curium:        { e: '🧪', c: '#E17055', t: 8 },
    berkelium:     { e: '⚗️', c: '#E17055', t: 8 },
    californium:   { e: '🌟', c: '#E17055', t: 8 },
    einsteinium:   { e: '🧠', c: '#E17055', t: 8 },
    fermium:       { e: '⚛️', c: '#E17055', t: 8 },
    mendelevium:   { e: '📖', c: '#E17055', t: 8 },
    nobelium:      { e: '🏆', c: '#E17055', t: 8 },
    lawrencium:    { e: '🔭', c: '#E17055', t: 8 },
    // Superheavy (Z = 104–118)
    rutherfordium: { e: '⚛️', c: '#9098A4', t: 8 },
    dubnium:       { e: '🔩', c: '#9098A4', t: 8 },
    seaborgium:    { e: '🧲', c: '#9098A4', t: 8 },
    bohrium:       { e: '🌀', c: '#9098A4', t: 8 },
    hassium:       { e: '⚗️', c: '#9098A4', t: 8 },
    meitnerium:    { e: '🔬', c: '#9098A4', t: 8 },
    darmstadtium:  { e: '💥', c: '#9098A4', t: 8 },
    roentgenium:   { e: '☢️', c: '#9098A4', t: 8 },
    copernicium:   { e: '🌍', c: '#9098A4', t: 8 },
    nihonium:      { e: '🗾', c: '#74B9FF', t: 8 },
    flerovium:     { e: '💨', c: '#74B9FF', t: 8 },
    moscovium:     { e: '🏙️', c: '#74B9FF', t: 8 },
    livermorium:   { e: '🔬', c: '#74B9FF', t: 8 },
    tennessine:    { e: '🎸', c: '#FDCB6E', t: 8 },
    oganesson:     { e: '🌌', c: '#81ECEC', t: 8 }
  };

  // ---------- Curated recipes ----------
  // [a, b, result] — order-agnostic; lookup normalizes.
  const HAND = [
    // ── NEW: Homodiatomic molecules ───────────────────────────────────────
    ['hydrogen','hydrogen','dihydrogen'],    // H + H → H₂
    ['oxygen','oxygen','dioxygen'],          // O + O → O₂
    ['nitrogen','nitrogen','dinitrogen'],    // N + N → N₂
    ['fluorine','fluorine','difluorine'],    // F + F → F₂
    ['chlorine','chlorine','dichlorine'],    // Cl + Cl → Cl₂
    ['bromine','bromine','dibromine'],       // Br + Br → Br₂
    ['iodine','iodine','diiodine'],          // I + I → I₂
    ['sulfur','sulfur','disulfur'],          // S + S → S₂

    // ── NEW: Hydroxides (metal + water — must come before sodium+water=energy) ──
    ['sodium','water','sodium-hydroxide'],       // Na + H₂O → NaOH
    ['calcium','water','calcium-hydroxide'],     // Ca + H₂O → Ca(OH)₂
    ['potassium','water','potassium-hydroxide'], // K + H₂O → KOH

    // ── NEW: Metal halides (sodium+chlorine must come before existing sodium+chlorine=salt) ──
    ['sodium','chlorine','sodium-chloride'],     // Na + Cl → NaCl
    ['potassium','chlorine','potassium-chloride'], // K + Cl → KCl
    ['calcium','dichlorine','calcium-chloride'], // Ca + Cl₂ → CaCl₂
    ['calcium','chlorine','calcium-chloride'],   // Ca + Cl → CaCl₂
    ['iron','dichlorine','iron-chloride'],        // Fe + Cl₂ → FeCl₃
    ['iron','chlorine','iron-chloride'],          // Fe + Cl → FeCl₃
    ['copper','chlorine','copper-chloride'],      // Cu + Cl → CuCl₂
    ['silver','chlorine','silver-chloride'],      // Ag + Cl → AgCl

    // ── NEW: Nitrogen oxides (nitrogen+oxygen before existing nitrogen+oxygen=air) ──
    ['nitrogen','oxygen','nitrogen-monoxide'],    // N + O → NO

    // ── NEW: Compound chains ──────────────────────────────────────────────
    // Water routes
    ['dihydrogen','oxygen','water'],             // H₂ + O → H₂O
    ['dihydrogen','dioxygen','water'],           // H₂ + O₂ → H₂O

    // Ammonia (Haber process)
    ['dihydrogen','nitrogen','ammonia'],         // H₂ + N → NH₃
    ['dihydrogen','dinitrogen','ammonia'],       // H₂ + N₂ → NH₃
    ['hydrogen','nitrogen','ammonia'],           // H + N → NH₃

    // Hydrogen acids
    ['dihydrogen','disulfur','hydrogen-sulfide'],      // H₂ + S₂ → H₂S
    ['dihydrogen','sulfur','hydrogen-sulfide'],        // H₂ + S → H₂S
    ['dihydrogen','dichlorine','hydrogen-chloride'],   // H₂ + Cl₂ → 2HCl
    ['dihydrogen','chlorine','hydrogen-chloride'],     // H₂ + Cl → HCl
    ['dihydrogen','difluorine','hydrogen-fluoride'],   // H₂ + F₂ → 2HF
    ['dihydrogen','fluorine','hydrogen-fluoride'],     // H₂ + F → HF
    ['dihydrogen','iodine','hydrogen-iodide'],         // H₂ + I → HI
    ['dihydrogen','diiodine','hydrogen-iodide'],       // H₂ + I₂ → 2HI
    ['hydrogen','chlorine','hydrogen-chloride'],       // H + Cl → HCl
    ['hydrogen','fluorine','hydrogen-fluoride'],       // H + F → HF
    ['hydrogen','iodine','hydrogen-iodide'],           // H + I → HI
    ['hydrogen','sulfur','hydrogen-sulfide'],          // H + S → H₂S

    // Carbon compounds
    ['carbon','oxygen','carbon-monoxide'],             // C + O → CO
    ['carbon','dioxygen','carbon-dioxide'],            // C + O₂ → CO₂
    ['carbon-monoxide','oxygen','carbon-dioxide'],     // CO + O → CO₂
    ['carbon','dihydrogen','methane'],                 // C + H₂ → CH₄
    ['carbon','hydrogen','methane'],                   // C + H → CH₄
    ['methane','oxygen','carbon-dioxide'],             // CH₄ + O₂ → CO₂ (combustion, simplified)

    // Sulfur oxides
    ['sulfur','oxygen','sulfur-dioxide'],              // S + O → SO₂
    ['sulfur','dioxygen','sulfur-dioxide'],            // S + O₂ → SO₂
    ['sulfur-dioxide','oxygen','sulfur-trioxide'],     // SO₂ + O → SO₃

    // More nitrogen oxides
    ['nitrogen-monoxide','oxygen','nitrogen-dioxide'], // NO + O → NO₂

    // Ozone
    ['dioxygen','oxygen','ozone'],                     // O₂ + O → O₃

    // Acids from oxide + water
    ['sulfur-trioxide','water','sulfuric-acid'],       // SO₃ + H₂O → H₂SO₄
    ['nitrogen-dioxide','water','nitric-acid'],        // NO₂ + H₂O → HNO₃
    ['carbon-dioxide','water','carbonic-acid'],        // CO₂ + H₂O → H₂CO₃
    ['hydrogen-chloride','water','hydrochloric-acid'], // HCl + H₂O → HCl(aq)
    ['hydrogen-fluoride','water','hydrofluoric-acid'], // HF + H₂O → HF(aq)
    ['phosphorus','water','phosphoric-acid'],          // P + H₂O (simplified)
    ['phosphorus','dioxygen','phosphoric-acid'],       // P + O₂ → phosphoric acid (simplified)

    // Metal oxides
    ['magnesium','oxygen','magnesium-oxide'],          // Mg + O → MgO
    ['magnesium','dioxygen','magnesium-oxide'],        // Mg + O₂ → MgO
    ['calcium','oxygen','calcium-oxide'],              // Ca + O → CaO
    ['iron','oxygen','iron-oxide'],                    // Fe + O → Fe₂O₃
    ['copper','oxygen','copper-oxide'],                // Cu + O → CuO
    ['aluminum','oxygen','aluminum-oxide'],            // Al + O → Al₂O₃
    ['silicon','dioxygen','silicon-dioxide'],          // Si + O₂ → SiO₂
    ['silicon','oxygen','silicon-dioxide'],            // Si + O → SiO₂
    ['zinc','oxygen','zinc-oxide'],                    // Zn + O → ZnO
    ['titanium','dioxygen','titanium-dioxide'],        // Ti + O₂ → TiO₂
    ['titanium','oxygen','titanium-dioxide'],          // Ti + O → TiO₂

    // Metal sulfides
    ['iron','sulfur','iron-sulfide'],                  // Fe + S → FeS
    ['copper','sulfur','copper-sulfide'],              // Cu + S → CuS
    ['zinc','sulfur','zinc-sulfide'],                  // Zn + S → ZnS

    // Metal nitrides
    ['lithium','nitrogen','lithium-nitride'],          // Li + N → Li₃N
    ['calcium','nitrogen','calcium-nitride'],          // Ca + N → Ca₃N₂

    // Metal carbonates (metal oxide + CO₂)
    ['calcium-oxide','carbon-dioxide','calcium-carbonate'],   // CaO + CO₂ → CaCO₃
    ['sodium-hydroxide','carbon-dioxide','sodium-carbonate'], // 2NaOH + CO₂ → Na₂CO₃

    // Organic chains
    ['ethylene','water','ethanol'],                    // C₂H₄ + H₂O → C₂H₅OH
    ['methane','dioxygen','ethylene'],                 // simplified: 2CH₄ → C₂H₄
    ['carbon','dihydrogen','acetylene'],               // 2C + H₂ → C₂H₂
    ['ammonia','carbon-dioxide','urea'],               // CO₂ + 2NH₃ → urea
    ['carbon','water','glucose'],                      // simplified: C + H₂O → glucose (photosynthesis-ish)
    ['carbon-dioxide','water','glucose'],              // CO₂ + H₂O → glucose (photosynthesis)

    // ── Pure chemistry: periodic-table elements → primal elements ─────────
    ['hydrogen','oxygen','water'],       // 2H₂ + O₂ → 2H₂O (kept; hydrogen+oxygen pair not yet seen)
    ['nitrogen','oxygen','air'],         // ~78% N₂ + 21% O₂ = atmosphere (blocked by nitrogen+oxygen=NO above)
    ['silicon','oxygen','earth'],        // SiO₂ silica = earth's crust (blocked by silicon+oxygen=silicon-dioxide above)
    ['magnesium','oxygen','fire'],       // Mg burns brilliantly in O₂ (blocked by magnesium+oxygen=magnesium-oxide above)
    ['phosphorus','oxygen','fire'],      // white phosphorus autoignites in air
    ['sodium','chlorine','salt'],        // blocked by sodium+chlorine=sodium-chloride above
    ['iron','oxygen','rust'],            // blocked by iron+oxygen=iron-oxide above
    ['carbon','oxygen','smoke'],         // blocked by carbon+oxygen=carbon-monoxide above
    ['calcium','silicon','stone'],       // calcium silicate = natural stone
    ['sodium','water','energy'],         // blocked by sodium+water=sodium-hydroxide above
    ['potassium','water','energy'],      // blocked by potassium+water=potassium-hydroxide above
    ['carbon','carbon','coal'],          // graphite / carbon deposit
    ['sulfur','hydrogen','lava'],        // volcanic H₂S → sulfurous heat
    ['calcium','oxygen','sand'],         // CaO lime → calcium compound

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
    ['phoenix','dragon','alchemia'],

    // ── Periodic Table discovery recipes ──────────────────────────────────
    // Period 1
    ['water','lightning','hydrogen'],      // electrolysis
    ['star','hydrogen','helium'],          // stellar nucleosynthesis

    // Period 2
    ['stone','energy','lithium'],
    ['crystal','stone','beryllium'],
    ['desert','stone','boron'],
    ['coal','pressure','carbon'],
    ['air','lightning','nitrogen'],
    ['plant','sun','oxygen'],              // photosynthesis
    ['glass','energy','fluorine'],
    ['light','air','neon'],

    // Period 3
    ['salt','fire','sodium'],
    ['sea','energy','magnesium'],
    ['clay','energy','aluminum'],
    ['glass','stone','silicon'],
    ['life','ash','phosphorus'],
    ['volcano','earth','sulfur'],
    ['salt','energy','chlorine'],
    ['air','crystal','argon'],

    // Period 4
    ['ash','water','potassium'],           // wood-ash lye
    ['sea','stone','calcium'],             // limestone from ocean
    ['earth','metal','scandium'],
    ['metal','energy','titanium'],
    ['metal','stone','vanadium'],
    ['iron','energy','chromium'],
    ['iron','earth','manganese'],
    ['iron','crystal','cobalt'],
    ['metal','lightning','nickel'],
    ['rust','energy','zinc'],
    ['aluminum','water','gallium'],        // gallium melts in hand
    ['silicon','metal','germanium'],
    ['ash','stone','arsenic'],
    ['sulfur','earth','selenium'],
    ['fire','sea','bromine'],
    ['air','neon','krypton'],

    // Period 5
    ['lithium','energy','rubidium'],
    ['calcium','fire','strontium'],        // strontium in fireworks
    ['crystal','earth','yttrium'],
    ['crystal','metal','zirconium'],
    ['metal','volcano','niobium'],
    ['metal','mountain','molybdenum'],
    ['metal','star','technetium'],         // only stable via stars / reactors
    ['metal','ocean','ruthenium'],
    ['gold','metal','rhodium'],
    ['silver','metal','palladium'],
    ['zinc','energy','cadmium'],
    ['tin','energy','indium'],
    ['metal','sand','tin'],
    ['tin','fire','antimony'],
    ['crystal','sea','tellurium'],
    ['sea','ash','iodine'],
    ['air','energy','xenon'],

    // Period 6
    ['rubidium','energy','caesium'],
    ['calcium','energy','barium'],
    ['mountain','crystal','lanthanum'],    // rare-earth ore in mountains
    ['lanthanum','fire','cerium'],
    ['lanthanum','energy','praseodymium'],
    ['lanthanum','machine','neodymium'],   // neodymium magnets
    ['neodymium','energy','promethium'],
    ['neodymium','earth','samarium'],
    ['lanthanum','light','europium'],      // europium in fluorescent lights
    ['lanthanum','metal','gadolinium'],
    ['lanthanum','crystal','terbium'],
    ['samarium','energy','dysprosium'],
    ['dysprosium','energy','holmium'],
    ['holmium','energy','erbium'],
    ['erbium','energy','thulium'],
    ['thulium','energy','ytterbium'],
    ['ytterbium','energy','lutetium'],
    ['zirconium','energy','hafnium'],
    ['metal','pressure','tantalum'],
    ['iron','pressure','tungsten'],        // tungsten is the densest metal
    ['tungsten','energy','rhenium'],
    ['meteor','metal','osmium'],           // osmium found in meteorites
    ['asteroid','metal','iridium'],        // K-Pg boundary iridium layer
    ['gold','pressure','platinum'],
    ['silver','sulfur','mercury'],         // cinnabar (HgS) ore
    ['iron','time','lead'],                // Pb is end-product of decay chains
    ['lead','energy','thallium'],
    ['lead','crystal','bismuth'],
    ['radium','time','polonium'],          // radium decay product
    ['iodine','energy','astatine'],
    ['stone','void','radon'],              // radon seeps from radioactive rock

    // Period 7
    ['caesium','energy','francium'],
    ['earth','time','radium'],
    ['radium','energy','actinium'],
    ['stone','time','thorium'],
    ['thorium','energy','protactinium'],
    ['thorium','time','uranium'],
    ['uranium','energy','neptunium'],
    ['neptunium','energy','plutonium'],
    ['plutonium','energy','americium'],
    ['americium','energy','curium'],
    ['curium','energy','berkelium'],
    ['berkelium','energy','californium'],
    ['californium','energy','einsteinium'],
    ['einsteinium','energy','fermium'],
    ['fermium','energy','mendelevium'],
    ['mendelevium','energy','nobelium'],
    ['nobelium','energy','lawrencium'],

    // Superheavy (Z = 104–118) — particle-accelerator chain
    ['lawrencium','energy','rutherfordium'],
    ['rutherfordium','energy','dubnium'],
    ['dubnium','energy','seaborgium'],
    ['seaborgium','energy','bohrium'],
    ['bohrium','energy','hassium'],
    ['hassium','energy','meitnerium'],
    ['meitnerium','energy','darmstadtium'],
    ['darmstadtium','energy','roentgenium'],
    ['roentgenium','energy','copernicium'],
    ['copernicium','energy','nihonium'],
    ['nihonium','energy','flerovium'],
    ['flerovium','energy','moscovium'],
    ['moscovium','energy','livermorium'],
    ['livermorium','energy','tennessine'],
    ['tennessine','energy','oganesson']
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

  // All 118 periodic table elements — always pre-discovered
  const PERIODIC_TABLE_KEYS = [
    'hydrogen','helium',
    'lithium','beryllium','boron','carbon','nitrogen','oxygen','fluorine','neon',
    'sodium','magnesium','aluminum','silicon','phosphorus','sulfur','chlorine','argon',
    'potassium','calcium','scandium','titanium','vanadium','chromium','manganese',
    'iron','cobalt','nickel','copper','zinc','gallium','germanium','arsenic',
    'selenium','bromine','krypton',
    'rubidium','strontium','yttrium','zirconium','niobium','molybdenum','technetium',
    'ruthenium','rhodium','palladium','silver','cadmium','indium','tin','antimony',
    'tellurium','iodine','xenon',
    'caesium','barium',
    'lanthanum','cerium','praseodymium','neodymium','promethium','samarium','europium',
    'gadolinium','terbium','dysprosium','holmium','erbium','thulium','ytterbium','lutetium',
    'hafnium','tantalum','tungsten','rhenium','osmium','iridium','platinum','gold',
    'mercury','thallium','lead','bismuth','polonium','astatine','radon',
    'francium','radium',
    'actinium','thorium','protactinium','uranium','neptunium','plutonium','americium',
    'curium','berkelium','californium','einsteinium','fermium','mendelevium','nobelium','lawrencium',
    'rutherfordium','dubnium','seaborgium','bohrium','hassium','meitnerium','darmstadtium',
    'roentgenium','copernicium','nihonium','flerovium','moscovium','livermorium','tennessine','oganesson',
  ];

  // base elements always discovered at start — only real periodic table elements
  const STARTERS = [...PERIODIC_TABLE_KEYS];

  window.ALCHEMIA_DB = {
    META, RECIPES, LOOKUP, STARTERS, PERIODIC_TABLE_KEYS,
    combine, displayName, prettify,
    totalRecipes: RECIPES.length,
    totalElements: Object.keys(META).length
  };
})();
