import env from "@/config/env";

export function buildUrl(path: string): string {
  // If the path is already a full URL, use it as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = (env.API_URL || "https://api-merchants.flowsky.co").replace(
    /\/+$/,
    "",
  );
  const cleanPath = path.replace(/^\/+/, "");

  return `${baseUrl}/${cleanPath}`;
}
