import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createNewsletterStore, expiryDate, NEWSLETTER_CONSENT_VERSION } from '../src/server/newsletter.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'mtech-newsletter-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'newsletter-settings.json'), JSON.stringify({ organizer: 'Mtech test', contactEmail: 'contact@example.test', retentionMonths: 12 }));
  return { directory, store: createNewsletterStore(directory) };
}

test('newsletter : persistance, consentement et expiration de 12 mois', async t => {
  const { directory, store } = await fixture(t);
  await store.subscribe('  Curieux@Example.test  ', 'on');
  const [row] = JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8'));
  assert.equal(row.email, 'curieux@example.test');
  assert.equal(row.consent.version, NEWSLETTER_CONSENT_VERSION);
  assert.equal(row.consent.acceptedAt, row.createdAt);
  assert.equal(row.expiresAt, expiryDate(new Date(row.createdAt), 12));
  assert.deepEqual(await createNewsletterStore(directory).purgeExpired(), { removed: 0, active: 1 });
  assert.equal((await stat(join(directory, 'newsletter.json'))).mode & 0o777, 0o600);
});

test('newsletter : accepte les domaines usuels sans envoyer ni conserver de véritables données', async t => {
  const { store } = await fixture(t);
  // Invalid consent deliberately blocks persistence after email validation.
  await assert.rejects(store.subscribe('newsletter-format-check@gmail.com', null), /Cochez la case/);
});

test('newsletter : refus des adresses invalides et du consentement absent', async t => {
  const { directory, store } = await fixture(t);
  for (const email of ['', null, 'bad', 'a@b', 'a@@example.test', '<script>@example.test', 'a\nb@example.test', 'x'.repeat(260) + '@example.test']) {
    await assert.rejects(store.subscribe(email, 'on'));
  }
  await assert.rejects(store.subscribe('demo@example.test', 'off'), /Cochez la case/);
  await assert.rejects(readFile(join(directory, 'newsletter.json')), { code: 'ENOENT' });
});

test('newsletter : les doublons concurrents ne créent qu’un abonnement et ne prolongent pas sa durée', async t => {
  const { directory } = await fixture(t);
  const subscribe = () => createNewsletterStore(directory).subscribe('same@example.test', 'on');
  await Promise.all(Array.from({ length: 10 }, subscribe));
  const before = await readFile(join(directory, 'newsletter.json'), 'utf8');
  assert.equal(JSON.parse(before).length, 1);
  await subscribe();
  assert.equal(await readFile(join(directory, 'newsletter.json'), 'utf8'), before);
});

test('newsletter : les écritures simultanées conservent toutes les adresses distinctes', async t => {
  const { directory } = await fixture(t);
  await Promise.all(Array.from({ length: 10 }, (_, i) => createNewsletterStore(directory).subscribe(`test${i}@example.test`, 'on')));
  assert.equal(JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8')).length, 10);
});

test('newsletter : nettoyage des expirés et réinscription avec nouveau consentement', async t => {
  const { directory, store } = await fixture(t);
  await store.subscribe('old@example.test', 'on');
  const path = join(directory, 'newsletter.json');
  const rows = JSON.parse(await readFile(path, 'utf8'));
  const oldId = rows[0].id;
  rows[0].expiresAt = '2020-01-01T00:00:00.000Z';
  await writeFile(path, JSON.stringify(rows));
  await store.subscribe('active@example.test', 'on');
  assert.equal(JSON.parse(await readFile(path, 'utf8')).length, 1);
  await store.subscribe('old@example.test', 'on');
  const fresh = JSON.parse(await readFile(path, 'utf8')).find(row => row.email === 'old@example.test');
  assert.notEqual(fresh.id, oldId);
  const all = JSON.parse(await readFile(path, 'utf8'));
  all[0].expiresAt = '2020-01-01T00:00:00.000Z';
  await writeFile(path, JSON.stringify(all));
  assert.deepEqual(await store.purgeExpired(), { removed: 1, active: 1 });
});

test('newsletter : un fichier corrompu est préservé et le verrou est libéré après erreur', async t => {
  const { directory, store } = await fixture(t);
  const path = join(directory, 'newsletter.json');
  await writeFile(path, '{broken');
  await assert.rejects(store.subscribe('demo@example.test', 'on'));
  assert.equal(await readFile(path, 'utf8'), '{broken');
  await assert.rejects(store.purgeExpired());
  await writeFile(path, '[]');
  await store.subscribe('demo@example.test', 'on');
});

test('newsletter : coordonnées et durée manquantes bloquent la collecte', async t => {
  const { directory, store } = await fixture(t);
  await writeFile(join(directory, 'newsletter-settings.json'), '{}');
  await assert.rejects(store.subscribe('demo@example.test', 'on'), /configurer/);
  await assert.rejects(readFile(join(directory, 'newsletter.json')), { code: 'ENOENT' });
});

test('newsletter : les mois calendaires respectent les fins de mois et années bissextiles', () => {
  assert.equal(expiryDate(new Date('2026-01-31T12:00:00Z'), 1), '2026-02-28T12:00:00.000Z');
  assert.equal(expiryDate(new Date('2024-02-29T12:00:00Z'), 12), '2025-02-28T12:00:00.000Z');
  assert.equal(expiryDate(new Date('2026-11-06T12:00:00Z'), 12), '2027-11-06T12:00:00.000Z');
});

test('newsletter : la commande d’entretien nettoie sans afficher d’adresse e-mail', async t => {
  const { directory, store } = await fixture(t);
  await store.subscribe('expired@example.test', 'on');
  const path = join(directory, 'newsletter.json');
  const rows = JSON.parse(await readFile(path, 'utf8'));
  rows[0].expiresAt = '2020-01-01T00:00:00.000Z';
  await writeFile(path, JSON.stringify(rows));
  const result = await promisify(execFile)(process.execPath, ['scripts/newsletter-purge.mjs'], {
    env: { ...process.env, MTECH_DATA_DIR: directory },
  });
  assert.match(result.stdout, /1 adresse\(s\) expirée\(s\) supprimée\(s\), 0 abonnement\(s\) actif\(s\)/);
  assert.doesNotMatch(result.stdout, /@/);
  assert.deepEqual(JSON.parse(await readFile(path, 'utf8')), []);
});
