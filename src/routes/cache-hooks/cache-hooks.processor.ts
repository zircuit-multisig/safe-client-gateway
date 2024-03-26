import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class BatchProcessingService {
  constructor(@InjectQueue('cache-hooks') private readonly queue: Queue) {}

  @Interval(1000 * 5) // X seconds
  async handleBatch() {}
}
