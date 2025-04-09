import { Router, Request, Response } from 'express';
import { sendEmail } from '../services/email.service';

const router = Router();

// ✅ Test route for sending email manually
router.post('/send-test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Test email sent successfully ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send test email ❌' });
  }
});

export default router;
