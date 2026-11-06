import { mkdir, open, unlink, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export class StorageBusyError extends Error {}

/**
 * A disk lock also protects two processes sharing the same local directory.
 * @template T
 * @param {string} directory
 * @param {string} name Internal filename only, never user input.
 * @param {() => Promise<T>} operation
 * @returns {Promise<T>}
 */
export async function withFileLock(directory, name, operation) {
  await mkdir(directory, { recursive: true });
  const lockPath = join(directory, `${name}.lock`);
  let lock;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { lock = await open(lockPath, 'wx', 0o600); break; }
    catch (error) {
      if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'EEXIST') throw error;
      await new Promise(done => setTimeout(done, 10));
    }
  }
  if (!lock) throw new StorageBusyError('Une écriture est déjà en cours. Réessayez dans un instant.');
  try { return await operation(); }
  finally {
    try { await lock.close(); }
    finally { await unlink(lockPath); }
  }
}

/** @param {string} directory @param {string} name @param {unknown} value */
export async function writeJsonAtomically(directory, name, value) {
  const tempPath = join(directory, `${name}-${randomUUID()}.tmp`);
  try {
    await writeFile(tempPath, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
    await rename(tempPath, join(directory, `${name}.json`));
  } finally {
    await unlink(tempPath).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}
