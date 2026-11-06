import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

let directory, child, base;
let serverLogs = '';

before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'mtech-http-'));
  const events = JSON.parse(await readFile('data/events.json', 'utf8'));
  for (const event of events) {
    const delta = event.id === 'premiers-pas-codex' ? -86400000 : 86400000;
    event.startsAt = new Date(Date.now() + delta).toISOString();
    event.endsAt = new Date(Date.now() + delta + 3600000).toISOString();
  }
  await writeFile(join(directory, 'events.json'), JSON.stringify(events));
  await writeFile(join(directory, 'newsletter-settings.json'), JSON.stringify({ organizer: 'Mtech test', contactEmail: 'contact@example.test', retentionMonths: 12 }));
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise(done => probe.close(done));
  base = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, [resolve('dist/server/entry.mjs')], {
    env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), MTECH_DATA_DIR: directory },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', data => { serverLogs += data; });
  child.stderr.on('data', data => { serverLogs += data; });
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(base, { signal: AbortSignal.timeout(1000) })).ok) return; } catch {}
    if (child.exitCode !== null) throw new Error(serverLogs);
    await new Promise(done => setTimeout(done, 50));
  }
  throw new Error(`Serveur indisponible : ${serverLogs}`);
});

after(async () => {
  if (child && child.exitCode === null) { child.kill(); await once(child, 'exit'); }
  if (directory) await rm(directory, { recursive: true, force: true });
});

async function submit(values, headers = {}) {
  return fetch(`${base}/evenements/codex-build-night`, {
    method: 'POST', headers: { Origin: base, ...headers },
    body: new URLSearchParams({ alias: 'visiteur_test', email: 'demo@example.test', demo: 'on', ...values }),
  });
}

test('le catalogue est rendu côté serveur avec titres, métadonnées et liens', async () => {
  const response = await fetch(base);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Les idées se rencontrent/);
  assert.match(html, /lang="fr"/);
  assert.match(html, /name="description"/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.equal((html.match(/class="event-card"/g) || []).length, 4);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('filtres, recherche sans accents, archives et état vide fonctionnent sans JavaScript', async () => {
  const category = await (await fetch(`${base}/?categorie=SEO+%26+GEO`)).text();
  assert.equal((category.match(/class="event-card"/g) || []).length, 1);
  const search = await (await fetch(`${base}/?q=idees`)).text();
  assert.equal((search.match(/class="event-card"/g) || []).length, 1);
  const past = await (await fetch(`${base}/?vue=passes`)).text();
  assert.equal((past.match(/class="event-card"/g) || []).length, 1);
  assert.match(past, /Premiers pas avec Codex/);
  const empty = await (await fetch(`${base}/?q=absent-123456`)).text();
  assert.match(empty, /Aucun rendez-vous/);
  const malicious = await (await fetch(`${base}/?q=%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E`)).text();
  assert.doesNotMatch(malicious.replace(/"[^"]*"/g, '""'), /<script>alert\(1\)<\/script>/);
});

test('le formulaire HTML enregistre réellement une inscription sans JavaScript', async () => {
  const response = await submit({});
  assert.equal(response.status, 200);
  assert.match(await response.text(), /C’est enregistré/);
  const rows = JSON.parse(await readFile(join(directory, 'registrations.json'), 'utf8'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].eventId, 'codex-build-night');
  assert.equal(rows[0].email, 'demo@example.test');
  const page = await (await fetch(`${base}/evenements/codex-build-night`)).text();
  assert.match(page, /29 disponibles/);
  assert.doesNotMatch(page, /demo@example\.test/);
});

test('le doublon est refusé avec un message accessible et sans perte des champs', async () => {
  const response = await submit({});
  assert.equal(response.status, 409);
  const html = await response.text();
  assert.match(html, /déjà inscrite/);
  assert.match(html, /role="alert"/);
  assert.match(html, /value="visiteur_test"/);
});

test('une adresse réelle est refusée côté serveur', async () => {
  const response = await submit({ email: 'personne@gmail.com' });
  assert.equal(response.status, 400);
  assert.match(await response.text(), /Utilisez une adresse fictive/);
});

test('les requêtes provenant d’une autre origine sont refusées', async () => {
  const response = await submit({ email: 'csrf@example.test' }, { Origin: 'https://other.example.test' });
  assert.equal(response.status, 403);
});

test('un formulaire trop volumineux est refusé', async () => {
  const response = await submit({ alias: 'x'.repeat(5000), email: 'large@example.test' });
  assert.equal(response.status, 413);
});

test('les fichiers privés, routes absentes et événements inconnus renvoient 404', async () => {
  for (const path of ['/data/registrations.json', '/data/events.json', '/data/newsletter.json', '/data/newsletter-settings.json', '/page-absente', '/evenements/inconnu']) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(await response.text(), /demo@example\.test/);
  }
});

test('les pages à propos et archives sont consultables, les inscriptions passées sont fermées', async () => {
  assert.equal((await fetch(`${base}/a-propos`)).status, 200);
  const page = await (await fetch(`${base}/evenements/premiers-pas-codex`)).text();
  assert.match(page, /Ce rendez-vous est terminé/);
  assert.doesNotMatch(page, /<form[^>]*data-registration-form/);
});

async function getHumanChallenge() {
  const page = await fetch(`${base}/newsletter`);
  const html = await page.text();
  const humanId = html.match(/name="humanId" value="([^"]+)"/)?.[1];
  const numbers = html.match(/Combien font (\d+) \+ (\d+) \?/);
  assert.ok(humanId && numbers, 'Une question doit être disponible.');
  const cookie = page.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie);
  return { humanId, humanAnswer: String(Number(numbers[1]) + Number(numbers[2])), cookie };
}

async function submitNewsletter(values = {}, headers = {}) {
  const { humanId, humanAnswer, cookie } = await getHumanChallenge();
  return fetch(`${base}/newsletter`, {
    method: 'POST', headers: { Origin: base, Cookie: cookie, ...headers },
    body: new URLSearchParams({ email: 'newsletter@example.test', consent: 'on', humanId, humanAnswer, ...values }),
  });
}

test('newsletter : page, consentement séparé, clavier e-mail et lien de confidentialité', async () => {
  const html = await (await fetch(`${base}/newsletter`)).text();
  assert.match(html, /Votre adresse e-mail/);
  assert.match(html, /inputmode="email"/);
  assert.match(html, /autocomplete="email"/);
  assert.match(html, /href="\/confidentialite"/);
  assert.doesNotMatch(html, /type="checkbox"[^>]*checked/);
  assert.match(html, /n’est pas encore activé/);
  assert.match(html, /<legend>Vérification humaine<\/legend>/);
  assert.match(html, /name="humanAnswer"/);
  const notice = await (await fetch(`${base}/confidentialite`)).text();
  assert.match(notice, /contact@example.test/);
  assert.match(notice, /12 mois/);
});

test('newsletter : enregistrement sans JavaScript, distinct des événements, sans adresse dans la confirmation', async () => {
  const response = await submitNewsletter();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Votre demande est enregistrée/);
  assert.doesNotMatch(html, /newsletter@example.test/);
  const rows = JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].email, 'newsletter@example.test');
  assert.equal(JSON.parse(await readFile(join(directory, 'registrations.json'), 'utf8')).length, 1);
});

test('newsletter : un doublon donne la même confirmation sans exposer l’existence de l’adresse', async () => {
  const response = await submitNewsletter({ email: 'NEWSLETTER@example.test' });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Votre demande est enregistrée/);
  assert.equal(JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8')).length, 1);
});

test('newsletter : absence de consentement et saisie invalide sont refusées avec champs préservés', async () => {
  const response = await submitNewsletter({ consent: '', email: 'another@example.test' });
  assert.equal(response.status, 400);
  const html = await response.text();
  assert.match(html, /role="alert"/);
  assert.match(html, /value="another@example.test"/);
  const invalid = await submitNewsletter({ email: 'bad-address' });
  assert.equal(invalid.status, 400);
  assert.match(await invalid.text(), /adresse e-mail valide/);
});

test('newsletter : requête étrangère et formulaire trop gros refusés', async () => {
  assert.equal((await submitNewsletter({}, { Origin: 'https://foreign.example.test' })).status, 403);
  assert.equal((await submitNewsletter({ email: 'x'.repeat(5000) })).status, 413);
  assert.equal(JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8')).length, 1);
});

test('newsletter : réponse humaine absente ou fausse refuse toute écriture et propose une nouvelle question', async () => {
  const path = join(directory, 'newsletter.json');
  const before = await readFile(path, 'utf8');
  for (const humanAnswer of ['', '99']) {
    const response = await submitNewsletter({ email: 'blocked@example.test', humanAnswer });
    assert.equal(response.status, 400);
    const html = await response.text();
    assert.match(html, /vérification humaine est incorrecte/);
    assert.match(html, /value="blocked@example.test"/);
    assert.match(html, /name="humanAnswer"[^>]*aria-invalid="true"/);
    assert.match(html, /Combien font/);
  }
  assert.equal(await readFile(path, 'utf8'), before);
});

test('newsletter : cookie humain temporaire, HttpOnly et SameSite Strict ; absence de cookie refusée', async () => {
  const page = await fetch(`${base}/newsletter`);
  const cookie = page.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Strict/i);
  assert.match(cookie, /Max-Age=600/i);
  const response = await submitNewsletter({ email: 'no-cookie@example.test' }, { Cookie: '' });
  assert.equal(response.status, 400);
  assert.match(await response.text(), /expiré ou est absente/);
});

test('newsletter : une question déjà utilisée ne peut pas inscrire une autre adresse', async () => {
  const challenge = await getHumanChallenge();
  const post = email => fetch(`${base}/newsletter`, {
    method: 'POST', headers: { Origin: base, Cookie: challenge.cookie },
    body: new URLSearchParams({ email, consent: 'on', humanId: challenge.humanId, humanAnswer: challenge.humanAnswer }),
  });
  const valid = await post('newsletter@example.test');
  assert.equal(valid.status, 200);
  const deletion = valid.headers.get('set-cookie');
  assert.match(deletion, /mtech_newsletter_challenge=deleted/);
  assert.ok(Date.parse(deletion.match(/Expires=([^;]+)/i)[1]) < Date.now());
  const replay = await post('replayed@example.test');
  assert.equal(replay.status, 400);
  assert.match(await replay.text(), /plus disponible/);
  assert.equal(JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8')).length, 1);
});

test('newsletter : nettoyage des expirés à la visite et erreur de stockage sans fuite', async () => {
  const path = join(directory, 'newsletter.json');
  const rows = JSON.parse(await readFile(path, 'utf8'));
  rows[0].expiresAt = '2020-01-01T00:00:00Z';
  await writeFile(path, JSON.stringify(rows));
  assert.equal((await fetch(`${base}/newsletter`)).status, 200);
  assert.deepEqual(JSON.parse(await readFile(path, 'utf8')), []);
  await writeFile(path, '{broken');
  const response = await fetch(`${base}/newsletter`);
  assert.equal(response.status, 503);
  const html = await response.text();
  assert.match(html, /momentanément indisponibles/);
  assert.doesNotMatch(html, /<form/);
  assert.equal(await readFile(path, 'utf8'), '{broken');
});
