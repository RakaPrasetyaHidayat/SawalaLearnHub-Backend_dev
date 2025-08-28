import { VercelRequest, VercelResponse } from '@vercel/node';
import { bootstrap } from '../src/main';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`Handling request: ${req.method} ${req.url}`);
    
    if (!app) {
      console.log('Initializing NestJS app...');
      app = await bootstrap();
      console.log('NestJS app initialized');
    }

    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error: any) {
    console.error('API handler error:', error);
    res.status(500).json({ 
      error: error?.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
  }
}
