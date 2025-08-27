import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreatePostCommentDto, FilterPostsDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('api/posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPostsInfo() {
    return {
      status: 'success',
      message: 'Posts API endpoints information',
      data: {
        description: 'Endpoints for managing learning posts',
        endpoints: {
          getPosts: {
            method: 'GET',
            url: '/api/posts',
            description: 'Get list of posts with optional filters'
          },
          createPost: {
            method: 'POST',
            url: '/api/posts',
            description: 'Create a new post'
          },
          getPost: {
            method: 'GET',
            url: '/api/posts/:id',
            description: 'Get post details by ID'
          },
          updatePost: {
            method: 'PATCH',
            url: '/api/posts/:id',
            description: 'Update post by ID'
          },
          deletePost: {
            method: 'DELETE',
            url: '/api/posts/:id',
            description: 'Delete post by ID'
          }
        }
      }
    };
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: string
  ) {
    const post = await this.postsService.create(createPostDto, userId);
    return {
      status: 'success',
      message: 'Post created successfully',
      data: post
    };
  }

  @Get('list')
  findAll(@Query() filterDto: FilterPostsDto) {
    return this.postsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('id') userId: string
  ) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string
  ) {
    return this.postsService.remove(id, userId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') postId: string,
    @Body() commentDto: CreatePostCommentDto,
    @GetUser('id') userId: string
  ) {
    return this.postsService.addComment(postId, userId, commentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') postId: string) {
    return this.postsService.getComments(postId);
  }

  @Post(':id/likes')
  toggleLike(
    @Param('id') postId: string,
    @GetUser('id') userId: string
  ) {
    return this.postsService.toggleLike(postId, userId);
  }

  @Get('user/:userId')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }
}
