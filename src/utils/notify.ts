// src/utils/notify.ts
import { sendEmail } from '../services/email.service';

export const notifyUser = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  await sendEmail(to, subject, html);
};
