import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

// Global process safety nets
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason, promise) => console.error('Unhandled Rejection at:', promise, 'reason:', reason));

let app: NestExpressApplication | null = null;

// -------- Helpers --------
const isProd = () => process.env.NODE_ENV === 'production';
const shouldStartServer = () => !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;

type AllowedOrigin = string | RegExp;

function buildAllowedOrigins(): AllowedOrigin[] {
  const list: AllowedOrigin[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'https://localhost:3000',
    'https://localhost:3001',
    'https://learnhub-be-dev.vercel.app',
    'https://learnhubbackend-b2s4hkqrj-rakaprasetyahidayats-projects.vercel.app',
    'https://learnhubbackenddev.vercel.app',
    // wildcard Vercel previews
    /^https:\/\/.*\.vercel\.app$/,
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/,
    /^https:\/\/localhost:\d+$/,
  ];

  const envOrigins = process.env.ALLOWED_ORIGINS
    ? String(process.env.ALLOWED_ORIGINS)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return [...list, ...envOrigins];
}

function corsOriginValidator(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  // Allow requests with no origin (mobile apps, curl) and all non-production environments
  if (!origin || !isProd()) return callback(null, true);

  const allowed = buildAllowedOrigins();
  const isAllowed = allowed.some((item) => (typeof item === 'string' ? item === origin : item.test(origin)));
  return isAllowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
}

async function configureApp(instance: NestExpressApplication) {
  // CORS
  instance.enableCors({
    origin: corsOriginValidator,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'X-HTTP-Method-Override',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'X-Current-Page', 'X-Per-Page'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  // Compression (optional)
  try {
    const compression = require('compression');
    instance.use(compression());
  } catch {
    // ignore if compression is not available
  }

  // Keep-alive headers for unstable networks
  instance.use((req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=10, max=1000');
    next();
  });

  // Global prefix with exclusions
  instance.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'favicon.ico', method: RequestMethod.GET },
      { path: 'favicon.png', method: RequestMethod.GET },
    ],
  });

  // Backward compatibility: transparently support /api/v1/*
  instance.use((req, _res, next) => {
    if (req.url.startsWith('/api/v1/')) req.url = req.url.replace('/api/v1/', '/api/');
    else if (req.url === '/api/v1') req.url = '/api';
    next();
  });

  // Validation
  instance.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false, skipMissingProperties: true }),
  );

  // Global exception filter
  const { GlobalExceptionFilter } = await import('./common/filters/global-exception.filter');
  instance.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger (non-production only)
  if (!isProd()) {
    const config = new DocumentBuilder().setTitle('LearnHub API').setDescription('API documentation').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(instance, config);
    SwaggerModule.setup('api/docs', instance, document);
  }
}

export async function bootstrap(): Promise<NestExpressApplication> {
  if (app) return app;

  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    await configureApp(app);

    if (shouldStartServer()) {
      const port = process.env.PORT || 3001;
      const server = await app.listen(port);
      // Relaxed timeouts for local/dev usage
      try {
        server.setTimeout?.(15000);
        (server as any).keepAliveTimeout = 12000;
        (server as any).headersTimeout = 17000;
      } catch {}
      console.log(`Server running on http://localhost:${port}`);
    } else {
      await app.init();
      console.log('Initialized in serverless environment');
    }
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }

  return app!;
}

// Auto-start for local dev; serverless imports bootstrap only
(async function start() {
  await bootstrap();
})();

export default bootstrap;
