const imageBase = (
  import.meta.env.PUBLIC_IMAGE_BASE ?? 'https://www.images.sarah-norton.com'
).replace(/\/$/, '');
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');

export const THUMB_WIDTHS = [400, 800, 1200];
export const FULL_WIDTHS = [1200, 1800, 2400];

export const imageUrl = (key: string, width: number, quality = 80) =>
  imageBase
    ? `${imageBase}/cdn-cgi/image/width=${width},quality=${quality},format=auto/${key}`
    : `${siteBase}/${key}`;

export const imageSrcSet = (key: string, widths: number[]) =>
  imageBase ? widths.map((w) => `${imageUrl(key, w)} ${w}w`).join(', ') : undefined;
