import { Controller, Get } from '@nestjs/common';
import { Video } from '@video-stream/interface';
import { PrismaService } from './prisma.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly db: PrismaService) {}

  @Get()
  videos(): Promise<Video[]> {
    return this.db.video.findMany();
  }
}
