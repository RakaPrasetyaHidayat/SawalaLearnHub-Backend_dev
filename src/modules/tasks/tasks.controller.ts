import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '../../common/enums';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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
          }
        }
      }
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  submitTask(
    @Param('taskId') taskId: string,
    @GetUser('id') userId: string,
    @Body() submitTaskDto: SubmitTaskDto,
  ) {
    return this.tasksService.submitTask(taskId, userId, submitTaskDto);
  }

  @Put(':taskId/users/:userId/status')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  getTasksByYear(@Param('year') year: string) {
    return this.tasksService.getTasksByYear(year);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard)
  getUserTasks(@Param('userId') userId: string) {
    return this.tasksService.getUserTasks(userId);
  }
}
