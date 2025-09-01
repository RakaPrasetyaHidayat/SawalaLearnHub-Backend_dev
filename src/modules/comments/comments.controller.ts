import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('info')
  async getCommentsInfo() {
    return {
      status: 'success',
      message: 'Comments API endpoints information',
      data: {
        description: 'Endpoints for managing comments on posts and resources',
        endpoints: {
          getComments: {
            method: 'GET',
            url: '/api/comments',
            description: 'Get list of comments'
          },
          createComment: {
            method: 'POST',
            url: '/api/comments/posts/:postId',
            description: 'Create a new comment on a post'
          }
        }
      }
    };
  }

  @Post('posts/:postId')
  @UseGuards(JwtAuthGuard)
  async createPostComment(
    @Param('postId') postId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.createComment(postId, userId, createCommentDto);
    return {
      status: 'success',
      message: 'Comment created successfully',
      data: comment
    };
  }

  @Get('posts/:postId')
  @UseGuards(JwtAuthGuard)
  getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @Post('tasks/:taskId')
  @UseGuards(JwtAuthGuard)
  createTaskComment(
    @Param('taskId') taskId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createTaskComment(taskId, userId, createCommentDto);
  }

  @Get('tasks/:taskId')
  @UseGuards(JwtAuthGuard)
  getTaskComments(@Param('taskId') taskId: string) {
    return this.commentsService.getTaskComments(taskId);
  }
}
