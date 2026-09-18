import { Dish, Restaurant, OrderTracking, UserSession } from '../types';

export const APP_LOGO = 'https://lh3.googleusercontent.com/aida/AEtjO1USXmi9PCMr0imBJImcXxNU1XsF16f-WUYBWFudALtkihB5X2RiZf_IQPB709v_LHdFDjiJtOxrgTR_i0b_-VtV22KWbWIkMhRjWg1xuYZkY7XQ6pcJ1Ir4leSkaWCIdXakhz3tTJ5rVtfHJBYhTYVaw_YFrRuOgyQYr4HwmGXZ7dgaPg7I6wpVk2-dd-TcPuZuZ6_P9vcxXaIMRX31D7jJ5mOxwo85JATlVoL3lgXmjATEGxtBIUMQyl0G';

export const MAP_BACKGROUND = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAq9oG1lIW072hHsuXzWaVJCT956MV02LLypPBeKW-tziyvlg1jAvua0lghmEVH8g1irWMG2J7gv8eOMy7MYOt3pS658vjFcqUVOSX9GASEUfRGoS_4Kk2e2TQK7IZfkqYbBG6CG145mnELONxppLiwxQlNAxNuvWHQAdO0gTHZoXpKEMJJ60hDW27DjwHnOcKZRpZAgsazzSvFm4FkuXtBEZXSDLyHs8H5zo5RDqz3G2bFAiHZum9yg';

export const MOCK_USER: UserSession = {
  isLoggedIn: true,
  name: 'Mateo Rossi',
  email: 'mateo.rossi@email.pe',
  phone: '+51 984 321 876',
  role: 'Cliente Food Now Gold',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4wP3ARHU0J8_G393X5zsOJAJKK-zztzCFjClLGEhgaecofigB-2xjWdbGP2nwKTsHeP7DGEVopaR733Nbcps2-a1Ua1BDWMhkoRvihnlZYBI6uUkhQmV7wbIlqVac105JmrVQL75CaLrCMzDgrYGs7rJZ7yA-kFmw1NsZpZW9GJnQg1xswtyijpv-DIOlWlUfTUArFbBAQ65bq38QGejIgaEW9hAGUOSsTYx9sV0ts33e4ZfOAmFGg',
  savedAddresses: [
    { id: 'addr-1', label: 'Casa (Miraflores)', address: 'Av. José Larco 743, Dpto 502, Miraflores', isDefault: true },
    { id: 'addr-2', label: 'Oficina (San Isidro)', address: 'Av. Las Camelias 490, Piso 8, San Isidro', isDefault: false },
    { id: 'addr-3', label: 'Taller / Estudio', address: 'Calle Schell 319, Miraflores', isDefault: false }
  ],
  activeOrdersCount: 1,
  notificationsCount: 3
};

export const INITIAL_DISHES: Dish[] = [
  {
    id: 'lomo-saltado-hero',
    name: 'Lomo Saltado Criollo al Wok',
    restaurant: 'Sabor & Tradición Limeña',
    district: 'Miraflores',
    price: 38.00,
    originalPrice: 46.00,
    rating: 4.9,
    reviewsCount: 1240,
    eta: '20-30 min',
    deliveryFee: 'S/ 3.50',
    freeDelivery: true,
    category: 'Criollo',
    isPopular: true,
    isFavorite: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUqUvcdr6HHYZrUPDOYsjMDZUpFfsiG4kEyzyVfGviNPPM5ctWYV_TlQRzBPeGL7wTQfls-D4TqO_joH54VQ0Rr6VtC8CYvpNwKFHYnED25wIbwo_BtQ5jq1Pg_iUmsB_cjMggqULrvSQgME6R2V5BbvA8Yow0OPzmrq--3NwA8exi2IKHHiGYM9Tt9xaLITTbUZ7Cs8gREJyOjMZREgqePdsLSjRgzb2nEOi9yPbOxVaApPv8qkkcZQ',
    description: 'Trozos de lomo fino flambeados al fuego vivo con cebolla morada, tomate fresco, ají amarillo y sillao tradicional. Servido con papas fritas crocantes y arroz con choclo.'
  },
  {
    id: 'ceviche-clasico',
    name: 'Ceviche Clásico Norteño',
    restaurant: 'La Barra Marina & Pescados',
    district: 'Miraflores',
    price: 36.00,
    originalPrice: 42.00,
    rating: 4.8,
    reviewsCount: 890,
    eta: '15-25 min',
    deliveryFee: 'Gratis',
    freeDelivery: true,
    category: 'Mariscos',
    isPopular: true,
    isFavorite: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UsVH3XMbr6BmWJ4rvvaTwtt19uSAHN5MRhUdWPJXdgLZ15so9bxOf_SOSZN9vqJvg1_oZ5ASrPEiRmGnJXVcLFYxQcepcsPCu2CG5xWS8oxx1SZXp9NXZSlEKSBS4S-v_PESepwlK6tsUKdvjbQ8zdSj3vhr3MzVSXssvQeCALwv78rsNVAmB9qtMxgpY1xrV5c4S3w8BLJAO5bHzv5nh0XRu0QW3WzAJku9f88if0jILhuPL6ucvs_4Zy',
    description: 'Pesca del día marinada al instante en jugo de limón recién exprimido, ají limo, cebolla roja pluma, camote glaseado y canchita serrana.'
  },
  {
    id: 'aji-de-gallina',
    name: 'Ají de Gallina Cremoso',
    restaurant: 'Sabor & Tradición Limeña',
    district: 'Miraflores',
    price: 32.50,
    originalPrice: 38.00,
    rating: 4.9,
    reviewsCount: 530,
    eta: '20-30 min',
    deliveryFee: 'S/ 3.50',
    category: 'Criollo',
    isPopular: true,
    isFavorite: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U-z1oEj9f2pxeYNmysnpZT-N-QCO2ns__6Pu4xyljVtmC_qCpBqtj_AZCJcv77HhJ2xc2YN3LiqiozYDSuQy4dKZBWjV21VopUDggXcIbiadxmqR4vbejq_cWuYPmiQyiYcBvT5P65IfIsVsF3tO34E8neLhR1d5JF81JLt8ohq2UDr-6VcJmq4b8p_sDZv5BDmo0U4XK4U4OnY0Z-52UkmyIfheb932oqbMrVrweRiIvk2dMzC-asDww',
    description: 'Suave crema de ají amarillo con pechuga deshilachada, pecana tostada, papa amarilla, huevo duro y aceituna botija.'
  },
  {
    id: 'anticuchos-puesto',
    name: 'Dúo de Anticuchos Carretilleros',
    restaurant: 'Puesto Callejero Doña Grimanesa',
    district: 'Miraflores',
    price: 24.00,
    originalPrice: 28.00,
    rating: 4.9,
    reviewsCount: 760,
    eta: '15-20 min',
    deliveryFee: 'S/ 2.50',
    category: 'Brasas',
    isPopular: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp0i5G1q8-9Kpp2JNSLHtMxjZrVtlgBWix1TsCqMenLbV9go_-Ecmm6-VheGU6cwJuBpQ_OfB3grG8tw2WuD0F0eToW5B2MzgJxeh-Uyx5LrLgdRcvouXaQoOZxIe7QwWWLT-M5NFhxA9LNxsl8hZS4ruS8Le5UZ3LXYdm4y0-OPH8-7kwcjJEbRyzg7vJHLdAPUJeLITVcf5WAwF2wWWBYNo9xbHDENFenj1IIAKt4G4Sr96VwPjp-w',
    description: 'Macerados en ají panca, ajo y comino, asados a la leña con papa dorada y choclo tierno.'
  },
  {
    id: 'chifa-aeropuerto',
    name: 'Aeropuerto Especial con Wantanes',
    restaurant: 'Madam Tusan Chifa Central',
    district: 'San Isidro',
    price: 34.00,
    rating: 4.7,
    reviewsCount: 620,
    eta: '25-35 min',
    deliveryFee: 'Gratis',
    category: 'Chifa',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhEh3G77MzxFOUXcvUDGgXBAr77OVg76nCp7-MW3bHSMZvYAUQnIbDeTYEGuoEZgluyJ6X06TSxW-Ir2Su7rs9LLnhzLlS-cC5hSLyEHMY9mXJYmPizhf8EyXFSHEwKzYXfeXU7vsu0pl8C6XWveBP-AKkt5X6gJzZmZwnrf-T1g-BsVYxav-4uI3HIYim7iB_cr-8LoN8ZtvLoUBkPy3vAgKeiPVpQCB9R7YyfZVPV5Ora7aPErm8eg',
    description: 'Combinación crujiente de arroz chaufa y tallarín saltado con pollo, chancho asado, frijolito chino y 3 wantanes fritos.'
  }
];

export const NEARBY_RESTAURANTS: Restaurant[] = [
  {
    id: 'resto-sabor-limena',
    name: 'Sabor & Tradición Limeña',
    cuisine: 'Comida Criolla • Platos al Wok • Lomo Saltado',
    district: 'Miraflores',
    address: 'Calle Bellavista 241, Miraflores',
    distanceKm: 0.3,
    stallType: 'Huco Tradicional',
    rating: 4.9,
    reviewsCount: 1240,
    eta: '20-30 min',
    deliveryFee: 'S/ 3.50',
    minOrder: 25.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWLhhp1VNHQBPuDTXpXqC57fLNYXcofcnkwIIOIZoZwHVb9H8s3d5pB8xmXqYnNdT7DHqZ8n5PKZIg-BeA341whDaKfLXp3dtGm_n-_YcDi3_zvTqmHX7p4Fob8skUJyRJDK7ZS7OH0wskVVy49lLWOMUeTe6vVbrUxAoFcZ-ONSBDPC-iZrBViLYvKcKATgjuELM9sRqWSWKvo-ykX9JzaConaFpMNmVqr4rVY0tC9SpItFxhA98SA',
    badge: 'Más Pedido',
    isFavorite: true,
    isOpen: true,
    statusLabel: 'Abierto ahora',
    openingHoursText: 'Lun - Dom: 11:30 - 22:30',
    scheduleNote: 'Cocina en vivo activa sin interrupciones',
    coordinates: {
      mapTop: '28%',
      mapLeft: '32%'
    },
    promotion: {
      title: 'Festival Criollo 2x1 en Lomo Saltado',
      description: 'Pide 1 Lomo Saltado y llévate el segundo con 50% de descuento o bebida de 1L gratis.',
      dateRangeText: 'Válido del 15 al 30 de Septiembre 2026',
      validUntil: '30 de Septiembre 2026',
      discountTag: 'PROMO 2x1',
      daysLeft: 13,
      active: true
    }
  },
  {
    id: 'resto-barra-marina',
    name: 'La Barra Marina & Pescados',
    cuisine: 'Cevichería • Pescados Frescos • Arroces de Marisco',
    district: 'Miraflores',
    address: 'Av. Mariscal La Mar 770, Miraflores',
    distanceKm: 0.7,
    stallType: 'Cevichería Local',
    rating: 4.8,
    reviewsCount: 890,
    eta: '15-25 min',
    deliveryFee: 'Gratis',
    minOrder: 30.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UsVH3XMbr6BmWJ4rvvaTwtt19uSAHN5MRhUdWPJXdgLZ15so9bxOf_SOSZN9vqJvg1_oZ5ASrPEiRmGnJXVcLFYxQcepcsPCu2CG5xWS8oxx1SZXp9NXZSlEKSBS4S-v_PESepwlK6tsUKdvjbQ8zdSj3vhr3MzVSXssvQeCALwv78rsNVAmB9qtMxgpY1xrV5c4S3w8BLJAO5bHzv5nh0XRu0QW3WzAJku9f88if0jILhuPL6ucvs_4Zy',
    badge: 'Envío Gratis',
    isFavorite: true,
    isOpen: true,
    statusLabel: 'Abierto ahora',
    openingHoursText: 'Mar - Dom: 10:30 - 18:00',
    scheduleNote: 'Pesca artesanal del día traída de Chorrillos',
    coordinates: {
      mapTop: '45%',
      mapLeft: '72%'
    },
    promotion: {
      title: '30% OFF en Ceviches & Causas',
      description: 'Aplica en pedidos superiores a S/ 35 pagando con Yape, Plin o tarjeta.',
      dateRangeText: 'Válido del 18 al 25 de Septiembre 2026',
      validUntil: '25 de Septiembre 2026',
      discountTag: '-30% DCTO',
      daysLeft: 8,
      active: true
    }
  },
  {
    id: 'resto-anticuchos-puesto',
    name: 'Puesto Callejero Doña Julia',
    cuisine: 'Anticuchos de Corazón • Rachi • Pancita a la Leña',
    district: 'Miraflores',
    address: 'Parque Kennedy / Esquina Schell, Miraflores',
    distanceKm: 0.4,
    stallType: 'Puesto Callejero',
    rating: 4.9,
    reviewsCount: 1540,
    eta: '15-20 min',
    deliveryFee: 'S/ 2.50',
    minOrder: 20.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp0i5G1q8-9Kpp2JNSLHtMxjZrVtlgBWix1TsCqMenLbV9go_-Ecmm6-VheGU6cwJuBpQ_OfB3grG8tw2WuD0F0eToW5B2MzgJxeh-Uyx5LrLgdRcvouXaQoOZxIe7QwWWLT-M5NFhxA9LNxsl8hZS4ruS8Le5UZ3LXYdm4y0-OPH8-7kwcjJEbRyzg7vJHLdAPUJeLITVcf5WAwF2wWWBYNo9xbHDENFenj1IIAKt4G4Sr96VwPjp-w',
    badge: 'Favorito del Parque',
    isFavorite: false,
    isOpen: true,
    statusLabel: 'Abierto ahora',
    openingHoursText: 'Lun - Sáb: 17:00 - 23:30',
    scheduleNote: 'Brasas encendidas desde las 5:00 PM',
    coordinates: {
      mapTop: '35%',
      mapLeft: '50%'
    },
    promotion: {
      title: 'Porción Extra de Choclo & Papas',
      description: 'Con cada orden de 2 platos o más, lleva guarnición gratis y ají carretillero casero.',
      dateRangeText: 'Válido del 10 al 30 de Septiembre 2026',
      validUntil: '30 de Septiembre 2026',
      discountTag: 'REGALO EXTRA',
      daysLeft: 13,
      active: true
    }
  },
  {
    id: 'resto-chifa-central',
    name: 'Madam Tusan Chifa Central',
    cuisine: 'Chifa Peruano • Wantán Frito • Aeropuerto • Kam Lu',
    district: 'San Isidro',
    address: 'Av. Santa Cruz 859, Miraflores / San Isidro',
    distanceKm: 1.6,
    stallType: 'Restaurante Gourmet',
    rating: 4.7,
    reviewsCount: 710,
    eta: '30-40 min',
    deliveryFee: 'S/ 4.00',
    minOrder: 35.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhEh3G77MzxFOUXcvUDGgXBAr77OVg76nCp7-MW3bHSMZvYAUQnIbDeTYEGuoEZgluyJ6X06TSxW-Ir2Su7rs9LLnhzLlS-cC5hSLyEHMY9mXJYmPizhf8EyXFSHEwKzYXfeXU7vsu0pl8C6XWveBP-AKkt5X6gJzZmZwnrf-T1g-BsVYxav-4uI3HIYim7iB_cr-8LoN8ZtvLoUBkPy3vAgKeiPVpQCB9R7YyfZVPV5Ora7aPErm8eg',
    isFavorite: false,
    isOpen: false, // Explicitly closed to demonstrate closed status!
    statusLabel: 'Cerrado temporalmente',
    openingHoursText: 'Abre hoy a las 18:30 hrs',
    scheduleNote: 'Turno de tarde: 18:30 a 23:00 hrs',
    coordinates: {
      mapTop: '62%',
      mapLeft: '22%'
    },
    promotion: {
      title: 'Wantanes de Cortesía en pedidos nocturnos',
      description: 'Docena de wantanes crocantes con salsa tamarindo en pedidos mayores a S/ 45.',
      dateRangeText: 'Válido del 20 al 27 de Septiembre 2026',
      validUntil: '27 de Septiembre 2026',
      discountTag: 'WANTÁN GRATIS',
      daysLeft: 10,
      active: true
    }
  },
  {
    id: 'resto-brasas-leña',
    name: 'Brasas & Sabor a la Leña',
    cuisine: 'Pollería • Broaster • Papas Nativas • Anticuchos',
    district: 'Miraflores',
    address: 'Av. Alfredo Benavides 1420, Miraflores',
    distanceKm: 1.1,
    stallType: 'Huco Tradicional',
    rating: 4.8,
    reviewsCount: 1980,
    eta: '25-35 min',
    deliveryFee: 'S/ 3.00',
    minOrder: 28.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrxWhLEFWc2Yzb3pH5fGG4n9BRRZP613BX9h6np4Qs9ECrgQUZEYoZiuLvA-BMaq4B0sRwYNlZj9RoUlYb2bS-gXL_X00V6PxwzS4zU9iRqQndkZmGouFNBbxDNOQWA6bAy-Sg6mrOLbo6VvVx2wQNKvVK32WBM8-8iqUOm15lytUeVYy1i1iFQQCLdZF5nMX_V3WrLH0OfC1RuX8wtSgvOwDzT4H03tbHiEKkGX9I25R1-rd8rNKO2w',
    isFavorite: true,
    isOpen: true,
    statusLabel: 'Abierto ahora',
    openingHoursText: 'Lun - Dom: 12:00 - 23:00',
    scheduleNote: 'Pollo marinado 24 horas y cocido a fuego de algarrobo',
    coordinates: {
      mapTop: '20%',
      mapLeft: '78%'
    },
    promotion: {
      title: 'Inca Kola 1.5L de Regalo con 1 Pollo Entero',
      description: 'Incluye papas familiares, ensalada clásica y todas las cremas de la casa.',
      dateRangeText: 'Válido del 01 al 30 de Septiembre 2026',
      validUntil: '30 de Septiembre 2026',
      discountTag: 'BEBIDA FREE',
      daysLeft: 13,
      active: true
    }
  },
  {
    id: 'resto-isolina-barranco',
    name: 'Isolina Taberna Peruana',
    cuisine: 'Seco de Res • Cau Cau • Estofado • Taberna Criolla',
    district: 'Barranco',
    address: 'Av. San Martín 101, Barranco',
    distanceKm: 1.4,
    stallType: 'Restaurante Gourmet',
    rating: 4.9,
    reviewsCount: 2310,
    eta: '20-30 min',
    deliveryFee: 'S/ 3.50',
    minOrder: 35.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWLhhp1VNHQBPuDTXpXqC57fLNYXcofcnkwIIOIZoZwHVb9H8s3d5pB8xmXqYnNdT7DHqZ8n5PKZIg-BeA341whDaKfLXp3dtGm_n-_YcDi3_zvTqmHX7p4Fob8skUJyRJDK7ZS7OH0wskVVy49lLWOMUeTe6vVbrUxAoFcZ-ONSBDPC-iZrBViLYvKcKATgjuELM9sRqWSWKvo-ykX9JzaConaFpMNmVqr4rVY0tC9SpItFxhA98SA',
    badge: 'Recomendado',
    isFavorite: false,
    isOpen: true,
    statusLabel: 'Abierto ahora',
    openingHoursText: 'Lun - Dom: 12:00 - 23:00',
    scheduleNote: 'Ollas tradicionales en fuego lento',
    coordinates: {
      mapTop: '68%',
      mapLeft: '38%'
    },
    promotion: {
      title: 'Chicha Morada de la Casa Gratis',
      description: 'Porción personal de chicha natural hervida con maíz morado y canela.',
      dateRangeText: 'Válido esta semana',
      validUntil: '30 de Septiembre 2026',
      discountTag: 'CHICHA GRATIS',
      daysLeft: 7,
      active: true
    }
  },
  {
    id: 'resto-la-lucha-sangucheria',
    name: 'La Lucha Sanguchería Criolla',
    cuisine: 'Sánguches • Chicharrón • Pavo a la Leña • Jugos',
    district: 'Miraflores',
    address: 'Diagonal 308, Parque Kennedy, Miraflores',
    distanceKm: 0.5,
    stallType: 'Huco Tradicional',
    rating: 4.8,
    reviewsCount: 3100,
    eta: '15-25 min',
    deliveryFee: 'S/ 2.50',
    minOrder: 20.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUqUvcdr6HHYZrUPDOYsjMDZUpFfsiG4kEyzyVfGviNPPM5ctWYV_TlQRzBPeGL7wTQfls-D4TqO_joH54VQ0Rr6VtC8CYvpNwKFHYnED25wIbwo_BtQ5jq1Pg_iUmsB_cjMggqULrvSQgME6R2V5BbvA8Yow0OPzmrq--3NwA8exi2IKHHiGYM9Tt9xaLITTbUZ7Cs8gREJyOjMZREgqePdsLSjRgzb2nEOi9yPbOxVaApPv8qkkcZQ',
    isFavorite: false,
    isOpen: false,
    statusLabel: 'Abre hoy a las 18:00 hrs',
    openingHoursText: 'Abre a las 18:00 hrs',
    scheduleNote: 'Horno de leña calentándose para el turno de noche',
    coordinates: {
      mapTop: '55%',
      mapLeft: '56%'
    }
  }
];

export const CURRENT_UPCOMING_DELIVERY: OrderTracking = {
  id: 'FN-89312',
  status: 'reparto',
  stepNumber: 3,
  statusText: 'En Reparto hacia tu dirección',
  title: 'Tu Lomo Saltado está llegando',
  etaMinutes: 12,
  estimatedArrivalHour: '19:15',
  total: 44.50,
  restaurantName: 'Sabor & Tradición Limeña',
  restaurantAddress: 'Calle Bellavista 241, Miraflores',
  deliveryAddress: 'Av. José Larco 743, Dpto 502, Miraflores',
  itemsSummary: '1x Lomo Saltado Criollo al Wok + 1x Porción de Tequeños + 1x Inca Kola Zero',
  items: [
    { name: 'Lomo Saltado Criollo al Wok', quantity: 1, price: 38.00, portion: 'Término medio, papas nativas' },
    { name: 'Porción de Tequeños con Guacamole', quantity: 1, price: 12.00, portion: 'x6 unidades de queso fresco' },
    { name: 'Inca Kola Zero 500ml', quantity: 1, price: 6.50, portion: 'Helada de fábrica' }
  ],
  driver: {
    name: 'Carlos Mendiola Alarcón',
    vehicle: 'Moto Honda CB 125F (Caja térmica Food Now)',
    plate: 'PE-4821-LK',
    rating: 4.98,
    phone: '+51 977 234 112'
  },
  driverName: 'Carlos Mendiola Alarcón',
  driverVehicle: 'Moto Honda CB 125F',
  driverRating: 4.98,
  dishImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUqUvcdr6HHYZrUPDOYsjMDZUpFfsiG4kEyzyVfGviNPPM5ctWYV_TlQRzBPeGL7wTQfls-D4TqO_joH54VQ0Rr6VtC8CYvpNwKFHYnED25wIbwo_BtQ5jq1Pg_iUmsB_cjMggqULrvSQgME6R2V5BbvA8Yow0OPzmrq--3NwA8exi2IKHHiGYM9Tt9xaLITTbUZ7Cs8gREJyOjMZREgqePdsLSjRgzb2nEOi9yPbOxVaApPv8qkkcZQ',
  timeline: [
    {
      step: 1,
      label: 'Orden Confirmada',
      time: '18:40',
      completed: true,
      current: false,
      description: 'El restaurante recibió la orden y validó el pago seguro.',
      icon: 'receipt_long'
    },
    {
      step: 2,
      label: 'Preparando en Cocina',
      time: '18:48',
      completed: true,
      current: false,
      description: 'El chef elaboró el plato al wok y empaquetó con sello térmico.',
      icon: 'skillet'
    },
    {
      step: 3,
      label: 'En Camino con Repartidor',
      time: '19:03',
      completed: false,
      current: true,
      description: 'Carlos va en camino por Av. Larco. Faltan aprox. 6 cuadras.',
      icon: 'two_wheeler'
    },
    {
      step: 4,
      label: 'Entregado en Puerta',
      time: '19:15',
      completed: false,
      current: false,
      description: 'Recepción en Av. José Larco 743, Dpto 502.',
      icon: 'task_alt'
    }
  ]
};

// Aliases for compatibility
export const CURRENT_ORDER = CURRENT_UPCOMING_DELIVERY;
export const POPULAR_RESTAURANTS = NEARBY_RESTAURANTS;
export const INITIAL_RESTAURANTS = NEARBY_RESTAURANTS;

export const USER_PROFILE = {
  name: 'Mateo Rossi',
  email: 'mateo.rossi@email.pe',
  phone: '+51 984 321 876',
  membership: 'FoodPrime Oro',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4wP3ARHU0J8_G393X5zsOJAJKK-zztzCFjClLGEhgaecofigB-2xjWdbGP2nwKTsHeP7DGEVopaR733Nbcps2-a1Ua1BDWMhkoRvihnlZYBI6uUkhQmV7wbIlqVac105JmrVQL75CaLrCMzDgrYGs7rJZ7yA-kFmw1NsZpZW9GJnQg1xswtyijpv-DIOlWlUfTUArFbBAQ65bq38QGejIgaEW9hAGUOSsTYx9sV0ts33e4ZfOAmFGg',
  level: 'Foodie Nivel 4 🌟',
  ordersCount: 28,
  savedAmount: 142,
  points: 1250,
  membershipActive: true,
  membershipRenewsDays: 18,
  foodCash: 35.0,
  defaultAddress: 'Av. José Larco 743, Dpto 502, Miraflores, Lima',
  officeAddress: 'Av. Las Camelias 490, Piso 8, San Isidro, Lima',
};

export const CATEGORIES = [
  { id: 'criolla', name: 'Criolla & Marina', emoji: '🍲', bgColor: 'bg-amber-50' },
  { id: 'pollerias', name: 'Pollerías', emoji: '🍗', bgColor: 'bg-orange-50' },
  { id: 'chifa', name: 'Chifa & Wantán', emoji: '🥡', bgColor: 'bg-red-50' },
  { id: 'burgers', name: 'Hamburguesas', emoji: '🍔', bgColor: 'bg-yellow-50' },
  { id: 'sushi', name: 'Sushi & Nikkei', emoji: '🍣', bgColor: 'bg-emerald-50' },
  { id: 'postres', name: 'Postres & Dulces', emoji: '🍰', bgColor: 'bg-pink-50' },
  { id: 'bebidas', name: 'Bebidas & Pisco', emoji: '🍹', bgColor: 'bg-purple-50' },
  { id: 'super', name: 'Super & Exprés', emoji: '🛍️', bgColor: 'bg-blue-50' }
];
