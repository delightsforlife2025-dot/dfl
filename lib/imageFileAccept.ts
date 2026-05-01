/** Extensions we allow for logo / favicon / menu images (MIME is often wrong for .ico). */
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)$/i;

export function isLikelyImageFile(file: File): boolean {
  const t = file.type.toLowerCase();
  if (t.startsWith("image/")) return true;
  if (t === "image/x-icon" || t === "image/vnd.microsoft.icon") return true;
  if (t === "application/octet-stream" && IMAGE_EXT_RE.test(file.name)) return true;
  return IMAGE_EXT_RE.test(file.name);
}

export function contentTypeForImageFile(file: File, extLower: string): string {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    avif: "image/avif",
    bmp: "image/bmp",
  };
  return map[extLower] || "application/octet-stream";
}
