import { resolveAssetUrl } from "./media";

export const getProductImageSource = (product) => {
  return resolveAssetUrl(
    product?.image ||
      product?.images ||
      product?.productImage ||
      product?.productImages ||
      product?.thumbnail ||
      product?.file
  );
};

export const getProductImageFallbackLabel = (product) => {
  const name = String(product?.name || "Product").trim();

  if (!name) {
    return "PRD";
  }

  const words = name.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
  }

  return name.slice(0, 3).toUpperCase();
};
