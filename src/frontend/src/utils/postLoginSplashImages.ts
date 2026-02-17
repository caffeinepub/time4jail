/**
 * Pool of generated mugshot-style fallback images for the post-login splash screen.
 * Used when no motivational video is available or when video fails to load.
 */
const MUGSHOT_IMAGES = [
  '/assets/generated/mugshot-1.dim_1024x1024.png',
  '/assets/generated/mugshot-2.dim_1024x1024.png',
  '/assets/generated/mugshot-3.dim_1024x1024.png',
  '/assets/generated/mugshot-4.dim_1024x1024.png',
  '/assets/generated/mugshot-5.dim_1024x1024.png',
  '/assets/generated/mugshot-6.dim_1024x1024.png',
] as const;

/**
 * Returns a random mugshot image path from the pool.
 */
export function getRandomMugshotImage(): string {
  const randomIndex = Math.floor(Math.random() * MUGSHOT_IMAGES.length);
  return MUGSHOT_IMAGES[randomIndex];
}
