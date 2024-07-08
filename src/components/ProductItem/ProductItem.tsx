/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import { useCart, useProducts, useSensor, useStore } from '../../context';
import NoImage from '../../icons/NoImage.svg';
import {
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import {
  generateOptimizedImages,
  getProductImageURLs,
  getImageUrl,
} from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { AddToCartButton } from '../AddToCartButton';
import { Image } from '../Image';
import { ImageCarousel } from '../ImageCarousel';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
  setRoute?: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  setCartUpdated: (cartUpdated: boolean) => void;
  setItemAdded: (itemAdded: string) => void;
  setError: (error: boolean) => void;
  addToCart?: (
    sku: string,
    options: [],
    quantity: number
  ) => Promise<void | undefined>;
}

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
  setCartUpdated,
  setItemAdded,
  setError,
  addToCart,
}: ProductProps) => {

  const { product, productView } = item;

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const { addToCartGraphQL, refreshCart } = useCart();
  const { viewType } = useProducts();
  const {
    config: {
      optimizeImages,
      imageBaseWidth,
      imageCarousel,
      listView,
      isSignedIn,
    },
  } = useStore();

  const { screenSize } = useSensor();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    setImagesFromRefinedProduct(data.refineProduct.images);
    setRefinedProduct(data);
    setCarouselIndex(0);
  };

  const isSelected = (id: string) => {
    return selectedSwatch ? selectedSwatch === id : false;
  };

  const productImageArray: string[] = (imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [], imageCarousel ? 3 : 1, undefined)
    : getProductImageURLs(
        productView.images ?? [],
        imageCarousel ? 3 : 1, // number of images to display in carousel
        product.image?.url ?? undefined
      ));

  let optimizedImageArray: { src: string; srcset: any }[] = [];
  if (optimizeImages) {
    optimizedImageArray = generateOptimizedImages(
      productImageArray,
      imageBaseWidth ?? 200
    );
  }

  const productThumbnailUrl = getImageUrl(product.thumbnail);
  let optimizedThumbnailArray: { src: string; srcset: any }[] = [];
  if (productThumbnailUrl) {
    if (optimizeImages) {
      optimizedThumbnailArray = generateOptimizedImages(
        [productThumbnailUrl],
        imageBaseWidth ?? 50
      );
    }
  }

  const isSimple = product?.__typename === 'SimpleProduct';
  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.adobeDataLayer.push((dl: any) => {
      dl.push({
        event: 'search-product-click',
        eventInfo: {
          ...dl.getState(),
          sku: product?.sku,
          searchUnitId: SEARCH_UNIT_ID,
        },
      });
    });
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku, urlKey: productView?.urlKey })
    : product?.canonical_url;

  const productSize = productView?.attributes?.find((attr) => attr.name === 'size');

  const handleAddToCart = async () => {
    setError(false);
    if (isSimple) {
      if (addToCart) {
        //Custom add to cart function passed in
        await addToCart(productView.sku, [], 1);
      } else {
        // Add to cart using GraphQL & Luma extension
        const response = await addToCartGraphQL(productView.sku);

        if (
          response?.errors ||
          response?.data?.addProductsToCart?.user_errors.length > 0
        ) {
          setError(true);
          return;
        }

        setItemAdded(product.name);
        refreshCart && refreshCart();
        setCartUpdated(true);
      }
    } else if (productUrl) {
      window.open(productUrl, '_self');
    }
  };

  if (listView && viewType === 'listview') {
    return (
      <tr>
          <td>
            <div className="flex flex-row gap-[10px] items-center">
              <a
                href={productUrl as string}
                onClick={onProductClick}
                className="!text-primary hover:no-underline hover:text-primary w-[50px]"
                aria-label={product.name}
              >
                {/* Thumbnail */}
                {productThumbnailUrl ? (
                  <Image
                    image={
                    optimizedThumbnailArray.length
                      ? optimizedThumbnailArray[0]
                      : productThumbnailUrl}
                    alt={product.name}
                    size={imageBaseWidth}
                  />
                ) : (
                  <NoImage
                    className={`max-h-[250px] max-w-[200px] pr-5 m-auto object-cover object-center lg:w-full`}
                  />
                )}
              </a>
              <a
                href={productUrl as string}
                onClick={onProductClick}
                className="text-sm text-blue-700 no-underline hover:no-underline text-wrap"
              >
                {productView.name !== null && htmlStringDecode(productView.name)}
              </a>
            </div>
          </td>
          <td>
            <div className="ds-sdk-product-item__product-sku mt-xs text-sm">
              {productSize && htmlStringDecode(productSize.value)}
            </div>
          </td>
          <td>
              <div className="ds-sdk-product-item__product-sku mt-xs text-sm">
                {productView.sku !== null && htmlStringDecode(productView.sku)}
              </div>
          </td>
          <td>
            <ProductPrice
              item={refinedProduct ?? item}
              isBundle={isBundle}
              isGrouped={isGrouped}
              isGiftCard={isGiftCard}
              isConfigurable={isConfigurable}
              isComplexProductView={isComplexProductView}
              discount={false}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </td>
          <td>
            <div className="w-[50px] h-[38px]">
              <AddToCartButton variant={isSignedIn ? 'list' : 'cart'} onClick={handleAddToCart} />
            </div>
          </td>
      </tr>
    );
  }

  return (
    <div
      className="ds-sdk-product-item group relative flex flex-col max-w-sm justify-between h-full hover:border-[1.5px] border-solid hover:shadow-lg border-offset-2 p-2"
      style={{
        'border-color': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <a
        href={productUrl as string}
        onClick={onProductClick}
        className="!text-primary hover:no-underline hover:text-primary"
      >
        <div className="ds-sdk-product-item__main relative flex flex-col justify-between h-full">
          <div className="ds-sdk-product-item__image relative w-full h-full rounded-md overflow-hidden">
            {productImageArray.length ? (
              <ImageCarousel
                images={
                  optimizedImageArray.length
                    ? optimizedImageArray
                    : productImageArray
                }
                productName={product.name}
                carouselIndex={carouselIndex}
                setCarouselIndex={setCarouselIndex}
              />
            ) : (
              <NoImage
                className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
              />
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
                {product.name !== null && htmlStringDecode(product.name)}
              </div>
              <ProductPrice
                item={refinedProduct ?? item}
                isBundle={isBundle}
                isGrouped={isGrouped}
                isGiftCard={isGiftCard}
                isConfigurable={isConfigurable}
                isComplexProductView={isComplexProductView}
                discount={false}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
              />
            </div>

            {/* 
            //TODO: Wishlist button to be added later
            {flags.addToWishlist && widgetConfig.addToWishlist.enabled && (
              // TODO: Remove flag during phase 3 MSRCH-4278
              <div className="ds-sdk-wishlist ml-auto mt-md">
                <WishlistButton
                  productSku={item.product.sku}
                  type={widgetConfig.addToWishlist.placement}
                />
              </div>
            )} */}
          </div>
        </div>
      </a>

      {productView?.options && productView.options?.length > 0 && (
        <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary">
          {productView?.options?.map(
            (swatches) =>
              swatches.id == 'color' && (
                <SwatchButtonGroup
                  key={product?.sku}
                  isSelected={isSelected}
                  swatches={swatches.values ?? []}
                  showMore={onProductClick}
                  productUrl={productUrl as string}
                  onClick={handleSelection}
                  sku={product?.sku}
                />
              )
          )}
        </div>
      )}
        <div className="pb-4 mt-sm">
          {screenSize.mobile && <AddToCartButton onClick={handleAddToCart} />}
          {isHovering && screenSize.desktop && (
            <AddToCartButton onClick={handleAddToCart} />
          )}
        </div>
    </div>
  );
};

export default ProductItem;
