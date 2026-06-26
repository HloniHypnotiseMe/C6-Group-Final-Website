import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';

const router = Router();

// WhatsApp Business API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const C6GROUP_PHONE = process.env.C6GROUP_WHATSAPP_NUMBER || '27735558440';

/**
 * Send WhatsApp message
 * POST /api/v1/whatsapp/send
 */
router.post('/send', async (req, res, next) => {
  try {
    const { message, phoneNumber, type = 'text' } = req.body;
    
    if (!message) {
      throw createError('Message is required', 400, 'MISSING_MESSAGE');
    }
    
    // Store conversation in database
    const conversation = await prisma.conversation.create({
      data: {
        phoneNumber: phoneNumber || C6GROUP_PHONE,
        direction: 'outbound',
        message,
        type: type as string,
        status: 'sent',
        metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : null,
      },
    });
    
    // If WhatsApp Business API is configured, send via API
    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID && phoneNumber) {
      try {
        await axios.post(
          `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phoneNumber,
            type: 'text',
            text: { body: message },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { status: 'delivered' },
        });
      } catch (waError) {
        logger.error('WhatsApp API send failed:', waError);
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { status: 'failed' },
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        conversationId: conversation.id,
        status: conversation.status,
        message: 'Message queued for delivery',
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Receive WhatsApp webhook (for incoming messages)
 * POST /api/v1/whatsapp/webhook
 */
router.post('/webhook', async (req, res, next) => {
  try {
    const { entry } = req.body;
    
    if (!entry || !Array.isArray(entry)) {
      res.status(200).send('OK');
      return;
    }
    
    for (const item of entry) {
      for (const change of item.changes || []) {
        if (change.value?.messages) {
          for (const message of change.value.messages) {
            const phoneNumber = message.from;
            const messageBody = message.text?.body || '';
            const messageId = message.id;
            
            // Store incoming message
            await prisma.conversation.create({
              data: {
                phoneNumber,
                direction: 'inbound',
                message: messageBody,
                type: 'text',
                status: 'received',
                metadata: JSON.stringify({ messageId, raw: message }),
              },
            });
            
            logger.info(`WhatsApp message received from ${phoneNumber}: ${messageBody.substring(0, 50)}`);
            
            // Auto-respond with predefined responses
            const autoResponse = getAutoResponse(messageBody);
            if (autoResponse) {
              await prisma.conversation.create({
                data: {
                  phoneNumber,
                  direction: 'outbound',
                  message: autoResponse,
                  type: 'text',
                  status: 'sent',
                  metadata: JSON.stringify({ autoResponse: true }),
                },
              });
              
              // Send via WhatsApp API if configured
              if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
                try {
                  await axios.post(
                    `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
                    {
                      messaging_product: 'whatsapp',
                      to: phoneNumber,
                      type: 'text',
                      text: { body: autoResponse },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                } catch (sendError) {
                  logger.error('Auto-response send failed:', sendError);
                }
              }
            }
          }
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    next(error);
  }
});

/**
 * WhatsApp webhook verification (GET)
 * GET /api/v1/whatsapp/webhook
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'c6group_webhook_verify';
  
  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/**
 * Get conversations
 * GET /api/v1/whatsapp/conversations
 */
router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const { phoneNumber, page = '1', limit = '50' } = req.query;
    
    const where: any = {};
    if (phoneNumber) {
      where.phoneNumber = phoneNumber as string;
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.conversation.count({ where })
    ]);
    
    res.json({
      success: true,
      data: conversations,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get message templates
 * GET /api/v1/whatsapp/templates
 */
router.get('/templates', authenticate, async (req, res, next) => {
  try {
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Message',
        content: 'Welcome to C6GROUP! How can we help you grow your business with AI today?',
        category: 'greeting',
      },
      {
        id: 'audit_offer',
        name: 'Free Audit Offer',
        content: 'Get your FREE AI Business Audit at https://c6group.co.za/audit and discover how to increase your revenue by up to 150%!',
        category: 'promotional',
      },
      {
        id: 'support',
        name: 'Support Response',
        content: 'Thank you for contacting C6GROUP support. Our team will get back to you within 24 hours. For urgent queries, call us at 073 555 8440.',
        category: 'support',
      },
      {
        id: 'packages',
        name: 'Package Information',
        content: 'C6GROUP Packages:\nLead (FREE)\nDiamond (R299/mo)\nGold (R699/mo)\nPlatinum (R1499/mo)\nVisit https://c6group.co.za/packages for details.',
        category: 'informational',
      },
      {
        id: 'contact',
        name: 'Contact Details',
        content: 'You can reach C6GROUP at:\nWhatsApp: 073 555 8440\nEmail: hello@c6group.co.za\nWebsite: https://c6group.co.za',
        category: 'informational',
      },
    ];
    
    res.json({
      success: true,
      data: templates,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

// Auto-response helper
function getAutoResponse(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  
  const responses: Record<string, string> = {
    'pricing': 'Our packages start from FREE!\n\nLead Package: FREE (1 AI Audit)\nDiamond: R299/month\nGold: R699/month\nPlatinum: R1499/month\n\nVisit https://c6group.co.za/packages',
    'package': 'Our packages start from FREE!\n\nLead Package: FREE (1 AI Audit)\nDiamond: R299/month\nGold: R699/month\nPlatinum: R1499/month\n\nVisit https://c6group.co.za/packages',
    'audit': 'Get your FREE AI Business Audit! It takes just 3 minutes and you\'ll get a comprehensive report with revenue insights and AI recommendations.\n\nVisit https://c6group.co.za/audit',
    'help': 'I can help you with:\n1. Information about our packages\n2. Free AI Business Audit\n3. AI Tools Marketplace\n4. Support inquiries\n\nWhat would you like to know?',
    'hello': 'Hello! Welcome to C6GROUP - your AI-powered business growth partner. How can I help you today?',
    'hi': 'Hi there! Welcome to C6GROUP. How can I help you grow your business with AI?',
    'contact': 'You can reach us at:\nWhatsApp: 073 555 8440\nEmail: hello@c6group.co.za\nWebsite: https://c6group.co.za',
    'tools': 'Check out our AI Tools Marketplace with 100+ AI tools for your business!\n\nVisit https://c6group.co.za/ai-tools',
    'payment': 'We accept payments via RemotePay (Cards, Instant EFT, SnapScan, Zapper). All transactions are secure and POPIA compliant.',
  };
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMsg.includes(keyword)) {
      return response;
    }
  }
  
  return null;
}

export { router as whatsappRouter };
