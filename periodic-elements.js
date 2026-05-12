// ALCHEMIA — Periodic Table element mock data
// All 118 elements with emoji, color, tier, symbol, atomic number, weight, category, and state.

(function () {
  'use strict';

  // Category color palette
  const CAT_COLOR = {
    'alkali metal':           '#FF6B6B',
    'alkaline earth metal':   '#FF9F43',
    'transition metal':       '#9098A4',
    'post-transition metal':  '#74B9FF',
    'metalloid':              '#A29BFE',
    'nonmetal':               '#55EFC4',
    'halogen':                '#FDCB6E',
    'noble gas':              '#81ECEC',
    'lanthanide':             '#FD79A8',
    'actinide':               '#E17055',
  };

  const ELEMENTS = [
    // Period 1
    { z: 1,   sym: 'H',  name: 'Hydrogen',      cat: 'nonmetal',              state: 'gas',    weight: 1.008,    e: '💨', c: CAT_COLOR['nonmetal'],              t: 1 },
    { z: 2,   sym: 'He', name: 'Helium',         cat: 'noble gas',             state: 'gas',    weight: 4.003,    e: '🎈', c: CAT_COLOR['noble gas'],             t: 1 },

    // Period 2
    { z: 3,   sym: 'Li', name: 'Lithium',        cat: 'alkali metal',          state: 'solid',  weight: 6.941,    e: '🔋', c: CAT_COLOR['alkali metal'],          t: 2 },
    { z: 4,   sym: 'Be', name: 'Beryllium',      cat: 'alkaline earth metal',  state: 'solid',  weight: 9.012,    e: '⚪', c: CAT_COLOR['alkaline earth metal'],  t: 2 },
    { z: 5,   sym: 'B',  name: 'Boron',          cat: 'metalloid',             state: 'solid',  weight: 10.81,    e: '🪨', c: CAT_COLOR['metalloid'],             t: 2 },
    { z: 6,   sym: 'C',  name: 'Carbon',         cat: 'nonmetal',              state: 'solid',  weight: 12.011,   e: '💎', c: CAT_COLOR['nonmetal'],              t: 2 },
    { z: 7,   sym: 'N',  name: 'Nitrogen',       cat: 'nonmetal',              state: 'gas',    weight: 14.007,   e: '🌬️', c: CAT_COLOR['nonmetal'],              t: 2 },
    { z: 8,   sym: 'O',  name: 'Oxygen',         cat: 'nonmetal',              state: 'gas',    weight: 15.999,   e: '🫧', c: CAT_COLOR['nonmetal'],              t: 2 },
    { z: 9,   sym: 'F',  name: 'Fluorine',       cat: 'halogen',               state: 'gas',    weight: 18.998,   e: '🟡', c: CAT_COLOR['halogen'],               t: 2 },
    { z: 10,  sym: 'Ne', name: 'Neon',           cat: 'noble gas',             state: 'gas',    weight: 20.18,    e: '💡', c: CAT_COLOR['noble gas'],             t: 2 },

    // Period 3
    { z: 11,  sym: 'Na', name: 'Sodium',         cat: 'alkali metal',          state: 'solid',  weight: 22.99,    e: '🧂', c: CAT_COLOR['alkali metal'],          t: 3 },
    { z: 12,  sym: 'Mg', name: 'Magnesium',      cat: 'alkaline earth metal',  state: 'solid',  weight: 24.305,   e: '✨', c: CAT_COLOR['alkaline earth metal'],  t: 3 },
    { z: 13,  sym: 'Al', name: 'Aluminum',       cat: 'post-transition metal', state: 'solid',  weight: 26.982,   e: '🥤', c: CAT_COLOR['post-transition metal'], t: 3 },
    { z: 14,  sym: 'Si', name: 'Silicon',        cat: 'metalloid',             state: 'solid',  weight: 28.085,   e: '💻', c: CAT_COLOR['metalloid'],             t: 3 },
    { z: 15,  sym: 'P',  name: 'Phosphorus',     cat: 'nonmetal',              state: 'solid',  weight: 30.974,   e: '🔴', c: CAT_COLOR['nonmetal'],              t: 3 },
    { z: 16,  sym: 'S',  name: 'Sulfur',         cat: 'nonmetal',              state: 'solid',  weight: 32.06,    e: '🟨', c: CAT_COLOR['nonmetal'],              t: 3 },
    { z: 17,  sym: 'Cl', name: 'Chlorine',       cat: 'halogen',               state: 'gas',    weight: 35.45,    e: '🟩', c: CAT_COLOR['halogen'],               t: 3 },
    { z: 18,  sym: 'Ar', name: 'Argon',          cat: 'noble gas',             state: 'gas',    weight: 39.948,   e: '🫙', c: CAT_COLOR['noble gas'],             t: 3 },

    // Period 4
    { z: 19,  sym: 'K',  name: 'Potassium',      cat: 'alkali metal',          state: 'solid',  weight: 39.098,   e: '🍌', c: CAT_COLOR['alkali metal'],          t: 4 },
    { z: 20,  sym: 'Ca', name: 'Calcium',        cat: 'alkaline earth metal',  state: 'solid',  weight: 40.078,   e: '🦴', c: CAT_COLOR['alkaline earth metal'],  t: 4 },
    { z: 21,  sym: 'Sc', name: 'Scandium',       cat: 'transition metal',      state: 'solid',  weight: 44.956,   e: '⚙️', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 22,  sym: 'Ti', name: 'Titanium',       cat: 'transition metal',      state: 'solid',  weight: 47.867,   e: '🚀', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 23,  sym: 'V',  name: 'Vanadium',       cat: 'transition metal',      state: 'solid',  weight: 50.942,   e: '🔩', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 24,  sym: 'Cr', name: 'Chromium',       cat: 'transition metal',      state: 'solid',  weight: 51.996,   e: '🪞', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 25,  sym: 'Mn', name: 'Manganese',      cat: 'transition metal',      state: 'solid',  weight: 54.938,   e: '🔧', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 26,  sym: 'Fe', name: 'Iron',           cat: 'transition metal',      state: 'solid',  weight: 55.845,   e: '⚔️', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 27,  sym: 'Co', name: 'Cobalt',         cat: 'transition metal',      state: 'solid',  weight: 58.933,   e: '🔵', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 28,  sym: 'Ni', name: 'Nickel',         cat: 'transition metal',      state: 'solid',  weight: 58.693,   e: '🪙', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 29,  sym: 'Cu', name: 'Copper',         cat: 'transition metal',      state: 'solid',  weight: 63.546,   e: '🟠', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 30,  sym: 'Zn', name: 'Zinc',           cat: 'transition metal',      state: 'solid',  weight: 65.38,    e: '🪣', c: CAT_COLOR['transition metal'],      t: 4 },
    { z: 31,  sym: 'Ga', name: 'Gallium',        cat: 'post-transition metal', state: 'solid',  weight: 69.723,   e: '🌡️', c: CAT_COLOR['post-transition metal'], t: 4 },
    { z: 32,  sym: 'Ge', name: 'Germanium',      cat: 'metalloid',             state: 'solid',  weight: 72.630,   e: '🖥️', c: CAT_COLOR['metalloid'],             t: 4 },
    { z: 33,  sym: 'As', name: 'Arsenic',        cat: 'metalloid',             state: 'solid',  weight: 74.922,   e: '☠️', c: CAT_COLOR['metalloid'],             t: 4 },
    { z: 34,  sym: 'Se', name: 'Selenium',       cat: 'nonmetal',              state: 'solid',  weight: 78.971,   e: '🔆', c: CAT_COLOR['nonmetal'],              t: 4 },
    { z: 35,  sym: 'Br', name: 'Bromine',        cat: 'halogen',               state: 'liquid', weight: 79.904,   e: '🟤', c: CAT_COLOR['halogen'],               t: 4 },
    { z: 36,  sym: 'Kr', name: 'Krypton',        cat: 'noble gas',             state: 'gas',    weight: 83.798,   e: '🦸', c: CAT_COLOR['noble gas'],             t: 4 },

    // Period 5
    { z: 37,  sym: 'Rb', name: 'Rubidium',       cat: 'alkali metal',          state: 'solid',  weight: 85.468,   e: '💜', c: CAT_COLOR['alkali metal'],          t: 5 },
    { z: 38,  sym: 'Sr', name: 'Strontium',      cat: 'alkaline earth metal',  state: 'solid',  weight: 87.62,    e: '🎆', c: CAT_COLOR['alkaline earth metal'],  t: 5 },
    { z: 39,  sym: 'Y',  name: 'Yttrium',        cat: 'transition metal',      state: 'solid',  weight: 88.906,   e: '🔬', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 40,  sym: 'Zr', name: 'Zirconium',      cat: 'transition metal',      state: 'solid',  weight: 91.224,   e: '💍', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 41,  sym: 'Nb', name: 'Niobium',        cat: 'transition metal',      state: 'solid',  weight: 92.906,   e: '🔭', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 42,  sym: 'Mo', name: 'Molybdenum',     cat: 'transition metal',      state: 'solid',  weight: 95.95,    e: '⚙️', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 43,  sym: 'Tc', name: 'Technetium',     cat: 'transition metal',      state: 'solid',  weight: 98,       e: '☢️', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 44,  sym: 'Ru', name: 'Ruthenium',      cat: 'transition metal',      state: 'solid',  weight: 101.07,   e: '🪩', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 45,  sym: 'Rh', name: 'Rhodium',        cat: 'transition metal',      state: 'solid',  weight: 102.906,  e: '🏅', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 46,  sym: 'Pd', name: 'Palladium',      cat: 'transition metal',      state: 'solid',  weight: 106.42,   e: '🪙', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 47,  sym: 'Ag', name: 'Silver',         cat: 'transition metal',      state: 'solid',  weight: 107.868,  e: '🥈', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 48,  sym: 'Cd', name: 'Cadmium',        cat: 'transition metal',      state: 'solid',  weight: 112.414,  e: '🔋', c: CAT_COLOR['transition metal'],      t: 5 },
    { z: 49,  sym: 'In', name: 'Indium',         cat: 'post-transition metal', state: 'solid',  weight: 114.818,  e: '🔷', c: CAT_COLOR['post-transition metal'], t: 5 },
    { z: 50,  sym: 'Sn', name: 'Tin',            cat: 'post-transition metal', state: 'solid',  weight: 118.710,  e: '🥫', c: CAT_COLOR['post-transition metal'], t: 5 },
    { z: 51,  sym: 'Sb', name: 'Antimony',       cat: 'metalloid',             state: 'solid',  weight: 121.760,  e: '🔮', c: CAT_COLOR['metalloid'],             t: 5 },
    { z: 52,  sym: 'Te', name: 'Tellurium',      cat: 'metalloid',             state: 'solid',  weight: 127.60,   e: '🌑', c: CAT_COLOR['metalloid'],             t: 5 },
    { z: 53,  sym: 'I',  name: 'Iodine',         cat: 'halogen',               state: 'solid',  weight: 126.904,  e: '🟣', c: CAT_COLOR['halogen'],               t: 5 },
    { z: 54,  sym: 'Xe', name: 'Xenon',          cat: 'noble gas',             state: 'gas',    weight: 131.293,  e: '💫', c: CAT_COLOR['noble gas'],             t: 5 },

    // Period 6
    { z: 55,  sym: 'Cs', name: 'Caesium',        cat: 'alkali metal',          state: 'solid',  weight: 132.905,  e: '🌕', c: CAT_COLOR['alkali metal'],          t: 6 },
    { z: 56,  sym: 'Ba', name: 'Barium',         cat: 'alkaline earth metal',  state: 'solid',  weight: 137.327,  e: '🎇', c: CAT_COLOR['alkaline earth metal'],  t: 6 },
    // Lanthanides
    { z: 57,  sym: 'La', name: 'Lanthanum',      cat: 'lanthanide',            state: 'solid',  weight: 138.905,  e: '✴️', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 58,  sym: 'Ce', name: 'Cerium',         cat: 'lanthanide',            state: 'solid',  weight: 140.116,  e: '🌸', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 59,  sym: 'Pr', name: 'Praseodymium',   cat: 'lanthanide',            state: 'solid',  weight: 140.908,  e: '💚', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 60,  sym: 'Nd', name: 'Neodymium',      cat: 'lanthanide',            state: 'solid',  weight: 144.242,  e: '🧲', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 61,  sym: 'Pm', name: 'Promethium',     cat: 'lanthanide',            state: 'solid',  weight: 145,      e: '☢️', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 62,  sym: 'Sm', name: 'Samarium',       cat: 'lanthanide',            state: 'solid',  weight: 150.36,   e: '🪝', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 63,  sym: 'Eu', name: 'Europium',       cat: 'lanthanide',            state: 'solid',  weight: 151.964,  e: '🇪🇺', c: CAT_COLOR['lanthanide'],           t: 6 },
    { z: 64,  sym: 'Gd', name: 'Gadolinium',     cat: 'lanthanide',            state: 'solid',  weight: 157.25,   e: '🏥', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 65,  sym: 'Tb', name: 'Terbium',        cat: 'lanthanide',            state: 'solid',  weight: 158.925,  e: '💡', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 66,  sym: 'Dy', name: 'Dysprosium',     cat: 'lanthanide',            state: 'solid',  weight: 162.500,  e: '🔋', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 67,  sym: 'Ho', name: 'Holmium',        cat: 'lanthanide',            state: 'solid',  weight: 164.930,  e: '🌀', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 68,  sym: 'Er', name: 'Erbium',         cat: 'lanthanide',            state: 'solid',  weight: 167.259,  e: '🔴', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 69,  sym: 'Tm', name: 'Thulium',        cat: 'lanthanide',            state: 'solid',  weight: 168.934,  e: '🌊', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 70,  sym: 'Yb', name: 'Ytterbium',      cat: 'lanthanide',            state: 'solid',  weight: 173.054,  e: '⚗️', c: CAT_COLOR['lanthanide'],            t: 6 },
    { z: 71,  sym: 'Lu', name: 'Lutetium',       cat: 'lanthanide',            state: 'solid',  weight: 174.967,  e: '🔬', c: CAT_COLOR['lanthanide'],            t: 6 },
    // Back to Period 6
    { z: 72,  sym: 'Hf', name: 'Hafnium',        cat: 'transition metal',      state: 'solid',  weight: 178.49,   e: '⚙️', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 73,  sym: 'Ta', name: 'Tantalum',       cat: 'transition metal',      state: 'solid',  weight: 180.948,  e: '🛡️', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 74,  sym: 'W',  name: 'Tungsten',       cat: 'transition metal',      state: 'solid',  weight: 183.84,   e: '💡', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 75,  sym: 'Re', name: 'Rhenium',        cat: 'transition metal',      state: 'solid',  weight: 186.207,  e: '✈️', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 76,  sym: 'Os', name: 'Osmium',         cat: 'transition metal',      state: 'solid',  weight: 190.23,   e: '🪨', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 77,  sym: 'Ir', name: 'Iridium',        cat: 'transition metal',      state: 'solid',  weight: 192.217,  e: '☄️', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 78,  sym: 'Pt', name: 'Platinum',       cat: 'transition metal',      state: 'solid',  weight: 195.084,  e: '💍', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 79,  sym: 'Au', name: 'Gold',           cat: 'transition metal',      state: 'solid',  weight: 196.967,  e: '🥇', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 80,  sym: 'Hg', name: 'Mercury',        cat: 'transition metal',      state: 'liquid', weight: 200.592,  e: '🌡️', c: CAT_COLOR['transition metal'],      t: 6 },
    { z: 81,  sym: 'Tl', name: 'Thallium',       cat: 'post-transition metal', state: 'solid',  weight: 204.38,   e: '☠️', c: CAT_COLOR['post-transition metal'], t: 6 },
    { z: 82,  sym: 'Pb', name: 'Lead',           cat: 'post-transition metal', state: 'solid',  weight: 207.2,    e: '⚓', c: CAT_COLOR['post-transition metal'], t: 6 },
    { z: 83,  sym: 'Bi', name: 'Bismuth',        cat: 'post-transition metal', state: 'solid',  weight: 208.980,  e: '🌈', c: CAT_COLOR['post-transition metal'], t: 6 },
    { z: 84,  sym: 'Po', name: 'Polonium',       cat: 'post-transition metal', state: 'solid',  weight: 209,      e: '☢️', c: CAT_COLOR['post-transition metal'], t: 6 },
    { z: 85,  sym: 'At', name: 'Astatine',       cat: 'halogen',               state: 'solid',  weight: 210,      e: '⚫', c: CAT_COLOR['halogen'],               t: 6 },
    { z: 86,  sym: 'Rn', name: 'Radon',          cat: 'noble gas',             state: 'gas',    weight: 222,      e: '🌫️', c: CAT_COLOR['noble gas'],             t: 6 },

    // Period 7
    { z: 87,  sym: 'Fr', name: 'Francium',       cat: 'alkali metal',          state: 'solid',  weight: 223,      e: '⚡', c: CAT_COLOR['alkali metal'],          t: 7 },
    { z: 88,  sym: 'Ra', name: 'Radium',         cat: 'alkaline earth metal',  state: 'solid',  weight: 226,      e: '💚', c: CAT_COLOR['alkaline earth metal'],  t: 7 },
    // Actinides
    { z: 89,  sym: 'Ac', name: 'Actinium',       cat: 'actinide',              state: 'solid',  weight: 227,      e: '✨', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 90,  sym: 'Th', name: 'Thorium',        cat: 'actinide',              state: 'solid',  weight: 232.038,  e: '🌑', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 91,  sym: 'Pa', name: 'Protactinium',   cat: 'actinide',              state: 'solid',  weight: 231.036,  e: '🔬', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 92,  sym: 'U',  name: 'Uranium',        cat: 'actinide',              state: 'solid',  weight: 238.029,  e: '☢️', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 93,  sym: 'Np', name: 'Neptunium',      cat: 'actinide',              state: 'solid',  weight: 237,      e: '🔵', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 94,  sym: 'Pu', name: 'Plutonium',      cat: 'actinide',              state: 'solid',  weight: 244,      e: '💣', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 95,  sym: 'Am', name: 'Americium',      cat: 'actinide',              state: 'solid',  weight: 243,      e: '🔴', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 96,  sym: 'Cm', name: 'Curium',         cat: 'actinide',              state: 'solid',  weight: 247,      e: '🧪', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 97,  sym: 'Bk', name: 'Berkelium',      cat: 'actinide',              state: 'solid',  weight: 247,      e: '⚗️', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 98,  sym: 'Cf', name: 'Californium',    cat: 'actinide',              state: 'solid',  weight: 251,      e: '🌟', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 99,  sym: 'Es', name: 'Einsteinium',    cat: 'actinide',              state: 'solid',  weight: 252,      e: '🧠', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 100, sym: 'Fm', name: 'Fermium',        cat: 'actinide',              state: 'solid',  weight: 257,      e: '⚛️', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 101, sym: 'Md', name: 'Mendelevium',    cat: 'actinide',              state: 'solid',  weight: 258,      e: '📖', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 102, sym: 'No', name: 'Nobelium',       cat: 'actinide',              state: 'solid',  weight: 259,      e: '🏆', c: CAT_COLOR['actinide'],              t: 7 },
    { z: 103, sym: 'Lr', name: 'Lawrencium',     cat: 'actinide',              state: 'solid',  weight: 266,      e: '🔭', c: CAT_COLOR['actinide'],              t: 7 },
    // Back to Period 7
    { z: 104, sym: 'Rf', name: 'Rutherfordium',  cat: 'transition metal',      state: 'solid',  weight: 267,      e: '⚛️', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 105, sym: 'Db', name: 'Dubnium',        cat: 'transition metal',      state: 'solid',  weight: 268,      e: '🔩', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 106, sym: 'Sg', name: 'Seaborgium',     cat: 'transition metal',      state: 'solid',  weight: 269,      e: '🧲', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 107, sym: 'Bh', name: 'Bohrium',        cat: 'transition metal',      state: 'solid',  weight: 270,      e: '🌀', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 108, sym: 'Hs', name: 'Hassium',        cat: 'transition metal',      state: 'solid',  weight: 277,      e: '⚗️', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 109, sym: 'Mt', name: 'Meitnerium',     cat: 'transition metal',      state: 'solid',  weight: 278,      e: '🔬', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 110, sym: 'Ds', name: 'Darmstadtium',   cat: 'transition metal',      state: 'solid',  weight: 281,      e: '💥', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 111, sym: 'Rg', name: 'Roentgenium',    cat: 'transition metal',      state: 'solid',  weight: 282,      e: '☢️', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 112, sym: 'Cn', name: 'Copernicium',    cat: 'transition metal',      state: 'gas',    weight: 285,      e: '🌍', c: CAT_COLOR['transition metal'],      t: 7 },
    { z: 113, sym: 'Nh', name: 'Nihonium',       cat: 'post-transition metal', state: 'solid',  weight: 286,      e: '🇯🇵', c: CAT_COLOR['post-transition metal'], t: 7 },
    { z: 114, sym: 'Fl', name: 'Flerovium',      cat: 'post-transition metal', state: 'gas',    weight: 289,      e: '💨', c: CAT_COLOR['post-transition metal'], t: 7 },
    { z: 115, sym: 'Mc', name: 'Moscovium',      cat: 'post-transition metal', state: 'solid',  weight: 290,      e: '🇷🇺', c: CAT_COLOR['post-transition metal'], t: 7 },
    { z: 116, sym: 'Lv', name: 'Livermorium',    cat: 'post-transition metal', state: 'solid',  weight: 293,      e: '🏙️', c: CAT_COLOR['post-transition metal'], t: 7 },
    { z: 117, sym: 'Ts', name: 'Tennessine',     cat: 'halogen',               state: 'solid',  weight: 294,      e: '🎸', c: CAT_COLOR['halogen'],               t: 7 },
    { z: 118, sym: 'Og', name: 'Oganesson',      cat: 'noble gas',             state: 'gas',    weight: 294,      e: '🌌', c: CAT_COLOR['noble gas'],             t: 7 },
  ];

  // Build a lookup map by symbol and by name (lowercase)
  const BY_SYMBOL = {};
  const BY_NAME   = {};
  for (const el of ELEMENTS) {
    BY_SYMBOL[el.sym]             = el;
    BY_NAME[el.name.toLowerCase()] = el;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ELEMENTS, BY_SYMBOL, BY_NAME, CAT_COLOR };
  } else {
    window.PeriodicTable = { ELEMENTS, BY_SYMBOL, BY_NAME, CAT_COLOR };
  }
}());
