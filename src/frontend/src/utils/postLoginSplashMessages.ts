/**
 * Fixed pool of motivational/support messages for the post-login splash screen.
 * Messages are intensely focused on accountability, consequences, and justice.
 */
export const POST_LOGIN_SPLASH_MESSAGES = [
  "Send him to jail.",
  "No meant no.",
  "He will pay for what he did.",
  "Don't stop until he is in cuffs.",
  "His freedom ends when justice begins.",
  "Every stalker belongs behind bars.",
  "He thought he could get away with it. He was wrong.",
  "Document. Report. Prosecute. Repeat.",
  "His mugshot is coming.",
  "Zero tolerance. Maximum consequences.",
  "He crossed the line. Now he faces the law.",
  "Stalkers don't deserve second chances.",
  "Your evidence will put him away.",
  "He made his choice. Now he gets his sentence.",
  "The cage is waiting for him.",
  "His criminal record starts now.",
  "He terrorized you. Now the system terrorizes him.",
  "Prison orange will suit him perfectly.",
  "He violated your boundaries. Now he loses his freedom.",
  "Every text, every call, every threat—all evidence for his conviction.",
  "His intimidation ends. Your justice begins.",
  "He thought he was untouchable. The law disagrees.",
  "Restraining orders are just the beginning.",
  "He'll have plenty of time to think about his actions—in a cell.",
  "Your safety matters more than his freedom.",
  "He chose to be a predator. Society chooses to lock him up.",
  "The only place he belongs is behind bars.",
  "His harassment stops when the handcuffs click.",
] as const;

/**
 * Returns a random message from the pool.
 */
export function getRandomSplashMessage(): string {
  const randomIndex = Math.floor(Math.random() * POST_LOGIN_SPLASH_MESSAGES.length);
  return POST_LOGIN_SPLASH_MESSAGES[randomIndex];
}
