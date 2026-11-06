import { newsletter } from '../src/server/newsletter.mjs';

try {
  const { removed, active } = await newsletter.purgeExpired();
  console.log(`Newsletter : ${removed} adresse(s) expirée(s) supprimée(s), ${active} abonnement(s) actif(s).`);
} catch {
  console.error('Nettoyage impossible. Vérifiez le fichier newsletter.json et l’absence de verrou bloqué.');
  process.exitCode = 1;
}
