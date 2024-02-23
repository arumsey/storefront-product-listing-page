import { useEffect, useRef, useState } from 'preact/compat';

import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

export const Image = ({
  image,
  alt,
  carouselIndex,
  index,
}: {
  image: { src: string; srcset: any } | string;
  alt: string;
  carouselIndex: number;
  index: number;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const entry = useIntersectionObserver(imageRef, { rootMargin: '200px' });

  useEffect(() => {
    if (!entry) return;

    if (entry?.isIntersecting && index === carouselIndex) {
      setIsVisible(true);
      setImageSrc((entry?.target as HTMLElement)?.dataset.src || '');
    }
  }, [entry, carouselIndex, index, image]);

  const imageUrl = typeof image === 'object' ? image.src : image;

  return (
    <img
      className={`aspect-auto w-100 h-auto ${
        isVisible ? 'visible' : 'invisible'
      }`}
      ref={imageRef}
      src={imageSrc}
      data-src={imageUrl}
      srcset={typeof image === 'object' ? image.srcset : null}
      alt={alt}
    />
  );
};
