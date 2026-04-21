/**
 * One-off script to grant/revoke the `admin: true` custom claim.
 *
 * Usage (from packages/functions):
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json \
 *   npx tsx scripts/set-admin.ts <email> [--revoke]
 *
 * Or against the emulator:
 *   FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
 *   GCLOUD_PROJECT=endu-rpg \
 *   npx tsx scripts/set-admin.ts <email>
 *
 * The user must sign out and sign in again (or call getIdToken(true)) for
 * the new claim to be reflected on the client.
 */
import * as admin from 'firebase-admin';

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith('--'));
  const revoke = args.includes('--revoke');

  if (!email) {
    console.error('Usage: set-admin.ts <email> [--revoke]');
    process.exit(1);
  }

  if (admin.apps.length === 0) admin.initializeApp();

  const user = await admin.auth().getUserByEmail(email);
  const existing = user.customClaims ?? {};
  const next = { ...existing, admin: !revoke };
  if (revoke) delete next.admin;

  await admin.auth().setCustomUserClaims(user.uid, next);

  console.log(
    `${revoke ? 'Revoked' : 'Granted'} admin for ${email} (uid ${user.uid}). ` +
      `User must refresh their ID token to pick up the change.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
