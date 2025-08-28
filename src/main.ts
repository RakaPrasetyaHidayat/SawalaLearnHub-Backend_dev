import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

console.log('Starting main.ts...');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

let app: NestExpressApplication | null = null;

export async function bootstrap(): Promise<NestExpressApplication> {
  console.log('Bootstrap function started');
  console.log('Environment variables check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- VERCEL:', process.env.VERCEL);
  console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

  if (!app) {
    try {
      console.log('Creating Nest application...');
      app = await NestFactory.create<NestExpressApplication>(AppModule);

      // Configure CORS
      console.log('Configuring CORS...');
      app.enableCors({
        origin: [
          'http://localhost:3001',
          'https://learnhub-be-dev.vercel.app',
          'https://learnhubbackend-b2s4hkqrj-rakaprasetyahidayats-projects.vercel.app',
          'https://learnhubbackenddev.vercel.app',
          /\.vercel\.app$/
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      });

      // Global pipes
      console.log('Setting up global pipes...');
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

      // Swagger (only enabled in non-production)
      if (process.env.NODE_ENV !== 'production') {
        console.log('Setting up Swagger...');
        const config = new DocumentBuilder()
          .setTitle('LearnHub API')
          .setDescription('API documentation')
          .setVersion('1.0')
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
      }

      // Only start the server if not in Vercel environment
      if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
        const port = process.env.PORT || 3001;
        console.log(`Using port: ${port}`);
        console.log('Initializing server...');
        await app.listen(port);
        console.log(`Server running on http://localhost:${port}`);
      } else {
        console.log('Running in serverless environment, skipping app.listen');
        // Initialize the app but don't start listening
        await app.init();
      }

      console.log('Bootstrap function completed');
    } catch (error) {
      console.error('Error during bootstrap:', error);
    }
  }

  return app;
}

async function startApplication() {
  console.log('Calling bootstrap function...');
  await bootstrap();
  console.log('Bootstrap function executed successfully.');
}

startApplication();

// Note: Do NOT auto-start the NestJS server here.
// For local development, run `npm run start` which uses nest CLI to start the app.
// For serverless (Vercel), use the handler in src/vercel.ts or api/index.ts which imports bootstrap().
export default bootstrap;
