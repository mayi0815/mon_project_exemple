import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore, RegistrationError } from '../src/server/store.mjs';

async function fixture(t, capacity = 3) {
  const directory = await mkdtemp(join(tmpdir(), 'mtech-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const events = [{ id: 'atelier-test', title: 'Atelier test', subtitle: 'Fictif', category: 'Codex & IA', format: 'Atelier',
    startsAt: new Date(Date.now() + 86400000).toISOString(), endsAt: new Date(Date.now() + 90000000).toISOString(),
    location: 'Paris fictif', capacity, theme: 'violet', art: 'build', featured: true, description: 'Test', agenda: ['Accueil'], bring: 'Curiosité' }];
  await writeFile(join(directory, 'events.json'), JSON.stringify(events));
  return { directory, events, store: createStore(directory) };
}

test('une inscription est écrite sur disque et relue par une nouvelle instance', async t => {
  const { directory, store } = await fixture(t);
  assert.deepEqual(await store.registrations(), []);
  const result = await store.register('atelier-test', 'visiteur_test', 'DEMO@example.test', 'on');
  assert.equal(result.email, 'demo@example.test');
  assert.ok(result.id);
  assert.equal((await createStore(directory).registrations())[0].id, result.id);
  assert.equal(JSON.parse(await readFile(join(directory, 'registrations.json'), 'utf8')).length, 1);
});

test('un doublon est refusé même avec une casse différente', async t => {
  const { store } = await fixture(t);
  await store.register('atelier-test', 'test_01', 'demo@example.test', 'on');
  await assert.rejects(store.register('atelier-test', 'test_02', 'DEMO@example.test', 'on'), { status: 409 });
  assert.equal((await store.registrations()).length, 1);
});

test('les écritures concurrentes de plusieurs instances respectent la capacité', async t => {
  const { directory, store } = await fixture(t, 2);
  const results = await Promise.allSettled(Array.from({ length: 12 }, (_, i) =>
    createStore(directory).register('atelier-test', `test_${i}`, `test${i}@example.test`, 'on')));
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 2);
  assert.equal((await store.registrations()).length, 2);
  assert.ok(results.filter(result => result.status === 'rejected').every(result => result.reason.status === 409));
});

test('les doublons concurrents ne créent qu’une inscription', async t => {
  const { directory, store } = await fixture(t, 20);
  const results = await Promise.allSettled(Array.from({ length: 8 }, () =>
    createStore(directory).register('atelier-test', 'test_01', 'same@example.test', 'on')));
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal((await store.registrations()).length, 1);
});

test('aucune adresse réelle, saisie invalide ou absence de consentement n’est acceptée', async t => {
  const { store } = await fixture(t);
  for (const values of [
    ['test_01', 'personne@gmail.com', 'on'], ['x', 'test@example.test', 'on'],
    ['<script>', 'test@example.test', 'on'], ['test_01', 'test@example.test.evil', 'on'],
    ['test_01', 'test@example.test', null], [null, null, 'on'],
  ]) await assert.rejects(store.register('atelier-test', ...values), RegistrationError);
  assert.deepEqual(await store.registrations(), []);
});

test('un événement inexistant ne reçoit pas d’inscription', async t => {
  const { store } = await fixture(t);
  await assert.rejects(store.register('../../elsewhere', 'test_01', 'test@example.test', 'on'), { status: 404 });
  assert.deepEqual(await store.registrations(), []);
});

test('un événement commencé refuse les inscriptions', async t => {
  const { directory, events, store } = await fixture(t);
  events[0].startsAt = new Date(Date.now() - 3600000).toISOString();
  await writeFile(join(directory, 'events.json'), JSON.stringify(events));
  await assert.rejects(store.register('atelier-test', 'test_01', 'test@example.test', 'on'), { status: 409 });
});

test('un fichier d’inscriptions corrompu n’est jamais remplacé silencieusement', async t => {
  const { directory, store } = await fixture(t);
  const path = join(directory, 'registrations.json');
  await writeFile(path, '{invalid');
  await assert.rejects(store.register('atelier-test', 'test_01', 'test@example.test', 'on'));
  assert.equal(await readFile(path, 'utf8'), '{invalid');
  await writeFile(path, '[]');
  await store.register('atelier-test', 'test_01', 'test@example.test', 'on');
  assert.equal((await store.registrations()).length, 1);
});

test('les événements invalides et identifiants dupliqués sont détectés', async t => {
  const { directory, events, store } = await fixture(t);
  await writeFile(join(directory, 'events.json'), JSON.stringify([...events, ...events]));
  await assert.rejects(store.events(), /invalide/);
  events[0].capacity = -1;
  await writeFile(join(directory, 'events.json'), JSON.stringify(events));
  await assert.rejects(store.events(), /invalide/);
});
