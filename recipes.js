// ALCHEMIA — recipe database
// 4 base elements → curated tier ladder → procedural modifier expansion to 1,500+

(function () {
  'use strict';

  // ---------- Element metadata (curated) ----------
  // emoji is used as the icon; color drives the tile tint + particle bursts.
  const META = {
    // Tier 0 (primal)
    water:    { e: '💧', c: '#3B7DD8', t: 0, displayName: 'Water (H₂O)', fact: 'The only substance on Earth that naturally occurs as solid, liquid, and gas in the same place simultaneously. Water molecules stick to each other via hydrogen bonds — a quirk that makes liquid water denser than ice, keeps oceans from freezing solid, and is the main reason life exists at all.' },
    fire:     { e: '🔥', c: '#FF5A1F', t: 0, fact: 'Fire is not a substance — it\'s a chemical reaction: rapid oxidation releasing heat and light. Humans have been controlling fire for at least 1 million years. The colour of a flame tells you its temperature: orange is ~1000°C, blue is ~1400°C, and the hottest fires glow white.' },
    earth:    { e: '🪨', c: '#8B6F47', t: 0, fact: 'The only known planet with active plate tectonics — the geological engine that recycles carbon, builds mountains, and keeps the climate stable. Earth\'s core is ~5500°C (hotter than the Sun\'s surface), kept liquid by radioactive decay of uranium and thorium.' },
    air:      { e: '🌬️', c: '#A8C8DB', t: 0, fact: '78% nitrogen, 21% oxygen, 1% argon — and just 0.04% CO₂ that somehow runs the entire carbon cycle. At sea level you\'re under ~10 tonnes of atmospheric pressure per square metre. You don\'t notice because it pushes equally from every direction.' },

    // Tier 1 derived
    steam:    { e: '♨️', c: '#B8D4E3', t: 1, displayName: 'Steam (H₂O)', fact: 'Water expands 1,700× in volume going from liquid to vapour. That violent expansion is why steam engines worked — water is essentially compressed energy. At 100°C and 1 atm, steam carries 2,260 kJ/kg as latent heat of vaporisation, more than doubling the energy you put into just heating it.' },
    mud:      { e: '🟫', c: '#6E4B2A', t: 1, fact: 'Mud is a colloidal suspension of fine clay particles and organic matter in water. Ancient civilisations built with mud-brick 8,000+ years ago — adobe walls still insulate better than concrete. The plasticity of wet clay comes from water molecules sliding between silicate sheets.' },
    lava:     { e: '🌋', c: '#E84518', t: 1, fact: 'Molten rock at 700–1200°C. Runny basaltic lava flows at ~50 km/h; thick rhyolite barely moves. Cool it fast and you get obsidian glass; cool it slowly over millions of years and you get granite. The entire Pacific Ocean floor was once lava.' },
    dust:     { e: '🌫️', c: '#C9B89A', t: 1, fact: 'Interstellar dust grains (~250 nm) are fragments of silicates and carbon — the raw material of planets. Dust in your home is ~70% shed skin cells. Every sunset looks orange because fine atmospheric dust scatters short-wavelength blue light preferentially.' },
    energy:   { e: '⚡', c: '#FFC838', t: 1, fact: 'Energy is never created or destroyed — only converted between forms. Einstein\'s E=mc² means every kilogram of mass holds ~9×10¹⁶ joules of rest energy (21 megatons of TNT). Your body converts roughly 2000 kcal of chemical energy per day, almost entirely into heat.' },
    rain:     { e: '🌧️', c: '#5B8FBF', t: 1, displayName: 'Rain (H₂O)', fact: 'A raindrop takes ~10 minutes to fall from cloud base to ground at terminal velocity (~9 m/s). Every drop nucleates around a tiny solid particle — a sea-salt crystal, dust grain, or pollen speck. Without these impurities, clouds could not form and it would never rain at all.' },
    sea:      { e: '🌊', c: '#1F6FB3', t: 1, displayName: 'Sea (H₂O·NaCl)', fact: 'The ocean covers 71% of Earth but holds only 0.02% of its total mass. It contains ~1.335 billion km³ of water, but 97% is saltwater. The deepest point (Mariana Trench, 11 km down) has pressure of ~1,100 atmospheres — enough to crush a submarine like a tin can.' },
    stone:    { e: '🗿', c: '#7A7268', t: 1, fact: 'Rocks cycle through the lithosphere over millions of years: eroded to sediment, compressed into rock, melted into magma, erupted again as lava. The oldest known rock on Earth is the Nuvvuagittuq belt in Quebec — approximately 4.28 billion years old.' },
    sand:     { e: '🏖️', c: '#E5C99B', t: 1, displayName: 'Sand (SiO₂)', fact: 'Sand (0.0625–2mm grains) is mostly quartz, the mineral most resistant to weathering. The Sahara contains enough sand to cover the contiguous USA 3 metres deep. Ironically, most desert sand is too smooth and round for concrete — the construction industry mines it from riverbeds.' },
    pressure: { e: '💢', c: '#5F4A8B', t: 1, fact: 'Pressure is force per unit area. At the Mariana Trench\'s deepest point: ~1,100 atm. Diamond forms at 50,000+ atm deep in the Earth\'s mantle. Pressure cooking works by raising the boiling point of water above 100°C, speeding up reactions that normally take hours.' },

    // Tier 2
    cloud:    { e: '☁️', c: '#DDE6EE', t: 2, displayName: 'Cloud (H₂O)', fact: 'A cubic kilometre of cloud contains only ~500 tonnes of water — less than you\'d think. Clouds form when rising air cools past its dew point, condensing vapour around tiny particles. A cumulonimbus thundercloud can tower 12 km high and produce a billion joules of electrical energy.' },
    plant:    { e: '🌱', c: '#5BB85B', t: 2, fact: 'Plants invented photosynthesis ~2.4 billion years ago, flooding Earth\'s atmosphere with oxygen — the Great Oxidation Event that killed most existing life. Before it, no free oxygen. After it, the sky turned blue, ozone formed, and complex multicellular life became possible.' },
    metal:    { e: '⚙️', c: '#9098A4', t: 2, fact: 'Metals are defined by delocalized outer electrons that form a "sea" of charge carriers — which is why they conduct electricity and heat, are shiny, and are malleable. About 80% of all elements are metals. The most electrically conductive is silver, just slightly ahead of copper.' },
    glass:    { e: '🔮', c: '#BFE3E0', t: 2, fact: 'Glass is an amorphous solid — its atoms are frozen in the random arrangement of a liquid. Natural volcanic glass (obsidian) was used as cutting tools 700,000 years ago. Today, fibre-optic glass cables carry 99% of the world\'s internet data as pulses of light.' },
    brick:    { e: '🧱', c: '#B85638', t: 2, fact: 'The oldest manufactured bricks are ~10,000 years old (Jericho). Sun-dried mud bricks gave way to kiln-fired ones ~5,000 BCE, which resist water. Modern construction still uses roughly 1.4 trillion fired bricks per year — the same ancient technology, just at industrial scale.' },
    desert:   { e: '🏜️', c: '#D8B070', t: 2, fact: 'Deserts cover 33% of Earth\'s land — not all hot and sandy. Antarctica is technically the world\'s largest desert (cold and bone dry). The Atacama in Chile has regions with no measurable rainfall in recorded history. Life there survives by absorbing coastal fog.' },
    mountain: { e: '⛰️', c: '#6B7A8A', t: 2, fact: 'Mountains form where tectonic plates collide and crust buckles upward. Everest grows ~5mm per year as India continues ramming into Asia. The tallest mountain measured from its base is Mauna Kea at 10,210m — but most of it is underwater.' },
    ocean:    { e: '🌊', c: '#0E5A99', t: 2, fact: 'Sunlight penetrates only the top 200m (the photic zone). Below 1,000m is the midnight zone — permanent darkness, crushing pressure, yet teeming with bioluminescent life. Only about 20% of the ocean floor has been mapped in detail. We know more about the Moon.' },
    swamp:    { e: '🥬', c: '#4A6B3A', t: 2, fact: 'Wetlands cover just 6% of Earth\'s land but store ~35% of all terrestrial carbon, mostly as peat. Draining them for agriculture releases that carbon as CO₂. The Pantanal in South America is the world\'s largest tropical wetland — 150,000 km² of interconnected lakes and rivers.' },
    obsidian: { e: '⬛', c: '#1B1820', t: 2, displayName: 'Obsidian (SiO₂)', fact: 'Obsidian is volcanic glass — lava cooled so fast that crystals have no time to form. Its conchoidal fracture produces edges at 30 angstroms, thinner than the finest surgical steel (~300 Å). Some eye surgeons still prefer obsidian scalpels for procedures where blade thickness matters.' },
    geyser:   { e: '⛲', c: '#7BB0D6', t: 2, displayName: 'Geyser (H₂O)', fact: 'Geysers erupt when groundwater heated by magma becomes superheated under pressure, then suddenly flashes to steam. Old Faithful erupts every ~91 minutes with 90% reliability — not magic, but a predictable geometry of underground chambers and constrictions.' },
    rust:     { e: '🟤', c: '#8B4A1F', t: 2, displayName: 'Rust (Fe₂O₃)', fact: 'Rust (Fe₂O₃·nH₂O) requires both oxygen and water — iron stays shiny in dry air or oxygen-free water. Corrosion costs the global economy ~$2.5 trillion per year (3.4% of GDP). The entire surface of Mars is coated in rust — its red colour is the same chemistry as old nails.' },
    smoke:    { e: '💨', c: '#7A7670', t: 2, fact: 'Wood smoke contains 200+ compounds — fine particles (PM2.5), carbon monoxide, benzene, and polycyclic aromatics. PM2.5 particles penetrate deep into lung tissue. Yet smoke also transmits information: indigenous peoples developed sophisticated smoke signalling systems that communicated across hundreds of kilometres.' },
    ash:      { e: '🪦', c: '#3F3A36', t: 2, fact: 'Volcanic ash is not fluffy — it\'s microscopic jagged glass particles that shred lungs, scratch corneas, clog jet engines, and collapse roofs under their weight. The 79 CE Vesuvius eruption buried Pompeii under 6m of ash and pumice, preserving it so well it was only rediscovered in 1748.' },
    wind:     { e: '🍃', c: '#A8D8B0', t: 2, fact: 'Wind is air moving from high to low pressure. The polar jet streams are rivers of wind at 6–12km altitude flowing at ~250 km/h — why a flight from New York to London takes 1–2 hours less than the return. Wind turbines now generate ~7% of global electricity.' },
    salt:     { e: '🧂', c: '#EFEEE8', t: 2, displayName: 'Salt (NaCl)', fact: 'Salt was so valuable that Roman soldiers were partly paid in it — the origin of the word "salary." The ocean contains ~37 quadrillion tonnes of dissolved salt. If you evaporated all the oceans and spread the salt over the continents, it would form a layer 166 metres thick.' },
    crystal:  { e: '💎', c: '#9BD4D4', t: 2, fact: 'Crystals form when atoms or molecules lock into a repeating 3D lattice. Salt, snowflakes, diamonds, and proteins are all crystals. What gives gems their colours: trace impurities. Rubies and sapphires are the same mineral (corundum) — just with different metal atoms replacing a tiny fraction of the aluminium.' },
    sky:      { e: '🌌', c: '#88AED9', t: 2, fact: 'The sky is blue because N₂ and O₂ molecules scatter short-wavelength blue light ~10× more than red (Rayleigh scattering). At sunset, light travels through more atmosphere, scattering away the blue and leaving orange-red. On Mars, the sky is pink — iron oxide dust scatters longer wavelengths instead.' },

    // Tier 3
    tree:     { e: '🌳', c: '#3F8E3F', t: 3, fact: 'A mature oak transpires ~150 litres of water per day. Forests hold 80% of all terrestrial plant biomass. Underground mycorrhizal fungi connect individual trees, letting them transfer sugar, water, and chemical distress signals across the whole forest floor.' },
    grass:    { e: '🌿', c: '#79C24E', t: 3, fact: 'Grasses evolved ~66 million years ago and now cover 40% of Earth\'s land. Their key trick: meristems at the base of each blade, not the tip — so they regrow after grazing or fire. Without grasses, no wheat, rice, maize, or sugar — roughly 70% of human calories gone.' },
    flower:   { e: '🌸', c: '#F09BC2', t: 3, fact: 'The first flowering plants appeared ~130 million years ago. Their breakthrough: seeds enclosed in edible fruit — botanical bribery for animals to carry them away. Darwin called their rapid diversification an "abominable mystery." Today 90% of all plant species are flowering plants.' },
    moss:     { e: '🍀', c: '#4E8C4A', t: 3, fact: 'Mosses have no vascular tissue — they absorb water directly through their leaf surface. Sphagnum moss holds up to 20× its dry weight in water. Peat bogs (ancient compressed moss) store 30% of all soil carbon — more than all of Earth\'s forests combined.' },
    coal:     { e: '🪨', c: '#262321', t: 3, displayName: 'Coal (C)', fact: 'Coal is compressed Carboniferous plant matter (359–299 Ma). Back then, no fungi could digest lignin — dead trees piled up for 60 million years. When fungi finally evolved the right enzymes, the era ended. That global forest became the coal seams we still burn today.' },
    iron:     { e: '🔩', c: '#8B8B92', t: 3, fact: 'Iron is ~32% of Earth\'s total mass — the most abundant element in the planet by mass. Earth\'s liquid iron outer core generates the magnetic field shielding us from the solar wind. The iron in your blood (haemoglobin) carries oxygen; the iron in Earth\'s core carries electric current.' },
    gold:     { e: '🪙', c: '#FFC83D', t: 3, fact: 'All the gold ever mined (~200,000 tonnes) would fit in a cube just 22m on a side. Most of Earth\'s original gold sank to the molten core during planetary formation. The gold in your jewellery was delivered by meteorite bombardment ~3.9 billion years ago — it literally fell from space.' },
    silver:   { e: '🥈', c: '#C8CCD2', t: 3, fact: 'Silver is the single best electrical conductor of any element. It\'s also antimicrobial — Ag⁺ ions disrupt bacterial cell membranes, which is why silver was used as an antibiotic before modern medicine. Silver-coated hospital surfaces measurably reduce infection rates to this day.' },
    copper:   { e: '🥉', c: '#B97A4A', t: 3, fact: 'Copper was the first metal worked by humans (~10,000 BCE). It\'s the second-best common conductor after silver. Your body needs ~2mg of copper per day — it\'s in every mitochondrion, essential for the enzyme that makes the final step of ATP synthesis. No copper, no cellular energy.' },
    diamond:  { e: '💎', c: '#E0F7FF', t: 3, displayName: 'Diamond (C)', fact: 'Diamond is pure carbon — the same element as pencil graphite. The only difference is atomic arrangement: diamond bonds each carbon to four neighbours in a rigid tetrahedral lattice, making it the hardest natural substance (10 Mohs). Graphite\'s flat layers just slide freely past each other.' },
    ice:      { e: '🧊', c: '#A8D8E8', t: 3, displayName: 'Ice (H₂O)', fact: 'Ice is one of the rare solids less dense than its own liquid (0.917 vs 1.0 g/cm³), which is why it floats. If ice sank, oceans would freeze solid from the bottom up every winter, killing almost all aquatic life. The hydrogen-bond geometry in ice forces water to expand ~9% on freezing.' },
    snow:     { e: '❄️', c: '#E8F0F8', t: 3, displayName: 'Snow (H₂O)', fact: 'Every snowflake has six-fold symmetry because water molecules form hexagonal rings when crystallising. No two are identical — each takes a unique path through varying temperature and humidity. Polar ice cores contain snow up to 800,000 years old, with ancient air bubbles preserving the atmosphere of the time.' },
    storm:    { e: '⛈️', c: '#4A4A6E', t: 3, fact: 'A single thunderstorm transfers ~1 billion joules of electrical energy. Updrafts inside a cumulonimbus cloud reach 160 km/h, creating the charge separation that fires lightning. Lightning strikes Earth ~100 times per second — every second of every day, without pause.' },
    lightning:{ e: '⚡', c: '#FFE438', t: 3, fact: 'A lightning bolt heats surrounding air to ~30,000 K — five times hotter than the Sun\'s surface — in microseconds. The rapid expansion creates thunder. Where lightning strikes sand, it fuses the grains into a glass tube called a fulgurite: a perfect glass cast of the bolt itself.' },
    rainbow:  { e: '🌈', c: '#E84a7A', t: 3, fact: 'A rainbow requires exact geometry: Sun behind you, rain ahead, and your eye at 42° from the anti-solar point. Red bends at 42°, violet at 40° — each wavelength refracts differently. You can never reach its end because it shifts as you move. A double rainbow reverses the colour order.' },
    fog:      { e: '🌁', c: '#C8CBCF', t: 3, displayName: 'Fog (H₂O)', fact: 'Fog is a cloud at ground level — droplets of 10–100 µm in diameter. San Francisco\'s famous fog is drawn in from the Pacific by the thermal contrast with the hot Central Valley. Coastal redwood forests collect up to 40% of their annual water intake from fog dripping off needles.' },
    star:     { e: '⭐', c: '#FFD938', t: 3, fact: 'Stars are plasma spheres sustained by nuclear fusion. Our Sun fuses 620 million tonnes of hydrogen into helium every second. The energy from that fusion exactly balances gravitational collapse — stars are in constant equilibrium. When the fuel runs out, the balance breaks and the star explodes or collapses.' },
    moon:     { e: '🌙', c: '#D8D6C0', t: 3, fact: 'The Moon formed from debris when a Mars-sized body hit Earth ~4.5 billion years ago. Its gravity stabilises Earth\'s axial tilt at ~23.5°, giving us predictable seasons. Without the Moon, Earth\'s axis could wobble chaotically between 0° and 85° — seasons would be catastrophically unstable.' },
    sun:      { e: '☀️', c: '#FFB418', t: 3, fact: 'The Sun converts 4 million tonnes of mass into energy every second via fusion (E=mc²). It has burned for 4.6 billion years and has enough hydrogen for 5 billion more. The light hitting you now left the Sun exactly 8 minutes and 20 seconds ago.' },
    forest:   { e: '🌲', c: '#2E5E2E', t: 3, fact: 'The Amazon recycles 50–75% of its own rainfall via tree transpiration — it effectively creates its own rain. Deforestation breaks that cycle and the region dries out permanently. The "Wood Wide Web" of fungal networks below the soil transfers sugar and nutrients between trees across entire forests.' },
    river:    { e: '🏞️', c: '#3A85B8', t: 3, fact: 'The Amazon discharges 20% of all freshwater entering Earth\'s oceans. Rivers carve landscapes over geological time — the Colorado River cut the Grand Canyon (1.6 km deep) over 6 million years. The entire Nile Delta is built from Ethiopian highland soil transported 4,000 km downstream.' },
    lake:     { e: '🏕️', c: '#2D72A8', t: 3, fact: 'Lake Baikal (Siberia) holds 20% of Earth\'s unfrozen surface freshwater — more than all five Great Lakes combined. It\'s 25 million years old, 1,642m deep, and hosts 1,700 species found nowhere else on Earth, including the world\'s only exclusively freshwater seal.' },
    island:   { e: '🏝️', c: '#5BAE6E', t: 3, fact: 'Volcanic islands form as tectonic plates drift over mantle hot spots. Hawaii moves northwest at ~9 cm/year — the further northwest, the older and more eroded the island. The oldest Hawaiian islands (the Emperor seamount chain) have fully sunk below the ocean surface over millions of years.' },
    volcano:  { e: '🌋', c: '#C8341F', t: 3, fact: 'Most of Earth\'s early water and atmosphere were outgassed from volcanoes. The 1815 Tambora eruption triggered the "Year Without a Summer" in 1816: crops failed across the Northern Hemisphere, causing ~90,000 deaths — and the cold, gloomy summer inspired Mary Shelley to write Frankenstein.' },
    canyon:   { e: '🪨', c: '#A85A38', t: 3, fact: 'The Grand Canyon\'s oldest exposed rock is ~1.84 billion years old — nearly half Earth\'s age, exposed by 6 million years of erosion. Mars has Valles Marineris: 4,000 km long and 7 km deep — large enough to stretch across the entire continental USA.' },
    waterfall:{ e: '🏞', c: '#5BA8D8', t: 3, fact: 'Angel Falls (Venezuela) drops 979m — the world\'s tallest. During dry season, most water evaporates into mist before reaching the bottom. Niagara Falls erodes its own lip ~25mm upstream per year; in ~50,000 years it will reach Lake Erie and drain it completely.' },
    pebble:   { e: '🥚', c: '#8E847A', t: 3, fact: 'Pebbles (2–64mm) get smooth from tumbling in rivers — abrasion removes corners over thousands of kilometres. By measuring a pebble\'s roundness and size, geologists can calculate how far it has travelled and how energetic the river that carried it was.' },
    boulder:  { e: '🗿', c: '#5F584F', t: 3, fact: 'Glacial erratic boulders — sometimes hundreds of tonnes — were carried by ice sheets and deposited far from their geological home. By matching a boulder\'s rock type to bedrock outcrops, geologists can trace the exact path an ancient glacier took thousands of years ago.' },
    clay:     { e: '🧱', c: '#A85B45', t: 3, displayName: 'Clay (Al₂Si₂O₅(OH)₄)', fact: 'Clay minerals are phyllosilicates — sheet structures of silicon and aluminium that trap water between layers, giving wet clay its plasticity. Fire it above 800°C and the water structure collapses irreversibly into ceramic. Without clay: no pottery, no writing tablets, no bricks, arguably no civilisation.' },
    pottery:  { e: '🏺', c: '#B86F45', t: 3, fact: 'The oldest pottery is ~20,000 years old (Xianrendong Cave, China), predating agriculture by 10,000 years. Fired ceramics were humanity\'s first engineered material — clay permanently transformed by heat into something water cannot re-dissolve. The potter\'s wheel (~3500 BCE) was the first rotary technology.' },

    // Tier 4 — life
    life:     { e: '✨', c: '#FF7AB6', t: 4, fact: 'The first signs of life date to ~3.5–4 billion years ago — single-celled microbes near hydrothermal vents. Life is fundamentally chemistry that has learned to copy itself. Every living thing on Earth shares the same genetic code, the same ATP energy currency, and the same lipid membrane architecture.' },
    seed:     { e: '🌰', c: '#8E6235', t: 4, fact: 'Seeds are a compressed survival strategy: embryo, food supply, and protective coat in one package. They can stay dormant for centuries — a sacred lotus seed germinated after 1,300 years. Seeds let plants colonise dry land by carrying their own water supply for germination.' },
    fruit:    { e: '🍎', c: '#E64545', t: 4, fact: 'Fruits are botanical bribery — sweet, nutritious packages evolved to be eaten so the seeds inside get carried away. Most fruit evolved alongside specific animals. Durian\'s powerful smell and tough thorns are specifically designed to attract large mammals that can crush the shell.' },
    vegetable:{ e: '🥕', c: '#E08838', t: 4, fact: '"Vegetable" is a culinary term, not a botanical one. Tomatoes are botanically fruits, peanuts are legumes, and rhubarb stalks are edible. Most vegetables are modified stems, leaves, or roots. Broccoli is an entire flower cluster we eat just before it would bloom.' },
    mushroom: { e: '🍄', c: '#D04848', t: 4, fact: 'The mushroom is just the fruiting body — the visible tip of the fungus. The mycelium network underground can span hundreds of acres. The largest known living organism on Earth is a honey fungus (Armillaria) in Oregon, covering ~2,385 acres and estimated to be ~8,000 years old.' },
    algae:    { e: '🟢', c: '#3F8E3F', t: 4, fact: 'Algae produce ~50% of Earth\'s oxygen — more than all terrestrial plants combined. The smallest (picoplankton, 0.2 µm) to the largest (giant kelp, 60m). Algae invented photosynthesis, and the mitochondria in every animal cell descend from ancient bacteria that early algal ancestors absorbed and kept.' },
    bacteria: { e: '🦠', c: '#7BC857', t: 4, fact: 'Your body harbours ~38 trillion bacteria — roughly equal to your own cell count. Bacteria can divide every 20 minutes: one cell becomes 1 billion in 10 hours. They survive in boiling hot springs, mile-deep rock, and the stratosphere. Bacteria have been on Earth 10× longer than animals.' },
    egg:      { e: '🥚', c: '#F4E8C4', t: 4, fact: 'An egg cell is the largest cell in most animals — a human egg is 0.1mm, visible to the naked eye. The egg provides all the cytoplasm and organelles; the sperm contributes only DNA. A bird\'s hard shell is ~95% calcium carbonate, porous enough for gas exchange but strong enough to bear weight.' },
    bird:     { e: '🐦', c: '#5B9BD8', t: 4, fact: 'Birds are living dinosaurs — avian theropods that survived the K-Pg extinction 66 million years ago. Their hollow bones and air-sac respiratory system (air flows one-way, not tidal) make them far more oxygen-efficient than mammals. Bar-tailed godwits fly 12,000 km non-stop, no food, no rest.' },
    fish:     { e: '🐟', c: '#4A8DB8', t: 4, fact: 'Fish appeared ~530 million years ago as the first vertebrates. "Fish" is not actually a biological grouping — lungfish are more closely related to frogs than to tuna. The ocean holds an estimated 1–3.5 trillion fish. Some deep-sea anglerfish literally fuse with their mate, sharing one bloodstream.' },
    lizard:   { e: '🦎', c: '#5EB85B', t: 4, fact: 'Lizards are ectothermic — they regulate body temperature by basking in sun or seeking shade. Gecko toe pads use van der Waals forces (molecular-scale adhesion) to walk upside down on glass, not suction. The Komodo dragon has venom that prevents blood clotting, slowly disabling prey.' },
    snake:    { e: '🐍', c: '#5B8E3F', t: 4, fact: 'Snakes evolved from limbed lizards ~100 million years ago; vestigial pelvic bones are still visible in pythons. Pit vipers detect infrared radiation via facial pit organs — they effectively have thermal cameras. The black mamba can reach 20 km/h and its venom kills in under 30 minutes untreated.' },
    cat:      { e: '🐈', c: '#B89B6F', t: 4, fact: 'Cats lack sweet taste receptors — they genuinely cannot taste sugar. Whiskers detect air turbulence, letting them navigate in near-total darkness. A purr vibrates at 25–150 Hz, a frequency range that promotes bone healing and tissue repair — cats may be purring to self-medicate.' },
    dog:      { e: '🐕', c: '#A87E55', t: 4, fact: 'Dogs were domesticated from grey wolves ~15,000–40,000 years ago — the first domesticated species. They have 300 million olfactory receptors vs 6 million in humans. Dogs can smell a teaspoon of sugar dissolved in an Olympic swimming pool and can reliably detect certain cancers by odour alone.' },
    horse:    { e: '🐎', c: '#7E5535', t: 4, fact: 'Horses evolved from the dog-sized Eohippus (50 million years ago) on open grasslands. Their single hoof maximises impact force for running speed. Each hoof strike sends a pressure pulse through the leg bones that acts as a supplementary blood pump, returning blood from the legs to the heart.' },
    cow:      { e: '🐄', c: '#3A3530', t: 4, fact: 'Cows have four stomach chambers and regurgitate food to chew it twice — the origin of "rumination." Their gut microbiome digests cellulose using methanogenic archaea, producing ~100 kg of methane per cow per year. There are ~1 billion cattle on Earth, making cows the most numerous large animal.' },
    sheep:    { e: '🐑', c: '#EAE5D8', t: 4, fact: 'Sheep have rectangular pupils giving them a 270–320° visual field without turning their heads — nearly panoramic. Merino wool fibres can stretch to 130% of their length and spring back. Sheep were among the first domesticated animals (~10,000 BCE), transforming human textile culture entirely.' },
    wolf:     { e: '🐺', c: '#5F574E', t: 4, fact: 'Wolf packs are family units led by a breeding pair. Their 1995 reintroduction to Yellowstone triggered a "trophic cascade": wolves changed elk behaviour, allowing riverbank vegetation to recover, which stabilised river channels. One predator reshaped the hydrology of an entire national park.' },
    bear:     { e: '🐻', c: '#6E4A2A', t: 4, fact: 'Hibernating bears lower their metabolism to 25% of normal, don\'t eat, drink, or urinate for months — yet maintain muscle mass. They convert urea back into protein instead of excreting it. Their core temperature drops only ~5°C (vs 32°C in true hibernators), so they can wake quickly if threatened.' },
    dolphin:  { e: '🐬', c: '#6BA8D8', t: 4, fact: 'Dolphins sleep with one brain hemisphere at a time (unihemispheric slow-wave sleep), staying half-conscious and surfacing to breathe automatically. They communicate with individually unique "signature whistles" — essentially names. Bottlenose dolphins use sea sponges as tools to probe the seafloor for fish.' },
    whale:    { e: '🐋', c: '#3A6E9E', t: 4, fact: 'Blue whales are the largest animals ever known (~30m, 200 tonnes). Their hearts are the size of a small car. Their songs travel thousands of kilometres through ocean SOFAR channels. Humpback whale songs evolve year by year — males learn new phrases that spread like musical trends across entire ocean basins.' },
    shark:    { e: '🦈', c: '#6E7A88', t: 4, fact: 'Sharks predate trees — they appear in the fossil record ~450 million years ago; trees evolved ~385 Ma. They detect prey via "ampullae of Lorenzini," jelly-filled pores that sense the electrical field of a beating heart. Greenland sharks live 272–512 years — the longest-lived vertebrate known.' },
    octopus:  { e: '🐙', c: '#D04A8A', t: 4, fact: 'Octopuses have three hearts, blue copper-based blood, and a brain in each arm — 2/3 of their neurons are distributed through their tentacles. They can change colour despite being colourblind, using photoreceptors in their skin. Severed arms continue responding to stimuli for minutes after detachment.' },
    butterfly:{ e: '🦋', c: '#D89BE8', t: 4, fact: 'Inside a chrysalis, the caterpillar doesn\'t just grow wings — it largely dissolves into cellular soup. Some adult butterflies retain memories learned as caterpillars. Monarch butterflies navigate a 4,000 km migration using a time-compensated solar compass built into their antennae.' },
    bee:      { e: '🐝', c: '#FFB418', t: 4, fact: 'A single honeybee produces 1/12 teaspoon of honey in its lifetime. Bees communicate hive direction and distance via the "waggle dance" — a figure-8 movement where angle indicates direction relative to the Sun and duration indicates distance. Without bees, ~35% of global food crops would fail.' },
    spider:   { e: '🕷️', c: '#3A3530', t: 4, fact: 'Spider silk is 5× stronger than steel by weight and more elastic than nylon. Dragline silk stretches 40% before breaking. Darwin\'s bark spider weaves webs 25m across rivers — the largest orb webs known. Some spiders can hear in stereo via tiny hairs on their legs that detect air vibrations.' },
    dragon:   { e: '🐉', c: '#3F8E5F', t: 4, fact: 'Fire-breathing dragons independently appeared in European, Chinese, and Mesoamerican mythology — possibly inspired by dinosaur and pterosaur fossils interpreted by people with no evolutionary framework. The Komodo dragon breathes no fire, but injects venom that prevents blood clotting.' },
    phoenix:  { e: '🔥', c: '#FF7A28', t: 4, fact: 'The phoenix myth echoes real stellar physics: when a massive star explodes as a supernova, it scatters heavy elements (carbon, iron, gold) that form new planets and, eventually, new life. Stars literally die to create the conditions for new ones. The phoenix is the universe\'s autobiography.' },
    unicorn:  { e: '🦄', c: '#F9B8E4', t: 4, fact: 'Unicorns first appear in the writings of Ctesias (~400 BCE), who described a wild Indian animal with a single horn — likely a misidentification of the Indian rhinoceros. Scotland\'s national animal is still the unicorn. Alicja (Siberian rhinoceros), a real one-horned species, went extinct ~39,000 years ago.' },
    kraken:   { e: '🐙', c: '#1F4A6E', t: 4, fact: 'The Norse kraken was inspired by real giant squid sightings. Giant squid (Architeuthis) reach up to 13m and have the largest eyes in the animal kingdom — up to 30cm across, like dinner plates — evolved to spot bioluminescent flashes from predators in the deep ocean darkness.' },

    // Tier 5 — homodiatomic molecules
    dihydrogen:         { e: '💨', c: '#55EFC4', t: 5, displayName: 'Dihydrogen (H₂)', fact: 'H₂ is the most abundant molecule in the universe and the fuel that powers stars. On Earth, it exists in tiny natural amounts — it\'s so light that it escapes into space. When burned it produces only water, making hydrogen fuel cells the cleanest energy technology, limited mainly by storage challenges.' },
    dioxygen:           { e: '🫧', c: '#55EFC4', t: 5, displayName: 'Dioxygen (O₂)', fact: 'O₂ didn\'t exist in Earth\'s atmosphere for the first 2 billion years — it was toxic to early life. The Great Oxidation Event (~2.4 billion years ago) was caused by cyanobacteria and killed most anaerobic organisms. Every O₂ molecule you breathe was split from a water molecule by photosynthesis.' },
    dinitrogen:         { e: '🌬️', c: '#55EFC4', t: 5, displayName: 'Dinitrogen (N₂)', fact: 'N₂ makes up 78% of air but is almost completely unreactive — its triple bond (946 kJ/mol) is one of the strongest in chemistry. Lightning "fixes" a tiny amount to NO, but the Haber-Bosch process does it industrially at massive scale, feeding half of humanity with synthetic nitrogen fertiliser.' },
    difluorine:         { e: '🟡', c: '#FDCB6E', t: 5, displayName: 'Difluorine (F₂)', fact: 'F₂ is the most reactive element — it attacks glass, concrete, and even xenon (a noble gas). It was so difficult to isolate that it killed and blinded chemists for 74 years of failed attempts. Henri Moissan finally succeeded in 1886 and won the Nobel Prize. He later said it shortened his life.' },
    dichlorine:         { e: '🟩', c: '#FDCB6E', t: 5, displayName: 'Dichlorine (Cl₂)', fact: 'Cl₂ was the first chemical weapon deployed in WWI (Ypres, 1915) — a dense yellow-green gas that sank into trenches. Ironically, it\'s also essential for making PVC, bleach, and disinfecting drinking water. The same chemistry that protects your swimming pool once killed soldiers in Belgium.' },
    dibromine:          { e: '🟤', c: '#FDCB6E', t: 5, displayName: 'Dibromine (Br₂)', fact: 'Bromine is one of only two elements liquid at room temperature (the other is mercury). It\'s a dense, red-brown, fuming liquid that immediately blisters skin on contact. Most bromine is extracted from seawater — the ocean holds ~65 trillion kg of dissolved bromine.' },
    diiodine:           { e: '🟣', c: '#FDCB6E', t: 5, displayName: 'Diiodine (I₂)', fact: 'Iodine is a dark crystalline solid that sublimes directly to a purple vapour when warmed — one of the few substances that skips the liquid phase at normal pressure. I₂ slips into the helical structure of starch, turning it dark blue-black: the classic iodine test. Your thyroid needs iodine to make hormones.' },
    disulfur:           { e: '🟨', c: '#FDD835', t: 5, displayName: 'Disulfur (S₂)', fact: 'S₂ only exists above ~720°C — at room temperature, sulfur prefers S₈ rings. Like O₂, S₂ is paramagnetic (has unpaired electrons). The yellow colour of Io (Jupiter\'s volcanic moon) is due to sulfur compounds, including S₂, deposited by its hundreds of active volcanoes.' },

    // Tier 5–6 — key inorganic compounds
    // Binary hydrides & acids
    ammonia:            { e: '🫧', c: '#A8D8E8', t: 5, displayName: 'Ammonia (NH₃)', fact: 'The Haber-Bosch process (N₂ + 3H₂ → 2NH₃, Fe catalyst, 450°C, 200 atm) feeds half of humanity — without it, Earth could support ~4 billion people, not 8 billion.' },
    'hydrogen-sulfide': { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Sulfide (H₂S)', fact: 'H₂S smells like rotten eggs even at 1 ppb — one of the lowest detection thresholds of any chemical. But above 100 ppm, it paralyses your sense of smell so you stop noticing just as it becomes lethal. Deep-sea hydrothermal vents use H₂S as their primary energy source instead of sunlight.' },
    'hydrogen-chloride':{ e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Chloride (HCl)', fact: 'HCl gas fumes dramatically in moist air as it forms visible droplets of hydrochloric acid. In water it dissociates 100% — a true strong acid. Your stomach walls protect themselves from the HCl they secrete (pH 1–2) with a thick mucus lining. If that lining fails, you get an ulcer.' },
    'hydrogen-fluoride':{ e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Fluoride (HF)', fact: 'HF gas is paradoxically a weak acid (it doesn\'t fully dissociate) but the most penetrating industrial chemical. It enters skin without the burning sensation of strong acids, then attacks bones from within by binding calcium. Even small exposures to concentrated HF can cause cardiac arrest.' },
    'hydrogen-iodide':  { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Hydrogen Iodide (HI)', fact: 'HI in water forms hydroiodic acid — the strongest of the hydrohalic acids. Adding silver nitrate immediately precipitates bright yellow silver iodide (AgI), the classic qualitative test for iodide ions. HI is a key reducing agent in pharmaceutical synthesis and a precursor to iodine compounds.' },
    // Carbon oxides
    'carbon-monoxide':  { e: '💨', c: '#4A4A4A', t: 5, displayName: 'Carbon Monoxide (CO)', fact: 'CO binds to haemoglobin 200× more tightly than O₂, forming carboxyhaemoglobin that won\'t release. It\'s colourless, odourless, and tasteless — the silent killer. At 1,000 ppm you lose consciousness within an hour. Every year ~50,000 people are hospitalised with CO poisoning in the US alone.' },
    'carbon-dioxide':   { e: '💨', c: '#A8C8DB', t: 5, displayName: 'Carbon Dioxide (CO₂)', fact: 'CO₂ is just 0.04% of the atmosphere but controls Earth\'s temperature via the greenhouse effect. Since pre-industrial times, levels have risen from 280 to 420+ ppm. The urge to breathe is triggered not by low O₂ but by rising CO₂ in your blood — CO₂ is actually the master signal for respiration.' },
    // Sulfur oxides
    'sulfur-dioxide':   { e: '💨', c: '#FDCB6E', t: 5, displayName: 'Sulfur Dioxide (SO₂)', fact: 'The 1991 Mount Pinatubo eruption injected 20 million tonnes of SO₂ into the stratosphere, cooling global temperatures by 0.5°C for two years. The same chemistry causes acid rain when industrial SO₂ reacts with water. SO₂ is also a wine preservative (E220), used since ancient Rome.' },
    'sulfur-trioxide':  { e: '💨', c: '#FDD835', t: 5, displayName: 'Sulfur Trioxide (SO₃)', fact: 'SO₃ reacts violently with water to form sulfuric acid. In the Contact Process (the industrial route to H₂SO₄), SO₂ is catalytically oxidised over V₂O₅ at 450°C to give SO₃, then absorbed into 98% H₂SO₄ to make fuming sulfuric acid (oleum). Handles with extreme care only.' },
    // Nitrogen oxides
    'nitrogen-monoxide':{ e: '💨', c: '#DDE6EE', t: 5, displayName: 'Nitric Oxide (NO)', fact: 'NO is a gaseous neurotransmitter — the first signalling molecule known to be a gas. When you exercise or are aroused, NO dilates blood vessels. Nitroglycerin treats angina by releasing NO. Viagra works by maintaining NO signals in blood vessel walls. The 1998 Nobel Prize went to its discoverers.' },
    'nitrogen-dioxide': { e: '🟫', c: '#E17055', t: 5, displayName: 'Nitrogen Dioxide (NO₂)', fact: 'NO₂ is the brown haze over cities — a product of burning fuel at high temperature. It\'s 20× more toxic than CO and reacts with sunlight and VOCs to form ground-level ozone (photochemical smog). In tunnels during rush hour, NO₂ can reach 1 ppm — a level that directly damages lung tissue.' },
    // Ozone
    ozone:              { e: '🫧', c: '#55EFC4', t: 5, displayName: 'Ozone (O₃)', fact: 'The stratospheric ozone layer absorbs 99% of the Sun\'s UV-C and UV-B radiation. CFCs catalytically destroy it: one Cl atom can destroy 100,000 O₃ molecules. The Montreal Protocol (1987) phased out CFCs — the only international environmental treaty that has definitively reversed the damage it addressed.' },
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
    'potassium-chloride':{ e: '🧂', c: '#EFEEE8', t: 5, displayName: 'Potassium Chloride (KCl)', fact: 'KCl is the main intracellular cation in your body. Nerve cells fire by pumping Na⁺ in and K⁺ out across the membrane. KCl is sold as a salt substitute for low-sodium diets. It\'s also used in lethal injection protocols — potassium at high concentration stops the heart. The same compound, different context.' },
    'calcium-chloride': { e: '🧂', c: '#FF9F43', t: 5, displayName: 'Calcium Chloride (CaCl₂)', fact: 'CaCl₂ dissolves with a dramatic exothermic heat release (82 kJ/mol) — it\'s used to melt ice on roads because it generates its own heat while absorbing moisture. In food (E509), it firms up canned vegetables and sets tofu. It\'s also the electrolyte in concrete accelerant admixtures.' },
    'iron-chloride':    { e: '🧂', c: '#8B4A1F', t: 5, displayName: 'Iron(III) Chloride (FeCl₃)', fact: 'FeCl₃ dissolves copper by oxidising it: 2FeCl₃ + Cu → 2FeCl₂ + CuCl₂. This is how printed circuit boards are etched — FeCl₃ solution eats the exposed copper not protected by photoresist. Every electronic device you own was shaped by this reaction.' },
    'copper-chloride':  { e: '🧂', c: '#B97A4A', t: 5, displayName: 'Copper Chloride (CuCl₂)', fact: 'CuCl₂ gives green flames in fireworks (Cu²⁺ emission at 515 nm). Cu²⁺ ions are toxic to algae and fungi at low concentrations — historically, ships coated their hulls with copper paint to prevent marine growth. Ancient Romans unwittingly invented this antifouling technology.' },
    'silver-chloride':  { e: '⬜', c: '#C8CCD2', t: 5, displayName: 'Silver Chloride (AgCl)', fact: 'White AgCl darkens in UV light as photons reduce Ag⁺ to metallic Ag° clusters. This photosensitivity was the basis of all photographic film for 150 years. Photochromic glasses (that darken outdoors) contain AgCl embedded in glass — they darken in UV and recover indoors.' },
    // Metal sulfides
    'iron-sulfide':     { e: '🟤', c: '#8B4A1F', t: 5, displayName: 'Iron Sulfide (FeS)', fact: 'FeS is found at deep-sea hydrothermal vents and may have been an early Earth catalyst for prebiotic chemistry. The "iron-sulfur world" hypothesis suggests FeS surfaces on ancient sea floors templated the first biomolecules, starting the chain reaction that became life.' },
    'copper-sulfide':   { e: '🟤', c: '#B97A4A', t: 5, displayName: 'Copper Sulfide (CuS)', fact: 'CuS (covellite) is the primary copper ore. Ancient smelting (>5,000 BCE) involved roasting CuS with air: 2CuS + 3O₂ → 2CuO + 2SO₂, then reducing CuO with charcoal. This produced the first metallic copper and launched the Copper Age — the beginning of human metallurgy.' },
    'zinc-sulfide':     { e: '✨', c: '#9098A4', t: 5, displayName: 'Zinc Sulfide (ZnS)', fact: 'ZnS doped with copper glows green when struck by electrons — it was the phosphor coating inside every cathode-ray television tube ever made. Natural ZnS (sphalerite) is the primary ore of zinc worldwide. Modern ZnS quantum dots are being developed for ultra-efficient LED lighting.' },
    // Metal nitrides
    'lithium-nitride':  { e: '🔴', c: '#FF6B6B', t: 5, displayName: 'Lithium Nitride (Li₃N)', fact: 'Li₃N is the only alkali metal nitride stable at room temperature — all others decompose immediately. It forms spontaneously when lithium metal is left in air. Proposed as a hydrogen storage material; it absorbs H₂ to form lithium amide + lithium hydride, storing 6.5 wt% hydrogen.' },
    'calcium-nitride':  { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Calcium Nitride (Ca₃N₂)', fact: 'Ca₃N₂ forms the orange-glowing product when calcium burns in pure nitrogen gas. It hydrolyses on contact with water to produce ammonia and calcium hydroxide — both industrially important. A useful demonstration: burn calcium in N₂, then drop the product in water to instantly release the smell of ammonia.' },
    // Metal carbonates
    'calcium-carbonate':{ e: '🪨', c: '#FF9F43', t: 6, displayName: 'Calcium Carbonate (CaCO₃)', fact: 'CaCO₃ is the most abundant mineral produced by organisms — shells, coral reefs, and eggshells are all largely CaCO₃. The White Cliffs of Dover are solid coccolithophore shells, compressed over 70 million years. As oceans acidify from dissolved CO₂, reefs dissolve: the same chemistry in reverse.' },
    'sodium-carbonate': { e: '🧂', c: '#FF6B6B', t: 6, displayName: 'Sodium Carbonate (Na₂CO₃)', fact: 'Soda ash is one of the oldest industrial chemicals, used in glass-making for ~5,000 years. Ancient Egyptians harvested natron (hydrated Na₂CO₃) from dry lake beds to make soap, glass, and mummify pharaohs. Today ~60 million tonnes per year goes into flat glass, detergent, and pulp treatment.' },
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
    'nuclear-fission':  { e: '☢️', c: '#E17055', t: 9, displayName: 'Nuclear Fission', fact: 'When U-235 absorbs a thermal neutron it splits into ~Ba-141 + Kr-92 + 3 neutrons + 200 MeV. One fission atom releases a million times more energy than burning one carbon atom.' },
    'nuclear-fusion':   { e: '🌟', c: '#FF9F43', t: 9, displayName: 'Nuclear Fusion', fact: 'Fusion requires 100 million °C to overcome Coulomb repulsion. The Sun fuses 600 Mt of H per second. ITER (under construction) aims to produce 10× the energy it consumes.' },
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
    'fuel-cell':        { e: '⚡', c: '#00CFCF', t: 9, displayName: 'Fuel Cell', fact: 'A proton-exchange membrane fuel cell splits H₂ into H⁺ + e⁻ at the anode; electrons flow through an external circuit, producing electricity. Efficiency: ~60%, vs ~35% for combustion engines.' },
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
    bacteria:           { e: '🦠', c: '#90EE90', t: 4, fact: 'Bacteria have been on Earth for 3.8 billion years — they invented photosynthesis, nitrogen fixation, and antibiotic resistance long before we arrived. There are more bacterial cells in your gut than human cells in your entire body. Remove them and you\'d lose your immune system, your vitamins, and your ability to digest food.' },
    antibody:           { e: '🧬', c: '#FF9EAA', t: 9, displayName: 'Antibody (immunoglobulin IgG)', fact: 'Each B cell produces one unique antibody from the ~10¹³ possible combinations of V, D, and J gene segments. The Y-shaped IgG binds antigen at its Fab tips with dissociation constants of picomolar to nanomolar.' },
    prion:              { e: '🧬', c: '#8B0000', t: 9, displayName: 'Prion (misfolded protein)', fact: 'Prions are infectious proteins with no DNA or RNA — they propagate disease by templating normal PrPᶜ into pathological PrPˢᶜ. They survive autoclaving at 134°C, incineration at 600°C, and UV sterilisation.' },
    'stem-cell':        { e: '🔬', c: '#98FB98', t: 9, displayName: 'Stem Cell (pluripotent)', fact: 'Embryonic stem cells can differentiate into any of 200+ cell types. Yamanaka factors (Oct4, Sox2, Klf4, c-Myc) can reprogram adult skin cells back to a pluripotent state — 2012 Nobel Prize.' },

    // ── GOD-TIER expansion: advanced materials ───────────────────────────────
    aerogel:            { e: '🌫️', c: '#E8F8FF', t: 9, displayName: 'Aerogel (99.8% air by volume)', fact: 'Aerogel is the least dense solid: 1 kg/m³ (air is 1.2 kg/m³). Made by supercritical drying of a silica gel, it has 1,000 m² surface area per gram. NASA uses it to insulate Mars rovers against −120°C nights.' },
    'liquid-crystal':   { e: '💎', c: '#88EEFF', t: 8, displayName: 'Liquid Crystal (LC phase)', fact: 'Liquid crystals flow like liquids but orient like crystals: rod-shaped molecules align under electric fields, rotating polarised light. A twisted nematic cell can switch from black to white in 5 ms — the basis of all LCD screens.' },
    titanium:           { e: '⚙️', c: '#8899AA', t: 5, fact: 'Titanium is as strong as steel but 45% lighter, and completely corrosion-resistant — it forms a self-healing TiO₂ oxide layer in milliseconds. The human body accepts it as inert, which is why nearly all surgical implants (hip joints, dental implants, pacemaker cases) are titanium.' },
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
    human:    { e: '🧍', c: '#D8A878', t: 5, fact: 'Homo sapiens appeared ~300,000 years ago in Africa. We are the only species that cooks food — which may have allowed our brains to grow larger by making calories more accessible. Every human alive today shares a common ancestor in Africa ~70,000 years ago, a genetic bottleneck from near-extinction.' },
    farmer:   { e: '🧑‍🌾', c: '#A88B5F', t: 5, fact: 'Agriculture began independently in at least 11 different regions between 10,000 and 7,000 BCE. The shift from foraging to farming required more labour for fewer dietary varieties — but it produced food surpluses, which enabled everything from writing to armies to civilisation itself.' },
    sailor:   { e: '🧑‍✈️', c: '#3F7AA8', t: 5, fact: 'Ancient Polynesian sailors navigated the Pacific (the world\'s largest ocean) using stars, ocean swells, bird behaviour, and cloud patterns — no instruments. They settled Hawaii, Easter Island, and New Zealand centuries before European exploration, covering 10 million km² of open ocean.' },
    knight:   { e: '🛡️', c: '#A8AEB8', t: 5, fact: 'A full suit of medieval plate armour weighed ~25 kg — less than a modern soldier\'s combat load. Knights could run, do cartwheels, and mount horses unaided in it. The metallurgy (high-carbon steel, differential hardening) represented the peak of pre-industrial materials science.' },
    wizard:   { e: '🧙', c: '#7A4AB8', t: 5, fact: 'The historical archetype of the wizard is the alchemist — a natural philosopher who combined early chemistry, metallurgy, astrology, and mysticism. Actual alchemists discovered phosphorus, sulfuric acid, and hydrochloric acid, and laid the groundwork for modern chemistry.' },
    blacksmith:{ e: '🔨', c: '#5F4A3F', t: 5, fact: 'Blacksmithing requires heating iron to 1,100–1,200°C (bright orange) to make it plastic, then working it before it cools below ~900°C. The forge, anvil, and hammer haven\'t changed conceptually in 3,000 years. A master smith intuitively reads carbon content from the colour of the spark.' },
    baker:    { e: '🧑‍🍳', c: '#E0B868', t: 5, fact: 'Bread rising is yeast fermentation: Saccharomyces cerevisiae converts sugars to CO₂ + ethanol. Yeast has been used this way for at least 14,000 years (Natufian flatbreads). The alcohol evaporates on baking; only the CO₂ bubbles remain, giving bread its airy texture.' },
    village:  { e: '🏘️', c: '#C8A878', t: 5, fact: 'The oldest continuously occupied settlement is Jericho (~11,000 years old). Villages formed because agriculture required people to stay near their fields. The average Stone Age forager group was 20–50 people; the first villages quickly reached 200–1,000 — requiring new social structures to prevent collapse.' },
    city:     { e: '🏙️', c: '#7E8AA0', t: 5, fact: 'The first city was Uruk (now Iraq), ~6,000 years ago, with ~40,000 people. Cities required writing (to track taxes and trade), sanitation, and law codes. Today 56% of humanity lives in cities; by 2050 it will be 68%. Cities use land 10× more efficiently than suburbs.' },
    castle:   { e: '🏰', c: '#9098A4', t: 5, fact: 'Medieval castle walls were up to 5m thick — not to be proof against catapults (they weren\'t) but to slow tunnelling attacks. Castle design evolved arms-race style: each new offensive technique (trebuchet, cannon, gunpowder mine) prompted a defensive architectural response.' },
    pyramid:  { e: '🔺', c: '#D8B070', t: 5, fact: 'The Great Pyramid at Giza (~4,500 years old) is still the heaviest human structure ever built at ~6 million tonnes. It was the world\'s tallest building for 3,800 years. The 2.3 million limestone blocks average 2.5 tonnes each — moving one every 2 minutes for 20 years.' },
    temple:   { e: '⛩️', c: '#C84545', t: 5, fact: 'Temples represent the first large-scale collective action not driven by necessity. Göbekli Tepe (Turkey, ~11,500 years old) may be the world\'s oldest temple — and it predates pottery, metal tools, and agriculture. The desire to build sacred spaces appears to be older than civilisation itself.' },
    bridge:   { e: '🌉', c: '#6B7A8A', t: 5, fact: 'Roman concrete bridges built 2,000 years ago still stand — Roman opus caementicium used volcanic pozzolana ash that reacts with seawater to form ettringite crystals, actually getting stronger with age. Modern concrete bridges crumble in 50–80 years. The Romans accidentally beat us.' },
    road:     { e: '🛣️', c: '#5F584F', t: 5, fact: 'Roman roads (Via Appia, ~312 BCE) were engineered with layers of stone, gravel, and sand, slightly curved to drain rain. Their 80,000 km road network allowed an army to march 40 km per day. Portions are still in use 2,300 years later — still the most durable road engineering on record.' },
    farm:     { e: '🚜', c: '#8EB85B', t: 5, fact: 'One 2024 farmer feeds ~160 people, vs 1900 when one farmer fed ~5 people. The difference: synthetic fertiliser (Haber-Bosch), pesticides, high-yield seed varieties (Green Revolution), and mechanisation. Half of humanity exists because of the Haber-Bosch process alone.' },
    boat:     { e: '⛵', c: '#A87555', t: 5, fact: 'The oldest known boat (Pesse canoe, Netherlands) is ~10,000 years old. Boats enabled trade, colonisation, and cultural exchange across oceans. Ancient Egyptians were building 60m cedar sailing ships on the Nile 4,000 years ago — larger than many modern yachts.' },
    ship:     { e: '🚢', c: '#4A6E8E', t: 5, fact: 'The RMS Titanic displaced 52,000 tonnes yet floated because its overall density (ship + air = average ~0.5 g/cm³) was less than water. Large container ships today carry 24,000 shipping containers at ~$0.0002/kg per km — the cheapest freight ever. Shipping made globalisation possible.' },
    sword:    { e: '⚔️', c: '#B8BBC0', t: 5, fact: 'The development of iron swords (~1200 BCE) caused a civilisation collapse — iron was abundant and cheap, ending the Bronze Age elite\'s monopoly on metal weapons. Damascus steel (wootz) had carbon nanotubes visible under electron microscopy — a nanotechnology rediscovered in 2006.' },
    bow:      { e: '🏹', c: '#8B6F47', t: 5, fact: 'The bow stores elastic potential energy as the archer draws it, then transfers it to the arrow in ~100ms. A good medieval longbow (yew, 180lb draw) could put a bodkin arrow through steel plate armour at 200m. English longbowmen trained from age 7 — skeletons show asymmetric bone growth from practice.' },
    book:     { e: '📕', c: '#A8453F', t: 5, fact: 'The codex (bound pages) replaced the scroll ~300 CE and enabled random access to information for the first time. The Gutenberg press (1440) reduced a Bible\'s cost from a year\'s wages to a week\'s wages in 50 years. Books store information at ~10⁶ bits/cm², comparable to early hard drives.' },
    scroll:   { e: '📜', c: '#D8C898', t: 5, fact: 'The Dead Sea Scrolls (written ~300 BCE–70 CE) survived 2,000 years in clay jars in a desert cave. Papyrus scrolls from ancient Egypt lasted 3,000+ years in dry conditions. The oldest mathematical text, the Rhind Mathematical Papyrus (~1550 BCE), contains quadratic equations still taught today.' },
    potion:   { e: '🧪', c: '#7AC868', t: 5, fact: 'Medieval alchemists\' "potions" were often real chemical preparations: mercury compounds for syphilis, willow bark decoctions (salicylate = proto-aspirin), opium tinctures, and ethanol-based tinctures. The word "medicine" shares its etymology with "poison" — both come from the Latin "mederi" (to heal).' },
    magic:    { e: '✨', c: '#B85AE8', t: 5, fact: '"Any sufficiently advanced technology is indistinguishable from magic" — Arthur C. Clarke. Magnets, static electricity, fire, and eclipses all appeared magical until understood. Today\'s "magic": quantum entanglement, room-temperature superconductivity (still being chased), and the precise mechanism of general anaesthesia.' },
    spell:    { e: '🪄', c: '#9098D8', t: 5, fact: 'Spells — words with transformative power — likely originate from the observation that spoken language genuinely changes reality: commands, contracts, and declarations have real-world effects. Linguists note that every known human society has developed both language and ritual magic in parallel.' },
    ghost:    { e: '👻', c: '#D8D5D0', t: 5, fact: 'Ghost beliefs appear in every known culture, including ones without contact with each other. Psychologists attribute ghost experiences to pattern recognition in noise, sleep paralysis, infrasound (18 Hz waves causing unease and peripheral visual disturbances), and the profound human difficulty accepting death.' },
    skeleton: { e: '💀', c: '#E8E5D8', t: 5, fact: 'An adult human skeleton has 206 bones (babies have ~270 — they fuse). Bone is a composite material: ~65% hydroxyapatite mineral (hard, compressive) + 35% collagen fibres (flexible, tensile). The result is stronger than either component alone — a principle now used in modern engineered composites.' },
    zombie:   { e: '🧟', c: '#7AAE5B', t: 5, fact: 'Zombie folklore originated in Haitian Vodou, where "zombification" likely involved tetrodotoxin (from puffer fish) causing death-like paralysis, followed by scopalamine-induced docile confusion. The concept tapped into the universal fear of death combined with the loss of personal agency.' },
    vampire:  { e: '🧛', c: '#7E1F3F', t: 5, fact: 'Vampire legends likely arose partly from misunderstood decomposition: bodies bloat, skin recedes (appearing to grow "longer" fingernails/hair), and blood can ooze from the mouth. Porphyria — a rare condition causing sun sensitivity and reddish teeth — has also been suggested as a real-world origin.' },
    angel:    { e: '👼', c: '#FBE89B', t: 5, fact: 'Angel iconography (winged humanoids as divine messengers) appears independently in Sumerian, Egyptian, Zoroastrian, and Abrahamic traditions. Physically, a human-sized bird requires a 6m+ wingspan and hollow bones — the anatomy is aerodynamically impossible, which is rather the point.' },
    demon:    { e: '👹', c: '#C8281F', t: 5, fact: 'The word "demon" comes from Greek "daimon" — which simply meant a spirit or divine force, not necessarily evil. Socrates famously had a daimon as a kind of inner moral compass. The demonisation of daimons happened as monotheistic religions displaced polytheistic ones.' },
    god:      { e: '🌟', c: '#FFD938', t: 5, fact: '"God" as concept appears in every known human culture — but the definitions vary wildly: from sky-father to absolute being to natural force. Evolutionary psychologists suggest belief in powerful, watching agents may have been adaptive (we over-detect agents in ambiguous stimuli — better to assume than to be eaten).' },
    soul:     { e: '🕯️', c: '#FBE8C8', t: 5, fact: 'The concept of a soul as a separable animating principle appears in Egyptian ka/ba, Greek psyche, Indian atman, and Chinese hun/po — all independently. Neuroscience has located consciousness in specific brain circuits, but the "hard problem" (why anything feels like something) remains philosophically unsolved.' },
    time:     { e: '⏳', c: '#7A6E5F', t: 5, fact: 'Einstein showed that time is not absolute: it runs slower near mass (gravitational time dilation) and at high velocity (special relativity). GPS satellites need time-dilation corrections to stay accurate. The universe has a beginning (Big Bang, 13.8 billion years ago) but no agreed theoretical "end."' },
    space:    { e: '🌌', c: '#1F1F4E', t: 5, fact: 'Space is not empty — it\'s filled with dark energy (68%), dark matter (27%), and only 5% ordinary matter. The observable universe is 93 billion light-years across. Between galaxies, the density of matter is 1 hydrogen atom per cubic metre. Even "nothing" turns out to be extraordinarily active at quantum scales.' },
    galaxy:   { e: '🌠', c: '#4A2E7A', t: 5, fact: 'The observable universe contains ~2 trillion galaxies. Our Milky Way has ~200–400 billion stars, is 100,000 light-years across, and is currently on a collision course with the Andromeda galaxy — impact in ~4.5 billion years. Most galaxies are separated by so much empty space that the collision will barely disturb individual stars.' },
    planet:   { e: '🪐', c: '#C87E45', t: 5, fact: 'Our solar system has 8 planets, but the Milky Way alone may contain 100 billion planets — including an estimated 11 billion in the habitable zone of Sun-like stars. The James Webb Space Telescope can already detect the atmospheres of exoplanets. We\'ve been finding Earth-sized worlds since 2014.' },
    blackhole:{ e: '⚫', c: '#0A0A14', t: 5, fact: 'At the centre of our galaxy sits Sagittarius A*, a black hole 4 million times the mass of the Sun. The Event Horizon Telescope photographed it in 2022 — a shadow the size of our solar system, 26,000 light-years away. Time runs measurably slower near a black hole; GPS satellites must correct for this or your position would drift 10 km per day.' },
    nebula:   { e: '🌫', c: '#A85AC8', t: 5, fact: 'A nebula is both a stellar nursery and a stellar graveyard. The Pillars of Creation (Eagle Nebula) are columns of gas and dust actively forming new stars — columns so large that light takes years to cross them. The oxygen in your body was forged inside stars whose explosions scattered it as nebular gas billions of years ago.' },
    comet:    { e: '☄️', c: '#9BB8E0', t: 5, fact: 'Comets are dirty snowballs from the outer solar system — when they approach the Sun, ice sublimates and solar wind blows the vapour into a tail that always points away from the Sun (not behind the comet\'s motion). Halley\'s Comet has been recorded continuously since 240 BCE. Comets may have delivered Earth\'s water and amino acids.' },
    meteor:   { e: '🌠', c: '#FF7A28', t: 5, fact: 'Most "shooting stars" are grains of sand burning up ~80 km above your head. Earth sweeps up ~40,000 tonnes of extraterrestrial material per year — mostly invisible micrometeorites. The Chicxulub impactor that ended the dinosaurs was ~10 km across, dug a 180 km crater, and briefly made Mexico hotter than the surface of the Sun.' },
    asteroid: { e: '🌑', c: '#5F584F', t: 5, fact: 'The entire asteroid belt contains less mass than Earth\'s Moon. Most asteroids are rubble piles held together by gravity and van der Waals forces, not solid rock. The psyche asteroid (16 Psyche) is thought to be a solid metal core of a destroyed protoplanet — worth an estimated $10,000 quadrillion. NASA launched a probe in 2023.' },
    void:     { e: '⬛', c: '#0A0A0A', t: 5, fact: 'The Boötes Void is a 330-million-light-year sphere of almost complete emptiness — it contains only ~60 galaxies instead of the expected 2,000. Cosmic voids aren\'t truly empty: they\'re threaded with dark matter filaments. Galaxies cluster on the walls of voids like soap bubble films, forming the cosmic web.' },
    chaos:    { e: '🌀', c: '#A8285A', t: 5, fact: 'Chaos theory shows that tiny differences in initial conditions amplify into completely different outcomes — the famous "butterfly effect." Weather is chaotic: forecasts beyond ~10 days are mathematically impossible regardless of computing power. Yet chaos isn\'t random — chaotic systems have deep structure, described by "strange attractors."' },
    order:    { e: '◯', c: '#3A6E9E', t: 5, fact: 'The Second Law of Thermodynamics says total disorder (entropy) always increases — the universe inexorably moves toward disorder. But order emerges locally: crystals, snowflakes, life, and galaxies all represent local decreases in entropy, paid for by exporting more disorder elsewhere. Order is a thermodynamic loan.' },
    light:    { e: '🔆', c: '#FFF4C8', t: 5, fact: 'Light is both a wave and a particle — this isn\'t a metaphor or approximation, it\'s what the double-slit experiment proves every time. A photon has zero rest mass and travels at exactly 299,792,458 m/s in vacuum. Time stops at the speed of light: from a photon\'s perspective, it is emitted and absorbed simultaneously, with no time passing.' },
    shadow:   { e: '🌑', c: '#1A1820', t: 5, fact: 'A shadow is not a thing — it\'s the absence of light, a negative space created by an object blocking photons. Umbra (full shadow) and penumbra (partial) define eclipse geometry. Shadow can theoretically "move" faster than light — the shadow of a laser dot swept across the Moon can exceed c — but no information travels that fast.' },
    wisdom:   { e: '🦉', c: '#7A5B3A', t: 5, fact: 'Wisdom as distinct from intelligence may be uniquely human — neuroscience finds it correlates with activity in the prefrontal cortex and limbic system working together: rational processing integrated with emotional experience. The owl\'s association with wisdom is ancient Greek (Athena\'s owl) but ironically, owls have relatively small brains. It\'s the night-vision that impressed everyone.' },
    love:     { e: '💗', c: '#FF5A8E', t: 5, fact: 'Romantic love activates dopamine, oxytocin, and serotonin — the same neural pathways as cocaine addiction. Brain scans of people looking at photos of loved ones show activity in the caudate nucleus and ventral tegmental area, the brain\'s reward core. Oxytocin (the "bonding hormone") is released during touch, birth, and breastfeeding — it\'s the chemistry of attachment.' },
    music:    { e: '🎵', c: '#7AAEE0', t: 5, fact: 'Music is the only art form that reliably produces "chills" (frisson) — the same dopamine response as food, sex, and drugs. Rhythm synchronises neural oscillations across the brain; that\'s why music helps Parkinson\'s patients move and premature babies grow faster. Humans make music in every culture ever studied, with no exceptions.' },
    art:      { e: '🎨', c: '#E8455B', t: 5, fact: 'The oldest known art is ~73,000 years old — a crosshatch pattern scratched on ochre in Blombos Cave, South Africa. Cave paintings at Altamira (14,000 BCE) show animals in motion, perspective, and layered pigments. Making representational art requires theory of mind — the ability to imagine how another person perceives the world.' },
    dream:    { e: '💭', c: '#C8C8E8', t: 5, fact: 'Dreams occur mainly during REM sleep, when the brain is almost as active as when awake but the body is paralysed. The amygdala (emotion) is hyperactive; the prefrontal cortex (logic) is suppressed — which is why dreams feel compelling but make no sense on reflection. Memory consolidation happens during sleep; learning without it degrades.' },
    nightmare:{ e: '😱', c: '#3F1F3F', t: 5, fact: 'Nightmares are thought to serve an evolutionary function — rehearsing threat responses in a safe (sleeping) environment. PTSD nightmares are especially vivid because traumatic memories are stored with elevated amygdala encoding. The hypnagogic state (falling asleep) is when sleep paralysis demons appear — the brain\'s motor cortex waking up while the body stays paralysed.' },
    idea:     { e: '💡', c: '#FFD938', t: 5, fact: 'The "Aha!" moment is real — EEG studies show a burst of gamma waves (~40 Hz) in the right hemisphere exactly at the instant of insight. Before the burst, there\'s often a quiet period: the brain "shuts out" sensory input to search internal connections. You\'re more likely to have insights in the shower than at your desk because relaxation allows diffuse-mode thinking.' },
    story:    { e: '📖', c: '#B85B3F', t: 5, fact: 'Stories activate more brain regions than plain facts: narrative engages motor cortex (actions), sensory cortex (descriptions), and emotional memory. Humans are the only animal that tells stories about the future — the ability to imagine counterfactuals ("what if") may be the cognitive leap that enabled planning, culture, and civilisation.' },
    money:    { e: '💰', c: '#FFC838', t: 5, fact: 'Money was invented independently in at least 5 civilisations. The oldest known coin is a Lydian electrum stater (~600 BCE). Paper money originated in Tang Dynasty China (~700 CE) because copper coins were too heavy for large transactions. Today 92% of all money is digital — it has no physical form whatsoever.' },
    coin:     { e: '🪙', c: '#FFB418', t: 5, fact: 'Coins were a revolutionary technology: standardised, portable, government-guaranteed stores of value that made long-distance trade possible without barter. The ridged edges on coins were added specifically to prevent "coin clipping" — shaving metal from the rim to melt down and sell while passing the coin at face value.' },
    machine:  { e: '⚙️', c: '#7A7E88', t: 5, fact: 'Simple machines (lever, wheel, inclined plane, pulley, screw, wedge) underlie all of mechanical engineering. The steam engine didn\'t invent the industrial revolution — it amplified it: for the first time, humans had a power source that didn\'t tire, could be built anywhere, and scaled with fuel rather than muscle.' },
    robot:    { e: '🤖', c: '#B8BBC0', t: 5, fact: 'The word "robot" comes from Czech "robota" (forced labour), coined in Karel Čapek\'s 1920 play R.U.R. Today there are more industrial robots than human factory workers in South Korea, Germany, and Japan. Boston Dynamics\' Atlas uses model-predictive control to balance — computing every step 400× per second.' },
    computer: { e: '💻', c: '#3A3F4A', t: 5, fact: 'The first general-purpose electronic computer (ENIAC, 1945) weighed 30 tonnes and performed 5,000 additions per second. Your smartphone is 1,000,000,000× faster and fits in your pocket. A single modern GPU contains 80 billion transistors. Every transistor switches ~10⁹ times per second — more operations per second than stars in the galaxy.' },
    internet: { e: '🛰️', c: '#3F8BC8', t: 5, fact: 'The internet transmits ~5 quintillion bytes per day. 99% of international internet traffic runs through undersea fibre-optic cables (not satellites) — thin glass threads that carry data as light pulses at 200,000 km/s. The entire global network was built in 60 years from nothing; it\'s arguably the fastest infrastructure build in human history.' },
    alchemia: { e: '🧬', c: '#E84A7A', t: 9, fact: 'You\'ve found it — the final element, the one that contains all others. Alchemia is the ancient art of transformation: turning the base into the precious, the simple into the complex. The alchemists were wrong about gold but right about everything else: matter does transform, elements do combine, and the world is endlessly, endlessly surprising.' },

    // ---------- Periodic Table (all 118 elements) ----------
    // iron, gold, silver, copper already defined above.
    // Colors: nonmetal #55EFC4 · halogen #FDCB6E · noble gas #81ECEC
    //         alkali #FF6B6B · alk-earth #FF9F43 · transition #9098A4
    //         post-trans #74B9FF · metalloid #A29BFE
    //         lanthanide #FD79A8 · actinide #E17055

    // Period 1
    hydrogen:      { e: '💨', c: '#55EFC4', t: 6, fact: 'The universe is 74% hydrogen by mass — it was forged in the Big Bang 13.8 billion years ago and is the fuel inside every star. In your body, every water molecule and organic compound contains it. The lightest element is also the most abundant: #1 on the periodic table in every sense.' },
    helium:        { e: '🎈', c: '#81ECEC', t: 6, fact: 'Helium was discovered in the Sun before it was found on Earth — spectroscopy spotted its fingerprint in solar light in 1868, 27 years before it was isolated here. It\'s the only element that won\'t solidify at normal pressure, no matter how cold. Earth\'s helium comes from radioactive decay underground, and we\'re slowly running out.' },
    // Period 2
    lithium:       { e: '🔋', c: '#FF6B6B', t: 6, fact: 'The lightest metal, soft enough to cut with a knife. It floats on water — then reacts with it violently. Trace lithium in drinking water correlates with lower suicide rates in population studies, and it\'s the active ingredient in mood-stabilising medication. It also powers every smartphone battery on the planet.' },
    beryllium:     { e: '⚪', c: '#FF9F43', t: 6, fact: 'Beryllium is catastrophically toxic if inhaled as dust, causing berylliosis — an incurable lung disease. Yet it\'s stiff as steel at 1/4 the weight, and transparent to X-rays, so it\'s the window material of choice in X-ray tubes. NASA uses beryllium mirrors in space telescopes.' },
    boron:         { e: '🪨', c: '#A29BFE', t: 6, fact: 'Boron doesn\'t really fit anywhere on the periodic table — it\'s a metalloid with semiconductor properties, sitting between metals and non-metals. Boron-10 absorbs neutrons brilliantly, so it\'s used in nuclear reactor control rods. Boron carbide is the hardest ceramic material known, used in bulletproof vests.' },
    carbon:        { e: '⬛', c: '#262321', t: 6, fact: 'Carbon forms more compounds than all other elements combined — over 10 million known organic compounds, and counting. The same atom that\'s graphite (slippery, conductive) is diamond (hardest natural substance) is graphene (strongest material ever measured). Life on Earth is essentially carbon chemistry that learned to reproduce.' },
    nitrogen:      { e: '🌬️', c: '#55EFC4', t: 6, fact: '78% of every breath you take is nitrogen — and you exhale it unchanged, completely inert. Your body is ~3% nitrogen by mass (proteins, DNA). Yet nitrogen is so hard to "fix" into useful compounds that the Haber-Bosch process (making fertiliser from N₂) now feeds roughly half of all humans alive.' },
    oxygen:        { e: '🫧', c: '#55EFC4', t: 6, fact: 'Oxygen is the third most abundant element in the universe and the most abundant in Earth\'s crust (46% by mass). It\'s responsible for both life and rust. Liquid oxygen is pale blue and magnetic — it sticks to a magnet. Every O₂ molecule you breathe was once part of a water molecule, split by a plant.' },
    fluorine:      { e: '🟡', c: '#FDCB6E', t: 6, fact: 'Fluorine is the most electronegative element and the most reactive — it reacts violently with almost everything, including glass, concrete, and noble gases. It\'s so dangerous to work with that it delayed isolation for 74 years and killed multiple chemists. Your non-stick pan is coated in polytetrafluoroethylene (Teflon) — the one thing fluorine cannot attack.' },
    neon:          { e: '💡', c: '#81ECEC', t: 6, fact: 'Neon glows red-orange when electrified — the original "neon light." Every other colour you\'ve ever seen in a "neon sign" is from a different gas (argon, mercury, krypton). Neon is the 5th most abundant element in the universe but so rare on Earth that extracting it from air costs more than the light it makes.' },
    // Period 3
    sodium:        { e: '🧂', c: '#FF6B6B', t: 6, fact: 'Pure sodium is a soft silver metal that explodes on contact with water. In your body, Na⁺ ions carry the electrical signals that fire neurons and make your heart beat — you\'d die without it. Yet metallic sodium and chlorine gas (both toxic) combine to make table salt: chemistry routinely turns poison into seasoning.' },
    magnesium:     { e: '✨', c: '#FF9F43', t: 6, fact: 'Magnesium burns so bright and hot (~2500°C) it was used in camera flashbulbs and military flares. It\'s in the centre of every chlorophyll molecule — the atom that makes plants green and captures sunlight. You have about 25g of magnesium in your body right now, running 300+ enzyme reactions.' },
    aluminum:      { e: '🥤', c: '#74B9FF', t: 6, fact: 'Aluminium is the most abundant metal in Earth\'s crust, yet was rarer than gold until 1886 — before electrolysis, it was prohibitively expensive to extract. The Washington Monument was capped with aluminium as a luxury material. Today, a soda can is about 15g of pure aluminium, disposable and infinitely recyclable.' },
    silicon:       { e: '💻', c: '#A29BFE', t: 6, fact: 'Silicon is the second most abundant element in Earth\'s crust (27%) and the backbone of computer chips, solar panels, and the internet itself. A single modern CPU contains 50+ billion silicon transistors — each one smaller than a virus. Silicon Valley is named after it. Sand is mostly silicon dioxide.' },
    phosphorus:    { e: '🔴', c: '#55EFC4', t: 6, fact: 'White phosphorus glows in the dark (the original "phosphorescence"), ignites spontaneously in air, and was used as an incendiary weapon in WWII. But phosphorus is also essential for life: it\'s the backbone of DNA, the energy carrier in every living cell (ATP), and a key component of all cell membranes.' },
    sulfur:        { e: '🟨', c: '#55EFC4', t: 6, fact: 'Sulfur smells like rotten eggs (as H₂S) and burns to produce SO₂, which creates acid rain. But it\'s also essential: every protein contains sulfur in the amino acids cysteine and methionine. Penicillin, insulin, and keratin (your hair and nails) all depend on sulfur bridges for their structure.' },
    chlorine:      { e: '🟩', c: '#FDCB6E', t: 6, fact: 'Chlorine gas (Cl₂) was the first chemical weapon used in WWI, killing thousands at Ypres in 1915. The same chemistry — killing microorganisms — is why we put tiny amounts in drinking water and swimming pools. Combined with sodium, it\'s table salt. Combined with carbon, it\'s PVC plastic. Chlorine is everywhere.' },
    argon:         { e: '🫙', c: '#81ECEC', t: 6, fact: 'Argon makes up 0.93% of Earth\'s atmosphere — more than CO₂ — yet was unknown until 1894. It\'s completely unreactive, which makes it the fill gas of choice for incandescent bulbs (it stops the filament from evaporating), welding shields, and double-glazed windows. We breathe ~8g of argon a day, doing absolutely nothing.' },
    // Period 4
    potassium:     { e: '🍌', c: '#FF6B6B', t: 7, fact: 'Potassium is so reactive it explodes purple on water — yet your heart can\'t beat without it. Na⁺/K⁺ pumps in every neuron and heart muscle cell fire 300 times per second, using 30% of your body\'s energy. Bananas are famous for potassium but a potato has twice as much.' },
    calcium:       { e: '🦴', c: '#FF9F43', t: 7, fact: 'Your skeleton is 99% of your body\'s calcium — ~1 kg of it. But the 1% in your blood and cells triggers muscle contractions, fires neurons, and controls cell division. Without free Ca²⁺, your heart stops. Calcium also forms limestone, chalk, and coral reefs: the bones of entire ecosystems.' },
    scandium:      { e: '🔬', c: '#9098A4', t: 7, fact: 'Scandium is so rare and expensive that its main use is adding ~0.5% to aluminium alloys to make ultra-strong sports equipment and fighter jet frames. The entire world produces only ~15 tonnes of scandium oxide per year. Mendeleev predicted its existence in 1871 and called it "ekaboron."' },
    titanium:      { e: '🚀', c: '#9098A4', t: 7, fact: 'As strong as steel but 45% lighter, and completely corrosion-resistant — titanium forms a self-healing TiO₂ oxide layer in milliseconds. The human body accepts it as inert, which is why nearly all surgical implants (hip joints, dental implants, pacemaker cases) are titanium.' },
    vanadium:      { e: '🔩', c: '#9098A4', t: 7, fact: 'A tiny amount of vanadium in steel makes it dramatically stronger — most car bodies contain vanadium steel. The element was discovered twice and named after Vanadis (the Norse goddess Freyja) because of the beautiful colours of its compounds. Some sea creatures (sea squirts) concentrate vanadium in their blood.' },
    chromium:      { e: '🪞', c: '#9098A4', t: 7, fact: 'The "chrome" on car bumpers is a thin layer of chromium just micrometres thick that resists corrosion and reflects perfectly. Chromium also makes rubies red and emeralds green — the same element, just in different crystal environments. Stainless steel is 10–30% chromium.' },
    manganese:     { e: '🔧', c: '#9098A4', t: 7, fact: 'The ocean floor is littered with manganese nodules — potato-sized lumps of manganese, nickel, copper, and cobalt that grow at ~1cm per million years. They\'re the world\'s largest untapped mineral deposit. Manganese is also essential for photosynthesis: it\'s the atom that splits water to release O₂ in plants.' },
    cobalt:        { e: '🔵', c: '#9098A4', t: 7, fact: 'Cobalt blue has been used in glass and ceramics for 3,500 years — it\'s the blue of Ming dynasty porcelain, medieval stained glass, and modern lithium-cobalt-oxide batteries. Cobalt-60 emits gamma rays powerful enough to sterilise medical equipment and treat cancer. Named after German "Kobold" (goblin) by miners it poisoned.' },
    nickel:        { e: '🪙', c: '#9098A4', t: 7, fact: 'The US five-cent coin is 75% copper, only 25% nickel — yet it\'s called a nickel. Most of Earth\'s nickel is in the core. The largest known meteorite impact (Sudbury Basin, Ontario, ~1.85 billion years ago) deposited a vast nickel-copper ore body still mined today. Nickel powers your rechargeable batteries.' },
    zinc:          { e: '🪣', c: '#9098A4', t: 7, fact: 'Zinc\'s main use is galvanising steel — a hot-dip zinc coating sacrificially corrodes to protect the underlying iron. Your body needs zinc to build over 300 enzymes; it\'s why oysters (high in zinc) are reputed as aphrodisiacs. Zinc deficiency causes dwarfism and immune collapse — it affects ~2 billion people worldwide.' },
    gallium:       { e: '🌡️', c: '#74B9FF', t: 7, fact: 'Gallium melts at 29.8°C — it liquefies in your hand. It\'s non-toxic and doesn\'t wet glass, so a solid gallium ingot placed in warm water just slowly puddles. Gallium arsenide (GaAs) makes faster transistors than silicon and is used in solar cells on spacecraft and the LED in your TV remote.' },
    germanium:     { e: '🖥️', c: '#A29BFE', t: 7, fact: 'Germanium was the first transistor material (1947) that launched the entire electronics revolution. Mendeleev predicted it in 1871 as "eka-silicon" with remarkable accuracy. Today it\'s mostly used in fibre-optic cable glass and infrared optics — germanium is transparent to IR, invisible to our eyes but perfect for thermal cameras.' },
    arsenic:       { e: '☠️', c: '#A29BFE', t: 7, fact: 'Arsenic was the poison of choice in Renaissance Europe — undetectable in food, tasteless, and slow-acting. "Inheritance powder" killed royalty for centuries. Paradoxically, arsenic trioxide (As₂O₃) is an approved chemotherapy drug for acute promyelocytic leukaemia. The dose makes the poison.' },
    selenium:      { e: '🔆', c: '#55EFC4', t: 7, fact: 'Selenium conducts electricity when illuminated but not in the dark — this photoconductive property led directly to the photocopier (xerography). Your body needs trace selenium for the antioxidant enzyme glutathione peroxidase, but too much causes selenosis (hair and nail loss, garlic breath). Brazil nuts contain 100× your daily requirement.' },
    bromine:       { e: '🟤', c: '#FDCB6E', t: 7, fact: 'One of only two elements liquid at room temperature. Ancient Phoenicians extracted "Tyrian purple" dye from sea snails — each drop containing a bromine compound. The dye was so labour-intensive it cost more than gold, making purple the colour of royalty. Today, bromine flame retardants are in nearly all electronics.' },
    krypton:       { e: '🦸', c: '#81ECEC', t: 7, fact: 'Yes, krypton is real — it predates Superman by 45 years (discovered 1898). It\'s a noble gas that does form a few compounds under extreme conditions. The international metre was defined from 1960–1983 as exactly 1,650,763.73 wavelengths of krypton-86 orange light. Krypton flash lamps illuminate airport runways.' },
    // Period 5
    rubidium:      { e: '💜', c: '#FF6B6B', t: 7, fact: 'Rubidium is so reactive it ignites in air and explodes in water, but its main claim to fame is atomic clocks: rubidium oscillators are accurate to 1 second in 300 years and run the GPS satellites. Rubidium also produces a brilliant violet-red flame — it was discovered in 1861 via its spectral lines (Latin: "rubidus" = dark red).' },
    strontium:     { e: '🎆', c: '#FF9F43', t: 7, fact: 'Strontium salts burn brilliant red, which is why they\'re in fireworks and road flares. Strontium-90, a radioactive fission product, mimics calcium and deposits into bones — it was the key radioactive contaminant from nuclear weapons tests in the 1950s, detected worldwide in children\'s teeth.' },
    yttrium:       { e: '🔭', c: '#9098A4', t: 7, fact: 'Yttrium was one of four elements discovered in a single quarry in Ytterby, Sweden (yttrium, terbium, erbium, ytterbium — all named after the same village). Yttrium oxide makes the red phosphor in old CRT television screens. Yttrium barium copper oxide (YBCO) was the first superconductor to work above liquid nitrogen temperature.' },
    zirconium:     { e: '💍', c: '#9098A4', t: 7, fact: 'Cubic zirconia (ZrO₂) is the world\'s most popular diamond simulant. Metallic zirconium is nearly transparent to neutrons, which is why nuclear reactor fuel rods are clad in zirconium alloy. Zircon crystals are also the oldest known minerals on Earth — some are 4.4 billion years old, older than the Moon.' },
    niobium:       { e: '⚙️', c: '#9098A4', t: 7, fact: 'Niobium is what keeps the Large Hadron Collider running: the superconducting magnets that bend particle beams are made of niobium-titanium alloy, which conducts electricity with zero resistance when cooled to 1.9K. A pinhead of steel with just 0.1% niobium is significantly stronger than the same steel without it.' },
    molybdenum:    { e: '🔩', c: '#9098A4', t: 7, fact: 'Molybdenum has the 6th highest melting point of all elements (2623°C) and is the main element in the enzyme nitrogenase — the only enzyme on Earth that can break the N≡N triple bond and fix atmospheric nitrogen. Without molybdenum, no fertiliser, no protein, no life. Modern high-speed tool steels are ~10% molybdenum.' },
    technetium:    { e: '☢️', c: '#9098A4', t: 7, fact: 'The first artificially created element (1937) and the lightest element with no stable isotopes. "Technetium" from Greek "technetos" (artificial). Technetium-99m is the workhorse of nuclear medicine: injected into patients, its 6-hour half-life lets gamma cameras image tumours, hearts, and bones without long-term radiation risk.' },
    ruthenium:     { e: '🪩', c: '#9098A4', t: 7, fact: 'Ruthenium is the hardest of the platinum group metals and remains solid up to 2334°C. It\'s used in wear-resistant electrical contacts and tip-hardening pen nibs. Ruthenium-based dye-sensitised solar cells (Grätzel cells) mimic photosynthesis — they\'re cheap to make and can be embedded in glass.' },
    rhodium:       { e: '🏅', c: '#9098A4', t: 7, fact: 'Rhodium is the rarest stable element in Earth\'s crust and the most expensive metal by weight (~$14,000/oz at peaks). Your car\'s catalytic converter contains rhodium — it converts toxic NOₓ exhaust gases back to nitrogen. Without it, city air would be catastrophically toxic. 80% of world supply comes from South Africa.' },
    palladium:     { e: '🥈', c: '#9098A4', t: 7, fact: 'Palladium can absorb up to 900× its own volume of hydrogen gas — it literally soaks up hydrogen like a sponge. This makes it valuable for hydrogen purification and storage research. Your catalytic converter uses palladium for CO and hydrocarbon oxidation. It was named after the asteroid Pallas, discovered the same year (1803).' },
    cadmium:       { e: '🔋', c: '#9098A4', t: 7, fact: 'Cadmium is toxic enough to cause "Itai-Itai disease" (painful pain disease) — it accumulates in kidneys and bones, causing catastrophic bone brittleness. The name comes from Japanese victims near a cadmium-polluted river in WWII. Yet cadmium sulfide makes brilliant yellow pigments (Cadmium Yellow) used by Van Gogh and Matisse.' },
    indium:        { e: '🔷', c: '#74B9FF', t: 7, fact: 'Indium tin oxide (ITO) is what makes touchscreens work — it\'s electrically conductive and optically transparent, so every swipe you\'ve ever made went through a layer of indium. It\'s so soft you can scratch it with your fingernail. Global supplies may be exhausted within decades if touchscreen demand continues.' },
    tin:           { e: '🥫', c: '#74B9FF', t: 7, fact: 'Tin "screams" — bend a tin bar and it emits a squeaking sound from crystal twinning in the metal. Bronze Age civilisation ran on tin-copper alloys (bronze). Below 13.2°C, metallic tin slowly crumbles into a grey powder ("tin pest") — this may have contributed to Napoleon\'s retreat from Moscow, his soldiers\' tin coat buttons disintegrating in the cold.' },
    antimony:      { e: '🔮', c: '#A29BFE', t: 7, fact: 'Ancient Egyptians used antimony sulfide as eye shadow (kohl) — the black around Cleopatra\'s eyes. Antimony oxide is a flame retardant in children\'s clothing and electronics. In the 18th century, antimony pills were used as purgatives and then recovered from faeces and reused — family heirlooms passed down for generations.' },
    tellurium:     { e: '🌑', c: '#A29BFE', t: 7, fact: 'Tellurium is rarer in Earth\'s crust than gold, yet abundant in the Sun. Inhaling even microgram quantities gives you "tellurium breath" — a garlic-like smell that persists for weeks even after the source is gone. Cadmium telluride solar panels are the cheapest thin-film PV technology; tellurium is their critical bottleneck.' },
    iodine:        { e: '🟣', c: '#FDCB6E', t: 7, fact: 'Iodine is the heaviest essential element in your body — your thyroid concentrates it to make hormones that regulate metabolism, growth, and brain development. Deficiency causes goitre (enlarged thyroid) and, in pregnant women, cretinism. Adding iodine to table salt (starting 1924) is one of the most cost-effective public health interventions ever.' },
    xenon:         { e: '💫', c: '#81ECEC', t: 7, fact: 'Xenon is a noble gas that forms real compounds (xenon difluoride, xenon tetroxide) — a shock when first discovered in 1962, since noble gases were supposed to react with nothing. Xenon ion propulsion powers deep-space probes (Dawn, Hayabusa2) by ionising and accelerating xenon atoms. General anaesthesia with xenon causes no side effects.' },
    // Period 6
    caesium:       { e: '🌕', c: '#FF6B6B', t: 8, fact: 'Caesium defines time itself: the SI second is exactly 9,192,631,770 vibrations of caesium-133 atoms — atomic clocks using this are accurate to 1 second in 300 million years. It\'s the most reactive alkali metal, liquid near room temperature, and explodes spectacularly on contact with water.' },
    barium:        { e: '🎇', c: '#FF9F43', t: 8, fact: 'The brilliant green in fireworks is barium chlorate. Barium sulfate (completely insoluble) is the "barium meal" in medical X-rays — you swallow it and it coats your digestive tract, absorbing X-rays so doctors can image your intestines without surgery. Barium was named after Greek "barys" (heavy).' },
    lanthanum:     { e: '✴️', c: '#FD79A8', t: 8, fact: 'Lanthanum starts the lanthanide series — 15 elements so chemically similar they were nearly impossible to separate before chromatography. Lanthanum oxide makes high-refractive-index glass for camera and telescope lenses. Lanthanum nickel hydride stores hydrogen at 3× the density of liquid hydrogen, making it a candidate for fuel cells.' },
    cerium:        { e: '🌸', c: '#FD79A8', t: 8, fact: 'Cerium is the most abundant rare earth element and so reactive it spontaneously ignites when scratched. The flint in your lighter isn\'t flint — it\'s "mischmetal" (~50% cerium). Cerium oxide powder is used to polish glass so fine it removes scratches from car windscreens. It\'s named after the dwarf planet Ceres.' },
    praseodymium:  { e: '💚', c: '#FD79A8', t: 8, fact: 'Praseodymium and neodymium were once thought to be a single element called "didymium" (Greek: twin). Its salts give glass a strong green-yellow colour — didymium glass is still used in welder\'s goggles and glassblower\'s spectacles to filter the orange sodium glare. The name means "green twin."' },
    neodymium:     { e: '🧲', c: '#FD79A8', t: 8, fact: 'The magnets in your headphones, hard drive, and every electric motor you\'ve touched are neodymium-iron-boron — the strongest permanent magnets known. A fridge-magnet-sized NdFeB magnet can hold over 600× its own weight. Without neodymium, wind turbines and electric cars simply wouldn\'t exist at practical sizes.' },
    promethium:    { e: '☢️', c: '#FD79A8', t: 8, fact: 'The only lanthanide with no stable isotopes — every single atom of promethium on Earth today was made in a nuclear reactor or particle accelerator. Named after Prometheus, who stole fire from the gods, because its discovery required "stealing" neutrons. It was the last rare earth element to be isolated (1945), completing the periodic table row.' },
    samarium:      { e: '🪝', c: '#FD79A8', t: 8, fact: 'Samarium-cobalt magnets were the first rare-earth permanent magnets (1960s) and remain superior to neodymium above 250°C — used in jet engines and spacecraft where heat disables NdFeB. Samarium-153 is a medical radioisotope injected to relieve bone pain in cancer patients, delivering localised radiation.' },
    europium:      { e: '💡', c: '#FD79A8', t: 8, fact: 'The red and blue phosphors in your TV and monitor are europium compounds — it produces the most vivid red fluorescence of any element. Euro banknotes contain invisible europium-based ink that glows red under UV, making them nearly impossible to counterfeit. It\'s named after Europe, naturally.' },
    gadolinium:    { e: '🏥', c: '#FD79A8', t: 8, fact: 'Gadolinium is what makes MRI scans so detailed: injecting gadolinium-based contrast agents brightens blood vessels and tumours on the scan. It\'s also the only metal that acts as a ferromagnet just below room temperature (Curie point: 20°C). Named after Johan Gadolin, the chemist who discovered the rare earth element family.' },
    terbium:       { e: '🌿', c: '#FD79A8', t: 8, fact: 'Terbium oxide is the green phosphor in compact fluorescent bulbs and LED lights — the green pixel on your screen is likely terbium. When alloys of terbium and iron are stretched or compressed, they flip magnetic — this "magnetostrictive" effect converts mechanical vibration to magnetic signals, used in sonar and vibration sensors.' },
    dysprosium:    { e: '🔋', c: '#FD79A8', t: 8, fact: 'Dysprosium\'s name means "hard to get" in Greek — and it lives up to it. Adding 1–6% dysprosium to neodymium magnets lets them work at higher temperatures without demagnetising — critical for EV motors. As electric vehicles proliferate, dysprosium demand has outstripped all projections.' },
    holmium:       { e: '🌀', c: '#FD79A8', t: 8, fact: 'Holmium has the highest magnetic moment of any stable element, making it essential in the ultra-powerful magnets of MRI machines and particle accelerators. Holmium lasers are used in surgery for kidney stone ablation and soft tissue cutting. Named after Holmia (Latin for Stockholm).' },
    erbium:        { e: '🔴', c: '#FD79A8', t: 8, fact: 'Erbium-doped fibre amplifiers (EDFAs) are the reason long-distance internet works: erbium atoms in glass fibre absorb and re-emit photons at exactly 1550 nm (the standard fibre-optic wavelength), boosting signals every 80 km without converting to electricity. Without erbium, transatlantic cables would need repeater stations every few kilometres.' },
    thulium:       { e: '🌊', c: '#FD79A8', t: 8, fact: 'Thulium is the rarest naturally occurring rare earth element. Its radioisotope Tm-170 powers portable X-ray machines used in remote locations where electricity isn\'t available. Named after "Thule," the ancient name for the distant north — possibly Scandinavia or Iceland. Thulium was discovered in 1879, but pure samples weren\'t obtained until 1911.' },
    ytterbium:     { e: '⚗️', c: '#FD79A8', t: 8, fact: 'The fourth element named after Ytterby, Sweden (along with yttrium, terbium, erbium). Ytterbium clocks are the current state of the art in atomic timekeeping — accurate to 1 second in 10 billion years, better than the universe\'s age. Ytterbium-doped fibre lasers are used for cutting metal in industrial manufacturing.' },
    lutetium:      { e: '🔬', c: '#FD79A8', t: 8, fact: 'Lutetium is the last lanthanide, the densest, and the hardest. Lutetium oxyorthosilicate (LSO) scintillates so fast it\'s the material of choice in PET scanners — when positrons from radioactive tracers annihilate electrons, LSO crystals flash light within nanoseconds, mapping tumour metabolism.' },
    hafnium:       { e: '⚙️', c: '#9098A4', t: 8, fact: 'Hafnium was the last naturally occurring element to be discovered (1923, 50 years after it was predicted). It nearly always occurs mixed with zirconium and is chemically almost identical — separating them is notoriously difficult. Hafnium control rods in nuclear submarines absorb neutrons brilliantly. Intel chips use hafnium oxide as a gate dielectric.' },
    tantalum:      { e: '🛡️', c: '#9098A4', t: 8, fact: 'Tantalum\'s biggest use is in capacitors — the tiny components in every smartphone, laptop, and hearing aid. It\'s completely corrosion-resistant and biocompatible, so it\'s used for surgical implants and bone repair. Named after Tantalus (unable to reach water) because it seemed to "absorb nothing" in early experiments.' },
    tungsten:      { e: '💡', c: '#9098A4', t: 8, fact: 'Tungsten has the highest melting point of any element (3422°C) and the lowest vapour pressure. This is why incandescent light bulb filaments were tungsten — it can glow white-hot without evaporating immediately. Tungsten carbide is nearly as hard as diamond and tips most drill bits and cutting tools. Density: 19.3 g/cm³ — same as gold.' },
    rhenium:       { e: '✈️', c: '#9098A4', t: 8, fact: 'Rhenium was the last naturally occurring element discovered (1925), so rare that global production is only ~50 tonnes per year. Single-crystal turbine blades in jet engines are 3% rhenium — they operate above 1700°C, hotter than their own melting point would suggest possible, because thermal barrier coatings protect them.' },
    osmium:        { e: '🪨', c: '#9098A4', t: 8, fact: 'Osmium is the densest naturally occurring element (22.59 g/cm³) — a golf-ball sized lump would weigh 1.2 kg. Its name comes from Greek "osme" (smell) because osmium tetroxide has a distinctive acrid odour — and is extremely toxic. Osmium alloys in fountain pen tips last for decades of writing.' },
    iridium:       { e: '☄️', c: '#9098A4', t: 8, fact: 'A thin layer of iridium-enriched clay marks the K-Pg boundary worldwide — the smoking gun for the asteroid that killed the dinosaurs. Iridium is rare on Earth because it sank into the core when the planet was molten; it\'s 10,000× more abundant in meteorites. The International Prototype Kilogram (the actual metal "kilo") was 90% platinum, 10% iridium.' },
    platinum:      { e: '💍', c: '#9098A4', t: 8, fact: 'Platinum is so catalytically active it can ignite hydrogen in air at room temperature. Your car\'s catalytic converter runs ~1000°C hot and oxidises hydrocarbons using platinum. Cisplatin — a platinum compound — is one of the most widely used cancer drugs, discovered accidentally when a platinum electrode in an experiment killed bacteria nearby.' },
    mercury:       { e: '🌡️', c: '#9098A4', t: 8, fact: 'Mercury is the only metal liquid at room temperature (melting point: −38.8°C). It was named after the fleet Roman god because it moves so fluidly. Mercury poisoning drove 19th-century hatters mad — felt hats were cured with mercury nitrate. Its density (13.5 g/cm³) is why mercury thermometers have such narrow columns.' },
    thallium:      { e: '☠️', c: '#74B9FF', t: 8, fact: 'Thallium poisoning is nearly undetectable, tasteless, and mimics other illnesses — hence its use as a favourite murder weapon, dubbed "the poisoner\'s poison." Agatha Christie wrote about it. The antidote is Prussian blue dye, which binds thallium in the gut. Thallium is also used in infrared lenses and green pyrotechnic flares.' },
    lead:          { e: '⚓', c: '#74B9FF', t: 8, fact: 'Lead pipes (Latin: plumbum, giving us "plumbing") supplied water to Roman cities. Lead poisoning may have contributed to Roman imperial dysfunction — the ruling class drank wine sweetened with lead acetate. Leaded petrol, phased out 1975–2021, increased global blood lead levels measurably. Lead is still in your car battery.' },
    bismuth:       { e: '🌈', c: '#74B9FF', t: 8, fact: 'Bismuth forms spectacular iridescent hopper crystals — geometric staircases with rainbow interference colours from a thin oxide layer. It\'s the heaviest stable element (technically, but its half-life is 10¹⁹ years — older than the universe). Bismuth subsalicylate (Pepto-Bismol) calms stomach upset.' },
    polonium:      { e: '☢️', c: '#74B9FF', t: 8, fact: 'Named by Marie Curie after her homeland Poland (then under occupation). Po-210 is 250,000× more toxic than hydrogen cyanide by mass — Alexander Litvinenko was assassinated with it in 2006. One gram releases 140 kW of thermal power. At the tip of nuclear weapons triggers, tiny amounts of polonium initiate the fission chain reaction.' },
    astatine:      { e: '⚫', c: '#FDCB6E', t: 8, fact: 'Astatine is the rarest naturally occurring element — the entire Earth contains an estimated 25 grams at any moment, constantly replenished by radioactive decay. Its longest-lived isotope (At-210) has a half-life of just 8.1 hours. Almost nothing is known about its chemistry because making enough to study requires a particle accelerator.' },
    radon:         { e: '🌫️', c: '#81ECEC', t: 8, fact: 'Radon is the leading cause of lung cancer after smoking — it seeps from uranium-bearing granite into basements and accumulates in poorly ventilated homes. Being a noble gas, it\'s chemically inert but radioactive, decaying to polonium. It\'s the heaviest naturally occurring gas and colourless — you can\'t see, smell, or taste the risk.' },
    // Period 7
    francium:      { e: '⚡', c: '#FF6B6B', t: 8, fact: 'Francium is so unstable that the entire Earth contains fewer than 30 grams at any moment, constantly replenishing as uranium decays. It\'s the second rarest naturally occurring element and the most unstable of the first 103. Its properties are mostly theoretical; no one has ever made enough to see with the naked eye.' },
    radium:        { e: '💚', c: '#FF9F43', t: 8, fact: 'Marie Curie discovered radium in 1898 and won two Nobel Prizes — the only person to win in two different sciences. Radium glows faintly blue from radioluminescence. "Radium girls" in the 1920s painted watch dials with radium-based paint and were told to lick their brushes — many died of radiation-induced cancers, their legal fight transforming worker safety law.' },
    actinium:      { e: '✨', c: '#E17055', t: 8, fact: 'Actinium glows blue in the dark from Cherenkov radiation — excited molecules re-emitting ionisation energy as light. It starts the actinide series and is 150× more radioactive than radium. Actinium-225 is being developed as a targeted alpha-particle cancer therapy, delivering lethal radiation directly to tumour cells.' },
    thorium:       { e: '🌑', c: '#E17055', t: 8, fact: 'Thorium is 4× more abundant than uranium and could theoretically fuel a "thorium reactor" — safer, harder to weaponise, and producing far less long-lived waste. The idea was seriously developed in the 1960s (molten salt reactor at Oak Ridge) but abandoned for uranium because weapons programs needed uranium. The concept has never left.' },
    protactinium:  { e: '🔬', c: '#E17055', t: 8, fact: 'Protactinium is intensely radioactive, extraordinarily rare (about 125 kg exists in Earth\'s crust), and fantastically expensive — about $280,000 per gram. It\'s mostly of academic interest; Pa-231 decays to actinium and is used as a geological chronometer for ocean sediment dating, marking ice ages.' },
    uranium:       { e: '☢️', c: '#E17055', t: 8, fact: 'Uranium releases more energy per atom than any other natural fuel: 1 kg of U-235 contains as much energy as ~3,000 tonnes of coal. Natural uranium is 99.3% U-238 and only 0.7% fissile U-235 — enrichment separates them. Every nuclear power plant and every nuclear weapon depends on that 0.7%.' },
    neptunium:     { e: '🔵', c: '#E17055', t: 8, fact: 'Neptunium-237 has a half-life of 2.1 million years — it accumulates in spent nuclear fuel and is one of the longest-lived waste products. It\'s the first transuranium element discovered (1940), made by bombarding uranium with neutrons. Like its namesake Neptune, it was discovered after uranium (Uranus) and before plutonium (Pluto).' },
    plutonium:     { e: '💣', c: '#E17055', t: 8, fact: 'Plutonium is warm to the touch from its radioactive decay — a kilogram of Pu-238 generates ~570W of steady heat. Space probes that explore the outer solar system (Voyager, Cassini, New Horizons) are powered by plutonium-238 radioisotope thermoelectric generators. The "Fat Man" bomb that destroyed Nagasaki used just 6.2 kg of Pu-239.' },
    americium:     { e: '🔴', c: '#E17055', t: 8, fact: 'Your smoke detector almost certainly contains ~37,000 atoms of americium-241, emitting alpha particles that ionise air. When smoke enters, it disrupts the current — triggering the alarm. A few hundred micrograms of Am-241 in 500 million smoke detectors worldwide has saved countless lives since the 1960s.' },
    curium:        { e: '🧪', c: '#E17055', t: 8, fact: 'Curium was named after Marie and Pierre Curie — the only element honouring a couple together. It glows a faint blue-purple from its intense radioactivity. Cm-244 was used as an alpha source in the alpha particle X-ray spectrometer on Mars rovers (Sojourner, Spirit, Opportunity), analysing rock composition on Mars.' },
    berkelium:     { e: '⚗️', c: '#E17055', t: 8, fact: 'Berkelium was synthesised at UC Berkeley in 1949 and named after the city. It only exists in microgram quantities, made one atom at a time in nuclear reactors. Berkelium-249 was used as a target to create element 117 (tennessine) — 22 mg of Bk-249 (incredibly hard to accumulate) were needed for those experiments.' },
    californium:   { e: '🌟', c: '#E17055', t: 8, fact: 'Californium-252 is one of the few nuclides that spontaneously undergoes fission, releasing ~2.3 × 10¹² neutrons per second per gram. A microgram (~1/1,000,000 of a gram) is enough to start a nuclear reactor. It\'s used to find gold and silver ores, treat certain tumours, and measure soil moisture — a gram would cost ~$27 million.' },
    einsteinium:   { e: '🧠', c: '#E17055', t: 8, fact: 'Einsteinium was discovered in the fallout from the first hydrogen bomb test (Ivy Mike, 1952) — highly classified for years. It was named after Einstein, who died in 1955 shortly after its discovery. Only nanogram quantities can be produced. In 2021, scientists finally measured einsteinium\'s properties for the first time using just 250 nanograms.' },
    fermium:       { e: '⚛️', c: '#E17055', t: 8, fact: 'Fermium (named after Enrico Fermi) was also found in nuclear bomb fallout in 1952. It\'s the heaviest element that can be produced in significant quantities in nuclear reactors — beyond fermium, you need particle accelerators. Above fermium (Z=100), no element can be made in sufficient quantity to be weighed on a scale.' },
    mendelevium:   { e: '📖', c: '#E17055', t: 8, fact: 'Named after Dmitri Mendeleev, the creator of the periodic table, who never lived to see elements named after him. Mendelevium was synthesised in 1955 by bombarding einsteinium with alpha particles — the product was identified atom by atom, with only 17 atoms in the first experiment. It\'s the first element created one atom at a time.' },
    nobelium:      { e: '🏆', c: '#E17055', t: 8, fact: 'Named after Alfred Nobel, despite the fact that nobelium was disputed for years — competing groups in Sweden, the US, and USSR each claimed discovery. IUPAC didn\'t officially confirm the name until 1994. Nobelium has a half-life of just 58 minutes for its most stable isotope — long enough to study, barely.' },
    lawrencium:    { e: '🔭', c: '#E17055', t: 8, fact: 'Lawrencium completes the actinide series and was named after Ernest Lawrence, inventor of the cyclotron particle accelerator. Its chemistry is largely unknown — a few atoms at a time, vanishing in seconds or minutes. It\'s predicted to have an anomalous electron configuration that breaks the pattern of all previous elements.' },
    // Superheavy (Z = 104–118)
    rutherfordium: { e: '⚛️', c: '#9098A4', t: 8, fact: 'Named after Ernest Rutherford, who discovered the atomic nucleus. Rutherfordium has a half-life of about 1.3 hours — long enough to study chemically. Experiments show it behaves like hafnium (directly above it), confirming that relativistic effects don\'t dramatically change its chemistry at this element number.' },
    dubnium:       { e: '🔩', c: '#9098A4', t: 8, fact: 'Named after Dubna, Russia (home of JINR nuclear institute) after a Cold War naming dispute between Soviet and American groups who both claimed its synthesis. Dubnium atoms exist for about 28 hours — plenty of time to study individual atoms but not enough to accumulate grams. Only a few hundred atoms have ever been made.' },
    seaborgium:    { e: '🧲', c: '#9098A4', t: 8, fact: 'Glenn Seaborg is the only living person ever to have an element named after them — he was alive when seaborgium was named in 1994. He also co-discovered plutonium and 9 other transuranium elements. His redesign of the periodic table (adding the actinide row below lanthanides) is the layout we still use today.' },
    bohrium:       { e: '🌀', c: '#9098A4', t: 8, fact: 'Named after Niels Bohr, the quantum physicist who proposed the model of electrons in fixed energy levels. Bohrium atoms have a half-life of about 61 seconds. Experiments confirmed it forms bohrium oxychloride — just like the lighter elements in its group (manganese, rhenium) — showing the periodic table still predicts chemistry this far down.' },
    hassium:       { e: '⚗️', c: '#9098A4', t: 8, fact: 'Named after Hesse (Hassias in Latin), the German state where GSI research centre is located. Hassium-269 has a half-life of 16 seconds. Chemical experiments confirm it oxidises to HsO₄ — haassium tetroxide — which evaporates like OsO₄ directly above it, exactly as the periodic table predicts, even at element 108.' },
    meitnerium:    { e: '🔬', c: '#9098A4', t: 8, fact: 'Named after Lise Meitner, who co-discovered fission with Otto Hahn — but Hahn alone received the Nobel Prize, one of the great injustices in science history. Meitnerium atoms vanish in milliseconds. Element 109 is almost entirely unstudied because its half-life is too short to measure chemical properties.' },
    darmstadtium:  { e: '💥', c: '#9098A4', t: 8, fact: 'Named after Darmstadt, Germany, home of GSI where it was first synthesised in 1994. Darmstadtium has a half-life of just 11 seconds. Its position on the periodic table (directly below platinum) suggests it should behave like platinum, but confirming this would require making tens of thousands of atoms — still beyond current capability.' },
    roentgenium:   { e: '☢️', c: '#9098A4', t: 8, fact: 'Named after Wilhelm Röntgen, discoverer of X-rays, who received the very first Nobel Prize in Physics (1901). Roentgenium atoms decay in 26 seconds. Relativistic quantum theory predicts its chemistry should be similar to gold (directly above it), but the relativistic effects at Z=111 are so large they may completely alter its behaviour.' },
    copernicium:   { e: '🌍', c: '#9098A4', t: 8, fact: 'Named after Nicolaus Copernicus, who first placed the Sun at the centre of the solar system. Copernicium is predicted to be a gas at room temperature — an astonishing property for a metal. Its electrons move so fast (relativistically) that they contract inward, disrupting the normal metallic bonding. If true, it would be the first gaseous metal.' },
    nihonium:      { e: '🗾', c: '#74B9FF', t: 8, fact: 'Nihonium (Nh-113) was the first element discovered in Asia — synthesised at RIKEN, Japan in 2004 after 9 years of failed attempts. Japan spent a decade creating 3 confirmed atoms. Named from "Nihon" (Japanese name for Japan). Its creators celebrated with a single night of champagne before returning to the accelerator.' },
    flerovium:     { e: '💨', c: '#74B9FF', t: 8, fact: 'Named after the Flerov Laboratory of Nuclear Reactions in Dubna. Flerovium (Fl-114) is predicted to be a noble gas-like element due to extreme relativistic effects — its electrons are so contracted they barely participate in bonding. It may not even adhere to gold surfaces, which is the standard test for heavy element chemistry.' },
    moscovium:     { e: '🏙️', c: '#74B9FF', t: 8, fact: 'Moscovium (element 115) caused a stir in 2003 when a Russian scientist claimed it as "Element 115" and a gravity drive propellant — later thoroughly debunked. The real moscovium was formally synthesised in 2003 by JINR and confirmed by multiple labs. Named after Moscow Oblast, home of the JINR nuclear research facility.' },
    livermorium:   { e: '🔬', c: '#74B9FF', t: 8, fact: 'Named after Lawrence Livermore National Laboratory in California. Livermorium atoms are created by bombarding curium-248 with calcium-48 ions. Half-life: ~60 milliseconds. Its chemistry is completely unknown — not a single chemical experiment has been performed. Everything we know about it comes from counting decay products.' },
    tennessine:    { e: '🎸', c: '#FDCB6E', t: 8, fact: 'Named after Tennessee, home to Oak Ridge National Laboratory, Vanderbilt University, and the University of Tennessee — a nod to three institutions that contributed. Tennessine (element 117) was confirmed in 2010. To make it, 22 milligrams of Bk-249 — itself incredibly hard to produce — were transported from Tennessee to Russia. A logistical feat as extraordinary as the science.' },
    oganesson:     { e: '🌌', c: '#81ECEC', t: 8, fact: 'The heaviest element ever made — element 118, at the very bottom-right of the periodic table. Named after Yuri Oganessian, the nuclear physicist who pioneered superheavy element synthesis. Only 5 atoms have ever been detected, each lasting ~1 millisecond. Relativistic theory predicts oganesson\'s electrons are so contracted it might not behave like a noble gas at all.' },

    // ── Metal fluorides ───────────────────────────────────────────────────
    'lithium-fluoride':    { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Lithium Fluoride (LiF)', fact: 'LiF has the lowest refractive index (1.39) and widest UV–IR transmission of any crystal. Used in nuclear molten-salt reactors and synchrotron X-ray optics.' },
    'sodium-fluoride':     { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Sodium Fluoride (NaF)', fact: 'NaF at 1 ppm in drinking water reduces dental caries by 50–70%. Fluoride replaces hydroxide in tooth enamel hydroxyapatite, making it ~100× more acid-resistant.' },
    'potassium-fluoride':  { e: '⚪', c: '#FF6B6B', t: 5, displayName: 'Potassium Fluoride (KF)', fact: 'KF is intensely corrosive — more dangerous than many strong acids because fluoride ions penetrate skin silently and then attack bones by chelating calcium. It\'s used as a flux in soldering and as a source of fluoride for organic synthesis. Potassium and fluorine are individually explosive and acrid; combined, they form a tame white powder.' },
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
    'magnesium-nitride':   { e: '⚪', c: '#FF9F43', t: 5, displayName: 'Magnesium Nitride (Mg₃N₂)', fact: 'Mg₃N₂ forms spontaneously when magnesium burns in air — the yellow-white residue around the bright white MgO. Drop it in water and it reacts vigorously to produce magnesium hydroxide and ammonia (that sharp smell). It\'s used industrially as a catalyst and as a precursor to high-purity magnesium compounds.' },

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
  const STARTERS = [...PERIODIC_TABLE_KEYS];

  window.ALCHEMIA_DB = {
    META, RECIPES, LOOKUP, STARTERS, PERIODIC_TABLE_KEYS,
    combine, displayName, prettify,
    totalRecipes: RECIPES.length,
    totalElements: Object.keys(META).length
  };
})();
