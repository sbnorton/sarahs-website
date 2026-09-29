export interface GalleryImage {
  id: number;
  thumbnail: string;
  src: string;
  alt: string;
  tags: string[];
}

const imageBase = (import.meta.env.PUBLIC_IMAGE_BASE_URL ?? '').replace(/\/$/, '');
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${imageBase || `${siteBase}/assets`}${path}`;

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    thumbnail: asset('/images/photogallery-images/horizontal/mjavatn-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/mjavatn.jpg'),
    alt: 'Mjåvatn',
    tags: ['Landscape'],
  },
  {
    id: 2,
    thumbnail: asset('/images/photogallery-images/vertical/love-small.jpg'),
    src: asset('/images/photogallery-images/vertical/love.jpg'),
    alt: 'Lion',
    tags: ['Animals'],
  },
  {
    id: 3,
    thumbnail: asset('/images/photogallery-images/vertical/salar_staaende-small.jpg'),
    src: asset('/images/photogallery-images/vertical/salar_staaende.jpg'),
    alt: 'Salar de Uyuni',
    tags: ['Landscape'],
  },
  {
    id: 4,
    thumbnail: asset('/images/photogallery-images/vertical/drone_midsund-small.jpg'),
    src: asset('/images/photogallery-images/vertical/drone_midsund.jpg'),
    alt: 'Drone Midsund',
    tags: ['Landscape'],
  },
  {
    id: 5,
    thumbnail: asset('/images/photogallery-images/horizontal/okstindan-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/okstindan.jpg'),
    alt: 'Okstindan',
    tags: ['Landscape'],
  },
  {
    id: 6,
    thumbnail: asset('/images/photogallery-images/vertical/el_limon_elv-small.jpg'),
    src: asset('/images/photogallery-images/vertical/el_limon_elv.jpg'),
    alt: 'El Limon river',
    tags: ['Landscape'],
  },
  {
    id: 7,
    thumbnail: asset('/images/photogallery-images/horizontal/stine_bryllup-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/stine_bryllup.jpg'),
    alt: 'Stine wedding',
    tags: ['Events'],
  },
  {
    id: 8,
    thumbnail: asset('/images/photogallery-images/vertical/god_natt_lapaz-small.jpg'),
    src: asset('/images/photogallery-images/vertical/god_natt_lapaz.jpg'),
    alt: 'Good night La Paz',
    tags: ['City'],
  },
  {
    id: 9,
    thumbnail: asset('/images/photogallery-images/vertical/baat_soloppgang-small.jpg'),
    src: asset('/images/photogallery-images/vertical/baat_soloppgang.jpg'),
    alt: 'Boat at sunrise',
    tags: ['Landscape'],
  },
  {
    id: 10,
    thumbnail: asset('/images/photogallery-images/horizontal/melkeveien-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/melkeveien.jpg'),
    alt: 'The Milky Way',
    tags: ['Landscape'],
  },
  {
    id: 11,
    thumbnail: asset('/images/photogallery-images/vertical/cochabamba-small.jpg'),
    src: asset('/images/photogallery-images/vertical/cochabamba.jpg'),
    alt: 'Cochabamba',
    tags: ['City'],
  },
  {
    id: 12,
    thumbnail: asset('/images/photogallery-images/vertical/fjell-small.jpg'),
    src: asset('/images/photogallery-images/vertical/fjell.jpg'),
    alt: 'Mountain landscape',
    tags: ['Landscape'],
  },
  {
    id: 13,
    thumbnail: asset('/images/photogallery-images/vertical/lama-small.jpg'),
    src: asset('/images/photogallery-images/vertical/lama.jpg'),
    alt: 'Llama',
    tags: ['Animals'],
  },
  {
    id: 14,
    thumbnail: asset('/images/photogallery-images/horizontal/orn-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/orn.jpg'),
    alt: 'Eagle',
    tags: ['Animals'],
  },
  {
    id: 15,
    thumbnail: asset('/images/photogallery-images/vertical/utsikten_helgeland-small.jpg'),
    src: asset('/images/photogallery-images/vertical/utsikten_helgeland.jpg'),
    alt: 'Utsikten',
    tags: ['Landscape'],
  },
  {
    id: 16,
    thumbnail: asset('/images/photogallery-images/horizontal/sanna-small.jpg'),
    src: asset('/images/photogallery-images/horizontal/sanna.jpg'),
    alt: 'Sanna',
    tags: ['Landscape'],
  },
  {
    id: 17,
    thumbnail: asset('/images/photogallery-images/vertical/mars-small.jpg'),
    src: asset('/images/photogallery-images/vertical/mars.jpg'),
    alt: 'Mars-like landscape',
    tags: ['Landscape'],
  },
  {
    id: 18,
    thumbnail: asset('/images/photogallery-images/vertical/lapaz-small.jpg'),
    src: asset('/images/photogallery-images/vertical/lapaz.jpg'),
    alt: 'La Paz',
    tags: ['City'],
  },
  {
    id: 19,
    thumbnail: asset('/images/photogallery-images/vertical/helgeland_promo-small.jpg'),
    src: asset('/images/photogallery-images/vertical/helgeland_promo.jpg'),
    alt: 'Helgeland portrait',
    tags: ['Portraits'],
  },
];
