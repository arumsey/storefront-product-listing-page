/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Product } from '../../types/interface';

export const sampleProductNoImage: Product = {
  product: {
    __typename: 'SimpleProduct',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    image: null,
    small_image: null,
    thumbnail: null,
    price_range: {
      minimum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 8, currency: 'USD' },
        final_price: { value: 5, currency: 'USD' },
        discount: null,
      },
      maximum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 5, currency: 'USD' },
        final_price: { value: 5, currency: 'USD' },
        discount: null,
      },
    },
    canonical_url:
      '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
  },
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    shortDescription: null,
    attributes: [],
    images: null,
    price: {
      final: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
      regular: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
    },
    url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
    urlKey: 'sprite-foam-yoga-brick',
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};

export const sampleProductDiscounted: Product = {
  product: {
    __typename: 'SimpleProduct',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    image: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    small_image: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    thumbnail: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    price_range: {
      minimum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 8, currency: 'USD' },
        final_price: { value: 5, currency: 'USD' },
        discount: null,
      },
      maximum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 5, currency: 'USD' },
        final_price: { value: 5, currency: 'USD' },
        discount: null,
      },
    },
    canonical_url:
      '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
  },
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    shortDescription: null,
    attributes: [],
    images: [
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
    ],
    price: {
      final: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
      regular: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
    },
    url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
    urlKey: 'sprite-foam-yoga-brick',
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};

export const sampleProductNotDiscounted: Product = {
  product: {
    __typename: 'SimpleProduct',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    image: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    small_image: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    thumbnail: {
      url: '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
      label: null,
      position: null,
      disabled: null,
    },
    price_range: {
      minimum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 5, currency: 'USD' },
        final_price: { value: 5, currency: 'USD' },
        discount: null,
      },
      maximum_price: {
        fixed_product_taxes: null,
        regular_price: { value: 8, currency: 'USD' },
        final_price: { value: 8, currency: 'USD' },
        discount: null,
      },
    },
    canonical_url:
      '//master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
  },
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    shortDescription: null,
    attributes: [],
    images: [
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/media/catalog/product/l/u/luma-yoga-brick.jpg',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
    ],
    price: {
      final: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
      regular: {
        amount: {
          value: 5,
          currency: 'USD',
        },
      },
    },
    url: 'http://master-7rqtwti-eragxvhtzr4am.us-4.magentosite.cloud/sprite-foam-yoga-brick.html',
    urlKey: 'sprite-foam-yoga-brick',
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};
