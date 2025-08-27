import { VercelRequest, VercelResponse } from '@vercel/node';
import { bootstrap } from '../src/main';

let server: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!server) {
      const app = await bootstrap();
      server = app.getHttpAdapter().getInstance();
    }
    return server(req, res);
  } catch (error: any) {
    console.error('API handler error', error);
    res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
