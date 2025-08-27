import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '../../common/enums';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser('id') adminId: string) {
    return {
      status: 'success',
      message: 'Task created successfully',
      data: {
        taskId: 'example-task-id',
        adminId,
      },
    };
  }

  @Post(':taskId/submit')
  submitTask(
    @Param('taskId') taskId: string,
    @GetUser('id') userId: string,
    @Body() submitTaskDto: SubmitTaskDto,
  ) {
    return this.tasksService.submitTask(taskId, userId, submitTaskDto);
  }

  @Put(':taskId/users/:userId/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTaskStatus(taskId, userId, adminId, updateTaskDto);
  }

  @Get('year/:year')
  getTasksByYear(@Param('year') year: string) {
    return this.tasksService.getTasksByYear(year);
  }

  @Get('users/:userId')
  getUserTasks(@Param('userId') userId: string) {
    return this.tasksService.getUserTasks(userId);
  }
}
