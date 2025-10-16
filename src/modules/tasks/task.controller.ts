import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { SubmitTaskBodyDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submitTaskJson(@Body() body: SubmitTaskBodyDto) {
    // Delegates to service method that will handle overdue logic and insertion
    const fileUrlsArray = body.file_urls ? body.file_urls.split(',').map(s => s.trim()).filter(Boolean) : [];
    const result = await this.tasksService.submitTaskDirect(body.task_id, body.user_id, body.description, fileUrlsArray);
    return {
      status: 'success',
      message: 'Submission saved',
      data: result,
    };
  }
}
