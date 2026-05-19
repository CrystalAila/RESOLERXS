import { useEffect, useState, type FC } from "react";
import ProductService from "../../services/ProductService";

interface ProductImageProps {
  productId: number;
  hasImage?: boolean;
  alt: string;
  className?: string;
}

const ProductImage: FC<ProductImageProps> = ({
  productId,
  hasImage,
  alt,
  className = "h-12 w-12 rounded-lg object-cover",
}) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!hasImage) {
      setSrc(null);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    ProductService.getProductImage(productId)
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [productId, hasImage]);

  if (!hasImage || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-rx-border bg-rx-bg text-xs font-bold uppercase text-rx-muted ${className}`}
      >
        {alt.charAt(0)}
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

export default ProductImage;
