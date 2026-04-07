import * as logger from 'firebase-functions/logger';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { Resend } from 'resend';

import { db } from '../admin';
import { FIRESTORE_COLLECTIONS, getResendApiKey } from '../config';
import { calculateXP } from '../game/game';
import { GameProfile, StoredActivity } from '../types';

interface ActivityXPEmailParams {
  to: string;
  displayName: string | null;
  activityName: string;
  activityType: string;
  xpEarned: number;
  baseXP: number;
  streakBonus: number;
  newTotalXP: number;
  level: number;
  leveledUp: boolean;
  oldLevel?: number;
  tier: string;
}

/**
 * Sends an email notification about XP earned from a new activity
 */
export async function sendActivityXPEmail(params: ActivityXPEmailParams): Promise<void> {
  const resend = new Resend(getResendApiKey());

  const greeting = params.displayName ? `Hey ${params.displayName}` : 'Hey';
  const subject = params.leveledUp
    ? `You leveled up to ${params.level}! (+${params.xpEarned} XP)`
    : `+${params.xpEarned} XP from ${params.activityName}`;

  const html = buildEmailHtml(greeting, params);

  const { error } = await resend.emails.send({
    from: 'Endu RPG <onboarding@resend.dev>',
    to: params.to,
    subject,
    html,
  });

  if (error) {
    logger.error('Failed to send activity XP email:', error);
    throw new Error(`Resend error: ${error.message}`);
  }

  logger.info(`Activity XP email sent to ${params.to}`);
}

// Dark theme colors (derived from globals.css oklch values)
const COLORS = {
  background: '#1c1c1c', // oklch(0.145 0 0)
  card: '#2e2e2e', // oklch(0.205 0 0)
  secondary: '#3b3b3b', // oklch(0.269 0 0)
  foreground: '#fafafa', // oklch(0.985 0 0)
  mutedForeground: '#a8a8a8', // oklch(0.708 0 0)
  border: 'rgba(255,255,255,0.1)', // oklch(1 0 0 / 10%)
  xpGreen: '#22c55e',
  streakGold: '#fbbf24',
  levelUpGold: '#f59e0b',
};

function buildEmailHtml(greeting: string, params: ActivityXPEmailParams): string {
  const streakRow =
    params.streakBonus > 0
      ? `<tr>
          <td style="padding: 8px 0; color: ${COLORS.mutedForeground}; font-size: 14px;">Streak Bonus</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px; color: ${COLORS.streakGold};">+${params.streakBonus} XP</td>
        </tr>`
      : '';

  const levelUpBlock = params.leveledUp
    ? `<tr><td colspan="2" style="padding: 0;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 24px 0 0;">
          <tr>
            <td style="background-color: ${COLORS.levelUpGold}; padding: 20px; text-align: center;">
              <p style="font-size: 28px; margin: 0 0 8px; color: ${COLORS.background};">&#9876;&#65039; LEVEL UP! &#9876;&#65039;</p>
              <p style="font-size: 18px; margin: 0; color: ${COLORS.background};">${params.oldLevel} &#8594; <strong>${params.level}</strong></p>
              <p style="font-size: 14px; margin: 8px 0 0; color: ${COLORS.card};">Tier: ${params.tier}</p>
            </td>
          </tr>
        </table>
      </td></tr>`
    : '';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Endu RPG — Activity XP</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Outer wrapper: centers content -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${COLORS.background};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <!-- Card -->
        <table width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 480px; width: 100%; background-color: ${COLORS.card}; border: 1px solid ${COLORS.border}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <tr>
            <td style="padding: 32px;">

              <!-- Greeting + heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="color: ${COLORS.mutedForeground}; font-size: 14px; padding-bottom: 4px;">${greeting},</td>
                </tr>
                <tr>
                  <td style="color: ${COLORS.foreground}; font-size: 22px; font-weight: 700; padding-bottom: 24px;">Your ${params.activityType} just earned you XP!</td>
                </tr>
              </table>

              <!-- Activity name card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${COLORS.background}; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="color: ${COLORS.foreground}; font-size: 16px; font-weight: 600; margin: 0 0 4px;">${params.activityName}</p>
                    <p style="color: ${COLORS.mutedForeground}; font-size: 13px; margin: 0;">${params.activityType}</p>
                  </td>
                </tr>
              </table>

              <!-- XP breakdown -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.mutedForeground}; font-size: 14px;">Base XP</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px; color: ${COLORS.foreground};">+${params.baseXP} XP</td>
                </tr>
                ${streakRow}
                <tr>
                  <td colspan="2" style="padding: 0; height: 1px; line-height: 1px; font-size: 1px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="border-top: 1px solid ${COLORS.secondary};"></td></tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 700; font-size: 14px; color: ${COLORS.foreground};">Total</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 18px; color: ${COLORS.xpGreen};">+${params.xpEarned} XP</td>
                </tr>
              </table>

              <!-- Level-up banner (conditional) -->
              ${levelUpBlock}

              <!-- Level / total XP footer -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${COLORS.background}; margin-top: 24px;">
                <tr>
                  <td style="padding: 16px; text-align: center;">
                    <p style="color: ${COLORS.mutedForeground}; font-size: 12px; margin: 0 0 4px;">Level ${params.level} ${params.tier}</p>
                    <p style="color: ${COLORS.foreground}; font-size: 20px; font-weight: 700; margin: 0;">${params.newTotalXP.toLocaleString()} XP</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- /Card -->

        <!-- Footer -->
        <table width="480" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 480px; width: 100%;">
          <tr>
            <td style="padding: 24px 0 0; text-align: center; color: ${COLORS.secondary}; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              Endu RPG &#8212; Turn your workouts into an adventure
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Dev-only callable: sends the XP email for an existing stored activity
 * as if it just came through the webhook. Accepts activityId and optional
 * leveledUp/oldLevel overrides to test the level-up banner.
 */
export const sendTestActivityEmail = onCall(
  async (request): Promise<{ status: string; message: string }> => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const userId = request.auth.uid;
    const { activityId, leveledUp, oldLevel } = request.data as {
      activityId: number;
      leveledUp?: boolean;
      oldLevel?: number;
    };

    if (!activityId || typeof activityId !== 'number') {
      throw new HttpsError('invalid-argument', 'activityId (number) is required.');
    }

    // Fetch user profile
    const userDoc = await db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.email) {
      throw new HttpsError('not-found', 'User has no email address.');
    }

    // Fetch stored activity
    const activityDoc = await db
      .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
      .doc(`${userId}_${activityId}`)
      .get();

    if (!activityDoc.exists) {
      throw new HttpsError('not-found', `Activity ${activityId} not found for this user.`);
    }

    const activity = activityDoc.data() as StoredActivity;
    const game = userData.game as GameProfile | undefined;

    // Recalculate XP for the activity
    const xpResult = await calculateXP(userId, activity);

    // Use overrides or derive from current game profile
    const isLevelUp = leveledUp ?? false;
    const prevLevel = oldLevel ?? game?.level ?? 1;

    await sendActivityXPEmail({
      to: userData.email,
      displayName: userData.displayName || userData.stravaFirstname || null,
      activityName: activity.name,
      activityType: activity.type,
      xpEarned: xpResult.totalXP,
      baseXP: xpResult.baseXP,
      streakBonus: xpResult.streakBonus,
      newTotalXP: game?.totalXP ?? 0,
      level: game?.level ?? 1,
      leveledUp: isLevelUp,
      oldLevel: isLevelUp ? prevLevel : undefined,
      tier: game?.tier ?? 'Novice',
    });

    return { status: 'success', message: `Test email sent to ${userData.email}` };
  },
);
