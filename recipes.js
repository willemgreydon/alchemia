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
    ammonia:            { e: '🫧', c: '#A8D8E8', t: 5, displayName: 'Ammonia (NH₃)', fact: 'The Haber-Bosch process (N₂ + 3H₂ → 2NH₃, Fe catalyst, 450°C, 200 atm) feeds half of humanity — without it, Earth could support ~4 billion people, not 8 billion.' },
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
    'sulfuric-acid':    { e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Sulfuric Acid (H₂SO₄)', fact: 'The most produced industrial chemical (~265 Mt/yr). So corrosive it dehydrates sugar to carbon and generates enough heat to boil water.' },
    'nitric-acid':      { e: '🧪', c: '#E17055', t: 6, displayName: 'Nitric Acid (HNO₃)', fact: 'Makes copper turn green-blue (verdigris) and skin yellow (xanthoproteic reaction). Essential for fertilisers and explosives (Haber-Bosch + Ostwald processes).' },
    'carbonic-acid':    { e: '🧪', c: '#A8C8DB', t: 6, displayName: 'Carbonic Acid (H₂CO₃)', fact: 'The fizz in soda: CO₂ dissolves in water forming H₂CO₃ (pKa 6.35). Your blood maintains pH 7.4 using this exact CO₂/HCO₃⁻ buffer system.' },
    'hydrochloric-acid':{ e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Hydrochloric Acid (HCl aq)', fact: 'Your stomach secretes HCl at pH 1–2 to denature proteins and kill pathogens. Parietal cells use an H⁺/K⁺-ATPase proton pump to concentrate acid 1 million-fold.' },
    'hydrofluoric-acid':{ e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Hydrofluoric Acid (HF aq)', fact: 'HF penetrates skin invisibly, then Ca²⁺ and Mg²⁺ are sequestered by F⁻, causing cardiac arrest. Even small burns can be fatal — the most deceptively dangerous lab acid.' },
    'phosphoric-acid':  { e: '🧪', c: '#55EFC4', t: 6, displayName: 'Phosphoric Acid (H₃PO₄)', fact: 'Gives cola its tang (pH ~2.5). Also the backbone of DNA and RNA — each nucleotide is linked by phosphodiester bonds. Without phosphoric acid, no genetic information.' },
    // Hydroxides
    'sodium-hydroxide': { e: '🧪', c: '#FF6B6B', t: 6, displayName: 'Sodium Hydroxide (NaOH)', fact: 'Lye: so caustic it saponifies fats to soap. Medieval soap-makers leached wood ash with water to get NaOH. It dissolves aluminium, glass, and human tissue.' },
    'calcium-hydroxide':{ e: '🧪', c: '#FF9F43', t: 6, displayName: 'Calcium Hydroxide (Ca(OH)₂)', fact: '"Slaked lime" or "milk of lime". Mixed with sand and water, it carbonates (Ca(OH)₂ + CO₂ → CaCO₃) — the ancient cement that built the Pantheon.' },
    'potassium-hydroxide':{ e: '🧪', c: '#FF6B6B', t: 6, displayName: 'Potassium Hydroxide (KOH)', fact: 'Caustic potash — more soluble than NaOH. Used in alkaline batteries (K⁺ conducts well) and to make "soft" soap. Dissolves wool but not cotton.' },
    'iron-hydroxide':   { e: '🟫', c: '#8B4A1F', t: 6, displayName: 'Iron Hydroxide (Fe(OH)₃)', fact: 'The orange-brown precipitate you see when Fe³⁺ meets water. It dehydrates to Fe₂O₃·nH₂O (rust). Ancient red/yellow pigments (ochres) are iron hydroxide minerals.' },
    // Metal oxides
    'magnesium-oxide':  { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Magnesium Oxide (MgO)', fact: 'MgO burns with a brilliant white light (~2800 K). Flash photography once used Mg powder. It has the highest melting point of any Group 2 oxide (2852°C).' },
    'calcium-oxide':    { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Calcium Oxide (CaO / quicklime)', fact: 'Quicklime reacts violently with water (+63.6 kJ/mol), getting red hot. "Limelight" (CaO heated by oxyhydrogen flame) lit Victorian theatres — brighter than any candle.' },
    'iron-oxide':       { e: '🟤', c: '#8B4A1F', t: 5, displayName: 'Iron Oxide (Fe₂O₃)', fact: 'Fe₂O₃ is rust and also the pigment in red Martian soil — the entire surface of Mars is coated in iron(III) oxide from ancient geological oxidation.' },
    'copper-oxide':     { e: '🟤', c: '#B97A4A', t: 5, displayName: 'Copper Oxide (CuO)', fact: 'The black scale on heated copper. Used as a pigment (copper black), in ceramics, and as a catalyst. Dissolves in acid to give the characteristic blue Cu²⁺ colour.' },
    'aluminum-oxide':   { e: '⚪', c: '#74B9FF', t: 5, displayName: 'Aluminum Oxide (Al₂O₃)', fact: 'Corundum — the second hardest natural mineral (9 Mohs). Rubies and sapphires are gem-quality corundum with trace impurities. Also used as abrasive sandpaper.' },
    'silicon-dioxide':  { e: '💎', c: '#A29BFE', t: 5, displayName: 'Silicon Dioxide (SiO₂)', fact: 'Quartz — the most abundant mineral in Earth\'s crust. SiO₂ is the main component of sand, glass, and computer chips. Piezoelectric quartz crystals keep your clock accurate.' },
    'zinc-oxide':       { e: '⚪', c: '#9098A4', t: 5, displayName: 'Zinc Oxide (ZnO)', fact: 'The white paste on lifeguards\' noses is ZnO — it physically blocks UV. Also a semiconductor with a direct 3.37 eV bandgap, used in LEDs and sunscreen.' },
    'titanium-dioxide': { e: '⚪', c: '#9098A4', t: 5, displayName: 'Titanium Dioxide (TiO₂)', fact: 'The whitest known pigment — used in 90% of white paints, toothpaste, and sunscreen. Under UV light it acts as a photocatalyst, breaking down organic pollutants.' },
    // Metal halides
    'sodium-chloride':  { e: '🧂', c: '#EFEEE8', t: 5, displayName: 'Sodium Chloride (NaCl)', fact: 'Table salt — one of the first traded commodities. "Salary" derives from Latin salarium (salt wages). 1 km³ of seawater contains ~35 Mt of NaCl.' },
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
    methane:            { e: '💨', c: '#55EFC4', t: 6, displayName: 'Methane (CH₄)', fact: 'The simplest alkane: one carbon, four hydrogens in perfect tetrahedral geometry. The main component of natural gas and cow flatulence (a greenhouse gas 80× more potent than CO₂ over 20 yr).' },
    ethylene:           { e: '💨', c: '#55EFC4', t: 6, displayName: 'Ethylene (C₂H₄)', fact: 'The world\'s most produced organic chemical (~200 Mt/yr). A plant hormone — ripens fruit. Also the monomer for polyethylene. The C=C double bond is the simplest π bond.' },
    acetylene:          { e: '💨', c: '#55EFC4', t: 6, displayName: 'Acetylene (C₂H₂)', fact: 'The triple bond gives C₂H₂ a linear geometry. Oxyacetylene torches reach 3500°C — hot enough to cut steel. Also the parent compound of the benzene ring via trimerisation.' },
    ethanol:            { e: '🍶', c: '#DDE6EE', t: 7, displayName: 'Ethanol (C₂H₅OH)', fact: 'The only alcohol safe to drink — produced by yeast fermenting glucose under anaerobic conditions. 100% ethanol freezes at −114°C; your blood-alcohol legal limit is typically 0.08%.' },
    'acetic-acid':      { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Acetic Acid (CH₃COOH)', fact: 'Vinegar is 5% acetic acid — made by Acetobacter bacteria oxidising ethanol. Pure glacial acetic acid (100%) freezes at 16.6°C and eats through skin rapidly.' },
    glucose:            { e: '🍬', c: '#FFC838', t: 7, displayName: 'Glucose (C₆H₁₂O₆)', fact: 'Your cells\' primary fuel — oxidised via glycolysis + Krebs cycle to yield 36–38 ATP per molecule. It exists as cyclic α- and β-pyranose forms in solution (mutarotation).' },
    urea:               { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Urea (CO(NH₂)₂)', fact: 'Urea was the first organic compound synthesized from inorganic precursors (Wöhler, 1828), shattering "vital force" theory.' },

    // ── Tier 7–8 — alloys ────────────────────────────────────────────────────
    bronze:             { e: '🛡️', c: '#CD7F32', t: 7, displayName: 'Bronze (Cu₈Sn alloy)', fact: 'Bronze was civilization\'s first metallic alloy — ~90% copper, 10% tin. The Bronze Age began ~3300 BCE and lasted 2000 years.' },
    brass:              { e: '🎺', c: '#CFB53B', t: 7, displayName: 'Brass (Cu-Zn alloy)', fact: 'Brass (60–70% Cu, 30–40% Zn) is antimicrobial — bacteria die on brass surfaces within hours due to the oligodynamic effect.' },
    steel:              { e: '⚔️', c: '#8B9BB4', t: 7, displayName: 'Steel (Fe-C alloy <2%)', fact: 'Steel is iron with 0.02–2.14% carbon. Carbon atoms slot into gaps in the iron lattice, preventing dislocations — multiplying strength 10×.' },
    'stainless-steel':  { e: '🔩', c: '#BEC2C8', t: 8, displayName: 'Stainless Steel (Fe-Cr ≥10.5%)', fact: 'Chromium forms a self-repairing Cr₂O₃ passive layer in microseconds. Below 10.5% Cr the layer is too thin to protect.' },
    'cast-iron':        { e: '🍳', c: '#4A4A4A', t: 7, displayName: 'Cast Iron (Fe-C >2%)', fact: 'Cast iron has >2% carbon — it is brittle (carbon forms graphite flakes) but superb at heat retention, hence cast-iron cookware.' },
    amalgam:            { e: '🌡️', c: '#C8D8D8', t: 7, displayName: 'Amalgam (Hg-metal alloy)', fact: 'Mercury readily dissolves most metals into amalgams. Dental amalgam (Hg-Ag-Sn-Cu) has been used for 180+ years and releases less Hg than a tuna sandwich.' },
    nitinol:            { e: '🔄', c: '#9098A4', t: 8, displayName: 'Nitinol (Ni₅₅Ti₄₅ shape-memory)', fact: 'Nitinol "remembers" its shape — bent cold, it springs back when warmed. Used in cardiac stents, orthodontic wires, and surgical tools.' },
    solder:             { e: '🔌', c: '#A8A8B8', t: 7, displayName: 'Solder (Sn-Pb or Sn-Cu alloy)', fact: 'Traditional 60/40 Sn/Pb solder melts at 183°C. Modern lead-free Sn-Cu-Ag solder melts higher but won\'t give you lead poisoning.' },

    // ── Tier 6–7 — minerals & gems ───────────────────────────────────────────
    pyrite:             { e: '✨', c: '#CFB53B', t: 6, displayName: "Pyrite (FeS₂) — Fool's Gold", fact: "FeS₂ crystals grow in perfect cubes with a metallic gold sheen. Miners called it 'Fool's Gold'. On oxidation, it forms sulfuric acid, acidifying mine drainage." },
    galena:             { e: '⬜', c: '#8B8B92', t: 6, displayName: 'Galena (PbS)', fact: 'Galena is lead\'s primary ore. Its perfect cubic cleavage (90° angles) and high density (7.6 g/cm³) make it instantly recognizable to mineralogists.' },
    cinnabar:           { e: '🔴', c: '#CC2200', t: 6, displayName: 'Cinnabar (HgS)', fact: 'Cinnabar was the prized pigment "vermillion". Ancient Romans imported 4.5 tonnes per year from Spain. Mercury is extracted by roasting HgS in air at 580°C.' },
    gypsum:             { e: '🪨', c: '#F0EDE0', t: 6, displayName: 'Gypsum (CaSO₄·2H₂O)', fact: 'Gypsum loses water at 150°C to form plaster of Paris (CaSO₄·½H₂O). Mixed with water, the exothermic rehydration sets it rock-hard in minutes.' },
    ruby:               { e: '❤️', c: '#CC1111', t: 7, displayName: 'Ruby (Al₂O₃:Cr³⁺)', fact: 'Rubies are corundum (Al₂O₃) with trace Cr³⁺ replacing Al³⁺. Chromium\'s d-d electron transitions absorb blue/yellow light, leaving vivid red.' },
    sapphire:           { e: '💙', c: '#1155CC', t: 7, displayName: 'Sapphire (Al₂O₃:Fe²⁺/Ti⁴⁺)', fact: 'Blue sapphires get colour from Fe²⁺→Ti⁴⁺ charge-transfer in corundum. Fe alone gives yellow; Ti alone gives colourless; together they give blue.' },
    emerald:            { e: '💚', c: '#118811', t: 8, displayName: 'Emerald (Be₃Al₂Si₆O₁₈:Cr³⁺)', fact: 'Emeralds are beryl coloured by Cr³⁺. Inclusions ("jardin") are tolerated — an inclusion-free emerald is rarer than a diamond of similar size.' },

    // ── Tier 6–7 — key inorganic additions ───────────────────────────────────
    'hydrogen-peroxide':{ e: '🫧', c: '#E8F8FF', t: 6, displayName: 'Hydrogen Peroxide (H₂O₂)', fact: 'H₂O₂ is a liquid oxidiser used as rocket propellant (90%+ concentration). It decomposes to H₂O + ½O₂ — violently if catalysed by MnO₂ or KI.' },
    'nitrous-oxide':    { e: '😂', c: '#DDE6EE', t: 6, displayName: 'Nitrous Oxide (N₂O)', fact: '"Laughing gas" is a dissociative anaesthetic and oxidiser used in racing engines (+100 hp). It is also a greenhouse gas 273× more potent than CO₂.' },
    'baking-soda':      { e: '🧂', c: '#EFEEE8', t: 6, displayName: 'Baking Soda (NaHCO₃)', fact: 'Sodium bicarbonate releases CO₂ when it meets acid or heat (above 50°C). That CO₂ creates the bubbles that make cakes rise.' },
    'washing-soda':     { e: '🧼', c: '#DDE6EE', t: 6, displayName: 'Washing Soda (Na₂CO₃)', fact: 'Soda ash dissolves grease by raising pH above 11. Ancient Egyptians harvested it from lake beds to make soap, glass, and preserve mummies.' },
    bleach:             { e: '🫙', c: '#EEFBFF', t: 6, displayName: 'Bleach (NaOCl)', fact: 'Household bleach is 3–8% sodium hypochlorite. ClO⁻ oxidizes and breaks chromophore bonds in stains and bacterial DNA simultaneously.' },
    thermite:           { e: '🔥', c: '#FF7A00', t: 7, displayName: 'Thermite (Al + Fe₂O₃)', fact: 'Thermite burns at ~2500°C, hotter than most steel-cutting tools. No oxygen needed — the Al reduces Fe₂O₃. Used in rail welding and demolition.' },

    // ── Tier 7–8 — energetics (educational) ─────────────────────────────────
    gunpowder:          { e: '💥', c: '#3A3535', t: 7, displayName: 'Black Powder (KNO₃+C+S)', fact: 'Invented in Tang Dynasty China ~850 CE: 75% KNO₃, 15% charcoal, 10% S. Potassium nitrate supplies oxygen; the Silk Road carried the secret west.' },
    tnt:                { e: '💣', c: '#D4A017', t: 8, displayName: 'TNT (C₇H₅N₃O₆)', fact: 'Trinitrotoluene was first made as a yellow dye in 1863. Its explosive power went unnoticed until 1891. 1 kg TNT = 4.2 MJ, the standard energy benchmark.' },
    nitroglycerin:      { e: '💧', c: '#FFFF88', t: 8, displayName: 'Nitroglycerin (C₃H₅N₃O₉)', fact: 'Nobel mixed nitroglycerin with diatomaceous earth to make dynamite (1867) after his brother Emil died in an accidental explosion. It also treats angina.' },

    // ── Tier 7–9 — organic chemistry ─────────────────────────────────────────
    methanol:           { e: '🍶', c: '#DDE6EE', t: 7, displayName: 'Methanol (CH₃OH)', fact: 'Methanol is highly toxic — 10 mL causes permanent blindness; 30 mL is lethal. It is oxidised in the body to formaldehyde, which destroys the optic nerve.' },
    formaldehyde:       { e: '💨', c: '#DDE6EE', t: 7, displayName: 'Formaldehyde (CH₂O)', fact: 'The simplest aldehyde — a known carcinogen and the most abundant organic pollutant in outdoor air. Formalin (37% in water) preserves biological specimens.' },
    acetone:            { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Acetone (C₃H₆O)', fact: 'Acetone is produced during ketosis (fat burning) and exhaled in trace amounts — giving "keto breath". It is the simplest ketone and fully miscible with water.' },
    benzene:            { e: '⬡', c: '#F5DEB3', t: 7, displayName: 'Benzene (C₆H₆)', fact: 'Six electrons are delocalised around the ring equally — not alternating single/double bonds. Kekulé (1865) reportedly dreamed of a snake biting its tail.' },
    phenol:             { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Phenol (C₆H₅OH)', fact: 'Lister used phenol as the first surgical antiseptic in 1865, cutting post-op mortality dramatically. Today it is a precursor to aspirin, BPA, and nylon.' },
    'salicylic-acid':   { e: '🌿', c: '#A8D8B0', t: 7, displayName: 'Salicylic Acid (C₇H₆O₃)', fact: 'Hippocrates used willow bark (rich in salicin) for pain relief. Salicylic acid is the active metabolite — but it irritates the stomach, spurring aspirin\'s invention.' },
    aspirin:            { e: '💊', c: '#F5F5F5', t: 8, displayName: 'Aspirin (C₉H₈O₄)', fact: 'Bayer patented acetylsalicylic acid in 1899. It irreversibly inhibits COX-1/COX-2 enzymes, blocking prostaglandin synthesis. ~100 billion tablets sold annually.' },
    caffeine:           { e: '☕', c: '#3D1C02', t: 8, displayName: 'Caffeine (C₈H₁₀N₄O₂)', fact: 'A purine alkaloid that competitively blocks adenosine A₁/A₂A receptors, preventing drowsiness. Half-life 3–5 h. Lethal dose ~10 g — roughly 50 espressos.' },
    ethylene_glycol:    { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Ethylene Glycol (C₂H₆O₂)', fact: 'Antifreeze lowers the freezing point of water to −37°C via hydrogen-bond disruption. It tastes sweet but metabolises to oxalic acid, causing fatal kidney failure.' },
    sucrose:            { e: '🍬', c: '#FFE0A0', t: 7, displayName: 'Sucrose (C₁₂H₂₂O₁₁)', fact: 'Table sugar: glucose + fructose linked by an α-1,β-2 glycosidic bond. Sucrase in your gut cleaves it in milliseconds. One molecule contains 45 atoms.' },
    starch:             { e: '🌾', c: '#E8D8A0', t: 7, displayName: 'Starch (polysaccharide)', fact: 'Starch is thousands of glucose units linked α-1,4 (amylose) and α-1,6 (amylopectin). Amylose helices turn blue with I₂ — the classic iodine starch test.' },
    cellulose:          { e: '🌿', c: '#A8C888', t: 7, displayName: 'Cellulose (β-1,4-glucan)', fact: 'Cellulose differs from starch only in bond angle (β vs α), but humans lack cellulase. That tiny difference makes wood indigestible and is the most abundant biopolymer.' },
    nylon:              { e: '🧵', c: '#88B8E8', t: 8, displayName: 'Nylon (polyamide)', fact: 'Wallace Carothers invented nylon at DuPont in 1935 — the first fully synthetic polymer. It was introduced as "stronger than steel, finer than silk" in 1938 stockings.' },
    polyethylene:       { e: '🛍️', c: '#A8E8D8', t: 7, displayName: 'Polyethylene (-(CH₂)ₙ-)', fact: 'The world\'s most produced plastic: ~100 Mt/yr. It was accidentally discovered twice — by ICI in 1933 (by trace oxygen contamination) and again in 1953 (Ziegler catalyst).' },

    // ── Tier 8–9 — biochemistry ───────────────────────────────────────────────
    'amino-acid':       { e: '🔗', c: '#A8D8B0', t: 7, displayName: 'Amino Acid (H₂N-CHR-COOH)', fact: '20 canonical amino acids build all proteins. Each has an amine and carboxylate group on the same carbon. The R group determines everything about its chemistry.' },
    glycine:            { e: '🧬', c: '#A8D8B0', t: 7, displayName: 'Glycine (C₂H₅NO₂)', fact: 'Glycine is the simplest amino acid — R = H. It is the only achiral amino acid. Found in collagen, it also acts as an inhibitory neurotransmitter in the spinal cord.' },
    protein:            { e: '🧬', c: '#7AAEE0', t: 8, displayName: 'Protein (polypeptide chain)', fact: 'Proteins fold into precise 3D structures determined solely by their amino acid sequence. A single misfolded protein can seed Alzheimer\'s plaques or prion disease.' },
    atp:                { e: '⚡', c: '#FFD938', t: 8, displayName: 'ATP (C₁₀H₁₆N₅O₁₃P₃)', fact: 'Adenosine triphosphate is the universal energy currency. A human synthesises their own body weight in ATP every single day. Each molecule is recycled ~500 times per day.' },
    'vitamin-c':        { e: '🍊', c: '#FF9F43', t: 8, displayName: 'Vitamin C (C₆H₈O₆)', fact: 'Ascorbic acid prevents scurvy by enabling collagen hydroxylation. Humans lost the ability to synthesise it ~61 Mya. 100 mg/day prevents deficiency.' },
    chlorophyll:        { e: '🌿', c: '#3F8E3F', t: 8, displayName: 'Chlorophyll (Mg-porphyrin)', fact: 'Chlorophyll has Mg²⁺ at its centre (vs Fe²⁺ in haemoglobin). It absorbs red (680 nm) and blue (430 nm) light, reflecting green. Quantum coherence boosts efficiency >95%.' },
    hemoglobin:         { e: '🩸', c: '#C82828', t: 8, displayName: 'Hemoglobin (Fe-porphyrin)', fact: 'Each RBC contains 280 million haemoglobin tetramers. CO binds 200× more tightly than O₂, displacing it and causing poisoning. The red colour is from Fe²⁺-porphyrin charge transfer.' },
    dna:                { e: '🧬', c: '#3F8BC8', t: 9, displayName: 'DNA (deoxyribonucleic acid)', fact: 'Watson, Crick & Franklin 1953: antiparallel double helix, 3.4 Å per base pair. Your 46 chromosomes contain ~3 billion bp. Stretched from one cell: 2 metres of DNA.' },
    rna:                { e: '🔬', c: '#E8455B', t: 9, displayName: 'RNA (ribonucleic acid)', fact: 'RNA is both genetic blueprint AND catalyst (ribozymes). The "RNA world" hypothesis: RNA preceded both DNA and proteins as the original self-replicating molecule.' },
    enzyme:             { e: '🔑', c: '#88D8B0', t: 8, displayName: 'Enzyme (biological catalyst)', fact: 'Enzymes accelerate reactions by up to 10¹⁷× by stabilising the transition state. Carbonic anhydrase converts CO₂ to bicarbonate 1 million times per second.' },
    insulin:            { e: '💉', c: '#88B8E8', t: 9, displayName: 'Insulin (C₂₅₇H₃₈₃N₆₅O₇₇S₆)', fact: 'Insulin is a 51-amino-acid hormone that unlocks cells to absorb glucose. Banting & Best isolated it in 1921 — the first hormone therapy, saving millions of diabetic lives.' },

    // ── Tier 8–9 — nuclear chemistry ─────────────────────────────────────────
    deuterium:          { e: '💧', c: '#88AABB', t: 7, displayName: 'Deuterium (²H / D)', fact: 'Heavy hydrogen: 1 proton + 1 neutron. 0.0156% of all hydrogen is D. "Heavy water" (D₂O) looks identical to H₂O but is toxic in large doses — it slows biochemical reactions.' },
    tritium:            { e: '☢️', c: '#88CCBB', t: 8, displayName: 'Tritium (³H / T)', fact: 'Radioactive hydrogen: 1p + 2n. Half-life 12.32 years (β⁻ decay). Used in thermonuclear warheads and self-luminescent EXIT signs. Produced in reactors from ⁶Li + n.' },
    'heavy-water':      { e: '💧', c: '#88AABB', t: 7, displayName: 'Heavy Water (D₂O)', fact: 'D₂O slows neutrons (a neutron moderator) without absorbing them — enabling natural-uranium reactors (CANDU). Fish die in D₂O; humans can drink small amounts safely.' },
    'nuclear-fission':  { e: '☢️', c: '#E17055', t: 9, displayName: 'Nuclear Fission (²³⁵U+n→Ba+Kr+3n)', fact: 'When U-235 absorbs a thermal neutron it splits into ~Ba-141 + Kr-92 + 3 neutrons + 200 MeV. One fission atom releases a million times more energy than burning one carbon atom.' },
    'nuclear-fusion':   { e: '🌟', c: '#FF9F43', t: 9, displayName: 'Nuclear Fusion (D+T→⁴He+n+17.6MeV)', fact: 'Fusion requires 100 million °C to overcome Coulomb repulsion. The Sun fuses 600 Mt of H per second. ITER (under construction) aims to produce 10× the energy it consumes.' },
    'chain-reaction':   { e: '💥', c: '#FF5A1F', t: 9, displayName: 'Chain Reaction (critical mass)', fact: 'A chain reaction is self-sustaining when each fission produces ≥1 neutron that causes another fission (k≥1). Critical mass of U-235: ~52 kg sphere; Pu-239: ~10 kg.' },
    antimatter:         { e: '✨', c: '#B85AE8', t: 9, displayName: 'Antimatter (e⁺, p̄, n̄)', fact: 'Matter-antimatter annihilation converts 100% of mass to energy (E=mc²). 1 g annihilating = 43 kilotons TNT. CERN produces ~10 nanograms of antihydrogen per year.' },

    // ── Tier 8–9 — advanced materials ────────────────────────────────────────
    graphene:           { e: '⬡', c: '#262321', t: 8, displayName: 'Graphene (C monolayer, sp²)', fact: 'A single atom-thick carbon sheet: 200× stronger than steel, conducts electrons at 10⁶ m/s (1% of c), transparent, and impermeable to all gases. 2010 Nobel Prize.' },
    fullerene:          { e: '⚽', c: '#262321', t: 8, displayName: 'Buckminsterfullerene (C₆₀)', fact: 'C₆₀ resembles a soccer ball — 60 C atoms in 12 pentagons + 20 hexagons. Named after Buckminster Fuller\'s geodesic domes. Discovered 1985, Nobel 1996.' },
    'carbon-nanotube':  { e: '🌀', c: '#262321', t: 9, displayName: 'Carbon Nanotube (CNT)', fact: 'A graphene sheet rolled into a seamless cylinder: 100× stronger than steel, 1/6 the weight. Could enable a space elevator — a 100,000 km cable to orbit.' },
    semiconductor:      { e: '💻', c: '#A29BFE', t: 8, displayName: 'Semiconductor (Si:P n-type)', fact: 'Phosphorus gives Si an extra electron (n-type); boron gives a hole (p-type). The p-n junction is the transistor basis — 3 billion transistors fit on a 1 cm² chip today.' },
    superconductor:     { e: '⚡', c: '#81ECEC', t: 9, displayName: 'Superconductor (zero resistance)', fact: 'Below Tc, resistance drops to exactly zero — a persistent current circles forever. Cooper pairs (electron pairs) tunnel through the crystal lattice without scattering.' },
    'solar-cell':       { e: '☀️', c: '#FFD938', t: 8, displayName: 'Solar Cell (Si photovoltaic)', fact: 'A p-n junction absorbs photons (hν > Eg = 1.1 eV for Si), promoting electrons across the bandgap. Commercial Si cells reach ~26% efficiency; theoretical limit: 33%.' },
    penicillin:         { e: '💉', c: '#7BC857', t: 9, displayName: 'Penicillin (β-lactam antibiotic)', fact: 'Discovered when mould contaminated Fleming\'s plate in 1928. The β-lactam ring inhibits transpeptidase — cross-linking of bacterial cell walls — causing osmotic lysis.' },

    // ── GOD-TIER expansion: food & fermentation ──────────────────────────────
    yeast:              { e: '🦠', c: '#F5E642', t: 6, displayName: 'Yeast (Saccharomyces cerevisiae)', fact: 'A single-celled fungus that converts glucose to ethanol and CO₂ via anaerobic glycolysis. Humans have cultivated yeast for 13,000 years — it predates writing.' },
    bread:              { e: '🍞', c: '#C8864B', t: 7, displayName: 'Bread (leavened dough)', fact: 'CO₂ bubbles from yeast fermentation expand gluten networks — wheat\'s unique viscoelastic protein. Bread is 12,000 years old; the Chorleywood process (1961) now makes 80% of UK bread in 3.5 hours.' },
    beer:               { e: '🍺', c: '#D4A017', t: 7, displayName: 'Beer (fermented wort)', fact: 'Malted barley releases amylases that convert starch to maltose; yeast ferments maltose to ethanol. Beer is the oldest chemical process intentionally optimised by humans — Sumerian tablets record 19 varieties in 4000 BCE.' },
    wine:               { e: '🍷', c: '#8B1A4A', t: 7, displayName: 'Wine (fermented grape must)', fact: 'Wild Saccharomyces on grape skins drives natural fermentation. Tannins from grape skins chelate proteins, causing the "dry" sensation. Oldest wine residue: 8,000-year-old jars from Georgia.' },
    vinegar:            { e: '🧴', c: '#C8A87A', t: 7, displayName: 'Vinegar (acetic acid solution)', fact: 'Acetobacter bacteria oxidise ethanol to acetic acid (CH₃COOH) — a two-step enzymatic process requiring oxygen. Balsamic vinegar ages 12–25 years; its acidity prevents bacterial contamination.' },
    soap:               { e: '🧼', c: '#F5E0DC', t: 7, displayName: 'Soap (fatty acid salts)', fact: 'Saponification: NaOH cleaves ester bonds in triglycerides → glycerol + fatty acid sodium salt. The hydrophilic head binds water; the hydrophobic tail surrounds grease — forming a micelle 4–5 nm across.' },
    honey:              { e: '🍯', c: '#FFA500', t: 6, displayName: 'Honey (supersaturated sugar)', fact: 'Bees add invertase to nectar, splitting sucrose into glucose and fructose, then evaporate water to <17%. The result is so osmotically concentrated it is bacteriostatic — sealed honey found in Egyptian tombs is still edible after 3,000 years.' },
    cheese:             { e: '🧀', c: '#F5D76E', t: 7, displayName: 'Cheese (coagulated casein)', fact: 'Rennet (chymosin enzyme) clips κ-casein molecules, allowing calcium-bridged protein curds to form. Mold-ripened Penicillium roqueforti in blue cheese is a relative of antibiotic-producing molds.' },
    butter:             { e: '🧈', c: '#F5D78E', t: 7, displayName: 'Butter (milk fat emulsion)', fact: 'Churning physically shears cream\'s fat globule membranes, coalescing triglycerides into continuous fat phase. Butter is 80% fat, 16–17% water — a water-in-fat emulsion unlike cream (fat-in-water).' },
    yogurt:             { e: '🥛', c: '#F5F0E8', t: 7, displayName: 'Yogurt (lactic acid ferment)', fact: 'Lactobacillus bulgaricus and Streptococcus thermophilus ferment lactose to lactic acid, dropping pH to ~4.5 — casein denatures and gels. Live cultures survive stomach acid, colonising the gut microbiome.' },
    'lactic-acid':      { e: '🧪', c: '#FFCCCC', t: 7, displayName: 'Lactic Acid (C₃H₆O₃)', fact: 'Produced by anaerobic glycolysis when O₂ is insufficient — hence muscle burn during sprinting. L-lactic acid is chirally identical in bacteria, muscle, and biodegradable PLA plastic.' },
    'citric-acid':      { e: '🧪', c: '#FFFACC', t: 7, displayName: 'Citric Acid (C₆H₈O₇)', fact: 'The Krebs cycle intermediate that gave the TCA cycle its older name. Citrus fruits are 5–8% citric acid. Globally, ~2.4 million tonnes/year are produced by Aspergillus niger fermentation — not from lemons.' },
    'acetic-acid':      { e: '🧪', c: '#DDE6EE', t: 6, displayName: 'Acetic Acid (CH₃COOH)', fact: 'The simplest carboxylic acid — vinegar is a 5% aqueous solution. Pure glacial acetic acid freezes at 16.6°C (feels like ice). Its pKa of 4.76 makes it the gold standard for pH buffer chemistry.' },
    'lye-soap':         { e: '🧼', c: '#E8D5CC', t: 7, displayName: 'Lye Soap (saponified fat)', fact: 'Wood-ash lye (KOH) + animal fat → potassium soap (soft). NaOH + palm oil → sodium soap (hard bar). Cold-process soap retains glycerol as a natural moisturiser.' },
    concrete:           { e: '🏗️', c: '#8C8C8C', t: 7, displayName: 'Concrete (Portland cement)', fact: 'CaO (lime) + SiO₂ + Al₂O₃ → calcium silicate hydrate gel (C-S-H): the binding phase of concrete. Romans made marine concrete with volcanic ash; 2,000-year-old structures still stand in the sea.' },
    cement:             { e: '🏗️', c: '#A8A8A8', t: 6, displayName: 'Cement (calcium silicate)', fact: 'Portland cement is made by calcining limestone (CaCO₃ → CaO + CO₂) at 1450°C, then grinding with gypsum. Cement production emits ~8% of global CO₂ — more than aviation.' },
    glass:              { e: '🪟', c: '#C8E8F8', t: 6, displayName: 'Glass (amorphous SiO₂)', fact: 'Glass is a supercooled liquid with no crystalline order — its molecules are frozen mid-flow. Obsidian is natural glass; the oldest man-made glass beads date to ~3500 BCE Egypt. Gorilla Glass 6 withstands a 1.6 m drop onto rough surfaces.' },
    plaster:            { e: '🏗️', c: '#F0EEE8', t: 6, displayName: 'Plaster (CaSO₄·½H₂O)', fact: 'Gypsum (CaSO₄·2H₂O) dehydrated at 120°C → hemihydrate (plaster of Paris). Adding water reverses the reaction, setting hard in 10–20 min with a slight exotherm. Michelangelo used gypsum molds for sculpture.' },

    // ── GOD-TIER expansion: astronomy ────────────────────────────────────────
    supernova:          { e: '💥', c: '#FF8C00', t: 9, displayName: 'Supernova (stellar explosion)', fact: 'A Type II supernova collapses in 0.25 seconds, releasing 3×10⁴⁶ J — more energy than the Sun will emit in its entire 10-billion-year life. All elements heavier than iron were forged in supernovae.' },
    'neutron-star':     { e: '⭐', c: '#81D4FA', t: 9, displayName: 'Neutron Star (nuclear density)', fact: 'A neutron star packs 1.4 solar masses into a 20 km sphere — nuclear density (10¹⁷ kg/m³). A teaspoon would weigh 10 million tonnes. Pulsars spin up to 716 times per second.' },
    'white-dwarf':      { e: '⭐', c: '#E8F4F8', t: 9, displayName: 'White Dwarf (electron-degenerate)', fact: 'Earth-sized remnant of a Sun-like star, supported by electron degeneracy pressure (Pauli exclusion principle). Surface temperature 8,000–40,000 K; Chandrasekhar limit 1.4 M☉ — exceed it and it collapses further.' },
    pulsar:             { e: '⭐', c: '#A8D8EA', t: 9, displayName: 'Pulsar (rotating neutron star)', fact: 'Pulsars were first detected in 1967 by Jocelyn Bell Burnell — so regular (period 1.337 s) that they were initially nicknamed LGM-1 ("Little Green Men"). They are clocks more accurate than atomic clocks.' },
    quasar:             { e: '🌀', c: '#FF6B9D', t: 9, displayName: 'Quasar (active galactic nucleus)', fact: 'A quasar is a supermassive black hole (10⁸–10¹⁰ M☉) accreting gas so fast it outshines its entire host galaxy by 1,000×. The most luminous quasar emits 600 trillion times the Sun\'s luminosity.' },
    nebula:             { e: '🌌', c: '#9B59B6', t: 8, displayName: 'Nebula (interstellar cloud)', fact: 'Nebulae are the nurseries and graveyards of stars. Emission nebulae glow because UV from hot stars ionises hydrogen; when electrons recombine, they emit the characteristic red Hα line at 656 nm.' },

    // ── GOD-TIER expansion: electrochemistry ─────────────────────────────────
    'copper-sulfate':   { e: '🧪', c: '#1A8FE3', t: 7, displayName: 'Copper Sulfate (CuSO₄)', fact: 'Vivid blue crystals turn white on dehydration — the five water molecules in CuSO₄·5H₂O stabilise Cu²⁺ by ligand field splitting. Used in electroplating, algicide, and as a soil micronutrient.' },
    'voltaic-cell':     { e: '⚡', c: '#FFD700', t: 8, displayName: 'Voltaic Cell (1.1 V galvanic cell)', fact: 'Volta\'s 1800 zinc-copper cell was the first steady electric source. Zn oxidises (anode), Cu²⁺ reduces (cathode), releasing 1.1 V. Napoleon granted Volta an honorary citizenship for this invention.' },
    'fuel-cell':        { e: '⚡', c: '#00CFCF', t: 9, displayName: 'Fuel Cell (H₂ + O₂ → 2H₂O + e⁻)', fact: 'A proton-exchange membrane fuel cell splits H₂ into H⁺ + e⁻ at the anode; electrons flow through an external circuit, producing electricity. Efficiency: ~60%, vs ~35% for combustion engines.' },
    'galvanized-iron':  { e: '⚙️', c: '#8CB4CC', t: 7, displayName: 'Galvanised Iron (Zn-coated Fe)', fact: 'Zinc acts as a sacrificial anode — its lower reduction potential (-0.76 V) means Zn corrodes instead of Fe (-0.44 V). Even a scratched galvanised surface stays rust-free. The Eiffel Tower is painted and galvanised.' },
    electrolysis:       { e: '⚡', c: '#7EC8E3', t: 7, displayName: 'Electrolysis (redox at electrodes)', fact: 'Faraday\'s laws (1834): mass deposited ∝ charge passed. Electrolysis of brine produces Cl₂ (anode) and H₂ (cathode) and NaOH — the chlor-alkali process producing 95 million tonnes/year of industrial chemicals.' },

    // ── GOD-TIER expansion: inorganic chemistry ──────────────────────────────
    saltpeter:          { e: '⚗️', c: '#F5F5DC', t: 6, displayName: 'Saltpeter (KNO₃)', fact: 'Potassium nitrate occurs naturally in cave soil from bat guano. It was an ingredient in black powder for 1,000 years before synthetic fixation of nitrogen was invented. It also cures meat.' },
    borax:              { e: '⚗️', c: '#E8F4FC', t: 6, displayName: 'Borax (Na₂B₄O₇·10H₂O)', fact: 'Borax was first imported to Europe from Tibet in the 8th century. It is a flux in ceramics, a pesticide, and slime activator. Boron concentrates in plants: too little stunts growth; too much is toxic.' },
    'potassium-nitrate': { e: '⚗️', c: '#F5F5DC', t: 6, displayName: 'Potassium Nitrate (KNO₃)', fact: 'KNO₃ is the oxidiser in black powder (75% KNO₃, 15% charcoal, 10% S). Its high nitrogen content makes it an excellent fertiliser — but the same chemistry that feeds crops can be weaponised.' },
    'ammonium-nitrate':  { e: '⚗️', c: '#FFFACC', t: 7, displayName: 'Ammonium Nitrate (NH₄NO₃)', fact: 'The world\'s most-produced nitrogen fertiliser: 180 million tonnes/year. It is also an oxidising explosive — the 2020 Beirut port blast involved 2,750 tonnes, yielding an estimated 1.1 kT yield.' },
    'hydrogen-cyanide':  { e: '🧪', c: '#CC3333', t: 8, displayName: 'Hydrogen Cyanide (HCN)', fact: 'HCN binds Fe³⁺ in cytochrome c oxidase, halting mitochondrial respiration instantly — cells suffocate despite normal blood oxygen. Bitter almonds (amygdalin) release trace HCN; apple seeds contain 700 µg/g.' },
    chloroform:         { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Chloroform (CHCl₃)', fact: 'The first surgical anaesthetic (1847), chloroform depresses the CNS by potentiating GABA-A receptors. It is carcinogenic and metabolises to phosgene (COCl₂) in air — replaced by safer halogenated ethers.' },
    ozone:              { e: '🌐', c: '#A8D8F0', t: 6, displayName: 'Ozone (O₃)', fact: 'Stratospheric ozone absorbs UV-B at 250–320 nm, protecting DNA from photodamage. The Chapman cycle creates it: O₂ + hν → 2O•; O + O₂ + M → O₃. One O₃ molecule shields ~1,000 m² of ground.' },

    // ── GOD-TIER expansion: biology / life sciences ──────────────────────────
    virus:              { e: '🦠', c: '#FF6B6B', t: 8, displayName: 'Virus (nucleocapsid)', fact: 'A virus is a genetic parasite: nucleic acid (DNA or RNA) wrapped in a protein capsid, 20–300 nm. It has no metabolism, cannot reproduce alone, and blurs the definition of life. The smallest virus (Circovirus) has just 11 genes.' },
    'cell':             { e: '🔬', c: '#7BC857', t: 7, displayName: 'Cell (eukaryotic)', fact: 'The cell is life\'s fundamental unit. A human cell contains 2 m of DNA, ~30,000 proteins, and 50 million ribosomes — all in ~10 µm. The ATP synthase motor spins at 120 rpm, producing 100 ATP/second.' },
    mitochondria:       { e: '🔬', c: '#FF8C5A', t: 8, displayName: 'Mitochondria (cell powerhouse)', fact: 'Mitochondria are endosymbiotic proteobacteria: captured ~1.5 billion years ago, they retain their own circular DNA with 37 genes. Their cristae maximise ATP synthase surface area — a human has ~1 kg of mitochondria.' },
    ribosome:           { e: '🔬', c: '#A8D8EA', t: 8, displayName: 'Ribosome (protein factory)', fact: 'Ribosomes translate mRNA codons into amino acids at 15–20 residues per second. A bacterial ribosome (70S) is ~25 nm; it\'s made of rRNA + proteins. Half of all antibiotics work by targeting the bacterial ribosome.' },
    chromosome:         { e: '🧬', c: '#6C5CE7', t: 8, displayName: 'Chromosome (condensed DNA)', fact: 'Histones compact DNA 10,000-fold: the 2-metre DNA of one cell wraps around ~30 million nucleosomes to fit into a 6-µm nucleus. Chromosome 1 alone contains 248 million base pairs.' },
    bacteria:           { e: '🦠', c: '#90EE90', t: 4 },
    antibody:           { e: '🧬', c: '#FF9EAA', t: 9, displayName: 'Antibody (immunoglobulin IgG)', fact: 'Each B cell produces one unique antibody from the ~10¹³ possible combinations of V, D, and J gene segments. The Y-shaped IgG binds antigen at its Fab tips with dissociation constants of picomolar to nanomolar.' },
    prion:              { e: '🧬', c: '#8B0000', t: 9, displayName: 'Prion (misfolded protein)', fact: 'Prions are infectious proteins with no DNA or RNA — they propagate disease by templating normal PrPᶜ into pathological PrPˢᶜ. They survive autoclaving at 134°C, incineration at 600°C, and UV sterilisation.' },
    'stem-cell':        { e: '🔬', c: '#98FB98', t: 9, displayName: 'Stem Cell (pluripotent)', fact: 'Embryonic stem cells can differentiate into any of 200+ cell types. Yamanaka factors (Oct4, Sox2, Klf4, c-Myc) can reprogram adult skin cells back to a pluripotent state — 2012 Nobel Prize.' },

    // ── GOD-TIER expansion: advanced materials ───────────────────────────────
    aerogel:            { e: '🌫️', c: '#E8F8FF', t: 9, displayName: 'Aerogel (99.8% air by volume)', fact: 'Aerogel is the least dense solid: 1 kg/m³ (air is 1.2 kg/m³). Made by supercritical drying of a silica gel, it has 1,000 m² surface area per gram. NASA uses it to insulate Mars rovers against −120°C nights.' },
    'liquid-crystal':   { e: '💎', c: '#88EEFF', t: 8, displayName: 'Liquid Crystal (LC phase)', fact: 'Liquid crystals flow like liquids but orient like crystals: rod-shaped molecules align under electric fields, rotating polarised light. A twisted nematic cell can switch from black to white in 5 ms — the basis of all LCD screens.' },
    titanium:           { e: '⚙️', c: '#8899AA', t: 5 },
    'titanium-alloy':   { e: '⚙️', c: '#6B8CAE', t: 8, displayName: 'Titanium Alloy (Ti-6Al-4V)', fact: 'Ti-6Al-4V: the most-used titanium alloy — 6% Al raises strength, 4% V improves ductility. Specific strength beats steel and aluminium. Biocompatible: bone grows onto it, making it the standard for implants and aerospace.' },
    'shape-memory':     { e: '⚙️', c: '#B8C8D8', t: 8, displayName: 'Shape-Memory Alloy (NiTi)', fact: 'Nitinol undergoes reversible martensite→austenite transition at body temperature: a deformed stent springs back to its original shape when deployed inside a coronary artery.' },
    zeolite:            { e: '🔬', c: '#F5F5DC', t: 7, displayName: 'Zeolite (aluminosilicate cage)', fact: 'Zeolites are crystalline aluminosilicates with pores of precise molecular dimensions (3–10 Å). Their cage-like cavities crack crude oil in catalytic cracking; ZSM-5 converts methanol to gasoline.' },

    // ── GOD-TIER expansion: energy & environment ─────────────────────────────
    'natural-gas':      { e: '🔥', c: '#88DDFF', t: 6, displayName: 'Natural Gas (CH₄ 95%)', fact: 'Natural gas is ~95% methane, formed by microbial decomposition of organic matter (biogenic) or by heat/pressure cracking of petroleum (thermogenic). The US burns 30 trillion cubic feet per year — 1/3 for electricity.' },
    'crude-oil':        { e: '🛢️', c: '#2C1A0E', t: 7, displayName: 'Crude Oil (petroleum)', fact: 'Crude oil is a mixture of hydrocarbons from kerogen matured by 60–120°C for millions of years. Fractional distillation separates it by boiling point: naphtha (35°C), kerosene (175°C), diesel (250°C), lubricants (350°C+).' },
    kerosene:           { e: '🛢️', c: '#F5E8AA', t: 7, displayName: 'Kerosene (C₁₂–C₁₅)', fact: 'Jet fuel (Jet A-1) is highly refined kerosene with a freezing point of −47°C. A Boeing 747 burns ~12 litres per kilometre. Its energy density is 35 MJ/L — 25× higher than Li-ion batteries (1.4 MJ/L).' },
    gasoline:           { e: '🛢️', c: '#F5D066', t: 7, displayName: 'Gasoline (C₅–C₁₂ blend)', fact: 'Octane rating measures resistance to premature ignition (knocking). Iso-octane = 100; n-heptane = 0. Tetraethyl lead (banned 1996) raised octane by quenching free-radical chain reactions; now replaced by ethanol blending.' },
    'carbon-capture':   { e: '🌿', c: '#4CAF50', t: 9, displayName: 'Carbon Capture (CCS)', fact: 'Amine scrubbers (e.g., MEA, monoethanolamine) absorb CO₂ at 40°C and release it at 120°C for storage. Direct Air Capture requires ~2,000 kWh to capture 1 tonne of CO₂ — vs 870 kWh to produce it from coal.' },

    // ── GOD-TIER expansion: explosives & forensics ──────────────────────────
    rdx:                { e: '💣', c: '#B83232', t: 9, displayName: 'RDX (C₃H₆N₆O₆)', fact: 'Research Department Explosive: detonation velocity 8,750 m/s (TNT: 6,900 m/s). Hexamine + HNO₃ at −10°C yield RDX via Bachmann process. The primary explosive in C-4, SEMTEX, and shaped charges.' },
    'black-powder':     { e: '💣', c: '#3A3A3A', t: 7, displayName: 'Black Powder (KNO₃ 75%, C 15%, S 10%)', fact: 'Invented in 9th-century China by Taoist alchemists seeking immortality elixirs. Black powder burns at ~3,000 K, producing CO, CO₂, N₂, K₂S — not an explosive but a propellant (burns, not detonates).' },

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
    oganesson:     { e: '🌌', c: '#81ECEC', t: 8 },

    // ── Metal fluorides ───────────────────────────────────────────────────
    'lithium-fluoride':    { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Lithium Fluoride (LiF)', fact: 'LiF has the lowest refractive index (1.39) and widest UV–IR transmission of any crystal. Used in nuclear molten-salt reactors and synchrotron X-ray optics.' },
    'sodium-fluoride':     { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Sodium Fluoride (NaF)', fact: 'NaF at 1 ppm in drinking water reduces dental caries by 50–70%. Fluoride replaces hydroxide in tooth enamel hydroxyapatite, making it ~100× more acid-resistant.' },
    'potassium-fluoride':  { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Potassium Fluoride (KF)' },
    'calcium-fluoride':    { e: '💎', c: '#FF9F43', t: 5, displayName: 'Calcium Fluoride (CaF₂ / Fluorite)', fact: 'Fluorite names both the element fluorine and the phenomenon of fluorescence — it glows blue under UV. The chief ore of fluorine; also used for UV-transparent lenses on deep-space telescope cameras.' },
    'magnesium-fluoride':  { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Magnesium Fluoride (MgF₂)', fact: 'MgF₂ transmits UV down to 120 nm — no other common optical material manages this. Used to coat excimer laser optics and telescope mirrors (transmits the vacuum UV that glass completely blocks).' },
    'barium-fluoride':     { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Barium Fluoride (BaF₂)', fact: 'BaF₂ scintillates faster than any other inorganic crystal — it emits a prompt UV flash within 0.6 ns. Used in particle physics detectors (CERN CMS calorimeter) and gamma-ray cameras.' },
    'uranium-hexafluoride':{ e: '☢️', c: '#E17055', t: 8, displayName: 'Uranium Hexafluoride (UF₆)', fact: 'UF₆ sublimes at 56.5°C and is the only uranium compound volatile enough for gaseous diffusion enrichment. A drop of water reacts explosively to form UO₂F₂ and HF gas.' },

    // ── More metal oxides ─────────────────────────────────────────────────
    'sodium-oxide':        { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Sodium Oxide (Na₂O)', fact: 'Na₂O reacts violently with water to form NaOH. In glass chemistry, Na₂O (from soda ash) is the network modifier that breaks Si–O–Si bridges, lowering the melting point of silica by 800°C.' },
    'potassium-oxide':     { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Potassium Oxide (K₂O)', fact: 'K burns in air to form superoxide KO₂ preferentially — the orange product, not the white K₂O. KO₂ is used in breathing apparatus: it reacts with exhaled CO₂ and moisture to release O₂.' },
    'barium-oxide':        { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Barium Oxide (BaO)', fact: 'BaO is coated onto cathode ray tube electron guns — it lowers the tungsten work function, enabling electron emission at lower temperatures. Also used as a desiccant (reacts with H₂O to form Ba(OH)₂).' },
    'manganese-dioxide':   { e: '🟫', c: '#9098A4', t: 5, displayName: 'Manganese Dioxide (MnO₂)', fact: 'MnO₂ is the cathode of the dry-cell Leclanché battery. One grain catalyses the explosive decomposition of H₂O₂ into O₂ + H₂O. Also the key oxidising agent in the Wacker process for making acetaldehyde.' },
    'chromium-oxide':      { e: '🟩', c: '#9098A4', t: 5, displayName: 'Chromium(III) Oxide (Cr₂O₃)', fact: 'Cr₂O₃ (mp 2435°C) is one of the most stable oxides. It is the green pigment in military camouflage paint, the green color of emeralds (trace impurity in beryl), and the surface of a passive stainless-steel layer.' },
    'nickel-oxide':        { e: '⬛', c: '#9098A4', t: 5, displayName: 'Nickel Oxide (NiO)', fact: 'Black NiO is a p-type antiferromagnetic semiconductor used in Li-ion cathodes and electrochromic windows. NiO films turn transparent when injected with Li⁺ — the opposite behavior to WO₃.' },
    'cobalt-oxide':        { e: '🔵', c: '#9098A4', t: 5, displayName: 'Cobalt(II) Oxide (CoO)', fact: 'CoO gives deep blue to cobalt glass and Meissen porcelain — a tradition dating to ancient Egyptian smalt. It is an antiferromagnet below its Néel temperature of 293 K (exactly room temperature).' },
    'lead-oxide':          { e: '🟥', c: '#74B9FF', t: 5, displayName: 'Lead Oxide (PbO / Litharge)', fact: 'Yellow PbO (litharge) was the key ingredient of flint glass — it raises the refractive index to create the sparkle of crystal. Red Pb₃O₄ (minium) was the anti-corrosion primer used on the Eiffel Tower.' },
    'tin-oxide':           { e: '⚪', c: '#74B9FF', t: 5, displayName: 'Tin(IV) Oxide (SnO₂ / Cassiterite)', fact: 'Cassiterite (SnO₂) is nearly all the world\'s tin ore. Thin conductive SnO₂ films coat touchscreens and solar-cell fronts — transparent conductors that can replace the scarcer indium tin oxide.' },
    'vanadium-pentoxide':  { e: '🟧', c: '#9098A4', t: 6, displayName: 'Vanadium Pentoxide (V₂O₅)', fact: 'V₂O₅ is the catalyst in the Contact Process for making H₂SO₄ at 450°C: SO₂ + ½O₂ → SO₃. ~265 million tonnes of H₂SO₄/year flow from this catalyst. Also used in vanadium redox flow batteries.' },
    'tungsten-trioxide':   { e: '🟨', c: '#9098A4', t: 6, displayName: 'Tungsten Trioxide (WO₃)', fact: 'Electrochromic WO₃ films turn deep blue when electrons and H⁺ are injected (forming HₓWO₃). This is the basis of smart glass — windows that tint on demand, saving building cooling costs by 25%.' },

    // ── Metal carbides ────────────────────────────────────────────────────
    'calcium-carbide':     { e: '🪨', c: '#FF9F43', t: 6, displayName: 'Calcium Carbide (CaC₂)', fact: 'CaC₂ + H₂O → C₂H₂ + Ca(OH)₂ — the original industrial acetylene source (1892). Before gas grids, "carbide lamps" lit mines and bicycles. CaC₂ is still produced at 2000°C in electric arc furnaces.' },
    'silicon-carbide':     { e: '💎', c: '#A29BFE', t: 6, displayName: 'Silicon Carbide (SiC / Carborundum)', fact: 'SiC (9.5 Mohs) was accidentally synthesised by Acheson in 1891. Now the semiconductor of choice for EV inverters — it handles 1200 V at 200°C, where silicon fails. Reduces EV charger size by 50%.' },
    'tungsten-carbide':    { e: '⚙️', c: '#9098A4', t: 7, displayName: 'Tungsten Carbide (WC)', fact: 'WC (Vickers 2600) is harder than corundum. Mixed with cobalt binder (cemented carbide), it makes drill bits, milling cutters, and the carbide ball in your ballpoint pen that rolls ink without wearing.' },
    'boron-carbide':       { e: '💎', c: '#A29BFE', t: 7, displayName: 'Boron Carbide (B₄C)', fact: 'Third-hardest known material (9.5 Mohs), lighter than aluminium. Used in tank ceramic armour and bulletproof vests, and in nuclear reactor control rods — ¹⁰B has the highest thermal-neutron capture cross-section of any stable isotope.' },
    'titanium-carbide':    { e: '⚙️', c: '#9098A4', t: 7, displayName: 'Titanium Carbide (TiC)', fact: 'TiC is metallic (electrically conductive), unlike most carbides. Used in cermets (ceramic-metal composites) for high-speed machining. At 3160°C, it has the highest melting point of any carbide.' },

    // ── Metal nitrides ────────────────────────────────────────────────────
    'boron-nitride':       { e: '💎', c: '#A29BFE', t: 6, displayName: 'Boron Nitride (BN — h-BN or c-BN)', fact: 'h-BN (hexagonal) is a slippery white solid structurally identical to graphite. c-BN (cubic) is the second-hardest material known — unlike diamond it is stable in air to 1400°C and does not react with iron, making it ideal for machining steels.' },
    'silicon-nitride':     { e: '💎', c: '#A29BFE', t: 7, displayName: 'Silicon Nitride (Si₃N₄)', fact: 'Si₃N₄ ceramics survive thermal shock that would shatter glass. Formula 1 gearboxes use Si₃N₄ ball bearings — lighter, harder, and run without lubrication. Also used as cutting tools for aerospace nickel superalloys.' },
    'titanium-nitride':    { e: '🥈', c: '#FFD700', t: 6, displayName: 'Titanium Nitride (TiN)', fact: 'TiN\'s golden color comes from its band structure — it reflects light like gold but is Mohs 9 hard. The gold-colored coating on drill bits is TiN, applied by physical vapour deposition. TiN also coats medical implants.' },
    'aluminum-nitride':    { e: '⚪', c: '#74B9FF', t: 6, displayName: 'Aluminum Nitride (AlN)', fact: 'AlN has the highest thermal conductivity of any electrical insulator (285 W/m·K vs. diamond 2000 W/m·K). Used to replace toxic beryllium oxide in electronics substrates — it keeps CPUs cool without BeO\'s carcinogenic risk.' },
    'magnesium-nitride':   { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Magnesium Nitride (Mg₃N₂)' },

    // ── More metal sulfides ───────────────────────────────────────────────
    'silver-sulfide':      { e: '⬛', c: '#C8CCD2', t: 5, displayName: 'Silver Sulfide (Ag₂S / Acanthite)', fact: 'The black tarnish on silverware is Ag₂S. Atmospheric H₂S (from eggs, rubber bands, and pollution) reacts with silver — even 1 ppb H₂S tarnishes silver in days. Cleaning requires either polishing or electrochemical reduction.' },
    'sodium-sulfide':      { e: '🟡', c: '#FF6B6B', t: 5, displayName: 'Sodium Sulfide (Na₂S)', fact: 'Na₂S is the key chemical in kraft paper pulping — it cleaves the lignin ether bonds that bind cellulose fibres. The characteristic rotten-egg smell of paper mills is H₂S from Na₂S hydrolysis. ~180 million tonnes of paper/year depend on it.' },
    'tin-sulfide':         { e: '🟡', c: '#74B9FF', t: 5, displayName: 'Tin Sulfide (SnS₂ / Mosaic Gold)', fact: 'Gold-coloured SnS₂ (mosaic gold) was used as a cheap gilding pigment in medieval illuminated manuscripts. Unlike fool\'s gold (pyrite), it is chemically stable. Today used as a photocatalyst and 2D-material lubricant.' },
    'bismuth-sulfide':     { e: '🌈', c: '#74B9FF', t: 6, displayName: 'Bismuth Sulfide (Bi₂S₃)', fact: 'Bi₂S₃ has a 1.3 eV bandgap — near-perfect for single-junction solar cells. Unlike toxic CdS, Bi₂S₃ is non-toxic and earth-abundant, making it a leading candidate for next-generation thin-film photovoltaics.' },

    // ── Metal sulfates ────────────────────────────────────────────────────
    'magnesium-sulfate':   { e: '🧂', c: '#FF9F43', t: 6, displayName: 'Magnesium Sulfate (MgSO₄·7H₂O / Epsom Salt)', fact: 'Epsom salt was discovered at Epsom, Surrey in 1618 — bitter spring water "drew out humours." Mg²⁺ absorbs transdermally and relaxes muscles. Medically used IV to prevent eclampsia seizures in pregnancy.' },
    'iron-sulfate':        { e: '🟩', c: '#8B4A1F', t: 6, displayName: 'Iron(II) Sulfate (FeSO₄·7H₂O / Green Vitriol)', fact: 'Blue-green vitriol was the medieval alchemist\'s key compound — Paracelsus distilled it to isolate H₂SO₄ (oleum vitrioli). Still used to treat iron-deficiency anaemia (2 billion people affected globally).' },
    'zinc-sulfate':        { e: '⚪', c: '#9098A4', t: 6, displayName: 'Zinc Sulfate (ZnSO₄ / White Vitriol)', fact: 'ZnSO₄ prevents zinc deficiency in acidic soils — without zinc, maize, rice, and wheat cannot synthesise the metalloenzyme carbonic anhydrase, collapsing yields. Zinc deficiency is the most common micronutrient deficiency in global crops.' },
    'barium-sulfate':      { e: '⚪', c: '#FF9F43', t: 6, displayName: 'Barium Sulfate (BaSO₄ / Barite)', fact: 'BaSO₄ is X-ray opaque yet completely insoluble and harmless — a "barium meal" lets radiologists image the entire GI tract in real time. Also the dominant white filler pigment in paints (blanc fixe, Mohs 3.5).' },
    'sodium-sulfate':      { e: '🧂', c: '#FF6B6B', t: 6, displayName: 'Sodium Sulfate (Na₂SO₄ / Glauber\'s Salt)', fact: 'Found by Johann Glauber in 1625 and called sal mirabilis. As Na₂SO₄·10H₂O, it stores 252 kJ/kg of latent heat as it melts at 32°C — proposed as a passive solar heating material in walls.' },
    'aluminum-sulfate':    { e: '⚪', c: '#74B9FF', t: 6, displayName: 'Aluminum Sulfate (Al₂(SO₄)₃ / Alum)', fact: 'Al₃⁺ coagulates negatively charged clay particles in drinking water — flocs settle, carrying bacteria and turbidity with them. Alum has purified water for 5,000 years and still treats 80% of the world\'s drinking water.' },
    'nickel-sulfate':      { e: '🟩', c: '#9098A4', t: 6, displayName: 'Nickel Sulfate (NiSO₄)', fact: 'NiSO₄ is the electrolyte bath for nickel electroplating — it deposits a shiny, corrosion-resistant Ni layer on steel. Also the cathode precursor material in NMC lithium-ion batteries used in electric vehicles.' },

    // ── More metal carbonates ─────────────────────────────────────────────
    'magnesium-carbonate': { e: '🪨', c: '#FF9F43', t: 6, displayName: 'Magnesium Carbonate (MgCO₃ / Magnesite)', fact: 'Athletes and gymnasts chalk their hands with MgCO₃ — lighter and more moisture-absorbing than CaCO₃. Decomposes at 350°C → MgO + CO₂. Natural magnesite deposits in Austria supplied Europe\'s refractory industry for a century.' },
    'iron-carbonate':      { e: '🟫', c: '#8B4A1F', t: 6, displayName: 'Iron Carbonate (FeCO₃ / Siderite)', fact: 'Siderite is the third most abundant iron mineral. It decomposes in blast furnaces to FeO + CO₂, then reduces to Fe. Some iron meteorites are >80% siderite — evidence of ancient carbonaceous parent bodies.' },
    'barium-carbonate':    { e: '⚪', c: '#FF9F43', t: 6, displayName: 'Barium Carbonate (BaCO₃ / Witherite)', fact: 'Ba²⁺ blocks K⁺ channels — soluble barium compounds are lethal. BaCO₃ is insoluble (barely) and used in rat poison, green firework stars, and ceramic capacitor dielectrics (MLCC capacitors are the most-produced electronic component).' },
    'potassium-carbonate': { e: '🧂', c: '#FF6B6B', t: 6, displayName: 'Potassium Carbonate (K₂CO₃ / Potash)', fact: 'Potash was North America\'s first industrial export — settlers burned hardwood and leached the ash. K₂CO₃ is still a major fertiliser source. Canadian Saskatchewan deposits hold 500 years of global potash supply at current rates.' },

    // ── Phosphates ────────────────────────────────────────────────────────
    'calcium-phosphate':   { e: '🦴', c: '#FF9F43', t: 7, displayName: 'Calcium Phosphate (Ca₃(PO₄)₂ / Apatite)', fact: 'Bones and teeth are 65% hydroxyapatite Ca₅(PO₄)₃OH — the hardest biological mineral (5 Mohs). Fluorapatite (F replaces OH) is 30% harder to dissolve — exactly why fluoride prevents dental caries.' },
    'trisodium-phosphate': { e: '🧂', c: '#FF6B6B', t: 6, displayName: 'Trisodium Phosphate (Na₃PO₄ / TSP)', fact: 'TSP solution is pH 12.4 — alkaline enough to saponify grease and denature mildew proteins on surfaces. As a food additive (E339), it maintains pH in processed cheese (that plasticky melt). High phosphate runoff caused 1970s lake eutrophication.' },

    // ── Hydrides ──────────────────────────────────────────────────────────
    phosphine:             { e: '💨', c: '#55EFC4', t: 5, displayName: 'Phosphine (PH₃)', fact: 'PH₃ is the probable explanation for will-o\'-the-wisp (marsh lights) — spontaneous combustion of PH₃ seeping from rotting vegetation. Phosphine was controversially detected in Venus\' atmosphere in 2020, igniting debate about cloud life.' },
    arsine:                { e: '💨', c: '#A29BFE', t: 6, displayName: 'Arsine (AsH₃)', fact: 'AsH₃ (LC50 ≈ 20 ppm) may be the most acutely toxic gas after nerve agents. The "Gosio effect" — Victorian crib deaths — likely arose from mould on arsenic-laced wallpaper producing AsH₃, silently poisoning sleeping infants.' },
    silane:                { e: '💨', c: '#A29BFE', t: 5, displayName: 'Silane (SiH₄)', fact: 'SiH₄ ignites spontaneously in air. Plasma-decomposed by CVD, it deposits pure silicon thin-films on glass — the technology behind solar panels and flat-panel TFT displays. All LCD screens depend on amorphous silicon from silane.' },
    diborane:              { e: '💨', c: '#A29BFE', t: 6, displayName: 'Diborane (B₂H₆)', fact: 'B₂H₆ has three-centre two-electron "banana bonds" — two H atoms bridge the B atoms using just 2 electrons. Lipscomb\'s explanation of this electron-deficient bonding (1975 Nobel Prize) revolutionised the theory of chemical bonding.' },
    'hydrogen-bromide':    { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Bromide (HBr)', fact: 'HBr dissolves in water to form hydrobromic acid — stronger than HCl. Used in pharmaceutical synthesis. Its anti-Markovnikov addition to alkenes (with peroxides, Kharasch effect) is a key organic reaction.' },

    // ── More organics ─────────────────────────────────────────────────────
    'carbon-disulfide':    { e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Carbon Disulfide (CS₂)', fact: 'CS₂ dissolves cellulose xanthate to spin viscose rayon — the first synthetic fibre (1894). Autoignition at 90°C — a warm steam pipe can ignite it. One of the most flammable liquids; it boils at 46°C.' },
    'carbon-tetrachloride':{ e: '🧪', c: '#FDCB6E', t: 6, displayName: 'Carbon Tetrachloride (CCl₄)', fact: 'CCl₄ was once used in fire extinguishers and dry-cleaning. Banned in the 1980s — each molecule destroys ~1,000 ozone molecules in the stratosphere, and it causes liver cancer. Still used in semiconductor manufacture.' },
    glycerol:              { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Glycerol (C₃H₈O₃ / Glycerine)', fact: 'Every fat is 3 fatty acids esterified to glycerol. Soap and biodiesel manufacture generates 10% glycerol by weight. Pure glycerol is sweet, non-toxic, and hygroscopic — used in food (E422), cosmetics, and as nitroglycerin\'s backbone.' },
    propane:               { e: '💨', c: '#55EFC4', t: 7, displayName: 'Propane (C₃H₈)', fact: 'Propane liquefies at −42°C at atmospheric pressure — storable in portable cylinders. LPG (propane + butane) is used by ~1 billion people for cooking. It burns cleaner than coal and is the primary heating fuel in rural areas without gas grids.' },
    butane:                { e: '💨', c: '#55EFC4', t: 7, displayName: 'Butane (C₄H₁₀)', fact: 'Butane liquefies at just −1°C — ideal for cigarette lighters (liquid under cap pressure, vapour when released). Normal and isobutane (2-methylpropane) are structural isomers: same formula, different boiling points (−1°C vs −12°C).' },
    ethane:                { e: '💨', c: '#55EFC4', t: 6, displayName: 'Ethane (C₂H₆)', fact: 'Ethane is cracked at 850°C to produce ethylene — the world\'s most produced organic chemical (~200 Mt/yr). Nearly all ethylene used in plastics (polyethylene, PVC, polystyrene) originates from ethane steam cracking.' },
    acetaldehyde:          { e: '🧪', c: '#DDE6EE', t: 7, displayName: 'Acetaldehyde (CH₃CHO)', fact: 'Your body converts alcohol → acetaldehyde (via alcohol dehydrogenase) → acetic acid. Acetaldehyde causes hangover symptoms — headache, nausea, flushing. The ALDH2*2 variant (40% of East Asians) cannot clear it, causing extreme flushing from alcohol.' },
    toluene:               { e: '⬡', c: '#F5DEB3', t: 8, displayName: 'Toluene (C₇H₈ / Methylbenzene)', fact: 'Toluene is the precursor to TNT (trinitrotoluene), saccharin, and benzoic acid. Also an octane booster and industrial solvent. Chronic inhalation damages the cerebellum — the brain region controlling balance and coordination.' },

    // ── Alloys (new) ──────────────────────────────────────────────────────
    cupronickel:           { e: '🪙', c: '#B8A8A0', t: 7, displayName: 'Cupronickel (Cu 75%, Ni 25%)', fact: 'Your coins are cupronickel: EU €1/€2, UK 5p–50p, US dime and quarter. It resists seawater corrosion — ship heat exchangers use cupronickel tubing. Naturally antimicrobial: bacteria die on its surface within 2 hours.' },
    nichrome:              { e: '⚙️', c: '#B0B8C0', t: 8, displayName: 'Nichrome (Ni 80%, Cr 20%)', fact: 'Nichrome is the standard resistance-heating wire — in toasters, hair dryers, and pottery kilns. The Cr forms a self-repairing Cr₂O₃ layer, allowing nichrome to glow at 1200°C without oxidising. Resistance barely changes with temperature.' },
    'sterling-silver':     { e: '🪙', c: '#D8D8E0', t: 7, displayName: 'Sterling Silver (Ag 92.5%, Cu 7.5%)', fact: 'Pure silver is too soft to hallmark as durable jewellery. The sterling standard (92.5% Ag, 7.5% Cu) triples hardness while keeping lustre. The British hallmarking standard dates to 1238 — the oldest consumer-protection law still in force.' },
    'rose-gold':           { e: '🪙', c: '#FFB8A0', t: 7, displayName: 'Rose Gold (Au-Cu alloy)', fact: 'Rose gold (18K = 75% Au, 22% Cu, 3% Ag) became fashionable in 19th-century Russia — hence "Russian gold." More copper deepens the pink toward "red gold." The copper also makes it harder than yellow gold of the same karat.' },
    duralumin:             { e: '⚙️', c: '#C8D4E8', t: 8, displayName: 'Duralumin (Al-Cu-Mg alloy)', fact: 'Duralumin (94% Al, 4% Cu, 0.5% Mg) was discovered in 1906 by Alfred Wilm, who found that age-hardening tripled its strength overnight. It built the Zeppelin rigid frames and the fuselages of WWII aircraft.' },

    // ── Sugars & biochem ──────────────────────────────────────────────────
    fructose:              { e: '🍬', c: '#FFC838', t: 7, displayName: 'Fructose (C₆H₁₂O₆ / Fruit Sugar)', fact: 'Fructose is 1.7× sweeter than sucrose. Unlike glucose, fructose metabolism bypasses insulin-regulated steps — the liver converts excess fructose to fat (de novo lipogenesis) regardless of energy status, contributing to fatty liver.' },
    lactose:               { e: '🥛', c: '#F5F0E8', t: 8, displayName: 'Lactose (C₁₂H₂₂O₁₁ / Milk Sugar)', fact: 'Lactase (the enzyme that digests lactose) switches off at weaning in most mammals. Lactase persistence evolved only ~10,000 years ago in cattle-herding societies — a remarkably rapid genetic adaptation to a new food source.' },
    galactose:             { e: '🍬', c: '#FFC870', t: 7, displayName: 'Galactose (C₆H₁₂O₆)', fact: 'Galactose differs from glucose only in the orientation of the OH group at C4 (epimerisation). It is the other half of lactose. Galactosemia (inability to metabolise galactose) causes liver failure in newborns if milk is not avoided.' },
    dopamine:              { e: '💊', c: '#7B68EE', t: 9, displayName: 'Dopamine (C₈H₁₁NO₂)', fact: 'Dopamine fires when rewards are better than predicted — it encodes prediction error, not pleasure itself. This "wanting" system (not opioid "liking") drives addiction. Parkinson\'s disease destroys dopaminergic neurons in the substantia nigra, causing tremors.' },
    serotonin:             { e: '💊', c: '#FF69B4', t: 9, displayName: 'Serotonin (C₁₀H₁₂N₂O)', fact: '95% of serotonin is made in the gut, not the brain — enterochromaffin cells detect toxins and trigger vomiting. SSRIs treat depression by prolonging synaptic serotonin. Serotonin syndrome (too much) causes fever and seizures.' },
    melatonin:             { e: '💊', c: '#9B59B6', t: 9, displayName: 'Melatonin (C₁₃H₁₆N₂O₂)', fact: 'Melatonin is synthesised from serotonin in the pineal gland only in darkness. Blue-wavelength screen light (480 nm) suppresses it, delaying sleep onset by 1–3 hours. Even 10 lux through closed eyelids is enough to suppress secretion.' },
    collagen:              { e: '🧬', c: '#FFE4E1', t: 9, displayName: 'Collagen (triple-helix protein)', fact: 'Collagen is the most abundant protein (30% of body mass) — the structural scaffold of skin, bone, tendon, and cornea. Every third residue must be glycine (the only amino acid small enough to fit inside the triple helix). Scurvy unravels collagen by blocking the hydroxylation of proline.' },
    keratin:               { e: '🧬', c: '#F5DEB3', t: 9, displayName: 'Keratin (structural α-protein)', fact: 'Hair, nails, feathers, horns, and the outer skin layer are all keratin. The protein is rich in cysteine — disulfide bonds between adjacent chains create rigidity. Perming hair breaks and reforms these S–S bonds in a new curl pattern.' },

    // ── Industrial chemicals ──────────────────────────────────────────────
    'potassium-permanganate':{ e: '🟣', c: '#6C1C9E', t: 7, displayName: 'Potassium Permanganate (KMnO₄)', fact: 'One of chemistry\'s strongest oxidisers — a few crystals turn water vivid purple and disinfect it in minutes. MnO₄⁻ reduces to MnO₂ (brown) in neutral water or Mn²⁺ (colourless) in acid. Used in gold extraction, water treatment, and to test for alkenes (Baeyer test).' },
    'adipic-acid':         { e: '🧪', c: '#DDE6EE', t: 8, displayName: 'Adipic Acid (C₆H₁₀O₄)', fact: 'Adipic acid is the monomer for nylon-6,6 (condensed with hexamethylenediamine). ~3 billion kg/year is produced — almost entirely from cyclohexane oxidation. Making it releases N₂O, a greenhouse gas 273× more potent than CO₂.' },
    'acrylic-acid':        { e: '🧪', c: '#DDE6EE', t: 8, displayName: 'Acrylic Acid (CH₂=CHCOOH)', fact: 'Polymerised acrylic acid is polyacrylate — the superabsorbent polymer in disposable nappies. A single gram absorbs 800 mL of water via hydrogen bonding to carboxylate groups. Also the basis of acrylic paints and contact lens materials.' },

    // ── Metal hydrides ────────────────────────────────────────────────────
    'lithium-hydride':     { e: '🔋', c: '#FF6B6B', t: 5, displayName: 'Lithium Hydride (LiH)', fact: 'LiH is the lightest ionic compound — 0.775 g/cm³. It stores 12.7 wt% hydrogen, the highest of any metal hydride. Nuclear weapons use ⁶LiD (lithium-6 deuteride) as fusion fuel; LiH moderates and reflects neutrons.' },
    'sodium-hydride':      { e: '🔋', c: '#FF6B6B', t: 5, displayName: 'Sodium Hydride (NaH)', fact: 'NaH is a powerful base — it deprotonates alcohols, acetylenes, and weak C-H acids. Ignites spontaneously in air and reacts explosively with water (Na + H₂). Used in organic synthesis to generate reactive carbanions.' },
    'calcium-hydride':     { e: '🔋', c: '#FF9F43', t: 5, displayName: 'Calcium Hydride (CaH₂)', fact: 'CaH₂ is the most commonly used drying agent for organic solvents — it reacts with trace water to give Ca(OH)₂ + H₂. Safe to use (unlike LiAlH₄), it dries THF, diethyl ether, and toluene to sub-ppm water levels.' },
    'potassium-hydride':   { e: '🔋', c: '#FF6B6B', t: 5, displayName: 'Potassium Hydride (KH)', fact: 'KH is a stronger base than NaH (K is more electropositive). Used in synthesis of potassium enolates. Reacts with alcohols to give potassium alkoxides. Pyrophoric — ignites spontaneously in moist air.' },
    'lithium-aluminum-hydride':{ e: '🔋', c: '#74B9FF', t: 6, displayName: 'Lithium Aluminium Hydride (LiAlH₄)', fact: 'LiAlH₄ (LAH) is the most powerful common reducing agent in organic chemistry — it reduces esters, amides, and carboxylic acids that cannot be reduced by NaBH₄. Reacts explosively with water; handled only under inert atmosphere.' },

    // ── More metal halides ────────────────────────────────────────────────
    'aluminum-chloride':   { e: '⚪', c: '#74B9FF', t: 5, displayName: 'Aluminum Chloride (AlCl₃)', fact: 'AlCl₃ is a Lewis acid catalyst for Friedel-Crafts reactions — it alkylates and acylates benzene rings, making pharmaceuticals, dyes, and plastics. It forms a dimer (Al₂Cl₆) in non-polar solvents. Reacts violently with water.' },
    'barium-chloride':     { e: '🧂', c: '#FF9F43', t: 5, displayName: 'Barium Chloride (BaCl₂)', fact: 'BaCl₂ gives a green-yellow flame in fireworks. The Ba²⁺ ion is a sulphate precipitating agent — BaSO₄ precipitates immediately in sulfate solutions, identifying them qualitatively. Toxic: Ba²⁺ blocks K⁺ channels.' },
    'magnesium-bromide':   { e: '🧂', c: '#FF9F43', t: 5, displayName: 'Magnesium Bromide (MgBr₂)', fact: 'MgBr₂ is the precursor and by-product of Grignard reagents (RMgBr). Victor Grignard won the 1912 Nobel Prize for these organometallic reagents — still the cornerstone of carbon-carbon bond formation in pharmaceutical synthesis.' },
    'silver-iodide':       { e: '⬜', c: '#C8CCD2', t: 5, displayName: 'Silver Iodide (AgI)', fact: 'AgI is the key light-sensitive compound in photographic film — photons promote electrons from I⁻ to Ag⁺, creating a latent Ag atom cluster. It also seeds clouds to trigger rain: AgI crystals mimic ice nuclei at −5°C.' },
    'potassium-iodide':    { e: '🧂', c: '#FF6B6B', t: 5, displayName: 'Potassium Iodide (KI)', fact: 'In a nuclear emergency, KI tablets saturate the thyroid with stable iodine, blocking uptake of radioactive ¹³¹I. WHO pre-positioned KI near all nuclear plants. Also used to prevent iodine-deficiency goitre (affects 750 million people).' },
    'sodium-iodide':       { e: '🧂', c: '#FF6B6B', t: 5, displayName: 'Sodium Iodide (NaI:Tl)', fact: 'NaI crystals doped with thallium are the most common gamma-ray detector — Tl⁺ centres emit visible light when struck by gamma photons. Each 662 keV gamma from ¹³⁷Cs produces ~20,000 scintillation photons.' },
    'lead-iodide':         { e: '🟡', c: '#74B9FF', t: 6, displayName: 'Lead Iodide (PbI₂)', fact: 'PbI₂ forms brilliant golden-yellow crystals — once used as the pigment "iodine yellow". Now attracting intense interest as a perovskite solar cell absorber (methylammonium lead iodide reaches 26% efficiency), despite Pb toxicity concerns.' },

    // ── Lubricant sulfides ────────────────────────────────────────────────
    'molybdenum-disulfide':{ e: '⚙️', c: '#9098A4', t: 6, displayName: 'Molybdenum Disulfide (MoS₂)', fact: 'MoS₂ layers slide over each other with less friction than graphite — used in aerospace lubricants that work in vacuum (graphite fails without adsorbed water). A single-layer MoS₂ is a direct-bandgap semiconductor, used in next-generation transistors.' },
    'tungsten-disulfide':  { e: '⚙️', c: '#9098A4', t: 6, displayName: 'Tungsten Disulfide (WS₂)', fact: 'WS₂ is the world\'s slipperiest solid — friction coefficient 0.03. Its layered structure (like MoS₂) allows sheets to slide easily. NASA uses WS₂ lubricant on Mars rovers; it works from −270°C to 650°C in vacuum.' },
    'nickel-sulfide':      { e: '🟩', c: '#9098A4', t: 5, displayName: 'Nickel Sulfide (NiS)', fact: 'NiS deposits form in toughened glass panels as microscopic inclusions. Under stress, they can expand and cause spontaneous glass breakage (nickel sulfide inclusion failure) — rare but dramatic, causing building facades to shatter without warning.' },
    'cobalt-sulfide':      { e: '🟦', c: '#9098A4', t: 5, displayName: 'Cobalt Sulfide (CoS)', fact: 'CoS is a precursor to cobalt-based hydrotreating catalysts (CoMoS) used in petroleum refining to remove sulfur from fuels. Responsible for the global reduction in sulphur-dioxide emissions from transport.' },
    'aluminum-sulfide':    { e: '🟡', c: '#74B9FF', t: 5, displayName: 'Aluminum Sulfide (Al₂S₃)', fact: 'Al₂S₃ reacts dramatically with water: Al₂S₃ + 6H₂O → 2Al(OH)₃ + 3H₂S. The rotten-egg smell is instant and overpowering. It cannot exist in humid air — not a practical material, but a dramatic demo of a water-reactive compound.' },

    // ── More organic chemistry ────────────────────────────────────────────
    propylene:             { e: '💨', c: '#55EFC4', t: 7, displayName: 'Propylene (C₃H₆ / Propene)', fact: 'Propylene is the monomer for polypropylene — the most versatile thermoplastic. It also reacts with ammonia + oxygen (Sohio process) to make acrylonitrile for acrylic fibres. Global production exceeds 120 Mt/year.' },
    cyclohexane:           { e: '⬡', c: '#F5DEB3', t: 8, displayName: 'Cyclohexane (C₆H₁₂)', fact: 'Cyclohexane exists in "chair" and "boat" conformations — the chair is 29 kJ/mol more stable. This puckered geometry is the model for all saturated ring systems in chemistry. Most industrial cyclohexane is oxidised to adipic acid for nylon.' },
    'calcium-cyanamide':   { e: '🧪', c: '#FF9F43', t: 6, displayName: 'Calcium Cyanamide (CaCN₂)', fact: 'CaCN₂ is an early nitrogen fertiliser (the "nitrogen lime" process, 1902): CaC₂ + N₂ → CaCN₂ at 1100°C. It hydrolyses in soil to urea, then to NH₄⁺. It also sterilises soil of nematodes — a non-synthetic pesticide.' },
    'calcium-silicate':    { e: '🪨', c: '#FF9F43', t: 6, displayName: 'Calcium Silicate (CaSiO₃ / Wollastonite)', fact: 'CaSiO₃ is the main binding phase in slag and ancient Roman cement. Calcium-silicate-hydrate (C-S-H) gel is the glue of modern concrete — formed when Ca²⁺ reacts with Si-O⁻ chains, binding aggregate particles together.' },

    // ── Phosphorus compounds ──────────────────────────────────────────────
    'phosphorus-pentoxide':{ e: '⚪', c: '#55EFC4', t: 6, displayName: 'Phosphorus Pentoxide (P₄O₁₀)', fact: 'P₄O₁₀ is the most powerful known desiccant — it absorbs water from concentrated H₂SO₄, fumigating acids, and even reacts with water of crystallisation. Used in the synthesis of phosphoric acid: P₄O₁₀ + 6H₂O → 4H₃PO₄.' },
    'phosphorus-trichloride':{ e: '🧪', c: '#55EFC4', t: 6, displayName: 'Phosphorus Trichloride (PCl₃)', fact: 'PCl₃ is the key intermediate in phosphorus chemistry — it reacts with alcohols to make phosphite esters (used in nerve agent antidote atropine synthesis) and with Cl₂ to make PCl₅. Highly toxic, reacts violently with water to give HCl + H₃PO₃.' }
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

    // ── Alloys ────────────────────────────────────────────────────────────────
    ['copper','tin','bronze'],              // Cu + Sn → Bronze
    ['copper','tin','bronze'],             // duplicate guard (same key)
    ['copper','zinc','brass'],             // Cu + Zn → Brass
    ['iron','carbon','steel'],             // Fe + C → Steel
    ['iron','coal','steel'],               // Fe + charcoal → Steel (bloomery)
    ['steel','chromium','stainless-steel'],// Steel + Cr → Stainless Steel
    ['iron','chromium','stainless-steel'], // direct route
    ['iron','carbon','cast-iron'],         // high-C iron (seenKey blocks; steel wins above, so cast-iron via different input pair below)
    ['pig-iron','air','cast-iron'],        // placeholder pair for cast iron
    ['mercury','silver','amalgam'],        // Hg + Ag → dental amalgam
    ['nickel','titanium','nitinol'],       // Ni + Ti → shape-memory alloy
    ['tin','lead','solder'],               // Sn + Pb → solder
    ['tin','copper','solder'],             // lead-free Sn-Cu solder

    // ── Minerals & gems ───────────────────────────────────────────────────────
    ['iron','disulfur','pyrite'],          // Fe + S₂ → FeS₂ (fool's gold)
    ['iron','sulfur','pyrite'],            // Fe + S → FeS₂ (simplified)
    ['lead','sulfur','galena'],            // Pb + S → PbS
    ['mercury','sulfur','cinnabar'],       // Hg + S → HgS
    ['calcium','sulfur','gypsum'],         // Ca + S → CaSO₄ simplified
    ['calcium-oxide','sulfur-dioxide','gypsum'],  // CaO + SO₂ → CaSO₃/CaSO₄
    ['aluminum-oxide','chromium','ruby'],  // Al₂O₃ + Cr → Ruby
    ['corundum','chromium','ruby'],        // corundum + Cr → ruby
    ['aluminum-oxide','titanium','sapphire'], // Al₂O₃ + Ti → Sapphire
    ['beryllium','aluminum','emerald'],    // Be + Al + Si → Emerald (simplified)

    // ── Inorganic additions ───────────────────────────────────────────────────
    ['dihydrogen','dioxygen','hydrogen-peroxide'],   // H₂ + O₂ → H₂O₂
    ['hydrogen','dioxygen','hydrogen-peroxide'],     // simpler route
    ['nitrogen','dioxygen','nitrous-oxide'],         // N + O₂ → N₂O (simplified)
    ['dinitrogen','oxygen','nitrous-oxide'],         // N₂ + O → N₂O
    ['sodium-hydroxide','carbon-dioxide','baking-soda'], // NaOH + CO₂ → NaHCO₃
    ['sodium','carbon-dioxide','baking-soda'],       // simplified
    ['sodium-carbonate','carbon-dioxide','baking-soda'], // Na₂CO₃ + CO₂ + H₂O → 2NaHCO₃
    ['sodium-hydroxide','water','washing-soda'],     // NaOH + H₂O → Na₂CO₃ simplified
    ['sodium-chloride','energy','bleach'],           // electrolysis of brine → NaOCl
    ['chlorine','sodium-hydroxide','bleach'],        // Cl₂ + NaOH → NaOCl + NaCl + H₂O
    ['aluminum','iron-oxide','thermite'],            // Al + Fe₂O₃ → Thermite
    ['aluminum','rust','thermite'],                  // alternate

    // ── Energetics ────────────────────────────────────────────────────────────
    ['potassium','nitrogen','gunpowder'],            // KNO₃ component (simplified)
    ['potassium-chloride','carbon','gunpowder'],     // simplified KNO₃ + C
    ['potassium','sulfur','gunpowder'],              // KNO₃ + S + C (simplified key combo)
    ['benzene','nitric-acid','tnt'],                 // C₆H₆ + HNO₃ → TNT (nitration)
    ['glycerol','nitric-acid','nitroglycerin'],      // C₃H₈O₃ + HNO₃ → nitroglycerin
    ['ethanol','nitric-acid','nitroglycerin'],       // simplified organic + nitric acid

    // ── Organic chemistry chain ───────────────────────────────────────────────
    ['methane','oxygen','methanol'],                 // CH₄ + ½O₂ → CH₃OH (partial oxidation)
    ['methanol','oxygen','formaldehyde'],            // CH₃OH + ½O₂ → CH₂O
    ['methane','dioxygen','formaldehyde'],           // simplified
    ['acetylene','oxygen','acetone'],                // Wacker-type: C₂H₂ → propan-2-one (simplified)
    ['ethylene','carbon-dioxide','acetone'],         // simplified ketone route
    ['acetylene','acetylene','benzene'],             // 3 C₂H₂ → C₆H₆ (trimerisation)
    ['acetylene','acetylene','benzene'],             // guard dup
    ['benzene','water','phenol'],                    // cumene process simplified
    ['benzene','oxygen','phenol'],                   // direct oxidation (simplified)
    ['phenol','carbon-dioxide','salicylic-acid'],    // Kolbe synthesis: C₆H₅OH + CO₂ → C₇H₆O₃
    ['salicylic-acid','acetic-acid','aspirin'],      // aspirin synthesis!
    ['salicylic-acid','acetylene','aspirin'],        // alternate route
    ['adenine','methane','caffeine'],                // very simplified xanthine methylation
    ['urea','benzene','caffeine'],                   // simplified purine base synthesis
    ['ethylene','water','ethylene_glycol'],          // C₂H₄ + H₂O → antifreeze
    ['glucose','fructose','sucrose'],                // glycosidic bond
    ['glucose','glucose','starch'],                  // glucose polymerisation (simplified)
    ['glucose','energy','cellulose'],                // β-1,4 linkage requires enzymes (energy as proxy)
    ['ethylene','energy','polyethylene'],            // free-radical polymerisation
    ['ammonia','acetic-acid','nylon'],               // condensation polymerisation (simplified)

    // ── Biochemistry chain ────────────────────────────────────────────────────
    ['ammonia','acetic-acid','amino-acid'],          // amine + acid → α-amino acid (Strecker synthesis simplified)
    ['ammonia','carbon-dioxide','amino-acid'],       // simplified amino acid synthesis
    ['glycine','ammonia','amino-acid'],              // glycine + ammoniation = generalised amino acid
    ['nitrogen','carbon','glycine'],                 // simplest amino acid from elements
    ['ammonia','formaldehyde','glycine'],            // Strecker: NH₃ + CH₂O → glycine-like
    ['amino-acid','energy','protein'],               // peptide bond formation requires ATP
    ['amino-acid','amino-acid','protein'],           // condensation polymerisation
    ['glucose','phosphorus','atp'],                  // glucose + phosphate → ATP (simplified cellular respiration)
    ['glucose','dioxygen','atp'],                    // aerobic respiration → ATP
    ['plant','sun','vitamin-c'],                     // plants synthesise ascorbic acid
    ['glucose','oxygen','vitamin-c'],                // simplified biosynthesis
    ['magnesium','protein','chlorophyll'],           // Mg-porphyrin complex
    ['magnesium','nitrogen','chlorophyll'],          // Mg chelation simplified
    ['iron','protein','hemoglobin'],                 // Fe-porphyrin complex
    ['iron','amino-acid','hemoglobin'],              // simplified route
    ['protein','protein','enzyme'],                  // proteins fold into enzymes
    ['protein','energy','dna'],                      // DNA + RNA machinery requires proteins
    ['amino-acid','sugar','dna'],                    // nucleotides from sugars + amines + phosphate
    ['nucleotide','nucleotide','dna'],               // polymerisation (nucleotide is an alias)
    ['dna','energy','rna'],                          // transcription
    ['enzyme','insulin','insulin'],                  // insulin IS a protein enzyme (guard)
    ['protein','glucose','insulin'],                 // insulin = glucose-sensing protein hormone
    ['chlorophyll','sun','oxygen'],                  // photosynthesis yields O₂ (light reaction)

    // ── Nuclear chemistry ─────────────────────────────────────────────────────
    ['hydrogen','energy','deuterium'],               // H + neutron → D (energy proxy)
    ['hydrogen','neutron','deuterium'],              // direct neutron capture
    ['deuterium','energy','tritium'],                // D + n → T
    ['deuterium','water','heavy-water'],             // D₂O formation
    ['deuterium','oxygen','heavy-water'],            // D + O → D₂O
    ['uranium','energy','nuclear-fission'],          // U-235 + neutron → fission
    ['plutonium','energy','nuclear-fission'],        // Pu-239 + neutron → fission
    ['nuclear-fission','nuclear-fission','chain-reaction'], // sustained chain reaction
    ['deuterium','tritium','nuclear-fusion'],        // D + T → ⁴He + n + 17.6 MeV
    ['deuterium','deuterium','nuclear-fusion'],      // D + D → fusion (sun-like)
    ['hydrogen','star','nuclear-fusion'],            // stellar fusion
    ['void','energy','antimatter'],                  // pair production (simplified)
    ['light','energy','antimatter'],                 // high-energy photon → e⁺ e⁻ pair

    // ── Advanced materials ────────────────────────────────────────────────────
    ['carbon','energy','graphene'],                  // CVD / arc discharge
    ['coal','energy','graphene'],                    // graphitisation
    ['graphene','graphene','fullerene'],             // C₆₀ from curved graphene
    ['carbon','laser','fullerene'],                  // laser vaporisation of graphite
    ['graphene','energy','carbon-nanotube'],         // rolling graphene into CNT
    ['fullerene','energy','carbon-nanotube'],        // fullerene elongation → CNT
    ['silicon','phosphorus','semiconductor'],        // n-type doping
    ['silicon','boron','semiconductor'],             // p-type doping
    ['semiconductor','semiconductor','solar-cell'],  // p-n junction photovoltaics
    ['silicon','light','solar-cell'],                // solar cell from Si + light (simplified)
    ['yttrium','barium','superconductor'],           // YBCO high-Tc superconductor
    ['copper','oxygen','superconductor'],            // CuO planes in HTSC (simplified)
    ['mushroom','energy','penicillin'],              // Penicillium mould → antibiotic
    ['bacteria','energy','penicillin'],              // biosynthesis route

    // ── GOD-TIER: food & fermentation ─────────────────────────────────────
    ['fungi','glucose','yeast'],                     // Saccharomyces is a sugar-eating fungus
    ['mushroom','sugar','yeast'],                    // simplified
    ['bacteria','mushroom','yeast'],                 // alternate: wild yeast
    ['yeast','flour','bread'],                       // CO₂ leavening
    ['yeast','grain','bread'],                       // grain + yeast → bread
    ['yeast','wheat','bread'],                       // wheat loaf
    ['yeast','grain','beer'],                        // malted barley + yeast → beer
    ['yeast','water','beer'],                        // fermentation in wort
    ['yeast','fruit','wine'],                        // grape fermentation
    ['yeast','grape','wine'],                        // direct route
    ['yeast','ethanol','vinegar'],                   // Acetobacter stage
    ['ethanol','oxygen','vinegar'],                  // CH₃CH₂OH + O₂ → CH₃COOH
    ['ethanol','oxygen','acetic-acid'],              // direct acetic acid route
    ['ethanol','dioxygen','acetic-acid'],            // oxidation
    ['carbon','hydrogen','acetic-acid'],             // direct synthesis
    ['acetic-acid','water','vinegar'],               // dilution of glacial acetic acid
    ['sodium-hydroxide','fat','soap'],               // saponification: NaOH + fat
    ['potassium-hydroxide','fat','soap'],            // KOH + fat → soft soap
    ['sodium-hydroxide','oil','soap'],               // NaOH + plant oil
    ['sodium-hydroxide','fat','lye-soap'],           // traditional cold-process
    ['bee','flower','honey'],                        // bees make honey from nectar
    ['sugar','bee','honey'],                         // simplified
    ['glucose','fructose','honey'],                  // honey is ~38% fructose, 31% glucose
    ['bacteria','milk','cheese'],                    // rennet + bacteria + milk → cheese
    ['rennet','milk','cheese'],                      // chymosin curdles casein
    ['mushroom','milk','cheese'],                    // mold-ripened cheese (Penicillium)
    ['bacteria','milk','yogurt'],                    // Lactobacillus + Streptococcus
    ['bacteria','milk','lactic-acid'],               // lactic fermentation
    ['milk','bacteria','yogurt'],                    // alternate order
    ['fat','water','butter'],                        // cream churning
    ['cream','energy','butter'],                     // mechanical churning
    ['glucose','oxygen','lactic-acid'],              // anaerobic glycolysis product
    ['glucose','bacteria','lactic-acid'],            // bacterial fermentation
    ['fruit','citrus','citric-acid'],                // citrus → citric acid
    ['glucose','enzyme','citric-acid'],              // Krebs cycle intermediate
    ['calcium-oxide','silicon-dioxide','cement'],    // Portland cement clinker
    ['limestone','fire','cement'],                   // calcination: CaCO₃ → CaO + CO₂
    ['cement','water','concrete'],                   // cement paste hardens
    ['cement','sand','concrete'],                    // aggregate mix
    ['concrete','stone','concrete'],                 // reinforced concrete
    ['calcium-carbonate','fire','cement'],           // limestone calcination
    ['calcium-oxide','water','plaster'],             // CaO + H₂O → Ca(OH)₂ → sets
    ['gypsum','fire','plaster'],                     // dehydration of gypsum
    ['sand','fire','glass'],                         // SiO₂ → glass (already in HAND via sand+fire)
    ['silicon-dioxide','fire','glass'],              // direct silica melting
    ['sand','sodium-carbonate','glass'],             // soda-lime glass formula

    // ── GOD-TIER: astronomy ───────────────────────────────────────────────
    ['star','time','supernova'],                     // massive star end of life
    ['star','iron','supernova'],                     // iron core collapse triggers supernova
    ['supernova','gravity','neutron-star'],          // core collapse → neutron star
    ['supernova','time','neutron-star'],             // supernova remnant
    ['neutron-star','energy','pulsar'],              // rotating magnetised neutron star
    ['pulsar','time','neutron-star'],                // pulsar is a neutron star
    ['star','sun','white-dwarf'],                    // sun-like star remnant
    ['sun','time','white-dwarf'],                   // red giant → white dwarf
    ['white-dwarf','time','neutron-star'],           // Chandrasekhar collapse
    ['blackhole','energy','quasar'],                 // supermassive BH + accretion disk
    ['galaxy','blackhole','quasar'],                 // AGN in galactic center
    ['space','cloud','nebula'],                      // already in HAND — guard
    ['supernova','space','nebula'],                  // supernova remnant nebula
    ['star','cloud','nebula'],                       // protostellar nebula

    // ── GOD-TIER: electrochemistry ────────────────────────────────────────
    ['copper','sulfuric-acid','copper-sulfate'],     // Cu + H₂SO₄ → CuSO₄ + H₂↑
    ['copper-oxide','sulfuric-acid','copper-sulfate'],// CuO + H₂SO₄ → CuSO₄ + H₂O
    ['copper-sulfide','oxygen','copper-sulfate'],    // CuS + O₂ → CuSO₄ (roasting)
    ['zinc','copper','voltaic-cell'],               // Volta's galvanic cell
    ['zinc','sulfuric-acid','voltaic-cell'],        // Zn anode + acid electrolyte
    ['zinc','iron','galvanized-iron'],              // hot-dip galvanising
    ['zinc','steel','galvanized-iron'],             // protective Zn coating
    ['hydrogen','oxygen','fuel-cell'],              // H₂ + ½O₂ → H₂O + electricity
    ['dihydrogen','dioxygen','fuel-cell'],          // H₂ + O₂ fuel cell
    ['water','energy','electrolysis'],              // electrolysis of water → H₂ + O₂
    ['sodium-chloride','energy','electrolysis'],    // chlor-alkali electrolysis
    ['potassium','nitrogen','potassium-nitrate'],   // K + NO₃ → KNO₃ (simplified)
    ['potassium','nitric-acid','potassium-nitrate'],// KOH + HNO₃ → KNO₃ + H₂O
    ['potassium-nitrate','carbon','saltpeter'],     // saltpeter is KNO₃
    ['potassium','nitrate','saltpeter'],            // direct

    // ── GOD-TIER: inorganic chemistry ────────────────────────────────────
    ['boron','sodium','borax'],                     // Na₂B₄O₇ simplified
    ['boron','water','borax'],                      // borax dissolution
    ['boron','sodium-hydroxide','borax'],           // B + NaOH → borax
    ['ammonia','nitric-acid','ammonium-nitrate'],   // NH₃ + HNO₃ → NH₄NO₃ (Ostwald)
    ['nitrogen','hydrogen','ammonium-nitrate'],     // simplified direct synthesis
    ['hydrogen-cyanide','water','amino-acid'],      // Strecker synthesis uses HCN
    ['carbon','nitrogen','hydrogen-cyanide'],       // C + N + H → HCN (Andrussow)
    ['methane','ammonia','hydrogen-cyanide'],       // Andrussow process: CH₄ + NH₃ + O₂ → HCN
    ['chlorine','methane','chloroform'],            // free-radical chlorination CH₄ + 3Cl₂ → CHCl₃
    ['dichlorine','methane','chloroform'],          // Cl₂ + CH₄ → CHCl₃
    ['dioxygen','lightning','ozone'],               // O₂ + lightning → O₃
    ['dioxygen','energy','ozone'],                  // already in HAND guard

    // ── GOD-TIER: biology / life sciences ────────────────────────────────
    ['protein','lipid','virus'],                    // nucleocapsid from protein + membrane
    ['dna','protein','virus'],                      // viral genome + capsid protein
    ['rna','protein','virus'],                      // RNA virus (coronavirus, influenza)
    ['bacteria','energy','cell'],                   // endosymbiosis → eukaryotic cell
    ['life','water','cell'],                        // origin of life in water → first cells
    ['dna','water','cell'],                         // cell as DNA container
    ['cell','energy','mitochondria'],               // endosymbiosis of proteobacteria
    ['bacteria','cell','mitochondria'],             // endosymbiotic theory
    ['cell','dna','chromosome'],                    // DNA + histone compaction
    ['dna','protein','chromosome'],                 // histone wrapping
    ['cell','rna','ribosome'],                      // ribosomal RNA + proteins
    ['protein','rna','ribosome'],                   // ribosome assembly
    ['protein','dna','antibody'],                   // B-cell immunoglobulin
    ['immune-cell','virus','antibody'],             // immune response
    ['protein','energy','prion'],                   // misfolding event (energy proxy for stress)
    ['protein','protein','prion'],                  // templated misfolding cascade
    ['stem-cell','dna','stem-cell'],               // self-renewal
    ['cell','life','stem-cell'],                    // embryonic pluripotent cell
    ['embryo','energy','stem-cell'],               // embryonic stem cells

    // ── GOD-TIER: advanced materials ─────────────────────────────────────
    ['silicon-dioxide','energy','aerogel'],         // supercritical drying of silica gel
    ['glass','energy','aerogel'],                   // silica aerogel from glass
    ['silicon','crystal','liquid-crystal'],         // liquid crystal display material
    ['carbon','nitrogen','liquid-crystal'],         // nematic LC molecules are rod-like
    ['titanium','aluminum','titanium-alloy'],       // Ti-6Al-4V aerospace alloy
    ['titanium','vanadium','titanium-alloy'],       // with vanadium additive
    ['nickel','titanium','shape-memory'],           // nitinol shape-memory alloy
    ['silicon','aluminum','zeolite'],               // aluminosilicate framework
    ['silicon-dioxide','aluminum-oxide','zeolite'], // ZSM-5 zeolite
    ['aluminum','clay','zeolite'],                  // natural zeolite from volcanic ash

    // ── GOD-TIER: energy & fuels ─────────────────────────────────────────
    ['methane','earth','natural-gas'],              // fossil methane
    ['carbon','time','crude-oil'],                  // organic matter → petroleum
    ['carbon','pressure','crude-oil'],              // kerogen → crude oil
    ['crude-oil','fire','kerosene'],                // fractional distillation
    ['crude-oil','energy','gasoline'],              // catalytic cracking
    ['crude-oil','energy','kerosene'],              // distillation
    ['carbon-dioxide','energy','carbon-capture'],   // CCS: CO₂ absorption
    ['air','amine','carbon-capture'],               // amine scrubbing DAC

    // ── GOD-TIER: energetics ─────────────────────────────────────────────
    ['ammonia','nitric-acid','rdx'],                // simplified RDX: hexamine + HNO₃ → RDX
    ['hexamine','nitric-acid','rdx'],               // Bachmann process
    ['potassium-nitrate','carbon','black-powder'],  // KNO₃ 75% + C 15% + S 10%
    ['saltpeter','coal','black-powder'],            // historical black powder
    ['saltpeter','sulfur','black-powder'],          // complete formula

    // ── Pure chemistry: periodic-table elements → primal elements ─────────
    ['hydrogen','oxygen','water'],       // 2H₂ + O₂ → 2H₂O (kept; hydrogen+oxygen pair not yet seen)
    ['nitrogen','oxygen','air'],         // ~78% N₂ + 21% O₂ = atmosphere (blocked by nitrogen+oxygen=NO above)
    ['silicon','oxygen','earth'],        // SiO₂ silica = earth's crust (blocked by silicon+oxygen=silicon-dioxide above)
    ['magnesium','oxygen','fire'],       // Mg burns brilliantly in O₂ (blocked by magnesium+oxygen=magnesium-oxide above)
    ['phosphorus','oxygen','phosphorus-pentoxide'],  // P₄ + 5O₂ → P₄O₁₀ (combustion product)
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
    ['tennessine','energy','oganesson'],

    // ── NEW: Metal fluorides ──────────────────────────────────────────────
    ['lithium','fluorine','lithium-fluoride'],
    ['lithium','difluorine','lithium-fluoride'],
    ['sodium','fluorine','sodium-fluoride'],
    ['sodium','difluorine','sodium-fluoride'],
    ['potassium','fluorine','potassium-fluoride'],
    ['calcium','fluorine','calcium-fluoride'],
    ['calcium','difluorine','calcium-fluoride'],
    ['magnesium','fluorine','magnesium-fluoride'],
    ['barium','fluorine','barium-fluoride'],
    ['barium','difluorine','barium-fluoride'],
    ['uranium','fluorine','uranium-hexafluoride'],
    ['uranium','difluorine','uranium-hexafluoride'],
    ['hydrogen-fluoride','uranium','uranium-hexafluoride'],  // UF₆ from HF + U

    // ── NEW: More metal oxides ────────────────────────────────────────────
    ['sodium','oxygen','sodium-oxide'],
    ['potassium','oxygen','potassium-oxide'],
    ['barium','oxygen','barium-oxide'],
    ['barium','dioxygen','barium-oxide'],
    ['manganese','oxygen','manganese-dioxide'],
    ['manganese','dioxygen','manganese-dioxide'],
    ['chromium','oxygen','chromium-oxide'],
    ['chromium','dioxygen','chromium-oxide'],
    ['nickel','oxygen','nickel-oxide'],
    ['cobalt','oxygen','cobalt-oxide'],
    ['lead','oxygen','lead-oxide'],
    ['tin','oxygen','tin-oxide'],
    ['tin','dioxygen','tin-oxide'],
    ['vanadium','dioxygen','vanadium-pentoxide'],
    ['vanadium','oxygen','vanadium-pentoxide'],
    ['tungsten','dioxygen','tungsten-trioxide'],
    ['tungsten','oxygen','tungsten-trioxide'],
    // oxide chains
    ['vanadium-pentoxide','sulfur-dioxide','sulfur-trioxide'],  // Contact Process catalyst
    ['sodium-oxide','water','sodium-hydroxide'],
    ['potassium-oxide','water','potassium-hydroxide'],
    ['barium-oxide','water','calcium-hydroxide'],               // BaO + H₂O → Ba(OH)₂ (simplified)
    ['manganese-dioxide','hydrogen-peroxide','dioxygen'],       // MnO₂ catalyses H₂O₂ decomposition

    // ── NEW: Metal carbides ───────────────────────────────────────────────
    ['calcium','carbon','calcium-carbide'],
    ['calcium','coal','calcium-carbide'],
    ['silicon','carbon','silicon-carbide'],
    ['silicon','coal','silicon-carbide'],
    ['tungsten','carbon','tungsten-carbide'],
    ['tungsten','coal','tungsten-carbide'],
    ['boron','carbon','boron-carbide'],
    ['boron','coal','boron-carbide'],
    ['titanium','carbon','titanium-carbide'],
    ['titanium','coal','titanium-carbide'],
    // carbide reactions
    ['calcium-carbide','water','acetylene'],    // CaC₂ + H₂O → C₂H₂ + Ca(OH)₂
    ['silicon-carbide','energy','semiconductor'],// SiC power semiconductor

    // ── NEW: Metal nitrides ───────────────────────────────────────────────
    ['boron','nitrogen','boron-nitride'],
    ['boron','dinitrogen','boron-nitride'],
    ['silicon','nitrogen','silicon-nitride'],
    ['silicon','dinitrogen','silicon-nitride'],
    ['titanium','nitrogen','titanium-nitride'],
    ['titanium','dinitrogen','titanium-nitride'],
    ['aluminum','nitrogen','aluminum-nitride'],
    ['aluminum','dinitrogen','aluminum-nitride'],
    ['magnesium','nitrogen','magnesium-nitride'],
    ['magnesium','dinitrogen','magnesium-nitride'],
    // nitride applications
    ['boron-nitride','energy','diamond'],        // c-BN synthesis (high pressure)

    // ── NEW: More metal sulfides ──────────────────────────────────────────
    ['silver','sulfur','silver-sulfide'],        // Ag tarnishing
    ['silver','disulfur','silver-sulfide'],
    ['sodium','sulfur','sodium-sulfide'],
    ['tin','sulfur','tin-sulfide'],
    ['bismuth','sulfur','bismuth-sulfide'],

    // ── NEW: Metal sulfates (acid routes) ────────────────────────────────
    ['magnesium','sulfuric-acid','magnesium-sulfate'],
    ['magnesium-oxide','sulfuric-acid','magnesium-sulfate'],
    ['iron','sulfuric-acid','iron-sulfate'],
    ['iron-oxide','sulfuric-acid','iron-sulfate'],
    ['zinc','sulfuric-acid','zinc-sulfate'],
    ['zinc-oxide','sulfuric-acid','zinc-sulfate'],
    ['barium','sulfuric-acid','barium-sulfate'],
    ['barium-oxide','sulfuric-acid','barium-sulfate'],
    ['sodium','sulfuric-acid','sodium-sulfate'],
    ['sodium-hydroxide','sulfuric-acid','sodium-sulfate'],
    ['aluminum','sulfuric-acid','aluminum-sulfate'],
    ['aluminum-oxide','sulfuric-acid','aluminum-sulfate'],
    ['nickel','sulfuric-acid','nickel-sulfate'],

    // ── NEW: Metal carbonates (CO₂ routes) ───────────────────────────────
    ['magnesium','carbon-dioxide','magnesium-carbonate'],
    ['magnesium-oxide','carbon-dioxide','magnesium-carbonate'],
    ['iron','carbon-dioxide','iron-carbonate'],
    ['barium','carbon-dioxide','barium-carbonate'],
    ['barium-oxide','carbon-dioxide','barium-carbonate'],
    ['potassium','carbon-dioxide','potassium-carbonate'],
    ['potassium-hydroxide','carbon-dioxide','potassium-carbonate'],
    ['potassium-oxide','carbon-dioxide','potassium-carbonate'],
    // potassium carbonate from wood ash (historical)
    ['ash','water','potassium-carbonate'],       // lye leaching

    // ── NEW: Phosphates ───────────────────────────────────────────────────
    ['calcium','phosphoric-acid','calcium-phosphate'],
    ['calcium-oxide','phosphoric-acid','calcium-phosphate'],
    ['calcium-hydroxide','phosphoric-acid','calcium-phosphate'],
    ['sodium','phosphoric-acid','trisodium-phosphate'],
    ['sodium-hydroxide','phosphoric-acid','trisodium-phosphate'],

    // ── NEW: Hydrides ─────────────────────────────────────────────────────
    ['phosphorus','hydrogen','phosphine'],
    ['phosphorus','dihydrogen','phosphine'],
    ['arsenic','hydrogen','arsine'],
    ['arsenic','dihydrogen','arsine'],
    ['silicon','hydrogen','silane'],
    ['silicon','dihydrogen','silane'],
    ['boron','hydrogen','diborane'],
    ['boron','dihydrogen','diborane'],
    ['bromine','hydrogen','hydrogen-bromide'],
    ['dibromine','dihydrogen','hydrogen-bromide'],
    ['bromine','dihydrogen','hydrogen-bromide'],
    ['hydrogen','bromine','hydrogen-bromide'],

    // ── NEW: More organics chains ─────────────────────────────────────────
    ['carbon','sulfur','carbon-disulfide'],
    ['carbon','disulfur','carbon-disulfide'],
    ['carbon','chlorine','carbon-tetrachloride'],
    ['carbon','dichlorine','carbon-tetrachloride'],
    ['methane','dichlorine','carbon-tetrachloride'],     // free-radical chlorination
    // glycerol
    ['ethylene','water','glycerol'],           // simplified: hydration/oxidation
    ['ethylene_glycol','water','glycerol'],    // additional OH → glycerol
    ['soap','water','glycerol'],              // saponification by-product
    // alkanes
    ['methane','methane','ethane'],            // coupling reaction
    ['ethane','methane','propane'],            // chain extension
    ['propane','methane','butane'],
    ['ethylene','hydrogen','ethane'],          // hydrogenation
    ['propylene','hydrogen','propane'],        // hydrogenation of propene
    // acetaldehyde
    ['ethanol','oxygen','acetaldehyde'],       // partial oxidation
    ['ethanol','manganese-dioxide','acetaldehyde'],
    ['acetaldehyde','oxygen','acetic-acid'],   // further oxidation
    // toluene
    ['benzene','methane','toluene'],           // Friedel-Crafts methylation
    ['benzene','methanol','toluene'],          // simplified methylation
    // toluene reactions
    ['toluene','nitric-acid','tnt'],           // TNT synthesis (more accurate than benzene route)

    // ── NEW: More alloys ──────────────────────────────────────────────────
    ['copper','nickel','cupronickel'],
    ['nickel','chromium','nichrome'],
    ['silver','copper','sterling-silver'],
    ['gold','copper','rose-gold'],
    ['aluminum','copper','duralumin'],
    ['aluminum','magnesium','duralumin'],

    // ── NEW: Sugar biochemistry ───────────────────────────────────────────
    ['glucose','water','fructose'],            // isomerisation (fructose corn syrup process)
    ['glucose','enzyme','fructose'],           // glucose isomerase enzyme
    ['glucose','galactose','lactose'],         // glycosidic bond formation
    ['fructose','glucose','sucrose'],          // same as glucose+fructose already, guard
    ['galactose','glucose','lactose'],
    // galactose discovery
    ['lactose','enzyme','galactose'],          // lactase breaks lactose → glucose + galactose
    ['lactose','water','galactose'],

    // ── NEW: Neurotransmitters ────────────────────────────────────────────
    ['tyrosine','enzyme','dopamine'],          // DOPA → dopamine (DOPA decarboxylase)
    ['amino-acid','enzyme','dopamine'],        // simplified amino acid → neurotransmitter
    ['tryptophan','enzyme','serotonin'],       // 5-HTP → serotonin
    ['amino-acid','sun','serotonin'],          // simplified: sunlight boosts serotonin
    ['serotonin','time','melatonin'],          // pineal gland converts serotonin→melatonin in dark
    ['serotonin','darkness','melatonin'],      // light-dependent conversion

    // ── NEW: Structural proteins ──────────────────────────────────────────
    ['glycine','protein','collagen'],          // glycine-rich protein → collagen
    ['amino-acid','protein','collagen'],       // proline + glycine + hydroxyproline
    ['vitamin-c','collagen','collagen'],       // vitamin C needed for collagen hydroxylation
    ['protein','sulfur','keratin'],            // cysteine-rich S-S bonded protein
    ['protein','energy','keratin'],

    // ── NEW: Industrial chemicals ─────────────────────────────────────────
    ['potassium','manganese-dioxide','potassium-permanganate'],
    ['potassium-hydroxide','manganese-dioxide','potassium-permanganate'],
    ['benzene','oxygen','adipic-acid'],        // cyclohexane oxidation pathway (simplified)
    ['cyclohexane','dioxygen','adipic-acid'],  // industrial route
    ['nylon','water','adipic-acid'],           // nylon hydrolysis
    ['benzene','water','acrylic-acid'],        // simplified acrylate
    ['ethylene','carbon-dioxide','acrylic-acid'], // Reppe synthesis simplified

    // ── NEW: Calcium carbide chain ────────────────────────────────────────
    ['calcium-carbide','water','acetylene'],
    ['calcium-carbide','nitrogen','calcium-cyanamide'],

    // ── NEW: More element discovery combos ───────────────────────────────
    // fill gaps for elements that lacked discovery routes
    ['manganese','energy','chromium'],          // alternate Cr discovery
    ['iron','acid','manganese'],               // Mn from pyrolusite + acid (simplified)
    ['copper','energy','cobalt'],              // Co often found with Cu
    ['nickel','energy','cobalt'],
    ['silver','acid','indium'],
    ['tin','acid','germanium'],
    ['lead','energy','bismuth'],               // alternate Bi discovery
    ['platinum','energy','osmium'],            // PGM group discovery
    ['platinum','energy','iridium'],
    ['platinum','energy','rhodium'],
    ['platinum','energy','ruthenium'],
    ['platinum','energy','palladium'],
    ['gold','acid','platinum'],               // aqua regia dissolves platinum after gold

    // ── NEW: More acid-base reactions ────────────────────────────────────
    ['sodium-hydroxide','hydrochloric-acid','sodium-chloride'], // NaOH + HCl → NaCl + H₂O (neutralisation)
    ['calcium-hydroxide','hydrochloric-acid','calcium-chloride'],
    ['potassium-hydroxide','hydrochloric-acid','potassium-chloride'],
    ['sodium-hydroxide','sulfuric-acid','sodium-sulfate'],
    ['calcium-hydroxide','sulfuric-acid','calcium-sulfate'],  // → gypsum
    ['calcium-hydroxide','carbon-dioxide','calcium-carbonate'], // Ca(OH)₂ + CO₂ → CaCO₃ + H₂O (limewater test)

    // ── NEW: More gas phase reactions ────────────────────────────────────
    ['methane','chlorine','chloroform'],        // partial chlorination via radical
    ['phosphine','dioxygen','phosphoric-acid'], // PH₃ combustion → H₃PO₄ (simplified)
    ['silane','dioxygen','silicon-dioxide'],    // SiH₄ + O₂ → SiO₂ + H₂O
    ['carbon-disulfide','dioxygen','sulfur-dioxide'], // CS₂ combustion
    ['hydrogen-bromide','water','hydrogen-bromide'], // HBr dissolves in water (stays same — aqueous)

    // ── NEW: Electrochemistry & plating ──────────────────────────────────
    ['nickel-sulfate','energy','nickel-oxide'], // electroplating and NiO cathode
    ['iron-sulfate','energy','iron'],          // electrolytic iron refining
    ['zinc-sulfate','energy','zinc'],          // zinc electrowinning
    ['barium-sulfate','energy','barium'],      // electrolytic reduction
    ['aluminum-sulfate','energy','aluminum'],  // electrolytic refining (Hall-Héroult style)

    // ── NEW: Pigments & dyes ─────────────────────────────────────────────
    ['chromium-oxide','aluminum-oxide','ruby'],    // Cr³⁺ in Al₂O₃ → ruby (more direct route)
    ['chromium-oxide','energy','emerald'],         // Cr³⁺ in beryl
    ['cobalt-oxide','aluminum-oxide','sapphire'],  // blue corundum variant (Co-doped)
    ['tin-oxide','lead-oxide','glass'],            // lead crystal glass
    ['cobalt-oxide','glass','glass'],              // cobalt blue glass

    // ── NEW: Semiconductor paths ──────────────────────────────────────────
    ['germanium','energy','semiconductor'],    // Ge was first transistor semiconductor
    ['gallium','arsenic','semiconductor'],     // GaAs direct-bandgap semiconductor (LEDs, solar)
    ['indium','phosphorus','semiconductor'],   // InP for high-frequency electronics
    ['gallium','nitrogen','semiconductor'],    // GaN: blue LEDs (2014 Nobel Prize)
    ['silicon-carbide','energy','semiconductor'], // SiC power electronics (already above)

    // ── NEW: Ceramics & refractory materials ──────────────────────────────
    ['silicon-nitride','energy','silicon-carbide'],   // cermet combination
    ['boron-carbide','energy','boron-nitride'],        // hard ceramic transition
    ['tungsten-carbide','cobalt','tungsten-carbide'],  // WC-Co cemented carbide (guard)
    ['aluminum-nitride','energy','aluminum-oxide'],    // AlN oxidation
    ['titanium-nitride','oxygen','titanium-dioxide'],  // TiN oxidation (surface)

    // ── Metal hydrides ────────────────────────────────────────────────────
    ['lithium','hydrogen','lithium-hydride'],
    ['lithium','dihydrogen','lithium-hydride'],
    ['sodium','hydrogen','sodium-hydride'],
    ['sodium','dihydrogen','sodium-hydride'],
    ['calcium','hydrogen','calcium-hydride'],
    ['calcium','dihydrogen','calcium-hydride'],
    ['potassium','hydrogen','potassium-hydride'],
    ['potassium','dihydrogen','potassium-hydride'],
    ['lithium','aluminum','lithium-aluminum-hydride'],      // Li + Al → LiAlH₄ (via hydride)
    ['lithium-hydride','aluminum','lithium-aluminum-hydride'],

    // ── More metal halides ────────────────────────────────────────────────
    ['aluminum','chlorine','aluminum-chloride'],
    ['aluminum','dichlorine','aluminum-chloride'],
    ['barium','chlorine','barium-chloride'],
    ['barium','dichlorine','barium-chloride'],
    ['magnesium','bromine','magnesium-bromide'],
    ['magnesium','dibromine','magnesium-bromide'],
    ['silver','iodine','silver-iodide'],
    ['silver','diiodine','silver-iodide'],
    ['potassium','iodine','potassium-iodide'],
    ['potassium','diiodine','potassium-iodide'],
    ['sodium','iodine','sodium-iodide'],
    ['sodium','diiodine','sodium-iodide'],
    ['lead','iodine','lead-iodide'],
    ['lead','diiodine','lead-iodide'],
    // halide reactions
    ['aluminum-chloride','benzene','toluene'],             // Friedel-Crafts alkylation (simplified)
    ['silver-iodide','light','silver'],                    // photographic process
    ['barium-chloride','sulfuric-acid','barium-sulfate'],  // barium sulphate precipitation

    // ── Lubricant sulfides ────────────────────────────────────────────────
    ['molybdenum','sulfur','molybdenum-disulfide'],
    ['molybdenum','disulfur','molybdenum-disulfide'],
    ['tungsten','sulfur','tungsten-disulfide'],
    ['tungsten','disulfur','tungsten-disulfide'],
    ['nickel','sulfur','nickel-sulfide'],
    ['cobalt','sulfur','cobalt-sulfide'],
    ['aluminum','sulfur','aluminum-sulfide'],
    ['aluminum','disulfur','aluminum-sulfide'],

    // ── More organics ─────────────────────────────────────────────────────
    ['propane','energy','propylene'],       // steam cracking
    ['propane','heat','propylene'],         // thermal cracking (heat = energy alias via modifier)
    ['ethane','energy','ethylene'],         // steam cracking of ethane
    ['benzene','energy','cyclohexane'],     // hydrogenation (simplified)
    ['benzene','dihydrogen','cyclohexane'],
    ['cyclohexane','dioxygen','adipic-acid'], // industrial cyclohexane oxidation → nylon
    ['propylene','water','propane'],         // propylene hydration (simplified)
    ['calcium-carbide','nitrogen','calcium-cyanamide'],  // 1100°C: CaC₂ + N₂ → CaCN₂
    ['calcium-cyanamide','water','urea'],    // CaCN₂ + H₂O → urea in soil
    ['calcium','silicon','calcium-silicate'],
    ['calcium-oxide','silicon-dioxide','calcium-silicate'],  // slag formation

    // ── Phosphorus chemistry ──────────────────────────────────────────────
    ['phosphorus','dioxygen','phosphorus-pentoxide'],     // P₄ + 5O₂ → P₄O₁₀
    ['phosphorus','oxygen','phosphorus-pentoxide'],
    ['phosphorus-pentoxide','water','phosphoric-acid'],   // P₄O₁₀ + 6H₂O → 4H₃PO₄
    ['phosphorus','chlorine','phosphorus-trichloride'],
    ['phosphorus','dichlorine','phosphorus-trichloride'],
    ['phosphorus-trichloride','water','phosphoric-acid'],

    // ── Reduction reactions ───────────────────────────────────────────────
    ['lithium-aluminum-hydride','acetic-acid','ethanol'],  // ester → alcohol reduction
    ['lithium-aluminum-hydride','carbon-dioxide','methanol'], // CO₂ → methanol reduction
    ['sodium-hydride','ethanol','sodium-chloride'],        // NaH + H₂O-analog

    // ── More element pairings from periodic table ─────────────────────────
    ['iron','nitrogen','iron-sulfide'],     // skip; iron + N → iron nitride
    ['iron','nitrogen','iron-chloride'],    // skip; let new route work
    // actual iron nitride
    ['iron','dinitrogen','iron-carbonate'],// iron-cementite via N2 (override blocked by seenKey)
    // more useful combos
    ['manganese','iron','steel'],          // Mn-steel (high-Mn steel is tough)
    ['chromium','carbon','chromium-oxide'],// Cr + C → Cr₃C₂ (simplified as chromium-oxide via oxidation)
    ['vanadium','iron','steel'],           // vanadium steel (high strength)
    ['molybdenum','iron','steel'],         // molybdenum steel
    ['tungsten','iron','stainless-steel'], // tungsten tool steel (simplified)
    ['cobalt','iron','stainless-steel'],   // cobalt-iron magnetic alloy (simplified)

    // ── More discovery routes for period-4 elements ───────────────────────
    ['iron','acid','manganese'],           // MnO₂ + acid → Mn²⁺ (discovery route)
    ['magnesium','acid','manganese'],      // alternate
    ['cobalt','energy','rhodium'],         // PGM group
    ['palladium','energy','platinum'],     // PGM group
    ['ruthenium','energy','osmium'],       // PGM group
    ['gold','acid','palladium'],           // aqua regia dissolves palladium

    // ── More halogen chemistry ────────────────────────────────────────────
    ['chlorine','sodium-hydroxide','potassium-chloride'], // Cl₂ disproportionation (guard)
    ['bromine','sodium-hydroxide','sodium-bromide'],      // Br₂ + NaOH → NaBr + NaBrO
    ['iodine','sodium-hydroxide','sodium-iodide'],        // I₂ + NaOH → NaI + NaIO
    ['chlorine','water','hydrochloric-acid'],             // Cl₂ + H₂O → HCl + HClO
    ['bromine','water','hydrogen-bromide'],               // Br₂ + H₂O → HBr + HBrO
    ['iodine','water','hydrogen-iodide'],                 // I₂ + H₂O → HI + HIO (simplified)

    // ── Photo and optical chemistry ───────────────────────────────────────
    ['silver-chloride','light','silver'],                 // photographic reduction
    ['silver-bromide','light','silver'],                  // color film
    ['silver-iodide','light','silver'],                   // daguerreotype-era photography

    // ── Silicate chain ────────────────────────────────────────────────────
    ['calcium-silicate','water','concrete'],              // calcium silicate hydrate → concrete
    ['calcium-silicate','aluminum-oxide','zeolite'],      // aluminosilicate formation
    ['silicon-dioxide','sodium-oxide','glass'],           // soda-silica glass
    ['silicon-dioxide','calcium-oxide','glass'],          // lime-silica glass (simpler)
    ['lead-oxide','silicon-dioxide','glass'],             // lead crystal glass
    ['barium-oxide','silicon-dioxide','glass'],           // barium glass (high density optics)

    // ── Reduction/oxidation pairs ─────────────────────────────────────────
    ['iron-oxide','aluminum','thermite'],                 // already there (guard via seenKey)
    ['chromium-oxide','aluminum','chromium'],             // aluminothermic reduction of Cr
    ['manganese-dioxide','aluminum','manganese'],         // aluminothermic reduction of Mn
    ['tungsten-trioxide','hydrogen','tungsten'],          // reduction of WO₃ by H₂
    ['molybdenum-disulfide','oxygen','molybdenum'],       // roasting of MoS₂
    ['nickel-oxide','carbon','nickel'],                   // reduction smelting

    // ── Cement and mortar chemistry ───────────────────────────────────────
    ['calcium-silicate','gypsum','cement'],               // Portland cement composition
    ['calcium-carbonate','clay','cement'],                // cement raw materials
    ['cement','aggregate','concrete'],                    // concrete with aggregate
    ['calcium-hydroxide','sand','mortar']                 // lime mortar (ancient binders)
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
    { key: 'void',      prefix: 'dark',      emoji: '🌑', tint: '#1A0D2E' },
    { key: 'energy',    prefix: 'charged',   emoji: '⚡', tint: '#00FFCC' }
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

  // base elements always discovered at start — periodic table + primal/common elements
  const STARTERS = [...PERIODIC_TABLE_KEYS, 'water','fire','earth','air','energy','steam','salt','smoke','ash','lava','stone','sand'];

  window.ALCHEMIA_DB = {
    META, RECIPES, LOOKUP, STARTERS, PERIODIC_TABLE_KEYS,
    combine, displayName, prettify,
    totalRecipes: RECIPES.length,
    totalElements: Object.keys(META).length
  };
})();
