import { randomInt, randomUUID } from 'node:crypto';
import { RegistrationError } from './store.mjs';

export const HUMAN_COOKIE = 'mtech_newsletter_challenge';
export const HUMAN_TTL_SECONDS = 600;

/**
 * Lightweight local challenge, not a guarantee that the visitor is human.
 * Answers stay server-side, expire and are consumed on the first attempt.
 * @param {{now?: () => number, maxChallenges?: number}} [options]
 */
export function createHumanVerification({ now = Date.now, maxChallenges = 1000 } = {}) {
  /** @type {Map<string, {answer: string, expiresAt: number}>} */
  const challenges = new Map();

  function issue() {
    const currentTime = now();
    for (const [id, challenge] of challenges) {
      if (challenge.expiresAt <= currentTime) challenges.delete(id);
    }
    // Bound memory even when visitors request many forms without submitting.
    while (challenges.size >= maxChallenges) {
      const oldest = challenges.keys().next().value;
      if (oldest === undefined) break;
      challenges.delete(oldest);
    }
    const left = randomInt(2, 10);
    const right = randomInt(1, 10);
    const id = randomUUID();
    challenges.set(id, { answer: String(left + right), expiresAt: currentTime + HUMAN_TTL_SECONDS * 1000 });
    return { id, question: `Combien font ${left} + ${right} ?` };
  }

  /** @param {unknown} id @param {unknown} answer @param {unknown} cookieId */
  function verify(id, answer, cookieId) {
    if (typeof id !== 'string' || !id || cookieId !== id) {
      throw new RegistrationError('La vérification humaine a expiré ou est absente. Répondez à la nouvelle question.');
    }
    const challenge = challenges.get(id);
    if (!challenge) {
      throw new RegistrationError('Cette vérification humaine n’est plus disponible. Répondez à la nouvelle question.');
    }
    challenges.delete(id);
    if (challenge.expiresAt <= now()) {
      throw new RegistrationError('La vérification humaine a expiré. Répondez à la nouvelle question.');
    }
    const value = typeof answer === 'string' ? answer.trim() : '';
    if (!/^[0-9]{1,2}$/.test(value) || String(Number(value)) !== challenge.answer) {
      throw new RegistrationError('La réponse à la vérification humaine est incorrecte. Essayez la nouvelle question.');
    }
  }
  return { issue, verify };
}

export const humanVerification = createHumanVerification();
