import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CacheHooksService } from '@/routes/cache-hooks/cache-hooks.service';
import { ValidationPipe } from '@/validation/pipes/validation.pipe';
import { BasicAuthGuard } from '@/routes/common/auth/basic-auth.guard';
import { Event } from '@/routes/cache-hooks/entities/event.entity';
import { PreExecutionLogGuard } from '@/routes/cache-hooks/guards/pre-execution.guard';
import { WebHookSchema } from '@/routes/cache-hooks/entities/schemas/web-hook.schema';
import { ILoggingService, LoggingService } from '@/logging/logging.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Controller({
  path: '',
  version: '1',
})
@ApiExcludeController()
export class CacheHooksController {
  constructor(
    private readonly service: CacheHooksService,
    @Inject(LoggingService) private readonly loggingService: ILoggingService,
    @InjectQueue('cache-hooks') private readonly queue: Queue<Event>,
  ) {}

  @UseGuards(PreExecutionLogGuard, BasicAuthGuard)
  @Post('/hooks/events')
  @HttpCode(202)
  async postEvent(
    @Body(new ValidationPipe(WebHookSchema)) event: Event,
  ): Promise<void> {
    await this.queue.add('test', event);
    this.service.onEvent(event).catch((error) => {
      this.loggingService.error(error);
    });
  }
}
