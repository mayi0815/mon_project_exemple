import { readFile, writeFile, rename, open, unlink, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';

/** @typedef {{id:string,title:string,subtitle:string,category:string,format:string,startsAt:string,endsAt:string,location:string,capacity:number,theme:string,art:string,featured:boolean,description:string,agenda:string[],bring:string}} Event */
/** @typedef {{id:string,eventId:string,alias:string,email:string,createdAt:string}} Registration */

export class RegistrationError extends Error {
  /** @param {string} message @param {number} [status] */
  constructor(message, status = 400) { super(message); this.status = status; }
}

/** @param {string} [directory] */
export function createStore(directory = process.env.MTECH_DATA_DIR || resolve('data')) {
  const eventsPath = join(directory, 'events.json');
  const registrationsPath = join(directory, 'registrations.json');

  /** @returns {Promise<Event[]>} */
  async function events() {
    const data = JSON.parse(await readFile(eventsPath, 'utf8'));
    if (!Array.isArray(data)) throw new Error('events.json doit contenir une liste.');
    const ids = new Set();
    for (const item of data) {
      const strings = ['id', 'title', 'subtitle', 'category', 'format', 'location', 'description', 'bring'];
      if (!item || strings.some(key => typeof item[key] !== 'string' || !item[key].trim()) ||
          !/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id) ||
          !Number.isFinite(Date.parse(item.startsAt)) || !Number.isFinite(Date.parse(item.endsAt)) ||
          Date.parse(item.endsAt) <= Date.parse(item.startsAt) ||
          !Number.isInteger(item.capacity) || item.capacity < 1 ||
          !['violet', 'peach', 'lime', 'blue'].includes(item.theme) ||
          !['build', 'spark', 'orbit', 'blocks'].includes(item.art) ||
          typeof item.featured !== 'boolean' || !Array.isArray(item.agenda) ||
          item.agenda.some(/** @param {unknown} value */ value => typeof value !== 'string')) {
        throw new Error('Un événement est invalide dans events.json.');
      }
      ids.add(item.id);
    }
    return data.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  }

  /** @returns {Promise<Registration[]>} */
  async function registrations() {
    try {
      const data = JSON.parse(await readFile(registrationsPath, 'utf8'));
      if (!Array.isArray(data) || data.some(item => !item ||
        ['id', 'eventId', 'alias', 'email', 'createdAt'].some(key => typeof item[key] !== 'string'))) {
        throw new Error('registrations.json est invalide.');
      }
      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return [];
      throw error;
    }
  }

  /** @param {string} eventId @param {unknown} aliasInput @param {unknown} emailInput @param {unknown} consent */
  async function register(eventId, aliasInput, emailInput, consent) {
    const alias = typeof aliasInput === 'string' ? aliasInput.trim() : '';
    const email = typeof emailInput === 'string' ? emailInput.trim().toLowerCase() : '';
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) throw new RegistrationError('Choisissez un pseudo fictif de 3 à 30 caractères (lettres, chiffres, tirets).');
    if (!/^[a-z0-9][a-z0-9._+-]{0,63}@example\.test$/.test(email)) throw new RegistrationError('Utilisez une adresse fictive en @example.test, par exemple curieux@example.test.');
    if (consent !== 'on') throw new RegistrationError('Confirmez l’utilisation de données fictives.');

    await mkdir(directory, { recursive: true });
    const lockPath = join(directory, 'registrations.lock');
    let lock;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { lock = await open(lockPath, 'wx', 0o600); break; }
      catch (error) {
        if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'EEXIST') throw error;
        await new Promise(done => setTimeout(done, 10));
      }
    }
    if (!lock) throw new RegistrationError('Une autre inscription est en cours. Réessayez dans un instant.', 503);
    const tempPath = join(directory, `registrations-${randomUUID()}.tmp`);
    try {
      const event = (await events()).find(item => item.id === eventId);
      if (!event) throw new RegistrationError('Cet événement est introuvable.', 404);
      if (Date.parse(event.startsAt) <= Date.now()) throw new RegistrationError('Les inscriptions à cet événement sont terminées.', 409);
      const rows = await registrations();
      if (rows.some(row => row.eventId === eventId && row.email === email)) throw new RegistrationError('Cette adresse de test est déjà inscrite à cet événement.', 409);
      if (rows.filter(row => row.eventId === eventId).length >= event.capacity) throw new RegistrationError('Cet événement est complet.', 409);
      const registration = { id: randomUUID(), eventId, alias, email, createdAt: new Date().toISOString() };
      rows.push(registration);
      await writeFile(tempPath, JSON.stringify(rows, null, 2) + '\n', { mode: 0o600 });
      await rename(tempPath, registrationsPath);
      return registration;
    } finally {
      await unlink(tempPath).catch(error => { if (error.code !== 'ENOENT') console.error('Nettoyage temporaire impossible.'); });
      await lock.close();
      await unlink(lockPath);
    }
  }
  return { events, registrations, register };
}

export const store = createStore();
