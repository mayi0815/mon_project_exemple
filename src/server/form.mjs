import { RegistrationError } from './store.mjs';

/** @param {Request} request @param {URL} url */
export async function readForm(request, url) {
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) throw new RegistrationError('La provenance du formulaire est invalide.', 403);
  const type = request.headers.get('content-type') || '';
  if (!type.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
    throw new RegistrationError('Format de formulaire invalide.', 415);
  }
  const reader = request.body?.getReader();
  let size = 0;
  /** @type {Uint8Array[]} */
  const chunks = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new RegistrationError('Le formulaire est trop volumineux.', 413); }
      chunks.push(value);
    }
  }
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}
