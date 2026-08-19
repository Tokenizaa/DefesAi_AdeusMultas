import { Router } from 'express';
import { eventBus, EventTopics } from '../../core/events/topics';

const router = Router();

// Communication & WhatsApp (Evolution API Simulator)
router.post('/communication/whatsapp/send', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(501).json({
      error: 'Serviço de WhatsApp não configurado',
      message: 'Integração com WhatsApp em preparação.'
    });
  }

  const { phone, message, caseId, notificationType } = req.body;
  
  eventBus.publish(EventTopics.WHATSAPP_MESSAGE_SENT, {
    phone,
    caseId,
    notificationType,
    delivered: true,
  }, 'evolution_api');

  res.json({
    success: true,
    messageId: `wamid_${Date.now()}`,
    status: 'delivered',
    destination: phone,
    timestamp: new Date().toISOString(),
  });
});

export default router;