import { Body, Controller, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, Headers, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole, SubmissionStatus } from '../../common/enums';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';
import { GetTasksQueryDto, BatchUpdateDto, BatchPreviewDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Dropdown options for submission status
  @Get('status-options')
  @UseGuards(JwtAuthGuard)
  getSubmissionStatusOptions() {
    return {
      status: 'success',
      data: Object.values(SubmissionStatus)
    };
  }

  @Get('info')
  async getTasksInfo() {
    return {
      status: 'success',
      message: 'Tasks API endpoints information',
      data: {
        description: 'Task management endpoints',
        endpoints: {
          createTask: {
            method: 'POST',
            url: '/api/tasks',
            description: 'Create new task (Admin/Mentor)',
            auth: 'Required'
          },
          submitTask: {
            method: 'POST',
            url: '/api/tasks/:taskId/submit',
            description: 'Submit task solution (Intern)',
            auth: 'Required'
          },
          updateTaskStatus: {
            method: 'PUT',
            url: '/api/tasks/:taskId/users/:userId/status',
            description: 'Update task status (Admin/Mentor)',
            auth: 'Required (Admin/Mentor)'
          },
          getTasksByYear: {
            method: 'GET',
            url: '/api/tasks/year/:year',
            description: 'Get tasks by year',
            auth: 'Required'
          },
          getUserTasks: {
            method: 'GET',
            url: '/api/tasks/users/:userId',
            description: 'Get tasks for specific user',
            auth: 'Required'
          },
          getSubmissionStatusOptions: {
            method: 'GET',
            url: '/api/tasks/status-options',
            description: 'Get list of submission status options for dropdown',
            auth: 'Required'
          },
          reviewAllSubmissions: {
            method: 'PUT',
            url: '/api/tasks/:taskId/admin/review-all',
            description: 'Admin: update submission status for ALL users who submitted a specific task',
            auth: 'Required (Admin)'
          },
          updateAllTaskStatus: {
            method: 'PUT',
            url: '/api/tasks/admin/tasks/:taskId/update-all-status',
            description: 'Admin: update status for ALL submissions of a specific task (simplified endpoint)',
            auth: 'Required (Admin)'
          }
        }
      }
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    }),
  )
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('id') adminId: string,
    @UploadedFile() file?: Express.Multer.File,
    @Headers('authorization') authorization?: string,
  ) {
    const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
    const task = await this.tasksService.createTask(createTaskDto, adminId, file, token);
    return {
      status: 'success',
      message: 'Task created successfully',
      data: task,
    };
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  submitTask(
    @GetUser('id') userId: string,
    @Body() submitTaskDto: SubmitTaskDto,
  ) {
    // Supports body-based task selection: task_id, task_identifier, or auto-select latest pending task for the user
    return this.tasksService.submitTaskFlexible(userId, submitTaskDto);
  }

  @Put(':taskId/users/:userId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    // Use flexible resolver: accepts UUIDs or readable identifiers (title, email, full_name)
    return this.tasksService.updateTaskStatusFlexible(taskId, userId, adminId, updateTaskDto);
  }

  @Get('year/:year')
  @UseGuards(JwtAuthGuard)
  getTasksByYear(@Param('year') year: string) {
    return this.tasksService.getTasksByYear(year);
  }

  // Accept query form: GET /api/tasks/year?year=2025
  @Get('year')
  @UseGuards(JwtAuthGuard)
  getTasksByYearQuery(@Query('year') year: string) {
    if (!year) {
      return {
        status: 'error',
        message: 'Query parameter "year" is required',
      };
    }
    return this.tasksService.getTasksByYear(year);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard)
  getUserTasks(@Param('userId') userId: string) {
    return this.tasksService.getUserTasks(userId);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  getAvailableTasks() {
    return this.tasksService.getAvailableTasks();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTasks(
    @Query() query: GetTasksQueryDto,
    @Headers('authorization') authorization?: string,
  ) {
    const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
    const tasks = await this.tasksService.getAllTasks(query, token);
    return {
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  // Admin batch preview endpoint
  @Post('/admin/tasks/batch-preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async batchPreview(@Body() body: BatchPreviewDto) {
    const preview = await this.tasksService.batchPreview(body.filters || {});
    return {
      status: 'success',
      data: preview,
    };
  }

  // Admin: update status for all submissions of a specific task
  @Put(':taskId/admin/review-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reviewAllSubmissionsForTask(
    @Param('taskId') taskId: string,
    @Body() body: { new_status: string; update_reason?: string },
    @GetUser('id') adminId: string,
  ) {
    // resolve identifier (accept readable title or UUID)
    const resolvedTaskId = await this.tasksService.resolveTaskId(taskId);
    const filters = { task_ids: [resolvedTaskId] };
    const result = await this.tasksService.batchUpdateStatus(filters, body.new_status, body.update_reason, adminId);
    return { status: 'success', data: result };
  }

  // Alternate: allow admin to PUT with path after /admin/review-all/:taskId
  @Put('admin/review-all/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reviewAllSubmissionsForTaskAlt(
    @Param('taskId') taskId: string,
    @Body() body: { new_status: string; update_reason?: string },
    @GetUser('id') adminId: string,
  ) {
    const resolvedTaskId = await this.tasksService.resolveTaskId(taskId);
    const filters = { task_ids: [resolvedTaskId] };
    const result = await this.tasksService.batchUpdateStatus(filters, body.new_status, body.update_reason, adminId);
    return { status: 'success', data: result };
  }

  // Alternate: accept task_id in body for maximum compatibility
  @Put('admin/review-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async reviewAllSubmissionsForTaskBody(
    @Body() body: { task_id?: string; taskId?: string; new_status: string; update_reason?: string },
    @GetUser('id') adminId: string,
  ) {
    const taskIdentifier = body.task_id || body.taskId;
    if (!taskIdentifier) {
      return { status: 'error', message: 'task_id is required in body' };
    }
    const resolvedTaskId = await this.tasksService.resolveTaskId(taskIdentifier);
    const filters = { task_ids: [resolvedTaskId] };
    const result = await this.tasksService.batchUpdateStatus(filters, body.new_status, body.update_reason, adminId);
    return { status: 'success', data: result };
  }

  // Admin batch update endpoint
  @Put('/admin/tasks/batch-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async batchUpdateStatus(@Body() body: BatchUpdateDto, @GetUser('id') adminId: string) {
    let { filters, new_status, update_reason } = body;
    filters = filters || {};

    // Support human-readable task identifier in filters (e.g. title) for frontend convenience
    // If provided, resolve to a task UUID and set filters.task_ids accordingly
    if ((filters as any).task_identifier) {
      const identifier = (filters as any).task_identifier;
      const resolved = await this.tasksService.resolveTaskId(identifier);
      filters.task_ids = [resolved];
      delete (filters as any).task_identifier;
    }

    const result = await this.tasksService.batchUpdateStatus(filters, new_status, update_reason, adminId);
    return { status: 'success', data: result };
  }

  // Simple endpoint to update ALL submissions for a specific task
  @Put('/admin/tasks/:taskId/update-all-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAllTaskSubmissionsStatus(
    @Param('taskId') taskId: string,
    @Body() body: { new_status: SubmissionStatus; feedback?: string; reason?: string },
    @GetUser('id') adminId: string,
  ) {
    // Resolve task identifier (accept UUID or title)
    const resolvedTaskId = await this.tasksService.resolveTaskId(taskId);

    // Use batch update with task filter
    const filters = { task_ids: [resolvedTaskId] };
    const result = await this.tasksService.batchUpdateStatus(
      filters,
      body.new_status,
      body.feedback || body.reason,
      adminId
    );

    return {
      status: 'success',
      message: `Successfully updated ${result.updated_count} task submissions to ${body.new_status}`,
      data: result
    };
  }
}
