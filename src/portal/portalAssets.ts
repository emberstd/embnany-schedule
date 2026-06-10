/** Bump when replacing icons in /public/icons to bust browser cache. */
export const PORTAL_ICON_VERSION = "1";

export function portalIcon(path: string) {
  return `${path}?v=${PORTAL_ICON_VERSION}`;
}
