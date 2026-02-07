/**
 * Fixed pool of motivational/support messages for the post-login splash screen.
 * Messages are safety-focused and support legal accountability.
 */
export const POST_LOGIN_SPLASH_MESSAGES = [
  "Send him to jail.",
  "No meant no.",
  "He will pay for what he did.",
  "Don't stop until he is in cuffs.",
  "Your voice matters. Keep going.",
  "Justice is within reach.",
  "You are not alone in this fight.",
  "Every step forward counts.",
  "Your safety comes first.",
  "Document everything. Stay strong.",
  "The truth will prevail.",
  "You deserve justice and peace.",
  "He chose to break the law. Now he faces consequences.",
  "Your evidence will speak in court.",
  "Accountability is coming.",
  "He will answer for his actions.",
  "The law is on your side.",
  "His behavior is criminal. Document it all.",
] as const;

/**
 * Returns a random message from the pool.
 */
export function getRandomSplashMessage(): string {
  const randomIndex = Math.floor(Math.random() * POST_LOGIN_SPLASH_MESSAGES.length);
  return POST_LOGIN_SPLASH_MESSAGES[randomIndex];
}
