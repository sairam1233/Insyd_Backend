import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/notifications';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api', router);

// Global error handler to ensure consistent error responses
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	console.error('Unhandled error:', err);
	return res.status(500).json({ message: 'Internal server error' });
});

// Simple health endpoint
app.get('/health', (_req, res) => {
	return res.json({ ok: true });
});

async function start() {
	try {
		const uri = process.env.MONGODB_URI;
		if (!uri) {
			console.error('Missing MONGODB_URI');
			process.exit(1);
		}
		await mongoose.connect(uri);
		console.log('MongoDB connected');

		app.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Startup error:', err);
		process.exit(1);
	}
}

start();

