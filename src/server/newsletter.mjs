import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'astro/zod';
import { RegistrationError } from './store.mjs';
import { withFileLock, writeJsonAtomically } from './json-file.mjs';

export const NEWSLETTER_CONSENT_VERSION = 'newsletter-v1-2026-11-06';
/** @typedef {{organizer:string,contactEmail:string,retentionMonths:number}} NewsletterSettings */
/** @typedef {{id:string,email:string,createdAt:string,expiresAt:string,consent:{version:string,acceptedAt:string,purpose:string}}} Subscriber */
const emailSchema = z.email().max(254);

/** Calendar months, clamped to the last day of the target month. @param {Date} date @param {number} months */
export function expiryDate(date, months) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const end = new Date(result);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  result.setUTCDate(Math.min(day, end.getUTCDate()));
  return result.toISOString();
}

/** @param {string} [directory] */
export function createNewsletterStore(directory = process.env.MTECH_DATA_DIR || resolve('data')) {
  /** @returns {Promise<NewsletterSettings>} */
  async function settings() {
    const value = JSON.parse(await readFile(join(directory, 'newsletter-settings.json'), 'utf8'));
    if (!value || typeof value.organizer !== 'string' || !value.organizer.trim() ||
        !emailSchema.safeParse(value.contactEmail).success ||
        !Number.isInteger(value.retentionMonths) || value.retentionMonths < 1 || value.retentionMonths > 120) {
      throw new Error('Les coordonnées et la durée de conservation de la newsletter sont à configurer.');
    }
    return value;
  }

  /** @returns {Promise<Subscriber[]>} */
  async function subscribers() {
    try {
      const rows = JSON.parse(await readFile(join(directory, 'newsletter.json'), 'utf8'));
      if (!Array.isArray(rows) || rows.some(row => !row || typeof row.id !== 'string' ||
        !emailSchema.safeParse(row.email).success || !Number.isFinite(Date.parse(row.createdAt)) ||
        !Number.isFinite(Date.parse(row.expiresAt)) || !row.consent ||
        typeof row.consent.version !== 'string' || typeof row.consent.purpose !== 'string' ||
        !Number.isFinite(Date.parse(row.consent.acceptedAt)))) {
        throw new Error('newsletter.json est invalide.');
      }
      return rows;
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return [];
      throw error;
    }
  }

  /** No personal details in the return value. @param {unknown} emailInput @param {unknown} consent */
  async function subscribe(emailInput, consent) {
    const email = typeof emailInput === 'string' ? emailInput.trim().toLowerCase() : '';
    if (!emailSchema.safeParse(email).success) throw new RegistrationError('Saisissez une adresse e-mail valide.');
    if (consent !== 'on') throw new RegistrationError('Cochez la case pour accepter de recevoir les actualités de Mtech.');
    const config = await settings();
    await withFileLock(directory, 'newsletter', async () => {
      const now = new Date();
      const allRows = await subscribers();
      const active = allRows.filter(row => Date.parse(row.expiresAt) > now.getTime());
      // Same outcome for new and existing emails: do not expose the subscriber list.
      if (!active.some(row => row.email.toLowerCase() === email)) {
        active.push({ id: randomUUID(), email, createdAt: now.toISOString(),
          expiresAt: expiryDate(now, config.retentionMonths),
          consent: { version: NEWSLETTER_CONSENT_VERSION, acceptedAt: now.toISOString(),
            purpose: 'Actualités et invitations aux événements Mtech' } });
        await writeJsonAtomically(directory, 'newsletter', active);
      } else if (active.length !== allRows.length) {
        await writeJsonAtomically(directory, 'newsletter', active);
      }
    });
  }

  async function purgeExpired() {
    return withFileLock(directory, 'newsletter', async () => {
      const rows = await subscribers();
      const active = rows.filter(row => Date.parse(row.expiresAt) > Date.now());
      if (active.length !== rows.length) await writeJsonAtomically(directory, 'newsletter', active);
      return { removed: rows.length - active.length, active: active.length };
    });
  }
  return { settings, subscribe, purgeExpired };
}

export const newsletter = createNewsletterStore();
