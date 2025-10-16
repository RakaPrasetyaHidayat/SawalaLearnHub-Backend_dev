import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PostsModule } from './modules/posts/posts.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { CommentsModule } from './modules/comments/comments.module';
import { SupabaseModule } from './infra/supabase/supabase.module';
import { TimeoutMiddleware } from './common/middleware/timeout.middleware';
import { ConfigModule } from './config/config.module'; // use custom config module with validation
import { DivisionModule } from './modules/division/division.module';

@Module({
  imports: [
    ConfigModule, // initializes @nestjs/config globally with validation
    SupabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    PostsModule,
    ResourcesModule,
    CommentsModule,
    DivisionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimeoutMiddleware)
      .forRoutes('*');
  }
}
