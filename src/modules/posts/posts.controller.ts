import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
  CreatePostCommentDto,
  FilterPostsDto,
} from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // allow optional file upload (documents/images)
  // accepted types: pdf, doc, docx, xls, xlsx, ppt, pptx, jpg/jpeg, png
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowed = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/jpeg',
          'image/png',
        ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb((new Error('Unsupported file type') as any), false);
      },
    }),
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const post = await this.postsService.create(createPostDto, userId, file);
    return {
      status: 'success',
      message: 'Post created successfully',
      data: post,
    };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filterDto: FilterPostsDto) {
    return this.postsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('id') userId: string,
  ) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.postsService.remove(id, userId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param('id') postId: string,
    @Body() commentDto: CreatePostCommentDto,
    @GetUser('id') userId: string,
  ) {
    return this.postsService.addComment(postId, userId, commentDto);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  getComments(@Param('id') postId: string) {
    return this.postsService.getComments(postId);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param('id') postId: string, @GetUser('id') userId: string) {
    return this.postsService.toggleLike(postId, userId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }
}
