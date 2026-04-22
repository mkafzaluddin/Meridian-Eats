const images = import.meta.glob("../assets/*.png", { eager: true });

export function getImage(filename) {
  // If it's already a full URL (Cloudinary), use it directly
  if (filename && filename.startsWith("http")) {
    return filename;
  }

  // Otherwise look up local asset
  const key = `../assets/${filename}`;
  return images[key]?.default ?? "";
}
