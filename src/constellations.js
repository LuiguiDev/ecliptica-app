// Datos estilizados de las 12 constelaciones del zodiaco.
// Cada entrada: nombre, rango de fechas del "signo", estrellas [x,y] (plano local)
// y aristas (pares de índices de estrellas) que forman la figura.

export const ZODIAC = [
  {
    name: 'Aries',
    range: '21 mar – 19 abr',
    stars: [[-1, -0.5], [-0.35, -0.2], [0.15, 0.05], [0.95, 0.55]],
    lines: [[0, 1], [1, 2], [2, 3]],
  },
  {
    name: 'Tauro',
    range: '20 abr – 20 may',
    stars: [
      [0, 0], [-0.35, 0.3], [-0.75, 0.55], [1.05, 0.95],
      [-0.35, -0.3], [-0.75, -0.55], [1.0, -0.85],
      [-1.05, 0.05], [-0.95, -0.05],
    ],
    lines: [[1, 0], [1, 2], [2, 3], [4, 0], [4, 5], [5, 6], [7, 8]],
  },
  {
    name: 'Géminis',
    range: '21 may – 20 jun',
    stars: [
      [-0.75, 0.95], [-0.7, 0.45], [-0.65, -0.05], [-0.8, -0.6], [-0.95, -0.85],
      [-0.05, 0.9], [0.0, 0.4], [0.05, -0.1], [0.2, -0.6], [0.35, -0.8],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 9], [1, 6], [2, 7]],
  },
  {
    name: 'Cáncer',
    range: '21 jun – 22 jul',
    stars: [[0, 0.05], [-0.55, 0.7], [0.65, 0.6], [0.1, -0.55], [-0.05, -0.85]],
    lines: [[0, 1], [0, 2], [0, 3], [3, 4]],
  },
  {
    name: 'Leo',
    range: '23 jul – 22 ago',
    stars: [
      [0.75, 0.95], [0.45, 0.8], [0.2, 0.6], [0.05, 0.4], [0.2, 0.15],
      [-0.55, -0.15], [-0.15, -0.75], [0.55, -0.35],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 5]],
  },
  {
    name: 'Virgo',
    range: '23 ago – 22 sep',
    stars: [
      [-0.95, 0.6], [-0.45, 0.35], [0.0, 0.25], [0.45, 0.5], [0.9, 0.65],
      [0.05, -0.3], [-0.35, -0.75], [0.45, -0.75],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [5, 7]],
  },
  {
    name: 'Libra',
    range: '23 sep – 22 oct',
    stars: [[-0.5, 0.7], [0.45, 0.7], [0.7, -0.55], [-0.4, -0.55], [0.05, 0.15]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [4, 3]],
  },
  {
    name: 'Escorpio',
    range: '23 oct – 21 nov',
    stars: [
      [-0.85, 0.7], [-0.75, 0.45], [-0.55, 0.35], [-0.1, 0.15],
      [0.25, -0.05], [0.45, -0.35], [0.55, -0.65], [0.35, -0.9], [0.0, -0.75], [0.15, -0.45],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 5]],
  },
  {
    name: 'Sagitario',
    range: '22 nov – 21 dic',
    stars: [
      [-0.6, 0.25], [0.5, 0.35], [0.65, -0.4], [0.1, -0.7], [-0.45, -0.4],
      [-0.95, 0.55], [-1.0, -0.1], [0.15, 0.55],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 6], [6, 4], [0, 7], [7, 1]],
  },
  {
    name: 'Capricornio',
    range: '22 dic – 19 ene',
    stars: [[-0.95, 0.35], [0.9, 0.45], [0.35, -0.65], [-0.3, -0.75]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
  },
  {
    name: 'Acuario',
    range: '20 ene – 18 feb',
    stars: [
      [-0.95, 0.6], [-0.55, 0.2], [-0.1, 0.5], [0.3, 0.15], [0.75, 0.45],
      [0.95, -0.15], [0.75, -0.6], [0.35, -0.5], [0.4, -0.05],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 3]],
  },
  {
    name: 'Piscis',
    range: '19 feb – 20 mar',
    stars: [
      [-0.9, 0.45], [-0.45, 0.0], [0.0, -0.45], [0.4, 0.0], [0.75, 0.45],
      [-1.0, 0.6], [-0.8, 0.65], [-0.95, 0.25], [-1.1, 0.35],
      [0.6, 0.6], [0.85, 0.55], [0.8, 0.7],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [9, 10], [10, 11]],
  },
];

// Día del año del equinoccio de marzo (21 de marzo ≈ día 80)
export const MARCH_EQUINOX_DAY = 80;

// Longitud eclíptica del Sol [0,360) para un día del año (1-365)
export function sunLongitude(dayOfYear) {
  return ((((dayOfYear - MARCH_EQUINOX_DAY) % 365) + 365) % 365) * (360 / 365);
}

export function signIndexForLongitude(lambda) {
  return Math.floor(((lambda % 360) + 360) % 360 / 30) % 12;
}

const MONTHS = [
  ['enero', 31], ['febrero', 28], ['marzo', 31], ['abril', 30],
  ['mayo', 31], ['junio', 30], ['julio', 31], ['agosto', 31],
  ['septiembre', 30], ['octubre', 31], ['noviembre', 30], ['diciembre', 31],
];

export function dayToDate(dayOfYear) {
  let d = dayOfYear;
  for (const [name, len] of MONTHS) {
    if (d <= len) return `${d} de ${name}`;
    d -= len;
  }
  return '31 de diciembre';
}
