import { Router } from 'express';
import { notificationService } from '../services/notification-service';

const router = Router();

// POST /api/notifications/subscribe - Register device for Push
router.post('/subscribe', (req, res) => {
  try {
    const { endpoint, keys, userId, userEmail, userAgent } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint da subscription é obrigatório' });
    }

    const result = notificationService.registerSubscription({
      endpoint,
      keys,
      userId,
      userEmail,
      userAgent: userAgent || req.headers['user-agent'],
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao registrar push subscription' });
  }
});

// POST /api/notifications/unsubscribe - Unregister device
router.post('/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint é obrigatório' });
    }
    notificationService.removeSubscription(endpoint);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/history - Get notifications for active user
router.get('/history', (req, res) => {
  try {
    const userEmail = (req.query.email as string) || (req.query.userEmail as string);
    const notifications = notificationService.getHistory(userEmail);
    res.json({ notifications, total: notifications.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/mark-read - Mark all as read
router.post('/mark-read', (req, res) => {
  try {
    const userEmail = req.body.email || req.body.userEmail;
    notificationService.markAllAsRead(userEmail);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/notify-status-change - Trigger status change push
router.post('/notify-status-change', (req, res) => {
  try {
    const { caseId, newStatus, oldStatus, autoInfracao, userId, userEmail } = req.body;

    if (!caseId || !newStatus) {
      return res.status(400).json({ error: 'caseId e newStatus são obrigatórios' });
    }

    const notification = notificationService.broadcastCaseStatusChange({
      caseId,
      newStatus,
      oldStatus,
      autoInfracao,
      userId,
      userEmail,
    });

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/send-test - Send test push
router.post('/send-test', (req, res) => {
  try {
    const { title, body, userEmail } = req.body;
    const notification = notificationService.broadcastCaseStatusChange({
      caseId: 'case_demo_745',
      newStatus: 'defesa_pronta',
      autoInfracao: 'DET2026SP984712',
      userEmail,
    });

    res.json({
      success: true,
      message: 'Notificação de teste enviada com sucesso.',
      notification: {
        ...notification,
        title: title || notification.title,
        body: body || notification.body,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
