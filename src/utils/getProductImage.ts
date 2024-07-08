/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { ProductMedia, ProductViewMedia } from '../types/interface';
import { isDefined } from "./isDefined";

const removeProtocol = (url?: string | null): string | undefined => {
  return url?.replace(/^https?:/, '').replace(/^\/\//, '');
}

const getImageUrl = (
  image: ProductMedia | ProductViewMedia | null,
): string | undefined => {
  if (!image) {
    return undefined;
  }
  const protocol = new URL(window.location.href).protocol;
  const imageUrl = removeProtocol(image.url);
  return imageUrl ? `${protocol}//${imageUrl}` : undefined;
};


const getProductImageURLs = (
  images: ProductViewMedia[],
  amount: number = 3,
  topImageUrl?: string
): string[] => {
  // map images to full URLs
  const imageUrlArray: string[] = images
    .map((image) => getImageUrl(image))
    .filter((url): url is string => isDefined<string>(url));

  if (topImageUrl) {
    const protocol = new URL(window.location.href).protocol;
    const topImageUrlFormatted = `${protocol}//${removeProtocol(topImageUrl)}`;
    const index = topImageUrlFormatted.indexOf(topImageUrlFormatted);
    if (index > -1) {
      imageUrlArray.splice(index, 1);
    }
    imageUrlArray.unshift(topImageUrlFormatted);
  }

  return imageUrlArray.slice(0, amount);
};

export interface ResolveImageUrlOptions {
  width: number;
  height?: number;
  auto?: string;
  quality?: number;
  crop?: boolean;
  fit?: string;
}

const resolveImageUrl = (url: string, opts: ResolveImageUrlOptions): string => {
  const [base, query] = url.split('?');
  const params = new URLSearchParams(query);

  Object.entries(opts).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return `${base}?${params.toString()}`;
};

const generateOptimizedImages = (
  imageUrls: string[],
  baseImageWidth: number
): { src: string; srcset: any }[] => {
  const baseOptions = {
    fit: 'cover',
    crop: false,
    dpi: 1,
  };

  const imageUrlArray: Array<{ src: string; srcset: any }> = [];

  for (const imageUrl of imageUrls) {
    const src = resolveImageUrl(imageUrl, {
      ...baseOptions,
      width: baseImageWidth,
    });
    const dpiSet = [1, 2, 3];
    const srcset = dpiSet.map((dpi) => {
      return `${resolveImageUrl(imageUrl, {
        ...baseOptions,
        auto: 'webp',
        quality: 80,
        width: baseImageWidth * dpi,
      })} ${dpi}x`;
    });
    imageUrlArray.push({ src, srcset });
  }

  return imageUrlArray;
};

export { generateOptimizedImages, getProductImageURLs, getImageUrl };
