import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../types';

export interface INotification extends Document {
	userId: string;
	type: NotificationType;
	content: string;
	isRead: boolean;
	createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
	userId: { type: String, required: true, index: true },
	type: { type: String, required: true, enum: ['FOLLOW','LIKE','COMMENT','SHARE_JOB','SHARE_BLOG'] },
	content: { type: String, required: true },
	isRead: { type: Boolean, default: false, index: true },
	createdAt: { type: Date, default: Date.now, index: true }
}, { versionKey: false });

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

