
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '15',
    name: 'Isla de Cocina "Horizonte Blanco"',
    category: 'Cocina',
    price: 2450000,
    image: '/imagesProducts/islaCocina.jpg',
    description: 'La pieza central definitiva para un hogar moderno. Esta isla combina una estructura robusta de roble americano con un acabado en blanco satinado de alta resistencia. La superficie de cuarzo veteado ofrece durabilidad eterna, mientras que los detalles en bronce aportan un lujo discreto. Diseñada para ser el corazón de las reuniones familiares.',
    woodType: 'Roble Americano y Cuarzo',
    stock: 1
  },
  {
    id: '1',
    name: 'Mesa de Comedor Roble Real',
    category: 'Mesas',
    price: 1250000,
    image: '/imagesProducts/mesaComedorRoble.jpg',
    description: 'Nuestra pieza insignia. Una mesa de comedor imponente tallada a mano en madera de roble macizo recuperado de antiguos graneros. Su superficie revela la historia del árbol con nudos y texturas únicas protegidas por una cera orgánica artesanal.',
    woodType: 'Roble Macizo Recuperado',
    stock: 2
  },
  {
    id: '2',
    name: 'Aparador Nogal Nórdico',
    category: 'Almacenamiento',
    price: 890000,
    image: '/imagesProducts/aparadorNordico.jpg',
    description: 'Equilibrio perfecto entre el minimalismo escandinavo y la robustez del nogal. Posee puertas con sistema de apertura por presión y estantes regulables.',
    woodType: 'Nogal Americano',
    stock: 5
  },
  {
    id: '3',
    name: 'Silla "Cástor" Ergonómica',
    category: 'Asientos',
    price: 320000,
    image: '/imagesProducts/sillaErgonomica.jpg',
    description: 'Inspirada en las formas orgánicas de la naturaleza. Cada silla es ensamblada mediante encastres tradicionales de ebanistería.',
    woodType: 'Fresno Blanco',
    stock: 12
  },
  {
    id: '4',
    name: 'Escritorio de Autor Ébano',
    category: 'Oficina',
    price: 1540000,
    image: '/imagesProducts/escritorio.jpg',
    description: 'Un espacio de trabajo diseñado para la concentración. Combinación exquisita de maderas oscuras y detalles en bronce pulido.',
    woodType: 'Ébano / Nogal',
    stock: 1
  },
  {
    id: '5',
    name: 'Cama "Sombra" Queen Size',
    category: 'Dormitorio',
    price: 2100000,
    image: '/imagesProducts/camaSombraQueen.jpg',
    description: 'Estructura de cama robusta con respaldo de madera viva que conserva el borde natural del tronco.',
    woodType: 'Roble Oscuro',
    stock: 3
  },
  {
    id: '6',
    name: 'Estantería "Vértice"',
    category: 'Almacenamiento',
    price: 450000,
    image: '/imagesProducts/estanteriaVertice.jpg',
    description: 'Geometría y funcionalidad. Modular y elegante, perfecta para resaltar libros y objetos de arte.',
    woodType: 'Pino Tea Recuperado',
    stock: 8
  },
  {
    id: '7',
    name: 'Mesa Exterior "Rizoma"',
    category: 'Mesas',
    price: 380000,
    image: '/imagesProducts/mesaExterior.jpg',
    description: 'Mesa baja tallada de un solo bloque de madera, inspirada en las raíces del bosque.',
    woodType: 'Petiribí',
    stock: 4
  },
  {
    id: '8',
    name: 'Banqueta de Bar "Altair"',
    category: 'Asientos',
    price: 185000,
    image: '/imagesProducts/banquetaBarAltair.jpg',
    description: 'Altura perfecta para barras de cocina. Asiento esculpido para ofrecer una comodidad excepcional.',
    woodType: 'Cedro',
    stock: 15
  },
  {
    id: '9',
    name: 'Biblioteca "Saber"',
    category: 'Oficina',
    price: 1250000,
    image: '/imagesProducts/bibliotecaSaber.jpg',
    description: 'Gran biblioteca con puertas de vidrio repartido y marcos de madera maciza.',
    woodType: 'Cerezo',
    stock: 2
  },
  {
    id: '10',
    name: 'Perchero de Pie "Rama"',
    category: 'Decoración',
    price: 95000,
    image: '/imagesProducts/percheroPieRama.jpg',
    description: 'Un perchero que parece brotar del suelo, ideal para entradas minimalistas.',
    woodType: 'Lenga Fueguina',
    stock: 10
  },
  {
    id: '11',
    name: 'Consola "Urbana"',
    category: 'Mesas',
    price: 520000,
    image: '/imagesProducts/mesaConsolaUrbana.jpg',
    description: 'Delgada y sofisticada, diseñada para pasillos o recepciones con poco espacio.',
    woodType: 'Paraíso Natural',
    stock: 6
  },
  {
    id: '12',
    name: 'Espejo "Reflejo"',
    category: 'Decoración',
    price: 340000,
    image: '/imagesProducts/espejoReflejo.jpg',
    description: 'Marco de madera ancha que aporta calidez a cualquier ambiente.',
    woodType: 'Olmo',
    stock: 4
  },
  {
    id: '13',
    name: 'Cuna "Nido" Evolutiva',
    category: 'Dormitorio',
    price: 780000,
    image: '/imagesProducts/cunaEvolutiva.jpg',
    description: 'Diseñada para crecer con el bebé. Materiales libres de tóxicos y bordes redondeados.',
    woodType: 'Haya Europea',
    stock: 5
  },
  {
    id: '14',
    name: 'Baúl "Origen"',
    category: 'Almacenamiento',
    price: 410000,
    image: '/imagesProducts/baulOrigen.jpg',
    description: 'Inspirado en los cofres antiguos. Un espacio de almacenamiento generoso con herrajes de forja.',
    woodType: 'Alcanfor',
    stock: 7
  }
];

export const NAVIGATION = [
  { name: 'Inicio', href: '#home' },
  { name: 'Colecciones', href: '#collections' },
  { name: 'Artesanía', href: '#about' },
  { name: 'Diseñador IA', href: '#designer' },
  { name: 'Contacto', href: '#contact' }
];
