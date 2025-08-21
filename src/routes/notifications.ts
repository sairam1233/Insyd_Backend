import { Router } from 'express';
import { Notification } from '../models/Notification';
import { NotificationType } from '../types';

const router = Router();

// POST /api/events -> create a notification
router.post('/events', async (req, res) => {
	try {
		const { userId, type, content } = req.body as { userId?: string; type?: NotificationType; content?: string };
		const allowedTypes: NotificationType[] = ['FOLLOW','LIKE','COMMENT','SHARE_JOB','SHARE_BLOG'];
		if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
			return res.status(400).json({ message: 'Invalid userId' });
		}
		if (!type || !allowedTypes.includes(type)) {
			return res.status(400).json({ message: 'Invalid type' });
		}
		if (!content || typeof content !== 'string' || content.trim().length === 0 || content.length > 280) {
			return res.status(400).json({ message: 'Invalid content (1-280 chars)' });
		}
		const doc = await Notification.create({ userId, type, content });
		return res.status(201).json(doc);
	} catch (err) {
		console.error('Create event error:', err);
		return res.status(500).json({ message: 'Failed to create event.' });
	}
});

// GET /api/notifications/:userId?onlyUnread=true
router.get('/notifications/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const onlyUnread = String(req.query.onlyUnread ?? 'false').toLowerCase() === 'true';
		const filter: any = { userId };
		if (onlyUnread) filter.isRead = false;

		const items = await Notification.find(filter).sort({ createdAt: -1 }).lean();
		return res.json(items);
	} catch (err) {
		console.error('Fetch notifications error:', err);
		return res.status(500).json({ message: 'Failed to fetch notifications.' });
	}
});

// PUT /api/notifications/:id/read
router.put('/notifications/:id/read', async (req, res) => {
	try {
		const { id } = req.params;
		const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
		if (!updated) return res.status(404).json({ message: 'Notification not found.' });
		return res.json(updated);
	} catch (err) {
		console.error('Mark read error:', err);
		return res.status(500).json({ message: 'Failed to mark as read.' });
	}
});

export default router;

