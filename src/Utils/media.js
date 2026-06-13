import { BASE_URL } from "../Config/AppConstant";

const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || "http://172.104.206.4:5000/api";

const resolveMediaBaseUrl = () => {
  if (typeof window === "undefined") {
    return BASE_URL;
  }

  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return DEV_API_URL.replace(/\/api$/, "");
  }

  return BASE_URL;
};

const extractAssetValue = (value, visited = new WeakSet()) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = extractAssetValue(item, visited);
      if (resolved) {
        return resolved;
      }
    }
    return null;
  }

  if (typeof value === "object") {
    if (visited.has(value)) {
      return null;
    }

    visited.add(value);

    const candidateValues = [
      value.imageURL ||
      value.imageUrl,
      value.image_url,
      value.iconURL,
      value.iconUrl,
      value.badgeIcon,
      value.badgeImage,
      value.storyImage,
      value.storyImageUrl,
      value.story_image,
      value.story_image_url,
      value.bannerImage,
      value.banner,
      value.bannerUrl,
      value.bannerURL,
      value.coverImage,
      value.cover,
      value.coverUrl,
      value.coverURL,
      value.thumbnail,
      value.thumbnailUrl,
      value.thumbnailURL,
      value.thumbnail_url,
      value.media,
      value.mediaUrl,
      value.mediaURL,
      value.asset,
      value.assetUrl,
      value.assetURL,
      value.file,
      value.fileUrl,
      value.fileURL,
      value.url,
      value.path,
      value.filepath,
      value.filePath,
      value.file_path,
      value.src,
      value.icon,
      value.image,
      value.filename,
      value.fileName,
      value.secure_url,
      value.location,
    ];

    for (const candidate of candidateValues) {
      const resolved = extractAssetValue(candidate, visited);
      if (resolved) {
        return resolved;
      }
    }

    return null;
  }

  return null;
};

export const resolveAssetUrl = (value, uploadsFolder = "uploads") => {
  const asset = extractAssetValue(value);
  const mediaBaseUrl = resolveMediaBaseUrl();

  if (!asset) {
    return null;
  }

  const normalizedAsset = String(asset).trim().replace(/\\/g, "/");

  if (!normalizedAsset) {
    return null;
  }

  // Some API rows contain a duplicated host prefix like:
  // http://hosthttps://real-image-url
  const secondHttpIndex = normalizedAsset.indexOf("http://", 7) >= 0
    ? normalizedAsset.indexOf("http://", 7)
    : normalizedAsset.indexOf("https://", 8);
  const cleanedAsset = secondHttpIndex > 0 ? normalizedAsset.slice(secondHttpIndex) : normalizedAsset;

  if (/^https?:\/\//i.test(cleanedAsset)) {
    return cleanedAsset;
  }

  if (cleanedAsset.startsWith("//")) {
    return `https:${cleanedAsset}`;
  }

  if (cleanedAsset.startsWith("/")) {
    return `${mediaBaseUrl}${cleanedAsset}`;
  }

  if (/^api\/uploads\//i.test(cleanedAsset)) {
    return `${mediaBaseUrl}/${cleanedAsset.replace(/^\/+/, "")}`;
  }

  if (/^uploads\//i.test(cleanedAsset)) {
    return `${mediaBaseUrl}/${cleanedAsset.replace(/^\/+/, "")}`;
  }

  if (cleanedAsset.startsWith(`${uploadsFolder}/`)) {
    return `${mediaBaseUrl}/${cleanedAsset}`;
  }

  return `${mediaBaseUrl}/${uploadsFolder}/${cleanedAsset.replace(/^\/+/, "")}`;
};
