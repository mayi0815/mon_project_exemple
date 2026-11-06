import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHumanVerification, HUMAN_TTL_SECONDS } from '../src/server/human-verification.mjs';

function answer(challenge) {
  const [, left, right] = challenge.question.match(/(\d+) \+ (\d+)/);
  return String(Number(left) + Number(right));
}

test('vérification humaine : réponse correcte acceptée une seule fois', () => {
  const verifier = createHumanVerification();
  const challenge = verifier.issue();
  assert.deepEqual(Object.keys(challenge).sort(), ['id', 'question']);
  verifier.verify(challenge.id, answer(challenge), challenge.id);
  assert.throws(() => verifier.verify(challenge.id, answer(challenge), challenge.id), /plus disponible/);
});

test('vérification humaine : réponse fausse ou absente refusée et question consommée', () => {
  const verifier = createHumanVerification();
  for (const value of ['99', '', null, '1e1', '<script>', '000']) {
    const challenge = verifier.issue();
    assert.throws(() => verifier.verify(challenge.id, value, challenge.id), /incorrecte/);
    assert.throws(() => verifier.verify(challenge.id, answer(challenge), challenge.id), /plus disponible/);
  }
});

test('vérification humaine : identifiant inventé et cookie d’un autre navigateur refusés', () => {
  const verifier = createHumanVerification();
  const challenge = verifier.issue();
  for (const cookie of [null, '', 'other-browser']) {
    assert.throws(() => verifier.verify(challenge.id, answer(challenge), cookie), /absente/);
  }
  assert.throws(() => verifier.verify('invented-id', '5', 'invented-id'), /plus disponible/);
  verifier.verify(challenge.id, answer(challenge), challenge.id);
});

test('vérification humaine : expiration au bout de dix minutes', () => {
  let clock = 1000;
  const verifier = createHumanVerification({ now: () => clock });
  const challenge = verifier.issue();
  clock += HUMAN_TTL_SECONDS * 1000;
  assert.throws(() => verifier.verify(challenge.id, answer(challenge), challenge.id), /expiré/);
  const fresh = verifier.issue();
  verifier.verify(fresh.id, answer(fresh), fresh.id);
});

test('vérification humaine : mémoire bornée et anciennes questions nettoyées', () => {
  let clock = 1000;
  const verifier = createHumanVerification({ maxChallenges: 2, now: () => clock });
  const oldest = verifier.issue();
  const second = verifier.issue();
  const latest = verifier.issue();
  assert.throws(() => verifier.verify(oldest.id, answer(oldest), oldest.id), /plus disponible/);
  verifier.verify(second.id, answer(second), second.id);
  clock += HUMAN_TTL_SECONDS * 1000;
  verifier.issue();
  assert.throws(() => verifier.verify(latest.id, answer(latest), latest.id), /plus disponible/);
});
