import { useEffect, useRef, useState } from 'preact/compat';

import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

export const Image = ({
  image,
  alt,
                        baseWidth
}: {
  image: { src: string; srcset: any } | string;
  alt: string;
  baseWidth?: number;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState('');
  const entry = useIntersectionObserver(imageRef, { rootMargin: '200px' });

  useEffect(() => {
    if (!entry) return;

    if (entry?.isIntersecting) {
      setImageSrc((entry?.target as HTMLElement)?.dataset.src || '');
    }
  }, [entry, image]);

  const imageUrl = typeof image === 'object' ? image.src : image;

  return (
    <img
      className={`aspect-auto w-100 h-auto`}
      ref={imageRef}
      src={imageSrc}
      data-src={imageUrl}
      srcset={typeof image === 'object' ? image.srcset : null}
      alt={alt}
      width={baseWidth}
      height={baseWidth}
    />
  );
};
