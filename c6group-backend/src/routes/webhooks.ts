import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';

const router = Router();

const verifyPayFastSignature = (payload: Record<string, unknown>, signature: string): boolean => {
  const passphrase = process.env.PAYFAST_PASSPHRASE || '';
  if (!passphrase || !signature) return false;

  const dataString = Object.keys(payload)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(String(payload[key])).replace(/%20/g, '+')}`)
    .join('&');

  const hash = crypto.createHash('md5').update(dataString + passphrase).digest('hex');
  const expected = Buffer.from(hash);
  const actual = Buffer.from(signature);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

router.post('/payfast', async (req, res, next) => {
  try {
    const signature = req.headers.signature as string | undefined;
    const payload = req.body as Record<string, unknown>;

    if (!verifyPayFastSignature(payload, signature || '')) {
      throw createError('Invalid signature', 401, 'INVALID_SIGNATURE');
    }

    await prisma.webhookEvent.create({
      data: {
        eventType: `payfast.${String(payload.payment_status || 'unknown')}`,
        payload,
      },
    });

    if (payload.payment_status === 'COMPLETE') {
      const merchantReference = String(payload.merchant_reference || '');
      const subscription = await prisma.subscription.findFirst({
        where: { id: merchantReference, status: 'PENDING' },
      });

      if (subscription) {
        await prisma.$transaction([
          prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'ACTIVE',
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          }),
          prisma.payment.create({
            data: {
              subscriptionId: subscription.id,
              amount: Number(payload.amount_gross),
              currency: 'ZAR',
              status: 'COMPLETED',
              paymentMethod: 'payfast',
              transactionId: String(payload.pf_payment_id || ''),
              paidAt: new Date(),
            },
          }),
        ]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Provider callbacks other than PayFast are intentionally fail-closed until
 * their signed callback contract is verified. A browser redirect is never
 * treated as proof of payment.
 */
router.post('/remotepay', (_req, _res, next) => {
  next(createError('RemotePay webhook contract is not verified', 503, 'WEBHOOK_CONTRACT_NOT_VERIFIED'));
});

router.post('/simplyblu', (_req, _res, next) => {
  next(createError('SimplyBlu webhook contract is not verified', 503, 'WEBHOOK_CONTRACT_NOT_VERIFIED'));
});

router.post('/stripe', (_req, _res, next) => {
  next(createError('Stripe webhook is not enabled', 503, 'WEBHOOK_PROVIDER_DISABLED'));
});

router.post('/:provider', (_req, _res, next) => {
  next(createError('Webhook provider is not enabled', 404, 'WEBHOOK_PROVIDER_NOT_FOUND'));
});

export { router as webhookRouter };
